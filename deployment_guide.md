# BreatheWise — Production Deployment Guide
## Vercel & Render Deployment Manual

This guide provides step-by-step instructions to deploy **BreatheWise (Urban Air Quality Assistant)** to production on **Vercel** (recommended for Next.js) and **Render** (alternative hosting).

---

## 1. Pre-Deployment Checklist

Before deploying, verify that your local repository is in a healthy, passing state:

```bash
# 1. Run all unit and component tests
npm test

# 2. Verify production build succeeds locally
npm run build
```

Both commands should complete with `exit code 0`.

---

## 2. Option 1: Deploying on Vercel (Recommended)

Vercel is the native hosting platform for Next.js 14. It provides automatic edge caching, serverless route handlers, and zero configuration.

### Method A: Deploy via Vercel Web Dashboard (1-Click Import)

1. **Log in to Vercel:**
   - Go to [https://vercel.com](https://vercel.com) and sign in with your GitHub account.

2. **Import Repository:**
   - Click **"Add New..."** → **"Project"**.
   - Under *Import Git Repository*, find `pw-c6` (or `AnuragMishra1234/pw-c6`) and click **"Import"**.

3. **Configure Project Settings:**
   - **Framework Preset:** `Next.js` (automatically detected).
   - **Root Directory:** `./` (default).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `.next` (default).
   - **Install Command:** `npm install` (default).

4. **Set Environment Variables:**
   Expand the **Environment Variables** section and add the following keys:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `GROQ_API_KEY` | `gsk_...` | Your Groq Cloud API Key (Server-side secret). |
   | `GROQ_MODEL` | `qwen/qwen3.8-27b` | Active supported Groq model. |
   | `NEXT_PUBLIC_APP_NAME` | `BreatheWise` | Display name for the application. |

   > **Note:** Even if `GROQ_API_KEY` is omitted, BreatheWise runs 100% functionally using its built-in deterministic rules fallback engine!

5. **Deploy:**
   - Click **"Deploy"**.
   - Vercel will clone the repository, run the build, and assign a production URL (e.g., `https://pw-c6.vercel.app` or `https://breathewise.vercel.app`).

---

### Method B: Deploy via Vercel CLI

If you prefer using the command line:

1. **Install Vercel CLI (or run with npx):**
   ```bash
   npx vercel login
   ```

2. **Deploy to Preview:**
   ```bash
   npx vercel
   ```
   Follow the prompts to link to your Vercel account.

3. **Add Environment Variables via CLI:**
   ```bash
   npx vercel env add GROQ_API_KEY production
   npx vercel env add GROQ_MODEL production
   npx vercel env add NEXT_PUBLIC_APP_NAME production
   ```

4. **Deploy to Production:**
   ```bash
   npx vercel --prod
   ```

---

## 3. Option 2: Deploying on Render (Alternative)

Render can run Next.js as a persistent Node.js Web Service.

### Step-by-Step Render Setup:

1. **Log in to Render:**
   - Go to [https://render.com](https://render.com) and sign in.

2. **Create New Web Service:**
   - Click **"New +"** → **"Web Service"**.
   - Connect your GitHub repository: `AnuragMishra1234/pw-c6`.

3. **Configure the Web Service:**
   - **Name:** `breathewise` (or your choice).
   - **Region:** Choose the region closest to your target audience (e.g., *Singapore* or *Frankfurt*).
   - **Branch:** `main`
   - **Root Directory:** (leave blank for root).
   - **Runtime:** `Node`

4. **Build & Start Commands:**
   - **Build Command:**
     ```bash
     npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     npm start -- -p $PORT
     ```
     *(Next.js will bind to the `$PORT` environment variable provided by Render).*

5. **Instance Type:**
   - Select **Free** (or *Starter* for continuous uptime without cold starts).

6. **Add Environment Variables on Render:**
   Under **"Environment Variables"**, add:
   - `GROQ_API_KEY`: `gsk_...`
   - `GROQ_MODEL`: `qwen/qwen3.8-27b`
   - `NEXT_PUBLIC_APP_NAME`: `BreatheWise`
   - `NODE_VERSION`: `20.17.0` (or `22.23.1`)

7. **Deploy:**
   - Click **"Create Web Service"**.
   - Render will build the Next.js app and assign a URL: `https://breathewise.onrender.com`.

---

## 4. Post-Deployment Verification Checklist

Once your deployment is live, verify all core functional workflows:

### A. Live Air Intelligence Check
1. Open the deployed application URL.
2. The dashboard should display real-time atmospheric data for the default city (Delhi) with **US AQI**, pollutant concentrations ($\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{O}_3$), and a 24-hour forecast chart.
3. Click **"Change"** next to the city name:
   - Search for another city (e.g., *Mumbai*, *Bengaluru*, *Tokyo*).
   - Ensure the coordinates and live readings update cleanly.

### B. Decision Engine & Action Plan Check
1. Navigate to the **"Daily Plan"** tab.
2. Confirm that recommendations appear across all 5 pillars:
   - Outdoor Activity
   - Indoor Sanctuary
   - Smart Mobility
   - Household Precautions
   - Sustainability Impact
3. Click the checkbox on any recommendation:
   - Verify the toast notification appears: *"Action completed! +50g CO₂ impact logged."*
   - Check the **"Impact Tracker"** tab to verify that the completed action and avoided emissions were stored.

### C. Household Profile Customization Check
1. Click **"Preferences"** in the top navigation bar.
2. Switch household to **"Family with Children"** and primary transport to **"Car"**.
3. Click **"Save Preferences"**.
4. Confirm that the recommendations update dynamically to reflect pediatric advice and car-cabin recirculation.

### D. Groq AI Assistant Verification
1. Scroll down to the **"Clean-Air AI Assistant"** widget on the dashboard.
2. Click a sample prompt: *"Can my children play outside today?"*
3. Verify that the assistant responds in seconds with:
   - A contextual answer referencing current AQI and child-specific activity advice.
   - The badge: **"AI Explanation (qwen/qwen3.8-27b)"**.

---

## 5. Troubleshooting & FAQ

### Issue: AI Assistant shows "Deterministic Rule Guidance" instead of "AI Explanation"
- **Cause:** `GROQ_API_KEY` is missing, invalid, or experiencing rate limits on the hosting platform.
- **Resolution:**
  - Verify that `GROQ_API_KEY` is set in the hosting dashboard (Vercel Project Settings → Environment Variables).
  - If you recently added the environment variable, trigger a **Redeploy** on Vercel or Render so the serverless runtime picks up the new key.
  - Verify that `GROQ_MODEL` is set to `qwen/qwen3.8-27b`.

### Issue: City Search or Air Quality API returns timeout
- **Cause:** Temporary network latency with the external Open-Meteo API.
- **Resolution:**
  - BreatheWise has built-in retry buttons and caches successful readings.
  - Click **"Refresh"** or select a popular preset city (Delhi, Bengaluru, Mumbai).
  - The application is engineered never to crash or display fabricated data if external APIs are unreachable.

### Issue: Render Free Tier Cold Starts
- **Cause:** Render Free Tier spins down after 15 minutes of inactivity.
- **Resolution:**
  - The first request after inactivity may take 30–50 seconds to boot.
  - Vercel is recommended for production as its serverless edge functions have near-instant cold starts.

---

## 6. Architecture & Security Highlights for Evaluators

- **Zero Client-Side Secrets:** `GROQ_API_KEY` is strictly server-side and never exposed to browser bundles.
- **Zod Validation & Rate Limiting:** All requests to `/api/assistant` pass through a sliding-window rate limiter (20 requests/min per IP) and strict Zod payload validation.
- **Accessibility:** Meets WCAG AA contrast standards, keyboard navigable, screen-reader friendly, and does not rely on color alone to indicate severity.
- **Deterministic Reliability:** Deterministic recommendation rules serve as the authoritative source of truth, ensuring safe and reliable family advice regardless of AI connectivity.

---
*BreatheWise — Challenge 6 | Urban Air Quality Assistant*
