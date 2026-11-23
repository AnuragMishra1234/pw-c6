# BreatheWise — Your Personal Clean-Air Companion
### Challenge 6: Urban Air Quality Assistant | Production Web Application

> **Core Philosophy:** *"Don't just show pollution. Help people make better decisions because of it."*

---

## 1. Project Overview
**Application Name:** BreatheWise  
**Tagline:** Your Personal Clean-Air Companion  
**Challenge Vertical:** Challenge 6 — Urban Air Quality Assistant  
**Repository:** [https://github.com/AnuragMishra1234/pw-c6](https://github.com/AnuragMishra1234/pw-c6)  
**Deployment Target:** Vercel (Next.js 14 App Router, Zero Server-State Architecture)

---

## 2. Chosen Challenge Vertical
**Challenge 6: Urban Air Quality Assistant**  
Urban centers worldwide, particularly across North India and major global metropolitan corridors during winter thermal inversions, face severe smog crises characterized by hazardous PM2.5, PM10, and nitrogen dioxide spikes. While numerous dashboards display raw AQI numbers, ordinary families are left asking:
1. *What does this number mean for my children playing outside today?*
2. *What can I do if I cannot afford an expensive air purifier?*
3. *How should I travel to work without inhaling dense roadside exhaust plumes?*
4. *How do my daily choices reduce both my personal toxic exposure and my neighborhood's emissions?*

BreatheWise answers these three questions through real-time atmospheric intelligence, a deterministic recommendation engine, evidence-based indoor practices, transparent transport emission modeling, and an optional AI explanation layer.

---

## 3. Problem Statement & Context
During winter, shallow atmospheric boundary layers trap vehicular exhaust, construction dust, and biomass burning close to ground level. Existing solutions suffer from three major shortcomings:
- **Alarmism Without Action:** Dashboards display intimidating red or purple badges without providing actionable lifestyle adaptations.
- **Affluence Bias:** Most advice assumes households own multiple HEPA purifiers and can stay indoors indefinitely, ignoring outdoor workers and modest households.
- **Conflation of Concepts:** Applications frequently confuse *personal toxic exposure reduction* (shielding lungs from roadside plumes) with *emission reduction* (reducing the carbon/particulate footprint of travel).

---

## 4. Proposed Solution
BreatheWise bridges the gap between environmental monitoring and daily human decisions:
- **Live Air Intelligence:** Real-time atmospheric retrieval via Open-Meteo Air Quality & Geocoding APIs (tracking US AQI, PM2.5, PM10, NO₂, O₃, and 24-hour forecast trends).
- **Personalized Daily Clean-Air Plan:** A deterministic recommendation engine evaluating user household composition (children, seniors, multi-generational), daily routines (outdoor exercise, commute, outdoor work), transport modes, and dwelling resources.
- **Indoor Air Sanctuary Advisor:** Practical, low-cost/free indoor clean air guidance (wet mopping vs broom sweeping, kitchen exhaust management, strategic midday ventilation timing, draft-gap sealing, and scientific myth-busting).
- **Smart Mobility Assistant:** Transparent comparative commute analysis demonstrating both personal exposure risk and estimated transport emissions across transit modes.
- **Impact Tracker:** Daily habit and sustainability tracking with transparent CO₂ avoidance modeling stored locally in the browser.
- **Groq AI Assistant:** An optional plain-language conversational interface grounded strictly in verified air quality data and deterministic recommendations.

---

## 5. Technology Stack
- **Framework:** Next.js 14.2 (App Router, Server Components & Route Handlers)
- **Language:** TypeScript 5.6 (Strict Mode enabled throughout)
- **Styling:** Tailwind CSS 3.4 with custom environmental color tokens (Forest Greens, Sage, and standardized US AQI color codes)
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (24-hour AQI trend area charts)
- **Animations:** Framer Motion (subtle, accessible transitions)
- **Validation:** Zod 3.23 (strict API input validation and sanitization)
- **Testing:** Vitest 2.1 + Testing Library (JSDOM environment, 32 unit & component tests passing)
- **APIs:** Open-Meteo Geocoding API & Open-Meteo Air Quality API
- **AI Intelligence Layer:** Groq Cloud API (`llama-3.3-70b-versatile` with configurable fallback)

---

## 6. System Architecture

```mermaid
flowchart TD
    Client[Next.js Client Application] -->|Fetch Clean Air Data| AQIRoute["/api/air-quality (Route Handler)"]
    Client -->|Search Locations| GeoRoute["/api/geocoding (Route Handler)"]
    Client -->|Ask Question (Optional)| AssistantRoute["/api/assistant (Route Handler)"]
    
    AQIRoute -->|Cached 5m| OpenMeteoAQI["Open-Meteo Air Quality API"]
    GeoRoute -->|Cached 1h| OpenMeteoGeo["Open-Meteo Geocoding API"]
    AssistantRoute -->|Zod & Rate Limit| GroqAI["Groq Cloud API (Server-Side Key)"]
    
    Client --> LocalStorage[("Browser localStorage (Prefs & Impact)")]
    
    subgraph Core Deterministic Logic
        RecEngine["CleanAirRecommendationEngine (lib/recommendations)"]
        AqiCalc["AQI Calculator & Standards (lib/air-quality)"]
        EmissionsCalc["MobilityEmissionCalculator (lib/emissions)"]
        IndoorGuide["Indoor Advisor Database (lib/indoor)"]
    end
    
    Client --> RecEngine
    Client --> AqiCalc
    Client --> EmissionsCalc
    Client --> IndoorGuide
```

---

## 7. How the Solution Works
1. **Location Selection:** User searches any global city or selects from popular presets. The Open-Meteo Geocoding API resolves exact coordinates.
2. **Atmospheric Fetch:** Server queries Open-Meteo Air Quality API for real-time US AQI and pollutant concentrations (PM2.5, PM10, NO₂, O₃, CO, SO₂).
3. **Deterministic Evaluation:** `CleanAirRecommendationEngine` combines ambient atmospheric readings with user household profile (children, seniors, outdoor worker, purifier status, commute distance).
4. **Actionable Plan Generation:** Yields a balanced 5-pillar daily action plan (Outdoor, Indoor, Mobility, Family, Sustainability) with priority rankings, evidence-based rationales, and expected benefits.
5. **Impact Logging:** User checks off completed actions or logs low-emission commutes. Avoided emissions and habits are persisted in browser `localStorage`.
6. **Optional Plain-Language Inquiries:** Users can query the Groq AI Assistant for plain-language explanations; if no API key is supplied or rate limits are reached, the system falls back seamlessly to deterministic rule guidance.

---

## 8. Recommendation Engine Logic (`lib/recommendations/`)
The deterministic recommendation engine is the single source of truth:
- **Input Context:** Atmospheric telemetry + User Household Profile + Daily Activities + Commute Mode + Dwelling Characteristics.
- **Rule Architecture:** Modular predicate rules in `rules.ts` that match specific combinations of environmental severity and lifestyle vulnerability:
  - *Good AQI (0–50):* Encourages outdoor cardiovascular workouts, open-air recreation, active cycling/walking, and midday window ventilation.
  - *Moderate AQI (51–100):* Balances normal routines with monitoring for respiratory sensitivity in children and older adults.
  - *Unhealthy for Sensitive Groups (101–150):* Advises shifting strenuous aerobic exercise indoors, avoiding busy arterial roads, and reducing outdoor exertion for vulnerable family members.
  - *Unhealthy AQI (151–200):* Cancels strenuous outdoor cardio, recommends certified particulate respirators (N95/FFP2) for necessary transit, advises in-cabin AC recirculation, and enforces window closures.
  - *Very Unhealthy & Hazardous (201–500+):* Emergency smog protocols: stay indoors, seal roadside door/window gaps, use HEPA filtration or wet mopping routines, and restrict outdoor exposure.
- **Personalized Nuance:**
  - *Outdoor Workers:* Instead of unrealistic "stay indoors" orders, provides staged indoor rest guidelines and respirator protection.
  - *Households without Purifiers:* Prioritizes zero-combustion indoor rules (no incense, coils, or dry sweeping) and wet-cloth dusting.

---

## 9. Personalization & Household Profiles
Users configure an editable profile that instantly updates generated clean-air plans:
- **Household Demographics:** Individual, General Family, Family with Children, Family with Elderly, Multi-Generational.
- **Daily Activities:** Outdoor Exercise, Office Commute, School Commute, Work From Home, Outdoor Worker, Mostly Indoors.
- **Commuting Preference:** Walking, Bicycle, Two-Wheeler, Solo Car, Public Transit.
- **Home Environment:** Presence of HEPA Air Purifier, Proximity to Busy Thoroughfare, Natural Cross-Ventilation, Indoor Plants, Dwelling Size.

---

## 10. Groq AI Integration & Safety Architecture
- **Server-Side Exclusivity:** `GROQ_API_KEY` is strictly confined to Next.js Route Handlers (`src/app/api/assistant/route.ts`). It is never bundled into client assets.
- **Strict Input Validation:** All inbound payloads are validated using Zod:
  - Questions are capped at 500 characters.
  - Payloads exceeding 15 KB are rejected.
  - In-memory IP rate limiting enforces a maximum of 20 requests per minute per IP.
- **Deterministic Source of Truth:** System prompts instruct Groq to act strictly as an empathetic explanation layer for the deterministic recommendation engine. The model is forbidden from inventing AQI numbers, overriding safety constraints, or dispensing medical diagnoses.
- **Graceful Zero-Key Fallback:** If `GROQ_API_KEY` is omitted, BreatheWise operates 100% functionally using deterministic keyword and rule heuristics.

---

## 11. External API Integrations
1. **Open-Meteo Geocoding API:**
   - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
   - Purpose: City search, administrative area resolution, latitude/longitude lookup.
   - Cache: 1-hour HTTP cache headers.
2. **Open-Meteo Air Quality API:**
   - Endpoint: `https://air-quality-api.open-meteo.com/v1/air-quality`
   - Fields: `us_aqi`, `pm2_5`, `pm10`, `carbon_monoxide`, `nitrogen_dioxide`, `ozone`, `sulphur_dioxide`, hourly forecast.
   - Cache: 5-minute HTTP cache headers.

---

## 12. Data Sources & AQI Interpretation Notice
> **Important Distinction:** The air quality index presented in BreatheWise is the **United States EPA Air Quality Index (US AQI)** retrieved from Open-Meteo's atmospheric dispersion model. It is **not** the official Indian Central Pollution Control Board (CPCB) National AQI (NAQI), which uses different pollutant breakpoint concentrations and 24-hour weighted averaging. BreatheWise explicitly identifies the index as US AQI across all UI components.

**US AQI Categories:**
- `0–50`: Good (Green)
- `51–100`: Moderate (Amber)
- `101–150`: Unhealthy for Sensitive Groups (Orange)
- `151–200`: Unhealthy (Red)
- `201–300`: Very Unhealthy (Purple)
- `301–500+`: Hazardous (Maroon)

---

## 13. Emission Estimation Assumptions & Methodology
BreatheWise estimates commute emissions using transparent, published life-cycle factors (DEFRA / IPCC / ARAI):
$$\text{Estimated Emissions (g CO}_2\text{e)} = \text{Distance (km)} \times \text{Mode Factor (g CO}_2\text{e / passenger-km)}$$

**Operational Factors Used:**
- *Walking / Bicycle:* $0\text{ g/p-km}$ (Active zero tailpipe transit)
- *Metro / Electric Rail:* $35\text{ g/p-km}$ (Grid-powered urban transit with high ridership factor)
- *Electric Bus:* $45\text{ g/p-km}$ (Municipal electric fleet average)
- *City Bus (CNG/Diesel):* $65\text{ g/p-km}$ (Average urban occupancy 35–40 passengers)
- *Two-Wheeler (Motorcycle/Scooter):* $75\text{ g/p-km}$ (Single rider on 100–150cc 4-stroke engine)
- *Carpool (2–3 Persons):* $96\text{ g/p-km}$ (Shared fuel/exhaust footprint)
- *Solo Passenger Car:* $192\text{ g/p-km}$ (Mid-size petrol/diesel internal combustion vehicle, 1 occupant)

*Transparency Notice: Values represent comparative averages for decision-support and are not directly measured tailpipe emissions.*

---

## 14. Security Measures
- **No Secrets in Code:** Zero API keys or sensitive tokens exist in client bundles or public repositories.
- **Server-Side API Proxying:** Client components never call Groq or external keys directly; all requests route through Next.js Route Handlers.
- **Zod Validation:** Schema validation guarantees clean strings and rejects malformed inputs.
- **Strict Size Limits:** Inbound body size check limits payloads to under 15 KB.
- **Rate Limiting:** Sliding-window IP rate limiter shields against spam and denial-of-service attempts.
- **No HTML Injection:** Rendered text utilizes safe React string nodes with zero `dangerouslySetInnerHTML`.
- **Privacy Conscious:** No personal identifying data (names, emails, exact GPS coords) is stored or tracked.

---

## 15. Accessibility (a11y)
- **High Contrast:** All text meets WCAG AA contrast standards (>4.5:1 ratio).
- **Not Color-Alone:** Status colors are always paired with explicit text labels (e.g. "Good", "Hazardous").
- **Semantic HTML:** Native `<header>`, `<main>`, `<nav>`, `<section>`, and `<button>` elements.
- **Keyboard Navigation:** Focus-visible outlines on all interactive elements. Modals support `Escape` key closing.
- **Screen Reader Friendly:** Accessible ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).
- **Responsive Layout:** Optimized from 360px mobile viewports up to 4K desktop screens.

