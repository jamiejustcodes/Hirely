import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeWithGemini } from "@/lib/gemini";
import { normalizeResumeText } from "@/lib/utils";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let resumeText = "";
    let jobDescription = "";
    let apiKey = "";
    let fileName = "Uploaded_Resume.pdf";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      jobDescription = (formData.get("jobDescription") as string) || "";
      apiKey = (formData.get("apiKey") as string) || "";
      const textParam = (formData.get("resumeText") as string) || "";

      if (file && file.size > 0) {
        fileName = file.name || "Uploaded_Resume.pdf";
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const lowerName = (file.name || "").toLowerCase();
        const mimeType = (file.type || "").toLowerCase();

        // Check magic bytes
        const isPdfMagic = buffer.length >= 5 && buffer.subarray(0, 5).toString("latin1") === "%PDF-";
        const isZipMagic = buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
        const isPdf = isPdfMagic || lowerName.endsWith(".pdf") || mimeType.includes("pdf");
        const isDocx = isZipMagic || lowerName.endsWith(".docx") || lowerName.endsWith(".doc") || mimeType.includes("word") || mimeType.includes("officedocument");

        if (isPdf) {
          try {
            const pdfData = await pdfParse(buffer);
            if (pdfData.text && pdfData.text.trim().length >= 15) {
              resumeText = normalizeResumeText(pdfData.text);
            } else {
              throw new Error("Extracted text was too short, attempting fallback stream extraction");
            }
          } catch (pdfErr) {
            console.warn("Primary pdf-parse failed, attempting stream extraction fallback:", pdfErr);
            // Fallback: Extract text from uncompressed PDF text blocks (Tj / TJ / BT ... ET)
            try {
              const rawString = buffer.toString("latin1");
              const textChunks: string[] = [];
              
              // Match text inside (...) Tj
              const tjRegex = /\(([^)]+)\)\s*Tj/g;
              let tjMatch;
              while ((tjMatch = tjRegex.exec(rawString)) !== null) {
                textChunks.push(tjMatch[1]);
              }

              // Match array text inside [...] TJ
              const arrayTjRegex = /\[([^\]]+)\]\s*TJ/g;
              let arrayMatch;
              while ((arrayMatch = arrayTjRegex.exec(rawString)) !== null) {
                const inner = arrayMatch[1];
                const innerStrings = inner.match(/\(([^)]+)\)/g);
                if (innerStrings) {
                  textChunks.push(innerStrings.map(s => s.slice(1, -1)).join(""));
                }
              }

              if (textChunks.length > 0) {
                const recovered = textChunks.join(" ");
                if (recovered.trim().length >= 15) {
                  resumeText = normalizeResumeText(recovered);
                }
              }
            } catch (fallbackErr) {
              console.error("PDF stream fallback error:", fallbackErr);
            }

            if (!resumeText || resumeText.trim().length < 15) {
              return NextResponse.json(
                { error: "Could not extract text from this PDF. If this is a scanned image or photo of a resume, please upload a text-based PDF / DOCX or paste the text directly." },
                { status: 400 }
              );
            }
          }
        } else if (isDocx) {
          try {
            const docxResult = await mammoth.extractRawText({ buffer });
            resumeText = normalizeResumeText(docxResult.value);
          } catch (docxErr) {
            console.error("DOCX parse error:", docxErr);
            return NextResponse.json(
              { error: "Could not extract text from Word document. Please ensure the file is a valid .docx document or paste text directly." },
              { status: 400 }
            );
          }
        } else {
          // Plain text / Markdown / UTF-8
          resumeText = normalizeResumeText(buffer.toString("utf-8"));
        }
      } else if (textParam.trim()) {
        resumeText = normalizeResumeText(textParam.trim());
      }
    } else {
      try {
        const body = await req.json();
        resumeText = normalizeResumeText(body?.resumeText || "");
        jobDescription = body?.jobDescription || "";
        apiKey = body?.apiKey || "";
        if (body?.documentName) fileName = body.documentName;
      } catch {
        const rawText = await req.text();
        try {
          const parsed = JSON.parse(rawText);
          resumeText = normalizeResumeText(parsed.resumeText || "");
          jobDescription = parsed.jobDescription || "";
          apiKey = parsed.apiKey || "";
        } catch {
          resumeText = "";
        }
      }
    }

    if (!resumeText || resumeText.trim().length < 15) {
      return NextResponse.json(
        { error: "Resume content is too short or empty. Please provide at least 15 characters of resume text or upload a valid file." },
        { status: 400 }
      );
    }

    // IP Rate Limiting: 3 submissions per IP per calendar day
    const clientIp = getClientIp(req);
    const hasCustomKey = Boolean(apiKey && apiKey.trim().length > 10);
    
    // Check rate limit (custom API keys bypass the public IP rate limit)
    const rateLimit = checkRateLimit(clientIp, 3);

    if (!hasCustomKey && !rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Daily scan limit reached. Your IP address has submitted the maximum of 3 free resume scans for today. Please try again tomorrow, or add your own personal Gemini API key in Studio settings to continue scanning.",
          rateLimited: true,
          limit: rateLimit.limit,
          remaining: 0,
          resetAt: rateLimit.resetDateString,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetAt.toString(),
            "Retry-After": "86400",
          },
        }
      );
    }

    // Call live Gemini engine
    const scanResult = await analyzeResumeWithGemini(resumeText, jobDescription, apiKey);

    return NextResponse.json(
      {
        success: true,
        data: scanResult,
        extractedText: resumeText,
        documentName: fileName,
        rateLimit: {
          limit: rateLimit.limit,
          remaining: hasCustomKey ? "unlimited" : rateLimit.remaining,
          resetAt: rateLimit.resetDateString,
        },
        meta: {
          analyzedAt: new Date().toISOString(),
          characterCount: resumeText.length,
        },
      },
      {
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": hasCustomKey ? "unlimited" : rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetAt.toString(),
        },
      }
    );
  } catch (error: any) {
    console.error("Error processing ATS scan request:", error);
    return NextResponse.json(
      {
        error: error?.message || "An unexpected error occurred while scanning your resume.",
      },
      { status: 500 }
    );
  }
}
