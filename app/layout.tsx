import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hirely.ai"),
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
    "Workday ATS",
    "Taleo ATS",
    "Greenhouse ATS",
  ],
  authors: [{ name: "Hirely AI" }],
  openGraph: {
    title: "Hirely — Undetectable AI Resume Optimizer & ATS Scanner",
    description:
      "Beat the ATS algorithm before recruiters review. Free AI resume scanner, keyword gap matrix, and Google STAR rewrites.",
    url: "https://hirely.ai",
    siteName: "Hirely ATS Studio",
    images: [
      {
        url: "/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hirely ATS Resume Optimizer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hirely — Undetectable AI Resume Optimizer & ATS Scanner",
    description:
      "Instant keyword gap analysis, Google XYZ bullet rewrites, and 100% single-column ATS parsability.",
    images: ["/hero-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/hirleyweblogo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/hirleyweblogo.png",
    apple: "/hirleyweblogo.png",
  },
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
