import { LanguageCode, NotificationItem, LabourJob, PlantCareItem } from "../types";
import { TRANSLATIONS } from "../data/translations";

// Comprehensive crop names dictionary across all 9 supported languages
export const LOCALIZED_CROPS: Record<string, Record<LanguageCode, string>> = {
  Wheat: {
    en: "Wheat",
    hi: "गेहूं",
    te: "గోధుమలు",
    ta: "கோதுமை",
    mr: "गहू",
    pa: "ਕਣਕ",
    bn: "গম",
    kn: "ಗೋಧಿ",
    gu: "ઘઉં",
  },
  Soybean: {
    en: "Soybean",
    hi: "सोयाबीन",
    te: "సోయాబీన్",
    ta: "சோயாபீன்",
    mr: "सोयाबीन",
    pa: "ਸੋਇਆਬੀਨ",
    bn: "সয়াবিন",
    kn: "ಸೋಯಾಬೀನ್",
    gu: "સોયાબીન",
  },
  Mustard: {
    en: "Mustard",
    hi: "सरसों",
    te: "ఆవాలు",
    ta: "கடுகு",
    mr: "मोहरी",
    pa: "ਸਰ੍ਹੋਂ",
    bn: "সরিষা",
    kn: "ಸಾಸಿವೆ",
    gu: "રાયડો / સરસવ",
  },
  Tomato: {
    en: "Tomato",
    hi: "टमाटर",
    te: "టమోటా",
    ta: "தக்காளி",
    mr: "टोमॅटो",
    pa: "ਟਮਾਟਰ",
    bn: "টমেটো",
    kn: "ಟೊಮ್ಯಾಟೊ",
    gu: "ટામેટા",
  },
  Cotton: {
    en: "Cotton",
    hi: "कपास",
    te: "పత్తి",
    ta: "பருத்தி",
    mr: "कापूस",
    pa: "ਕਪਾਹ",
    bn: "তুলা",
    kn: "ಹತ್ತಿ",
    gu: "કપાસ",
  },
  Rice: {
    en: "Paddy / Rice",
    hi: "धान / चावल",
    te: "వరి / బియ్యం",
    ta: "நெல் / அரிசி",
    mr: "भात / तांदूळ",
    pa: "ਝੋਨਾ / ਚੌਲ",
    bn: "ধান / চাল",
    kn: "ಭತ್ತ / ಅಕ್ಕಿ",
    gu: "ડાંગર / ચોખા",
  },
  Maize: {
    en: "Maize / Corn",
    hi: "मक्का",
    te: "ಮొక్కజొన్న",
    ta: "மக்காச்சோளம்",
    mr: "मका",
    pa: "ਮੱਕੀ",
    bn: "ভুট্টা",
    kn: "ಮೆಕ್ಕೆಜೋಳ",
    gu: "મકાઈ",
  },
  Sugarcane: {
    en: "Sugarcane",
    hi: "गन्ना",
    te: "చెరకు",
    ta: "கரும்பு",
    mr: "ऊस",
    pa: "ਗੰਨਾ",
    bn: "আখ",
    kn: "ಕಬ್ಬು",
    gu: "શેરડી",
  },
  Chickpea: {
    en: "Gram / Chickpea",
    hi: "चना",
    te: "శనగలు",
    ta: "கொண்டைக்கடலை",
    mr: "हरभरा / चणा",
    pa: "ਛੋਲੇ",
    bn: "ছোলা",
    kn: "ಕಡಲೆ",
    gu: "ચણા",
  },
  Onion: {
    en: "Onion",
    hi: "प्याज",
    te: "ఉల్లిపాయ",
    ta: "வெங்காயம்",
    mr: "कांदा",
    pa: "ਪਿਆਜ਼",
    bn: "পেঁয়াজ",
    kn: "ಈರುಳ್ಳಿ",
    gu: "ડુંગળી",
  },
  Potato: {
    en: "Potato",
    hi: "आलू",
    te: "బంగాళాదుంప",
    ta: "உருளைக்கிழங்கு",
    mr: "बटाटा",
    pa: "ਆਲੂ",
    bn: "আলু",
    kn: "ಆಲೂಗಡ್ಡೆ",
    gu: "બટાટા",
  },
  Groundnut: {
    en: "Groundnut / Peanut",
    hi: "मूंगफली",
    te: "వేరుశనగ",
    ta: "வேர்க்கடலை",
    mr: "भुईमूग",
    pa: "ਮੂੰਗਫਲੀ",
    bn: "চীনাবাদাম",
    kn: "ಕಡಲೆಕಾಯಿ",
    gu: "મગફળી",
  },
  Chilli: {
    en: "Chilli / Pepper",
    hi: "हरी मिर्च",
    te: "మిరపకాయ",
    ta: "பச்சை மிளகாய்",
    mr: "हिरवी मिरची",
    pa: "ਹਰੀ ਮਿਰਚ",
    bn: "কাঁচা লঙ্কা",
    kn: "ಹಸಿಮೆಣಸಿನಕಾಯಿ",
    gu: "લીલા મરચાં",
  },
  Turmeric: {
    en: "Turmeric",
    hi: "हल्दी",
    te: "పసుపు",
    ta: "மஞ்சள்",
    mr: "हळद",
    pa: "ਹਲਦੀ",
    bn: "হলুদ",
    kn: "ಅರಿಶಿನ",
    gu: "હળદર",
  },
};

