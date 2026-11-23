"use client";

import React from "react";
import { AirQualityData } from "@/types/air-quality";
import { UserPreferences } from "@/types/household";
import { DailyCleanAirPlan, Recommendation } from "@/types/recommendations";
import { UserImpactState } from "@/types/impact";
import { AirQualityHero } from "@/components/air-quality/AirQualityHero";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { AssistantWidget } from "@/components/assistant/AssistantWidget";
import { MobilityEmissionCalculator } from "@/lib/emissions/calculator";
import {
  Sparkles,
  ArrowRight,
  Home,
  Compass,
  Leaf,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { NavTab } from "@/components/layout/Navbar";

interface DashboardViewProps {
  airQuality: AirQualityData | null;
  preferences: UserPreferences;
  cleanAirPlan: DailyCleanAirPlan | null;
  impact: UserImpactState;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onChangeLocation: () => void;
  onSelectTab: (tab: NavTab) => void;
  isActionCompleted: (id: string) => boolean;
  onToggleComplete: (rec: Recommendation) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  airQuality,
  preferences,
  cleanAirPlan,
  impact,
  isLoading,
  error,
  onRefresh,
  onChangeLocation,
  onSelectTab,
  isActionCompleted,
  onToggleComplete,
}) => {
  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Calculate quick mobility recommendation
  const mobilityAnalysis = cleanAirPlan
    ? MobilityEmissionCalculator.analyzeCommute(
        preferences.commuteDistanceKm,
        preferences.primaryTransport,
        cleanAirPlan.aqiValue
      )
    : null;

  // Find 1 representative indoor recommendation
  const indoorRec = cleanAirPlan?.recommendations.find(
    (r) => r.category === "indoor"
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome & Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-forest-900">
            {greeting}. Let's make today a cleaner-air day.
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500">
            <span className="font-semibold text-forest-800">
              {preferences.householdType.replace(/_/g, " ")}
            </span>
            <span>•</span>
            <span>
              Primary transport:{" "}
              <strong>{preferences.primaryTransport.replace(/_/g, " ")}</strong>
            </span>
            <span>•</span>
            <span>
              {preferences.indoorEnvironment.hasAirPurifier
                ? "HEPA Purifier Active"
                : "No Air Purifier (Low-Cost Mode)"}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Air Quality Overview */}
      <AirQualityHero
        data={airQuality}
        isLoading={isLoading}
        error={error}
        onRefresh={onRefresh}
        onChangeLocation={onChangeLocation}
      />

      {/* 2. Today's Priority Action Plan */}
      {cleanAirPlan && (
        <section aria-labelledby="today-plan-title" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="today-plan-title"
                className="text-lg font-bold text-gray-900 flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5 text-forest-600" />
                Today's Priority Action Plan
              </h2>
              <p className="text-xs text-gray-500">
                Tailored for {cleanAirPlan.locationName} based on current US AQI{" "}
                {cleanAirPlan.aqiValue}
              </p>
            </div>

            <button
              onClick={() => onSelectTab("plan")}
              className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 hover:text-forest-900 transition group"
            >
              <span>View All ({cleanAirPlan.recommendations.length})</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {cleanAirPlan.priorityActions.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                isCompleted={isActionCompleted(rec.id)}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Three Essential Cards Row: Indoor, Mobility, Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Indoor Air Advisor */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-card p-5 flex flex-col justify-between transition-all">
          <div>
            <div className="flex items-center justify-between text-teal-700 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Home className="h-4 w-4" /> Indoor Air Advisor
              </span>
              <span className="text-[10px] rounded-full bg-teal-50 px-2 py-0.5 font-bold">
                {preferences.indoorEnvironment.hasAirPurifier ? "HEPA Mode" : "Affordable"}
              </span>
            </div>

            <h3 className="text-sm font-bold text-gray-900">
              {indoorRec ? indoorRec.title : "Keep Indoor Spaces Clean"}
            </h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              {indoorRec
                ? indoorRec.action
                : "Avoid burning incense and use wet wiping to keep settled particulates from resuspending."}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => onSelectTab("indoor")}
              className="w-full rounded-xl bg-forest-50 py-2 text-xs font-bold text-forest-800 hover:bg-forest-100 transition flex items-center justify-center gap-1.5"
            >
              <span>Explore Indoor Practices</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Smart Mobility Card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-card p-5 flex flex-col justify-between transition-all">
          <div>
            <div className="flex items-center justify-between text-indigo-700 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="h-4 w-4" /> Smart Mobility
              </span>
              <span className="text-[10px] rounded-full bg-indigo-50 px-2 py-0.5 font-bold">
                {preferences.commuteDistanceKm} km trip
              </span>
            </div>

            <h3 className="text-sm font-bold text-gray-900">
              {mobilityAnalysis?.bestLowEmissionOption
                ? `Switch to ${mobilityAnalysis.bestLowEmissionOption.label}`
                : "Low-Emission Commuting"}
            </h3>

            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              {mobilityAnalysis && mobilityAnalysis.bestLowEmissionOption.emissionSavingsGrams > 0
                ? `Save up to ${mobilityAnalysis.bestLowEmissionOption.emissionSavingsGrams}g CO₂ per trip compared to your current ${preferences.primaryTransport.replace(/_/g, " ")}.`
                : "Consider public transit or carpooling to reduce roadway emissions and direct toxic tailpipe exposure."}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => onSelectTab("mobility")}
              className="w-full rounded-xl bg-forest-50 py-2 text-xs font-bold text-forest-800 hover:bg-forest-100 transition flex items-center justify-center gap-1.5"
            >
              <span>Compare Commute Options</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Sustainability Impact */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-card p-5 flex flex-col justify-between transition-all">
          <div>
            <div className="flex items-center justify-between text-emerald-700 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="h-4 w-4" /> Impact Tracker
              </span>
              <span className="text-[10px] rounded-full bg-emerald-50 px-2 py-0.5 font-bold">
                {impact.streakDays} Day Streak
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-forest-900">
                {impact.totalCo2SavedGrams > 1000
                  ? `${(impact.totalCo2SavedGrams / 1000).toFixed(1)} kg`
                  : `${impact.totalCo2SavedGrams} g`}
              </span>
              <span className="text-xs text-gray-500">CO₂ avoided</span>
            </div>

            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              You have completed <strong>{impact.completedActions.length}</strong> clean-air actions
              and <strong>{impact.lowEmissionTripsCount}</strong> low-emission trips.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => onSelectTab("impact")}
              className="w-full rounded-xl bg-forest-50 py-2 text-xs font-bold text-forest-800 hover:bg-forest-100 transition flex items-center justify-center gap-1.5"
            >
              <span>View Impact History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. AI Clean-Air Assistant (Grounded in Verified Context) */}
      {airQuality && (
        <section aria-labelledby="assistant-heading">
          <AssistantWidget
            airQuality={airQuality}
            preferences={preferences}
            recommendations={cleanAirPlan?.recommendations || []}
          />
        </section>
      )}
    </div>
  );
};
