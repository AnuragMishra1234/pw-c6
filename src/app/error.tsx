"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Application Error Boundary Caught]:", error);
  }, [error]);

  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-[#F8FAF9] p-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-card border border-red-100 text-center space-y-4">
        <div className="mx-auto rounded-2xl bg-red-50 p-4 text-red-600 w-fit">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Something went unexpectedly wrong
          </h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            We encountered a temporary interface error. Your stored preferences and
            impact data are safely preserved in your browser.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-forest-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-forest-800 transition shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Try Again
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.location.href = "/";
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            <Home className="h-3.5 w-3.5" /> Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
