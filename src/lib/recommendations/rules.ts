import { RecommendationRule, EngineContext } from "./types";
import { Recommendation } from "@/types/recommendations";
import {
  getOutdoorExplanation,
  getIndoorExplanation,
  getMobilityExplanation,
} from "./explanations";

export const recommendationRules: RecommendationRule[] = [
  // -------------------------------------------------------------
  // 1. OUTDOOR ACTIVITY RULES
  // -------------------------------------------------------------
  {
    id: "outdoor-clean-routine",
    category: "outdoor",
    applies: (ctx) => ctx.airQuality.aqiCategory === "good",
    generate: (ctx) => ({
      id: "outdoor-clean-routine",
      title: "Enjoy Outdoor Activities Freely",
      action:
        "Take advantage of today's clean air for outdoor running, cycling, or children's park activities.",
      reason: getOutdoorExplanation(
        "good",
        false,
        ctx.preferences.activities.includes("outdoor_worker")
      ),
      impact:
        "Promotes cardiovascular health and aerobic fitness without particulate airway stress.",
      priority: "low",
      category: "outdoor",
      iconName: "Sun",
      applicableConditions: { aqiCategoryMax: "good" },
    }),
  },
  {
    id: "outdoor-moderate-caution",
    category: "outdoor",
    applies: (ctx) => ctx.airQuality.aqiCategory === "moderate",
    generate: (ctx) => {
      const isSensitive =
        ctx.preferences.householdType === "family_with_children" ||
        ctx.preferences.householdType === "family_with_elderly" ||
        ctx.preferences.householdType === "multi_generational";
      return {
        id: "outdoor-moderate-caution",
        title: isSensitive
          ? "Observe Sensitive Members During Long Play"
          : "Maintain Normal Outdoor Routines with Awareness",
        action: isSensitive
          ? "Keep intense outdoor games under 90 minutes and stay hydrated. Watch for throat dryness or fatigue."
          : "Continue your usual outdoor schedule while checking for any sudden pollution spikes near heavy traffic.",
        reason: getOutdoorExplanation(
          "moderate",
          isSensitive,
          ctx.preferences.activities.includes("outdoor_worker")
        ),
        impact:
          "Maintains fitness routine while preventing unnecessary airway irritation for sensitive lungs.",
        priority: "low",
        category: "outdoor",
        iconName: "Smile",
        applicableConditions: { aqiCategoryMin: "moderate", aqiCategoryMax: "moderate" },
      };
    },
  },
  {
    id: "outdoor-sensitive-reduction",
    category: "outdoor",
    applies: (ctx) => ctx.airQuality.aqiCategory === "unhealthy_sensitive",
    generate: (ctx) => {
      const hasKidsOrElderly =
        ctx.preferences.householdType === "family_with_children" ||
        ctx.preferences.householdType === "family_with_elderly" ||
        ctx.preferences.householdType === "multi_generational";
      return {
        id: "outdoor-sensitive-reduction",
        title: hasKidsOrElderly
          ? "Shift Strenuous Outdoor Play to Indoor Spaces"
          : "Moderate Outdoor Exertion & Avoid Busy Arterials",
        action: hasKidsOrElderly
          ? "Replace afternoon outdoor sports for children/seniors with indoor games or library time."
          : "Avoid vigorous outdoor running near major roadways; opt for sheltered parks or shorten workout duration.",
        reason: getOutdoorExplanation(
          "unhealthy_sensitive",
          hasKidsOrElderly,
          ctx.preferences.activities.includes("outdoor_worker")
        ),
        impact:
          "Reduces fine particulate (PM2.5) inhalation by an estimated 35–50% during peak pollution hours.",
        priority: "medium",
        category: "outdoor",
        iconName: "AlertCircle",
        applicableConditions: { aqiCategoryMin: "unhealthy_sensitive", aqiCategoryMax: "unhealthy_sensitive" },
      };
    },
  },
  {
    id: "outdoor-unhealthy-warning",
    category: "outdoor",
    applies: (ctx) => ctx.airQuality.aqiCategory === "unhealthy",
    generate: (ctx) => ({
      id: "outdoor-unhealthy-warning",
      title: "Reschedule Heavy Outdoor Exertion",
      action:
        "Cancel or reschedule outdoor runs, competitive matches, and heavy cardio sessions. Wear a snug-fitting N95/FFP2 respirator if outdoor travel is mandatory.",
      reason: getOutdoorExplanation(
        "unhealthy",
        true,
        ctx.preferences.activities.includes("outdoor_worker")
      ),
      impact:
        "Prevents deep alveolar particulate deposition and reduces acute airway inflammation during elevated smog.",
      priority: "high",
      category: "outdoor",
      iconName: "ShieldAlert",
      applicableConditions: { aqiCategoryMin: "unhealthy", aqiCategoryMax: "unhealthy" },
    }),
  },
  {
    id: "outdoor-hazardous-lockdown",
    category: "outdoor",
    applies: (ctx) =>
      ctx.airQuality.aqiCategory === "very_unhealthy" ||
      ctx.airQuality.aqiCategory === "hazardous",
    generate: (ctx) => ({
      id: "outdoor-hazardous-lockdown",
      title: "Minimize All Non-Essential Outdoor Exposure",
      action:
        "Keep all family members indoors in a closed room. Avoid all outdoor fitness or unnecessary errands until meteorological dispersion improves.",
      reason:
        "Severe smog levels cause acute respiratory discomfort, oxidative stress, and heightened cardiovascular strain across healthy and vulnerable groups alike.",
      impact:
        "Drastically curtails cumulative daily microgram intake of hazardous particulate matter (PM2.5).",
      priority: "high",
      category: "outdoor",
      iconName: "OctagonAlert",
      applicableConditions: { aqiCategoryMin: "very_unhealthy" },
    }),
  },

  // -------------------------------------------------------------
  // 2. EXERCISE & FITNESS SPECIFIC RULES
  // -------------------------------------------------------------
  {
    id: "exercise-indoor-alternative",
    category: "outdoor",
    applies: (ctx) =>
      ctx.preferences.activities.includes("outdoor_exercise") &&
      ["unhealthy_sensitive", "unhealthy", "very_unhealthy", "hazardous"].includes(
        ctx.airQuality.aqiCategory
      ),
    generate: (ctx) => ({
      id: "exercise-indoor-alternative",
      title: "Switch to Indoor Calisthenics or Yoga",
      action:
        "Substitute outdoor jogging with an indoor bodyweight circuit, pilates, or stationary cycling in a room with filtered air.",
      reason:
        "During heavy aerobic exercise, minute ventilation increases 5 to 10-fold, pulling unfiltered particulates deep into the bronchioles.",
      impact:
        "Maintains physical conditioning and metabolic rate while avoiding direct pollutant inhalation during hyperventilation.",
      priority: ctx.airQuality.aqiCategory === "unhealthy_sensitive" ? "medium" : "high",
      category: "outdoor",
      iconName: "Dumbbell",
    }),
  },

  // -------------------------------------------------------------
  // 3. COMMUTING & MOBILITY RULES
  // -------------------------------------------------------------
  {
    id: "mobility-clean-choice",
    category: "mobility",
    applies: (ctx) => ctx.airQuality.aqiCategory === "good",
    generate: (ctx) => ({
      id: "mobility-clean-choice",
      title: "Choose Active Commuting (Walking / Cycling)",
      action:
        "For trips under 3–5 km, walk or ride a bicycle instead of taking a motorized vehicle.",
      reason:
        "Ambient air is clear and pose zero exertion hazard. Choosing active travel eliminates tailpipe emissions directly at the neighborhood level.",
      impact:
        "Saves approximately 120–180 g CO2 per kilometer compared to solo car travel while providing daily exercise.",
      priority: "medium",
      category: "mobility",
      iconName: "Bike",
    }),
  },
  {
    id: "mobility-two-wheeler-protection",
    category: "mobility",
    applies: (ctx) =>
      ctx.preferences.primaryTransport === "two_wheeler" &&
      ["unhealthy", "very_unhealthy", "hazardous"].includes(ctx.airQuality.aqiCategory),
    generate: (ctx) => ({
      id: "mobility-two-wheeler-protection",
      title: "Two-Wheeler Commute: Respirator Protection or Metro",
      action:
        "Wear a certified, well-fitted N95/FFP2 particulate respirator during your ride, or switch to the metro / public transport if accessible.",
      reason:
        "Two-wheeler riders operate right in the vehicle exhaust plume zone where PM2.5, black carbon, and nitrogen dioxide peak. Simple cloth masks offer minimal submicron filtration.",
      impact:
        "A properly fitted N95 respirator reduces inhaled particulate mass by over 80–90% compared to an unmasked face.",
      priority: "high",
      category: "mobility",
      iconName: "Compass",
    }),
  },
  {
    id: "mobility-car-driver-recirculation",
    category: "mobility",
    applies: (ctx) =>
      ctx.preferences.primaryTransport === "car" &&
      ["unhealthy_sensitive", "unhealthy", "very_unhealthy", "hazardous"].includes(
        ctx.airQuality.aqiCategory
      ),
    generate: (ctx) => ({
      id: "mobility-car-driver-recirculation",
      title: "Enable In-Cabin Air Recirculation",
      action:
        "Keep car windows rolled up and switch AC airflow mode to internal recirculation. Consider carpooling with a colleague.",
      reason:
        "External airflow pulls roadway exhaust and PM2.5 directly into the cabin. Internal recirculation through cabin filters can lower in-car PM2.5 by 40–70%.",
      impact:
        "Reduces personal commuter exposure inside traffic jams, while carpooling cuts per-passenger trip emissions in half.",
      priority: "medium",
      category: "mobility",
      iconName: "Car",
    }),
  },
  {
    id: "mobility-public-transit-recommendation",
    category: "mobility",
    applies: (ctx) =>
      (ctx.preferences.primaryTransport === "car" ||
        ctx.preferences.primaryTransport === "two_wheeler") &&
      ["unhealthy_sensitive", "unhealthy", "very_unhealthy"].includes(ctx.airQuality.aqiCategory),
    generate: (ctx) => ({
      id: "mobility-public-transit-recommendation",
      title: "Opt for Metro or Shared Transit Today",
      action:
        "Substitute personal motorized travel with the metro or bus for your primary commute route.",
      reason: getMobilityExplanation(ctx.preferences.primaryTransport, ctx.airQuality.aqiCategory),
      impact:
        "Reduces personal exposure to direct curbside exhaust and saves up to 70% in personal transport emissions for the journey.",
      priority: "medium",
      category: "mobility",
      iconName: "Train",
    }),
  },

  // -------------------------------------------------------------
  // 4. INDOOR AIR ADVICE (AFFORDABLE & WITH PURIFIER)
  // -------------------------------------------------------------
  {
    id: "indoor-purifier-sanctuary",
    category: "indoor",
    applies: (ctx) =>
      ctx.preferences.indoorEnvironment.hasAirPurifier &&
      ["unhealthy", "very_unhealthy", "hazardous"].includes(ctx.airQuality.aqiCategory),
    generate: (ctx) => ({
      id: "indoor-purifier-sanctuary",
      title: "Create a Clean-Air Sanctuary Bedroom",
      action:
        "Run your HEPA air purifier continuously on medium/high in the bedroom or primary living space with all windows and doors closed.",
      reason: getIndoorExplanation(
        ctx.airQuality.aqiCategory,
        true,
        ctx.preferences.indoorEnvironment.nearBusyRoad
      ),
      impact:
        "Maintains an indoor PM2.5 concentration up to 60–80% lower than outdoor ambient pollution levels.",
      priority: "high",
      category: "indoor",
      iconName: "Wind",
    }),
  },
  {
    id: "indoor-no-purifier-low-cost",
    category: "indoor",
    applies: (ctx) =>
      !ctx.preferences.indoorEnvironment.hasAirPurifier &&
      ["unhealthy_sensitive", "unhealthy", "very_unhealthy", "hazardous"].includes(
        ctx.airQuality.aqiCategory
      ),
    generate: (ctx) => ({
      id: "indoor-no-purifier-low-cost",
      title: "Low-Cost Indoor Clean Air Routine (No Purifier Needed)",
      action:
        "Keep windows closed during morning/evening smog peaks. Use wet-cloth wiping instead of dry brooms to capture dust, and strictly avoid burning incense, mosquito coils, or deep-frying without exhaust.",
      reason: getIndoorExplanation(
        ctx.airQuality.aqiCategory,
        false,
        ctx.preferences.indoorEnvironment.nearBusyRoad
      ),
      impact:
        "Prevents indoor PM2.5 spikes from domestic sources and avoids resuspending settled particles into breathable air.",
      priority: "high",
      category: "indoor",
      iconName: "Sparkles",
    }),
  },
  {
    id: "indoor-ventilation-timing",
    category: "indoor",
    applies: (ctx) =>
      ctx.preferences.indoorEnvironment.hasNaturalVentilation &&
      ["good", "moderate"].includes(ctx.airQuality.aqiCategory),
    generate: (ctx) => ({
      id: "indoor-ventilation-timing",
      title: "Open Windows for Natural Cross-Ventilation",
      action:
        "Open windows across opposite walls for 30–45 minutes during midday when outdoor air is cleanest.",
      reason:
        "Indoor air accumulates carbon dioxide, VOCs, and moisture over time. Flushing rooms with clean outdoor air restores oxygen levels and prevents indoor staleness.",
      impact:
        "Lowers indoor CO2 concentration, improves cognitive alertness, and purges indoor chemical vapors.",
      priority: "medium",
      category: "indoor",
      iconName: "DoorOpen",
    }),
  },
  {
    id: "indoor-near-road-gap-sealing",
    category: "indoor",
    applies: (ctx) =>
      ctx.preferences.indoorEnvironment.nearBusyRoad &&
      ["unhealthy", "very_unhealthy", "hazardous"].includes(ctx.airQuality.aqiCategory),
    generate: (ctx) => ({
      id: "indoor-near-road-gap-sealing",
      title: "Seal Roadside Draft Gaps",
      action:
        "Place rolled towels or draft stoppers at the base of road-facing doors and windows to block vehicle exhaust penetration.",
      reason:
        "Roadside buildings receive continuous direct pulses of ultrafine diesel particulates that infiltrate through micro-gaps under negative pressure.",
      impact:
        "Reduces baseline roadway particle infiltration into bedrooms by an estimated 20–30%.",
      priority: "medium",
      category: "indoor",
      iconName: "Home",
    }),
  },

  // -------------------------------------------------------------
  // 5. FAMILY & VULNERABLE POPULATION SPECIFIC PRECAUTIONS
  // -------------------------------------------------------------
  {
    id: "family-children-school-guidance",
    category: "family",
    applies: (ctx) =>
      (ctx.preferences.householdType === "family_with_children" ||
        ctx.preferences.householdType === "multi_generational") &&
      ["unhealthy", "very_unhealthy", "hazardous"].includes(ctx.airQuality.aqiCategory),
    generate: (ctx) => ({
      id: "family-children-school-guidance",
      title: "Child Exposure Reduction During School Commute",
      action:
        "Ensure children wear a well-fitted, child-sized particulate mask during morning transit. Request that morning outdoor assembly be held indoors.",
      reason:
        "Children have narrower airways and breathe roughly 50% more air per pound of body weight than adults, placing them at higher physiological vulnerability to particulate toxins.",
      impact:
        "Substantially lowers childhood asthma exacerbation and acute respiratory tract infections.",
      priority: "high",
      category: "family",
      iconName: "Baby",
    }),
  },
  {
    id: "family-elderly-cardio-caution",
    category: "family",
    applies: (ctx) =>
      (ctx.preferences.householdType === "family_with_elderly" ||
        ctx.preferences.householdType === "multi_generational") &&
      ["unhealthy_sensitive", "unhealthy", "very_unhealthy", "hazardous"].includes(
        ctx.airQuality.aqiCategory
      ),
    generate: (ctx) => ({
      id: "family-elderly-cardio-caution",
      title: "Cardiovascular Precautions for Senior Family Members",
      action:
        "Keep senior members indoors in warm, stable room conditions. Ensure rescue inhalers or blood pressure medications are readily accessible.",
      reason:
        "Elevated PM2.5 triggers systemic autonomic nervous system stress, arterial constriction, and transient blood pressure spikes in older adults.",
      impact:
        "Protects against acute cardiovascular instability and reduces hospital visit triggers.",
      priority: "high",
      category: "family",
      iconName: "HeartPulse",
    }),
  },
  {
    id: "family-outdoor-worker-practical",
    category: "family",
    applies: (ctx) =>
      ctx.preferences.activities.includes("outdoor_worker") &&
      ["unhealthy_sensitive", "unhealthy", "very_unhealthy", "hazardous"].includes(
        ctx.airQuality.aqiCategory
      ),
    generate: (ctx) => ({
      id: "family-outdoor-worker-practical",
      title: "Outdoor Work Shift: Respirator & Staged Rest Periods",
      action:
        "Wear an authentic N95/FFP2 respirator throughout active outdoor tasks. Take 10-minute recovery breaks in enclosed, air-filtered or air-conditioned break areas every 2 hours.",
      reason:
        "Outdoor occupations prevent staying indoors. Staging rests in enclosed micro-environments gives alveolar clearance mechanisms time to process inhaled particulate load.",
      impact:
        "Significantly decreases cumulative occupational pollutant dosage and acute throat soreness.",
      priority: "high",
      category: "family",
      iconName: "HardHat",
    }),
  },

  // -------------------------------------------------------------
  // 6. SUSTAINABILITY & COMMUNITY IMPACT
  // -------------------------------------------------------------
  {
    id: "sustainability-trip-chaining",
    category: "sustainability",
    applies: (ctx) => true, // applies universally
    generate: (ctx) => ({
      id: "sustainability-trip-chaining",
      title: "Chain Daily Errands into a Single Journey",
      action:
        "Combine grocery shopping, pharmacy visits, and drop-offs into one consolidated trip rather than several separate cold-start excursions.",
      reason:
        "Vehicle engines produce up to 3 times more emissions during the first 5 minutes after a cold start before catalytic converters reach operating temperature.",
      impact:
        "Avoids redundant vehicle warm-up cycles, saving an estimated 300–600 g CO2 and reducing localized toxic tailpipe emissions.",
      priority: "low",
      category: "sustainability",
      iconName: "Leaf",
    }),
  },
  {
    id: "sustainability-zero-waste-burning",
    category: "sustainability",
    applies: (ctx) =>
      ["unhealthy", "very_unhealthy", "hazardous"].includes(ctx.airQuality.aqiCategory),
    generate: (ctx) => ({
      id: "sustainability-zero-waste-burning",
      title: "Strict Zero Open-Burning & Community Watch",
      action:
        "Never burn dry leaves, garden waste, or domestic trash. Promptly report any neighborhood open garbage fires to municipal authorities.",
      reason:
        "Open biomass and plastic burning during thermal winter inversions creates localized toxic hot spots of dioxins, polycyclic aromatic hydrocarbons, and black carbon.",
      impact:
        "Prevents intense ground-level pollution spikes directly affecting neighborhood children and seniors.",
      priority: "medium",
      category: "sustainability",
      iconName: "Flame",
    }),
  },
];
