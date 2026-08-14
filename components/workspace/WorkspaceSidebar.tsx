"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  Key,
  Home,
  ShieldCheck,
  FolderOpen,
  HelpCircle,
} from "lucide-react";

interface WorkspaceSidebarProps {
  onNewScan: () => void;
  onOpenSettings: () => void;
  activeView?: string;
}

export function WorkspaceSidebar({
  onNewScan,
  onOpenSettings,
}: WorkspaceSidebarProps) {
  return (
    <aside className="w-16 border-r border-zinc-200 bg-white flex flex-col items-center py-4 justify-between flex-shrink-0 z-20">
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Brand Logo */}
        <Link
          href="/"
          className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm hover:scale-105 transition-transform"
          title="Hirely Home"
        >
          H
        </Link>

        {/* Primary Action Button (+ New Scan) */}
        <button
          onClick={onNewScan}
          className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center gap-0.5 shadow-sm transition-all"
          title="New CV Scan"
        >
          <Plus className="w-5 h-5" />
        </button>

        <div className="w-8 h-[1px] bg-zinc-200" />

        {/* Navigation Action Icons */}
        <div className="flex flex-col items-center gap-4 w-full">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center transition-colors"
            title="Landing Page"
          >
            <Home className="w-5 h-5" />
          </Link>

          <button
            onClick={onNewScan}
            className="w-10 h-10 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center transition-colors"
            title="Documents"
          >
            <FolderOpen className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center transition-colors"
            title="Gemini API Key Settings"
          >
            <Key className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <a
          href="/#faq"
          className="w-10 h-10 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors"
          title="Help & FAQ"
        >
          <HelpCircle className="w-5 h-5" />
        </a>
      </div>
    </aside>
  );
}
