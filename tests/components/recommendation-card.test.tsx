import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { Recommendation } from "@/types/recommendations";

const mockRecommendation: Recommendation = {
  id: "test-rec-1",
  title: "Shift Heavy Workouts Indoors",
  action: "Perform indoor bodyweight exercises instead of running near traffic.",
  reason: "Elevated particulate concentrations increase deep airway deposition during cardio.",
  impact: "Reduces acute airway inflammation by up to 50%.",
  priority: "high",
  category: "outdoor",
  iconName: "ShieldAlert",
  applicableConditions: {},
};

describe("RecommendationCard Component", () => {
  it("renders title, action, priority, and category correctly", () => {
    const handleToggle = vi.fn();
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        isCompleted={false}
        onToggleComplete={handleToggle}
      />
    );

    expect(screen.getByText("Shift Heavy Workouts Indoors")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Perform indoor bodyweight exercises instead of running near traffic."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("High Priority")).toBeInTheDocument();
    expect(screen.getByText("Outdoor Activity")).toBeInTheDocument();
  });

  it("expands rationale and benefit when clicked", () => {
    const handleToggle = vi.fn();
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        isCompleted={false}
        onToggleComplete={handleToggle}
      />
    );

    // Initial state: rationale is not visible
    expect(screen.queryByText("Evidence & Decision Reason")).not.toBeInTheDocument();

    // Click toggle button
    const toggleButton = screen.getByText("Why this action matters");
    fireEvent.click(toggleButton);

    // Expanded state: evidence is visible
    expect(screen.getByText("Evidence & Decision Reason")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Elevated particulate concentrations increase deep airway deposition during cardio."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Reduces acute airway inflammation by up to 50%.")
    ).toBeInTheDocument();
  });

  it("calls onToggleComplete when completion button is clicked", () => {
    const handleToggle = vi.fn();
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        isCompleted={false}
        onToggleComplete={handleToggle}
      />
    );

    const completeBtn = screen.getByRole("button", {
      name: /mark action completed/i,
    });
    fireEvent.click(completeBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(mockRecommendation);
  });
});
