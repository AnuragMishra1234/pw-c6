export type HouseholdType =
  | "individual"
  | "family"
  | "family_with_children"
  | "family_with_elderly"
  | "multi_generational";

export type DailyActivity =
  | "outdoor_exercise"
  | "office_commute"
  | "school_commute"
  | "work_from_home"
  | "outdoor_worker"
  | "mostly_indoors";

export type PrimaryTransport =
  | "walking"
  | "bicycle"
  | "two_wheeler"
  | "car"
  | "public_transport";

export type HomeType =
  | "small_apartment"
  | "independent_house"
  | "multi_story_apartment";

export interface IndoorEnvironment {
  hasAirPurifier: boolean;
  hasIndoorPlants: boolean;
  nearBusyRoad: boolean;
  hasNaturalVentilation: boolean;
  homeType: HomeType;
}

export interface UserPreferences {
  householdType: HouseholdType;
  activities: DailyActivity[];
  primaryTransport: PrimaryTransport;
  commuteDistanceKm: number;
  indoorEnvironment: IndoorEnvironment;
  selectedCity: {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  };
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  householdType: "family_with_children",
  activities: ["office_commute", "outdoor_exercise"],
  primaryTransport: "two_wheeler",
  commuteDistanceKm: 12,
  indoorEnvironment: {
    hasAirPurifier: false,
    hasIndoorPlants: true,
    nearBusyRoad: true,
    hasNaturalVentilation: true,
    homeType: "small_apartment",
  },
  selectedCity: {
    name: "Delhi",
    latitude: 28.6139,
    longitude: 77.209,
    country: "India",
    admin1: "National Capital Territory of Delhi",
  },
};