---

## 16. Testing Strategy & Results
BreatheWise features unit, integration, and component tests running under Vitest and JSDOM:

| Test Suite | Tests | Result | Focus |
| :--- | :--- | :--- | :--- |
| `aqi-calculator.test.ts` | 9 | **Passed** | Boundary values (0, 50, 100, 150, 200, 300, 500+), NaN safety, float precision |
| `recommendations-engine.test.ts` | 8 | **Passed** | Severity mapping, pediatric/geriatric rules, no-purifier routines, occupational guidance |
| `emissions-calculator.test.ts` | 6 | **Passed** | Distance × Factor accuracy, carpool occupancy, severe air warnings, distance clamping |
| `assistant-security.test.ts` | 6 | **Passed** | 500-char input limit, rate limiting, deterministic fallbacks, missing API key safety |
| `recommendation-card.test.tsx` | 3 | **Passed** | DOM rendering, rationale expansion toggle, completion callback triggering |
| **Total** | **32** | **32/32 Passed (100%)** | Full execution in 16.10s |

---

## 17. Environment Configuration
Create a `.env.local` file in the project root:

```env
# Optional Groq API Key (Server-side only)
# If omitted or left empty, BreatheWise automatically runs using its deterministic rule engine
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Public metadata
NEXT_PUBLIC_APP_NAME=BreatheWise
```

