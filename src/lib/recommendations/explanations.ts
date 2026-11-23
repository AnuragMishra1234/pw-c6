import { AQICategory } from "@/types/air-quality";
import { UserPreferences } from "@/types/household";

export function getOutdoorExplanation(
  category: AQICategory,
  hasChildrenOrElderly: boolean,
  isOutdoorWorker: boolean
): string {
  if (isOutdoorWorker) {
    if (category === "very_unhealthy" || category === "hazardous") {
      return "Because your work requires being outdoors during severe pollution, heavy physical exertion increases deep-lung particulate deposition. Taking scheduled indoor breaks and wearing a certified particulate respirator reduces cumulative particulate intake.";
    }
    return "Outdoor occupational exposure exposes you directly to traffic and construction particulates. Minimizing peak rush-hour roadside exposure protects long-term lung function.";
  }

  if (category === "good") {
    return "Current atmospheric conditions offer clean ambient air with minimal particulate hazard, making it ideal for aerobic outdoor activity and sports.";
  }

  if (category === "moderate") {
    return hasChildrenOrElderly
      ? "Air quality is acceptable for the general public, but children and elderly individuals breathe more air relative to body weight and should watch for throat irritation or coughing during extended outdoor games."
      : "Acceptable air conditions for normal activities. Sensitive individuals should observe if mild symptoms arise during strenuous workouts.";
  }

  if (category === "unhealthy_sensitive") {
    return hasChildrenOrElderly
      ? "Elevated fine particulate matter (PM2.5) can trigger respiratory airway inflammation in children and seniors. Shifting intense play indoors prevents excessive inhalation."
      : "Ambient particulates are high enough to trigger discomfort in people with respiratory sensitivity. Pace outdoor exertion accordingly.";
  }

  if (category === "unhealthy") {
    return "Particulate concentrations across the city are high enough to cause throat irritation and reduced lung capacity even in healthy adults during strenuous breathing. Shifting aerobic exercise indoors eliminates this acute stress.";
  }

  return "City air quality has reached critical pollution thresholds. Ambient particulates are dense enough to cause systemic cardiovascular and respiratory stress during heavy breathing. Outdoor physical exertion should be avoided.";
}

export function getIndoorExplanation(
  category: AQICategory,
  hasAirPurifier: boolean,
  nearBusyRoad: boolean
): string {
  if (hasAirPurifier) {
    if (category === "unhealthy" || category === "very_unhealthy" || category === "hazardous") {
      return "Running your HEPA purifier in a closed primary living/sleeping area creates a clean-air sanctuary. Keep doors and windows sealed to prevent continuous outdoor smog ingress.";
    }
    return "Periodic purifier operation maintains low indoor PM2.5 baseline. Run on auto or low mode during moderate outdoor conditions.";
  }

  // Without air purifier: affordable, realistic guidance
  if (category === "unhealthy" || category === "very_unhealthy" || category === "hazardous") {
    return nearBusyRoad
      ? "Your home is near a busy thoroughfare where vehicle exhaust readily penetrates cracks. Without a mechanical purifier, avoid indoor combustion (incense, frying) and seal gaps with damp towels to minimize particulate infiltration."
      : "Without a mechanical purifier, your priority is preventing additional internal particulate generation: avoid incense, scented candles, or unvented cooking, and use damp-mop cleaning to trap settled particles without resuspending dust.";
  }

  return "When outdoor air is acceptable, brief cross-ventilation flushes out indoor stale air and carbon dioxide. Monitor outdoor readings before opening windows.";
}

export function getMobilityExplanation(
  transport: string,
  category: AQICategory
): string {
  if (category === "very_unhealthy" || category === "hazardous") {
    return "Open-air travel modes (bicycles, open two-wheelers, walking) expose you directly to concentrated vehicle exhaust plumes and heavy ambient smog. Enclosed public transit like the metro significantly lowers direct inhalation of road-level toxic exhaust.";
  }
  return "Motor vehicles contribute substantially to urban nitrogen oxides and fine particulates. Choosing shared transit or cycling when air is clean reduces personal carbon footprints and community roadside emissions.";
}
