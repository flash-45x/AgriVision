import { DiseaseDiagnosis, CropRecommendation, LanguageCode, UserRole } from "../types";

export interface DiagnoseRequest {
  imageBase64: string;
  mimeType?: string;
  cropName?: string;
  language?: LanguageCode;
  role?: UserRole;
  notes?: string;
}

export interface ChatRequest {
  message: string;
  imageBase64?: string;
  mimeType?: string;
  role?: UserRole;
  language?: LanguageCode;
  context?: Record<string, any>;
}

export interface CropRecommendRequest {
  soilType?: string;
  soilPh?: number;
  season?: string;
  region?: string;
  waterAvailability?: string;
}

/**
 * Retrieves the client-side Gemini API key configured for Vite.
 * In Vite projects (like AgriVision), frontend environment variables MUST be prefixed with VITE_.
 * Checks VITE_GEMINI_API_KEY and common aliases.
 */
export function getClientGeminiApiKey(): string | null {
  // Vite exposes env vars via import.meta.env
  const metaEnv = (import.meta as any).env || {};
  const apiKey =
    metaEnv.VITE_GEMINI_API_KEY ||
    metaEnv.VITE_GOOGLE_GENAI_API_KEY ||
    metaEnv.VITE_API_KEY ||
    metaEnv.GEMINI_API_KEY ||
    metaEnv.NEXT_PUBLIC_GEMINI_API_KEY ||
    (typeof window !== "undefined" && (window as any).__GEMINI_API_KEY__);

  if (apiKey && typeof apiKey === "string" && apiKey.trim().length > 0 && apiKey !== "MY_GEMINI_API_KEY") {
    return apiKey.trim();
  }
  return null;
}

/**
 * Performs a direct client-side Gemini REST API call when deployed to static hosts (Netlify / Vercel)
 * where the Node/Express backend server (/api/*) is not running.
 */
