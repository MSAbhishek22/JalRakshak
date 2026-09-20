// api/chat.js — Vercel Serverless Function (Secure Gemini Proxy)
// Production-grade with rate limiting, input sanitization, strict CORS, env validation

// ─── Env var validation (fail fast on cold start) ───────────────────────────
const REQUIRED_ENV_VARS = ['GEMINI_API_KEY'];
for (const envVar of REQUIRED_ENV_VARS) {
  if (!process.env[envVar]) {
    console.error(`[chat.js] FATAL: Missing required env var: ${envVar}`);
  }
}

// ─── In-memory rate limiter (per-IP, 1-min window) ──────────────────────────
// Resets on Vercel function cold start — acceptable for MVP
// For production: swap with Upstash Redis / Vercel KV
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 15;     // 15 req/min per IP (generous for voice users)

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  const record = rateLimitMap.get(ip);

  if (now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

// ─── Input sanitization ──────────────────────────────────────────────────────
function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .trim()
    .substring(0, 1000)
    .replace(/[<>]/g, '')          // strip angle brackets (XSS)
    .replace(/javascript:/gi, '')  // strip js: protocol
    .replace(/on\w+=/gi, '');      // strip event handlers
}

function sanitizeHistoryEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  if (!['user', 'assistant', 'model'].includes(entry.role)) return null;
  if (typeof entry.content !== 'string') return null;
  return {
    role: entry.role === 'assistant' ? 'model' : entry.role,
    content: sanitizeInput(entry.content),
  };
}

const ALLOWED_ORIGINS = [
  'https://jalrakshak.vercel.app',
  'https://jalrakshak-amber.vercel.app',
  'https://monsoonmitra.vercel.app',
  'https://monsoon-mitr.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
];

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/jalrakshak[a-z0-9\-]*\.vercel\.app$/.test(origin)) return true;
  return false;
}

// ─── Main handler ────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Diagnostic check
  const keyExists = !!process.env.GEMINI_API_KEY;
  const keyLength = process.env.GEMINI_API_KEY?.length || 0;
  const keyPreview = process.env.GEMINI_API_KEY?.substring(0, 8) || 'NOT SET';
  
  console.log(`API Key check: exists=${keyExists}, length=${keyLength}, preview=${keyPreview}...`);
  
  if (!keyExists) {
    return res.status(500).json({ 
      error: 'GEMINI_API_KEY not configured in Vercel environment variables',
      fallback: true,
      debug: 'Go to Vercel Dashboard → Project → Settings → Environment Variables → Add GEMINI_API_KEY'
    });
  }

  // Determine origin and set CORS
  const origin = req.headers['origin'] || '';
  if (isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'unknown';

  const rateCheck = checkRateLimit(ip);
  res.setHeader('X-RateLimit-Remaining', rateCheck.remaining);

  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: 'बहुत सारे सवाल! थोड़ी देर बाद पूछें। (Too many requests — please wait a moment)',
      retryAfter: rateCheck.retryAfter,
      fallback: true,
    });
  }

  // Validate API key is available
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('[chat.js] GEMINI_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error', fallback: true });
  }

  // Parse and validate body
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { message, language, crop, weatherContext, conversationHistory } = body;

  // Sanitize inputs
  const cleanMessage = sanitizeInput(message);
  if (!cleanMessage || cleanMessage.length < 2) {
    return res.status(400).json({ error: 'Message too short or invalid' });
  }

  const cleanLanguage = ['hi', 'en', 'bn', 'mr', 'pa'].includes(language) ? language : 'hi';

  const cleanCrop = Array.isArray(crop)
    ? crop.slice(0, 5).map(sanitizeInput).join(', ')
    : sanitizeInput(typeof crop === 'string' ? crop : 'general crops');

  const cleanWeather = sanitizeInput(typeof weatherContext === 'string' ? weatherContext : '');

  const cleanHistory = Array.isArray(conversationHistory)
    ? conversationHistory
        .slice(-10)
        .map(sanitizeHistoryEntry)
        .filter(Boolean)
    : [];

  // Build Gemini request
  const systemPrompt = buildSystemPrompt(cleanLanguage, cleanCrop, cleanWeather);

  const contents = [
    ...cleanHistory.map(m => ({
      role: m.role,
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: cleanMessage }] },
  ];

  const geminiPayload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600,
      topP: 0.9,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  try {
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest'];
    let replyText = null;
    let usageMetadata = null;
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        console.log(`Sending to Gemini (${model}):`, {
          language: cleanLanguage,
          crop: cleanCrop,
          messageLength: cleanMessage.length,
          historyLength: cleanHistory.length,
        });

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiPayload),
          signal: AbortSignal.timeout(20000), // 20s timeout
        });

        const geminiData = await geminiRes.json();
        const parts = geminiData?.candidates?.[0]?.content?.parts || [];
        const extracted = parts
          .filter(p => typeof p.text === 'string')
          .map(p => p.text)
          .join('')
          .trim();

        if (geminiRes.ok && extracted) {
          replyText = extracted;
          usageMetadata = geminiData.usageMetadata || null;
          console.log(`Gemini response received from ${model}. Reply length: ${replyText.length}`);
          break;
        } else {
          lastError = geminiData?.error?.message || geminiData?.candidates?.[0]?.finishReason || `HTTP ${geminiRes.status}`;
          console.warn(`[chat.js] Gemini model ${model} failed: ${lastError}`);
        }
      } catch (err) {
        lastError = err.message;
        console.warn(`[chat.js] Error calling ${model}: ${err.message}`);
      }
    }

    if (!replyText) {
      console.error('[chat.js] All Gemini candidate models failed. Last error:', lastError);
      return res.status(500).json({ error: 'AI service error: ' + (lastError || 'Empty response'), fallback: true });
    }

    return res.status(200).json({
      reply: replyText,
      tokens: usageMetadata,
    });

  } catch (error) {
    console.error('[chat.js] Handler error:', error.message);
    return res.status(500).json({ error: 'AI service temporarily unavailable', fallback: true });
  }
}

