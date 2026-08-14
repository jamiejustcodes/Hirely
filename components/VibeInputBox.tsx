"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  Briefcase,
  X,
  Zap,
} from "lucide-react";
import { SAMPLE_DATA } from "@/lib/mockData";

interface VibeInputBoxProps {
  onScan: (resumeText: string, jobDesc: string, file: File | null) => void;
  isLoading?: boolean;
}

export function VibeInputBox({ onScan, isLoading = false }: VibeInputBoxProps) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showJobInput, setShowJobInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target?.result as string);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target?.result as string);
        };
        reader.readAsText(file);
      }
    }
  };

  const loadSample = (type: "softwareEngineer" | "productManager") => {
    const sample = SAMPLE_DATA[type];
    setResumeText(sample.resumeText);
    setJobDescription(sample.jobDescription);
    setSelectedFile(null);
    setShowJobInput(true);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!resumeText.trim() && !selectedFile) {
      loadSample("softwareEngineer");
      return;
    }
    onScan(resumeText, jobDescription, selectedFile);
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative group">
      {/* Subtle outer glow on hover */}
      <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-blue-500/15 opacity-50 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 pointer-events-none" />

      {/* Main Crisp White Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative z-10 bg-white text-zinc-900 rounded-2xl p-5 border transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.05)] ${
          dragOver
            ? "border-blue-500 ring-4 ring-blue-500/15 bg-blue-50/40"
            : "border-zinc-200/90 hover:border-zinc-300"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Top Presets & Active File */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-2 border-b border-zinc-100 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap font-sans">
            <span className="text-[11px] sm:text-xs text-zinc-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Sample roles:</span>
            </span>
            <button
              type="button"
              onClick={() => loadSample("softwareEngineer")}
              className="px-2.5 py-1 rounded-full bg-zinc-100/80 hover:bg-zinc-200/70 border border-zinc-200/60 text-zinc-700 font-sans text-[11px] sm:text-xs font-medium transition-all flex items-center gap-1 shadow-2xs hover:border-zinc-300 active:scale-95"
            >
              <Zap className="w-3 h-3 text-sky-500" />
              <span>Full-Stack Engineer</span>
            </button>
            <button
              type="button"
              onClick={() => loadSample("productManager")}
              className="px-2.5 py-1 rounded-full bg-zinc-100/80 hover:bg-zinc-200/70 border border-zinc-200/60 text-zinc-700 font-sans text-[11px] sm:text-xs font-medium transition-all flex items-center gap-1 shadow-2xs hover:border-zinc-300 active:scale-95"
            >
              <Briefcase className="w-3 h-3 text-indigo-500" />
              <span>Product Manager</span>
            </button>
          </div>

          {selectedFile && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 font-sans text-xs font-medium self-start sm:self-auto shadow-2xs">
              <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="max-w-[160px] sm:max-w-[200px] truncate font-semibold">{selectedFile.name}</span>
              <span className="text-[10px] text-sky-600">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="hover:text-rose-600 ml-1 p-0.5 rounded-full hover:bg-sky-100 transition-colors"
                title="Remove attached file"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Text Input Areas */}
        <div className="space-y-3">
          <div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder={selectedFile ? `File "${selectedFile.name}" attached. Click "Scan Resume" below, or add extra notes / job context...` : "Paste your resume text here, or attach a PDF / DOCX file below..."}
              rows={4}
              className="w-full text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none leading-relaxed font-sans"
            />
          </div>

          {/* Job Description Drawer */}
          {showJobInput && (
            <div className="pt-3 border-t border-dashed border-zinc-200 animate-fadeIn">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-sans font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                  Target Job Description (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowJobInput(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-600 font-sans px-1"
                >
                  Hide
                </button>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job posting to compare exact ATS keywords and hard requirements..."
                rows={3}
                className="w-full text-xs sm:text-sm text-zinc-800 placeholder:text-zinc-400 bg-zinc-50 p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-blue-500 resize-none font-sans"
              />
            </div>
          )}
        </div>

        {/* Bottom Utility Bar */}
        <div className="mt-3 pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 active:bg-zinc-200 text-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>{selectedFile ? "Change File" : "Attach PDF / DOCX"}</span>
            </button>

            {!showJobInput && (
              <button
                type="button"
                onClick={() => setShowJobInput(true)}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 active:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>+ Add Job Post</span>
              </button>
            )}
          </div>

          {/* Action Trigger Button (Cyan Blue matching background) */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs font-semibold tracking-wide shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Auditing ATS...</span>
              </>
            ) : (
              <>
                <span>{selectedFile ? `Scan "${selectedFile.name.slice(0, 15)}..."` : "Scan Resume"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
