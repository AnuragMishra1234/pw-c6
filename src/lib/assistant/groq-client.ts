import { z } from "zod";
import { AirQualityData } from "@/types/air-quality";
import { UserPreferences } from "@/types/household";
import { Recommendation } from "@/types/recommendations";

export const AssistantRequestSchema = z.object({
  message: z.string().trim().min(2, "Question too short").max(500, "Question exceeds 500 characters limit"),
  airQuality: z.object({
    locationName: z.string(),
    aqi: z.number(),
    aqiCategory: z.string(),
    timestamp: z.string().optional(),
    pollutants: z.record(z.union([z.number(), z.null(), z.string()])).optional(),
  }),
  preferences: z.object({
    householdType: z.string(),
    activities: z.array(z.string()),
    primaryTransport: z.string(),
    indoorEnvironment: z.object({
      hasAirPurifier: z.boolean(),
      nearBusyRoad: z.boolean(),
      hasNaturalVentilation: z.boolean(),
    }).optional(),
  }).optional(),
  recommendations: z.array(
    z.object({
      title: z.string(),
      action: z.string(),
      category: z.string(),
      priority: z.string(),
    })
  ).max(6).optional(),
});

export type AssistantRequestBody = z.infer<typeof AssistantRequestSchema>;

export interface AssistantResponse {
  success: boolean;
  reply: string;
  isAiGenerated: boolean;
  modelUsed?: string;
  sourceContext?: {
    location: string;
    aqi: number;
    category: string;
  };
}

// In-memory rate limiting map: ip -> timestamp array
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;
const ipRequestHistory = new Map<string, number[]>();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, validTimestamps);
    return { allowed: false, remaining: 0 };
  }

  validTimestamps.push(now);
  ipRequestHistory.set(ip, validTimestamps);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - validTimestamps.length };
}

/**
 * Builds deterministic fallback answers when Groq is not configured or unavailable.
 */
export function getDeterministicFallbackReply(
  question: string,
  airQuality: AssistantRequestBody["airQuality"],
  preferences?: AssistantRequestBody["preferences"]
): string {
  const q = question.toLowerCase();
  const aqi = airQuality.aqi;
  const isHighAqi = aqi > 150;
  const hasKids = preferences?.householdType.includes("children");
  const hasPurifier = preferences?.indoorEnvironment?.hasAirPurifier;

  if (q.includes("child") || q.includes("kid") || q.includes("play") || q.includes("outside")) {
    if (aqi <= 50) {
      return `Air quality in ${airQuality.locationName} is Good (US AQI ${aqi}). It is completely safe for children to play outdoors and exercise normally today.`;
    } else if (aqi <= 100) {
      return `Air quality is Moderate (US AQI ${aqi}). Normal outdoor play is fine, but watch out if your children have sensitive airways or cough during vigorous games.`;
    } else if (aqi <= 150) {
      return `Air quality is Unhealthy for Sensitive Groups (US AQI ${aqi}). It is advisable to limit prolonged heavy outdoor sports for children today and replace afternoon play with indoor activities.`;
    } else {
      return `Air quality is currently Unhealthy/Hazardous (US AQI ${aqi}). Children should avoid all strenuous outdoor activities and playtime today to prevent particulate airway irritation.`;
    }
  }

  if (q.includes("window") || q.includes("ventilat")) {
    if (isHighAqi) {
      return `With current US AQI at ${aqi} in ${airQuality.locationName}, keeping windows open allows hazardous particulate matter (PM2.5) to enter your home. Keep windows closed during rush hours, and only crack windows if needed during midday solar clearing.`;
    }
    return `Current air quality is ${airQuality.aqiCategory} (US AQI ${aqi}). Opening windows for 20-30 minutes during midday is safe and helps flush out indoor carbon dioxide and moisture.`;
  }

  if (q.includes("purifier") || q.includes("no purifier") || q.includes("without purifier")) {
    if (hasPurifier) {
      return `Since you have an air purifier, run it in the bedroom or main living room with doors and windows closed to maintain clean air. Ensure the pre-filter is clean.`;
    }
    return `If you do not have an air purifier: 1) Keep windows closed during peak traffic hours; 2) Clean floors with damp mops instead of dry broom sweeping to avoid kicking up settled dust; 3) Avoid indoor incense, mosquito coils, and unvented frying.`;
  }

  if (q.includes("mask") || q.includes("respirator")) {
    return isHighAqi
      ? `For current high pollution (US AQI ${aqi}), standard cloth or surgical masks provide minimal particulate filtration. A well-fitted, certified N95 or FFP2 respirator with an airtight seal is strongly recommended if you must travel outdoors.`
      : `Air quality is currently acceptable (${airQuality.aqiCategory}, US AQI ${aqi}), so healthy individuals generally do not require particulate respirators for normal errands.`;
  }

  // General summary
  return `Currently in ${airQuality.locationName}, air quality is measured at US AQI ${aqi} (${airQuality.aqiCategory}). For your household (${preferences?.householdType || "general"}), prioritizing indoor activities and reducing roadside vehicle exposure will keep particulate inhalation low.`;
}

