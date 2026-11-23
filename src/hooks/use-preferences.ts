"use client";

import { useState, useEffect, useCallback } from "react";
import { UserPreferences, DEFAULT_PREFERENCES } from "@/types/household";
import {
  loadUserPreferences,
  saveUserPreferences,
} from "@/lib/storage/local-storage";

export function usePreferences() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = loadUserPreferences();
    setPreferences(saved);
    setIsLoaded(true);
  }, []);

  const updatePreferences = useCallback(
    (updater: Partial<UserPreferences> | ((prev: UserPreferences) => UserPreferences)) => {
      setPreferences((prev) => {
        const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
        saveUserPreferences(next);
        return next;
      });
    },
    []
  );

  const updateCity = useCallback(
    (city: {
      name: string;
      latitude: number;
      longitude: number;
      country: string;
      admin1?: string;
    }) => {
      setPreferences((prev) => {
        const next = { ...prev, selectedCity: city };
        saveUserPreferences(next);
        return next;
      });
    },
    []
  );

  return {
    preferences,
    updatePreferences,
    updateCity,
    isLoaded,
  };
}
