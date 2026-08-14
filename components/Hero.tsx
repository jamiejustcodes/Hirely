"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VibeInputBox } from "./VibeInputBox";

interface HeroProps {
  onScan: (resumeText: string, jobDesc: string, file: File | null) => void;
  isLoading?: boolean;
}

const TYPING_PHRASES = [
  "Reverse-engineering Workday, Taleo & Greenhouse screening filters...",
  "Transform passive bullets into quantified STAR achievements...",
  "Instant keyword gap matrix and 0-bot single column ATS compliance...",
  "Auditing candidate ranking metrics with Google Gemini 2.5 Flash...",
];

export function Hero({ onScan, isLoading = false }: HeroProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullPhrase = TYPING_PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 25 : 50;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentFullPhrase.length) {
          setCurrentText(currentFullPhrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentFullPhrase.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center overflow-hidden"
    >
      {/* 1. Full-Bleed Panoramic Mountain Background Taking Up Entire Screen */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <img
          src="/hero-image.jpg"
          alt="Atmospheric Mountain Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft atmospheric overlay */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      {/* 2. Hero Content Container with Staggered Entrance */}
      <div className="relative z-10 max-w-5xl w-full mx-auto text-center space-y-6">
        {/* Pure White Bold Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold text-white tracking-tight leading-[1.08] max-w-4xl mx-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
        >
          AI that beats the ATS algorithm{" "}
          <span className="bg-gradient-to-r from-blue-200 via-sky-200 to-indigo-100 bg-clip-text text-transparent drop-shadow-none">
            before recruiters review.
          </span>
        </motion.h1>

        {/* Subheading with Typing Cursor in Pure White / Soft Ice Blue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="min-h-[28px] flex items-center justify-center"
        >
          <p className="text-sm sm:text-lg text-white/95 font-sans font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <span>{currentText}</span>
            <span className="inline-block w-0.5 h-4 ml-1 bg-white animate-blink align-middle" />
          </p>
        </motion.div>

        {/* 3. Vibe Input Command Center (Primary Hero Action) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="pt-2"
        >
          <VibeInputBox onScan={onScan} isLoading={isLoading} />
        </motion.div>
      </div>
    </section>
  );
}