async function callDirectGeminiRest(prompt: string, options?: {
  systemInstruction?: string;
  imageBase64?: string;
  mimeType?: string;
  jsonMode?: boolean;
}): Promise<string> {
  const apiKey = getClientGeminiApiKey();
  if (!apiKey) {
    const errorMsg =
      "Missing Gemini API Key in browser environment. Framework: Vite (React). Please configure 'VITE_GEMINI_API_KEY' in your Netlify or Vercel Environment Variables dashboard.";
    console.error(`[AgriVision AI Error] ❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  console.info(
    `[AgriVision AI] 🚀 Executing direct client-side Gemini REST API call (Vite frontend with VITE_GEMINI_API_KEY)...`
  );

  const parts: any[] = [];
  if (options?.imageBase64) {
    const cleanBase64 = options.imageBase64.replace(/^data:image\/\w+;base64,/, "");
    parts.push({
      inlineData: {
        mimeType: options.mimeType || "image/jpeg",
        data: cleanBase64,
      },
    });
  }
  parts.push({ text: prompt });

  const payload: any = {
    contents: [
      {
        parts,
      },
    ],
  };

  if (options?.systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  if (options?.jsonMode) {
    payload.generationConfig = {
      responseMimeType: "application/json",
    };
  }

  // Primary model with fallback
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[AgriVision AI] Model '${model}' returned status ${response.status}:`, errText);
        lastError = new Error(`Gemini API error (${response.status}): ${errText}`);
        continue;
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOutput) {
        console.info(`[AgriVision AI] ✅ Direct Gemini call succeeded using model '${model}'!`);
        return textOutput;
      }
    } catch (err: any) {
      console.warn(`[AgriVision AI] Network error querying model '${model}':`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("All client-side Gemini model endpoints failed.");
}

/**
 * AI Crop Disease Diagnosis
 */
export async function diagnoseCropImage(req: DiagnoseRequest): Promise<DiseaseDiagnosis> {
  console.info("[AgriVision AI] 🔬 Initiating crop disease diagnosis...");

  // 1. First attempt full-stack backend endpoint (/api/ai/diagnose)
  try {
    const res = await fetch("/api/ai/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.result) {
        console.info("[AgriVision AI] ✅ Backend diagnosis succeeded via /api/ai/diagnose");
        return formatDiagnosisResult(data.result, req);
      }
    } else {
      console.warn(
        `[AgriVision AI] ⚠️ Backend /api/ai/diagnose returned ${res.status} (likely static host like Netlify/Vercel). Switching to direct client Gemini call...`
      );
    }
  } catch (backendErr: any) {
    console.warn(
      `[AgriVision AI] ⚠️ Backend /api/ai/diagnose unreachable (${backendErr?.message || backendErr}). Switching to direct client Gemini call...`
    );
  }

  // 2. Direct client-side Gemini call using VITE_GEMINI_API_KEY
  try {
    const prompt = `You are a certified senior plant pathologist and agronomist for AgriVision.
Analyze this crop/plant leaf image carefully.
Crop context: ${req.cropName || "Field Crop"}.
User notes: ${req.notes || ""}.
Target Language: "${req.language || "en"}".
User Role: "${req.role || "farmer"}".

Provide your diagnosis as a strict JSON object with the following fields:
{
  "diseaseName": "Scientific or formal name of disease or 'Healthy Plant'",
  "commonName": "Common farmer-friendly name in ${req.language || "en"} or English",
  "severity": "low" | "medium" | "high" | "critical" | "healthy",
  "colorStatus": "green" | "yellow" | "red",
  "confidence": number between 70 and 99,
  "isHealthy": boolean,
  "description": "2 sentences describing symptoms visible in the image",
  "organicRemedy": "1-2 natural/organic treatments with exact verified dosages (e.g., Neem oil 1500ppm @ 5ml/L, Trichoderma viride @ 5g/L, diluted sour buttermilk 1:9)",
  "chemicalTreatment": "1-2 chemical options with exact verified formulations and spray dilution ratios (e.g. Mancozeb 75% WP @ 2.0g/L, Hexaconazole 5% EC @ 1ml/L)",
  "preventiveMeasures": "2 concrete field management steps for the next 7 days"
}
Ensure all descriptions and remedies are localized into the chosen language (${req.language || "en"}) where appropriate. Return ONLY valid JSON.`;

    const rawJson = await callDirectGeminiRest(prompt, {
      imageBase64: req.imageBase64,
      mimeType: req.mimeType || "image/jpeg",
      jsonMode: true,
    });

    const parsed = JSON.parse(rawJson.trim());
    return formatDiagnosisResult(parsed, req);
  } catch (directErr: any) {
    console.error("[AgriVision AI Error] ❌ Diagnosis failed completely:", directErr);

    // Return informative diagnostic error object so user sees actionable troubleshooting
    const isHindi = req.language === "hi";
    return {
      id: `diag-err-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cropName: req.cropName || "Inspected Crop",
      diseaseName: isHindi ? "AI निदान त्रुटि (API कुंजी अनुपलब्ध)" : "AI Diagnosis Error (Missing API Key)",
      commonName: isHindi ? "API कनेक्शन त्रुटि" : "API Connection Error",
      severity: "medium",
      colorStatus: "yellow",
      confidence: 0,
      isHealthy: false,
      description: isHindi
        ? `निदान पूरा नहीं हो सका: Netlify/Vercel पर 'VITE_GEMINI_API_KEY' सेट करें। (${directErr?.message || "त्रुटि"})`
        : `Diagnosis failed: Please configure 'VITE_GEMINI_API_KEY' in your Netlify or Vercel dashboard. (${directErr?.message || "Error"})`,
      organicRemedy: "Verify environment variables in Netlify/Vercel settings.",
      chemicalTreatment: "Ensure VITE_GEMINI_API_KEY starts with 'AIza...'",
      preventiveAction: "Rebuild or redeploy your app on Netlify/Vercel after saving your API key.",
      spokenAdvice: isHindi
        ? "AI निदान त्रुटि। कृपया Netlify या Vercel में VITE_GEMINI_API_KEY सेट करें।"
        : "Diagnosis failed. Please check your VITE_GEMINI_API_KEY configuration.",
      imageUri: req.imageBase64,
    };
  }
}

function formatDiagnosisResult(result: any, req: DiagnoseRequest): DiseaseDiagnosis {
  return {
    id: `diag-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    cropName: req.cropName || "Inspected Crop",
    diseaseName: result?.diseaseName || "Crop Health Assessment",
    commonName: result?.commonName || "Leaf Symptoms",
    severity: result?.severity || "medium",
    colorStatus: result?.colorStatus || "yellow",
    confidence: typeof result?.confidence === "number" ? result.confidence : 90,
    isHealthy: !!result?.isHealthy,
    description: result?.description || "Visual leaf surface analysis completed.",
    organicRemedy: result?.organicRemedy || "Spray 5ml Neem Oil (1500 ppm) per liter water in early morning.",
    chemicalTreatment: result?.chemicalTreatment || "Apply Mancozeb 75% WP @ 2g/L or Copper Oxychloride @ 2.5g/L.",
    preventiveAction: result?.preventiveAction || result?.preventiveMeasures || "Ensure optimal drainage, spacing, and avoid evening sprinkler wetting.",
    spokenAdvice: result?.spokenAdvice || result?.description || "Inspection complete. Follow verified dosage routine.",
    imageUri: req.imageBase64,
  };
}

/**
 * AI Multimodal Voice & Text Assistant Chat
 */
export async function sendChatMessage(req: ChatRequest): Promise<{ reply: string; spokenText: string }> {
  console.info(`[AgriVision AI] 💬 Sending query to AI Assistant: "${req.message}"`);

  // 1. First attempt full-stack backend endpoint (/api/ai/chat)
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.reply) {
        console.info("[AgriVision AI] ✅ Backend AI chat response received successfully!");
        return {
          reply: data.reply,
          spokenText: data.spokenText || data.reply,
        };
      }
    } else {
      console.warn(
        `[AgriVision AI] ⚠️ Backend /api/ai/chat returned status ${res.status} (likely static host on Netlify/Vercel). Switching to direct client Gemini call...`
      );
    }
  } catch (backendErr: any) {
    console.warn(
      `[AgriVision AI] ⚠️ Backend /api/ai/chat unreachable (${backendErr?.message || backendErr}). Switching to direct client Gemini call...`
    );
  }

  // 2. Direct client-side Gemini call using VITE_GEMINI_API_KEY
  try {
    const systemInstruction = `You are AgriVision Assistant, a grounded AI agricultural and horticultural intelligence system.
User Role: "${req.role || "farmer"}"
Active Language: "${req.language || "en"}"

CORE DIRECTIVES:
1. STRICT DATA GROUNDING: Provide accurate agronomic guidance for agriculture, kitchen gardening, labour, or FPO management.
2. LANGUAGE: You MUST write your ENTIRE reply in "${req.language || "en"}" using its natural script (e.g. Hindi in Devanagari, Telugu in Telugu script, Tamil in Tamil script, English).
3. CONCISENESS: Keep answers clear, direct, and conversational (2-4 sentences max), perfect for text-to-speech.
4. ROLE SCOPING:
   - "farmer": Precision commercial farming, fertilizer dosages (DAP, Urea, Potash), pest sprays, mandi rates.
   - "gardener": Balcony/kitchen garden, potted plants, organic vermicompost, 1-inch soil finger test, neem spray.
   - "labour": Harvesting jobs, daily wages (₹500-₹650/day), skills, applications.
   - "fpo": Cluster risk management, bulk fertilizer orders, broadcasts.

CONTEXT:
${JSON.stringify(req.context || {}, null, 2)}`;

    const textOutput = await callDirectGeminiRest(req.message || "Please provide advice based on current state.", {
      systemInstruction,
      imageBase64: req.imageBase64,
      mimeType: req.mimeType,
    });

    console.info("[AgriVision AI] ✅ Direct client-side Gemini response generated successfully!");
    return {
      reply: textOutput,
      spokenText: textOutput,
    };
  } catch (directErr: any) {
    console.error("[AgriVision AI Error] ❌ AI Assistant query failed:", directErr);

    // Give a clear, helpful troubleshooting message in the UI so the user/developer immediately knows how to fix it
    const apiKey = getClientGeminiApiKey();
    const isMissingKey = !apiKey;

    const errorDetails = isMissingKey
      ? "Missing 'VITE_GEMINI_API_KEY' in environment variables."
      : directErr?.message || "Unknown error";

    const isHindi = req.language === "hi";

    const userFacingError = isHindi
      ? `⚠️ AI प्रतिक्रिया लोड करने में विफल:\n\n• ढांचा (Framework): Vite (React)\n• आवश्यक Environment Variable: VITE_GEMINI_API_KEY\n• समाधान: कृपया Netlify या Vercel के Environment Variables डैशबोर्ड में 'VITE_GEMINI_API_KEY' जोड़ें और नया Deploy करें।\n\n(त्रुटि विवरण: ${errorDetails})`
      : `⚠️ Gemini AI Assistant call failed:\n\n• Framework: Vite (React)\n• Required Environment Variable: VITE_GEMINI_API_KEY\n• Action: In your Netlify or Vercel Project Settings > Environment Variables, add 'VITE_GEMINI_API_KEY=<your_gemini_api_key>' and trigger a redeploy.\n\n(Error details: ${errorDetails})`;

    return {
      reply: userFacingError,
      spokenText: isHindi
        ? "AI असिस्टेंट से संपर्क नहीं हो सका। कृपया Netlify या Vercel में VITE_GEMINI_API_KEY सेट करें।"
        : "Gemini API call failed. Please configure VITE_GEMINI_API_KEY in your hosting dashboard.",
    };
  }
}

