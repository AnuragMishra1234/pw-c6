"use client";

import React, { useState, useMemo } from "react";
import { Navbar, NavTab } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { DailyPlanView } from "@/components/recommendations/DailyPlanView";
import { IndoorAdvisorView } from "@/components/indoor/IndoorAdvisorView";
import { SmartMobilityView } from "@/components/mobility/SmartMobilityView";
import { ImpactTrackerView } from "@/components/impact/ImpactTrackerView";
import { LocationSearchModal } from "@/components/air-quality/LocationSearchModal";
import { HouseholdPreferencesModal } from "@/components/preferences/HouseholdPreferencesModal";

import { usePreferences } from "@/hooks/use-preferences";
import { useAirQuality } from "@/hooks/use-air-quality";
import { useImpact } from "@/hooks/use-impact";
import { CleanAirRecommendationEngine } from "@/lib/recommendations/engine";
import { Recommendation } from "@/types/recommendations";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Hooks for persistent state and API data
  const { preferences, updatePreferences, updateCity, isLoaded: prefsLoaded } = usePreferences();

  const {
    data: airQuality,
    isLoading: aqiLoading,
    error: aqiError,
    refresh: refreshAqi,
  } = useAirQuality({
    latitude: preferences.selectedCity.latitude,
    longitude: preferences.selectedCity.longitude,
    locationName: preferences.selectedCity.name,
    adminArea: preferences.selectedCity.admin1,
    country: preferences.selectedCity.country,
  });

  const { impact, markActionComplete, isActionCompleted } = useImpact();

  // 2. Deterministic recommendation plan generation
  const cleanAirPlan = useMemo(() => {
    if (!airQuality) return null;
    return CleanAirRecommendationEngine.evaluate({
      airQuality,
      preferences,
    });
  }, [airQuality, preferences]);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 3. Action completion handler
  const handleToggleComplete = (rec: Recommendation) => {
    const isDone = isActionCompleted(rec.id);
    if (!isDone) {
      const co2Bonus = rec.category === "mobility" ? 350 : 50;
      markActionComplete({
        recommendationId: rec.id,
        title: rec.title,
        category: rec.category,
        co2SavedGrams: co2Bonus,
      });
      showToast(`Action completed! +${co2Bonus}g CO₂ impact logged.`);
    } else {
      showToast("Action was already completed for today!");
    }
  };

  // 4. Commute trip logger
  const handleLogLowEmissionTrip = (co2SavedGrams: number, modeLabel: string) => {
    markActionComplete({
      recommendationId: `trip-${Date.now()}`,
      title: `Low-emission trip via ${modeLabel}`,
      category: "mobility",
      co2SavedGrams,
    });
    showToast(`Logged low-emission journey! Saved ~${co2SavedGrams}g CO₂.`);
  };

  const handleResetImpact = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("breathewise_impact_v1");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      {/* Toast banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 rounded-2xl bg-forest-800 text-white px-4 py-3 shadow-elevated text-xs sm:text-sm font-semibold flex items-center gap-2 border border-forest-600 animate-in slide-in-from-bottom duration-200"
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        cityName={preferences.selectedCity.name}
        onOpenLocationSearch={() => setIsLocationModalOpen(true)}
        onOpenPreferences={() => setIsPreferencesModalOpen(true)}
      />

      {/* Main Body */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none"
      >
        {currentTab === "dashboard" && (
          <DashboardView
            airQuality={airQuality}
            preferences={preferences}
            cleanAirPlan={cleanAirPlan}
            impact={impact}
            isLoading={aqiLoading}
            error={aqiError}
            onRefresh={refreshAqi}
            onChangeLocation={() => setIsLocationModalOpen(true)}
            onSelectTab={setCurrentTab}
            isActionCompleted={isActionCompleted}
            onToggleComplete={handleToggleComplete}
          />
        )}

        {currentTab === "plan" && cleanAirPlan && (
          <DailyPlanView
            plan={cleanAirPlan}
            isActionCompleted={isActionCompleted}
            onToggleComplete={handleToggleComplete}
          />
        )}

        {currentTab === "indoor" && <IndoorAdvisorView />}

        {currentTab === "mobility" && (
          <SmartMobilityView
            currentTransport={preferences.primaryTransport}
            commuteDistanceKm={preferences.commuteDistanceKm}
            currentAqi={airQuality ? airQuality.aqi : 120}
            onLogLowEmissionTrip={handleLogLowEmissionTrip}
          />
        )}

        {currentTab === "impact" && (
          <ImpactTrackerView impact={impact} onResetImpact={handleResetImpact} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <LocationSearchModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentCityName={preferences.selectedCity.name}
        onSelectLocation={(loc) => {
          updateCity({
            name: loc.name,
            latitude: loc.latitude,
            longitude: loc.longitude,
            country: loc.country,
            admin1: loc.admin1,
          });
        }}
      />

      <HouseholdPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        preferences={preferences}
        onSavePreferences={(updated) => {
          updatePreferences(updated);
          showToast("Household preferences updated! Generated new clean-air plan.");
        }}
      />
    </div>
  );
}
