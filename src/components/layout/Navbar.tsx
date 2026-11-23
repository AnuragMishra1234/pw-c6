"use client";

import React, { useState } from "react";
import {
  Wind,
  LayoutDashboard,
  CalendarCheck,
  Home,
  Compass,
  Leaf,
  SlidersHorizontal,
  MapPin,
  Menu,
  X,
} from "lucide-react";

export type NavTab = "dashboard" | "plan" | "indoor" | "mobility" | "impact";

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cityName: string;
  onOpenLocationSearch: () => void;
  onOpenPreferences: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  cityName,
  onOpenLocationSearch,
  onOpenPreferences,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: NavTab; label: string; icon: React.ElementType }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "plan", label: "Daily Plan", icon: CalendarCheck },
    { id: "indoor", label: "Indoor Advisor", icon: Home },
    { id: "mobility", label: "Smart Mobility", icon: Compass },
    { id: "impact", label: "Impact Tracker", icon: Leaf },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick("dashboard")}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="rounded-xl bg-forest-700 p-2 text-white shadow-sm group-hover:bg-forest-800 transition">
                <Wind className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-forest-900 block leading-tight">
                  BreatheWise
                </span>
                <span className="text-[10px] font-semibold text-teal-700 tracking-wide uppercase block -mt-0.5">
                  Your Personal Clean-Air Companion
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-forest-50 text-forest-800 shadow-xs"
                      : "text-gray-600 hover:text-forest-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* City Selector Pill */}
            <button
              onClick={onOpenLocationSearch}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition"
              title="Change your city"
            >
              <MapPin className="h-3.5 w-3.5 text-forest-600" />
              <span className="truncate max-w-[110px] sm:max-w-[150px]">{cityName}</span>
            </button>

            {/* Preferences Modal Trigger */}
            <button
              onClick={onOpenPreferences}
              className="flex items-center gap-1.5 rounded-xl bg-forest-700 text-white px-3 py-1.5 text-xs font-bold hover:bg-forest-800 shadow-sm transition"
              title="Edit Household Preferences"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preferences</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-150">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-forest-50 text-forest-800"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4 text-forest-600" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
