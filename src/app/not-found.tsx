import React from "react";
import Link from "next/link";
import { Wind, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9] p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-card border border-gray-100 text-center space-y-4">
        <div className="mx-auto rounded-2xl bg-forest-50 p-4 text-forest-700 w-fit">
          <Wind className="h-8 w-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            404 Error
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-1">Page Not Found</h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            The page you requested could not be located. Let&apos;s return to your
            personalized clean-air dashboard.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-forest-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-forest-800 transition shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
