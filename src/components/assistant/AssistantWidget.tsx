"use client";

import React, { useState } from "react";
import { AirQualityData } from "@/types/air-quality";
import { UserPreferences } from "@/types/household";
import { Recommendation } from "@/types/recommendations";
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  isAiGenerated?: boolean;
  modelUsed?: string;
  timestamp: string;
}

interface AssistantWidgetProps {
  airQuality: AirQualityData;
  preferences: UserPreferences;
  recommendations: Recommendation[];
}

const SAMPLE_QUESTIONS = [
  "Can my children play outside today?",
  "I don't have an air purifier. What can I do?",
  "Why should I avoid opening windows right now?",
  "How can I reduce pollution while going to work?",
  "Explain today's air quality in simple words.",
];

export const AssistantWidget: React.FC<AssistantWidgetProps> = ({
  airQuality,
  preferences,
  recommendations,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-welcome",
      sender: "assistant",
      text: `Hello! I'm your BreatheWise Clean-Air Assistant. I can help explain today's air quality in ${airQuality.locationName} (US AQI ${airQuality.aqi}) and clarify practical precautions for your household. What would you like to know?`,
      isAiGenerated: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          airQuality: {
            locationName: airQuality.locationName,
            aqi: airQuality.aqi,
            aqiCategory: airQuality.aqiCategory,
            timestamp: airQuality.timestamp,
            pollutants: airQuality.pollutants,
          },
          preferences: {
            householdType: preferences.householdType,
            activities: preferences.activities,
            primaryTransport: preferences.primaryTransport,
            indoorEnvironment: preferences.indoorEnvironment,
          },
          recommendations: recommendations.slice(0, 5).map((r) => ({
            title: r.title,
            action: r.action,
            category: r.category,
            priority: r.priority,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to retrieve response");
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: data.reply,
        isAiGenerated: data.isAiGenerated,
        modelUsed: data.modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || "Request timed out or failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-card p-6 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-forest-50 p-2 text-forest-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Clean-Air AI Assistant
              <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-semibold text-forest-800">
                Ground Truth Engine
              </span>
            </h3>
            <p className="text-[11px] text-gray-500">
              Plain-language explanations grounded in verified atmospheric data
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`rounded-full p-1.5 shrink-0 text-xs ${
                  isUser ? "bg-forest-700 text-white" : "bg-forest-100 text-forest-800"
                }`}
              >
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-forest-700 text-white rounded-tr-none"
                    : "bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none shadow-sm"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                <div
                  className={`mt-1.5 flex items-center justify-between text-[10px] ${
                    isUser ? "text-forest-200" : "text-gray-400"
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <span className="font-medium text-forest-700">
                      {m.isAiGenerated
                        ? `AI Explanation (${m.modelUsed || "Groq"})`
                        : "Deterministic Rule Guidance"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-forest-700 pl-2">
            <Loader2 className="h-4 w-4 animate-spin text-forest-600" />
            <span>Analyzing local air conditions and recommendations...</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Suggested Question Pills */}
      <div className="py-2 shrink-0 overflow-x-auto scrollbar-none flex gap-1.5 border-t border-gray-100">
        {SAMPLE_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => handleAskQuestion(q)}
            disabled={isLoading}
            className="rounded-full bg-forest-50/70 border border-forest-100 px-3 py-1 text-[11px] font-semibold text-forest-800 hover:bg-forest-100 transition whitespace-nowrap disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAskQuestion(input);
        }}
        className="pt-2 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about today's air, children, or masks..."
          maxLength={500}
          disabled={isLoading}
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:border-forest-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send question"
          className="rounded-xl bg-forest-700 p-2.5 text-white hover:bg-forest-800 transition disabled:opacity-40 disabled:hover:bg-forest-700"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
