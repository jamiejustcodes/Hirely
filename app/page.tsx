"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CluelyStepSlider } from "@/components/CluelyStepSlider";
import { FeatureScrollSpy } from "@/components/FeatureScrollSpy";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { SAMPLE_DATA } from "@/lib/mockData";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async (
    resumeText: string,
    jobDesc: string,
    file: File | null
  ) => {
    setIsLoading(true);

    try {
      const textToUse = resumeText || SAMPLE_DATA.softwareEngineer.resumeText;
      const jdToUse = jobDesc || SAMPLE_DATA.softwareEngineer.jobDescription;
      const docName = file ? file.name : "Marcus_Vance_Staff_Engineer_Resume.pdf";

      if (typeof window !== "undefined") {
        sessionStorage.setItem("HIRELY_SCAN_TEXT", textToUse);
        sessionStorage.setItem("HIRELY_SCAN_JD", jdToUse);
        sessionStorage.setItem("HIRELY_SCAN_DOC_NAME", docName);
      }

      // Navigate to dedicated GPTZero-style studio page
      router.push("/scan");
    } catch (err) {
      console.error("Scan redirect error:", err);
      router.push("/scan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenScannerDirect = () => {
    if (typeof window !== "undefined") {
      const sample = SAMPLE_DATA.softwareEngineer;
      sessionStorage.setItem("HIRELY_SCAN_TEXT", sample.resumeText);
      sessionStorage.setItem("HIRELY_SCAN_JD", sample.jobDescription);
      sessionStorage.setItem("HIRELY_SCAN_DOC_NAME", "Marcus_Vance_Staff_Engineer_Resume.pdf");
      sessionStorage.setItem("HIRELY_SCAN_RESULT", JSON.stringify(sample.mockResult));
    }
    router.push("/scan");
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950 flex flex-col selection:bg-blue-500/20 selection:text-zinc-950">
      {/* Sleek Cluely White Minimalist Navbar */}
      <Navbar onOpenScanner={handleOpenScannerDirect} />

      {/* Ultra-Clean Hero Section with Full-Bleed Scenic Backdrop and Vibe Input */}
      <Hero onScan={handleScan} isLoading={isLoading} />

      {/* Cluely 3-Step Auto-Progressing Workflow Timeline */}
      <CluelyStepSlider />

      {/* Feature Deep Dive with Spotlight Cards */}
      <FeatureScrollSpy onTryDemo={handleOpenScannerDirect} />

      {/* Candidate Stories on White Canvas */}
      <Testimonials />

      {/* FAQ in Clean White Accordions */}
      <Faq />

      {/* White Minimalist Footer */}
      <Footer onOpenScanner={handleOpenScannerDirect} />
    </main>
  );
}
