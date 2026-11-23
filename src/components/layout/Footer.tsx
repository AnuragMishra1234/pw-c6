import React from "react";
import { ShieldCheck, Wind, Info, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-gray-200/80 bg-white/70 py-10 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-forest-700 p-1.5 text-white">
              <Wind className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-forest-900">BreatheWise</span>
            <span className="text-gray-300">|</span>
            <span className="text-forest-700 font-medium">Urban Air Quality Assistant</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
            <span>Data: Open-Meteo Air Quality API</span>
            <span>•</span>
            <span>Index: US EPA AQI Standard</span>
            <span>•</span>
            <span>Challenge 6 Hackathon</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 text-[11px] text-gray-500 leading-relaxed">
          <p className="font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
            <Info className="h-3.5 w-3.5 text-forest-600" /> Transparent Environmental & Health Notice
          </p>
          <p>
            BreatheWise is a decision-support and lifestyle advisory tool designed to help families reduce
            pollution exposure and transport emissions. AQI data is retrieved from external meteorological
            APIs (Open-Meteo) calculated using the US AQI standard, not official Indian Central Pollution
            Control Board (CPCB) stations. Commute emission calculations are transparently estimated using
            standard IPCC/DEFRA operational factors. Recommendations are informational and do not
            constitute medical diagnosis or clinical treatment.
          </p>
        </div>

        <div className="text-center text-[11px] text-gray-400">
          Built for Challenge 6 — Urban Air Quality Assistant. Empowering cleaner everyday living.
        </div>
      </div>
    </footer>
  );
};
