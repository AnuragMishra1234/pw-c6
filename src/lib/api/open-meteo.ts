import {
  AirQualityData,
  GeocodingLocation,
  PollutantConcentrations,
  HourlyForecastPoint,
} from "@/types/air-quality";
import { getAQICategory } from "../air-quality/aqi-calculator";

const GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const AIR_QUALITY_BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const DEFAULT_TIMEOUT_MS = 9000;

interface RawGeocodingItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  country_code?: string;
  population?: number;
}

interface RawGeocodingResponse {
  results?: RawGeocodingItem[];
}

interface RawAirQualityCurrent {
  time?: string;
  us_aqi?: number;
  pm10?: number;
  pm2_5?: number;
  carbon_monoxide?: number;
  nitrogen_dioxide?: number;
  ozone?: number;
  sulphur_dioxide?: number;
}

interface RawAirQualityHourly {
  time?: string[];
  us_aqi?: number[];
  pm10?: number[];
  pm2_5?: number[];
}

interface RawAirQualityResponse {
  current?: RawAirQualityCurrent;
  hourly?: RawAirQualityHourly;
}

/**
 * Searches locations using Open-Meteo Geocoding API.
 */
export async function searchLocations(
  query: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<GeocodingLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(
    trimmed
  )}&count=8&language=en&format=json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache geocoding lookups for 1 hour
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Geocoding API responded with HTTP status ${response.status}`);
    }

    const data: RawGeocodingResponse = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: RawGeocodingItem) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || "",
      admin1: item.admin1 || "",
      country_code: item.country_code || "",
      population: item.population,
    }));
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    const err = error instanceof Error ? error : new Error(String(error));
    if (err.name === "AbortError") {
      throw new Error("Location search timed out. Please check your internet connection.");
    }
    throw err;
  }
}

/**
 * Fetches real-time and forecast air quality data from Open-Meteo Air Quality API.
 */
export async function fetchAirQualityData(
  latitude: number,
  longitude: number,
  locationName: string,
  adminArea?: string,
  country?: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<AirQualityData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current:
      "us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide",
    hourly: "us_aqi,pm10,pm2_5",
    timezone: "auto",
    forecast_days: "2",
  });

  const url = `${AIR_QUALITY_BASE_URL}?${params.toString()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache air quality readings for 5 minutes
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Air Quality API responded with HTTP status ${response.status}`);
    }

    const json: RawAirQualityResponse = await response.json();

    if (!json.current) {
      throw new Error("Air Quality API response did not contain current readings");
    }

    const cur = json.current;
    const aqi = typeof cur.us_aqi === "number" ? Math.round(cur.us_aqi) : 0;
    const aqiCategory = getAQICategory(aqi);

    const pollutants: PollutantConcentrations = {
      pm2_5: typeof cur.pm2_5 === "number" ? Math.round(cur.pm2_5 * 10) / 10 : null,
      pm10: typeof cur.pm10 === "number" ? Math.round(cur.pm10 * 10) / 10 : null,
      carbon_monoxide:
        typeof cur.carbon_monoxide === "number"
          ? Math.round(cur.carbon_monoxide * 10) / 10
          : null,
      nitrogen_dioxide:
        typeof cur.nitrogen_dioxide === "number"
          ? Math.round(cur.nitrogen_dioxide * 10) / 10
          : null,
      ozone: typeof cur.ozone === "number" ? Math.round(cur.ozone * 10) / 10 : null,
      sulphur_dioxide:
        typeof cur.sulphur_dioxide === "number"
          ? Math.round(cur.sulphur_dioxide * 10) / 10
          : null,
    };

    // Extract next 24 hourly forecast points
    const hourlyForecast: HourlyForecastPoint[] = [];
    if (json.hourly && Array.isArray(json.hourly.time)) {
      const times: string[] = json.hourly.time;
      const aqis: number[] = json.hourly.us_aqi || [];
      const pm25s: number[] = json.hourly.pm2_5 || [];
      const pm10s: number[] = json.hourly.pm10 || [];

      // Find current hour index or start from 0
      const currentIsoTime = cur.time;
      let startIndex = times.findIndex((t) =>
        Boolean(currentIsoTime && t.startsWith(currentIsoTime.substring(0, 13)))
      );
      if (startIndex < 0) startIndex = 0;

      // Extract next 24 hours
      const sliceEnd = Math.min(times.length, startIndex + 24);
      for (let i = startIndex; i < sliceEnd; i++) {
        hourlyForecast.push({
          time: times[i],
          aqi: typeof aqis[i] === "number" ? Math.round(aqis[i]) : 0,
          pm2_5: typeof pm25s[i] === "number" ? Math.round(pm25s[i] * 10) / 10 : 0,
          pm10: typeof pm10s[i] === "number" ? Math.round(pm10s[i] * 10) / 10 : 0,
        });
      }
    }

    return {
      latitude,
      longitude,
      locationName,
      adminArea,
      country,
      timestamp: cur.time || new Date().toISOString(),
      aqi,
      aqiCategory,
      pollutants,
      hourlyForecast,
      dataSource: "Open-Meteo Air Quality API",
      indexStandard: "US AQI (EPA standard, retrieved from Open-Meteo; not official Indian CPCB)",
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    const err = error instanceof Error ? error : new Error(String(error));
    if (err.name === "AbortError") {
      throw new Error("Air quality request timed out. Please try again.");
    }
    throw err;
  }
}
