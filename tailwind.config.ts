import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#EBF5F0",
          100: "#D3EADB",
          200: "#A9D5BC",
          300: "#7EBF9D",
          400: "#52A97E",
          500: "#2D6A4F",
          600: "#24553F",
          700: "#1B4332",
          800: "#133124",
          900: "#0B1D15",
        },
        sage: {
          50: "#F4F7F5",
          100: "#E6ECE8",
          200: "#CBD8D1",
          300: "#AFC3B9",
          400: "#94AEA2",
          500: "#799A8A",
        },
        aqi: {
          good: "#16A34A",
          moderate: "#D97706",
          sensitive: "#EA580C",
          unhealthy: "#DC2626",
          veryUnhealthy: "#7E22CE",
          hazardous: "#881337",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        card: "0 4px 20px -2px rgba(27, 67, 50, 0.06), 0 2px 6px -1px rgba(27, 67, 50, 0.04)",
        elevated: "0 10px 25px -5px rgba(27, 67, 50, 0.08), 0 8px 10px -6px rgba(27, 67, 50, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
