"use client";

import React from "react";
import { Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SpotlightCard } from "./SpotlightCard";

interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  handle: string;
  avatar: string;
  quote: string;
  atsScoreBefore: number;
  atsScoreAfter: number;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Marcus Vance",
    role: "Senior Staff Engineer",
    company: "Google",
    handle: "@marcus_vance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    quote:
      "I applied to 40+ engineering roles and got auto-rejected within 2 hours by Taleo every single time. Hirely flagged that my 2-column template was scrambling my work dates into illegible strings. Fixed the layout, used the STAR rewriter, and booked 6 onsite loops in 2 weeks.",
    atsScoreBefore: 48,
    atsScoreAfter: 97,
  },
  {
    name: "Elena Rostova",
    role: "Lead Product Manager",
    company: "Stripe",
    handle: "@elena_pm",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    quote:
      "The keyword gap matrix is shockingly accurate. It pointed out that while I talked about 'experimentation', I never included explicit phrases like 'Net Revenue Retention (NRR)' or 'PLG funnel conversion'. The instant Gemini score jump was like night and day.",
    atsScoreBefore: 62,
    atsScoreAfter: 94,
  },
  {
    name: "Devon Chen",
    role: "Full-Stack Tech Lead",
    company: "Airbnb",
    handle: "@devon_codes",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote:
      "Most resume tools give you generic fluff like 'be more enthusiastic'. Hirely gave me exact Google XYZ bullet rewrites with latency and revenue metrics that recruiters actually complimented during my initial screener.",
    atsScoreBefore: 55,
    atsScoreAfter: 96,
  },
  {
    name: "Aaliyah Brooks",
    role: "Principal Data Scientist",
    company: "Netflix",
    handle: "@aaliyah_data",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    quote:
      "Workday is notoriously strict about phrase hierarchy. Hirely ensured all my PyTorch, distributed training, and MLOps tooling passed without a hitch. It's the highest ROI 10 minutes I've spent in my job hunt.",
    atsScoreBefore: 67,
    atsScoreAfter: 98,
  },
  {
    name: "Kenji Sato",
    role: "Engineering Manager",
    company: "Datadog",
    handle: "@kenji_sato",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    quote:
      "As someone who screens hundreds of resumes myself, I can tell you that Hirely-optimized CVs immediately stand out because they lead with high-impact numbers rather than generic job descriptions.",
    atsScoreBefore: 70,
    atsScoreAfter: 95,
  },
  {
    name: "Sophia Martinez",
    role: "Senior Growth Marketing Lead",
    company: "Figma",
    handle: "@sophia_growth",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    quote:
      "The UI is gorgeous, and the real-time scoring gives you instant confidence before hitting 'Submit Application'. 10/10 recommended to anyone applying in tech.",
    atsScoreBefore: 59,
    atsScoreAfter: 93,
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-white text-zinc-950 overflow-hidden border-b border-zinc-200/80"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-blue-600 text-xs font-mono shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            CANDIDATE OUTCOMES
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-zinc-950 tracking-tight leading-[1.15]">
            Trusted by candidates who landed at FAANG and top startups.
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base font-sans max-w-xl mx-auto">
            See how job seekers doubled their interview callback rates by eliminating hidden ATS parsing bottlenecks.
          </p>
        </motion.div>

        {/* Masonry Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (idx % 3) * 0.1 }}
            >
              <SpotlightCard
                className="p-6 flex flex-col justify-between space-y-5 h-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <div className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-bold">
                    ATS {item.atsScoreBefore} → {item.atsScoreAfter}
                  </div>
                </div>

                <p className="text-[13px] text-zinc-700 leading-relaxed font-sans italic">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="pt-4 border-t border-zinc-100 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-9 h-9 rounded-full object-cover border border-zinc-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950 font-sans leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs text-zinc-500">
                      {item.role} • <span className="text-zinc-900 font-medium">{item.company}</span>
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
