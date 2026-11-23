import { describe, it, expect } from "vitest";
import { INDOOR_ADVICE_DATABASE, MYTHS_AND_FACTS } from "@/lib/indoor/advisor";

describe("Indoor Air Advisor Content & Evidence Database", () => {
  it("contains rich guidelines across all required categories", () => {
    const categories = new Set(INDOOR_ADVICE_DATABASE.map((i) => i.category));
    expect(categories.has("low_cost")).toBe(true);
    expect(categories.has("ventilation")).toBe(true);
    expect(categories.has("purifiers")).toBe(true);
    expect(categories.has("household")).toBe(true);
  });

  it("provides zero-cost damp mopping guidance", () => {
    const dampMopping = INDOOR_ADVICE_DATABASE.find(
      (i) => i.id === "low-cost-damp-cleaning"
    );
    expect(dampMopping).toBeDefined();
    expect(dampMopping?.costLevel).toBe("Free");
    expect(dampMopping?.details).toContain("microfiber cloth or mop");
  });

  it("contains evidence-based myth versus fact debunking", () => {
    expect(MYTHS_AND_FACTS.length).toBeGreaterThanOrEqual(4);

    const plantMyth = MYTHS_AND_FACTS.find((m) => m.id === "myth-plants-clean-rooms");
    expect(plantMyth).toBeDefined();
    expect(plantMyth?.fact).toContain("cannot filter high ambient PM2.5");
    expect(plantMyth?.takeaway).toBeTruthy();

    const maskMyth = MYTHS_AND_FACTS.find((m) => m.id === "myth-cloth-mask-sufficient");
    expect(maskMyth).toBeDefined();
    expect(maskMyth?.fact).toContain("Surgical and cloth masks allow over 70");
  });
});