// Common crop disease translations across all 9 languages
export const LOCALIZED_DISEASES: Record<string, Record<LanguageCode, { name: string; remedy: string }>> = {
  "Early Blight": {
    en: {
      name: "Early Blight (Alternaria)",
      remedy: "Spray 5ml Neem Oil per liter water or Copper Oxychloride 50% WP (2.5g/L).",
    },
    hi: {
      name: "अगेती झुलसा रोग (Early Blight)",
      remedy: "नीम का तेल (5ml/L) या कॉपर ऑक्सीक्लोराइड (2.5g/L) का छिड़काव करें।",
    },
    te: {
      name: "ముందస్తు తెగులు (Early Blight)",
      remedy: "లీటరు నీటికి 5 మి.లీ వేప నూనె లేదా కాపర్ ఆక్సిక్లోరైడ్ పిచికారీ చేయండి.",
    },
    ta: {
      name: "முன் கருகல் நோய் (Early Blight)",
      remedy: "ஒரு லிட்டர் தண்ணீருக்கு 5 மி.லி வேப்ப எண்ணெய் அல்லது காப்பர் ஆக்ஸிகுளோரைடு தெளிக்கவும்.",
    },
    mr: {
      name: "लवकर येणारा करपा (Early Blight)",
      remedy: "प्रति लिटर पाण्यात 5 मिली कडुनिंब तेल किंवा कॉपर ऑक्सिक्लोराईड फवारा.",
    },
    pa: {
      name: "ਅਗੇਤਾ ਝੁਲਸਾ ਰੋਗ (Early Blight)",
      remedy: "ਨੀਮ ਦਾ ਤੇਲ (5ml/L) ਜਾਂ ਕਾਪਰ ਆਕਸੀਕਲੋਰਾਈਡ (2.5g/L) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
    },
    bn: {
      name: "আর্লি ব্লাইট বা আগাম ধ্বসা (Early Blight)",
      remedy: "প্রতি লিটার জলে ৫ মিলি নিম তেল বা কপার অক্সিক্লোরাইড স্প্রে করুন।",
    },
    kn: {
      name: "ಮುಂಚಿನ ಎಲೆ ಮಚ್ಚೆ ರೋಗ (Early Blight)",
      remedy: "ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 5 ಮಿ.ಲೀ ಬೇವಿನ ಎಣ್ಣೆ ಅಥವಾ ಕಾಪರ್ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ ಸಿಂಪಡಿಸಿ.",
    },
    gu: {
      name: "અગેતર સુકારો (Early Blight)",
      remedy: "લીટર દીઠ 5 મિલી લીમડાનું તેલ અથવા કોપર ઓક્સીક્લોરાઇડનો છંટકાવ કરો.",
    },
  },
  "Powdery Mildew": {
    en: {
      name: "Powdery Mildew (White Fungal Powder)",
      remedy: "Spray diluted sour buttermilk (1:4 ratio) or Wettable Sulphur (2g/L) in bright sunlight.",
    },
    hi: {
      name: "सफेद चूर्णिल फफूंद (छाछिया रोग)",
      remedy: "खट्टी छाछ (1:4 अनुपात) या घुलनशील गंधक (2g/L) का धूप में छिड़काव करें।",
    },
    te: {
      name: "బూడిద తెగులు (Powdery Mildew)",
      remedy: "పుల్లటి మజ్జిగ నీటిలో కలిపి లేదా సల్ಫರ್ పిచికారీ చేయండి.",
    },
    ta: {
      name: "சாம்பல் நோய் (Powdery Mildew)",
      remedy: "புளித்த மோர் அல்லது சல்பர் தெளிக்கவும்.",
    },
    mr: {
      name: "भुरी रोग (Powdery Mildew)",
      remedy: "आंबट ताक किंवा विद्राव्य गंधक (२ ग्रॅम/लिटर) फवारा.",
    },
    pa: {
      name: "ਚਿੱਟਾ ਪਾਊਡਰ ਰੋਗ (Powdery Mildew)",
      remedy: "ਖੱਟੀ ਲੱਸੀ ਜਾਂ ਸਲਫਰ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
    },
    bn: {
      name: "পাউডারি মিলডিউ (সাদা গুঁড়ো ছত্রাক)",
      remedy: "টক ঘোল বা দ্রবণীয় সালফার স্প্রে করুন।",
    },
    kn: {
      name: "ಬೂದಿ ರೋಗ (Powdery Mildew)",
      remedy: "ಹುಳಿ ಮಜ್ಜಿಗೆ ಅಥವಾ ಗಂಧಕದ ದ್ರಾವಣ ಸಿಂಪಡಿಸಿ.",
    },
    gu: {
      name: "ભૂકી છારો (Powdery Mildew)",
      remedy: "ખાટી છાશ અથવા સલ્ફર પાવડરનો છંટકાવ કરો.",
    },
  },
  "Healthy Crop Foliage": {
    en: {
      name: "Healthy Crop (No Disease Detected)",
      remedy: "Crop foliage is healthy. Continue balanced irrigation and organic manure.",
    },
    hi: {
      name: "स्वस्थ हरी फसल (रोगमुक्त)",
      remedy: "फसल पूर्णतः स्वस्थ है। नियमित सिंचाई व संतुलित जैविक खाद जारी रखें।",
    },
    te: {
      name: "ఆరోగ్యకరమైన పంట (తెగుళ్లు లేవు)",
      remedy: "పంట ఆరోగ్యంగా ఉంది. సమతుల్య నీటిపారుదల కొనసాగించండి.",
    },
    ta: {
      name: "ஆரோக்கியமான பயிர் (நோயற்றது)",
      remedy: "பயிர் ஆரோக்கியமாக உள்ளது. சீரான நீர்ப்பாசனம் தொடரவும்.",
    },
    mr: {
      name: "निरोगी व सशक्त पीक (रोगमुक्त)",
      remedy: "पीक निरोगी आहे. वेळेवर पाणी व खत व्यवस्थापन चालू ठेवा.",
    },
    pa: {
      name: "ਤੰਦਰੁਸਤ ਹਰੀ ਫਸਲ (ਰੋਗ ਮੁਕਤ)",
      remedy: "ਫਸਲ ਬਿਲਕੁਲ ਤੰਦਰੁਸਤ ਹੈ। ਨਿਯਮਤ ਸਿੰਚਾਈ ਜਾਰੀ ਰੱਖੋ।",
    },
    bn: {
      name: "সুস্থ ও সতেজ ফসল (রোগমুক্ত)",
      remedy: "ফসল সম্পূর্ণ সুস্থ। সঠিক সেচ ও জৈব সার প্রয়োগ অব্যাহত রাখুন।",
    },
    kn: {
      name: "ಆರೋಗ್ಯಕರ ಬೆಳೆ (ರೋಗ ಮುಕ್ತ)",
      remedy: "ಬೆಳೆ ಆರೋಗ್ಯಕರವಾಗಿದೆ. ನಿಯಮಿತ ನೀರಾವರಿ ಮುಂದುವರಿಸಿ.",
    },
    gu: {
      name: "તંદુરસ્ત પાક (રોગ મુક્ત)",
      remedy: "પાક તંદુરસ્ત છે. નિયમિત પિયત અને ખાતર ચાલુ રાખો.",
    },
  },
};

