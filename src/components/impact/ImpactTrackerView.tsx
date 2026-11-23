"use client";

import React from "react";
import { UserImpactState, CompletedActionRecord } from "@/types/impact";
import {
  Leaf,
  Award,
  Zap,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface ImpactTrackerViewProps {
  impact: UserImpactState;
  onResetImpact?: () => void;
}

export const ImpactTrackerView: React.FC<ImpactTrackerViewProps> = ({
  impact,
  onResetImpact,
}) => {
  const totalKgSaved = (impact.totalCo2SavedGrams / 1000).toFixed(2);

  // Group actions by date
  const groupedActions: Record<string, CompletedActionRecord[]> = {};
  for (const action of impact.completedActions) {
    const day = action.completedAt.slice(0, 10);
    if (!groupedActions[day]) {
      groupedActions[day] = [];
    }
    groupedActions[day].push(action);
  }

  const sortedDays = Object.keys(groupedActions).sort().reverse();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest-800 to-forest-900 p-6 md:p-8 text-white shadow-card">
        <div className="inline-flex items-center gap-2 rounded-full bg-forest-700/60 px-3 py-1 text-xs font-semibold text-forest-200 mb-3 border border-forest-600/40">
          <Leaf className="h-3.5 w-3.5" />
          Sustainability & Habit Tracker
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Your Clean-Air Everyday Choices
        </h2>
        <p className="mt-2 text-sm text-forest-100/90 max-w-2xl leading-relaxed">
          Small everyday adjustments—taking the metro, eliminating domestic smoke, and damp
          dusting—cumulatively lower neighborhood emissions and shield your family&apos;s lungs.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avoided CO₂</span>
            <TrendingDown className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-forest-900">
              {impact.totalCo2SavedGrams > 1000 ? `${totalKgSaved} kg` : `${impact.totalCo2SavedGrams} g`}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              Est. transport emissions saved
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Actions Taken</span>
            <CheckCircle2 className="h-4 w-4 text-forest-600" />
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-forest-900">
              {impact.completedActions.length}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              Protective choices logged
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Clean Commutes</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-forest-900">
              {impact.lowEmissionTripsCount}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              Low-emission trips taken
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Streak</span>
            <Award className="h-4 w-4 text-indigo-500" />
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-forest-900">
              {impact.streakDays} {impact.streakDays === 1 ? "Day" : "Days"}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              Consistent daily check-ins
            </span>
          </div>
        </div>
      </div>

      {/* Conceptual Disclaimer Callout */}
      <div className="rounded-2xl bg-forest-50/70 border border-forest-100 p-4 text-xs text-forest-900 space-y-1">
        <span className="font-bold flex items-center gap-1.5 text-forest-950">
          <AlertCircle className="h-4 w-4 text-forest-700" /> Transparent Impact Model Note:
        </span>
        <p className="leading-relaxed text-forest-800">
          • <strong>Emissions Avoided:</strong> Calculated from established operational passenger
          averages when switching to active or shared transit for estimated trip distances.
          <br />• <strong>Exposure Reduction:</strong> Qualitative adherence to indoor sealing,
          timing workouts, and wearing respirators. BreatheWise does not claim direct biological
          sensor measurement of inhaled microgram intake.
        </p>
      </div>

      {/* Activity Log */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-forest-700" />
            Recent Action History
          </h3>

          {impact.completedActions.length > 0 && onResetImpact && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset your logged impact data?")) {
                  onResetImpact();
                }
              }}
              className="text-xs text-gray-400 hover:text-red-600 transition flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Reset History
            </button>
          )}
        </div>

        {sortedDays.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-600">No actions logged yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Mark recommendations complete from the Dashboard or Daily Plan to track your progress!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDays.map((day) => (
              <div key={day} className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  {new Date(day + "T00:00:00").toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {groupedActions[day].map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-gray-50/50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                        <div>
                          <span className="font-semibold text-gray-800">{item.title}</span>
                          <span className="text-[10px] text-gray-400 block capitalize">
                            Category: {item.category} •{" "}
                            {new Date(item.completedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      {item.co2SavedGrams ? (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">
                          +{item.co2SavedGrams}g CO₂
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
