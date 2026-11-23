"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import { GeocodingLocation } from "@/types/air-quality";

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  }) => void;
  currentCityName: string;
}

const QUICK_CITIES = [
  { name: "Delhi", lat: 28.6139, lon: 77.209, country: "India", admin1: "Delhi" },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946, country: "India", admin1: "Karnataka" },
  { name: "Mumbai", lat: 19.076, lon: 72.8777, country: "India", admin1: "Maharashtra" },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639, country: "India", admin1: "West Bengal" },
  { name: "Chennai", lat: 13.0827, lon: 80.2707, country: "India", admin1: "Tamil Nadu" },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867, country: "India", admin1: "Telangana" },
  { name: "Pune", lat: 18.5204, lon: 73.8567, country: "India", admin1: "Maharashtra" },
];

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  currentCityName,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/geocoding?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (err: any) {
        setError("Failed to search location. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-search-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 id="location-search-title" className="text-lg font-bold text-forest-800">
              Select Your City
            </h2>
            <p className="text-xs text-gray-500">
              Real-time atmospheric readings from Open-Meteo
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close location search"
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-6 pb-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type city or town name (e.g. Delhi, London, Tokyo)..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-forest-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 transition"
            />
            {isLoading && (
              <Loader2 className="absolute right-3.5 h-4 w-4 animate-spin text-forest-600" />
            )}
          </div>

          {/* Quick select buttons */}
          <div className="mt-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Popular Cities
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    onSelectLocation({
                      name: city.name,
                      latitude: city.lat,
                      longitude: city.lon,
                      country: city.country,
                      admin1: city.admin1,
                    });
                    onClose();
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    currentCityName.toLowerCase() === city.name.toLowerCase()
                      ? "bg-forest-700 text-white shadow-sm"
                      : "bg-forest-50 text-forest-800 hover:bg-forest-100"
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results list */}
        <div className="max-h-64 overflow-y-auto px-6 py-3">
          {error && <p className="py-4 text-center text-xs text-red-500">{error}</p>}

          {query.trim().length >= 2 && !isLoading && results.length === 0 && (
            <div className="py-6 text-center">
              <p className="text-sm font-medium text-gray-600">No matching locations found</p>
              <p className="text-xs text-gray-400 mt-1">Try another spelling or major nearby city</p>
            </div>
          )}

          <ul className="divide-y divide-gray-100">
            {results.map((loc) => (
              <li key={loc.id}>
                <button
                  onClick={() => {
                    onSelectLocation({
                      name: loc.name,
                      latitude: loc.latitude,
                      longitude: loc.longitude,
                      country: loc.country,
                      admin1: loc.admin1,
                    });
                    onClose();
                  }}
                  className="flex w-full items-center justify-between py-3 text-left hover:text-forest-700 group transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-forest-50 p-2 text-forest-700 group-hover:bg-forest-100 transition">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-forest-800">
                        {loc.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {[loc.admin1, loc.country].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 group-hover:text-forest-600">
                    Select &rarr;
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