// Common fertilizer name translations across all 9 languages
export const LOCALIZED_FERTILIZERS: Record<string, Record<LanguageCode, string>> = {
  Urea: {
    en: "Urea (46% Nitrogen)",
    hi: "यूरिया (46% नाइट्रोजन)",
    te: "యూరియా (46% నత్రజని)",
    ta: "யூரியா (46% நைட்ரஜன்)",
    mr: "युरिया (४६% नत्र)",
    pa: "ਯੂਰੀਆ (46% ਨਾਈਟ੍ਰੋਜਨ)",
    bn: "ইউরিয়া (৪৬% নাইট্রোজেন)",
    kn: "ಯೂರಿಯಾ (46% ಸಾರಜನಕ)",
    gu: "યૂરિયા (૪૬% નાઇટ્રોજન)",
  },
  DAP: {
    en: "DAP (18-46-0 Di-Ammonium Phosphate)",
    hi: "डीएपी (18-46-0 डाई-अमोनियम फॉस्फेट)",
    te: "డి.ఎ.పి (18-46-0 డై-అమ్మోనియం ఫాస్ఫేట్)",
    ta: "டி.ஏ.பி (18-46-0 டை-அம்மோனியம் பாஸ்பேட்)",
    mr: "डीएपी (१८-४६-० डाय-अमोनियम फॉस्फेट)",
    pa: "ਡੀ.ਏ.ਪੀ (18-46-0 ਡਾਈ-ਅਮੋਨੀਅਮ ਫਾਸਫੇਟ)",
    bn: "ডিএপি (১৮-৪৬-০ ডাই-অ্যামোনিয়াম ফসফেট)",
    kn: "ಡಿ.ಎ.ಪಿ (18-46-0 ಡೈ-ಅಮೋನಿಯಂ ಫಾಸ್ಫೇಟ್)",
    gu: "ડી.એ.પી (૧૮-૪૬-૦ ડાય-એમોનિયમ ફોસ્ફેટ)",
  },
  NPK: {
    en: "NPK Complex (19:19:19)",
    hi: "एनपीके 19:19:19 (संतुलित पोषण)",
    te: "ఎన్‌పికె 19:19:19 (సమతుల్య ఎరువు)",
    ta: "என்பிகே 19:19:19 (சமச்சீர் உரம்)",
    mr: "एनपीके १९:१९:१९ (संतुलित खत)",
    pa: "ਐਨਪੀਕੇ 19:19:19 (ਸੰਤੁਲਿਤ ਖਾਦ)",
    bn: "এনপিকে ১৯:১৯:১৯ (ভারসাম্যপূর্ণ সার)",
    kn: "ಎನ್‌ಪಿಕೆ 19:19:19 (ಸಮತೋಲಿತ ಗೊಬ್ಬರ)",
    gu: "એનપીકે ૧૯:૧૯:૧૯ (સંતુલિત ખાતર)",
  },
  Potash: {
    en: "MOP (Muriate of Potash 60% K2O)",
    hi: "पोटाश (MOP 60% पोटाशियम)",
    te: "పొటాష్ (MOP 60% పొటాషియం)",
    ta: "பொட்டாஷ் (MOP 60% பொட்டாசியம்)",
    mr: "पोटॅश (MOP ६०% पोटॅशियम)",
    pa: "ਪੋਟਾਸ਼ (MOP 60% ਪੋਟਾਸ਼ੀਅਮ)",
    bn: "পটাশ (MOP ৬০% পটাশিয়াম)",
    kn: "ಪೊಟ್ಯಾಷ್ (MOP 60% ಪೊಟ್ಯಾಸಿಯಮ್)",
    gu: "પોટાશ (MOP ૬૦% પોટેશિયમ)",
  },
  ZincSulphate: {
    en: "Zinc Sulphate (33% Monohydrate)",
    hi: "जिंक सल्फेट (33% सूक्ष्म पोषक तत्व)",
    te: "జింక్ సల్ఫేట్ (33% సూక్ష్మ పోషకం)",
    ta: "துத்தநாக சல்பேட் (33% ஜிங்க்)",
    mr: "झिंक सल्फेट (३३% सूक्ष्म पोषक)",
    pa: "ਜ਼ਿੰਕ ਸਲਫੇਟ (33% ਸੂਖਮ ਤੱਤ)",
    bn: "জিঙ্ক সালফেট (৩৩% অনুখাদ্য)",
    kn: "ಜಿಂಕ್ ಸಲ್ಫೇಟ್ (33% ಪೋಷಕಾಂಶ)",
    gu: "ઝિંક સલ્ફેટ (૩૩% સૂક્ષ્મ પોષકતત્વ)",
  },
  NeemOil: {
    en: "Organic Neem Oil 10,000 PPM",
    hi: "जैविक नीम तेल (10,000 PPM)",
    te: "సేంద్రీయ వేప నూనె",
    ta: "இயற்கை வேப்ப எண்ணெய்",
    mr: "सेंद्रिय कडुनिंब तेल",
    pa: "ਜੈਵਿਕ ਨੀਮ ਦਾ ਤੇਲ",
    bn: "জৈব নিম তেল",
    kn: "ಸಾವಯವ ಬೇವಿನ ಎಣ್ಣೆ",
    gu: "જૈવિક લીમડાનું તેલ",
  },
  Vermicompost: {
    en: "Organic Vermicompost / Earthworm Castings",
    hi: "केंचुआ खाद (वर्मीकम्पोस्ट)",
    te: "వర్మీకంపోస్ట్ (వానపాముల ఎరువు)",
    ta: "மண்புழு உரம் (வெர்மிகம்போஸ்ட்)",
    mr: "गांडूळ खत (व्हर्मीकंपोस्ट)",
    pa: "ਗੰਡੋਆ ਖਾਦ (ਵਰਮੀਕੰਪੋਸਟ)",
    bn: "কেঁচো সার (ভার্মিকম্পোস্ট)",
    kn: "ಎರೆಹುಳು ಗೊಬ್ಬರ (ವರ್ಮಿಕಂಪೋಸ್ಟ್)",
    gu: "અળસિયાનું ખાતર (વર્મીકમ્પોસ્ટ)",
  },
};

