import React from "react";
import { Wind } from "lucide-react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAF9] p-4"
    >
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="rounded-2xl bg-forest-700 p-4 text-white shadow-lg">
          <Wind className="h-8 w-8 animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-forest-900">BreatheWise</h2>
          <p className="text-xs text-forest-700 mt-1">
            Loading verified atmospheric telemetry...
          </p>
        </div>
      </div>
      <span className="sr-only">Loading air quality dashboard</span>
    </div>
  );
}
