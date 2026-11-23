import { UserPreferences, DEFAULT_PREFERENCES } from "@/types/household";
import { UserImpactState, CompletedActionRecord } from "@/types/impact";

const STORAGE_KEYS = {
  PREFERENCES: "breathewise_preferences_v1",
  IMPACT: "breathewise_impact_v1",
  LAST_AQI_CACHE: "breathewise_last_aqi_v1",
};

export const DEFAULT_IMPACT_STATE: UserImpactState = {
  completedActions: [],
  totalCo2SavedGrams: 0,
  lowEmissionTripsCount: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().slice(0, 10),
};

export function loadUserPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      indoorEnvironment: {
        ...DEFAULT_PREFERENCES.indoorEnvironment,
        ...(parsed.indoorEnvironment || {}),
      },
      selectedCity: {
        ...DEFAULT_PREFERENCES.selectedCity,
        ...(parsed.selectedCity || {}),
      },
    };
  } catch (e) {
    console.warn("Failed to load user preferences from localStorage:", e);
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: UserPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.warn("Failed to save user preferences to localStorage:", e);
  }
}

export function loadUserImpact(): UserImpactState {
  if (typeof window === "undefined") {
    return DEFAULT_IMPACT_STATE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.IMPACT);
    if (!raw) return DEFAULT_IMPACT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_IMPACT_STATE,
      ...parsed,
      completedActions: Array.isArray(parsed.completedActions)
        ? parsed.completedActions
        : [],
    };
  } catch (e) {
    console.warn("Failed to load impact state from localStorage:", e);
    return DEFAULT_IMPACT_STATE;
  }
}

export function saveUserImpact(impact: UserImpactState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(impact));
  } catch (e) {
    console.warn("Failed to save impact state to localStorage:", e);
  }
}

export function addCompletedAction(
  action: Omit<CompletedActionRecord, "id" | "completedAt">
): UserImpactState {
  const current = loadUserImpact();
  const today = new Date().toISOString().slice(0, 10);

  const newRecord: CompletedActionRecord = {
    ...action,
    id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    completedAt: new Date().toISOString(),
  };

  const isLowEmission = action.category === "mobility";
  const co2Bonus = action.co2SavedGrams || (isLowEmission ? 350 : 50);

  // Update streak if active on consecutive days
  let newStreak = current.streakDays;
  if (current.lastActiveDate !== today) {
    const lastDate = new Date(current.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.round(
      (currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
    );
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }

  const updated: UserImpactState = {
    completedActions: [newRecord, ...current.completedActions].slice(0, 50),
    totalCo2SavedGrams: current.totalCo2SavedGrams + co2Bonus,
    lowEmissionTripsCount:
      current.lowEmissionTripsCount + (isLowEmission ? 1 : 0),
    streakDays: newStreak,
    lastActiveDate: today,
  };

  saveUserImpact(updated);
  return updated;
}