// Helper: Get localized crop name
export function getLocalizedCrop(cropName: string, lang: LanguageCode = "en"): string {
  const matchKey = Object.keys(LOCALIZED_CROPS).find(
    (k) => k.toLowerCase() === cropName.toLowerCase() || cropName.toLowerCase().includes(k.toLowerCase())
  );
  if (matchKey && LOCALIZED_CROPS[matchKey][lang]) {
    return LOCALIZED_CROPS[matchKey][lang];
  }
  return cropName;
}

// Helper: Get localized disease info
export function getLocalizedDisease(
  diseaseKey: string,
  lang: LanguageCode = "en"
): { name: string; remedy: string } {
  const matchKey = Object.keys(LOCALIZED_DISEASES).find((k) =>
    diseaseKey.toLowerCase().includes(k.toLowerCase())
  );
  if (matchKey && LOCALIZED_DISEASES[matchKey][lang]) {
    return LOCALIZED_DISEASES[matchKey][lang];
  }
  const defaultEntry = LOCALIZED_DISEASES["Early Blight"][lang] || LOCALIZED_DISEASES["Early Blight"].en;
  return {
    name: diseaseKey,
    remedy: defaultEntry.remedy,
  };
}

// Helper: Get localized fertilizer name
export function getLocalizedFertilizer(fertName: string, lang: LanguageCode = "en"): string {
  const matchKey = Object.keys(LOCALIZED_FERTILIZERS).find(
    (k) => k.toLowerCase() === fertName.toLowerCase() || fertName.toLowerCase().includes(k.toLowerCase())
  );
  if (matchKey && LOCALIZED_FERTILIZERS[matchKey][lang]) {
    return LOCALIZED_FERTILIZERS[matchKey][lang];
  }
  return fertName;
}

