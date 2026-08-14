import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeWithGemini } from "@/lib/gemini";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let resumeText = "";
    let jobDescription = "";
    let apiKey = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      jobDescription = (formData.get("jobDescription") as string) || "";
      apiKey = (formData.get("apiKey") as string) || "";
      const textParam = (formData.get("resumeText") as string) || "";

      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        if (file.name.endsWith(".pdf")) {
          try {
            const pdfData = await pdfParse(buffer);
            resumeText = pdfData.text;
          } catch (pdfErr) {
            console.error("PDF parse error:", pdfErr);
            return NextResponse.json(
              { error: "Could not parse PDF text. Please paste text directly or upload a clean PDF." },
              { status: 400 }
            );
          }
        } else {
          // Plain text / markdown
          resumeText = buffer.toString("utf-8");
        }
      } else if (textParam.trim()) {
        resumeText = textParam.trim();
      }
    } else {
      try {
        const body = await req.json();
        resumeText = body?.resumeText || "";
        jobDescription = body?.jobDescription || "";
        apiKey = body?.apiKey || "";
      } catch {
        try {
          const rawText = await req.text();
          const parsed = JSON.parse(rawText);
          resumeText = parsed.resumeText || "";
          jobDescription = parsed.jobDescription || "";
          apiKey = parsed.apiKey || "";
        } catch {
          // Fallback if raw text
          resumeText = "";
        }
      }
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return NextResponse.json(
        { error: "Resume content is too short or empty. Please provide at least 20 characters of resume text." },
        { status: 400 }
      );
    }

    const scanResult = await analyzeResumeWithGemini(resumeText, jobDescription, apiKey);

    return NextResponse.json({
      success: true,
      data: scanResult,
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
