import { AQICategory, AQICategoryDetails } from "@/types/air-quality";

export const AQI_CATEGORY_CONFIG: Record<AQICategory, AQICategoryDetails> = {
  good: {
    category: "good",
    label: "Good",
    min: 0,
    max: 50,
    color: "#16A34A", // green-600
    textColor: "text-green-800",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    healthMessage:
      "Air quality is satisfactory and poses little or no health risk. Ideal conditions for outdoor activities.",
    sensitiveGroupMessage:
      "None. All individuals can comfortably engage in outdoor routines.",
  },
  moderate: {
    category: "moderate",
    label: "Moderate",
    min: 51,
    max: 100,
    color: "#D97706", // amber-600
    textColor: "text-amber-800",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    healthMessage:
      "Air quality is acceptable; however, some pollutants may cause moderate health concern for unusually sensitive individuals.",
    sensitiveGroupMessage:
      "Children and adults with asthma or respiratory sensitivities should monitor symptoms during prolonged outdoor exertion.",
  },
  unhealthy_sensitive: {
    category: "unhealthy_sensitive",
    label: "Unhealthy for Sensitive Groups",
    min: 101,
    max: 150,
    color: "#EA580C", // orange-600
    textColor: "text-orange-800",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    healthMessage:
      "Members of sensitive groups may experience health effects. The general public is less likely to be immediately affected.",
    sensitiveGroupMessage:
      "Children, elderly members, and individuals with respiratory or cardiovascular conditions should reduce prolonged outdoor exertion.",
  },
  unhealthy: {
    category: "unhealthy",
    label: "Unhealthy",
    min: 151,
    max: 200,
    color: "#DC2626", // red-600
    textColor: "text-red-800",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    healthMessage:
      "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
    sensitiveGroupMessage:
      "Sensitive groups should avoid prolonged outdoor exertion. General public should substantially reduce heavy outdoor exertion.",
  },
  very_unhealthy: {
    category: "very_unhealthy",
    label: "Very Unhealthy",
    min: 201,
    max: 300,
    color: "#7E22CE", // purple-700
    textColor: "text-purple-800",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    healthMessage:
      "Health alert: The risk of health effects is heightened for everyone in the population.",
    sensitiveGroupMessage:
      "Children, seniors, and individuals with heart/lung disease should stay indoors and keep activity levels low. Everyone should avoid outdoor exertion.",
  },
  hazardous: {
    category: "hazardous",
    label: "Hazardous",
    min: 301,
    max: 500,
    color: "#881337", // rose-900 / dark maroon
    textColor: "text-rose-900",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    healthMessage:
      "Health warning of emergency conditions: The entire population is likely to be affected by severe respiratory and cardiovascular stress.",
    sensitiveGroupMessage:
      "All individuals should remain indoors with filtered air and avoid physical exertion outdoors.",
  },
};

/**
 * Maps a numeric US AQI value to its category.
 * Boundary values:
 * 0-50 -> good
 * 51-100 -> moderate
 * 101-150 -> unhealthy_sensitive
 * 151-200 -> unhealthy
 * 201-300 -> very_unhealthy
 * 301+ -> hazardous
 */
export function getAQICategory(aqi: number): AQICategory {
  if (isNaN(aqi) || aqi < 0) return "good";
  const rounded = Math.round(aqi);

  if (rounded <= 50) return "good";
  if (rounded <= 100) return "moderate";
  if (rounded <= 150) return "unhealthy_sensitive";
  if (rounded <= 200) return "unhealthy";
  if (rounded <= 300) return "very_unhealthy";
  return "hazardous";
}

export function getAQICategoryDetails(aqi: number): AQICategoryDetails {
  const category = getAQICategory(aqi);
  return AQI_CATEGORY_CONFIG[category];
}

/**
 * Severity weight from 0 (clean) to 5 (extreme hazard)
 * Useful for deterministic recommendation logic.
 */
export function getAQISeverityIndex(category: AQICategory): number {
  switch (category) {
    case "good":
      return 0;
    case "moderate":
      return 1;
    case "unhealthy_sensitive":
      return 2;
    case "unhealthy":
      return 3;
    case "very_unhealthy":
      return 4;
    case "hazardous":
      return 5;
  }
}
