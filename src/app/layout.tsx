import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BreatheWise — Your Personal Clean-Air Companion",
  description:
    "Intelligent urban air quality assistant helping individuals and families navigate severe winter smog and pollution with personalized clean-air plans, low-cost indoor practices, and sustainable mobility alternatives.",
  keywords: [
    "air quality",
    "AQI",
    "smog assistant",
    "clean air plan",
    "PM2.5",
    "indoor air quality",
    "sustainable commuting",
    "urban wellness",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-[#F8FAF9] text-[#133124] antialiased selection:bg-forest-100 selection:text-forest-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 focus:p-3 focus:bg-forest-800 focus:text-white focus:rounded-xl focus:shadow-elevated focus:outline-none focus:ring-2 focus:ring-white text-xs font-bold"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
