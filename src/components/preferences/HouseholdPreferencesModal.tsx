"use client";

import React, { useState } from "react";
import {
  UserPreferences,
  HouseholdType,
  DailyActivity,
  PrimaryTransport,
  HomeType,
} from "@/types/household";
import {
  X,
  Users,
  Briefcase,
  Car,
  Home,
  Check,
  Save,
} from "lucide-react";

interface HouseholdPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (updated: UserPreferences) => void;
}

export const HouseholdPreferencesModal: React.FC<HouseholdPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [formData, setFormData] = useState<UserPreferences>(preferences);
  const [activeSection, setActiveSection] = useState<"household" | "activities" | "transport" | "indoor">("household");

  if (!isOpen) return null;

  const handleToggleActivity = (activity: DailyActivity) => {
    setFormData((prev) => {
      const exists = prev.activities.includes(activity);
      const activities = exists
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity];
      return { ...prev, activities };
    });
  };

  const handleSave = () => {
    onSavePreferences(formData);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preferences-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 id="preferences-modal-title" className="text-lg font-bold text-forest-800">
              Household & Lifestyle Profile
            </h2>
            <p className="text-xs text-gray-500">
              Tailors your clean-air plan and safety precautions
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preferences"
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-100 px-6 bg-gray-50/50 overflow-x-auto scrollbar-none">
          {[
            { id: "household", label: "Household", icon: Users },
            { id: "activities", label: "Activities", icon: Briefcase },
            { id: "transport", label: "Commute", icon: Car },
            { id: "indoor", label: "Home Setup", icon: Home },
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? "border-forest-700 text-forest-800 bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* SECTION 1: HOUSEHOLD TYPE */}
          {activeSection === "household" && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                Who lives in your home?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "individual", label: "Individual", desc: "Living solo or with roommates" },
                  { id: "family", label: "General Family", desc: "Adult family members" },
                  { id: "family_with_children", label: "Family with Children", desc: "Infants, toddlers, or school-age kids" },
                  { id: "family_with_elderly", label: "Family with Elderly", desc: "Seniors (60+) or respiratory sensitive members" },
                  { id: "multi_generational", label: "Multi-Generational", desc: "Children, adults, and seniors under one roof" },
                ].map((item) => {
                  const isSelected = formData.householdType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setFormData({ ...formData, householdType: item.id as HouseholdType })}
                      className={`rounded-2xl p-4 text-left border transition-all ${
                        isSelected
                          ? "bg-forest-50/70 border-forest-600 ring-2 ring-forest-600/20"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">{item.label}</span>
                        {isSelected && <Check className="h-4 w-4 text-forest-700" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: ACTIVITIES */}
          {activeSection === "activities" && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                Daily Routines (Select all that apply)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "outdoor_exercise", label: "Outdoor Exercise", desc: "Morning running, walking, or sports" },
                  { id: "office_commute", label: "Office Commute", desc: "Daily transit to workspace" },
                  { id: "school_commute", label: "School Commute", desc: "Dropping or picking kids from school" },
                  { id: "work_from_home", label: "Work From Home", desc: "Mostly homebound during work hours" },
                  { id: "outdoor_worker", label: "Outdoor Occupation", desc: "Delivery, field work, or construction" },
                  { id: "mostly_indoors", label: "Mostly Indoors", desc: "Minimal outdoor movement needed" },
                ].map((item) => {
                  const isChecked = formData.activities.includes(item.id as DailyActivity);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggleActivity(item.id as DailyActivity)}
                      className={`rounded-2xl p-4 text-left border transition-all ${
                        isChecked
                          ? "bg-forest-50/70 border-forest-600 ring-2 ring-forest-600/20"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">{item.label}</span>
                        {isChecked && <Check className="h-4 w-4 text-forest-700" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: TRANSPORTATION */}
          {activeSection === "transport" && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                  Primary Mode of Transit
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "two_wheeler", label: "Two-Wheeler (Bike/Scooter)" },
                    { id: "car", label: "Car (Solo driver)" },
                    { id: "public_transport", label: "Public Transit (Bus/Metro)" },
                    { id: "bicycle", label: "Bicycle" },
                    { id: "walking", label: "Walking" },
                  ].map((item) => {
                    const isSelected = formData.primaryTransport === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            primaryTransport: item.id as PrimaryTransport,
                          })
                        }
                        className={`rounded-xl p-3 text-xs font-bold border transition text-center ${
                          isSelected
                            ? "bg-forest-700 text-white border-forest-700 shadow-sm"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-gray-700">
                    Typical One-Way Distance: {formData.commuteDistanceKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={formData.commuteDistanceKm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commuteDistanceKm: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-forest-700"
                />
              </div>
            </div>
          )}

          {/* SECTION 4: INDOOR ENVIRONMENT */}
          {activeSection === "indoor" && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                Dwelling & Indoor Resources
              </span>

              {/* Toggles */}
              <div className="space-y-2.5">
                {[
                  {
                    key: "hasAirPurifier",
                    label: "I have a HEPA Air Purifier at home",
                    desc: "Enables purifier optimization routines; if unchecked, suggests affordable damp cleaning methods.",
                  },
                  {
                    key: "nearBusyRoad",
                    label: "Home is located near a busy road / traffic artery",
                    desc: "Triggers roadside draft-proofing and window sealing alerts.",
                  },
                  {
                    key: "hasNaturalVentilation",
                    label: "Home has cross-ventilation windows",
                    desc: "Advises on safe midday aeration timing.",
                  },
                  {
                    key: "hasIndoorPlants",
                    label: "I keep indoor potted plants",
                    desc: "Personalizes plant care and debunking misconceptions.",
                  },
                ].map((item) => {
                  const checked = (formData.indoorEnvironment as any)[item.key];
                  return (
                    <label
                      key={item.key}
                      className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-100/60 transition"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            indoorEnvironment: {
                              ...formData.indoorEnvironment,
                              [item.key]: e.target.checked,
                            },
                          })
                        }
                        className="mt-1 h-4 w-4 rounded accent-forest-700 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                          {item.label}
                        </span>
                        <span className="text-xs text-gray-500 leading-relaxed block mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Home Type */}
              <div className="pt-2">
                <span className="text-xs font-bold text-gray-700 block mb-2">Dwelling Type</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "small_apartment", label: "Apartment (<1000 sq ft)" },
                    { id: "multi_story_apartment", label: "Large Flat" },
                    { id: "independent_house", label: "Independent House" },
                  ].map((ht) => (
                    <button
                      key={ht.id}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          indoorEnvironment: {
                            ...formData.indoorEnvironment,
                            homeType: ht.id as HomeType,
                          },
                        })
                      }
                      className={`rounded-xl p-2.5 text-xs font-semibold border transition text-center ${
                        formData.indoorEnvironment.homeType === ht.id
                          ? "bg-forest-700 text-white border-forest-700"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {ht.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/80 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Saved locally in browser
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-xl bg-forest-700 px-5 py-2 text-xs font-bold text-white hover:bg-forest-800 shadow-sm transition"
            >
              <Save className="h-3.5 w-3.5" /> Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
