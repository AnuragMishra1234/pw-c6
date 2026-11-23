import { PrimaryTransport } from "@/types/household";
import { MobilityAnalysis, TransportComparison } from "@/types/mobility";

/**
 * Standardized urban passenger emission factors (g CO2e per passenger-kilometer).
 * Based on empirical transport lifecycle and fleet averages (DEFRA / IPCC / ARAI).
 */
export const EMISSION_FACTORS: Record<
  string,
  {
    label: string;
    factorGPerKm: number;
    occupancyNote: string;
    exposureLevelForSevereAqi: "very_high" | "high" | "moderate" | "low" | "very_low";
    exposureDescription: string;
    practicalSummary: string;
  }
> = {
  walking: {
    label: "Walking",
    factorGPerKm: 0,
    occupancyNote: "Active individual transit. 0 direct tailpipe emissions.",
    exposureLevelForSevereAqi: "very_high",
    exposureDescription:
      "Direct respiratory exposure to roadway plumes without cabin filtration.",
    practicalSummary:
      "Ideal for <2 km journeys when ambient AQI is good or moderate. During high smog, heavy breathing increases toxic intake.",
  },
  bicycle: {
    label: "Bicycle",
    factorGPerKm: 0,
    occupancyNote: "Zero tailpipe emissions. Active propulsion.",
    exposureLevelForSevereAqi: "very_high",
    exposureDescription:
      "Increased ventilation rate directly in roadside traffic pollution.",
    practicalSummary:
      "Best zero-emission option for short-to-medium trips on clean air days. Not recommended when AQI exceeds 150 without a respirator.",
  },
  two_wheeler: {
    label: "Two-Wheeler (Motorcycle / Scooter)",
    factorGPerKm: 75,
    occupancyNote: "Assumes average single rider on 100-150cc four-stroke engine.",
    exposureLevelForSevereAqi: "very_high",
    exposureDescription:
      "Rider sits directly in ambient exhaust vortex of surrounding trucks and cars.",
    practicalSummary:
      "Agile urban transport, but offers zero physical barrier against toxic particulates. Requires N95 mask in bad air.",
  },
  car: {
    label: "Solo Car (Petrol / Diesel)",
    factorGPerKm: 192,
    occupancyNote: "Assumes 1 occupant (driver only) in mid-size internal combustion passenger car.",
    exposureLevelForSevereAqi: "moderate",
    exposureDescription:
      "Cabin filters block some coarse dust, but fine PM2.5 and NO2 enter unless recirculation is active.",
    practicalSummary:
      "Highest per-passenger emissions. Reasonable protection from rain/dust if windows stay shut with AC on recirculate.",
  },
  carpool: {
    label: "Carpool (2-3 Persons)",
    factorGPerKm: 96,
    occupancyNote: "Assumes 2 passengers sharing fuel and emissions (192 g / 2).",
    exposureLevelForSevereAqi: "moderate",
    exposureDescription:
      "Similar cabin protection as private car, but cuts individual emissions in half.",
    practicalSummary:
      "Great balance of comfort and halving commuting carbon footprint.",
  },
  public_transport: {
    label: "City Bus (CNG / Clean Diesel)",
    factorGPerKm: 65,
    occupancyNote: "Assumes average municipal urban bus load factor (35-40 passengers).",
    exposureLevelForSevereAqi: "high",
    exposureDescription:
      "Frequent door openings allow roadside exhaust inside non-AC buses.",
    practicalSummary:
      "Cost-effective and sustainable. Prefer air-conditioned buses during heavy smog.",
  },
  metro: {
    label: "Metro / Urban Electric Rail",
    factorGPerKm: 35,
    occupancyNote: "Grid-powered electric transit, high ridership (assumes 40% clean grid mix).",
    exposureLevelForSevereAqi: "very_low",
    exposureDescription:
      "Underground and elevated stations are isolated from ground tailpipes; cars feature industrial HVAC filtration.",
    practicalSummary:
      "Gold standard for urban mobility: lowest per-passenger emissions AND lowest roadside pollution exposure.",
  },
  electric_bus: {
    label: "Electric Bus (e-Bus)",
    factorGPerKm: 45,
    occupancyNote: "Zero tailpipe emissions; lifecycle electricity emissions per passenger-km.",
    exposureLevelForSevereAqi: "low",
    exposureDescription:
      "Enclosed air-conditioned passenger cabin with regular air exchange.",
    practicalSummary:
      "Modern clean transit alternative cutting roadside NO2 and particulate emissions.",
  },
};

