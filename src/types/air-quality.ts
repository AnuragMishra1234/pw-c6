export type AQICategory =
  | "good"
  | "moderate"
  | "unhealthy_sensitive"
  | "unhealthy"
  | "very_unhealthy"
  | "hazardous";

export interface AQICategoryDetails {
  category: AQICategory;
  label: string;
  min: number;
  max: number;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  healthMessage: string;
  sensitiveGroupMessage: string;
}

export interface PollutantConcentrations {
  pm2_5: number | null; // µg/m³
  pm10: number | null; // µg/m³
  carbon_monoxide: number | null; // µg/m³
  nitrogen_dioxide: number | null; // µg/m³
  ozone: number | null; // µg/m³
  sulphur_dioxide: number | null; // µg/m³
}

export interface HourlyForecastPoint {
  time: string;
  aqi: number;
  pm2_5: number;
  pm10: number;
}

export interface AirQualityData {
  latitude: number;
  longitude: number;
  locationName: string;
  adminArea?: string;
  country?: string;
  timestamp: string; // ISO 8601
  aqi: number; // US AQI scale (Open-Meteo)
  aqiCategory: AQICategory;
  pollutants: PollutantConcentrations;
  hourlyForecast: HourlyForecastPoint[];
  dataSource: "Open-Meteo Air Quality API";
  indexStandard: "US AQI (EPA standard, retrieved from Open-Meteo; not official Indian CPCB)";
}

export interface GeocodingLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  country_code?: string;
  population?: number;
}
