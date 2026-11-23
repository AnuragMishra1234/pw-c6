import { describe, it, expect } from "vitest";
import {
  AssistantRequestSchema,
  checkRateLimit,
  getDeterministicFallbackReply,
  queryGroqAssistant,
} from "@/lib/assistant/groq-client";

describe("Assistant Security & Validation", () => {
  it("accepts valid assistant request payloads", () => {
    const validPayload = {
      message: "Is it safe to go for a run right now?",
      airQuality: {
        locationName: "Delhi",
        aqi: 160,
        aqiCategory: "unhealthy",
      },
      preferences: {
        householdType: "individual",
        activities: ["outdoor_exercise"],
        primaryTransport: "bicycle",
      },
    };

    const result = AssistantRequestSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects input exceeding 500 characters", () => {
    const longMessage = "a".repeat(501);
    const payload = {
      message: longMessage,
      airQuality: {
        locationName: "Delhi",
        aqi: 100,
        aqiCategory: "moderate",
      },
    };

    const result = AssistantRequestSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain("500 characters limit");
    }
  });

  it("rejects empty or whitespace-only messages", () => {
    const payload = {
      message: "   ",
      airQuality: {
        locationName: "Delhi",
        aqi: 100,
        aqiCategory: "moderate",
      },
    };

    const result = AssistantRequestSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("enforces rate limits per IP address", () => {
    const testIp = `test-ip-${Date.now()}`;
    // Up to 20 should be allowed
    for (let i = 0; i < 20; i++) {
      const check = checkRateLimit(testIp);
      expect(check.allowed).toBe(true);
    }

    // 21st request should be blocked
    const blockedCheck = checkRateLimit(testIp);
    expect(blockedCheck.allowed).toBe(false);
    expect(blockedCheck.remaining).toBe(0);
  });

  it("generates deterministic fallback responses without external network", () => {
    const fallbackKids = getDeterministicFallbackReply(
      "Can children play outside?",
      { locationName: "Delhi", aqi: 180, aqiCategory: "unhealthy" },
      { householdType: "family_with_children", activities: [], primaryTransport: "car" }
    );
    expect(fallbackKids).toContain("Unhealthy");
    expect(fallbackKids).toContain("Children should avoid");

    const fallbackPurifier = getDeterministicFallbackReply(
      "I do not have an air purifier",
      { locationName: "Bengaluru", aqi: 70, aqiCategory: "moderate" },
      {
        householdType: "family",
        activities: [],
        primaryTransport: "two_wheeler",
        indoorEnvironment: { hasAirPurifier: false, nearBusyRoad: true, hasNaturalVentilation: true },
      }
    );
    expect(fallbackPurifier).toContain("damp mop");
  });

  it("safely falls back to deterministic engine when GROQ_API_KEY is not set", async () => {
    delete process.env.GROQ_API_KEY;

    const res = await queryGroqAssistant({
      message: "Can my kids play soccer today?",
      airQuality: { locationName: "Delhi", aqi: 190, aqiCategory: "unhealthy" },
    });

    expect(res.success).toBe(true);
    expect(res.isAiGenerated).toBe(false);
    expect(res.reply).toBeTruthy();
  });
});