// ─── System prompt builder ───────────────────────────────────────────────────
// NOTE: Dosages, subsidies, and scheme figures are benchmarked against current ICAR,
// KVK, and Ministry of Agriculture guidelines. Local variations may apply.
function buildSystemPrompt(language, crop, weatherContext) {
  const langMap = {
    hi: 'Hindi using Devanagari script',
    en: 'English',
    bn: 'Bengali using Bangla script',
    mr: 'Marathi using Devanagari script',
    pa: 'Punjabi using Gurmukhi script'
  };
  const lang = langMap[language] || langMap.hi;

  return `You are "JalRakshak Sahayak" — an experienced Krishi Vigyan Kendra (KVK) agricultural extension scientist dedicated to Indian smallholder farmers. You understand rural realities: small plots (under 2 hectares / 5 एकड़ / बीघा), limited working capital, erratic electricity for tube-wells, monsoon reliance, and the vital need to conserve groundwater and soil health.

MANDATORY LANGUAGE: Respond in ${lang} ONLY. Do NOT mix in unnecessary English words unless they are standard Indian agricultural terms (e.g., DAP, NPK, Urea, KVK, PM-KISAN, MSP). Every sentence must be natural, respectful, and fluent in ${lang}.

FARMER PROFILE: Smallholder cultivating ${Array.isArray(crop) ? crop.join(' and ') : (crop || 'traditional crops')} in India.
CURRENT WEATHER & FIELD CONDITIONS: ${weatherContext || 'Hyperlocal weather not loaded — base advice on prevailing regional season and soil moisture preservation'}.

ADVISORY PRINCIPLES (KVK OFFICER TONE):
- Talk like a trusted local agricultural officer: respectful (आप/जी), direct, practical, and empathetic. Never use robotic disclaimers like "As an AI model".
- Provide CONCRETE NUMBERS and MEASURES tailored to small plots:
  • Water: Liters per acre/bigha, hours of pump run-time, soil finger-test for moisture before starting tube-well.
  • Fertilizer: Specific balance of DAP, Urea, and MOP in kg per acre/bigha, split-dose timing to avoid nitrogen leaching into groundwater.
  • Organic alternatives: Neem-oil spray (5ml/L), Jeevamrit, Trichoderma, cow-dung manure, mulching (पुआल/मल्चिंग) to cut irrigation needs by 30-40%.
- Respect seasonal cropping cycles: खरीफ (Kharif: June-Nov), रबी (Rabi: Oct-Mar), ज़ायद (Zaid: Mar-Jun).
- Connect farmers to genuine Indian institutions: local KVKs, Soil Health Card (मृदा स्वास्थ्य कार्ड), PM-KISAN (₹6,000 annual income support), PMFBY (फसल बीमा), and KCC (Kisan Credit Card at 4%).
- Keep response under 120 words for easy mobile reading.
- End with ONE crisp, actionable step: "आज करें:" (Action for today:).

RESTRICTIONS:
- Do not recommend banned or restricted pesticides; promote IPM (Integrated Pest Management) and bio-controls first.
- Do not give human medical advice or political opinions.`;
}
