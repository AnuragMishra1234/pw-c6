import { EngineContext, DailyCleanAirPlan, Recommendation } from "./types";
import { recommendationRules } from "./rules";
import { getAQICategoryDetails } from "../air-quality/aqi-calculator";

export class CleanAirRecommendationEngine {
  /**
   * Deterministically evaluates context against clean-air heuristics.
   */
  public static evaluate(context: EngineContext): DailyCleanAirPlan {
    const { airQuality, preferences, evaluatedAt = new Date().toISOString() } = context;
    const aqiCategory = airQuality.aqiCategory;
    const aqiDetails = getAQICategoryDetails(airQuality.aqi);

    // 1. Evaluate applicable rules
    const allMatches: Recommendation[] = [];
    for (const rule of recommendationRules) {
      if (rule.applies(context)) {
        allMatches.push(rule.generate(context));
      }
    }

    // 2. Sort by priority: high > medium > low
    const priorityWeight: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    const sorted = [...allMatches].sort((a, b) => {
      const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (diff !== 0) return diff;
      return a.category.localeCompare(b.category);
    });

    // 3. Select top priority actions (3-5 for dashboard highlight, balanced by categories)
    const seenCategories = new Set<string>();
    const priorityActions: Recommendation[] = [];

    // First pass: 1 action per category from highest priority
    for (const rec of sorted) {
      if (!seenCategories.has(rec.category)) {
        seenCategories.add(rec.category);
        priorityActions.push(rec);
      }
      if (priorityActions.length >= 4) break;
    }

    // If less than 3, fill with remaining sorted
    if (priorityActions.length < 3) {
      for (const rec of sorted) {
        if (!priorityActions.some((p) => p.id === rec.id)) {
          priorityActions.push(rec);
        }
        if (priorityActions.length >= 3) break;
      }
    }

    // 4. Construct human-readable executive summary
    const summary = this.buildExecutiveSummary(context, priorityActions);

    return {
      id: `plan-${airQuality.locationName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`,
      generatedAt: evaluatedAt,
      aqiValue: airQuality.aqi,
      aqiCategory: aqiCategory,
      locationName: airQuality.locationName,
      recommendations: sorted,
      priorityActions,
      executiveSummary: summary,
    };
  }

  private static buildExecutiveSummary(
    context: EngineContext,
    priorityActions: Recommendation[]
  ): string {
    const { airQuality, preferences } = context;
    const aqi = airQuality.aqi;
    const category = airQuality.aqiCategory;
    const hasVulnerable =
      preferences.householdType === "family_with_children" ||
      preferences.householdType === "family_with_elderly" ||
      preferences.householdType === "multi_generational";

    if (category === "good") {
      return `Air quality in ${airQuality.locationName} is Good (US AQI ${aqi}). Atmospheric conditions are clear, making today ideal for outdoor sports, window aeration, and active walking or cycling.`;
    }

    if (category === "moderate") {
      return `Air quality in ${airQuality.locationName} is Moderate (US AQI ${aqi}). Conditions are satisfactory for general activities, but ${
        hasVulnerable
          ? "sensitive family members should avoid overexertion during prolonged afternoon sports."
          : "unusually sensitive individuals should stay alert for mild respiratory symptoms."
      }`;
    }

    if (category === "unhealthy_sensitive") {
      return `Air quality is Unhealthy for Sensitive Groups (US AQI ${aqi}). Fine particulate matter is elevated in ${airQuality.locationName}. ${
        hasVulnerable
          ? "Prioritize indoor activities for children and seniors and minimize heavy traffic exposure."
          : "Sensitive individuals should moderate heavy outdoor cardio workouts."
      }`;
    }

    if (category === "unhealthy") {
      return `Air quality has reached Unhealthy levels (US AQI ${aqi}) in ${airQuality.locationName}. Everyone should cut back on strenuous outdoor exertion. Move workouts indoors, close road-facing windows, and use particulate protection when traveling.`;
    }

    return `CRITICAL SMOG ALERT: Air quality in ${airQuality.locationName} is ${
      category === "hazardous" ? "Hazardous" : "Very Unhealthy"
    } (US AQI ${aqi}). Ambient particulate pollution poses immediate health risks. Keep all family members indoors in sealed spaces, run air purifiers or wet cleaning routines, and avoid unnecessary outdoor transit.`;
  }
}
