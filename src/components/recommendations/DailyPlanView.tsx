"use client";

import React from "react";
import { DailyCleanAirPlan, Recommendation } from "@/types/recommendations";
import { ActionPlanList } from "./ActionPlanList";
import { Sparkles, Calendar, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getAQICategoryDetails } from "@/lib/air-quality/aqi-calculator";

interface DailyPlanViewProps {
  plan: DailyCleanAirPlan;
  isActionCompleted: (id: string) => boolean;
  onToggleComplete: (rec: Recommendation) => void;
}

export const DailyPlanView: React.FC<DailyPlanViewProps> = ({
  plan,
  isActionCompleted,
  onToggleComplete,
}) => {
  const aqiConfig = getAQICategoryDetails(plan.aqiValue);
  const completedCount = plan.recommendations.filter((r) => isActionCompleted(r.id)).length;
  const totalCount = plan.recommendations.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest-800 to-forest-900 p-6 md:p-8 text-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-700/60 px-3 py-1 text-xs font-semibold text-forest-200 border border-forest-600/40">
            <Sparkles className="h-3.5 w-3.5" />
            Deterministic Clean-Air Plan
          </div>

          <div className="flex items-center gap-2 text-xs text-forest-200">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Generated {new Date(plan.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Personalized Action Plan for {plan.locationName}
        </h2>

        <p className="mt-3 text-sm text-forest-100/90 leading-relaxed max-w-3xl">
          {plan.executiveSummary}
        </p>

        {/* Status pill & completed progress */}
        <div className="mt-5 pt-4 border-t border-forest-700/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-3 py-0.5 text-xs font-bold shadow-sm"
              style={{ backgroundColor: aqiConfig.color, color: "#fff" }}
            >
              US AQI {plan.aqiValue} • {aqiConfig.label}
            </span>
            <span className="text-xs text-forest-200 font-medium">
              Based on Open-Meteo verified reading
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-forest-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>
              {completedCount} of {totalCount} actions completed today
            </span>
          </div>
        </div>
      </div>

      {/* Structured Action List with Category Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">
            Tailored Clean-Air Recommendations ({plan.recommendations.length})
          </h3>
          <span className="text-xs text-gray-400">Filter by category</span>
        </div>

        <ActionPlanList
          plan={plan}
          isActionCompleted={isActionCompleted}
          onToggleComplete={onToggleComplete}
          showFilters={true}
        />
      </div>
    </div>
  );
};
