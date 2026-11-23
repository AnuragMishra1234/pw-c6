"use client";

import React, { useState } from "react";
import { DailyCleanAirPlan, Recommendation, RecommendationCategory } from "@/types/recommendations";
import { RecommendationCard } from "./RecommendationCard";
import { Sparkles, Filter, CheckCircle2 } from "lucide-react";

interface ActionPlanListProps {
  plan: DailyCleanAirPlan;
  isActionCompleted: (id: string) => boolean;
  onToggleComplete: (rec: Recommendation) => void;
  showFilters?: boolean;
}

export const ActionPlanList: React.FC<ActionPlanListProps> = ({
  plan,
  isActionCompleted,
  onToggleComplete,
  showFilters = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories: Array<{ id: string; label: string }> = [
    { id: "all", label: "All Actions" },
    { id: "outdoor", label: "Outdoor" },
    { id: "indoor", label: "Indoor" },
    { id: "mobility", label: "Mobility" },
    { id: "family", label: "Family" },
    { id: "sustainability", label: "Sustainability" },
  ];

  const filtered = plan.recommendations.filter((rec) => {
    if (selectedCategory === "all") return true;
    return rec.category === selectedCategory;
  });

  const completedCount = plan.recommendations.filter((r) => isActionCompleted(r.id)).length;

  return (
    <div className="space-y-4">
      {/* Category Filter Pills (if enabled) */}
      {showFilters && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? "bg-forest-700 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Recommendations Cards */}
      <div className="grid grid-cols-1 gap-3.5">
        {filtered.map((rec) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            isCompleted={isActionCompleted(rec.id)}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center bg-white/50">
          <p className="text-sm font-semibold text-gray-600">No actions in this category today</p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="mt-2 text-xs text-forest-700 underline font-medium"
          >
            Show all recommendations
          </button>
        </div>
      )}
    </div>
  );
};
