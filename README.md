# BreatheWise — Your Personal Clean-Air Companion
### Challenge 6: Urban Air Quality Assistant | Production Web Application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-pw--c6.vercel.app-2D6A4F?style=for-the-badge&logo=vercel&logoColor=white)](https://pw-c6.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-133124?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AnuragMishra1234/pw-c6)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6%20Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests Passing](https://img.shields.io/badge/Vitest-33%2F33%20Passing-16A34A?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/AnuragMishra1234/pw-c6)

> **Core Philosophy:** *"Don't just show pollution. Help people make better decisions because of it."*

🌐 **Live Application URL:** [https://pw-c6.vercel.app/](https://pw-c6.vercel.app/)  
📂 **GitHub Repository:** [https://github.com/AnuragMishra1234/pw-c6](https://github.com/AnuragMishra1234/pw-c6)  
📖 **Deployment Guide:** [deployment_guide.md](file:///e:/PW-chal6-Urban-aqi/deployment_guide.md) or [GitHub Deployment Guide](https://github.com/AnuragMishra1234/pw-c6/blob/main/deployment_guide.md)

---

## 1. Project Overview
- **Application Name:** BreatheWise
- **Tagline:** Your Personal Clean-Air Companion
- **Challenge Vertical:** Challenge 6 — Urban Air Quality Assistant
- **Live Deployment:** [https://pw-c6.vercel.app/](https://pw-c6.vercel.app/)
- **Repository:** [https://github.com/AnuragMishra1234/pw-c6](https://github.com/AnuragMishra1234/pw-c6)
- **Deployment Platform:** Vercel (Production Edge Network)

---

## 2. Chosen Challenge Vertical
**Challenge 6: Urban Air Quality Assistant**  
Severe urban air pollution and winter smog crises affect millions of individuals, families, and communities across major urban corridors. Most existing solutions merely act as passive data displays showing alarmist red or purple AQI numbers without telling users what to do differently today.

BreatheWise addresses this directly by answering three fundamental questions:
1. **What is the current air quality around me?**
2. **What should I do differently today?**
3. **How can my everyday choices reduce toxic exposure and personal emissions?**

---

## 3. Problem Statement & Context
During winter, atmospheric thermal inversions trap ground-level vehicular exhaust, road dust, and biomass smoke. Ordinary families face distinct challenges:
- **Alarmism Without Action:** Dashboards show frightening numbers without pragmatic exposure-reduction guidance.
- **Affluence Bias:** Standard online advice assumes everyone owns high-end HEPA purifiers and can work remotely, leaving outdoor workers, commuters, and modest households unsupported.
- **Conflation of Crucial Concepts:** People often confuse *reducing personal roadside toxic exposure* (e.g., choosing an enclosed metro car with air filters over riding an open two-wheeler) with *reducing greenhouse gas emissions* (e.g., taking public transit instead of a solo petrol car).

---

## 4. Proposed Solution
BreatheWise transforms atmospheric telemetry into actionable everyday wellness:
- **Live Air Intelligence:** Real-time atmospheric retrieval via Open-Meteo Air Quality & Geocoding APIs (tracking US AQI, $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{O}_3$, and 24-hour forecast curves).
- **Personalized Daily Clean-Air Plan:** A deterministic recommendation engine evaluating user household composition (children, seniors, multi-generational), daily routines (outdoor exercise, commute, outdoor work), transport modes, and dwelling resources.
- **Indoor Air Sanctuary Advisor:** Practical, low-cost and zero-cost indoor clean air practices (damp mopping vs broom sweeping, kitchen exhaust management, strategic midday ventilation timing, draft-gap sealing, and scientific myth-busting).
- **Smart Mobility Assistant:** Transparent comparative commute analysis demonstrating both personal exposure risk and estimated transport emissions across transit modes.
- **Impact Tracker:** Daily habit and sustainability tracking with transparent $\text{CO}_2$ avoidance modeling stored locally in the browser.
- **Groq AI Assistant:** An optional plain-language conversational helper grounded strictly in verified air quality data and deterministic recommendations.

---

## 5. Technology Stack
- **Frontend Framework:** Next.js 14.2 (App Router, Server Components & Client Hooks)
- **Programming Language:** TypeScript 5.6 (Strict Mode enabled throughout)
- **Styling:** Tailwind CSS 3.4 with custom environmental design tokens (Deep Forest Green `#1B4332`, Sage `#CBD8D1`, and EPA US AQI color codes)
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (24-hour AQI trend area charts)
- **Animations:** Framer Motion (subtle, accessible transitions)
- **Validation:** Zod 3.23 (strict API input validation and sanitization)
- **Testing:** Vitest 2.1 + Testing Library (JSDOM environment, 33 unit, component & integration tests passing)
- **External Atmospheric APIs:** Open-Meteo Geocoding API & Open-Meteo Air Quality API
- **AI Intelligence Layer:** Groq Cloud API (`qwen/qwen3.8-27b` with automatic deterministic fallback)
- **Production Host:** Vercel ([https://pw-c6.vercel.app/](https://pw-c6.vercel.app/))

---

## 6. System Architecture

```mermaid
flowchart TD
    User([User / Browser]) <-->|HTTPS / Responsive UI| VercelEdge["Vercel Edge Network (https://pw-c6.vercel.app/)"]
    
    subgraph NextApp["Next.js 14 App Router"]
        ClientApp["Client Components (Dashboard, Plan, Advisor, Mobility, Impact)"]
        LocalStorage[("Browser localStorage (Prefs & Habits)")]
        
        subgraph ServerRouteHandlers["Server Route Handlers"]
            AQIRoute["/api/air-quality"]
            GeoRoute["/api/geocoding"]
            AssistantRoute["/api/assistant"]
        end
        
        subgraph CoreDeterministicLib["Deterministic Engine (Source of Truth)"]
            RecEngine["CleanAirRecommendationEngine (lib/recommendations)"]
            AqiCalc["AQI Standard Calculator (lib/air-quality)"]
            EmissionsCalc["MobilityEmissionCalculator (lib/emissions)"]
            IndoorDB["Indoor Advisor Database (lib/indoor)"]
        end
    end
    
    VercelEdge <--> NextApp
    ClientApp <--> LocalStorage
    ClientApp --> CoreDeterministicLib
    ClientApp --> ServerRouteHandlers
    
    AQIRoute <-->|Cached 5m| OpenMeteoAQI[("Open-Meteo Air Quality API")]
    GeoRoute <-->|Cached 1h| OpenMeteoGeo[("Open-Meteo Geocoding API")]
    AssistantRoute <-->|Zod & Rate Limit| GroqAI[("Groq Cloud API (qwen/qwen3.8-27b)")]
```

---

## 7. How the Solution Works
1. **Location Selection:** User searches any global city or selects from popular presets. The Open-Meteo Geocoding API resolves exact coordinates.
2. **Atmospheric Fetch:** Server queries Open-Meteo Air Quality API for real-time US AQI and pollutant concentrations ($\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{O}_3$, $\text{CO}$, $\text{SO}_2$).
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
- **Active Model:** Powered by `qwen/qwen3.8-27b` on Groq, delivering sub-second response times.
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
> [!IMPORTANT]
> **Index Identification:** The air quality index presented in BreatheWise is the **United States EPA Air Quality Index (US AQI)** retrieved from Open-Meteo's atmospheric dispersion model. It is **not** the official Indian Central Pollution Control Board (CPCB) National AQI (NAQI), which uses different pollutant breakpoint concentrations and 24-hour weighted averaging. BreatheWise explicitly identifies the index as US AQI across all UI components.

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
| :--- | :---: | :---: | :--- |
| `aqi-calculator.test.ts` | 9 | **Passed** | Boundary values (0, 50, 100, 150, 200, 300, 500+), NaN safety, float precision |
| `recommendations-engine.test.ts` | 8 | **Passed** | Severity mapping, pediatric/geriatric rules, no-purifier routines, occupational guidance |
| `emissions-calculator.test.ts` | 6 | **Passed** | Distance × Factor accuracy, carpool occupancy, severe air warnings, distance clamping |
| `assistant-security.test.ts` | 6 | **Passed** | 500-char input limit, rate limiting, deterministic fallbacks, missing API key safety |
| `recommendation-card.test.tsx` | 3 | **Passed** | DOM rendering, rationale expansion toggle, completion callback triggering |
| `groq-live.test.ts` | 1 | **Passed** | Live API integration test verifying end-to-end Groq query resolution |
| **Total** | **33** | **33/33 Passed (100%)** | Full execution in 10.51s |

---

## 17. Environment Configuration
Create a `.env.local` file in the project root:

```env
# Optional Groq AI Assistant (Server-side only)
# If omitted or left empty, BreatheWise automatically runs using its deterministic rule engine
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=qwen/qwen3.8-27b

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

## 19. Deployment Instructions (Vercel & Render)
For a full guide with detailed screenshots and platform-specific instructions, see [deployment_guide.md](file:///e:/PW-chal6-Urban-aqi/deployment_guide.md) or [GitHub Deployment Guide](https://github.com/AnuragMishra1234/pw-c6/blob/main/deployment_guide.md).

### Quick Vercel Setup:
1. Import repository `AnuragMishra1234/pw-c6` into [Vercel](https://vercel.com).
2. Framework is auto-detected as **Next.js**.
3. Add Environment Variable:
   - `GROQ_API_KEY` = `your_key`
   - `GROQ_MODEL` = `qwen/qwen3.8-27b`
   - `NEXT_PUBLIC_APP_NAME` = `BreatheWise`
4. Click **Deploy**. Live URL: [https://pw-c6.vercel.app/](https://pw-c6.vercel.app/)

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
*Live at: [https://pw-c6.vercel.app/](https://pw-c6.vercel.app/)*
