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
      let savedKey = "";
      if (typeof window !== "undefined") {
        savedKey = localStorage.getItem("HIRELY_GEMINI_API_KEY") || "";
      }

      // If file was attached, process through /api/scan to parse PDF and analyze
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("jobDescription", jobDesc);
        formData.append("resumeText", resumeText);
        if (savedKey) formData.append("apiKey", savedKey);

        const response = await fetch("/api/scan", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const json = await response.json();
          if (typeof window !== "undefined") {
            sessionStorage.setItem("HIRELY_SCAN_TEXT", json.extractedText || resumeText);
            sessionStorage.setItem("HIRELY_SCAN_JD", jobDesc);
            sessionStorage.setItem("HIRELY_SCAN_DOC_NAME", json.documentName || file.name);
            sessionStorage.setItem("HIRELY_SCAN_RESULT", JSON.stringify(json.data));
          }
          router.push("/scan");
          return;
        }
      }

      // Fallback for direct text input
      const textToUse = resumeText || SAMPLE_DATA.softwareEngineer.resumeText;
      const jdToUse = jobDesc || SAMPLE_DATA.softwareEngineer.jobDescription;
      const docName = file ? file.name : "My_Resume.pdf";

      if (typeof window !== "undefined") {
        sessionStorage.setItem("HIRELY_SCAN_TEXT", textToUse);
        sessionStorage.setItem("HIRELY_SCAN_JD", jdToUse);
        sessionStorage.setItem("HIRELY_SCAN_DOC_NAME", docName);
        sessionStorage.removeItem("HIRELY_SCAN_RESULT"); // Force fresh scan on /scan
      }

      router.push("/scan");
    } catch (err) {
      console.error("Scan redirect error:", err);
      router.push("/scan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950 flex flex-col selection:bg-blue-500/20 selection:text-zinc-950">
      {/* Sleek Minimalist Navbar */}
      <Navbar />

      {/* Ultra-Clean Hero Section with Full-Bleed Scenic Backdrop and Vibe Input */}
      <Hero onScan={handleScan} isLoading={isLoading} />

      {/* 3-Step Auto-Progressing Workflow Timeline */}
      <CluelyStepSlider />

      {/* Feature Deep Dive with Spotlight Cards */}
      <FeatureScrollSpy />

      {/* Candidate Stories on White Canvas */}
      <Testimonials />

      {/* FAQ in Clean White Accordions */}
      <Faq />

      {/* Minimalist Footer */}
      <Footer />
    </main>
  );
}
