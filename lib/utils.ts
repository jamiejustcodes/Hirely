import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
 * Normalizes raw extracted text from PDFs and messy formats by:
 * 1. Unifying all bullet characters (•, -, *, unicode bullets) to standard "•".
 * 2. Fixing isolated bullet lines (e.g. a line containing ONLY "•" followed by text on the next line).
 * 3. Joining mid-sentence line breaks within the same bullet point into a single, complete sentence.
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
 * Handles exact matching, partial matching, multi-line blocks, and cleans up any trailing fragments.
 */
export function replaceBulletBlock(
  content: string,
  original: string,
  improved: string
): string {
  if (!content) return "";

  // Normalize document and inputs first
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
