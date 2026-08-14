"use client";

import React from "react";
import { motion } from "framer-motion";
import { formatScoreGrade } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export function ScoreGauge({
  score,
  size = 140,
  strokeWidth = 10,
  showLabel = true,
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const grade = formatScoreGrade(score);

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-800/80"
          />
          {/* Animated fill circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
          {/* Gradients */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor={score >= 80 ? "#10b981" : "#ec4899"} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight"
          >
            {score}
          </motion.span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            ATS Match
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${grade.bg} ${grade.color} ${grade.border}`}
          >
            {grade.label}
          </span>
        </div>
      )}
    </div>
  );
}
