import { PrimaryTransport } from "./household";

export interface TransportComparison {
  mode: PrimaryTransport | "metro" | "carpool" | "electric_bus";
  label: string;
  isCurrentChoice: boolean;
  emissionFactorGPerKm: number; // grams CO2 equivalent per passenger-km
  estimatedEmissionGrams: number; // for trip distance
  emissionSavingsGrams: number; // compared to current mode (positive = savings)
  exposureRiskLevel: "very_high" | "high" | "moderate" | "low" | "very_low";
  exposureDescription: string;
  practicalProsAndCons: string;
  recommendedForAqi: boolean;
}

export interface MobilityAnalysis {
  tripDistanceKm: number;
  currentMode: PrimaryTransport;
  currentEmissionsGrams: number;
  options: TransportComparison[];
  bestLowEmissionOption: TransportComparison;
  bestLowExposureOption: TransportComparison;
  methodologyNote: string;
}
