import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(process.cwd(), "public")));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.VITE_GOOGLE_GENAI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn(
      "[AgriVision Server] ⚠️ No valid Gemini API Key detected in process.env (checked GEMINI_API_KEY, VITE_GEMINI_API_KEY, VITE_GOOGLE_GENAI_API_KEY, NEXT_PUBLIC_GEMINI_API_KEY)."
    );
    return null;
  }

  console.info("[AgriVision Server] 🔑 Gemini API client initialized successfully with key.");
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Resilient helper with automatic model failover if primary model experiences 503 high demand or transient error
async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  try {
    return await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: params.contents,
      config: params.config,
    });
  } catch (err: any) {
    const errorStr = (err?.message || JSON.stringify(err) || "").toLowerCase();
    const isOverloadedOrUnavailable =
      errorStr.includes("503") ||
      errorStr.includes("unavailable") ||
      errorStr.includes("high demand") ||
      errorStr.includes("429") ||
      errorStr.includes("resource_exhausted") ||
      errorStr.includes("500") ||
      errorStr.includes("internal");

    if (isOverloadedOrUnavailable) {
      console.warn("Primary model 'gemini-3.7-flash' busy/unavailable. Automatically routing to 'gemini-3.1-flash-lite'...");
      return await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: params.contents,
        config: params.config,
      });
    }
    throw err;
  }
}

// Master agronomy and contextual reference knowledge base
const VERIFIED_REFERENCE_DATA = {
  farmer: {
    riskScore: 28,
    riskFactors: "Overall 28 (Low Risk / Green). Weather: 18 (Sunny 32°C, no unseasonal rain for 5 days); Soil Moisture Deficit: 42 (Moisture at 38%, threshold 40%); Pest & Disease: 22 (Low cluster vector pressure, watch aphids); Market Volatility: 15 (Strong grain demand).",
    iotSensors: "Sensor Node ESP32-AGRI-7749 in Field A: Soil Moisture is 38%, Soil pH is 6.8 (Neutral-ideal), Ambient Temp is 31°C, Humidity is 62%, Battery is 88%, Pump Status is OFF, Auto-irrigation is ENABLED (triggers below 35%).",
    mandiPrices: "Wheat (Sharbati): ₹2,480/Qtl (+₹120) in Ujjain APMC Mandi; Soybean (Yellow): ₹4,750/Qtl (-₹70) in Dewas Mandi; Mustard: ₹5,620/Qtl (+₹120) in Indore Mandi; Tomato: ₹1,850/Qtl (+₹250) in Ujjain Sabzi Mandi; Onion: ₹1,950/Qtl (Steady); Cotton: ₹7,100/Qtl (+₹150) in Khargone.",
    fertilizerWheat: "Wheat per acre: Basal/Sowing = 50 kg DAP + 15 kg Urea + 20 kg MOP (Potash); Vegetative (21-25 days CRI stage) = 45 kg Urea + 5 kg Zinc Sulphate (21%) with 1st irrigation; Tillering (45 days) = 35 kg Urea; Booting = 19:19:19 NPK foliar spray @ 1 kg/100L water.",
    fertilizerSoybean: "Soybean per acre: Sowing = 40 kg DAP + 20 kg SSP (Single Super Phosphate for Sulphur) + Rhizobium culture seed coating. Do not apply excess urea as pulses fix atmospheric nitrogen.",
    pesticideDosages: "Aphids/Jassids: Neem Oil (1500 ppm) @ 5 ml/L water OR Imidacloprid 17.8% SL @ 0.5 ml/L water. Early Blight/Leaf Spot: Mancozeb 75% WP @ 2.0 g/L OR Copper Oxychloride 50% WP @ 2.5 g/L OR Trichoderma viride @ 5 g/L. Powdery Mildew: Wettable Sulphur 80% WDG @ 2.5 g/L OR Hexaconazole 5% EC @ 1 ml/L. Yellow Mosaic Virus: Whitefly vector control with Yellow sticky traps (15/acre) + Thiamethoxam 25% WG @ 0.3 g/L.",
    hireLabour: "4 farm jobs active nearby: 1) Wheat Harvesting in Gram Pipliya (2.1 km away) paying ₹550/day + Food + Transport (6 workers needed); 2) Organic Weeding at Canal Road (3.5 km away) paying ₹480/day; 3) Cotton Spraying at Bhatpachlana Road (5.2 km away) paying ₹650/day; 4) Sowing & Seed Drilling at Tajpur (6.8 km away) paying ₹600/day + Stay.",
  },
  gardener: {
    plants: "Cherry Tomato (32% moisture - Needs water today, full sun); Holy Basil/Tulsi (78% moisture - Healthy/Thriving, bright indirect light); Green Chili (44% moisture - Healthy, feed banana peel tea); Fresh Mint/Pudina (82% moisture - Thriving, partial shade); Desi Rose (Healthy, full sun); Aloe Vera (Healthy, dry soil, water every 5 days).",
    wateringAdvice: "Test soil by inserting index finger 1 inch into pot. If dry, water early in the morning at root base. Avoid wetting leaves late in the day to prevent fungal rot.",
    gardenerNutrition: "Container nutrition: 1-2 handfuls (50-100 grams) of Vermicompost or well-rotted Cow Dung manure per pot every 15-20 days. Spray seaweed liquid tonic (5ml/L) or banana peel tea during flowering. Never use farm-scale chemical DAP/Urea sacks in small pots!",
    gardenerPest: "Organic home remedies: Spray Neem Oil (3-5 ml/L with 2 drops liquid soap) for mealybugs and aphids; Spray sour buttermilk diluted 1:9 in water for powdery mildew on leaves.",
  },
  labour: {
    activeJobs: "Top jobs available today: 1) Wheat Harvesting & Stacking by Suresh Choudhary at Gram Pipliya (2.1 km away) @ ₹550/day + lunch & tea + transport; 2) Cotton Spraying by Digvijay Singh (5.2 km away) @ ₹650/day; 3) Sowing Operations by Mahesh Gurjar at Tajpur (6.8 km away) @ ₹600/day + room stay; 4) Vegetable Weeding @ ₹480/day.",
    profileRating: "Labour profile rating is 4.8 / 5.0 stars based on 24 completed farm assignments, on-time punctuality, and 4 verified skill badges (Harvesting, Sowing, Tractor Driving, Spraying). Toggling 'Available for Work' makes your profile appear at the top of farmers' search results.",
    appliedStatus: "Your application for Wheat Harvesting (Gram Pipliya) is registered. Farm owner Suresh Choudhary reviews applications by 8:00 AM.",
  },
  fpo: {
    overview: "Malwa Krishi Vikas Producer Co. Ltd.: 1,480 total acres managed, 124 active member farmers across 7 village clusters. Overall FPO crop risk is LOW (24/100).",
    alerts: "2 active cluster alerts: 1) Bherulal Ji Chouhan in Gram Tajpur (78 High Risk) - Yellow Mosaic Virus on 2.5 acres soybean plot 4B; 2) Geeta Bai Rajput in Gram Unhel (72 High Risk) - Early Blight on tomato crop.",
    bulkReports: "Collective Input Procurement: Group orders for Bio-Pesticides, DAP, and Certified Wheat Seeds deliver a 14% bulk discount (saving ~₹420 per farmer per acre).",
    broadcast: "To send emergency alerts to member farmers, select 'Broadcast/Alerts', choose village cluster (e.g. Gram Tajpur or All Villages), select alert type (Pest/Weather/Mandi), and tap Send via SMS & Voice Notification.",
  }
};

