import { describe, it, expect } from "vitest";
import { CleanAirRecommendationEngine } from "@/lib/recommendations/engine";
import { AirQualityData } from "@/types/air-quality";
import { UserPreferences, DEFAULT_PREFERENCES } from "@/types/household";

function createMockAqiData(aqi: number, location = "Delhi"): AirQualityData {
  return {
    latitude: 28.6139,
    longitude: 77.209,
    locationName: location,
    adminArea: "Delhi",
    country: "India",
    timestamp: "2026-11-23T10:00:00Z",
    aqi,
    aqiCategory:
      aqi <= 50
        ? "good"
        : aqi <= 100
        ? "moderate"
        : aqi <= 150
        ? "unhealthy_sensitive"
        : aqi <= 200
        ? "unhealthy"
        : aqi <= 300
        ? "very_unhealthy"
        : "hazardous",
    pollutants: {
      pm2_5: aqi * 0.8,
      pm10: aqi * 1.5,
      carbon_monoxide: 450,
      nitrogen_dioxide: 42,
      ozone: 28,
      sulphur_dioxide: 12,
    },
    hourlyForecast: [],
    dataSource: "Open-Meteo Air Quality API",
    indexStandard: "US AQI (EPA standard, retrieved from Open-Meteo; not official Indian CPCB)",
  };
}

describe("Clean Air Recommendation Engine", () => {
  it("encourages outdoor activities when AQI is Good", () => {
    const aqi = createMockAqiData(35, "Bengaluru");
    const plan = CleanAirRecommendationEngine.evaluate({
      airQuality: aqi,
      preferences: DEFAULT_PREFERENCES,
    });

    expect(plan.aqiCategory).toBe("good");
    expect(plan.recommendations.some((r) => r.id === "outdoor-clean-routine")).toBe(true);
    expect(plan.recommendations.some((r) => r.id === "mobility-clean-choice")).toBe(true);
    expect(plan.executiveSummary).toContain("Good");
  });

  it("produces strong precautions when AQI is Unhealthy (175)", () => {
    const aqi = createMockAqiData(175, "Delhi");
    const plan = CleanAirRecommendationEngine.evaluate({
      airQuality: aqi,
      preferences: {
        ...DEFAULT_PREFERENCES,
        activities: ["outdoor_exercise", "office_commute"],
      },
    });

    expect(plan.aqiCategory).toBe("unhealthy");
    expect(plan.recommendations.some((r) => r.id === "outdoor-unhealthy-warning")).toBe(true);
    expect(plan.recommendations.some((r) => r.id === "exercise-indoor-alternative")).toBe(true);
  });

  it("prioritizes pediatric guidance for households with children during severe air", () => {
    const aqi = createMockAqiData(220, "Delhi");
    const plan = CleanAirRecommendationEngine.evaluate({
      airQuality: aqi,
      preferences: {
        ...DEFAULT_PREFERENCES,
        householdType: "family_with_children",
      },
    });

    const hasChildGuidance = plan.recommendations.some(
      (r) => r.id === "family-children-school-guidance"
    );
    expect(hasChildGuidance).toBe(true);
  });

  it("prioritizes senior cardiovascular precautions for elderly households", () => {
    const aqi = createMockAqiData(180, "Mumbai");
    const plan = CleanAirRecommendationEngine.evaluate({
      airQuality: aqi,
      preferences: {
        ...DEFAULT_PREFERENCES,
        householdType: "family_with_elderly",
      },
    });

    const hasElderlyGuidance = plan.recommendations.some(
      (r) => r.id === "family-elderly-cardio-caution"
    );
    expect(hasElderlyGuidance).toBe(true);
  });

  it("suggests affordable zero-purifier routines when user has no air purifier", () => {
    const aqi = createMockAqiData(160, "Kolkata");
    const plan = CleanAirRecommendationEngine.evaluate({
      airQuality: aqi,
      preferences: {
        ...DEFAULT_PREFERENCES,
        indoorEnvironment: {
          ...DEFAULT_PREFERENCES.indoorEnvironment,
          hasAirPurifier: false,
        },
      },
    });

    const hasNoPurifierAdvice = plan.recommendations.some(
      (r) => r.id === "indoor-no-purifier-low-cost"
    );
    expect(hasNoPurifierAdvice).toBe(true);
    const rec = plan.recommendations.find((r) => r.id === "indoor-no-purifier-low-cost");
    expect(rec?.action).toContain("wet-cloth wiping");
  });

  it("suggests HEPA sanctuary room when user owns an air purifier", () => {
    const aqi = createMockAqiData(190, "Delhi");
    const plan = CleanAirRecommendationEngine.evaluate({
      airQuality: aqi,
      preferences: {
        ...DEFAULT_PREFERENCES,
        indoorEnvironment: {
          ...DEFAULT_PREFERENCES.indoorEnvironment,
          hasAirPurifier: true,
        },
      },
    });

    const hasPurifierAdvice = plan.recommendations.some(
      (r) => r.id === "indoor-purifier-sanctuary"
    );
    expect(hasPurifierAdvice).toBe(true);
  });

  it("gives practical occupational protection for outdoor workers", () => {
    const aqi = createMockAqiData(185, "Delhi");
    const plan = CleanAirRecommendationEngine.evaluate({
      airQuality: aqi,
      preferences: {
        ...DEFAULT_PREFERENCES,
        activities: ["outdoor_worker"],
      },
    });

    const workerRec = plan.recommendations.find(
      (r) => r.id === "family-outdoor-worker-practical"
    );
    expect(workerRec).toBeDefined();
    expect(workerRec?.action).toContain("N95/FFP2 respirator");
  });

  it("updates plan dynamically when user changes lifestyle preferences", () => {
    const aqi = createMockAqiData(160, "Delhi");

    const plan1 = CleanAirRecommendationEngine.evaluate({
      airQuality: aqi,
      preferences: {
        ...DEFAULT_PREFERENCES,
        primaryTransport: "two_wheeler",
      },
    });
    expect(plan1.recommendations.some((r) => r.id === "mobility-two-wheeler-protection")).toBe(true);

    const plan2 = CleanAirRecommendationEngine.evaluate({
      airQuality: aqi,
      preferences: {
        ...DEFAULT_PREFERENCES,
        primaryTransport: "car",
      },
    });
    expect(plan2.recommendations.some((r) => r.id === "mobility-car-driver-recirculation")).toBe(true);
  });
});
