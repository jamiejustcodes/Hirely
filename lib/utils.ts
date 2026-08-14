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
 * Normalizes raw extracted text from PDFs by:
 * 1. Attaching isolated bullet points ("•" on its own line) to the next line.
 * 2. Merging wrapped lines within the same bullet point into a single continuous sentence.
 */
export function normalizeResumeText(raw: string): string {
  if (!raw) return "";
  const lines = raw.split(/\r?\n/);
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (result.length > 0 && result[result.length - 1] !== "") {
        result.push("");
      }
      continue;
    }

    // Isolated bullet point (e.g. "•" or "-" or "*" on its own line)
    if (result.length > 0 && /^[•\-\*]$/.test(result[result.length - 1].trim())) {
      result[result.length - 1] = `${result[result.length - 1].trim()} ${line}`;
      continue;
    }

    // Check if line is a new section or standalone item
    const isHeaderOrSection =
      /^(EXPERIENCE|EDUCATION|SKILLS|SUMMARY|PROJECTS|CERTIFICATIONS|WORK HISTORY|PROFESSIONAL EXPERIENCE)/i.test(
        line
      ) ||
      /^[A-Z\s]{4,}:?$/.test(line) ||
      /\b(19|20)\d{2}\b/.test(line);

    const isNewBullet = /^[•\-\*]/.test(line);

    // If previous line was a bullet and this line is a continuation (not a new bullet or section)
    if (
      result.length > 0 &&
      result[result.length - 1].trim().length > 0 &&
      !isNewBullet &&
      !isHeaderOrSection &&
      /^[•\-\*]/.test(result[result.length - 1].trim())
    ) {
      result[result.length - 1] = `${result[result.length - 1].trim()} ${line}`;
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

/**
 * Robust replacement for multi-line / wrapped bullet points.
 * Finds the entire bullet block (from starting bullet symbol to continuation lines)
 * and cleanly drops in the new improved STAR sentence without leaving any trailing fragments.
 */
export function replaceBulletBlock(
  content: string,
  original: string,
  improved: string
): string {
  if (!content) return "";
  const cleanOriginal = original.replace(/^["'•\-* ]+/, "").trim();
  const cleanImproved = improved.replace(/^["']|["']$/g, "").trim();

  // 1. Direct exact match
  if (content.includes(original)) {
    return content.replace(original, cleanImproved);
  }
  if (content.includes(cleanOriginal)) {
    return content.replace(cleanOriginal, cleanImproved);
  }

  // 2. Multi-line bullet block matching
  const lines = content.split("\n");
  const searchSnippet = cleanOriginal.slice(0, 25).toLowerCase();

  let matchStartIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(searchSnippet)) {
      matchStartIdx = i;
      break;
    }
  }

  if (matchStartIdx !== -1) {
    const firstLine = lines[matchStartIdx];
    const prefixMatch = firstLine.match(/^(\s*[•\-\*]\s*)/);
    const prefix = prefixMatch ? prefixMatch[1] : "• ";

    // Find the full extent of this bullet block (consume continuation lines)
    let matchEndIdx = matchStartIdx;
    while (
      matchEndIdx + 1 < lines.length &&
      lines[matchEndIdx + 1].trim() !== "" &&
      !/^[•\-\*]/.test(lines[matchEndIdx + 1].trim()) &&
      !/^(EXPERIENCE|EDUCATION|SKILLS|SUMMARY|PROJECTS)/i.test(lines[matchEndIdx + 1].trim()) &&
      !/^[A-Z\s]{4,}:?$/.test(lines[matchEndIdx + 1].trim())
    ) {
      matchEndIdx++;
    }

    // Replace the entire block [matchStartIdx ... matchEndIdx]
    const replacement = `${prefix}${cleanImproved.replace(/^[•\-\*]\s*/, "")}`;
    lines.splice(matchStartIdx, matchEndIdx - matchStartIdx + 1, replacement);
    return lines.join("\n");
  }

  // Fallback: append cleanly
  return `${content}\n\n• ${cleanImproved.replace(/^[•\-\*]\s*/, "")}`;
}
