import { describe, it, expect } from "vitest";
import { queryGroqAssistant } from "@/lib/assistant/groq-client";
import fs from "fs";

describe("Groq AI Live Integration", () => {
  const hasEnv = fs.existsSync(".env.local");

  it.skipIf(!hasEnv)("queries Groq Cloud API with configured API key", async () => {
    const env = fs.readFileSync(".env.local", "utf8");
    env.split("\n").forEach((line) => {
      const [k, ...v] = line.split("=");
      if (k && v.length) process.env[k.trim()] = v.join("=").trim();
    });

    const res = await queryGroqAssistant({
      message: "Is it safe for kids to play soccer outside today?",
      airQuality: {
        locationName: "Delhi",
        aqi: 185,
        aqiCategory: "unhealthy",
      },
      preferences: {
        householdType: "family_with_children",
        activities: ["outdoor_exercise"],
        primaryTransport: "two_wheeler",
      },
    });

    expect(res.success).toBe(true);
    expect(res.isAiGenerated).toBe(true);
    expect(res.reply).toBeTruthy();
    expect(res.reply.length).toBeGreaterThan(15);
  });
});
