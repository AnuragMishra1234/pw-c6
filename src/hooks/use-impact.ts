"use client";

import { useState, useEffect, useCallback } from "react";
import { UserImpactState, CompletedActionRecord } from "@/types/impact";
import {
  loadUserImpact,
  addCompletedAction,
  DEFAULT_IMPACT_STATE,
} from "@/lib/storage/local-storage";

export function useImpact() {
  const [impact, setImpact] = useState<UserImpactState>(DEFAULT_IMPACT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = loadUserImpact();
    setImpact(saved);
    setIsLoaded(true);
  }, []);

  const markActionComplete = useCallback(
    (action: Omit<CompletedActionRecord, "id" | "completedAt">) => {
      const updated = addCompletedAction(action);
      setImpact(updated);
      return updated;
    },
    []
  );

  const isActionCompleted = useCallback(
    (recommendationId: string) => {
      const today = new Date().toISOString().slice(0, 10);
      return impact.completedActions.some(
        (a) =>
          a.recommendationId === recommendationId &&
          a.completedAt.startsWith(today)
      );
    },
    [impact.completedActions]
  );

  return {
    impact,
    markActionComplete,
    isActionCompleted,
    isLoaded,
  };
}
