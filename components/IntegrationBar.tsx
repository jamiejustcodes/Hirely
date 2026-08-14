"use client";

import React from "react";
import { Share2, Shield } from "lucide-react";
import { motion } from "framer-motion";

export function IntegrationBar() {
  const atsSystems = [
    { name: "Workday", color: "hover:border-amber-400 hover:text-amber-600" },
    { name: "Greenhouse", color: "hover:border-emerald-400 hover:text-emerald-600" },
    { name: "Taleo", color: "hover:border-blue-400 hover:text-blue-600" },
    { name: "Lever", color: "hover:border-indigo-400 hover:text-indigo-600" },
    { name: "Ashby", color: "hover:border-purple-400 hover:text-purple-600" },
    { name: "iCIMS", color: "hover:border-cyan-400 hover:text-cyan-600" },
  ];

  const tools = [
    { name: "LinkedIn Jobs", badge: "Sync" },
    { name: "PDF v1.7 Export", badge: "Parsed" },
    { name: "MS Word .docx", badge: "Native" },
    { name: "Indeed EasyApply", badge: "Auto-Fill" },
  ];

  return (
    <motion.div
      id="integrations"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative -mt-8 z-20 px-4 sm:px-6 max-w-5xl mx-auto"
    >
      <div className="rounded-2xl p-5 bg-white border border-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-zinc-100">
          {/* Left Column */}
          <div className="space-y-2 sm:pr-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold tracking-wider text-blue-600 uppercase flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Targeted ATS Parsing Engines
              </span>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200/80">
                100% Tested
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {atsSystems.map((ats) => (
                <div
                  key={ats.name}
                  className={`px-3 py-1 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs font-mono text-zinc-700 transition-all duration-200 hover:scale-105 hover:bg-white cursor-default ${ats.color}`}
                >
                  {ats.name}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2 pt-4 md:pt-0 sm:pl-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold tracking-wider text-purple-600 uppercase flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                Integrations & Formats
              </span>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200/80">
                Live Pipelines
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs font-mono text-zinc-700 transition-all duration-200 hover:text-zinc-950 hover:border-purple-300 cursor-default"
                >
                  <span>{tool.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-600 font-bold border border-purple-200/60">
                    {tool.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
