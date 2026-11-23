import { AirQualityData, AQICategory } from "@/types/air-quality";
import { UserPreferences } from "@/types/household";
import { Recommendation, DailyCleanAirPlan } from "@/types/recommendations";

export interface EngineContext {
  airQuality: AirQualityData;
  preferences: UserPreferences;
  evaluatedAt?: string;
}

export interface RecommendationRule {
  id: string;
  category: "outdoor" | "indoor" | "mobility" | "family" | "sustainability";
  applies: (context: EngineContext) => boolean;
  generate: (context: EngineContext) => Recommendation;
}

export type { Recommendation, DailyCleanAirPlan, AQICategory };