---

## 18. Installation & Local Development Instructions

### Prerequisites
- Node.js version 18.17.0 or higher (v20+ recommended)
- npm version 9.0.0 or higher

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnuragMishra1234/pw-c6.git
   cd pw-c6
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run automated test suite:**
   ```bash
   npm test
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

6. **Verify production build:**
   ```bash
   npm run build
   ```

---

## 19. Deployment Instructions (Vercel)
BreatheWise is designed for one-click deployment on Vercel:
1. Push repository to GitHub.
2. Import project into Vercel Dashboard.
3. Set optional environment variable: `GROQ_API_KEY` (if desired).
4. Click **Deploy**. Vercel will run `npm run build` and provision serverless edge functions for route handlers.

---

## 20. Assumptions and Limitations
- **Atmospheric Model:** Open-Meteo utilizes numerical weather prediction models combined with satellite reanalysis. Local hyper-local microclimates (e.g. 50 meters from an unpaved road) may differ from regional grid points.
- **Index Standard:** Uses US AQI (EPA). CPCB NAQI values may vary due to differing calculation algorithms.
- **Emissions:** Calculations reflect fleet passenger-kilometer averages; actual emissions vary with engine maintenance, driving behavior, and real-time vehicle occupancy.
- **Medical Scope:** BreatheWise offers lifestyle exposure-reduction advice and does not diagnose, treat, or prevent clinical diseases.

---

## 21. Future Enhancements
- Hyper-local crowdsourced IoT sensor network integration (PurpleAir / OpenAQ).
- Push notification alerts when morning smog inversions cross critical thresholds.
- Multi-lingual localization for regional Indian languages (Hindi, Bengali, Tamil, Kannada).
- Offline progressive web app (PWA) caching for low-connectivity zones.

---

*BreatheWise — Built with care for Challenge 6 | Urban Air Quality Assistant.*
