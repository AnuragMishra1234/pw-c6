import { AQICategory } from "./air-quality";

export type Priority = "high" | "medium" | "low";

export type RecommendationCategory =
  | "outdoor"
  | "indoor"
  | "mobility"
  | "family"
  | "sustainability";

export interface Recommendation {
  id: string;
  title: string;
  action: string;
  reason: string;
  impact: string;
  priority: Priority;
  category: RecommendationCategory;
  iconName: string;
  applicableConditions?: {
    aqiCategoryMin?: AQICategory;
    aqiCategoryMax?: AQICategory;
    targetActivities?: string[];
  };
}

export interface DailyCleanAirPlan {
  id: string;
  generatedAt: string;
  aqiValue: number;
  aqiCategory: AQICategory;
  locationName: string;
  recommendations: Recommendation[];
  executiveSummary: string;
  priorityActions: Recommendation[];
}
