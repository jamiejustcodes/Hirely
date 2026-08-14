import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ATSScanResult } from "./mockData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScoreGrade(score: number): {
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  if (score >= 85) {
    return {
      label: "Excellent (ATS Ready)",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    };
  }
  if (score >= 70) {
    return {
      label: "Good (Minor Gaps)",
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
    };
  }
  if (score >= 50) {
    return {
      label: "Needs Improvement",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
    };
  }
  return {
    label: "Critical ATS Risk",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
  };
}

/**
 * Common resume buzzwords/clichés and their active power-verb replacements.
 */
export const BUZZWORD_MAP: Record<string, { replacement: string; reason: string }> = {
  "results-driven": { replacement: "Generated $X / lifted metric by Y%", reason: "Overused cliché. Replace with concrete quantifiable outcomes." },
  "results oriented": { replacement: "Delivered X% increase in Y", reason: "Passive phrase. State the specific business outcome achieved." },
  "team player": { replacement: "Collaborated cross-functionally with X engineers", reason: "Vague trait. Quantify team size and cross-functional partners." },
  "hard worker": { replacement: "Spearheaded / Accelerated", reason: "Subjective filler. Demonstrate work through speed or project velocity." },
  "hard-working": { replacement: "Delivered X milestones ahead of schedule", reason: "Show, don't tell. Quantify execution reliability." },
  "go-getter": { replacement: "Initiated / Pioneered", reason: "Informal jargon. Use executive leadership verbs." },
  "detail-oriented": { replacement: "Maintained 99.9% accuracy / zero regression SLA", reason: "Quantify precision with SLAs, uptime, or error reduction." },
  "detail oriented": { replacement: "Reduced production defects by X%", reason: "Quantify quality assurance with error reduction numbers." },
  "synergy": { replacement: "Cross-functional integration / alignment", reason: "Corporate buzzword. Specify the operational alignment." },
  "dynamic": { replacement: "High-throughput / adaptable", reason: "Vague adjective. Describe the scale or environment explicitly." },
  "thought leader": { replacement: "Authored technical RFC / Mentored X engineers", reason: "Unverifiable claim. State concrete mentorship or publications." },
  "worked on": { replacement: "Architected / Engineered / Spearheaded", reason: "Weak action verb. Leads to low ATS ranking score." },
  "helped with": { replacement: "Co-authored / Implemented / Accelerated", reason: "Minimizes ownership. Claim your exact technical contribution." },
  "responsible for": { replacement: "Owned end-to-end / Orchestrated", reason: "Passive duty list. Frame as measurable achievement." },
  "assisted in": { replacement: "Deployed / Developed", reason: "Undersells impact. Highlight your active execution." },
};

/**
 * Finds occurrences of buzzwords/clichés in a line of resume text.
 */
export function findBuzzwordsInText(text: string): Array<{ word: string; replacement: string; reason: string }> {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matches: Array<{ word: string; replacement: string; reason: string }> = [];

  for (const [buzzword, info] of Object.entries(BUZZWORD_MAP)) {
    const regex = new RegExp(`\\b${buzzword}\\b`, "i");
    if (regex.test(lower)) {
      matches.push({ word: buzzword, ...info });
    }
  }

  return matches;
}

/**
 * Normalizes raw extracted text from PDFs and messy formats
 */
export function normalizeResumeText(raw: string): string {
  if (!raw) return "";

  // 1. Unify all bullet variants (\u2022, \u2023, \u25E6, \u25CF, \u25CB, \u25A0, \u00B7, \u2043, \u2219)
  let text = raw.replace(/[\u2022\u2023\u25E6\u25CF\u25CB\u25A0\u00B7\u2043\u2219]/g, "•");

  // 2. Fix isolated bullets on their own line: "•\nText" -> "• Text"
  text = text.replace(/^[ \t]*•[ \t]*\r?\n[ \t]*/gm, "• ");
  text = text.replace(/^[ \t]*[-*][ \t]*\r?\n[ \t]*/gm, "• ");

  // 3. Process line by line to glue continuation lines
  const rawLines = text.split(/\r?\n/);
  const cleanLines: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const current = rawLines[i].trim();
    if (!current) {
      if (cleanLines.length > 0 && cleanLines[cleanLines.length - 1] !== "") {
        cleanLines.push("");
      }
      continue;
    }

    // Check if previous line is a bullet item that should absorb this line
    const prev = cleanLines.length > 0 ? cleanLines[cleanLines.length - 1] : "";
    const prevIsBullet = prev.trim().startsWith("•") || prev.trim().startsWith("-");
    const currentIsBullet = current.startsWith("•") || current.startsWith("-") || current.startsWith("*");
    const currentIsSectionHeader =
      /^[A-Z\s]{4,}:?$/.test(current) ||
      /^(EXPERIENCE|EDUCATION|SKILLS|SUMMARY|PROJECTS|CERTIFICATIONS|WORK HISTORY|PROFESSIONAL EXPERIENCE|SUMMARY OF QUALIFICATIONS|WORK EXPERIENCE)/i.test(
        current
      ) ||
      /\b(19|20)\d{2}\s*[-–—]\s*(Present|\b(19|20)\d{2}\b)/i.test(current);

    if (prevIsBullet && !currentIsBullet && !currentIsSectionHeader) {
      cleanLines[cleanLines.length - 1] = `${prev.trim()} ${current}`;
    } else {
      cleanLines.push(current);
    }
  }

  return cleanLines.join("\n");
}

