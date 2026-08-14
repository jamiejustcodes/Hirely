import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <h1 className="text-6xl font-bold font-sans text-zinc-950">404</h1>
        <h2 className="text-xl font-semibold text-zinc-900">Page not found</h2>
        <p className="text-xs text-zinc-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-colors shadow-sm shadow-sky-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
