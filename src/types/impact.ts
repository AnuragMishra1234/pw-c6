export interface CompletedActionRecord {
  id: string;
  recommendationId: string;
  title: string;
  category: "outdoor" | "indoor" | "mobility" | "family" | "sustainability";
  completedAt: string; // ISO 8601
  co2SavedGrams?: number;
}

export interface DayImpactSummary {
  date: string; // YYYY-MM-DD
  actionsCompletedCount: number;
  estimatedCo2SavedGrams: number;
  lowEmissionTripsCount: number;
}

export interface UserImpactState {
  completedActions: CompletedActionRecord[];
  totalCo2SavedGrams: number;
  lowEmissionTripsCount: number;
  streakDays: number;
  lastActiveDate: string;
}
