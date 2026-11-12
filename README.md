# 🚀 ProProfile AI - Premium LinkedIn Profile Generator SaaS

An enterprise-grade, privacy-first AI SaaS dashboard for generating high-converting, recruiter-optimized LinkedIn profiles. Engineered with a **Premium Dark Navy Theme (#080D19)**, glassmorphic UI components, electric blue & purple gradients, and full responsiveness across desktop, tablet, and mobile.

Supports both **AI-Powered Generation** (via Google Gemini Free Tier or OpenAI) through a secure local backend, and **100% Offline Smart Templates** with zero dependencies.

---

## 🌟 What's New in the AI SaaS Dashboard

1. **🎨 Premium Dark Theme & Glassmorphism**:
   - Deep navy background (`#080D19`) with dark glassmorphism cards (`#111827` / backdrop-blur).
   - Futuristic blue (`#3b82f6`) and purple (`#8b5cf6`) gradient accents and glowing hover interactions.
   - Built-in **Dark / Light Mode Toggle** that remembers your preference via `localStorage`.

2. **🧭 Multi-View SaaS Navigation**:
   - **Dashboard**: Live session KPIs (Profiles Created, AI Model Status, Optimization Grade, LinkedIn 2026 algorithm checklist, and quick role presets).
   - **Profile Generator**: Core studio split into a stylish 4-step input form and an interactive live preview.
   - **My Profiles**: Auto-saves generated profile snapshots locally so you can revisit, restore, or copy past profiles anytime.
   - **Settings**: Appearance mode customizer, AI provider configuration guides, and local cache controls.

3. **⚡ High-Tech Preview & Real-Time Metrics**:
   - **AI Shimmer Skeleton**: Smooth glowing loading animation while AI processes your profile.
   - **Live Character & Word Counters**: Instant length check for LinkedIn's 220-character headline limit and estimated read time for summaries.
   - **1-Click Copy**: Copy individual sections or the entire profile with visual checkmark feedback.
   - **Algorithm Checklist**: Built-in 2026 recruiter search optimization tips.

4. **🔒 Dual Engine & Zero-Leak Security**:
   - **AI Enhanced Mode**: Connects to Google Gemini (Free Tier) or OpenAI via your local backend (`server.js`).
   - **Smart Template Fallback**: Runs 100% offline in browser without needing keys or servers.
   - **Strict Privacy**: Your private API keys remain strictly in your local `.env` and are never exposed to the client.

---

## 💰 Free vs. Paid Cost Breakdown

| Component | Cost | Notes |
| :--- | :--- | :--- |
| **Smart Template Engine** | **100% FREE** | Runs locally in your browser. No subscription, no internet, and no API keys required. |
| **Local Backend Server (`server.js`)** | **100% FREE** | Runs on your local machine using standard Node.js built-ins. Zero npm dependencies. |
| **Google Gemini API (Recommended)** | **FREE TIER** | Google AI Studio offers a free tier for models like `gemini-1.5-flash` with up to 15 RPM and 1,500 RPD without requiring a credit card. |
| **OpenAI API (Alternative)** | **Pay-As-You-Go** | Requires prepaid billing credits on OpenAI platform (uses affordable `gpt-4o-mini`). |

---

## ⚙️ Simple Setup & Running Instructions

### Method 1: Running with AI Support (Google Gemini Free Tier)

#### Step 1: Get a Free Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **"Create API Key"** and copy the generated key.

#### Step 2: Configure Your `.env` File
1. In your project folder, copy `.env.example` to `.env` (or create a file named `.env`).
2. Add your key:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

#### Step 3: Start the Backend Server
Open your terminal in this folder and run:
```bash
node server.js
```
*(No `npm install` needed! Built entirely with Node.js built-in modules).*

#### Step 4: Open in Your Browser
Open your browser and navigate to:
```
http://localhost:3000
```
The status pill in the top navigation will display: **"🟢 AI Ready (GEMINI)"**.

---

### Method 2: Running in Pure Offline Template Mode (No Setup Required)

If you don't want an API key or backend:
1. Double-click `index.html` to open it directly in any modern browser.
2. The status pill will display **"⚡ Offline Template Mode"**.
3. All profile generation, sample data loading, and copy features work instantly!

---

## 🔒 Security Best Practices Implemented

- **No Frontend Secrets**: Neither `index.html` nor `script.js` contains any API tokens or sensitive credentials.
- **Git Protection**: `.gitignore` is pre-configured to ensure `.env` and `node_modules` are never committed to version control.
- **Input Sanitization**: Request bodies are validated on both frontend and backend before contacting any AI service.
- **Error Shielding**: Raw backend stack traces or internal secrets are never exposed in user alerts.
