"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AirQualityData } from "@/types/air-quality";

interface UseAirQualityOptions {
  latitude: number;
  longitude: number;
  locationName: string;
  adminArea?: string;
  country?: string;
  autoRefreshIntervalMs?: number;
}

export function useAirQuality({
  latitude,
  longitude,
  locationName,
  adminArea,
  country,
  autoRefreshIntervalMs = 300000, // 5 minutes default
}: UseAirQualityOptions) {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  // Keep ref to previous successful data so we preserve it on transient network errors
  const lastGoodDataRef = useRef<AirQualityData | null>(null);

  const fetchData = useCallback(
    async (isManualRefresh: boolean = false) => {
      if (isManualRefresh) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const params = new URLSearchParams({
          lat: latitude.toString(),
          lon: longitude.toString(),
          name: locationName,
        });
        if (adminArea) params.append("admin", adminArea);
        if (country) params.append("country", country);

        const res = await fetch(`/api/air-quality?${params.toString()}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || `HTTP error ${res.status}`);
        }

        setData(json.data);
        lastGoodDataRef.current = json.data;
        setLastFetchedAt(new Date());
      } catch (err: any) {
        console.error("Air quality fetch error:", err);
        setError(err.message || "Failed to retrieve live air quality");
        // Keep previous data visible if available
        if (lastGoodDataRef.current) {
          setData(lastGoodDataRef.current);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [latitude, longitude, locationName, adminArea, country]
  );

  useEffect(() => {
    fetchData(true);

    if (autoRefreshIntervalMs > 0) {
      const interval = setInterval(() => {
        fetchData(false);
      }, autoRefreshIntervalMs);
      return () => clearInterval(interval);
    }
  }, [fetchData, autoRefreshIntervalMs]);

  return {
    data,
    isLoading,
    error,
    lastFetchedAt,
    refresh: () => fetchData(true),
  };
}
