"use client";

import React, { useState } from "react";
import { PrimaryTransport } from "@/types/household";
import { MobilityEmissionCalculator, EMISSION_FACTORS } from "@/lib/emissions/calculator";
import {
  Compass,
  Train,
  Car,
  Bike,
  ShieldCheck,
  Leaf,
  Info,
  CheckCircle2,
  TrendingDown,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface SmartMobilityViewProps {
  currentTransport: PrimaryTransport;
  commuteDistanceKm: number;
  currentAqi: number;
  onLogLowEmissionTrip?: (co2SavedGrams: number, modeLabel: string) => void;
}

export const SmartMobilityView: React.FC<SmartMobilityViewProps> = ({
  currentTransport,
  commuteDistanceKm,
  currentAqi,
  onLogLowEmissionTrip,
}) => {
  const [selectedDistance, setSelectedDistance] = useState<number>(commuteDistanceKm || 12);
  const [activeMode, setActiveMode] = useState<PrimaryTransport>(currentTransport || "two_wheeler");
  const [loggedMode, setLoggedMode] = useState<string | null>(null);

  const analysis = MobilityEmissionCalculator.analyzeCommute(
    selectedDistance,
    activeMode,
    currentAqi
  );

  const handleLogTrip = (savingsGrams: number, label: string) => {
    if (onLogLowEmissionTrip) {
      onLogLowEmissionTrip(savingsGrams, label);
      setLoggedMode(label);
      setTimeout(() => setLoggedMode(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest-800 to-forest-900 p-6 md:p-8 text-white shadow-card">
        <div className="inline-flex items-center gap-2 rounded-full bg-forest-700/60 px-3 py-1 text-xs font-semibold text-forest-200 mb-3 border border-forest-600/40">
          <Compass className="h-3.5 w-3.5" />
          Smart Clean-Air Mobility
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Navigate Cities with Lower Exposure & Lower Emissions
        </h2>
        <p className="mt-2 text-sm text-forest-100/90 max-w-2xl leading-relaxed">
          Commuting choices directly affect your personal inhaled toxic dose and your
          neighborhood&apos;s tailpipe footprint. Understand the vital difference between{" "}
          <strong>reducing personal roadside exposure</strong> and{" "}
          <strong>cutting operational transport emissions</strong>.
        </p>
      </div>

      {/* Distinction Callout */}
      <div className="rounded-2xl bg-amber-50/90 border border-amber-200 p-4 sm:p-5 flex items-start gap-3.5">
        <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 space-y-1">
          <p className="font-bold">Crucial Environmental Distinction:</p>
          <p className="leading-relaxed text-amber-800">
            <strong>Personal Exposure Reduction:</strong> Protecting your lungs from direct roadside
            exhaust plumes (e.g. choosing an enclosed metro car with air filtration over riding an
            open motorcycle in dense traffic).
            <br />
            <strong>Emission Reduction:</strong> Lowering the greenhouse gases and tailpipe soot
            your travel generates (e.g. taking public transit or carpooling instead of driving a solo car).
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Your Typical Commute Vehicle
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["two_wheeler", "car", "public_transport", "bicycle", "walking"] as PrimaryTransport[]).map(
              (mode) => {
                const item = EMISSION_FACTORS[mode];
                const isSelected = activeMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`rounded-xl p-2.5 text-xs font-semibold border transition text-center ${
                      isSelected
                        ? "bg-forest-700 text-white border-forest-700 shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {item.label.split(" ")[0]}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Distance slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Trip Distance (One-Way)
            </label>
            <span className="text-sm font-extrabold text-forest-800">
              {selectedDistance} km
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            step="1"
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(parseInt(e.target.value, 10))}
            className="w-full accent-forest-700 cursor-pointer h-2 bg-gray-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>1 km (short errand)</span>
            <span>20 km (suburban commute)</span>
            <span>40 km</span>
          </div>
        </div>
      </div>

      {/* Alternatives Comparison Table / Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900">
          Comparative Transport Analysis for {selectedDistance} km Trip
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.options.map((opt) => {
            const isSaving = opt.emissionSavingsGrams > 0;
            const isWorst = opt.emissionSavingsGrams < 0;

            const exposureBadge =
              opt.exposureRiskLevel === "very_low"
                ? "bg-green-50 text-green-700 border-green-200"
                : opt.exposureRiskLevel === "low"
                ? "bg-teal-50 text-teal-700 border-teal-200"
                : opt.exposureRiskLevel === "moderate"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-red-50 text-red-700 border-red-200";

            return (
              <div
                key={opt.mode}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  opt.isCurrentChoice
                    ? "bg-forest-50/40 border-forest-300 ring-2 ring-forest-500/20"
                    : "bg-white border-gray-100 shadow-sm hover:shadow-card"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      {opt.label}
                      {opt.isCurrentChoice && (
                        <span className="rounded-full bg-forest-700 text-white text-[10px] px-2 py-0.5 font-bold">
                          Current Choice
                        </span>
                      )}
                    </span>

                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${exposureBadge}`}
                      title={opt.exposureDescription}
                    >
                      Exposure: {opt.exposureRiskLevel.replace("_", " ")}
                    </span>
                  </div>

                  {/* Emission metrics */}
                  <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 block uppercase">
                        Est. Emissions
                      </span>
                      <span className="text-base font-extrabold text-gray-900">
                        {opt.estimatedEmissionGrams} g
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        ({opt.emissionFactorGPerKm} g/p-km)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 block uppercase">
                        Net CO2 Impact
                      </span>
                      {opt.isCurrentChoice ? (
                        <span className="text-xs font-semibold text-gray-500 block mt-1">
                          Baseline Reference
                        </span>
                      ) : isSaving ? (
                        <span className="text-sm font-bold text-green-700 flex items-center gap-1">
                          <TrendingDown className="h-4 w-4" /> -{opt.emissionSavingsGrams} g saved
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-red-600">
                          +{Math.abs(opt.emissionSavingsGrams)} g higher
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Practical & Exposure Notes */}
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">
                    <strong>Exposure Note:</strong> {opt.exposureDescription}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <strong>Practicality:</strong> {opt.practicalProsAndCons}
                  </p>

                  {!opt.recommendedForAqi && (
                    <div className="mt-2 rounded-lg bg-orange-50 p-2 text-[11px] text-orange-800 font-medium border border-orange-200">
                      ⚠️ Not advised during current high AQI without particulate mask.
                    </div>
                  )}
                </div>

                {/* Log trip button */}
                {!opt.isCurrentChoice && isSaving && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => handleLogTrip(opt.emissionSavingsGrams, opt.label)}
                      className="rounded-xl bg-forest-50 px-3 py-1.5 text-xs font-bold text-forest-800 hover:bg-forest-100 transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-forest-600" />
                      {loggedMode === opt.label ? "Logged to Impact!" : `I Chose This Trip (-${opt.emissionSavingsGrams}g)`}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Methodology and Assumptions Disclosure */}
      <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200/80 text-xs text-gray-500 leading-relaxed">
        <span className="font-bold text-gray-700 block mb-1 flex items-center gap-1">
          <Info className="h-3.5 w-3.5 text-gray-600" /> Calculation Methodology & Transparency
          Notice
        </span>
        <p>{analysis.methodologyNote}</p>
        <p className="mt-1 text-[11px] text-gray-400 italic">
          Disclaimer: Actual vehicle emissions vary according to traffic speed, age of engine,
          grade of fuel, and passenger loading. These benchmarks are provided for illustrative
          comparative decision-making.
        </p>
      </div>
    </div>
  );
};
