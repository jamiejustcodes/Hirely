"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  Key,
  Home,
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
    <aside className="w-14 border-r border-zinc-200 bg-white flex flex-col items-center py-3.5 justify-between flex-shrink-0 z-20 select-none">
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Brand Logo */}
        <Link
          href="/"
          className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs hover:bg-blue-700 transition-colors"
          title="Hirely Home"
        >
          H
        </Link>

        {/* Primary Action Button (+ New Scan) */}
        <button
          onClick={onNewScan}
          className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-2xs transition-colors"
          title="New Scan"
        >
          <Plus className="w-4 h-4" />
        </button>

        <div className="w-6 h-[1px] bg-zinc-200" />

        {/* Navigation Action Icons */}
        <div className="flex flex-col items-center gap-3 w-full">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg text-zinc-500 hover:text-blue-600 hover:bg-blue-50/50 flex items-center justify-center transition-colors"
            title="Landing Page"
          >
            <Home className="w-4 h-4" />
          </Link>

          <button
            onClick={onNewScan}
            className="w-8 h-8 rounded-lg text-zinc-500 hover:text-blue-600 hover:bg-blue-50/50 flex items-center justify-center transition-colors"
            title="Documents"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-lg text-zinc-500 hover:text-blue-600 hover:bg-blue-50/50 flex items-center justify-center transition-colors"
            title="API Settings"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <a
          href="/#faq"
          className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors"
          title="Help & FAQ"
        >
          <HelpCircle className="w-4 h-4" />
        </a>
      </div>
    </aside>
  );
}
