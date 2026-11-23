"use client";

import React, { useState } from "react";
import {
  AirQualityData,
  AQICategory,
} from "@/types/air-quality";
import {
  AQI_CATEGORY_CONFIG,
  getAQICategoryDetails,
} from "@/lib/air-quality/aqi-calculator";
import {
  Activity,
  AlertTriangle,
  Clock,
  Info,
  MapPin,
  RefreshCw,
  Wind,
  ShieldAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface AirQualityHeroProps {
  data: AirQualityData | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onChangeLocation: () => void;
}

export const AirQualityHero: React.FC<AirQualityHeroProps> = ({
  data,
  isLoading,
  error,
  onRefresh,
  onChangeLocation,
}) => {
  const [showAqiInfoModal, setShowAqiInfoModal] = useState(false);

  if (isLoading && !data) {
    return (
      <div className="w-full rounded-3xl bg-white p-8 shadow-card border border-gray-100 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded-md" />
          <div className="h-8 w-24 bg-gray-200 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-200 rounded-2xl md:col-span-1" />
          <div className="h-32 bg-gray-200 rounded-2xl md:col-span-2" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="w-full rounded-3xl bg-red-50/70 p-8 border border-red-200 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-red-500 mb-3" />
        <h3 className="text-lg font-bold text-red-900">
          Unable to Load Live Air Quality Data
        </h3>
        <p className="text-sm text-red-700 max-w-md mx-auto mt-1 mb-4">
          {error}. No live readings were fabricated.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
          <button
            onClick={onChangeLocation}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition"
          >
            Change City
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const config = getAQICategoryDetails(data.aqi);

  // Format timestamp nicely
  const formattedTime = new Date(data.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Prepare forecast chart data
  const chartData = (data.hourlyForecast || []).map((point) => {
    const d = new Date(point.time);
    return {
      time: d.toLocaleTimeString([], { hour: "numeric", hour12: true }),
      aqi: point.aqi,
      pm2_5: point.pm2_5,
    };
  });

  return (
    <div className="w-full rounded-3xl bg-white shadow-card border border-gray-100/80 p-6 md:p-8 overflow-hidden relative">
      {/* Top Bar: Location & Freshness */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onChangeLocation}
            className="group flex items-center gap-2 rounded-xl bg-forest-50/80 px-3.5 py-1.5 text-forest-800 hover:bg-forest-100 hover:text-forest-900 transition"
            title="Click to search another city"
          >
            <MapPin className="h-4 w-4 text-forest-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold tracking-tight">
              {data.locationName}
            </span>
            {data.adminArea && (
              <span className="text-xs text-forest-600/80 font-normal hidden sm:inline">
                ({data.adminArea})
              </span>
            )}
            <span className="text-xs text-forest-600 font-medium underline underline-offset-2 ml-1">
              Change
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5" title={`Data timestamp: ${data.timestamp}`}>
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span>Updated {formattedTime}</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Refresh live data"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-forest-800 transition disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-forest-600" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Grid: AQI Display + Explanation & Pollutants */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
        {/* Left Column: AQI Number & Category Badge */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl p-6 border transition-all"
          style={{
            backgroundColor: `${config.color}0D`, // 5% opacity tint
            borderColor: `${config.color}33`, // 20% opacity border
          }}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider uppercase text-gray-500">
                Air Quality Index
              </span>
              <button
                onClick={() => setShowAqiInfoModal(true)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-forest-800 transition"
                title="About US AQI Standard"
              >
                <Info className="h-3.5 w-3.5" />
                <span>US AQI standard</span>
              </button>
            </div>

            <div className="flex items-baseline gap-3 my-3">
              <span
                className="text-6xl md:text-7xl font-extrabold tracking-tight font-sans"
                style={{ color: config.color }}
              >
                {data.aqi}
              </span>
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                AQI
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm font-bold shadow-sm"
              style={{
                backgroundColor: config.color,
                color: "#ffffff",
              }}
            >
              <span>{config.label}</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-gray-700 mt-4 pt-4 border-t border-gray-200/50">
            {config.healthMessage}
          </p>
        </div>

        {/* Right Column: Key Pollutants & 24h Trend */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Pollutant Pills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              Key Pollutant Concentrations
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl bg-gray-50/80 p-3 border border-gray-100">
                <span className="text-[11px] font-medium text-gray-500 block">PM2.5</span>
                <span className="text-lg font-bold text-gray-900">
                  {data.pollutants.pm2_5 !== null ? `${data.pollutants.pm2_5}` : "—"}
                </span>
                <span className="text-[10px] text-gray-400 block">µg/m³ (fine)</span>
              </div>

              <div className="rounded-xl bg-gray-50/80 p-3 border border-gray-100">
                <span className="text-[11px] font-medium text-gray-500 block">PM10</span>
                <span className="text-lg font-bold text-gray-900">
                  {data.pollutants.pm10 !== null ? `${data.pollutants.pm10}` : "—"}
                </span>
                <span className="text-[10px] text-gray-400 block">µg/m³ (coarse)</span>
              </div>

              <div className="rounded-xl bg-gray-50/80 p-3 border border-gray-100">
                <span className="text-[11px] font-medium text-gray-500 block">NO₂</span>
                <span className="text-lg font-bold text-gray-900">
                  {data.pollutants.nitrogen_dioxide !== null
                    ? `${data.pollutants.nitrogen_dioxide}`
                    : "—"}
                </span>
                <span className="text-[10px] text-gray-400 block">µg/m³ (traffic)</span>
              </div>

              <div className="rounded-xl bg-gray-50/80 p-3 border border-gray-100">
                <span className="text-[11px] font-medium text-gray-500 block">O₃ (Ozone)</span>
                <span className="text-lg font-bold text-gray-900">
                  {data.pollutants.ozone !== null ? `${data.pollutants.ozone}` : "—"}
                </span>
                <span className="text-[10px] text-gray-400 block">µg/m³</span>
              </div>
            </div>
          </div>

          {/* 24-Hour Trend Chart */}
          {chartData.length > 0 && (
            <div className="rounded-2xl bg-gray-50/60 p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-forest-600" />
                  24-Hour AQI Trend Forecast
                </span>
                <span className="text-[10px] text-gray-400">Open-Meteo model</span>
              </div>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={config.color} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: "#9CA3AF" }}
                      interval={3}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#9CA3AF" }}
                      domain={[0, "auto"]}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-lg">
                              <p className="font-semibold">{payload[0].payload.time}</p>
                              <p className="text-forest-300">
                                US AQI: {payload[0].value}
                              </p>
                              <p className="text-gray-300 text-[10px]">
                                PM2.5: {payload[0].payload.pm2_5} µg/m³
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="aqi"
                      stroke={config.color}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#aqiGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Modal explaining US AQI vs Indian CPCB AQI */}
      {showAqiInfoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-forest-600" />
                Air Quality Standard Notice
              </h3>
              <button
                onClick={() => setShowAqiInfoModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 text-xs text-gray-600 space-y-2.5 leading-relaxed">
              <p>
                <strong>Index Identification:</strong> The AQI values shown in BreatheWise are
                retrieved from the <strong>Open-Meteo Air Quality API</strong> and calculated
                according to the <strong>United States EPA Air Quality Index (US AQI)</strong> standard.
              </p>
              <p>
                <strong>CPCB Distinction:</strong> This is <strong>not</strong> the official Indian Central
                Pollution Control Board (CPCB) National AQI (NAQI), which uses different sub-index
                breakpoints and 24-hour average weighting.
              </p>
              <p>
                <strong>Categories on US AQI:</strong>
                <br />• 0–50: Good
                <br />• 51–100: Moderate
                <br />• 101–150: Unhealthy for Sensitive Groups
                <br />• 151–200: Unhealthy
                <br />• 201–300: Very Unhealthy
                <br />• 301–500+: Hazardous
              </p>
              <p className="text-[11px] text-gray-500 italic">
                Data is updated hourly using satellite-calibrated numerical atmospheric dispersion
                models.
              </p>
            </div>
            <button
              onClick={() => setShowAqiInfoModal(false)}
              className="w-full rounded-xl bg-forest-700 py-2 text-xs font-semibold text-white hover:bg-forest-800 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
