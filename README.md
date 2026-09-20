# 💧 JalRakshak (जल रक्षक) — जल और मिट्टी का रक्षक

<div align="center">

[![Build](https://github.com/MSAbhishek22/jalrakshak/actions/workflows/ci.yml/badge.svg)](https://github.com/MSAbhishek22/jalrakshak/actions)
[![Tests](https://img.shields.io/badge/tests-21%20passing-brightgreen)](https://github.com/MSAbhishek22/jalrakshak/actions)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-0F766E)](https://jalrakshak.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**AI-powered water-and-soil guardian for India's 140 million smallholder farmers.**  
**Works in Hindi, Bengali, Marathi, Punjabi & English. Offline-capable. Free.**

[🌐 Live App](https://jalrakshak.vercel.app) • [📱 Demo](https://jalrakshak.vercel.app/?demo=true) • [📋 Play Store Listing](PLAY_STORE_LISTING.md)

</div>

---

## 🌧️ The Problem We're Solving

Every crop season, **140 million small and marginal farmers** in India face the same 3 questions every single morning:

> *"क्या आज पानी देना चाहिए?" — Should I irrigate today?*  
> *"क्या कल बारिश आएगी?" — Will it rain tomorrow?*  
> *"मेरी फसल को कोई खतरा है?" — Is my crop in danger?*

Getting these wrong costs real money. One mistimed irrigation cycle wastes **₹450–₹750** and thousands of liters of groundwater. With erratic monsoons and depleted water tables worsening every year, farmers who relied on generational knowledge are now flying blind.

Existing government apps (Kisan Suvidha, mKisan) are slow, English-heavy, and abandoned after launch. **There is no voice-first, multilingual, AI-powered tool built specifically for the smallholder farmer.**

**Until now.**

---

## 💡 What JalRakshak Does

JalRakshak is a **Progressive Web App** that acts as every farmer's personal water and soil guardian — in their language, on their ₹5,000 Android phone, even with poor internet.

### The Core Answers, Always Visible

```
💧 आज का फैसला — जल और मिट्टी की रक्षा

💧 आज पानी दें          🌧️ पानी मत दें
   (18% बारिश)              (85% बारिश!)

💧 जल बचत: 22,000 L बचाए • ₹500 सुरक्षित
```

### Key Features

| Feature | What it does |
|--------|-------------|
| 🤖 **AI सहायक** | Ask any farming question by voice or text in Hindi. Powered by Gemini 1.5 Flash. |
| 🌦️ **Hyperlocal Weather** | Real 7-day forecast with rain probability bars for your exact location. |
| 💧 **Irrigation Advisor** | AI decides: irrigate today or skip? Saves ~22,000 L water and ₹500 per avoided cycle. |
| 🧪 **Fertilizer Advisory** | N-P-K nutrient balancing tailored to crop type and soil conditions. |
| 🚨 **Flood & Drought Alerts** | Push notifications before danger arrives. Act before the crisis. |
| 💰 **Savings & Water Impact Tracker** | Water saved counter with village drinking-water equivalents + rupee savings. |
| 🌾 **Community Tips** | Peer-to-peer verified farmer wisdom and actionable local techniques. |
| 🏪 **Mandi Price Check** | Daily APMC mandi rates for major crops with price trends. |
| 📴 **Offline Mode** | Critical info available even with no internet — built for rural India. |
| 🎤 **Voice-First** | Central mic button. Speak your question. Get an answer. No typing needed. |
| 🌍 **5 Languages** | Hindi · Bengali · Marathi · Punjabi · English |

---

## 📊 The Numbers

| Metric | Value |
|--------|-------|
| Target farmers | 140 million smallholders in India |
| Average landholding | 1.15 hectares |
| Smartphone penetration | 70%+ (mostly sub-₹8,000 Android) |
| Water wasted per season | 15–40% due to mistimed irrigation |
| Savings per skipped cycle | ~22,000 Liters & ₹450 – ₹750 |
| Languages supported | 5 |
| App size (gzipped) | ~35KB JS — loads in under 2 seconds on 4G |

---

## 🏗️ Architecture

```
[Farmer's Android Phone — PWA]
         │
         ├──→ Open-Meteo API (hyperlocal weather, free, no auth)
         │
         ├──→ Vercel Serverless Function /api/chat
         │         └──→ Google Gemini 1.5 Flash (AI responses)
         │
         └──→ Firebase
                   ├── Analytics (anonymous usage tracking)
                   └── Cloud Messaging (push alerts)

Security: GEMINI_API_KEY server-only | CSP headers | HSTS | Rate limiting
Privacy: Zero PII collected | All data stays on device | No registration
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/MSAbhishek22/jalrakshak.git
cd jalrakshak
npm install
cp .env.example .env.local   # Fill in your API keys
npm run dev
```

Visit `http://localhost:5173` — the app loads instantly.

### Try the Demo
Visit **[jalrakshak.vercel.app/?demo=true](https://jalrakshak.vercel.app/?demo=true)** to see the app populated with 15 days of real-looking farmer data — water savings counter animating, irrigation log filled, weather live.

---

## 🔧 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 + Vite 5 | Fast builds, modern dev experience |
| Styling | Tailwind CSS 3 | Deep teal / sky / saffron design system |
| UI Icons | Lucide React | Clean, crisp, lightweight icons |
| Motion | Framer Motion | Smooth page transitions and feedback |
| AI | Google Gemini 1.5 Flash | Fast, multilingual, affordable |
| Weather | Open-Meteo API | Free, reliable, hyperlocal, no auth |
| Push Notifications | Firebase Cloud Messaging | Cross-platform, free tier |
| Analytics | Firebase Analytics | Anonymous usage tracking |
| Hosting | Vercel | Zero-config CDN + serverless |
| Testing | Vitest + MSW | 21 tests, 70%+ coverage |
| CI/CD | GitHub Actions | Auto-lint, test, deploy on push |

---

## 🔒 Security Architecture

- `GEMINI_API_KEY` is **server-side only** — never in the frontend bundle
- All AI requests go through `/api/chat` serverless proxy
- Rate limiting: 10 requests/minute per IP
- Content Security Policy, HSTS, X-Frame-Options headers
- Input sanitization: HTML stripped, 800 char limit, conversation history capped
- Zero PII: No phone numbers, no Aadhaar, no bank details ever collected

---

## 🧪 Testing

```bash
npm run test:run        # All unit tests across test files
npm run test:coverage   # Coverage report (target: 70%+)
npm run lint            # ESLint — 0 errors
npm run build           # Production build verification
```

---

## 👥 Team

Built with equal contribution by:

**MS Abhishek**  
📧 msabhishekanni10@gmail.com  
🐙 [github.com/MSAbhishek22](https://github.com/MSAbhishek22)

**Aayushi Goel**  
📧 aayushigoel73@gmail.com

---

## 📄 License

MIT License — free to use, fork, and build upon.

---

<div align="center">
<strong>💧 जल और मिट्टी का रक्षक — Built for the farmer who feeds us all. 🌾</strong>
</div>