// Helper: Get localized growth stage
export function getLocalizedGrowthStage(stage: string, lang: LanguageCode = "en"): string {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const s = stage.toLowerCase();
  if (s.includes("sow") || s.includes("basal") || s.includes("seed")) return t.fertilizer.sowing;
  if (s.includes("veg") || s.includes("grow") || s.includes("tiller")) return t.fertilizer.vegetative;
  if (s.includes("flow") || s.includes("bloom")) return t.fertilizer.flowering;
  if (s.includes("fruit") || s.includes("grain") || s.includes("pod")) return t.fertilizer.fruiting;
  return stage;
}

// Helper: Get localized application method
export function getLocalizedApplicationMethod(method: string, lang: LanguageCode = "en"): string {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const m = method.toLowerCase();
  if (m.includes("broad") || m.includes("top-dress") || m.includes("scatter")) return t.fertilizer.broadcast;
  if (m.includes("soil") || m.includes("mix") || m.includes("basal")) return t.fertilizer.soilMix;
  if (m.includes("spray") || m.includes("foliar")) return t.fertilizer.foliarSpray;
  if (m.includes("drip") || m.includes("ferti") || m.includes("water")) return t.fertilizer.fertigation;
  return method;
}

// Helper: Format regional currency (e.g. ₹550 / ದಿನ, ₹550 / day)
export function formatCurrency(amount: number, lang: LanguageCode = "en"): string {
  const formattedNumber = amount.toLocaleString("en-IN");
  return `₹${formattedNumber}`;
}

