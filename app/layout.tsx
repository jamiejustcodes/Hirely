import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hirely — Undetectable AI Resume Optimizer & ATS Scanner",
  description:
    "AI meeting and resume assistant that beats the ATS algorithm before recruiters review. Instant keyword gap analysis, STAR bullet rewrites, and 100% single-column parsability.",
  keywords: [
    "ATS Scanner",
    "Resume Optimizer",
    "AI Resume Reviewer",
    "CV Parser",
    "Applicant Tracking System",
    "STAR Method Rewriter",
    "Hirely",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}
    >
      <body className="bg-white text-zinc-950 font-sans antialiased min-h-screen selection:bg-blue-500/15 selection:text-zinc-900">
        {children}
      </body>
    </html>
  );
}
