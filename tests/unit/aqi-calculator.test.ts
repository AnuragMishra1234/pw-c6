import { describe, it, expect } from "vitest";
import {
  getAQICategory,
  getAQICategoryDetails,
  getAQISeverityIndex,
} from "@/lib/air-quality/aqi-calculator";

describe("AQI Category Classification & Boundary Values", () => {
  it("should classify 0-50 as 'good'", () => {
    expect(getAQICategory(0)).toBe("good");
    expect(getAQICategory(25)).toBe("good");
    expect(getAQICategory(50)).toBe("good");
  });

  it("should classify 51-100 as 'moderate'", () => {
    expect(getAQICategory(51)).toBe("moderate");
    expect(getAQICategory(75)).toBe("moderate");
    expect(getAQICategory(100)).toBe("moderate");
  });

  it("should classify 101-150 as 'unhealthy_sensitive'", () => {
    expect(getAQICategory(101)).toBe("unhealthy_sensitive");
    expect(getAQICategory(125)).toBe("unhealthy_sensitive");
    expect(getAQICategory(150)).toBe("unhealthy_sensitive");
  });

  it("should classify 151-200 as 'unhealthy'", () => {
    expect(getAQICategory(151)).toBe("unhealthy");
    expect(getAQICategory(175)).toBe("unhealthy");
    expect(getAQICategory(200)).toBe("unhealthy");
  });

  it("should classify 201-300 as 'very_unhealthy'", () => {
    expect(getAQICategory(201)).toBe("very_unhealthy");
    expect(getAQICategory(250)).toBe("very_unhealthy");
    expect(getAQICategory(300)).toBe("very_unhealthy");
  });

  it("should classify 301 and above as 'hazardous'", () => {
    expect(getAQICategory(301)).toBe("hazardous");
    expect(getAQICategory(450)).toBe("hazardous");
    expect(getAQICategory(999)).toBe("hazardous");
  });

  it("should handle edge cases: NaN, negative, float decimals", () => {
    expect(getAQICategory(NaN)).toBe("good");
    expect(getAQICategory(-10)).toBe("good");
    expect(getAQICategory(50.4)).toBe("good");
    expect(getAQICategory(50.6)).toBe("moderate");
  });

  it("should return complete details for any AQI", () => {
    const details = getAQICategoryDetails(125);
    expect(details.category).toBe("unhealthy_sensitive");
    expect(details.label).toBe("Unhealthy for Sensitive Groups");
    expect(details.color).toBe("#EA580C");
    expect(details.healthMessage).toBeTruthy();
    expect(details.sensitiveGroupMessage).toBeTruthy();
  });

  it("should return ascending severity indices", () => {
    expect(getAQISeverityIndex("good")).toBe(0);
    expect(getAQISeverityIndex("moderate")).toBe(1);
    expect(getAQISeverityIndex("unhealthy_sensitive")).toBe(2);
    expect(getAQISeverityIndex("unhealthy")).toBe(3);
    expect(getAQISeverityIndex("very_unhealthy")).toBe(4);
    expect(getAQISeverityIndex("hazardous")).toBe(5);
  });
});