// Helper: Format regional date string
export function formatRegionalDate(dateInput: Date | string, lang: LanguageCode = "en"): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const localeMap: Record<LanguageCode, string> = {
    en: "en-IN",
    hi: "hi-IN",
    te: "te-IN",
    ta: "ta-IN",
    mr: "mr-IN",
    pa: "pa-IN",
    bn: "bn-IN",
    kn: "kn-IN",
    gu: "gu-IN",
  };
  try {
    return date.toLocaleDateString(localeMap[lang] || "en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date.toLocaleDateString();
  }
}

// Helper: Translate notification content dynamically
export function getLocalizedNotification(
  notif: NotificationItem,
  lang: LanguageCode = "en"
): { title: string; message: string; spokenText: string } {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (notif.category === "weather") {
    const title = t.notifications.weatherAlert;
    const msg =
      lang === "hi"
        ? "मौसम विभाग: अगले 48 घंटों में भारी बारिश और 40 किमी/घंटा की रफ्तार से हवाएं चलने का अनुमान। आज छिड़काव न करें।"
        : lang === "te"
        ? "వాతావరణ శాఖ: రాబోయే 48 గంటల్లో భారీ వర్ష సూచన. ఈ రోజు ఎరువులు లేదా మందులు పిచಿಕారీ చేయవద్దు."
        : lang === "ta"
        ? "வானிலை எச்சரிக்கை: அடுத்த 48 மணி நேரத்தில் பலத்த மழை பெய்யக்கூடும். இன்று பூச்சிக்கொல்லி தெளிப்பதைத் தவிர்க்கவும்."
        : lang === "mr"
        ? "हवामान इशारा: पुढील ४८ तासांत मुसळधार पावसाचा अंदाज. आज शेतात कोणतीही फवारणी करू नका."
        : lang === "pa"
        ? "ਮੌਸਮ ਚੇਤਾਵਨੀ: ਅਗਲੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ। ਅੱਜ ਸਪਰੇਅ ਨਾ ਕਰੋ।"
        : lang === "bn"
        ? "আবহাওয়া সতর্কতা: আগামী ৪৮ ঘণ্টায় ভারী বৃষ্টির সম্ভাবনা। আজ জমিতে কীটনাশক স্প্রে করবেন না।"
        : lang === "kn"
        ? "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ: ಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ ಭಾರಿ ಮಳೆ ಸಾಧ್ಯತೆ. ಇಂದು ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ."
        : lang === "gu"
        ? "હવામાન ચેતવણી: આગામી 48 કલાકમાં ભારે વરસાદની આગાહી. આજે કોઈ દવા છાંટવી નહીં."
        : notif.message;
    return { title, message: msg, spokenText: `${title}. ${msg}` };
  }

  if (notif.category === "disease") {
    const title = t.notifications.diseaseAlert;
    const msg =
      lang === "hi"
        ? "चेतावनी: आपके क्षेत्र में टमाटर की फसल में अगेती झुलसा रोग के लक्षण देखे गए हैं। तुरंत नीम तेल का छिड़काव करें।"
        : lang === "te"
        ? "హెచ్చరిక: మీ ప్రాంతంలో టమోటా పంటలో ముందస్తు తెగులు కనిపించింది. వెంటనే నివారణ చర్యలు చేపట్టండి."
        : lang === "ta"
        ? "நோய் எச்சரிக்கை: உங்கள் பகுதியில் தக்காளி பயிரில் இலை கருகல் நோய் பரவி வருகிறது. வேப்ப எண்ணெய் தெளிக்கவும்."
        : lang === "mr"
        ? "रोग इशारा: आपल्या भागात टोमॅटो पिकावर करपा रोगाचा प्रादुर्भाव. तात्काळ प्रतिबंधात्मक फवारणी करा."
        : lang === "pa"
        ? "ਬਿਮਾਰੀ ਚੇਤਾਵਨੀ: ਤੁਹਾਡੇ ਇਲਾਕੇ ਵਿੱਚ ਟਮਾਟਰਾਂ 'ਤੇ ਝੁਲਸਾ ਰੋਗ ਦੇ ਲੱਛਣ। ਤੁਰੰਤ ਨੀਮ ਤੇਲ ਛਿੜਕੋ।"
        : lang === "bn"
        ? "রোগ সতর্কতা: আপনার অঞ্চলে টমেটো ফসলে আর্লি ব্লাইট রোগের প্রাদুর্ভাব দেখা গেছে।"
        : lang === "kn"
        ? "ರೋಗ ಎಚ್ಚರಿಕೆ: ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗೆ ಎಲೆ ಮಚ್ಚೆ ರೋಗದ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿವೆ."
        : lang === "gu"
        ? "રોગ ચેતવણી: તમારા વિસ્તારમાં ટામેટાના પાકમાં સુકારા રોગના લક્ષણો જોવા મળ્યા છે."
        : notif.message;
    return { title, message: msg, spokenText: `${title}. ${msg}` };
  }

  if (notif.category === "sensor") {
    const title = t.notifications.sensorAlert;
    const msg =
      lang === "hi"
        ? "स्मार्ट सेंसर: खेत A में मिट्टी की नमी 32% से नीचे गिर गई है। ड्रिप सिंचाई चालू करने की सलाह दी जाती है।"
        : lang === "te"
        ? "స్మార్ట్ సెన్సార్: పొలం A లో నేల తేమ 32% కంటే తగ్గింది. మోటార్ ఆన్ చేయండి."
        : lang === "ta"
        ? "சென்சார் எச்சரிக்கை: வயல் A இல் மண் ஈரப்பதம் 32% க்கும் குறைவாக உள்ளது. பாசனம் செய்யவும்."
        : lang === "mr"
        ? "स्मार्ट सेन्सर: शेत A मध्ये मातीतील ओलावा ३२% खाली गेला आहे. पाणी देण्याची वेळ झाली आहे."
        : lang === "pa"
        ? "ਸੈਂਸਰ ਚੇਤਾਵਨੀ: ਖੇਤ A ਵਿੱਚ ਮਿੱਟੀ ਦੀ ਨਮੀ 32% ਤੋਂ ਘੱਟ ਹੈ। ਮੋਟਰ ਚਲਾਉਣ ਦੀ ਲੋੜ ਹੈ।"
        : lang === "bn"
        ? "সেন্সর সতর্কতা: জমিতে মাটির আর্দ্রতা ৩২% এর নিচে নেমে গেছে। জল সেচ দিন।"
        : lang === "kn"
        ? "ಸೆನ್ಸಾರ್ ಎಚ್ಚರಿಕೆ: ಹೊಲದಲ್ಲಿ ಮಣ್ಣಿನ ತೇವಾಂಶ 32% ಕ್ಕಿಂತ ಕಡಿಮೆಯಾಗಿದೆ. ನೀರು ಹರಿಸಿ."
        : lang === "gu"
        ? "સેન્સર ચેતવણી: ખેતર A માં ભેજ 32% થી ઘટી ગયો છે. પિયત શરૂ કરો."
        : notif.message;
    return { title, message: msg, spokenText: `${title}. ${msg}` };
  }

  return {
    title: notif.title,
    message: notif.message,
    spokenText: `${notif.title}. ${notif.message}`,
  };
}
