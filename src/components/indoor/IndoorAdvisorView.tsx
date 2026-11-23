"use client";

import React, { useState } from "react";
import {
  INDOOR_ADVICE_DATABASE,
  MYTHS_AND_FACTS,
  IndoorAdviceItem,
} from "@/lib/indoor/advisor";
import {
  Sparkles,
  Wind,
  DoorOpen,
  Home,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Check,
  X,
  Filter,
} from "lucide-react";

type IndoorTabType = "all" | "low_cost" | "ventilation" | "purifiers" | "household" | "myths";

export const IndoorAdvisorView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<IndoorTabType>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tabs: Array<{ id: IndoorTabType; label: string }> = [
    { id: "all", label: "All Guidelines" },
    { id: "low_cost", label: "Low-Cost / Free Actions" },
    { id: "ventilation", label: "Ventilation Timing" },
    { id: "purifiers", label: "HEPA Purifiers" },
    { id: "household", label: "Vulnerable & Homes" },
    { id: "myths", label: "Smog Myths vs Facts" },
  ];

  const filteredAdvice = INDOOR_ADVICE_DATABASE.filter((item) => {
    if (activeTab !== "all" && activeTab !== "myths" && item.category !== activeTab) {
      return false;
    }
    if (selectedTag && !item.tags.includes(selectedTag)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-forest-800 to-forest-900 p-6 md:p-8 text-white shadow-card">
        <div className="inline-flex items-center gap-2 rounded-full bg-forest-700/60 px-3 py-1 text-xs font-semibold text-forest-200 mb-3 border border-forest-600/40">
          <Sparkles className="h-3.5 w-3.5" />
          Indoor Air Sanctuary Advisor
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Breathe Cleaner Air Indoors
        </h2>
        <p className="mt-2 text-sm text-forest-100/90 max-w-2xl leading-relaxed">
          Most families spend over 85% of their day indoors. Practical low-cost habits,
          proper ventilation timing, and combustion elimination can cut personal particulate
          exposure dramatically—even without high-end appliances.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedTag(null);
            }}
            className={`pb-3 px-3 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-forest-700 text-forest-800"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Situational Quick Filter Tags */}
      {activeTab !== "myths" && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Quick Situations:
          </span>
          {["Zero-Cost", "Cleaning", "Kitchen", "Windows", "Apartment", "Children", "HEPA"].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selectedTag === tag
                    ? "bg-forest-700 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-forest-50"
                }`}
              >
                {tag}
              </button>
            )
          )}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-xs text-forest-700 underline font-semibold ml-1"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Content Grid */}
      {activeTab === "myths" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MYTHS_AND_FACTS.map((mf) => (
            <div
              key={mf.id}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="rounded-lg bg-red-50 p-1.5 text-red-600 shrink-0 mt-0.5">
                    <X className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">
                      Common Misconception
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 mt-0.5 leading-snug">
                      &ldquo;{mf.myth}&rdquo;
                    </h4>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-gray-100">
                  <div className="rounded-lg bg-green-50 p-1.5 text-green-700 shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 block">
                      Scientific Reality
                    </span>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">{mf.fact}</p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{mf.explanation}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-forest-50/70 p-3 text-xs text-forest-900 border border-forest-100">
                <span className="font-bold">Family Takeaway:</span> {mf.takeaway}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAdvice.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-card p-5 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      item.costLevel === "Free"
                        ? "bg-green-100 text-green-800"
                        : item.costLevel === "Low-Cost"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {item.costLevel}
                  </span>

                  <span className="text-[11px] font-semibold text-forest-700">
                    Impact: {item.impactScore}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">{item.title}</h3>
                <p className="mt-1.5 text-xs font-medium text-gray-700">{item.summary}</p>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">{item.details}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
