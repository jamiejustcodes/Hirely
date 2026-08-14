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
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    };
  }
  if (score >= 70) {
    return {
      label: "Good (Minor Gaps)",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
    };
  }
  if (score >= 50) {
    return {
      label: "Needs Improvement",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    };
  }
  return {
    label: "Critical ATS Risk",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
  };
}
