"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "What is an ATS and how does Hirely beat it?",
    answer:
      "An Applicant Tracking System (like Workday, Taleo, Greenhouse, or Lever) is automated software used by 99% of Fortune 500 companies to filter and rank resumes. Hirely uses Google's advanced Gemini AI to simulate these exact parsing algorithms—identifying missing hard keywords, checking single-column read order, and scoring your quantified achievements using the STAR methodology.",
  },
  {
    question: "Is Hirely completely free to use online?",
    answer:
      "Yes! Hirely provides a 100% free online scanning tier powered by Google Gemini 2.5 Flash. You can scan resumes, receive full keyword gap matrices, and copy STAR bullet point rewrites with zero hidden paywalls or credit card requirements.",
  },
  {
    question: "What resume file formats are supported?",
    answer:
      "Hirely supports standard PDF (.pdf), Microsoft Word (.docx), and plain text (.txt). For optimal ATS compatibility across older enterprise platforms, clean single-column PDF or DOCX is recommended.",
  },
  {
    question: "What is the STAR Method and why does it boost ATS score?",
    answer:
      "The STAR framework stands for Situation, Task, Action, and Result (popularized by Google as the XYZ formula: 'Accomplished [X], as measured by [Y], by doing [Z]'). Modern ATS AI models rank resumes higher when experience contains active leadership verbs, technical tools, and measurable metrics (e.g. percentages, revenue, latency reduction).",
  },
  {
    question: "Is my resume data stored or shared?",
    answer:
      "No. Your uploaded resume and job descriptions are processed securely in real-time in-memory and are never sold, indexed in public databases, or shared with third-party advertisers.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#fafafa] text-zinc-950">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200 text-blue-600 text-xs font-mono shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-zinc-950 tracking-tight leading-[1.15]">
            Everything you need to know about ATS screening.
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base font-sans max-w-xl mx-auto">
            Got questions about how modern ATS algorithms score candidates? We have answers.
          </p>
        </motion.div>

        {/* FAQ Accordion List (White Rounded Cards) */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
                className="rounded-2xl bg-white border border-zinc-200 shadow-xs overflow-hidden transition-all duration-200 hover:border-zinc-300"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-zinc-950 text-base sm:text-lg hover:text-blue-600 transition-colors"
                >
                  <span className="font-sans font-semibold text-sm sm:text-base">{faq.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-blue-600" : "text-zinc-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Smooth Height Transition */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-5 px-5 sm:px-6" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed pt-1 border-t border-zinc-100">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
