import { describe, it, expect } from "vitest";
import { MobilityEmissionCalculator, EMISSION_FACTORS } from "@/lib/emissions/calculator";

describe("Mobility & Transport Emission Calculator", () => {
  it("calculates emissions using Distance × Mode Factor formula", () => {
    const distanceKm = 10;
    const analysis = MobilityEmissionCalculator.analyzeCommute(distanceKm, "car", 120);

    // Solo car factor: 192 g/km -> 10 * 192 = 1920g
    expect(analysis.currentEmissionsGrams).toBe(1920);

    const metroOpt = analysis.options.find((o) => o.mode === "metro");
    expect(metroOpt).toBeDefined();
    // Metro factor: 35 g/km -> 10 * 35 = 350g
    expect(metroOpt?.estimatedEmissionGrams).toBe(350);

    // Savings: 1920 - 350 = 1570g
    expect(metroOpt?.emissionSavingsGrams).toBe(1570);
  });

  it("handles carpool occupancy emissions correctly", () => {
    const distanceKm = 15;
    const analysis = MobilityEmissionCalculator.analyzeCommute(distanceKm, "carpool", 80);

    // Carpool factor: 96 g/p-km -> 15 * 96 = 1440g
    expect(analysis.currentEmissionsGrams).toBe(1440);
  });

  it("ensures walking and cycling have zero tailpipe emissions", () => {
    const analysis = MobilityEmissionCalculator.analyzeCommute(3, "walking", 40);
    const walkingOpt = analysis.options.find((o) => o.mode === "walking");
    const bikeOpt = analysis.options.find((o) => o.mode === "bicycle");

    expect(walkingOpt?.estimatedEmissionGrams).toBe(0);
    expect(bikeOpt?.estimatedEmissionGrams).toBe(0);
  });

  it("marks active outdoor modes as not recommended when AQI is severe", () => {
    // High AQI: 220
    const analysis = MobilityEmissionCalculator.analyzeCommute(5, "car", 220);
    const bikeOpt = analysis.options.find((o) => o.mode === "bicycle");
    const walkingOpt = analysis.options.find((o) => o.mode === "walking");
    const twoWheelerOpt = analysis.options.find((o) => o.mode === "two_wheeler");

    expect(bikeOpt?.recommendedForAqi).toBe(false);
    expect(walkingOpt?.recommendedForAqi).toBe(false);
    expect(twoWheelerOpt?.recommendedForAqi).toBe(false);
  });

  it("includes transparent methodology and non-measured disclaimer note", () => {
    const analysis = MobilityEmissionCalculator.analyzeCommute(12, "two_wheeler", 90);
    expect(analysis.methodologyNote).toContain("Estimated emissions = Distance");
    expect(analysis.methodologyNote).toContain("not directly measured");
  });

  it("clamps extreme distances safely without NaN", () => {
    const minAnalysis = MobilityEmissionCalculator.analyzeCommute(0, "car", 50);
    expect(minAnalysis.tripDistanceKm).toBe(0.5);

    const maxAnalysis = MobilityEmissionCalculator.analyzeCommute(150, "car", 50);
    expect(maxAnalysis.tripDistanceKm).toBe(100);
  });
});