export class MobilityEmissionCalculator {
  /**
   * Calculates transparent emission comparisons between current transport and alternatives.
   */
  public static analyzeCommute(
    distanceKm: number,
    currentTransport: PrimaryTransport,
    currentAqi: number
  ): MobilityAnalysis {
    const rawDistance = typeof distanceKm === "number" && !isNaN(distanceKm) ? distanceKm : 10;
    const validDistance = Math.max(0.5, Math.min(100, rawDistance));
    const currentConfig = EMISSION_FACTORS[currentTransport] || EMISSION_FACTORS.car;
    const currentEmissions = Math.round(validDistance * currentConfig.factorGPerKm);

    // List of comparison alternatives
    const candidateModes: Array<keyof typeof EMISSION_FACTORS> = [
      "metro",
      "carpool",
      "public_transport",
      "two_wheeler",
      "bicycle",
      "walking",
      "car",
    ];

    const options: TransportComparison[] = candidateModes
      .filter((mode) => {
        // Exclude walking if distance > 6 km
        if (mode === "walking" && validDistance > 6) return false;
        // Exclude bicycle if distance > 18 km
        if (mode === "bicycle" && validDistance > 18) return false;
        return true;
      })
      .map((mode) => {
        const item = EMISSION_FACTORS[mode];
        const isCurrent = mode === currentTransport;
        const estimatedEmissionGrams = Math.round(validDistance * item.factorGPerKm);
        const emissionSavingsGrams = currentEmissions - estimatedEmissionGrams;

        // Is recommended for current AQI?
        const isSevereAqi = currentAqi > 150;
        let recommendedForAqi = true;
        if (isSevereAqi && (mode === "walking" || mode === "bicycle" || mode === "two_wheeler")) {
          recommendedForAqi = false; // direct exposure too severe during acute smog
        }

        return {
          mode: mode as any,
          label: item.label,
          isCurrentChoice: isCurrent,
          emissionFactorGPerKm: item.factorGPerKm,
          estimatedEmissionGrams,
          emissionSavingsGrams,
          exposureRiskLevel: item.exposureLevelForSevereAqi,
          exposureDescription: item.exposureDescription,
          practicalProsAndCons: item.practicalSummary,
          recommendedForAqi,
        };
      });

    // Determine best alternatives
    const validAlternatives = options.filter((o) => !o.isCurrentChoice);
    
    // Best emission option (lowest emissions)
    const sortedByEmissions = [...validAlternatives].sort(
      (a, b) => a.estimatedEmissionGrams - b.estimatedEmissionGrams
    );
    const bestLowEmissionOption =
      sortedByEmissions[0] || options[0];

    // Best low exposure option
    const exposureRank: Record<string, number> = {
      very_low: 1,
      low: 2,
      moderate: 3,
      high: 4,
      very_high: 5,
    };
    const sortedByExposure = [...validAlternatives].sort(
      (a, b) => exposureRank[a.exposureRiskLevel] - exposureRank[b.exposureRiskLevel]
    );
    const bestLowExposureOption = sortedByExposure[0] || options[0];

    const methodologyNote =
      "Estimated emissions = Distance (" +
      validDistance +
      " km) × Mode Emission Factor (g CO2e/p-km). " +
      "Estimates represent operational passenger-km averages based on IPCC/DEFRA transport benchmarking. " +
      "These values illustrate comparative emission impacts and are not directly measured tailpipe telemetry.";

    return {
      tripDistanceKm: validDistance,
      currentMode: currentTransport,
      currentEmissionsGrams: currentEmissions,
      options,
      bestLowEmissionOption,
      bestLowExposureOption,
      methodologyNote,
    };
  }
}