/**
 * Calls Groq Cloud API with server-side API key.
 */
export async function queryGroqAssistant(
  body: AssistantRequestBody,
  timeoutMs: number = 10000
): Promise<AssistantResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

  // If no Groq API key is configured, return the deterministic fallback gracefully
  if (!apiKey || apiKey.trim() === "") {
    return {
      success: true,
      reply: getDeterministicFallbackReply(body.message, body.airQuality, body.preferences),
      isAiGenerated: false,
      sourceContext: {
        location: body.airQuality.locationName,
        aqi: body.airQuality.aqi,
        category: body.airQuality.aqiCategory,
      },
    };
  }

  const systemPrompt = `You are BreatheWise, an empathetic, scientifically grounded urban air-quality clean-air companion.
Your goal is to answer family questions about their local air quality, health precautions, and daily commuting choices.

MANDATORY RULES:
1. The verified air quality data and deterministic recommendations provided below are the ABSOLUTE SOURCE OF TRUTH.
2. Never invent or hallucinate AQI numbers, pollutant levels, or medical facts.
3. Clearly identify the index as US AQI (EPA standard from Open-Meteo), NOT official Indian CPCB AQI.
4. DO NOT diagnose medical illnesses or promise guaranteed health outcomes.
5. Provide actionable, practical, concise advice tailored to the user's household (especially if children, elderly, or outdoor workers are present).
6. If the user asks about not having an air purifier, explain free and affordable strategies (wet mopping, zero indoor burning, door draft sealing).
7. Keep responses concise (under 160 words), friendly, clear, and easy for ordinary families to follow.

CURRENT VERIFIED CONTEXT:
- Location: ${body.airQuality.locationName}
- Air Quality: US AQI ${body.airQuality.aqi} (${body.airQuality.aqiCategory})
- Household: ${body.preferences?.householdType || "Standard"}
- Daily Activities: ${(body.preferences?.activities || []).join(", ") || "General"}
- Primary Transport: ${body.preferences?.primaryTransport || "General"}
- Has Air Purifier: ${body.preferences?.indoorEnvironment?.hasAirPurifier ? "Yes" : "No"}
- Near Busy Road: ${body.preferences?.indoorEnvironment?.nearBusyRoad ? "Yes" : "No"}
- Generated Recommendations:
${(body.recommendations || []).map((r) => `  * [${r.category.toUpperCase()}] ${r.title}: ${r.action}`).join("\n")}
`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: body.message },
        ],
        temperature: 0.2, // deterministic and factual
        max_tokens: 350,
      }),
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Groq API responded with HTTP status ${response.status}: ${errText}`);
      // Fallback gracefully on Groq API rate limit or outage
      return {
        success: true,
        reply: getDeterministicFallbackReply(body.message, body.airQuality, body.preferences),
        isAiGenerated: false,
        sourceContext: {
          location: body.airQuality.locationName,
          aqi: body.airQuality.aqi,
          category: body.airQuality.aqiCategory,
        },
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Empty response received from assistant model.");
    }

    return {
      success: true,
      reply: content,
      isAiGenerated: true,
      modelUsed: model,
      sourceContext: {
        location: body.airQuality.locationName,
        aqi: body.airQuality.aqi,
        category: body.airQuality.aqiCategory,
      },
    };
  } catch (error: any) {
    clearTimeout(timer);
    console.warn("Groq assistant request failed, falling back to deterministic explanation:", error.message);
    return {
      success: true,
      reply: getDeterministicFallbackReply(body.message, body.airQuality, body.preferences),
      isAiGenerated: false,
      sourceContext: {
        location: body.airQuality.locationName,
        aqi: body.airQuality.aqi,
        category: body.airQuality.aqiCategory,
      },
    };
  }
}
