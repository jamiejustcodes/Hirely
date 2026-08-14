import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeWithGemini } from "@/lib/gemini";
import { normalizeResumeText } from "@/lib/utils";
import pdfParse from "pdf-parse";

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
        fileName = file.name;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        if (file.name.toLowerCase().endsWith(".pdf")) {
          try {
            const pdfData = await pdfParse(buffer);
            resumeText = normalizeResumeText(pdfData.text);
          } catch (pdfErr) {
            console.error("PDF parse error:", pdfErr);
            return NextResponse.json(
              { error: "Could not extract text from PDF. Please ensure the PDF is not password-protected." },
              { status: 400 }
            );
          }
        } else {
          // Plain text / markdown
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

    // Call live Gemini engine
    const scanResult = await analyzeResumeWithGemini(resumeText, jobDescription, apiKey);

    return NextResponse.json({
      success: true,
      data: scanResult,
      extractedText: resumeText,
      documentName: fileName,
      meta: {
        analyzedAt: new Date().toISOString(),
        characterCount: resumeText.length,
      },
    });
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