/**
 * AI Crop Recommendations
 */
export async function fetchCropRecommendations(req: CropRecommendRequest): Promise<CropRecommendation[]> {
  console.info("[AgriVision AI] 🌾 Fetching AI crop recommendations...");

  // 1. Try backend
  try {
    const res = await fetch("/api/ai/crop-recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.recommendations && Array.isArray(data.recommendations)) {
        return data.recommendations;
      }
    }
  } catch (backendErr) {
    console.warn("[AgriVision AI] Backend crop recommendation failed, attempting direct Gemini call...", backendErr);
  }

  // 2. Direct client call
  try {
    const prompt = `Recommend the top 3 best crops for a farmer with:
Soil Type: ${req.soilType || "Loamy"}, Soil pH: ${req.soilPh || 6.8}, Season: ${req.season || "Kharif"}, Region: ${req.region || "North/Central India"}, Water: ${req.waterAvailability || "Moderate"}.

Return JSON array with objects containing:
[
  {
    "crop": "Crop name and best high-yield variety",
    "suitabilityScore": number 80-99,
    "colorStatus": "green",
    "durationDays": "Duration in days",
    "expectedYield": "Estimated yield in Quintals/Acre",
    "profitPotential": "Profit estimate",
    "waterNeed": "Low / Medium / High",
    "soilMatch": "Short description of why it matches",
    "reason": "1 line key benefit"
  }
]`;

    const rawJson = await callDirectGeminiRest(prompt, { jsonMode: true });
    const parsed = JSON.parse(rawJson.trim());
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (directErr) {
    console.error("[AgriVision AI Error] Crop recommendations failed:", directErr);
  }

  return [
    {
      crop: "Wheat (Sharbati / HD-2967)",
      suitabilityScore: 95,
      colorStatus: "green",
      durationDays: "120-135 days",
      expectedYield: "20-22 Qtl/Acre",
      profitPotential: "High (₹45,000 / Acre)",
      waterNeed: "Medium",
      soilMatch: "Ideal for pH 6.8 Loam",
      reason: "Stable winter weather and high local Mandi procurement rates.",
    },
    {
      crop: "Mustard Seed (Pusa Bold)",
      suitabilityScore: 91,
      colorStatus: "green",
      durationDays: "110-120 days",
      expectedYield: "8-10 Qtl/Acre",
      profitPotential: "Very High",
      waterNeed: "Low",
      soilMatch: "Great drought resilience",
      reason: "Low input fertilizer cost and strong edible oil demand.",
    },
  ];
}