/**
 * Replaces a bullet point in the resume document with the improved STAR version.
 */
export function replaceBulletBlock(
  content: string,
  original: string,
  improved: string
): string {
  if (!content) return "";

  const normDoc = normalizeResumeText(content);
  const cleanOriginal = original.replace(/^["'•\-* ]+/, "").trim();
  const cleanImproved = improved.replace(/^["'•\-* ]+|["']$/g, "").trim();

  // 1. Direct exact replace in normalized document
  if (normDoc.includes(cleanOriginal)) {
    return normDoc.replace(cleanOriginal, cleanImproved);
  }

  // 2. Fuzzy snippet match on lines
  const lines = normDoc.split("\n");
  const searchSnippet = cleanOriginal.slice(0, 25).toLowerCase();

  let matchIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const lineClean = lines[i].replace(/^["'•\-* ]+/, "").trim().toLowerCase();
    if (lineClean.includes(searchSnippet) || searchSnippet.includes(lineClean.slice(0, 25))) {
      matchIndex = i;
      break;
    }
  }

  if (matchIndex !== -1) {
    const oldLine = lines[matchIndex];
    const prefixMatch = oldLine.match(/^(\s*[•\-\*]\s*)/);
    const prefix = prefixMatch ? prefixMatch[1] : "• ";
    lines[matchIndex] = `${prefix}${cleanImproved}`;
    return lines.join("\n");
  }

  // Fallback: append
  return `${normDoc}\n\n• ${cleanImproved}`;
}

/**
 * Exports document content as a clean printable ATS PDF (via browser print window).
 */
export function exportToPrintablePDF(content: string, documentName: string = "Optimized_Resume") {
  if (typeof window === "undefined") return;
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export as PDF.");
    return;
  }

  const lines = normalizeResumeText(content).split("\n");
  const formattedHtml = lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return `<div style="height: 10px;"></div>`;
      if (/^[A-Z\s]{4,}:?$/.test(trimmed) || /^(EXPERIENCE|EDUCATION|SKILLS|SUMMARY|PROJECTS|CERTIFICATIONS|WORK HISTORY)/i.test(trimmed)) {
        return `<h2 style="font-size: 13pt; font-weight: bold; border-bottom: 1.5px solid #222; margin-top: 14px; margin-bottom: 6px; text-transform: uppercase; color: #111; letter-spacing: 0.5px;">${trimmed}</h2>`;
      }
      if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const text = trimmed.replace(/^[•\-\*]\s*/, "");
        return `<p style="margin: 3px 0 3px 18px; font-size: 10pt; line-height: 1.45; text-indent: -12px; color: #222;">• ${text}</p>`;
      }
      return `<p style="margin: 4px 0; font-size: 10pt; line-height: 1.45; color: #222;">${trimmed}</p>`;
    })
    .join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${documentName}</title>
        <style>
          @page { size: letter; margin: 0.75in; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111; margin: 0; padding: 20px; font-size: 10pt; line-height: 1.45; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="background: #f4f4f5; padding: 12px 20px; border-bottom: 1px solid #e4e4e7; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; font-family: sans-serif;">
          <span style="font-size: 13px; font-weight: 600; color: #18181b;">Hirely ATS-Optimized Clean PDF Preview</span>
          <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer;">Save as PDF / Print</button>
        </div>
        <div>
          ${formattedHtml}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Exports document content as a standard Word document (.doc formatted text).
 */
export function exportToWordDoc(content: string, documentName: string = "Optimized_Resume") {
  if (typeof window === "undefined") return;
  const normDoc = normalizeResumeText(content);
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${documentName}</title>
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.35; color: #111111; }
      h1, h2, h3 { font-family: Calibri, Arial, sans-serif; color: #000000; }
      p { margin: 4pt 0; }
    </style>
    </head>
    <body>
      ${normDoc.split("\n").map(l => `<p>${l || "&nbsp;"}</p>`).join("")}
    </body>
    </html>
  `;
  const blob = new Blob(["\ufeff", htmlContent], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${documentName.replace(/\.[^/.]+$/, "")}_ATS_Optimized.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Generates and opens a printable ATS Audit Report Card for the candidate.
 */
export function exportATSAuditReport(result: ATSScanResult, documentName: string = "Resume") {
  if (typeof window === "undefined") return;
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export the ATS report.");
    return;
  }

  const benchmark = result.industryBenchmark;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hirely ATS Diagnostic Report — ${documentName}</title>
        <style>
          @page { size: letter; margin: 0.6in; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #09090b; margin: 0; padding: 24px; font-size: 10pt; line-height: 1.5; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .score-box { background: #f0f9ff; border: 1px solid #bae6fd; padding: 16px; border-radius: 12px; margin-bottom: 18px; display: flex; gap: 20px; align-items: center; }
          .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 18px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; text-align: center; }
          .card-value { font-size: 16pt; font-weight: bold; color: #2563eb; }
          .section-title { font-size: 11pt; font-weight: bold; color: #0f172a; margin-top: 16px; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="background: #f4f4f5; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; font-size: 12px;">Hirely ATS Executive Audit Report</span>
          <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">Print / Save PDF</button>
        </div>

        <div class="header">
          <div>
            <h1 style="margin: 0; font-size: 16pt; color: #09090b;">Hirely ATS Diagnostic Report</h1>
            <p style="margin: 2px 0 0; color: #64748b; font-size: 9pt;">Document: <strong>${documentName}</strong> • Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          <div style="text-align: right;">
            <span style="background: #2563eb; color: white; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 11pt;">Score: ${result.overallScore}/100</span>
          </div>
        </div>

        <div class="score-box">
          <div>
            <h3 style="margin: 0 0 4px; font-size: 12pt; color: #0369a1;">ATS Readiness: ${result.grade}</h3>
            <p style="margin: 0; color: #334155; font-size: 9.5pt;">${result.summary}</p>
          </div>
        </div>

        <div class="grid">
          <div class="card"><div style="font-size: 8pt; color: #64748b;">Keyword Match</div><div class="card-value">${result.categoryScores?.keywordMatch || 84}%</div></div>
          <div class="card"><div style="font-size: 8pt; color: #64748b;">Hard Skills</div><div class="card-value">${result.categoryScores?.hardSkills || 88}%</div></div>
          <div class="card"><div style="font-size: 8pt; color: #64748b;">Soft Skills</div><div class="card-value">${result.categoryScores?.softSkills || 80}%</div></div>
          <div class="card"><div style="font-size: 8pt; color: #64748b;">Formatting</div><div class="card-value">${result.categoryScores?.formatting || 95}%</div></div>
          <div class="card"><div style="font-size: 8pt; color: #64748b;">STAR Impact</div><div class="card-value">${result.categoryScores?.impactAndMetrics || 70}%</div></div>
        </div>

        ${benchmark ? `
          <div class="section-title">Top 1% Industry Benchmark (${benchmark.detectedProfession})</div>
          <p style="font-size: 9pt; color: #475569; margin: 4px 0 10px;">Seniority Rank: <strong>${benchmark.seniorityLevel}</strong> (Ranked in Top ${100 - benchmark.industryPercentile}% of applicants)</p>
          <ul style="font-size: 9pt; color: #334155; padding-left: 18px; margin: 4px 0;">
            ${benchmark.topTierStandards?.map(std => `<li>${std}</li>`).join("")}
          </ul>
        ` : ""}

        <div class="section-title">Critical Keyword Gaps</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;">
          ${result.keywords?.missing?.map(k => `<span style="background: #ffe4e6; color: #9f1239; border: 1px solid #fecdd3; padding: 2px 8px; border-radius: 4px; font-size: 8.5pt; font-weight: 600;">+ ${k.name}</span>`).join("") || "<span>No critical gaps detected</span>"}
        </div>

        <div class="section-title">Priority Action Plan</div>
        <ol style="font-size: 9pt; color: #334155; padding-left: 18px; margin: 6px 0;">
          ${result.actionPlan?.map(a => `<li>${a}</li>`).join("")}
        </ol>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
