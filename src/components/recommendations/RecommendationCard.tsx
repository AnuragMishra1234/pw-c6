"use client";

import React, { useState } from "react";
import { Recommendation, Priority, RecommendationCategory } from "@/types/recommendations";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sun,
  Smile,
  AlertCircle,
  ShieldAlert,
  OctagonAlert,
  Dumbbell,
  Bike,
  Compass,
  Car,
  Train,
  Wind,
  Sparkles,
  DoorOpen,
  Home,
  Baby,
  HeartPulse,
  HardHat,
  Leaf,
  Flame,
} from "lucide-react";

interface RecommendationCardProps {
  recommendation: Recommendation;
  isCompleted: boolean;
  onToggleComplete: (rec: Recommendation) => void;
  showCategoryBadge?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sun,
  Smile,
  AlertCircle,
  ShieldAlert,
  OctagonAlert,
  Dumbbell,
  Bike,
  Compass,
  Car,
  Train,
  Wind,
  Sparkles,
  DoorOpen,
  Home,
  Baby,
  HeartPulse,
  HardHat,
  Leaf,
  Flame,
};

const PRIORITY_STYLES: Record<Priority, { label: string; badge: string }> = {
  high: {
    label: "High Priority",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
  medium: {
    label: "Moderate",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  low: {
    label: "Suggested",
    badge: "bg-green-50 text-green-700 border-green-200",
  },
};

const CATEGORY_STYLES: Record<RecommendationCategory, { label: string; color: string }> = {
  outdoor: { label: "Outdoor Activity", color: "text-blue-700 bg-blue-50" },
  indoor: { label: "Indoor Sanctuary", color: "text-teal-700 bg-teal-50" },
  mobility: { label: "Smart Mobility", color: "text-indigo-700 bg-indigo-50" },
  family: { label: "Household Safety", color: "text-rose-700 bg-rose-50" },
  sustainability: { label: "Eco Impact", color: "text-emerald-700 bg-emerald-50" },
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  isCompleted,
  onToggleComplete,
  showCategoryBadge = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = ICON_MAP[recommendation.iconName] || AlertCircle;
  const priorityInfo = PRIORITY_STYLES[recommendation.priority] || PRIORITY_STYLES.medium;
  const categoryInfo = CATEGORY_STYLES[recommendation.category] || CATEGORY_STYLES.outdoor;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isCompleted
          ? "bg-gray-50/70 border-gray-200/80 opacity-85"
          : "bg-white border-gray-100 shadow-sm hover:shadow-card hover:border-gray-200"
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Icon & Content */}
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <div
              className={`rounded-xl p-2.5 mt-0.5 shrink-0 ${
                isCompleted
                  ? "bg-gray-200 text-gray-500"
                  : "bg-forest-50 text-forest-700"
              }`}
            >
              <IconComponent className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {showCategoryBadge && (
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide ${categoryInfo.color}`}
                  >
                    {categoryInfo.label}
                  </span>
                )}
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityInfo.badge}`}
                >
                  {priorityInfo.label}
                </span>
              </div>

              {/* Title */}
              <h4
                className={`text-sm sm:text-base font-bold leading-snug tracking-tight ${
                  isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                }`}
              >
                {recommendation.title}
              </h4>

              {/* Action Description */}
              <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {recommendation.action}
              </p>
            </div>
          </div>

          {/* Right: Checkbox complete button */}
          <button
            onClick={() => onToggleComplete(recommendation)}
            aria-label={isCompleted ? "Mark incomplete" : "Mark action completed"}
            className={`rounded-xl p-2 shrink-0 transition-all ${
              isCompleted
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-400 hover:bg-forest-50 hover:text-forest-700"
            }`}
            title={isCompleted ? "Action completed!" : "Mark completed for today"}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 fill-green-600 text-white" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Expandable Rationale and Benefit */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest-700 hover:text-forest-900 transition"
          >
            <span>{isExpanded ? "Hide rationale" : "Why this action matters"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {isCompleted && (
            <span className="text-[11px] font-medium text-green-700 flex items-center gap-1">
              ✓ Logged to impact
            </span>
          )}
        </div>

        {isExpanded && (
          <div className="mt-3 rounded-xl bg-forest-50/50 p-3.5 text-xs space-y-2 border border-forest-100/60 animate-in fade-in duration-150">
            <div>
              <span className="font-bold text-forest-900 uppercase tracking-wider text-[10px] block">
                Evidence & Decision Reason
              </span>
              <p className="text-gray-700 mt-0.5 leading-relaxed">{recommendation.reason}</p>
            </div>
            <div>
              <span className="font-bold text-forest-900 uppercase tracking-wider text-[10px] block">
                Direct Benefit / Impact
              </span>
              <p className="text-gray-700 mt-0.5 leading-relaxed">{recommendation.impact}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
