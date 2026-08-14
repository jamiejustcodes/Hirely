"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Command, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const STREAMING_WORDS = [
  "Engineered", "Next.js", "bundle-splitting", "&", "asset", "lazy", "loading,",
  "slashing", "LCP", "by", "42%", "(3.2s → 1.85s)", "and", "lifting", "checkout",
  "conversion", "by", "$1.4M", "annually."
];

export function CluelyHeroHUD() {
  const [streamIndex, setStreamIndex] = useState(0);
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const [atsScore, setAtsScore] = useState(58);
  const [phase, setPhase] = useState<"listening" | "optimizing" | "completed">("listening");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const runSimulationLoop = () => {
      setPhase("listening");
      setStreamIndex(0);
      setAtsScore(58);
      setIsKeyPressed(false);

      setTimeout(() => {
        setIsKeyPressed(true);
        setTimeout(() => setIsKeyPressed(false), 300);
        setPhase("optimizing");

        let currentWord = 0;
        interval = setInterval(() => {
          if (currentWord < STREAMING_WORDS.length) {
            currentWord++;
            setStreamIndex(currentWord);
            setAtsScore((prev) => Math.min(97, prev + 2));
          } else {
            clearInterval(interval);
            setPhase("completed");
            setTimeout(runSimulationLoop, 4500);
          }
        }, 110);
      }, 2200);
    };

    runSimulationLoop();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      {/* Floating Pristine White Cluely HUD Window */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.12)] p-5 sm:p-6 overflow-hidden text-left">
        {/* Top subtle border reflection */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* HUD Window Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 text-xs">
          {/* Left: Window dots + Live status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
            </div>
            <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-200">
              {/* Undulating audio / parser wave */}
              <div className="flex items-center gap-0.5 h-3.5">
                {[40, 95, 60, 100, 75, 45, 80].map((height, i) => (
                  <span
                    key={i}
                    className="w-0.5 bg-blue-600 rounded-full transition-all duration-300 animate-pulse"
                    style={{
                      height: phase === "listening" ? `${height}%` : "30%",
                      animationDelay: `${i * 140}ms`,
                    }}
                  />
                ))}
              </div>
              <span className="text-[11px] font-mono text-zinc-700 font-medium">
                {phase === "listening"
                  ? "Hirely listening in & parsing role context..."
                  : phase === "optimizing"
                  ? "Streaming STAR quantified rewrite..."
                  : "ATS Filter Passed (97/100 Verified)"}
              </span>
            </div>
          </div>

          {/* Right: Simulated Trigger Badge (Cmd + Enter) */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all duration-300 font-mono text-[11px] font-semibold ${
              isKeyPressed
                ? "bg-zinc-950 text-white border-zinc-950 scale-95 shadow-md"
                : "bg-zinc-100 text-zinc-800 border-zinc-200/90 shadow-2xs"
            }`}
          >
            <Command className="w-3.5 h-3.5 text-blue-600" />
            <span>Enter</span>
          </div>
        </div>

        {/* HUD Content Area */}
        <div className="pt-3.5 space-y-3.5">
          {/* Target input question/prompt */}
          <div className="flex items-start gap-2.5 text-left">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 flex-shrink-0 mt-0.5">
              ORIGINAL BULLET
            </span>
            <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
              &ldquo;Helped improve page load times by optimizing bundle sizes and implementing lazy loading.&rdquo;
            </p>
          </div>

          {/* Live AI Streaming STAR response */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/90 relative overflow-hidden space-y-1.5 text-left shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-600 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INSTANT STAR REWRITE</span>
              </div>

              {/* Dynamic Live Score Badge */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-zinc-500 font-medium">ATS Match:</span>
                <span
                  className={`font-bold transition-colors duration-300 ${
                    atsScore >= 85
                      ? "text-emerald-700"
                      : atsScore >= 70
                      ? "text-blue-700"
                      : "text-amber-700"
                  }`}
                >
                  {atsScore} / 100
                </span>
                {phase === "completed" && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 animate-fadeIn" />
                )}
              </div>
            </div>

            {/* Token-by-token stream */}
            <div className="min-h-[42px] text-xs sm:text-sm font-sans text-zinc-950 leading-relaxed pt-1">
              {phase === "listening" ? (
                <span className="text-zinc-400 italic">
                  Pressing ⌘ + Enter to inject quantifiable latency and revenue metrics...
                </span>
              ) : (
                <p>
                  &ldquo;
                  {STREAMING_WORDS.slice(0, streamIndex).map((word, idx) => {
                    const isMetric =
                      word.includes("42%") ||
                      word.includes("$1.4M") ||
                      word.includes("slashing") ||
                      word.includes("Next.js");
                    return (
                      <span
                        key={idx}
                        className={`token-stream mr-1 ${
                          isMetric
                            ? "text-emerald-700 font-bold underline decoration-emerald-500/40"
                            : "text-zinc-950 font-medium"
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                  {phase === "optimizing" && (
                    <span className="inline-block w-1.5 h-4 ml-0.5 bg-blue-600 animate-blink align-middle" />
                  )}
                  {phase === "completed" && <span>&rdquo;</span>}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
