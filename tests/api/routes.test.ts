import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as geocodingHandler } from "@/app/api/geocoding/route";
import { GET as airQualityHandler } from "@/app/api/air-quality/route";
import { POST as assistantHandler } from "@/app/api/assistant/route";

describe("API Route Handlers", () => {
  describe("GET /api/geocoding", () => {
    it("returns 400 when query parameter 'q' is missing or too short", async () => {
      const req = new NextRequest("http://localhost:3000/api/geocoding?q=a");
      const res = await geocodingHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("must be at least 2 characters long");
    });

    it("returns 200 and search results for a valid city query", async () => {
      const req = new NextRequest("http://localhost:3000/api/geocoding?q=Delhi");
      const res = await geocodingHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.results)).toBe(true);
    });
  });

  describe("GET /api/air-quality", () => {
    it("returns 400 when coordinates are missing", async () => {
      const req = new NextRequest("http://localhost:3000/api/air-quality");
      const res = await airQualityHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("are required");
    });

    it("returns 400 when coordinates are out of valid range", async () => {
      const req = new NextRequest("http://localhost:3000/api/air-quality?lat=95&lon=190");
      const res = await airQualityHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("Coordinates must be valid numbers");
    });

    it("returns 200 and live air quality data for valid coordinates", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/air-quality?lat=28.6139&lon=77.209&name=Delhi"
      );
      const res = await airQualityHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.locationName).toBe("Delhi");
      expect(typeof json.data.aqi).toBe("number");
      expect(json.data.pollutants).toBeDefined();
    });
  });

  describe("POST /api/assistant", () => {
    it("rejects questions longer than 500 characters with 400", async () => {
      const longMessage = "a".repeat(501);
      const req = new NextRequest("http://localhost:3000/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: longMessage,
          airQuality: { locationName: "Delhi", aqi: 150, aqiCategory: "unhealthy" },
        }),
      });

      const res = await assistantHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("Validation failed");
    });

    it("accepts valid requests and returns response with sourceContext", async () => {
      const req = new NextRequest("http://localhost:3000/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Can my children play outside today?",
          airQuality: { locationName: "Delhi", aqi: 180, aqiCategory: "unhealthy" },
          preferences: {
            householdType: "family_with_children",
            activities: ["outdoor_exercise"],
            primaryTransport: "car",
          },
        }),
      });

      const res = await assistantHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.reply).toBeTruthy();
      expect(json.sourceContext.location).toBe("Delhi");
    });
  });
});