// Grounded, multi-lingual smart assistant engine matching exact app state
function getLocalizedSmartChatReply(
  message: string = "",
  role: string = "farmer",
  language: string = "en",
  context: any = {}
): { reply: string; spokenText: string } {
  const msgLower = message.toLowerCase();

  // 1. FARMER ROLE REPLIES
  if (role === "farmer") {
    // Farm Risk Score Query
    if (msgLower.includes("risk") || msgLower.includes("स्कोर") || msgLower.includes("रिस्क") || msgLower.includes("స్కోర్") || msgLower.includes("மதிப்பெண்") || msgLower.includes("जोखीम")) {
      if (language === "hi") {
        const text = "आपके खेत का कुल रिस्क स्कोर 28 (कम जोखिम / सुरक्षित हरा) है। मौसम का जोखिम केवल 18 है (धूप 32°C, 5 दिन तक बारिश नहीं)। मिट्टी में 38% नमी होने से नमी का जोखिम 42 (मध्यम) है। कीट का जोखिम 22 और बाजार जोखिम 15 है।";
        return { reply: text, spokenText: text };
      }
      if (language === "te") {
        const text = "మీ పొలం రిస్క్ స్కోరు 28 (తక్కువ రిస్క్ / ఆకుపచ్చ). వాతావరణ రిస్క్ 18, నేల తేమ 38% ఉన్నందున తేమ రిస్క్ 42, పురుగుల రిస్క్ 22 మరియు మార్కెట్ రిస్క్ 15 గా ఉంది.";
        return { reply: text, spokenText: text };
      }
      if (language === "ta") {
        const text = "உங்கள் பண்ணை இடர் மதிப்பெண் 28 (குறைந்த இடர் / பச்சை). வானிலை இடர் 18, மண் ஈரப்பதம் 38% ஆக உள்ளதால் ஈரப்பத இடர் 42, பூச்சி இடர் 22, சந்தை இடர் 15.";
        return { reply: text, spokenText: text };
      }
      const text = "Your overall Farm Risk Score is 28 (Low Risk / Green). Weather risk is 18 (Sunny 32°C, no rain for 5 days), Soil Moisture deficit is 42 (at 38% moisture), Pest risk is 22 (low vector pressure), and Market volatility is 15 (stable).";
      return { reply: text, spokenText: text };
    }

    // Smart Sensors / Soil Moisture / IoT Query
    if (msgLower.includes("sensor") || msgLower.includes("moisture") || msgLower.includes("ph") || msgLower.includes("iot") || msgLower.includes("pump") || msgLower.includes("नमी") || msgLower.includes("सेंसर") || msgLower.includes("पंप") || msgLower.includes("తేమ") || msgLower.includes("ஈரப்பதம்")) {
      if (language === "hi") {
        const text = "आपके स्मार्ट सेंसर (ESP32-AGRI-7749) के अनुसार: मिट्टी की नमी 38% है, मिट्टी का pH 6.8 (उत्तम) है, तापमान 31°C और हवा में नमी 62% है। सिंचाई पंप वर्तमान में बंद (OFF) है और ऑटो-इरिगेशन 35% पर सक्रिय है।";
        return { reply: text, spokenText: text };
      }
      if (language === "te") {
        const text = "మీ స్మార్ట్ సెన్సార్ (ESP32-AGRI-7749) ప్రకారం: నేల తేమ 38%, నేల pH 6.8, ఉష్ణోగ్రత 31°C మరియు గాలిలో తేమ 62% ఉంది. నీటి పంపు ప్రస్తుతం ఆఫ్‌లో ఉంది.";
        return { reply: text, spokenText: text };
      }
      if (language === "ta") {
        const text = "உங்கள் ஸ்மார்ட் சென்சார் (ESP32-AGRI-7749) தரவு: மண் ஈரப்பதம் 38%, மண் pH 6.8, வெப்பநிலை 31°C மற்றும் ஈரப்பதம் 62% உள்ளது. பம்ப் தற்போது அணைக்கப்பட்டுள்ளது.";
        return { reply: text, spokenText: text };
      }
      const text = "Live IoT Node ESP32-AGRI-7749 in Field A: Soil Moisture is 38%, Soil pH is 6.8 (ideal neutral), Ambient Temp is 31°C, Humidity is 62%, and Pump Status is OFF. Auto-irrigation triggers if moisture dips below 35%.";
      return { reply: text, spokenText: text };
    }

    // Mandi Rates Query
    if (msgLower.includes("mandi") || msgLower.includes("price") || msgLower.includes("rate") || msgLower.includes("wheat") || msgLower.includes("मंडी") || msgLower.includes("भाव") || msgLower.includes("दाम") || msgLower.includes("गेहूं") || msgLower.includes("ధర") || msgLower.includes("விலை")) {
      if (language === "hi") {
        const text = "उज्जैन APMC मंडी में शरबती गेहूं का भाव ₹2,480 प्रति क्विंटल है (+₹120 की तेजी, 3 हफ्ते का उच्चतम स्तर)। देवास मंडी में सोयाबीन ₹4,750/क्विंटल और इंदौर में सरसों ₹5,620/क्विंटल है। अगले 2-4 दिन में गेहूं बेचना सबसे फायदेमंद है।";
        return { reply: text, spokenText: text };
      }
      if (language === "te") {
        const text = "ఉజ్జయిని మార్కెట్‌లో గోధుమ ధర క్వింటాలుకు ₹2,480 (+₹120 పెరిగింది). సోయాబీన్ ధర ₹4,750 మరియు ఆవాల ధర ₹5,620 గా ఉంది. రాబోయే 2-4 రోజుల్లో విక్రయించడం అనుకూలం.";
        return { reply: text, spokenText: text };
      }
      if (language === "ta") {
        const text = "உஜ்ஜைன் மண்டியில் கோதுமை விலை குவிண்டாலுக்கு ₹2,480 (+₹120 உயர்வு). சோயாபீன் ₹4,750 மற்றும் கடுகு ₹5,620 ஆக உள்ளது. அடுத்த 2-4 நாட்களில் விற்பது நல்லது.";
        return { reply: text, spokenText: text };
      }
      const text = "Ujjain APMC Mandi rate for Wheat is ₹2,480/Quintal (+₹120 spike, 3-week peak). Soybean is ₹4,750/Qtl in Dewas, Mustard is ₹5,620/Qtl in Indore, and Tomato is ₹1,850/Qtl. Best selling window for wheat is in the next 2-4 days.";
      return { reply: text, spokenText: text };
    }

    // Fertilizer Recommendation Query
    if (msgLower.includes("fertilizer") || msgLower.includes("urea") || msgLower.includes("dap") || msgLower.includes("dosage") || msgLower.includes("खाद") || msgLower.includes("यूरिया") || msgLower.includes("ఎరువు") || msgLower.includes("உரம்")) {
      if (language === "hi") {
        const text = "ICAR प्रमाणित मात्रा: गेहूं की बुवाई के समय प्रति एकड़ 50 किग्रा DAP + 15 किग्रा यूरिया + 20 किग्रा पोटाश दें। पहली सिंचाई (21-25 दिन पर) के साथ 45 किग्रा यूरिया और 5 किग्रा जिंक सल्फेट (21%) डालें।";
        return { reply: text, spokenText: text };
      }
      if (language === "te") {
        const text = "గోధుమ పంటకు విత్తే సమయంలో ఎకరాకు 50 కేజీల DAP + 15 కేజీల యూరియా + 20 కేజీల పొటాష్ వేయండి. మొదటి నీటి తడి (21 రోజులు) సమయంలో 45 కేజీల యూరియా మరియు 5 కేజీల జింక్ సల్ఫేట్ వేయండి.";
        return { reply: text, spokenText: text };
      }
      if (language === "ta") {
        const text = "கோதுமை விதைப்பின் போது ஏக்கருக்கு 50 கிலோ DAP + 15 கிலோ யூரியா + 20 கிலோ பொட்டாஷ் இடவும். முதல் பாசனத்தின் போது 45 கிலோ யூரியா மற்றும் 5 கிலோ ஜிங்க் சல்பேட் இடவும்.";
        return { reply: text, spokenText: text };
      }
      const text = "Verified ICAR per-acre dosage for Wheat: At sowing/basal, apply 50 kg DAP + 15 kg Urea + 20 kg Potash (MOP). At first irrigation (21-25 days CRI stage), top-dress 45 kg Urea + 5 kg Zinc Sulphate (21%).";
      return { reply: text, spokenText: text };
    }

    // Disease / Pest Spray Query
    if (msgLower.includes("spray") || msgLower.includes("pest") || msgLower.includes("disease") || msgLower.includes("blight") || msgLower.includes("aphid") || msgLower.includes("कीट") || msgLower.includes("रोग") || msgLower.includes("दवा") || msgLower.includes("छिड़काव") || msgLower.includes("తెగులు") || msgLower.includes("நோய்")) {
      if (language === "hi") {
        const text = "सटीक दवा मात्रा: माहू व रस चूसक कीटों के लिए 5ml नीम का तेल प्रति लीटर पानी का स्प्रे करें। पत्तों के अगेती धब्बा/झुलसा रोग के लिए मैन्कोजेब 75% WP (2 ग्राम प्रति लीटर पानी) सुबह के समय छिड़कें।";
        return { reply: text, spokenText: text };
      }
      if (language === "te") {
        const text = "తెగులు మందు మోతాదు: రసం పీల్చే పురుగుల నివారణకు లీటరు నీటికి 5ml వేప నూనె పిచికారీ చేయండి. ఆకు మచ్చ తెగులుకు మాంకోజెబ్ 75% WP (లీటరు నీటికి 2 గ్రాములు) ఉదయం పిచికారీ చేయండి.";
        return { reply: text, spokenText: text };
      }
      if (language === "ta") {
        const text = "பூச்சி மற்றும் நோய் மருந்து அளவு: அசுவினி தாக்குதலுக்கு ஒரு லிட்டர் தண்ணீரில் 5 மிலி வேப்பெண்ணெய் தெளிக்கவும். இலைப்புள்ளி நோய்க்கு மேன்கோசெப் 75% WP (ஒரு லிட்டர் தண்ணீருக்கு 2 கிராம்) காலை வேளையில் தெளிக்கவும்.";
        return { reply: text, spokenText: text };
      }
      const text = "Verified treatment dosage: For aphids and sucking pests, spray Neem Oil (1500 ppm) @ 5 ml/L water. For early leaf spot and blight, spray Mancozeb 75% WP @ 2.0 g/L or Copper Oxychloride @ 2.5 g/L water in early morning.";
      return { reply: text, spokenText: text };
    }

    // Hire Labour / Booking Query
    if (msgLower.includes("labour") || msgLower.includes("worker") || msgLower.includes("hire") || msgLower.includes("मजदूर") || msgLower.includes("लेबर") || msgLower.includes("కూలీలు") || msgLower.includes("வேலையாட்கள்")) {
      if (language === "hi") {
        const text = "आपके क्षेत्र में गेहूं कटाई व निराई के लिए कुशल मजदूर ₹500 से ₹600 दैनिक दर पर उपलब्ध हैं। नया काम पोस्ट करने के लिए 'मजदूर बुक करें' पर टैप करें, काम का प्रकार और तारीख चुनें।";
        return { reply: text, spokenText: text };
      }
      if (language === "te") {
        const text = "మీ ప్రాంతంలో పంట కోత మరియు కలుపు తీతకు కూలీలు రోజుకు ₹500 నుండి ₹600 వేతనంతో అందుబాటులో ఉన్నారు. కొత్త పని నమోదు చేయడానికి 'కూలీలను బుక్ చేయండి' పై క్లిక్ చేయండి.";
        return { reply: text, spokenText: text };
      }
      const text = "Nearby agricultural workers are available at ₹500 to ₹600 daily wage for harvesting and weeding. You can post a job in 1 tap specifying workers needed, dates, and whether lunch/transport is provided.";
      return { reply: text, spokenText: text };
    }

    // Default Farmer Priority Action
    if (language === "hi") {
      const text = "आज का मुख्य कार्य: मिट्टी की नमी 38% है, इसलिए सुबह 10 बजे से पहले 45 मिनट के लिए हल्की सिंचाई करें। दक्षिण खेत में माहू कीट की जांच करें।";
      return { reply: text, spokenText: text };
    }
    const text = "Top priority for today: Soil moisture is 38%. Run morning irrigation for 45 minutes before 10:00 AM, and inspect south field leaves for aphids.";
    return { reply: text, spokenText: text };
  }

  // 2. HOME GARDENER ROLE REPLIES
  if (role === "gardener") {
    // Check if commercial farming/mandi/yield query asked by mistake in gardener mode
    if (
      msgLower.includes("acre") ||
      msgLower.includes("yield") ||
      msgLower.includes("mandi") ||
      msgLower.includes("tractor") ||
      msgLower.includes("msp") ||
      msgLower.includes("एकड़") ||
      msgLower.includes("पैदावार") ||
      msgLower.includes("मंडी भाव")
    ) {
      if (language === "hi") {
        const text = "यह जानकारी बड़े पैमाने की खेती और मंडी व्यापार के लिए अधिक उपयुक्त है। क्या आप ऊपर से 'किसान मोड' (Farmer mode) में स्विच करना चाहेंगे?";
        return { reply: text, spokenText: text };
      }
      const text = "That's more relevant for full-scale commercial farming — would you like to switch to Farmer mode from the top role menu?";
      return { reply: text, spokenText: text };
    }

    // Yellow leaves on tomato or other plants
    if (msgLower.includes("yellow") || msgLower.includes("पीली") || msgLower.includes("पीले") || msgLower.includes("पत्ते पीले")) {
      if (language === "hi") {
        const text = "टमाटर के पत्ते पीले होने का मुख्य कारण गमले में ज्यादा पानी या नाइट्रोजन की कमी है। गमले की मिट्टी को 1 दिन सूखने दें और 1 मुट्ठी वर्मीकम्पोस्ट डालें। नीचे की पीली पत्तियों को कैंची से हटा दें।";
        return { reply: text, spokenText: text };
      }
      const text = "Yellow leaves are usually caused by overwatering or mild nitrogen deficiency. Let the topsoil dry out for a day, prune yellow lower leaves, and feed 1 handful of vermicompost.";
      return { reply: text, spokenText: text };
    }

    // Mint / Pudina watering
    if (msgLower.includes("mint") || msgLower.includes("pudina") || msgLower.includes("पुदीना")) {
      if (language === "hi") {
        const text = "पुदीने को रोजाना हल्का पानी पसंद है ताकि मिट्टी में नमी बनी रहे (पर गमले में पानी जमा न हो)। इसे 2-3 घंटे सुबह की धूप या हल्की छाया वाली खिड़की पर रखें। ज्यादा घने विकास के लिए ऊपर की पत्तियां नियमित तोड़ें।";
        return { reply: text, spokenText: text };
      }
      const text = "Water mint daily in warm weather to keep soil evenly moist without waterlogging. Keep it in partial shade or morning sun, and harvest top leaves frequently to encourage bushy growth.";
      return { reply: text, spokenText: text };
    }

    // Pots for chili / balcony chili
    if (msgLower.includes("pot") || msgLower.includes("chili") || msgLower.includes("मिर्च") || msgLower.includes("गमला")) {
      if (language === "hi") {
        const text = "बालकनी में हरी मिर्च के लिए 10 से 12 इंच का मिट्टी या ग्रो बैग सबसे अच्छा है। 40% वर्मीकम्पोस्ट और 60% मिट्टी का मिश्रण रखें और कम से कम 5-6 घंटे की सीधी धूप दें।";
        return { reply: text, spokenText: text };
      }
      const text = "For balcony green chili, use a 10 to 12 inch deep terracotta pot or fabric grow bag with drainage holes. Chili loves 5-6 hours of direct sun and sandy potting mix with 40% compost.";
      return { reply: text, spokenText: text };
    }

    // Shade plants
    if (msgLower.includes("shade") || msgLower.includes("छाया") || msgLower.includes("धूप नहीं")) {
      if (language === "hi") {
        const text = "कम धूप या पूरी छाया वाली बालकनी में आप पुदीना (Pudina), पालक (Spinach), धनिया (Coriander), एलोवेरा, मनी प्लांट और स्नेक प्लांट बहुत आसानी से उगा सकते हैं।";
        return { reply: text, spokenText: text };
      }
      const text = "For full shade or low-sun balconies, top picks are: Fresh Mint (Pudina), Spinach (Palak), Coriander (Dhaniya), Aloe Vera, Snake Plant, and Money Plant.";
      return { reply: text, spokenText: text };
    }

    // DIY Kitchen Compost
    if (msgLower.includes("compost") || msgLower.includes("make compost") || msgLower.includes("खाद बनाएं") || msgLower.includes("कम्पोस्ट")) {
      if (language === "hi") {
        const text = "घर पर कम्पोस्ट बनाना: एक बाल्टी के नीचे छेद करें। उसमें गीला कचरा (सब्जी/फलों के छिलके, चाय पत्ती) और सूखा कचरा (सूखे पत्ते, अखबार की कतरन) 1:2 के अनुपात में परत दर परत डालें। हर 4-5 दिन में मिलाएं, 40-50 दिन में उत्तम खाद तैयार होगी।";
        return { reply: text, spokenText: text };
      }
      const text = "To make kitchen compost: In a bucket with drainage holes, layer green waste (fruit/vegetable peels, rinsed tea leaves) with dry brown waste (dried leaves, shredded cardboard). Mix weekly for aeration. Rich organic compost is ready in 45 days.";
      return { reply: text, spokenText: text };
    }

    if (msgLower.includes("plant") || msgLower.includes("tomato") || msgLower.includes("tulsi") || msgLower.includes("पौधे") || msgLower.includes("टमाटर") || msgLower.includes("तुलसी")) {
      if (language === "hi") {
        const text = "आपके बालकनी पौधों की स्थिति: चेरी टमाटर (32% नमी) को आज सुबह पानी चाहिए। तुलसी (78% नमी) और हरी मिर्च (44%) बिल्कुल स्वस्थ हैं। पुदीने को हल्की छाया में रखें।";
        return { reply: text, spokenText: text };
      }
      const text = "Your plant inventory: Cherry Tomato (32% moisture) needs water today; Holy Basil/Tulsi (78%) is thriving; Green Chili (44%) is healthy; Fresh Mint (82%) loves its partial shade.";
      return { reply: text, spokenText: text };
    }

    if (msgLower.includes("water") || msgLower.includes("weather") || msgLower.includes("पानी") || msgLower.includes("मौसम") || msgLower.includes("सिंचाई")) {
      if (language === "hi") {
        const text = "गमले की मिट्टी में 1 इंच गहराई तक उंगली डालकर देखें। यदि मिट्टी सूखी लगे तो सुबह के समय गमले की जड़ में पानी दें। पत्तियों पर शाम को पानी न डालें।";
        return { reply: text, spokenText: text };
      }
      const text = "Perform the 1-inch finger test: insert your finger into the pot soil. If the top inch feels dry, give a gentle soak at the root base in the morning. Today is sunny (32°C).";
      return { reply: text, spokenText: text };
    }

    if (msgLower.includes("fertilizer") || msgLower.includes("food") || msgLower.includes("खाद") || msgLower.includes("पोषण")) {
      if (language === "hi") {
        const text = "गमलों के लिए घरेलू पोषण: हर 15-20 दिन में प्रति गमला 1-2 मुट्ठी वर्मीकम्पोस्ट (केंचुआ खाद) डालें। फूलों के लिए केले के छिलके का पानी (पोटाश) एक चम्मच तरल खाद के रूप में दें। रासायनिक यूरिया गमलों में न डालें।";
        return { reply: text, spokenText: text };
      }
      const text = "Container garden feeding: Add 1-2 handfuls (50-100g) of Vermicompost or composted manure per pot every 15-20 days. Use banana peel tea for flowering plants. Never apply commercial chemical farm fertilizer bags to small pots.";
      return { reply: text, spokenText: text };
    }

    if (language === "hi") {
      const text = "नमस्ते! मैं आपका होम गार्डनिंग साथी हूँ। आप गमले के पौधों की देखभाल, पानी देने के नियम, बालकनी धूप या किचन कम्पोस्ट के बारे में पूछ सकते हैं।";
      return { reply: text, spokenText: text };
    }
    const text = "Hello! I am your Home Garden Assistant. Ask me about container plant watering, balcony sunlight, pest remedies, or kitchen composting.";
    return { reply: text, spokenText: text };
  }

  // 3. FARM LABOUR ROLE REPLIES
  if (role === "labour") {
    if (msgLower.includes("job") || msgLower.includes("feed") || msgLower.includes("काम") || msgLower.includes("मजदूरी") || msgLower.includes("పని") || msgLower.includes("வேலை")) {
      if (language === "hi") {
        const text = "आज आपके पास उपलब्ध काम: 1) ग्राम पिपलिया (2.1 किमी) में सुरेश चौधरी के खेत पर गेहूं कटाई (₹550/दिन + खाना + चाय + वाहन); 2) आनंद शर्मा के खेत पर निराई (₹480/दिन); 3) कपास स्प्रे (₹650/दिन)। आवेदन के लिए 'Apply' दबाएं।";
        return { reply: text, spokenText: text };
      }
      const text = "Top available jobs today: 1) Wheat Harvesting at Gram Pipliya (2.1 km away) by Suresh Choudhary @ ₹550/day + lunch & tea + transport; 2) Cotton Spraying @ ₹650/day; 3) Organic Weeding @ ₹480/day.";
      return { reply: text, spokenText: text };
    }

    if (msgLower.includes("rating") || msgLower.includes("profile") || msgLower.includes("skill") || msgLower.includes("रेटिंग") || msgLower.includes("हुनर") || msgLower.includes("ప్రొఫైల్")) {
      if (language === "hi") {
        const text = "आपकी प्रोफाइल रेटिंग 4.8 स्टार है जो 24 सफल कृषि कार्यों और समय की पाबंदी पर आधारित है। आपके पास कटाई, बुवाई, स्प्रे और ट्रैक्टर ड्राइविंग के 4 सत्यापित बैज हैं। 'काम के लिए उपलब्ध' बटन चालू रखने से किसान आपको पहले चुनते हैं।";
        return { reply: text, spokenText: text };
      }
      const text = "Your profile rating is 4.8 / 5.0 stars based on 24 completed farm assignments and punctual feedback. You hold 4 verified skill badges (Harvesting, Sowing, Spraying, Tractor). Keeping 'Available for Work' enabled boosts your rank in farmer searches.";
      return { reply: text, spokenText: text };
    }

    if (msgLower.includes("applied") || msgLower.includes("status") || msgLower.includes("आवेदन") || msgLower.includes("स्थिति")) {
      if (language === "hi") {
        const text = "आवेदन की स्थिति: ग्राम पिपलिया में गेहूं कटाई कार्य (₹550/दिन) के लिए आपका आवेदन सबमिट हो चुका है। किसान सुरेश चौधरी सुबह 8 बजे तक कन्फर्म करेंगे।";
        return { reply: text, spokenText: text };
      }
      const text = "Application Status: Your application for Wheat Harvesting (Gram Pipliya @ ₹550/day) is active and awaiting farmer confirmation by 8:00 AM.";
      return { reply: text, spokenText: text };
    }

    if (language === "hi") {
      const text = "नमस्ते! मैं आपका लेबर असिस्टेंट हूँ। आप उपलब्ध कृषि कार्यों, मजदूरी दर या अपनी प्रोफाइल रेटिंग के बारे में पूछ सकते हैं।";
      return { reply: text, spokenText: text };
    }
    const text = "Hello! I am your Farm Labour Assistant. Ask me about nearby harvesting jobs, daily wages, or your profile rating.";
    return { reply: text, spokenText: text };
  }

  // 4. FPO MANAGER ROLE REPLIES
  if (role === "fpo") {
    if (msgLower.includes("member") || msgLower.includes("count") || msgLower.includes("सदस्य") || msgLower.includes("किसान") || msgLower.includes("సభ్యులు") || msgLower.includes("உறுப்பினர்கள்")) {
      if (language === "hi") {
        const text = "FPO सदस्य विवरण: मालवा कृषि विकास FPO में 1,480 एकड़ क्षेत्र में 124 किसान सदस्य पंजीकृत हैं। 88% सदस्यों के पास सक्रिय IoT किट और 118 सदस्यों के PM-किसान खाते अपडेटेड हैं।";
        return { reply: text, spokenText: text };
      }
      const text = "FPO Member Overview: 124 registered farmer members managing 1,480 total acres across 7 villages. 88% have active IoT Soil nodes and 118 members have verified PM-Kisan enrollment.";
      return { reply: text, spokenText: text };
    }

    if (msgLower.includes("alert") || msgLower.includes("outbreak") || msgLower.includes("risk") || msgLower.includes("अलर्ट") || msgLower.includes("बीमारी") || msgLower.includes("హెచ్చరికలు")) {
      if (language === "hi") {
        const text = "क्लस्टर सक्रिय अलर्ट: 2 सदस्यों के खेतों पर हाई रिस्क अलर्ट है: 1) ग्राम ताजपुर में भेरूलाल जी चौहान (78 रिस्क) के सोयाबीन खेत में पीला मोज़ेक वायरस; 2) ग्राम उन्हेल में गीता बाई (72 रिस्क) के टमाटर में अगेती झुलसा।";
        return { reply: text, spokenText: text };
      }
      const text = "Active Cluster Outbreaks: 2 member farms have high risk alerts: 1) Bherulal Ji Chouhan in Gram Tajpur (Score 78) - Yellow Mosaic Virus on 2.5 acres soybean; 2) Geeta Bai in Gram Unhel (Score 72) - Early Blight in tomato.";
      return { reply: text, spokenText: text };
    }

    if (msgLower.includes("report") || msgLower.includes("saving") || msgLower.includes("bulk") || msgLower.includes("रिपोर्ट") || msgLower.includes("बचत") || msgLower.includes("खरीद")) {
      if (language === "hi") {
        const text = "सामूहिक खरीद रिपोर्ट: बायो-पेस्टीसाइड, DAP और प्रमाणित बीजों की समूह खरीद से FPO सदस्यों को औसतन 14% की बचत (लगभग ₹420 प्रति एकड़) हो रही है।";
        return { reply: text, spokenText: text };
      }
      const text = "Bulk Procurement Insights: Pooled procurement of certified seeds, DAP fertilizer, and bio-pesticides is generating an average 14% cost discount (~₹420 saved per farmer per acre).";
      return { reply: text, spokenText: text };
    }

    if (msgLower.includes("broadcast") || msgLower.includes("संदेश") || msgLower.includes("ब्रॉडकास्ट")) {
      if (language === "hi") {
        const text = "ब्रॉडकास्ट भेजने की प्रक्रिया: 'Broadcast Alerts' टैब पर जाएं, प्रभावित गांव क्लस्टर (जैसे ग्राम ताजपुर) चुनें, अलर्ट का प्रकार (कीट/मौसम/मंडी) चुनें और SMS/वॉइस कॉल से एक साथ सभी किसानों को अलर्ट भेजें।";
        return { reply: text, spokenText: text };
      }
      const text = "To send a broadcast: Navigate to the 'Broadcast/Alerts' tab, pick the target village cluster (e.g. Gram Tajpur), select the alert category, and trigger instant SMS and Voice advisories to all enrolled farmers.";
      return { reply: text, spokenText: text };
    }

    if (language === "hi") {
      const text = "नमस्ते FPO प्रशासक! आपके FPO में 124 किसान और 1,480 एकड़ भूमि का डेटा सक्रिय है। आप क्लस्टर अलर्ट, सदस्य रिपोर्ट या सामूहिक खरीद पर सलाह ले सकते हैं।";
      return { reply: text, spokenText: text };
    }
    const text = "Hello FPO Manager! Malwa Krishi Vikas FPO has 124 members across 1,480 acres. Ask me about member alerts, bulk procurement, or cluster moisture levels.";
    return { reply: text, spokenText: text };
  }

  // Generic fallback if question doesn't match
  if (language === "hi") {
    const text = "नमस्ते! मैं आपका एग्रीविज़न एआई साथी हूँ। आप फसल सुरक्षा, सिंचाई, खाद की मात्रा या मंडी भाव के बारे में पूछ सकते हैं।";
    return { reply: text, spokenText: text };
  }
  const text = "Hello! I am your AgriVision AI Assistant. Ask me about your farm risk score, sensor readings, crop protection, fertilizer dosage, or mandi prices.";
  return { reply: text, spokenText: text };
}

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// Multi-alias disease diagnosis handler
const handleDiseaseDiagnosis = async (req: Request, res: Response) => {
  try {
    const {
      imageBase64,
      cropType = "General Crop",
      notes = "",
      mimeType = "image/jpeg",
      language = "en",
      role = "farmer",
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 in request body" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      if (role === "gardener") {
        return res.json({
          result: {
            diseaseName: "Early Leaf Spot (Fungal)",
            commonName: "Potted Leaf Spot / Mildew",
            severity: "low",
            colorStatus: "yellow",
            confidence: 94,
            isHealthy: false,
            description: "Small yellowish spots with dark centers on bottom leaves from wet potting soil.",
            organicRemedy: "Mix 1 teaspoon (5ml) Neem oil + 2 drops mild dish soap in 1 liter water. Spray gently over leaves in morning.",
            chemicalTreatment: "For potted plants, stick to organic neem spray or baking soda water (1/2 tsp per liter).",
            preventiveMeasures: "Water at the soil base only. Move pot to get 3-4 hours of morning sun and good airflow.",
          },
          source: "offline-mock",
        });
      }

      // Mock fallback response if no key configured
      return res.json({
        result: {
          diseaseName: "Early Blight (Alternaria solani)",
          commonName: "Early Leaf Spot & Blight",
          severity: "medium",
          colorStatus: "yellow",
          confidence: 94,
          isHealthy: false,
          description: "Concentric rings with chlorotic halo observed on lower canopy leaves.",
          organicRemedy: "Spray 5% neem seed kernel extract (NSKE) @ 5ml/L or diluted sour buttermilk (1:9) every 7 days.",
          chemicalTreatment: "Spray Mancozeb 75% WP @ 2.0g/L or Copper Oxychloride 50% WP @ 2.5g/L water.",
          preventiveMeasures: "Maintain adequate plant spacing and avoid excessive overhead sprinkler irrigation in late afternoons.",
        },
        source: "offline-mock",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const isGardener = role === "gardener";
    const prompt = isGardener
      ? `You are a friendly, expert Home Garden Plant Doctor for container, balcony, and kitchen garden plants.
Analyze this potted plant/leaf image carefully.
Plant context: ${cropType}.
User notes: ${notes}.
Target Language: "${language}".

IMPORTANT FOR HOME GARDENER:
- Focus on non-commercial, home-friendly explanations.
- Recommend gentle, kitchen/organic home remedies FIRST (e.g. Neem oil spray, diluted sour buttermilk, baking soda spray, cinnamon powder, mild pruning).
- Give per-pot / 1-Liter home sprayer quantities (e.g., 5ml neem oil + 2 drops liquid soap in 1L water).
- NEVER use per-acre, per-hectare, or commercial farm chemical dosages.

Provide your diagnosis as a strict JSON object:
{
  "diseaseName": "Name of plant issue or 'Healthy Plant'",
  "commonName": "Friendly name in ${language} or English",
  "severity": "low" | "medium" | "high" | "healthy",
  "colorStatus": "green" | "yellow" | "red",
  "confidence": number between 70 and 99,
  "isHealthy": boolean,
  "description": "1-2 simple sentences describing what is happening on the leaves",
  "organicRemedy": "1-2 safe DIY home remedies with exact kitchen/pot quantities (e.g. Neem oil 5ml in 1L water)",
  "chemicalTreatment": "Gentle garden-safe alternative (or 'Stick to organic remedies for home/balcony plants')",
  "preventiveMeasures": "2 simple pot care tips (watering, sunlight, air circulation)"
}
Return ONLY valid JSON.`
      : `You are a certified senior plant pathologist and agronomist for AgriVision.
Analyze this crop/plant leaf image carefully.
Crop context: ${cropType}.
User notes: ${notes}.
Target Language: "${language}".

Provide your diagnosis as a strict JSON object with the following fields:
{
  "diseaseName": "Scientific or formal name of disease or 'Healthy Plant'",
  "commonName": "Common farmer-friendly name in ${language} or English",
  "severity": "low" | "medium" | "high" | "critical" | "healthy",
  "colorStatus": "green" | "yellow" | "red",
  "confidence": number between 70 and 99,
  "isHealthy": boolean,
  "description": "2 sentences describing symptoms visible in the image",
  "organicRemedy": "1-2 natural/organic treatments with exact verified dosages (e.g., Neem oil 1500ppm @ 5ml/L, Trichoderma viride @ 5g/L, diluted sour buttermilk 1:9)",
  "chemicalTreatment": "1-2 chemical options with exact verified formulations and spray dilution ratios (e.g. Mancozeb 75% WP @ 2.0g/L, Hexaconazole 5% EC @ 1ml/L)",
  "preventiveMeasures": "2 concrete field management steps for the next 7 days"
}
Ensure all descriptions and remedies are localized into the chosen language (${language}) where appropriate. Return ONLY valid JSON.`;

    const response = await generateContentWithFallback(ai, {
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const parsed = JSON.parse(responseText.trim());
    return res.json({ result: parsed, source: "gemini" });
  } catch (error: any) {
    console.error("Diagnosis error (using smart fallback):", error?.message || error);
    const isHindi = req.body?.language === "hi";
    const isTelugu = req.body?.language === "te";
    const isTamil = req.body?.language === "ta";

    return res.json({
      result: {
        diseaseName: isHindi ? "पत्तियों पर प्रारंभिक धब्बा (अल्टरनेरिया)" : isTelugu ? "ఆకు మచ్చ తెగులు (ఆల్టర్నేరియా)" : isTamil ? "இலைப்புள்ளி நோய் (ஆல்டர்நேரியா)" : "Early Leaf Spot (Alternaria)",
        commonName: isHindi ? "पत्तों का झुलसा व धब्बा रोग" : isTelugu ? "ఆకు మచ్చ మరియు ఎండు తెగులు" : isTamil ? "இலைப்புள்ளி மற்றும் கருகல் நோய்" : "Early Blight & Leaf Spot",
        severity: "medium",
        colorStatus: "yellow",
        confidence: 88,
        isHealthy: false,
        description: isHindi ? "निचली पत्तियों पर गोल भूरे छल्ले और हल्का पीलापन देखा गया है।" : isTelugu ? "క్రింది ఆకులపై గోధుమ రంగు వలయాలు మరియు పసుపు రంగు అంచులు గమనించబడ్డాయి." : isTamil ? "கீழ் இலைகளில் பழுப்பு நிற புள்ளிகள் மற்றும் மஞ்சள் விளிம்புகள் காணப்படுகின்றன." : "Mild concentric brown spots and yellow halos noticed on foliage surface.",
        organicRemedy: isHindi ? "5ml नीम का तेल प्रति लीटर पानी में मिलाकर सुबह पत्तों पर छिड़कें या खट्टी छाछ का घोल (1:9) डालें।" : isTelugu ? "లీటరు నీటికి 5ml వేప నూనె లేదా పుల్లటి మజ్జిగ కలిపి పిచికారీ చేయండి." : isTamil ? "ஒரு லிட்டர் தண்ணீரில் 5 மிலி வேப்பெண்ணெய் அல்லது புளித்த மோர் கலந்து தெளிக்கவும்." : "Spray Neem Oil (5ml/L water) or diluted sour buttermilk in the early morning.",
        chemicalTreatment: isHindi ? "मैन्कोजेब 75% WP (2 ग्राम प्रति लीटर पानी) या कॉपर ऑक्सीक्लोराइड 50% WP (2.5 ग्राम/लीटर) का छिड़काव करें।" : isTelugu ? "మాంకోజెబ్ 75% WP (లీటరు నీటికి 2 గ్రాములు) పిచికారీ చేయండి." : isTamil ? "மேன்கோசெப் 75% WP (ஒரு லிட்டர் தண்ணீருக்கு 2 கிராம்) தெளிக்கவும்." : "Apply Mancozeb 75% WP @ 2.0g/L or Copper Oxychloride 50% WP @ 2.5g/L water.",
        preventiveMeasures: isHindi ? "पौधों के बीच उचित दूरी रखें और शाम को पत्तियों पर पानी छिड़कने से बचें।" : isTelugu ? "మొక్కల మధ్య సరైన దూరం ఉంచండి మరియు సాయంత్రం వేళల్లో నీటి చల్లడం నివారించండి." : isTamil ? "செடிகளுக்கு இடையே போதிய இடைவெளி விட்டு மாலையில் மேல் தெளிப்பு பாசனத்தை தவிர்க்கவும்." : "Ensure proper spacing and avoid overhead sprinkler watering in late afternoons."
      },
      source: "fallback",
    });
  }
};

app.post("/api/ai/diagnose", handleDiseaseDiagnosis);
app.post("/api/ai/diagnose-crop", handleDiseaseDiagnosis);

// Multimodal Voice & Text Assistant
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  try {
    const {
      message = "",
      imageBase64,
      mimeType = "image/jpeg",
      role = "farmer",
      language = "en",
      context = {},
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      const smartFallback = getLocalizedSmartChatReply(message, role, language, context);
      return res.json({
        reply: smartFallback.reply,
        spokenText: smartFallback.spokenText,
        source: "smart-fallback",
      });
    }

    const systemInstruction = `You are AgriVision Assistant, a grounded AI agricultural and horticultural intelligence system.
User Role: "${role}"
Active Language: "${language}"

CORE OPERATING DIRECTIVES:
1. STRICT DATA GROUNDING:
   - Ground all data-dependent answers (soil moisture, sensor pH, farm risk scores, mandi prices, member alerts, job listings) strictly in the provided Context and the verified reference data below.
   - Never invent or assume numbers (like making up a price, moisture %, or job count).
   - If the user asks for specific data (e.g. "What is my sensor pH?" or "What is Ramlal's crop status?") and that data is absent from both the context and verified tables, state honestly: "I don't have enough recorded data for that right now" and guide the user on where to check or connect their device.

2. ROLE-SCOPING BOUNDARIES:
   - role === "farmer": Provide precision agronomic advice for commercial acreage. Reference the farmer's actual sensor values (e.g. 38% moisture, 6.8 pH), mandi prices (e.g. Wheat ₹2,480/Qtl, Soybean ₹4,750), and verified per-acre fertilizer dosages (e.g., 50kg DAP + 15kg Urea basal; 45kg Urea top-dress; Neem oil 5ml/L, Mancozeb 2g/L).
   - role === "gardener": Focus exclusively on kitchen gardening, container plants, and balcony pots. Use pot-scale organic guidance (handfuls of vermicompost, 1-inch finger moisture test, banana peel tea, diluted buttermilk). NEVER recommend large farm-scale chemical sacks or per-acre dosages to home gardeners.
   - role === "labour": Focus on available agricultural jobs, daily wage rates (₹500 - ₹650/day), application statuses, and verified skill badges (Harvesting, Sowing, Spraying, Tractor driving).
   - role === "fpo": Focus on collective cluster insights (124 farmers across 1,480 acres, 2 high-risk alerts: Tajpur soybean mosaic & Unhel tomato blight, 14% bulk input discounts, broadcast notifications).

3. VERIFIED REFERENCE TABLES:
${JSON.stringify(VERIFIED_REFERENCE_DATA, null, 2)}

4. LIVE CLIENT CONTEXT:
${JSON.stringify(context, null, 2)}

5. LANGUAGE & TONE:
   - You MUST write your ENTIRE reply in "${language}" using its natural, culturally appropriate script (e.g. Hindi in Devanagari, Telugu in Telugu script, Tamil in Tamil script, Marathi in Devanagari, Punjabi in Gurmukhi, Bengali in Bengali script, Kannada in Kannada script, Gujarati in Gujarati script, or English).
   - Keep answers clear, conversational, and direct (2-4 sentences max), perfectly suited for audio text-to-speech.
   - Explicitly highlight key numbers (percentages, ₹ amounts, dosages) clearly.`;

    const parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }
    parts.push({
      text: message || "Please provide advice based on this crop photo and current farm state.",
    });

    const response = await generateContentWithFallback(ai, {
      contents: { parts },
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || "I have analyzed your farm request. Please follow standard watering and crop care.";
    return res.json({
      reply,
      spokenText: reply,
      source: "gemini",
    });
  } catch (error: any) {
    console.error("AI Chat error (using smart localized fallback):", error?.message || error);
    const smartFallback = getLocalizedSmartChatReply(req.body?.message || "", req.body?.role || "farmer", req.body?.language || "en", req.body?.context || {});
    return res.json({
      reply: smartFallback.reply,
      spokenText: smartFallback.spokenText,
      source: "fallback",
    });
  }
});

// AI Crop Recommendation Engine
app.post("/api/ai/crop-recommend", async (req: Request, res: Response) => {
  try {
    const { soilType = "Loamy", soilPh = 6.8, season = "Kharif", region = "North/Central India", waterAvailability = "Moderate" } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      const defaultRecommendations = [
        {
          crop: "Wheat (HD-2967 / Sharbati)",
          suitabilityScore: 95,
          colorStatus: "green",
          durationDays: "120-135 days",
          expectedYield: "45-50 Qtl/Hectare",
          profitPotential: "High (₹35,000 - ₹50,000 / Acre)",
          waterNeed: "Medium (4-5 irrigations)",
          soilMatch: "Excellent for pH 6.5 - 7.5 Loamy soil",
          reason: "Optimal winter temperature cycle and balanced soil pH ensure high grain weight."
        },
        {
          crop: "Mustard (Pusa Bold)",
          suitabilityScore: 90,
          colorStatus: "green",
          durationDays: "110-120 days",
          expectedYield: "18-22 Qtl/Hectare",
          profitPotential: "Very High (Low input cost)",
          waterNeed: "Low (2 irrigations)",
          soilMatch: "Great for sandy-loam and medium soils",
          reason: "Requires minimal irrigation while commanding premium oilseed market rates."
        },
        {
          crop: "Chickpea / Bengal Gram (JG-11)",
          suitabilityScore: 88,
          colorStatus: "green",
          durationDays: "100-110 days",
          expectedYield: "20-25 Qtl/Hectare",
          profitPotential: "High",
          waterNeed: "Low to Moderate",
          soilMatch: "Fixes atmospheric nitrogen, enhances soil",
          reason: "High pulse demand and low water requirement suit present conditions."
        }
      ];
      return res.json({ recommendations: defaultRecommendations, source: "default" });
    }

    const prompt = `Recommend the top 3 best crops for a farmer with:
Soil Type: ${soilType}, Soil pH: ${soilPh}, Season: ${season}, Region: ${region}, Water: ${waterAvailability}.

Return JSON array with objects containing:
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
}`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({ recommendations: parsed, source: "gemini" });
  } catch (error: any) {
    console.error("Crop recommend error (using default recommendations):", error?.message || error);
    return res.json({
      recommendations: [
        {
          crop: "Wheat (HD-2967 / Lokwan)",
          suitabilityScore: 94,
          colorStatus: "green",
          durationDays: "120-130 days",
          expectedYield: "45 Qtl/Hectare",
          profitPotential: "High (₹40,000 / Acre)",
          waterNeed: "Medium",
          soilMatch: "Suits current soil profile",
          reason: "High market demand and strong climatic suitability."
        },
        {
          crop: "Mustard (Pusa Bold)",
          suitabilityScore: 91,
          colorStatus: "green",
          durationDays: "110-120 days",
          expectedYield: "20 Qtl/Hectare",
          profitPotential: "Very High",
          waterNeed: "Low",
          soilMatch: "Low water requirement",
          reason: "Low input cost with reliable MSP."
        }
      ],
      source: "fallback"
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AgriVision Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
