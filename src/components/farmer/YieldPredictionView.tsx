import React, { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Droplets,
  FlaskConical,
  HelpCircle,
  Info,
  Layers,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  TrendingDown,
  TrendingUp,
  Users,
  Volume2,
  AlertTriangle,
  Flame,
  Check,
  X,
  Sliders,
} from "lucide-react";
import { LanguageCode, UserProfile, IoTSensorData } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";

interface YieldPredictionViewProps {
  currentLanguage: LanguageCode;
  userProfile: UserProfile;
  iotData?: IoTSensorData;
  onBack: () => void;
  onOpenMarketPrices?: () => void;
  onOpenFertilizer?: () => void;
  onOpenHireLabour?: () => void;
  onOpenIoT?: () => void;
  onOpenVoiceAssistantWithPrompt?: (prompt: string, section?: string) => void;
}

// Crop models with specific baseline yields, units, price benchmarks, and harvest windows
interface CropYieldModel {
  id: string;
  name: string;
  nativeNames: Partial<Record<LanguageCode, string>>;
  emoji: string;
  baseYieldPerAcre: number; // in Quintals
  minVariance: number;
  maxVariance: number;
  unit: string;
  marketRatePerUnit: number; // in INR
  lastSeasonYield: number;
  regionalAvgYield: number;
  totalGrowthDays: number;
  currentDay: number;
  harvestWindowText: Partial<Record<LanguageCode, string>>;
  stages: {
    name: Partial<Record<LanguageCode, string>>;
    day: number;
    completed: boolean;
    current: boolean;
  }[];
  factors: {
    id: "soil" | "weather" | "disease" | "stage";
    name: Partial<Record<LanguageCode, string>>;
    status: "optimal" | "favorable" | "moderate" | "warning";
    statusLabel: Partial<Record<LanguageCode, string>>;
    oneLiner: Partial<Record<LanguageCode, string>>;
    detailTitle: Partial<Record<LanguageCode, string>>;
    detailPoints: Partial<Record<LanguageCode, string[]>>;
    impactOnYield: string;
  }[];
}

const CROP_YIELD_MODELS: Record<string, CropYieldModel> = {
  wheat: {
    id: "wheat",
    name: "Wheat",
    nativeNames: {
      en: "Wheat",
      hi: "गेहूं (Wheat)",
      gu: "ઘઉં (Wheat)",
      mr: "गहू (Wheat)",
      pa: "ਕਣਕ (Wheat)",
      te: "గోధుమ (Wheat)",
      ta: "கோதுமை (Wheat)",
      bn: "গম (Wheat)",
      kn: "ಗೋಧಿ (Wheat)",
    },
    emoji: "🌾",
    baseYieldPerAcre: 21.5,
    minVariance: 18.5,
    maxVariance: 24.0,
    unit: "Qtl",
    marketRatePerUnit: 2480,
    lastSeasonYield: 18.3,
    regionalAvgYield: 18.2,
    totalGrowthDays: 120,
    currentDay: 82,
    harvestWindowText: {
      en: "Expected harvest: 3-4 weeks (late March / early April)",
      hi: "अनुमानित कटाई: 3-4 सप्ताह (मार्च अंत / अप्रैल शुरुआत)",
      gu: "અંદાજિત લણણી: 3-4 અઠવાડિયા (માર્ચ અંત / એપ્રિલની શરૂઆત)",
      mr: "अपेक्षित काढणी: 3-4 आठवडे (मार्च अखेर / एप्रिलची सुरुवात)",
      pa: "ਅਨੁਮਾਨਿਤ ਕਟਾਈ: 3-4 ਹਫ਼ਤੇ (ਮਾਰਚ ਅੰਤ / ਅਪ੍ਰੈਲ ਸ਼ੁਰੂ)",
      te: "అంచనా కోత: 3-4 వారాలు (మార్చి చివరి / ఏప్రిల్ ప్రారంభం)",
      ta: "எதிர்பார்க்கப்படும் அறுவடை: 3-4 வாரங்கள் (மார்ச் இறுதி / ஏப்ரல் தொடக்கம்)",
      bn: "প্রত্যাশিত ফসল কাটা: 3-4 সপ্তাহ (মার্চের শেষ / এপ্রিলের শুরু)",
      kn: "ನಿರೀಕ್ಷಿತ ಕೊಯ್ಲು: 3-4 ವಾರಗಳು (ಮಾರ್ಚ್ ಅಂತ್ಯ / ಏಪ್ರಿಲ್ ಆರಂಭ)",
    },
    stages: [
      {
        name: {
          en: "Sowing & Germination",
          hi: "बुवाई व अंकुरण",
          gu: "વાવણી અને અંકુરણ",
          mr: "पेरणी व उगवण",
          pa: "ਬਿਜਾਈ ਤੇ ਉੱਗਣਾ",
          te: "విత్తడం & మొలకెత్తడం",
          ta: "விதைத்தல் & முளைத்தல்",
          bn: "বপন ও অঙ্কুরোদগম",
          kn: "ಬಿತ್ತನೆ ಮತ್ತು ಮೊಳಕೆಯೊಡೆಯುವಿಕೆ",
        },
        day: 15,
        completed: true,
        current: false,
      },
      {
        name: {
          en: "Tillering & Vegetative",
          hi: "कल्ले फूटना व वृद्धि",
          gu: "ફૂટ અને વૃદ્ધિ",
          mr: "फुटवे व शाकीय वाढ",
          pa: "ਫੋਟ ਤੇ ਵਾਧਾ",
          te: "పిలకలు & శాఖీయ పెరుగుదల",
          ta: "கிளைத்தல் & வளரும் நிலை",
          bn: "কুশি গজানো ও বৃদ্ধি",
          kn: "ಕವಲೊಡೆಯುವಿಕೆ ಮತ್ತು ಸಸ್ಯಕ ಬೆಳವಣಿಗೆ",
        },
        day: 45,
        completed: true,
        current: false,
      },
      {
        name: {
          en: "Flowering & Heading",
          hi: "फूल व बाली निकलना",
          gu: "ફૂલ અને ડુંડી બેસવી",
          mr: "फुलोरा व लोंબી निघणे",
          pa: "ਫੁੱਲ ਤੇ ਸਿੱਟੇ ਨਿਕਲਣਾ",
          te: "పూత & వెన్ను రావడం",
          ta: "பூத்தல் & கதிர் விடுதல்",
          bn: "ফুল ও শীষ আসা",
          kn: "ಹೂಬಿಡುವಿಕೆ ಮತ್ತು ತೆನೆ ಬರುವುದು",
        },
        day: 70,
        completed: true,
        current: false,
      },
      {
        name: {
          en: "Grain Filling / Milk Stage",
          hi: "दूधिया दाना भराव",
          gu: "દાણા ભરાવવાની અવસ્થા",
          mr: "दाणे भरणे (दुधाळ अवस्था)",
          pa: "ਦਾਣਾ ਭਰਨ ਦੀ ਅਵਸਥਾ",
          te: "గింజ పాలు పోసుకునే దశ",
          ta: "தானியம் பால் பிடிக்கும் நிலை",
          bn: "দানা দুধিয় অবস্থা",
          kn: "ಕಾಳು ತುಂಬುವ ಹಾಲು ಹಂತ",
        },
        day: 95,
        completed: false,
        current: true,
      },
      {
        name: {
          en: "Maturity & Harvest Ready",
          hi: "परिपक्वता व कटाई तैयार",
          gu: "પાકવાની અને લણણી અવસ્થા",
          mr: "परिपक्वता व काढणी तयार",
          pa: "ਪੱਕਣਾ ਤੇ ਕਟਾਈ ਲਈ ਤਿਆਰ",
          te: "పరిపక్వత & కోతకు సిద్ధం",
          ta: "முதிர்ச்சி & அறுவடைக்கு தயார்",
          bn: "পরিপক্কতা ও ফসল কাটার উপযোগী",
          kn: "ಪಕ್ವತೆ ಮತ್ತು ಕೊಯ್ಲಿಗೆ ಸಿದ್ಧ",
        },
        day: 120,
        completed: false,
        current: false,
      },
    ],
    factors: [
      {
        id: "soil",
        name: {
          en: "Soil Health & Moisture",
          hi: "मृदा स्वास्थ्य व नमी",
          gu: "જમીનનું સ્વાસ્થ્ય અને ભેજ",
          mr: "मातीचे आरोग्य व ओलावा",
          pa: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਤੇ ਨਮੀ",
          te: "నేల ఆరోగ్యం & తేమ",
          ta: "மண் வளம் & ஈரப்பதம்",
          bn: "মাটির স্বাস্থ্য ও আর্দ্রতা",
          kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ತೇವಾಂಶ",
        },
        status: "optimal",
        statusLabel: {
          en: "Optimal (58% Moisture, 6.8 pH)",
          hi: "उत्कृष्ट (58% नमी, 6.8 pH)",
          gu: "શ્રેષ્ઠ (58% ભેજ, 6.8 pH)",
          mr: "उत्कृष्ट (58% ओलावा, 6.8 pH)",
          pa: "ਬਿਹਤਰੀਨ (58% ਨਮੀ, 6.8 pH)",
          te: "అత్యుత్తమం (58% తేమ, 6.8 pH)",
          ta: "சிறந்தது (58% ஈரப்பதம், 6.8 pH)",
          bn: "অনুকূল (58% আর্দ্রতা, 6.8 pH)",
          kn: "ಅತ್ಯುತ್ತಮ (58% ತೇವಾಂಶ, 6.8 pH)",
        },
        oneLiner: {
          en: "Good soil moisture and balanced pH maintaining strong root uptake this season.",
          hi: "इस मौसम में अच्छी मिट्टी की नमी और संतुलित pH से जड़ों को पर्याप्त पोषण मिल रहा है।",
          gu: "આ સિઝનમાં જમીનમાં સારો ભેજ અને સંતુલિત pH પોષક તત્વોનું શોષણ વધારે છે.",
          mr: "या हंगामात चांगला ओलावा आणि संतुलित pH मुळे मुळांना उत्तम पोषण मिळत आहे.",
          pa: "ਇਸ ਸੀਜ਼ਨ ਵਿੱਚ ਚੰਗੀ ਨਮੀ ਅਤੇ ਸੰਤੁਲਿਤ pH ਨਾਲ ਜੜ੍ਹਾਂ ਤੰਦਰੁਸਤ ਹਨ।",
          te: "ఈ సీజన్ లో మంచి నేల తేమ మరియు సమతుల్య pH వేర్ల పోషణను పెంచుతున్నాయి.",
          ta: "இந்த பருவத்தில் நல்ல மண் ஈரப்பதமும் சமநிலையான pH அளவும் ஊட்டச்சத்துக்களை சீராக்குகின்றன.",
          bn: "এই মৌসুমে ভালো মাটির আর্দ্রতা এবং সুষম pH শিকড়ের বৃদ্ধি বজায় রাখছে।",
          kn: "ಈ ಋತುವಿನಲ್ಲಿ ಉತ್ತಮ ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ಸಮತೋಲಿತ pH ಬೇರುಗಳ ಪೋಷಣೆಯನ್ನು ಕಾಪಾಡುತ್ತಿದೆ.",
        },
        detailTitle: {
          en: "Soil Sensor Analysis",
          hi: "मृदा सेंसर विस्तृत विश्लेषण",
          gu: "જમીન સેન્સર વિગતવાર વિશ્લેષણ",
          mr: "माती सेन्सर सविस्तर विश्लेषण",
          pa: "ਮਿੱਟੀ ਸੈਂਸਰ ਵਿਸਤ੍ਰਿਤ ਵਿਸ਼ਲੇਸ਼ਣ",
          te: "నేల సెన్సార్ వివరణాత్మక విశ్లేషణ",
          ta: "மண் சென்சார் விரிவான ஆய்வு",
          bn: "মাটি সেন্সর বিস্তারিত বিশ্লেষণ",
          kn: "ಮಣ್ಣಿನ ಸಂವೇದಕ ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆ",
        },
        detailPoints: {
          en: [
            "Root zone soil moisture is stable at 58%, preventing moisture stress.",
            "Soil pH is 6.8 (neutral range), ideal for maximum Nitrogen & Phosphorus absorption.",
            "IoT sensor readings indicate consistent capillary water retention.",
          ],
          hi: [
            "जड़ क्षेत्र में मिट्टी की नमी 58% पर स्थिर है, जिससे सूखा तनाव नहीं है।",
            "मिट्टी का pH 6.8 (संतुलित) है, जो नाइट्रोजन व फास्फोरस ग्रहण के लिए उत्तम है।",
            "IoT नोड डेटा दर्शाता है कि सिंचाई जल अवशोषण एकदम सही है।",
          ],
          gu: [
            "મૂળ વિસ્તારમાં જમીનનો ભેજ 58% પર સ્થિર છે, જે પાકને સુકાવા દેતો નથી.",
            "જમીનનું pH 6.8 છે, જે નાઇટ્રોજન અને ફોસ્ફરસ શોષણ માટે ઉત્તમ છે.",
            "સેન્સર રીડિંગ્સ દર્શાવે છે કે પિયત પાણીનું સ્તર નિયમિત છે.",
          ],
          mr: [
            "मुळांच्या भागात मातीतील ओलावा 58% वर स्थिर आहे, ज्यामुळे पाण्याचा ताण नाही.",
            "मातीचा सामू (pH) 6.8 आहे, जो खतांच्या शोषणासाठी सर्वात चांगला मानला जातो.",
            "IoT सेन्सरनुसार पाण्याची उपलब्धता योग्य प्रमाणात आहे.",
          ],
        },
        impactOnYield: "+1.8 Qtl / Acre",
      },
      {
        id: "weather",
        name: {
          en: "Weather & Climate",
          hi: "मौसम व जलवायु",
          gu: "હવામાન અને આબોહવા",
          mr: "हवामान व तापमान",
          pa: "ਮੌਸਮ ਤੇ ਜਲਵਾਯੂ",
          te: "వాతావరణం & వాతావరణ పరిస్థితులు",
          ta: "வானிலை & காலநிலை",
          bn: "আবহাওয়া ও জলবায়ু",
          kn: "ಹವಾಮಾನ ಮತ್ತು ಪರಿಸ್ಥಿತಿ",
        },
        status: "favorable",
        statusLabel: {
          en: "Favorable Sunshine (32°C / 20°C)",
          hi: "अनुकूल धूप (32°C / 20°C)",
          gu: "અનુકૂળ તડકો (32°C / 20°C)",
          mr: "अनुकूल सूर्यप्रकाश (32°C / 20°C)",
          pa: "ਅਨੁਕੂਲ ਧੁੱਪ (32°C / 20°C)",
          te: "అనుకూలమైన ఎండ (32°C / 20°C)",
          ta: "ஏதுவான வெயில் (32°C / 20°C)",
          bn: "অনুকূল রোদ (32°C / 20°C)",
          kn: "ಅನುಕೂಲಕರ ಬಿಸಿಲು (32°C / 20°C)",
        },
        oneLiner: {
          en: "Adequate winter chill accumulated during tillering; clear sunny spell accelerating grain weight.",
          hi: "कल्ले फूटने के समय पर्याप्त ठंड मिली; अब खिली धूप दानों का वजन व चमक बढ़ा रही है।",
          gu: "વિકાસ સમયે સારી ઠંડી મળી હતી; હવે ખુલ્લો તડકો દાણાનું વજન વધારી રહ્યો છે.",
          mr: "वाढीच्या काळात चांगली थंडी मिळाली; आता स्वच्छ सूर्यप्रकाशामुळे दाण्यांचे वजन वाढत आहे.",
          pa: "ਵਾਧੇ ਵੇਲੇ ਲੋੜੀਂਦੀ ਠੰਡ ਮਿਲੀ ਸੀ; ਹੁਣ ਖਿੜੀ ਧੁੱਪ ਦਾਣੇ ਮੋਟੇ ਕਰ ਰਹੀ ਹੈ।",
          te: "మొలకెత్తే దశలో చల్లని వాతావరణం లభించింది; ఇప్పుడు ఎండ గింజ బరువును పెంచుతోంది.",
          ta: "வளரும் நிலையில் நல்ல குளிர் கிடைத்தது; இப்போது மிதமான வெயில் தானிய எடையை கூட்டுகிறது.",
          bn: "বৃদ্ধির সময়ে উপযুক্ত ঠান্ডা ছিল; এখন রৌদ্রোজ্জ্বল আবহাওয়া দানার পুষ্টি বাড়াচ্ছে।",
          kn: "ಬೆಳವಣಿಗೆಯ ಹಂತದಲ್ಲಿ ಉತ್ತಮ ಚಳಿ ಇತ್ತು; ಈಗಿನ ಬಿಸಿಲು ಕಾಳಿನ ತೂಕವನ್ನು ಹೆಚ್ಚಿಸುತ್ತಿದೆ.",
        },
        detailTitle: {
          en: "Climate Impact & GDD",
          hi: "जलवायु प्रभाव व तापमान",
          gu: "આબોહવા અસર અને તાપમાન",
          mr: "हवामान प्रभाव व तापमान",
          pa: "ਜਲਵਾਯੂ ਪ੍ਰਭਾਵ ਤੇ ਤਾਪਮਾਨ",
          te: "వాతావరణ ప్రభావం & ఉష్ణోగ్రత",
          ta: "காலநிலை தாக்கம் & வெப்பநிலை",
          bn: "জলবায়ু প্রভাব ও তাপমাত্রা",
          kn: "ಹವಾಮಾನ ಪ್ರಭಾವ ಮತ್ತು ತಾಪಮಾನ",
        },
        detailPoints: {
          en: [
            "Growing Degree Days (GDD) tracking 4% ahead of the 10-year seasonal benchmark.",
            "No unseasonal hail or rain forecast for the upcoming 10-day grain maturation period.",
            "Night temperatures remain under 22°C, minimizing grain shrinkage risk.",
          ],
          hi: [
            "तापमान संचयन (GDD) 10-वर्षीय औसत से 4% बेहतर चल रहा है।",
            "अगले 10 दिनों में ओलावृष्टि या असमय बारिश का कोई खतरा नहीं है।",
            "रात का तापमान 22°C से नीचे बना हुआ है, जिससे दाना सिकुड़ने का खतरा नहीं है।",
          ],
          gu: [
            "તાપમાન વૃદ્ધિ સૂચકાંક 10 વર્ષના સરેરાશ કરતાં 4% આગળ છે.",
            "આગામી 10 દિવસમાં કરા કે કમોસમી વરસાદની કોઈ શક્યતા નથી.",
            "રાત્રિનું તાપમાન 22°C નીચે રહેવાથી દાણા સંકોચાવાનો ભય નથી.",
          ],
          mr: [
            "तापमान निर्देशांक मागील 10 वर्षांच्या सरासरीपेक्षा 4% अधिक अनुकूल आहे.",
            "पुढील 10 दिवसांत गारपीट किंवा अवकाळी पावसाचा धोका नाही.",
            "रात्रीचे तापमान 22°C पेक्षा कमी असल्याने दाणे भरण्यास मदत होते.",
          ],
        },
        impactOnYield: "+1.2 Qtl / Acre",
      },
      {
        id: "disease",
        name: {
          en: "Disease & Pest Impact",
          hi: "रोग व कीट प्रभाव",
          gu: "રોગ અને જીવાત અસર",
          mr: "रोग व कीड प्रादुर्भाव",
          pa: "ਬਿਮਾਰੀ ਤੇ ਕੀੜੇ-ਮਕੌੜੇ",
          te: "తెగుళ్ళు & పురుగుల ప్రభావం",
          ta: "நோய் & பூச்சி தாக்கம்",
          bn: "রোগ ও পোকার আক্রমণ",
          kn: "ರೋಗ ಮತ್ತು ಕೀಟಗಳ ಪ್ರಭಾವ",
        },
        status: "optimal",
        statusLabel: {
          en: "Zero Outbreaks (Clean Field)",
          hi: "शून्य प्रकोप (स्वस्थ फसल)",
          gu: "શૂન્ય ઉપદ્રવ (સ્વસ્થ પાક)",
          mr: "शून्य प्रादुर्भाव (निरोगी पीक)",
          pa: "ਕੋਈ ਬਿਮਾਰੀ ਨਹੀਂ (ਤੰਦਰੁਸਤ ਫ਼ਸਲ)",
          te: "తెగుళ్ళు లేవు (ఆరోగ్యకరమైన పంట)",
          ta: "நோய் பாதிப்பு இல்லை (ஆரோக்கிய பயிர்)",
          bn: "কোনো রোগ নেই (সুস্থ ফসল)",
          kn: "ಯಾವುದೇ ರೋಗವಿಲ್ಲ (ಆರೋಗ್ಯಕರ ಬೆಳೆ)",
        },
        oneLiner: {
          en: "No active yellow rust or blight detected in AI leaf scans; preventive bio-spray protected foliage.",
          hi: "AI लीफ स्कैन में पीला रतुआ या झुलसा रोग नहीं पाया गया; समय पर स्प्रे से फसल सुरक्षित रही।",
          gu: "AI પાંદડા સ્કેનમાં પીળો ગેરુ કે સુકારો નથી મળ્યો; યોગ્ય સમયે સ્પ્રેથી પાક સુરક્ષિત છે.",
          mr: "AI पानांच्या तपासणीत तांबेरा किंवा करपा रोग आढळला नाही; पीक पूर्णपणे सुरक्षित आहे.",
          pa: "AI ਸਕੈਨ ਵਿੱਚ ਪੀਲੀ ਕੁੰਗੀ ਜਾਂ ਝੁਲਸ ਰੋਗ ਦਾ ਕੋਈ ਅਸਰ ਨਹੀਂ ਮਿਲਿਆ; ਫ਼ਸਲ ਸੁਰੱਖਿਅਤ ਹੈ।",
          te: "AI స్కాన్లలో పసుపు కుంకుమ లేదా ఎండు తెగులు కనపడలేదు; పంట సంపూర్ణ ఆరోగ్యంగా ఉంది.",
          ta: "AI இலை ஸ்கேனில் மஞ்சள் துரு அல்லது கருகல் நோய் எதுவும் இல்லை; பயிர் நலமாக உள்ளது.",
          bn: "AI পাতায় কোনো হলুদ মরিচা বা ব্লাইট রোগ ধরা পড়েনি; ফসল নিরাপদ রয়েছে।",
          kn: "AI ಸ್ಕ್ಯಾನ್‌ನಲ್ಲಿ ಯಾವುದೇ ಹಳದಿ ತುಕ್ಕು ಅಥವಾ ರೋಗ ಕಂಡುಬಂದಿಲ್ಲ; ಬೆಳೆ ಸುರಕ್ಷಿತವಾಗಿದೆ.",
        },
        detailTitle: {
          en: "Crop Health & Diagnostic Log",
          hi: "फसल स्वास्थ्य व निदान रिकॉर्ड",
          gu: "પાક સ્વાસ્થ્ય અને નિદાન વિગતો",
          mr: "पीक आरोग्य व तपासणी नोंद",
          pa: "ਫ਼ਸਲ ਸਿਹਤ ਤੇ ਨਿਰੀਖਣ ਰਿਕਾਰਡ",
          te: "పంట ఆరోగ్యం & నిర్ధారణ వివరాలు",
          ta: "பயிர் நலம் & ஆய்வு விபரம்",
          bn: "ফসল স্বাস্থ্য ও রোগ নির্ণয় লগ",
          kn: "ಬೆಳೆ ಆರೋಗ್ಯ ಮತ್ತು ತಪಾಸಣೆ ವಿವರ",
        },
        detailPoints: {
          en: [
            "3 camera scans verified healthy leaf surface index with 97% confidence.",
            "Preventive micronutrient foliar spray protected earhead canopy from fungal spores.",
            "Estimated crop loss from pests remains at 0%.",
          ],
          hi: [
            "3 कैमरा स्कैन में 97% विश्वसनीयता के साथ पत्तियां पूर्णतः स्वस्थ पाई गईं।",
            "माइक्रोन्यूट्रिएंट स्प्रे ने फफूंद बीजाणुओं से बालियों को सुरक्षित रखा।",
            "कीट या रोग से अनुमानित उपज नुकसान 0% पर बना हुआ है।",
          ],
          gu: [
            "3 કેમેરા સ્કેનમાં 97% વિશ્વાસ સાથે પાંદડા સંપૂર્ણ સ્વસ્થ મળ્યા છે.",
            "સૂક્ષ્મ પોષકતત્વોના છંટકાવથી ફૂગના રોગો અટક્યા છે.",
            "જીવાત કે રોગથી અંદાજિત નુકસાન 0% છે.",
          ],
          mr: [
            "3 कॅमेरा स्कॅनमध्ये 97% अचूकतेसह पाने निरोगी आढळली.",
            "वेळेवर फवारणी केल्यामुळे बुरशीचा प्रादुर्भाव झाला नाही.",
            "कीड किंवा रोगामुळे संभाव्य नुकसान 0% आहे.",
          ],
        },
        impactOnYield: "+0.5 Qtl / Acre",
      },
      {
        id: "stage",
        name: {
          en: "Crop Stage Progress",
          hi: "फसल विकास चरण",
          gu: "પાક વિકાસ તબક્કો",
          mr: "पीक वाढीचा टप्पा",
          pa: "ਫ਼ਸਲ ਵਾਧੇ ਦਾ ਪੜਾਅ",
          te: "పంట పెరుగుదల దశ",
          ta: "பயிர் வளர்ச்சி நிலை",
          bn: "ফসল বৃদ্ধির পর্যায়",
          kn: "ಬೆಳೆ ಬೆಳವಣಿಗೆಯ ಹಂತ",
        },
        status: "optimal",
        statusLabel: {
          en: "On Schedule (Day 82 / 120)",
          hi: "समय पर (दिन 82 / 120)",
          gu: "સમયસર (દિવસ 82 / 120)",
          mr: "वेळेवर (दिवस 82 / 120)",
          pa: "ਸਮੇਂ ਸਿਰ (ਦਿਨ 82 / 120)",
          te: "సమయానికి (రోజు 82 / 120)",
          ta: "சரியான நேரம் (நாள் 82 / 120)",
          bn: "নির্ধারিত সময়ে (দিন 82 / 120)",
          kn: "ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ (ದಿನ 82 / 120)",
        },
        oneLiner: {
          en: "Crop is on track for normal harvest timing with dense earhead formation.",
          hi: "बालियों में दाना भराव उत्तम गति से चल रहा है और कटाई समय पर होगी।",
          gu: "ડુંડીઓમાં દાણા ભરાવવાની ગતિ ઉત્તમ છે અને લણણી સમયસર થશે.",
          mr: "दाणे भरण्याची प्रक्रिया उत्तम सुरू असून काढणी वेळेत पूर्ण होईल.",
          pa: "ਸਿੱਟਿਆਂ ਵਿੱਚ ਦਾਣਾ ਬਹੁਤ ਵਧੀਆ ਪੈ ਰਿਹਾ ਹੈ ਅਤੇ ਕਟਾਈ ਸਮੇਂ ਸਿਰ ਹੋਵੇਗੀ।",
          te: "గింజ పాలు పోసుకోవడం చురుగ్గా సాగుతోంది, కోత సమయానికే జరుగుతుంది.",
          ta: "தானியம் நன்கு பிடித்து வருகிறது, அறுவடை உரிய நேரத்தில் தொடங்கும்.",
          bn: "দানা গঠনের গতি সন্তোষজনক এবং ফসল সময়মতো তোলা যাবে।",
          kn: "ಕಾಳು ತುಂಬುವ ಪ್ರಕ್ರಿಯೆ ಉತ್ತಮವಾಗಿದ್ದು ಕೊಯ್ಲು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಆಗಲಿದೆ.",
        },
        detailTitle: {
          en: "Biomass & Earhead Metrics",
          hi: "बायोमास व बाली घनत्व",
          gu: "બાયોમાસ અને ડુંડી ઘનતા",
          mr: "बायोमास व लोंबी घनता",
          pa: "ਬਾਇਓਮਾਸ ਤੇ ਸਿੱਟਿਆਂ ਦੀ ਗਿਣਤੀ",
          te: "బయోమాస్ & వెన్ను సాంద్రత",
          ta: "பயிர் அடர்த்தி & கதிர் எண்ணிக்கை",
          bn: "বায়োমাস ও শীষের ঘনত্ব",
          kn: "ಬಯೋಮಾಸ್ ಮತ್ತು ತೆನೆ ಸಾಂದ್ರತೆ",
        },
        detailPoints: {
          en: [
            "Average productive tillers measured at 410 tillers / m² (above 380 norm).",
            "Earhead spikelet count averages 46 grains per head with uniform length.",
            "Expected physical grain weight (Test Weight) projected at 41g / 1000 grains.",
          ],
          hi: [
            "प्रति वर्गमीटर कल्ले 410 पाए गए हैं (सामान्य 380 से अधिक)।",
            "प्रत्येक बाली में औसतन 46 दाने हैं और बाली की लंबाई एकसमान है।",
            "1000 दानों का अनुमानित टेस्ट वजन 41 ग्राम रहने की संभावना है।",
          ],
          gu: [
            "પ્રતિ ચોરસ મીટર સરેરાશ 410 ફૂટ નોંધાયેલ છે (સામાન્ય 380 થી વધુ).",
            "દરેક ડુંડીમાં સરેરાશ 46 દાણા છે અને લંબાઈ એકસમાન છે.",
            "1000 દાણાનું અંદાજિત વજન 41 ગ્રામ રહેવાની ધારણા છે.",
          ],
          mr: [
            "प्रति चौरस मीटर फुटव्यांची संख्या 410 आहे (सरासरी 380 पेक्षा जास्त).",
            "प्रत्येक लोंबीमध्ये सरासरी 46 दाणे असून आकार एकसारखा आहे.",
            "1000 दाण्यांचे अंदाजे वजन 41 ग्रॅम भरण्याचा अंदाज आहे.",
          ],
        },
        impactOnYield: "+0.8 Qtl / Acre",
      },
    ],
  },
  cotton: {
    id: "cotton",
    name: "Cotton",
    nativeNames: {
      en: "Cotton",
      hi: "कपास (Cotton)",
      gu: "કપાસ (Cotton)",
      mr: "कापूस (Cotton)",
      pa: "ਕਪਾਹ (Cotton)",
      te: "పత్తి (Cotton)",
      ta: "பருத்தி (Cotton)",
      bn: "তুলা (Cotton)",
      kn: "ಹತ್ತಿ (Cotton)",
    },
    emoji: "☁️",
    baseYieldPerAcre: 13.8,
    minVariance: 11.5,
    maxVariance: 16.0,
    unit: "Qtl",
    marketRatePerUnit: 7150,
    lastSeasonYield: 12.0,
    regionalAvgYield: 11.5,
    totalGrowthDays: 165,
    currentDay: 110,
    harvestWindowText: {
      en: "Expected 1st Picking: 2-3 weeks (mid October)",
      hi: "अनुमानित पहली तुड़ाई: 2-3 सप्ताह (मध्य अक्टूबर)",
      gu: "અંદાજિત પ્રથમ વીણી: 2-3 અઠવાડિયા (મધ્ય ઓક્ટોબર)",
      mr: "अपेक्षित पहिली वेचणी: 2-3 आठवडे (ऑक्टोबर मध्यावर)",
      pa: "ਪਹਿਲੀ ਚੁਗਾਈ: 2-3 ਹਫ਼ਤੇ (ਮੱਧ ਅਕਤੂਬਰ)",
      te: "మొదటి కోత: 2-3 వారాలు (అక్టోబర్ మధ్యలో)",
      ta: "முதல் பறிப்பு: 2-3 வாரங்கள் (அக்டோபர் மத்தியில்)",
      bn: "প্রথম তুলা তোলা: 2-3 সপ্তাহ (অক্টোবরের মাঝামাঝি)",
      kn: "ಮೊದಲ ಬಿಡಿಸುವಿಕೆ: 2-3 ವಾರಗಳು (ಅಕ್ಟೋಬರ್ ಮಧ್ಯದಲ್ಲಿ)",
    },
    stages: [
      { name: { en: "Sowing & Emergence", hi: "बुवाई व अंकुरण" }, day: 20, completed: true, current: false },
      { name: { en: "Vegetative & Squaring", hi: "वानस्पतिक व डोडी बनना" }, day: 55, completed: true, current: false },
      { name: { en: "Flowering & Boll Formation", hi: "फूल व टिंडे बनना" }, day: 95, completed: true, current: false },
      { name: { en: "Boll Maturation & Bursting", hi: "टिंडा परिपक्वता व खिलना" }, day: 135, completed: false, current: true },
      { name: { en: "Harvesting & Pickings", hi: "तुड़ाई व चुनाई" }, day: 165, completed: false, current: false },
    ],
    factors: [
      {
        id: "soil",
        name: { en: "Soil Moisture & Drainage", hi: "मृदा नमी व जल निकासी" },
        status: "optimal",
        statusLabel: { en: "Good Aeration (62% Moisture)", hi: "उत्तम जल निकासी (62% नमी)" },
        oneLiner: { en: "Black cotton soil holds ideal residual moisture without waterlogging.", hi: "काली मिट्टी में पर्याप्त नमी है और जलभराव की कोई समस्या नहीं है।" },
        detailTitle: { en: "Soil Aeration Status", hi: "मृदा जल निकासी विश्लेषण" },
        detailPoints: {
          en: ["Deep root aeration prevents boll shedding.", "pH 7.4 supports efficient micronutrient uptake."],
          hi: ["जड़ों में हवा का संचार सही है जिससे टिंडे नहीं गिर रहे।", "pH 7.4 बोरॉन व जिंक के अवशोषण में सहायक है।"]
        },
        impactOnYield: "+1.1 Qtl / Acre",
      },
      {
        id: "weather",
        name: { en: "Sunlight & Humidity", hi: "धूप व आर्द्रता" },
        status: "favorable",
        statusLabel: { en: "Warm & Dry Days", hi: "शुष्क व गर्म दिन" },
        oneLiner: { en: "Sunny conditions accelerating boll opening and staple fiber length.", hi: "खिली धूप से टिंडे तेजी से खिल रहे हैं और रेशे की गुणवत्ता अच्छी है।" },
        detailTitle: { en: "Sunlight & Fiber Maturation", hi: "धूप व रेशा परिपक्वता" },
        detailPoints: {
          en: ["Daily sunshine hours average 8.4 hrs.", "Low humidity reduces boll rot risk."],
          hi: ["प्रतिदिन 8.4 घंटे धूप मिल रही है।", "कम नमी से टिंडे सड़ने का खतरा टल गया है।"]
        },
        impactOnYield: "+0.9 Qtl / Acre",
      },
      {
        id: "disease",
        name: { en: "Pink Bollworm & Sucking Pests", hi: "गुलाबी सुंडी व रसचूसक कीट" },
        status: "favorable",
        statusLabel: { en: "Under Economic Threshold", hi: "नियंत्रण में (कम खतरा)" },
        oneLiner: { en: "Pheromone traps show minimal pink bollworm activity; zero boll damage.", hi: "फेरोमोन ट्रैप में कीट संख्या न्यूनतम है; टिंडों को कोई नुकसान नहीं है।" },
        detailTitle: { en: "Pest Scouting Report", hi: "कीट निगरानी रिपोर्ट" },
        detailPoints: {
          en: ["Neem oil bio-spray kept whitefly under control.", "0% boll perforation found in field checks."],
          hi: ["नीम तेल स्प्रे से सफेद मक्खी नियंत्रित रही।", "टिंडों में छिद्र दर 0% पाई गई है।"]
        },
        impactOnYield: "+0.4 Qtl / Acre",
      },
      {
        id: "stage",
        name: { en: "Boll Retention Rate", hi: "टिंडा धारण दर" },
        status: "optimal",
        statusLabel: { en: "32 Bolls / Plant", hi: "32 टिंडे प्रति पौधा" },
        oneLiner: { en: "Boll load is 18% higher than regional baseline with large boll size.", hi: "प्रति पौधा टिंडों की संख्या क्षेत्रीय औसत से 18% अधिक है।" },
        detailTitle: { en: "Boll Count & Density", hi: "टिंडा संख्या व गुणवत्ता" },
        detailPoints: {
          en: ["Average 32 mature bolls per plant.", "Staple length projected at 29-30 mm premium grade."],
          hi: ["प्रति पौधा औसतन 32 परिपक्व टिंडे हैं।", "रेशे की लंबाई 29-30 मिमी प्रीमियम रहने की उम्मीद है।"]
        },
        impactOnYield: "+0.6 Qtl / Acre",
      },
    ],
  },
  rice: {
    id: "rice",
    name: "Rice / Paddy",
    nativeNames: {
      en: "Rice / Paddy",
      hi: "धान (Paddy)",
      gu: "ડાંગર (Paddy)",
      mr: "भात / धान (Paddy)",
      pa: "ਝੋਨਾ (Paddy)",
      te: "వరి (Paddy)",
      ta: "நெல் (Paddy)",
      bn: "ধান (Paddy)",
      kn: "ಭತ್ತ (Paddy)",
    },
    emoji: "🌾",
    baseYieldPerAcre: 26.0,
    minVariance: 22.0,
    maxVariance: 29.5,
    unit: "Qtl",
    marketRatePerUnit: 2320,
    lastSeasonYield: 24.2,
    regionalAvgYield: 22.8,
    totalGrowthDays: 135,
    currentDay: 98,
    harvestWindowText: {
      en: "Expected harvest: 4-5 weeks (early November)",
      hi: "अनुमानित कटाई: 4-5 सप्ताह (नवंबर शुरुआत)",
      gu: "અંદાજિત લણણી: 4-5 અઠવાડિયા (નવેમ્બર શરૂઆત)",
      mr: "अपेक्षित काढणी: 4-5 आठवडे (नोव्हेंबर सुरुवातीला)",
      pa: "ਅਨੁਮਾਨਿਤ ਕਟਾਈ: 4-5 ਹਫ਼ਤੇ (ਨਵੰਬਰ ਸ਼ੁਰੂ)",
      te: "అంచనా కోత: 4-5 వారాలు (నవంబర్ ప్రారంభం)",
      ta: "எதிர்பார்க்கப்படும் அறுவடை: 4-5 வாரங்கள் (நவம்பர் தொடக்கம்)",
      bn: "প্রত্যাশিত ফসল কাটা: 4-5 সপ্তাহ (নভেম্বরের শুরু)",
      kn: "ನಿರೀಕ್ಷಿತ ಕೊಯ್ಲು: 4-5 ವಾರಗಳು (ನವೆಂಬರ್ ಆರಂಭ)",
    },
    stages: [
      { name: { en: "Nursery & Transplanting", hi: "नर्सरी व रोपाई" }, day: 25, completed: true, current: false },
      { name: { en: "Tillering Stage", hi: "कल्ले फूटना" }, day: 55, completed: true, current: false },
      { name: { en: "Panicle Initiation & Booting", hi: "बाली निकलना व गाभा अवस्था" }, day: 85, completed: true, current: false },
      { name: { en: "Grain Filling & Milk Stage", hi: "दाना भराव व पकना" }, day: 110, completed: false, current: true },
      { name: { en: "Harvest Ready", hi: "कटाई तैयार" }, day: 135, completed: false, current: false },
    ],
    factors: [
      {
        id: "soil",
        name: { en: "Standing Water & Clay Soil", hi: "जल स्तर व मृदा पोषण" },
        status: "optimal",
        statusLabel: { en: "Adequate Moisture (72%)", hi: "उत्तम जल स्तर (72% नमी)" },
        oneLiner: { en: "Clayey loam soil holding optimal water depth for panicle emergence.", hi: "खेत में उचित नमी स्तर बना हुआ है जिससे बालियां भरपूर निकल रही हैं।" },
        detailTitle: { en: "Water Level & Nutrient Index", hi: "जल स्तर व पोषण स्थिति" },
        detailPoints: {
          en: ["Intermittent AWD irrigation saved water while strengthening roots.", "Available Nitrogen index is high."],
          hi: ["AWD सिंचाई से जड़ों को मजबूती और भरपूर ऑक्सीजन मिली है।", "नाइट्रोजन का स्तर पर्याप्त बना हुआ है।"]
        },
        impactOnYield: "+2.0 Qtl / Acre",
      },
      {
        id: "weather",
        name: { en: "Monsoon & Sunshine Balance", hi: "मानसून व धूप संतुलन" },
        status: "favorable",
        statusLabel: { en: "Good Solar Radiation", hi: "उत्कृष्ट सौर विकिरण" },
        oneLiner: { en: "Post-monsoon clear skies boosting photosynthetic carbohydrate storage.", hi: "मानसून बाद खिली धूप से दानों में स्टार्च और कार्बोहाइड्रेट तेजी से बन रहा है।" },
        detailTitle: { en: "Solar Hours & Temperature", hi: "धूप व तापमान विश्लेषण" },
        detailPoints: {
          en: ["Average 7.8 hours sunshine daily.", "No severe cyclonic winds forecast during maturity."],
          hi: ["प्रतिदिन 7.8 घंटे अच्छी धूप मिल रही है।", "कटाई के समय तेज हवा या आंधी का कोई खतरा नहीं है।"]
        },
        impactOnYield: "+1.4 Qtl / Acre",
      },
      {
        id: "disease",
        name: { en: "Blast & Sheath Blight", hi: "ब्लास्ट व झुलसा रोग" },
        status: "optimal",
        statusLabel: { en: "No Blast Detected", hi: "ब्लास्ट मुक्त (स्वस्थ)" },
        oneLiner: { en: "No neck blast or bacterial blight symptoms observed in sensor/camera tests.", hi: "गर्दन तोड़ या जीवाणु झुलसा रोग के कोई लक्षण नहीं पाए गए हैं।" },
        detailTitle: { en: "Paddy Health Log", hi: "धान स्वास्थ्य रिकॉर्ड" },
        detailPoints: {
          en: ["Brown planthopper population well below ETL threshold.", "Bio-fungicide preventive wash was effective."],
          hi: ["भूरा माहू (BPH) का कोई प्रकोप नहीं है।", "जैविक फफूंदनाशक स्प्रे ने बालियों को सुरक्षित रखा।"]
        },
        impactOnYield: "+0.8 Qtl / Acre",
      },
      {
        id: "stage",
        name: { en: "Panicle & Grain Count", hi: "बाली व दाना संख्या" },
        status: "optimal",
        statusLabel: { en: "165 Grains / Panicle", hi: "165 दाने प्रति बाली" },
        oneLiner: { en: "Heavy panicle density with over 88% filled grains.", hi: "प्रति बाली 165 दाने हैं और 88% से अधिक दाने पूरी तरह ठोस भर चुके हैं।" },
        detailTitle: { en: "Panicle Grain Analytics", hi: "बाली दाना विश्लेषण" },
        detailPoints: {
          en: ["Chaffy grain percentage is minimal (<8%).", "Panicle length averages 24.5 cm."],
          hi: ["खोखले दानों का प्रतिशत 8% से भी कम है।", "बाली की औसत लंबाई 24.5 सेमी है।"]
        },
        impactOnYield: "+1.2 Qtl / Acre",
      },
    ],
  },
  mustard: {
    id: "mustard",
    name: "Mustard",
    nativeNames: {
      en: "Mustard",
      hi: "सरसों (Mustard)",
      gu: "રાઈ / સરસવ (Mustard)",
      mr: "मोहरी / सरसो (Mustard)",
      pa: "ਸਰ੍ਹੋਂ (Mustard)",
      te: "ఆవాలు (Mustard)",
      ta: "கடுகு (Mustard)",
      bn: "সরিষা (Mustard)",
      kn: "ಸಾಸಿವೆ (Mustard)",
    },
    emoji: "🌼",
    baseYieldPerAcre: 9.2,
    minVariance: 7.8,
    maxVariance: 10.8,
    unit: "Qtl",
    marketRatePerUnit: 5650,
    lastSeasonYield: 8.0,
    regionalAvgYield: 7.5,
    totalGrowthDays: 110,
    currentDay: 75,
    harvestWindowText: {
      en: "Expected harvest: 3-4 weeks (early March)",
      hi: "अनुमानित कटाई: 3-4 सप्ताह (मार्च शुरुआत)",
      gu: "અંદાજિત લણણી: 3-4 અઠવાડિયા (માર્ચ શરૂઆત)",
      mr: "अपेक्षित काढणी: 3-4 आठवडे (मार्च सुरुवातीला)",
      pa: "ਅਨੁਮਾਨਿਤ ਕਟਾਈ: 3-4 ਹਫ਼ਤੇ (ਮਾਰਚ ਸ਼ੁਰੂ)",
      te: "అంచనా కోత: 3-4 వారాలు (మార్చి ప్రారంభం)",
      ta: "எதிர்பார்க்கப்படும் அறுவடை: 3-4 வாரங்கள் (மார்ச் தொடக்கம்)",
      bn: "প্রত্যাশিত ফসল কাটা: 3-4 সপ্তাহ (মার্চের শুরু)",
      kn: "ನಿರೀಕ್ಷಿತ ಕೊಯ್ಲು: 3-4 ವಾರಗಳು (ಮಾರ್ಚ್ ಆರಂಭ)",
    },
    stages: [
      { name: { en: "Sowing & Seedling", hi: "बुवाई व अंकुरण" }, day: 15, completed: true, current: false },
      { name: { en: "Vegetative & Rosette", hi: "शाकीय वृद्धि" }, day: 40, completed: true, current: false },
      { name: { en: "Flowering & Branching", hi: "फूल व शाखाएं" }, day: 65, completed: true, current: false },
      { name: { en: "Pod Formation & Filling", hi: "फलियां बनना व दाना भराव" }, day: 88, completed: false, current: true },
      { name: { en: "Pod Maturity & Harvest", hi: "फलियां पकना व कटाई" }, day: 110, completed: false, current: false },
    ],
    factors: [
      {
        id: "soil",
        name: { en: "Sulphur & Moisture Balance", hi: "सल्फर व मृदा नमी" },
        status: "optimal",
        statusLabel: { en: "High Sulphur Index", hi: "सल्फर व पोटाश युक्त" },
        oneLiner: { en: "Sulphur-rich loam soil enhancing oil percentage and seed weight.", hi: "सल्फर युक्त मिट्टी से दानों में तेल का प्रतिशत (41%) और वजन बढ़ रहा है।" },
        detailTitle: { en: "Soil Sulphur & NPK", hi: "मृदा सल्फर व पोषण" },
        detailPoints: {
          en: ["Soil moisture at 48% prevents pod dropping.", "Sulphur index supports high glucosinolate oil synthesis."],
          hi: ["48% नमी फलियों को गिरने से बचाती है।", "सल्फर की उचित मात्रा से 41.5% तेल निकलने का अनुमान है।"]
        },
        impactOnYield: "+0.8 Qtl / Acre",
      },
      {
        id: "weather",
        name: { en: "Cool Nights & Dry Days", hi: "ठंडी रातें व शुष्क दिन" },
        status: "favorable",
        statusLabel: { en: "No Fog Interruption", hi: "कोहरा रहित खिली धूप" },
        oneLiner: { en: "Absence of dense fog during flowering allowed optimal bee pollination.", hi: "फूल खिलने के समय कोहरा न होने से मधुमक्खियों द्वारा परागण बेहतरीन हुआ।" },
        detailTitle: { en: "Pollination & Weather", hi: "मौसम व परागण प्रभाव" },
        detailPoints: {
          en: ["Clear mornings maximized pollinator activity.", "Day temp 24°C ideal for pod development."],
          hi: ["सुबह साफ धूप से परागण 92% सफल रहा।", "दिन का तापमान 24°C फलियों के विकास के लिए आदर्श है।"]
        },
        impactOnYield: "+0.6 Qtl / Acre",
      },
      {
        id: "disease",
        name: { en: "Aphid (चेपा) & White Rust", hi: "माहू (चेपा) व सफेद रतुआ" },
        status: "optimal",
        statusLabel: { en: "Zero Aphid Outbreak", hi: "माहू मुक्त फसल" },
        oneLiner: { en: "Early yellow sticky traps prevented aphid clustering on tender pods.", hi: "पीले चिपचिपे ट्रैप लगाने से माहू का कोई प्रकोप नहीं हुआ।" },
        detailTitle: { en: "Aphid Control Status", hi: "कीट नियंत्रण स्थिति" },
        detailPoints: {
          en: ["Zero white rust lesions found on upper leaves.", "Aphid count is 0 per inflorescence."],
          hi: ["ऊपरी पत्तियों पर सफेद रतुआ नहीं है।", "फूलों पर माहू कीट शून्य पाया गया है।"]
        },
        impactOnYield: "+0.5 Qtl / Acre",
      },
      {
        id: "stage",
        name: { en: "Pod Load & Seed Density", hi: "फली भार व दाना संख्या" },
        status: "optimal",
        statusLabel: { en: "18 Seeds / Pod", hi: "18 दाने प्रति फली" },
        oneLiner: { en: "Primary and secondary branches loaded with long, well-filled siliquae pods.", hi: "शाखाएं लंबी और मोटे दानों से भरी फलियों से लदी हुई हैं।" },
        detailTitle: { en: "Siliqua Analytics", hi: "फली संरचना विश्लेषण" },
        detailPoints: {
          en: ["Average 240 pods per plant.", "Test weight projected at 5.4g per 1000 seeds."],
          hi: ["प्रति पौधा औसतन 240 फलियां हैं।", "1000 दानों का वजन 5.4 ग्राम रहने की संभावना है।"]
        },
        impactOnYield: "+0.5 Qtl / Acre",
      },
    ],
  },
};

export const YieldPredictionView: React.FC<YieldPredictionViewProps> = ({
  currentLanguage,
  userProfile,
  iotData,
  onBack,
  onOpenMarketPrices,
  onOpenFertilizer,
  onOpenHireLabour,
  onOpenIoT,
  onOpenVoiceAssistantWithPrompt,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const isHindi = currentLanguage === "hi";

  // Match crop model from user's primaryCrop or fallback to wheat
  const userCropNormalized = (userProfile.primaryCrop || "").toLowerCase();
  const initialCropKey =
    userCropNormalized.includes("cotton") || userCropNormalized.includes("कपास")
      ? "cotton"
      : userCropNormalized.includes("rice") || userCropNormalized.includes("paddy") || userCropNormalized.includes("धान")
      ? "rice"
      : userCropNormalized.includes("mustard") || userCropNormalized.includes("सरसों")
      ? "mustard"
      : "wheat";

  const [selectedCropKey, setSelectedCropKey] = useState<string>(initialCropKey);

  // Confidence / Data Simulation Mode:
  // "high": Connected IoT & Health Scans (Default when IoT sensor is enabled)
  // "moderate": Satellite & Regional Baseline Only
  // "early": Early Sowing Stage / Not Enough Data Fallback State
  const [dataConfidenceMode, setDataConfidenceMode] = useState<"high" | "moderate" | "early">("high");

  // Selected factor for interactive detail modal
  const [activeFactorDetail, setActiveFactorDetail] = useState<any | null>(null);

  // History expanded state
  const [showHistoryDetail, setShowHistoryDetail] = useState<boolean>(false);

  // Active Crop Model
  const cropModel = CROP_YIELD_MODELS[selectedCropKey] || CROP_YIELD_MODELS.wheat;

  // Farm Land Size in Acres (numeric)
  const landSizeAcre = parseFloat(userProfile.landSizeAcre) || 2.5;

  // Adjust yield numbers based on confidence mode
  const currentYieldEstimate =
    dataConfidenceMode === "high"
      ? cropModel.baseYieldPerAcre
      : dataConfidenceMode === "moderate"
      ? cropModel.baseYieldPerAcre - 0.9
      : cropModel.baseYieldPerAcre - 2.4;

  const minYield =
    dataConfidenceMode === "high"
      ? cropModel.minVariance
      : dataConfidenceMode === "moderate"
      ? cropModel.minVariance - 1.2
      : cropModel.minVariance - 3.0;

  const maxYield =
    dataConfidenceMode === "high"
      ? cropModel.maxVariance
      : dataConfidenceMode === "moderate"
      ? cropModel.maxVariance - 0.5
      : cropModel.maxVariance - 1.5;

  // Total Harvest Output
  const totalHarvestQtl = (currentYieldEstimate * landSizeAcre).toFixed(1);
  const totalGrossValue = Math.round(parseFloat(totalHarvestQtl) * cropModel.marketRatePerUnit);

  // Difference vs last season
  const diffVsLastSeason = (currentYieldEstimate - cropModel.lastSeasonYield).toFixed(1);
  const isPositiveVsLastSeason = parseFloat(diffVsLastSeason) >= 0;

  // Difference vs regional average
  const pctVsRegionalAvg = Math.round(
    ((currentYieldEstimate - cropModel.regionalAvgYield) / cropModel.regionalAvgYield) * 100
  );

  // Crop localized name helper
  const getCropName = (model: CropYieldModel) => {
    return model.nativeNames[currentLanguage] || model.nativeNames.en || model.name;
  };

  // Speech summary text
  const getSpeechSummary = () => {
    if (dataConfidenceMode === "early") {
      return isHindi
        ? `आपकी ${getCropName(cropModel)} फसल की प्रारंभिक बुवाई अवस्था है। सटीक उपज अनुमान के लिए वानस्पतिक वृद्धि के बाद दोबारा देखें।`
        : `Your ${cropModel.name} crop is in early stage. Check back after vegetative stage for high-confidence harvest estimate.`;
    }
    return isHindi
      ? `आपकी ${landSizeAcre} एकड़ में लगी ${getCropName(
          cropModel
        )} की अनुमानित उपज ${currentYieldEstimate} क्विंटल प्रति एकड़ है। कुल उत्पादन लगभग ${totalHarvestQtl} क्विंटल होने की संभावना है, जिसका अनुमानित बाजार मूल्य ₹${totalGrossValue.toLocaleString(
          "en-IN"
        )} है। पिछले वर्ष से यह ${Math.abs(
          parseFloat(diffVsLastSeason)
        )} क्विंटल प्रति एकड़ अधिक है।`
      : `Your estimated harvest for ${cropModel.name} across ${landSizeAcre} acres is ${currentYieldEstimate} Quintals per acre, with total expected harvest of ${totalHarvestQtl} Quintals valued around ₹${totalGrossValue.toLocaleString(
          "en-IN"
        )}. This is ${Math.abs(
          parseFloat(diffVsLastSeason)
        )} Quintals per acre higher than last season.`;
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-28">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                onBack();
              }}
              className="w-10 h-10 rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-800 active:scale-95 transition-all cursor-pointer"
              aria-label="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl">🌾</span>
                <h1 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                  {isHindi ? "उपज अनुमान व कटाई आउटलुक" : "Yield Prediction"}
                </h1>
              </div>
              <p className="text-[11px] font-bold text-stone-700">
                {userProfile.locationName || "Ujjain, Madhya Pradesh"} • {landSizeAcre} Acres
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton textToSpeak={getSpeechSummary()} language={currentLanguage} size="md" />
          </div>
        </div>

        {/* Horizontal Crop Selection Bar */}
        <div className="max-w-4xl mx-auto px-4 pb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {Object.values(CROP_YIELD_MODELS).map((crop) => {
            const isSelected = crop.id === selectedCropKey;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setSelectedCropKey(crop.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-xs scale-105"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200"
                }`}
              >
                <span>{crop.emoji}</span>
                <span>{getCropName(crop)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 space-y-4 sm:space-y-5">
        {/* Simulation / Data Confidence Toggle Ribbon */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-stone-700" />
            <span className="text-xs font-bold text-stone-700">
              {isHindi ? "डेटा स्रोत व मॉडल स्थिति:" : "Model Confidence Mode:"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setDataConfidenceMode("high");
              }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                dataConfidenceMode === "high"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-stone-700 hover:text-stone-950"
              }`}
            >
              <span>🟢</span>
              <span>{isHindi ? "IoT सेंसर" : "High (IoT)"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setDataConfidenceMode("moderate");
              }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                dataConfidenceMode === "moderate"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-stone-700 hover:text-stone-950"
              }`}
            >
              <span>🟡</span>
              <span>{isHindi ? "उपग्रह/मौसम" : "Satellite"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setDataConfidenceMode("early");
              }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                dataConfidenceMode === "early"
                  ? "bg-stone-700 text-white shadow-xs"
                  : "text-stone-700 hover:text-stone-950"
              }`}
            >
              <span>⚪</span>
              <span>{isHindi ? "प्रारंभिक चरण" : "Early Stage"}</span>
            </button>
          </div>
        </div>

        {/* FALLBACK STATE IF EARLY STAGE / NOT ENOUGH DATA */}
        {dataConfidenceMode === "early" ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
              ⏳
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-stone-200 text-stone-800">
                {isHindi ? "प्रारंभिक बुवाई चरण (Early Estimate)" : "Early Growth Stage"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {isHindi
                  ? "सटीक अनुमान के लिए अभी पर्याप्त डेटा नहीं है"
                  : "Not Enough Crop Data Yet"}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-stone-700 leading-relaxed">
                {isHindi
                  ? `आपकी ${getCropName(
                      cropModel
                    )} फसल अभी शुरुआती चरण में है। सटीक कटाई उपज का अनुमान वानस्पतिक वृद्धि और कल्ले निकलने के बाद (~12-14 दिन में) उपलब्ध होगा।`
                  : `Your ${cropModel.name} crop is in its early seedling stage. A reliable, high-precision yield forecast will be generated after the vegetative tillering stage (~14 days).`}
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-md mx-auto text-left flex items-start gap-3">
              <span className="text-xl shrink-0">💡</span>
              <div className="text-xs">
                <span className="font-black text-emerald-950 block">
                  {isHindi ? "सटीक अनुमान कैसे प्राप्त करें?" : "How to unlock accurate prediction?"}
                </span>
                <span className="font-semibold text-emerald-800">
                  {isHindi
                    ? "स्मार्ट IoT सॉयल सेंसर कनेक्ट करें या AI कैमरा से फसल की नियमित फोटो स्कैन करें।"
                    : "Connect an ESP32 soil sensor or log regular plant disease scans to track canopy biomass."}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onOpenIoT && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    onOpenIoT();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Cpu size={16} />
                  <span>{isHindi ? "सॉयल सेंसर कनेक्ट करें" : "Connect Soil Sensor"}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setDataConfidenceMode("high");
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-black text-xs border border-stone-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{isHindi ? "क्षेत्रीय मॉडल सिमुलेशन देखें" : "View Regional Simulation"}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 2. TOP SECTION — MAIN ESTIMATE CARD */}
            <div
              id="yield-main-estimate-card"
              className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 rounded-3xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden border border-emerald-700"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                {/* Crop & Field Context Badge */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                  <span className="text-lg">{cropModel.emoji}</span>
                  <span className="text-xs font-black text-emerald-100">
                    {isHindi ? "आपकी फसल:" : "For your"}{" "}
                    <strong className="text-white font-black">{getCropName(cropModel)}</strong> (
                    {landSizeAcre} {isHindi ? "एकड़" : "Acres"})
                  </span>
                </div>

                {/* Confidence Indicator Badge */}
                <div className="flex items-center gap-2">
                  {dataConfidenceMode === "high" ? (
                    <span className="px-3 py-1.5 rounded-full text-xs font-black bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 flex items-center gap-1.5 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{isHindi ? "उच्च विश्वसनीयता (High Confidence)" : "High Confidence"}</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full text-xs font-black bg-amber-400/20 text-amber-200 border border-amber-400/40 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>
                        {isHindi ? "मध्यम विश्वसनीयता (Moderate)" : "Moderate Confidence"}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Large Headline Yield Number */}
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-300/90">
                  {isHindi ? "अनुमानित उपज (Estimated Yield)" : "Expected Harvest Output"}
                </div>
                <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                    {currentYieldEstimate}
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-emerald-200">
                    {cropModel.unit} / {isHindi ? "एकड़" : "Acre"}
                  </span>
                </div>
              </div>

              {/* Confidence Range */}
              <div className="mt-3 inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-600/50 px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-emerald-200">
                <span className="text-amber-300">📊</span>
                <span>
                  {isHindi ? "अनुमानित दायरा:" : "Confidence Range:"}{" "}
                  <strong className="text-white">
                    {minYield} – {maxYield} {cropModel.unit} / {isHindi ? "एकड़" : "Acre"}
                  </strong>
                </span>
              </div>

              {/* Quick contextual reassurance note */}
              <p className="text-[11px] font-medium text-emerald-200/80 mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5">
                <Info size={14} className="shrink-0 text-emerald-300" />
                <span>
                  {isHindi
                    ? "यह अनुमान मिट्टी की नमी, मौसम पूर्वानुमान और पिछले 4 सीज़न के ऐतिहासिक डेटा पर आधारित है।"
                    : "Calculated using real-time IoT soil sensors, 10-day weather forecast, and multi-season regional models."}
                </span>
              </p>
            </div>

            {/* 3. COMPARISON CONTEXT (Makes the number meaningful) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Total Harvest Output */}
              <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>{isHindi ? "कुल अनुमानित पैदावार" : "Total Expected Output"}</span>
                  <span className="text-emerald-700">🚜</span>
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {totalHarvestQtl} <span className="text-sm font-bold text-stone-700">{cropModel.unit}</span>
                </div>
                <div className="text-[11px] font-extrabold text-emerald-700">
                  ≈ ₹{totalGrossValue.toLocaleString("en-IN")}{" "}
                  <span className="text-stone-700 font-semibold">
                    {isHindi ? "मंडी मूल्य" : "Gross Mandi Value"}
                  </span>
                </div>
              </div>

              {/* Compared to Last Season */}
              <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>{isHindi ? "पिछले सीज़न की तुलना" : "Vs. Last Season"}</span>
                  {isPositiveVsLastSeason ? (
                    <TrendingUp size={16} className="text-emerald-700" />
                  ) : (
                    <TrendingDown size={16} className="text-rose-700" />
                  )}
                </div>
                <div
                  className={`text-2xl font-black flex items-center gap-1 ${
                    isPositiveVsLastSeason ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  <span>{isPositiveVsLastSeason ? `+${diffVsLastSeason}` : diffVsLastSeason}</span>
                  <span className="text-sm font-bold text-stone-700">{cropModel.unit}/Acre</span>
                </div>
                <div className="text-[11px] font-semibold text-stone-700">
                  {isHindi ? "पिछला उत्पादन:" : "Last year:"} {cropModel.lastSeasonYield}{" "}
                  {cropModel.unit}
                </div>
              </div>

              {/* Compared to Regional Benchmark */}
              <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>{isHindi ? "क्षेत्रीय औसत तुलना" : "Vs. District Avg"}</span>
                  <span className="text-indigo-700">📍</span>
                </div>
                <div className="text-2xl font-black text-indigo-950">
                  +{pctVsRegionalAvg}%
                </div>
                <div className="text-[11px] font-extrabold text-indigo-700">
                  {isHindi
                    ? "क्षेत्रीय औसत से बेहतर"
                    : "Above regional benchmark"}{" "}
                  <span className="text-stone-700 font-normal">({cropModel.regionalAvgYield} Qtl)</span>
                </div>
              </div>
            </div>

            {/* 4. WHAT'S AFFECTING THIS ESTIMATE (TRANSPARENCY SECTION) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                    <span>🔍</span>
                    <span>
                      {isHindi ? "यह अनुमान किन कारणों पर आधारित है?" : "What's Affecting This Estimate"}
                    </span>
                  </h3>
                  <p className="text-xs font-semibold text-stone-700">
                    {isHindi
                      ? "विस्तार से देखने के लिए किसी भी कार्ड पर टैप करें"
                      : "Tap any factor card for sensor analytics & detail"}
                  </p>
                </div>

                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {isHindi ? "4 मुख्य कारक" : "4 Factors"}
                </span>
              </div>

              {/* 4 Factor Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {cropModel.factors.map((factor) => {
                  const factorName = factor.name[currentLanguage] || factor.name.en;
                  const factorOneLiner = factor.oneLiner[currentLanguage] || factor.oneLiner.en;
                  const factorStatus = factor.statusLabel[currentLanguage] || factor.statusLabel.en;

                  const iconEmoji =
                    factor.id === "soil"
                      ? "🌱"
                      : factor.id === "weather"
                      ? "☀️"
                      : factor.id === "disease"
                      ? "🛡️"
                      : "🌾";

                  return (
                    <div
                      key={factor.id}
                      onClick={() => {
                        soundEffects.click();
                        setActiveFactorDetail(factor);
                      }}
                      className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer space-y-2 group active:scale-[0.98]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl p-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                            {iconEmoji}
                          </span>
                          <div>
                            <h4 className="text-sm font-black text-stone-900 group-hover:text-emerald-900">
                              {factorName}
                            </h4>
                            <span className="text-[11px] font-bold text-emerald-700">
                              {factorStatus}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                          {factor.impactOnYield}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-stone-700 leading-relaxed line-clamp-2">
                        {factorOneLiner}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                        <span>{isHindi ? "विस्तृत विवरण देखें" : "View breakdown"}</span>
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. TIMELINE / HARVEST COUNTDOWN & STAGE PROGRESS */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                    <Calendar size={18} className="text-emerald-700" />
                    <span>{isHindi ? "कटाई समय-सारणी व विकास चरण" : "Harvest Timeline & Growth"}</span>
                  </h3>
                  <p className="text-xs font-bold text-emerald-800">
                    ⏱️{" "}
                    {cropModel.harvestWindowText[currentLanguage] ||
                      cropModel.harvestWindowText.en}
                  </p>
                </div>

                <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300">
                  {isHindi ? `दिन ${cropModel.currentDay} / ${cropModel.totalGrowthDays}` : `Day ${cropModel.currentDay} of ${cropModel.totalGrowthDays}`}
                </span>
              </div>

              {/* 5-Stage Growth Step Tracker */}
              <div className="pt-2">
                {/* Horizontal Progress Bar Track */}
                <div className="relative w-full h-3 bg-stone-200 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${(cropModel.currentDay / cropModel.totalGrowthDays) * 100}%`,
                    }}
                  />
                </div>

                {/* Growth Stage Markers */}
                <div className="grid grid-cols-5 gap-1 text-center">
                  {cropModel.stages.map((stg, idx) => {
                    const stgName = stg.name[currentLanguage] || stg.name.en;
                    return (
                      <div key={idx} className="flex flex-col items-center space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                            stg.completed
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : stg.current
                              ? "bg-amber-500 text-white ring-4 ring-amber-200 animate-pulse"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {stg.completed ? <Check size={14} /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] leading-tight font-extrabold line-clamp-2 ${
                            stg.current
                              ? "text-amber-900 font-black"
                              : stg.completed
                              ? "text-emerald-950"
                              : "text-stone-700"
                          }`}
                        >
                          {stgName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs font-semibold text-amber-950 flex items-center gap-2">
                <span className="text-lg">🌾</span>
                <span>
                  {isHindi
                    ? "फसल इस समय दाना भराव (Grain Filling) चरण में है। पोटाश स्प्रे से दानों में चमक और 1.2 क्विंटल/एकड़ अतिरिक्त उपज मिल सकती है।"
                    : "Crop is in active grain filling. Potassium foliar spray during this window adds ~1.2 Qtl/Acre test weight."}
                </span>
              </div>
            </div>

            {/* 6. ACTION SUGGESTIONS (TIES YIELD PREDICTION TO OTHER FEATURES) */}
            <div className="space-y-2.5">
              <h3 className="text-base font-black text-stone-900 px-1 flex items-center gap-2">
                <span>⚡</span>
                <span>{isHindi ? "सुझाए गए कदम व योजना" : "Recommended Actions for Your Harvest"}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Plan your sale -> Mandi Rates */}
                {onOpenMarketPrices && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      onOpenMarketPrices();
                    }}
                    className="p-4 rounded-3xl bg-emerald-50 hover:bg-emerald-100/80 border-2 border-emerald-300 text-left transition-all active:scale-98 cursor-pointer shadow-2xs space-y-2"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-950">
                        {isHindi ? "बिक्री की योजना बनाएं" : "Plan Your Sale"}
                      </h4>
                      <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                        {isHindi
                          ? `अपनी ${totalHarvestQtl} क्विंटल उपज के लिए सर्वोत्तम मंडी भाव देखें`
                          : `See best time & mandi to sell your expected ${totalHarvestQtl} Qtl`}
                      </p>
                    </div>
                    <span className="text-xs font-black text-emerald-900 flex items-center gap-1 pt-1">
                      <span>{isHindi ? "मंडी भाव खोलें" : "Open Mandi Rates"}</span>
                      <ChevronRight size={14} />
                    </span>
                  </button>
                )}

                {/* 2. Improve your yield -> Fertilizer / Irrigation */}
                {onOpenFertilizer && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      onOpenFertilizer();
                    }}
                    className="p-4 rounded-3xl bg-lime-50 hover:bg-lime-100/80 border-2 border-lime-300 text-left transition-all active:scale-98 cursor-pointer shadow-2xs space-y-2"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-lime-600 text-white flex items-center justify-center shadow-xs">
                      <FlaskConical size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-lime-950">
                        {isHindi ? "उपज में सुधार करें (+1.5 Qtl)" : "Boost Your Yield"}
                      </h4>
                      <p className="text-xs font-semibold text-lime-800 mt-0.5">
                        {isHindi
                          ? "दाना भराव के लिए पोटाश व सूक्ष्म पोषक तत्व सलाहकार खुराक देखें"
                          : "Apply potassium booster spray to maximize grain test weight"}
                      </p>
                    </div>
                    <span className="text-xs font-black text-lime-900 flex items-center gap-1 pt-1">
                      <span>{isHindi ? "उर्वरक सलाह देखें" : "Fertilizer Advisory"}</span>
                      <ChevronRight size={14} />
                    </span>
                  </button>
                )}

                {/* 3. Need harvest labour? -> Hire Labour */}
                {onOpenHireLabour && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      onOpenHireLabour();
                    }}
                    className="p-4 rounded-3xl bg-orange-50 hover:bg-orange-100/80 border-2 border-orange-300 text-left transition-all active:scale-98 cursor-pointer shadow-2xs space-y-2"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-orange-950">
                        {isHindi ? "कटाई मजदूर बुक करें" : "Book Harvest Labour"}
                      </h4>
                      <p className="text-xs font-semibold text-orange-800 mt-0.5">
                        {isHindi
                          ? "कटाई सीजन से पहले 4-6 मजदूर या कंबाइन हार्वेस्टर आरक्षित करें"
                          : "Pre-book 4-6 workers ahead of peak harvest season rush"}
                      </p>
                    </div>
                    <span className="text-xs font-black text-orange-900 flex items-center gap-1 pt-1">
                      <span>{isHindi ? "मजदूर हायर करें" : "Hire Labour"}</span>
                      <ChevronRight size={14} />
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* 7. HISTORY (ONE TAP DEEPER / PAST SEASONS ACCURACY TRACK RECORD) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-2xs space-y-3">
              <div
                onClick={() => {
                  soundEffects.click();
                  setShowHistoryDetail(!showHistoryDetail);
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-stone-900">
                      {isHindi
                        ? "पिछले सीज़न का मॉडल रिकॉर्ड (वास्तविक बनाम अनुमानित)"
                        : "Past Seasons' Actual vs. Predicted Yield"}
                    </h3>
                    <p className="text-xs font-semibold text-stone-700">
                      🎯 {isHindi ? "94.8% बहु-सीज़न सटीकता रिकॉर्ड" : "94.8% Average Model Accuracy"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-black border border-stone-300 flex items-center gap-1"
                >
                  <span>{showHistoryDetail ? (isHindi ? "छुपाएं" : "Hide") : (isHindi ? "देखें" : "View")}</span>
                  <ChevronRight
                    size={14}
                    className={`transition-transform ${showHistoryDetail ? "rotate-90" : ""}`}
                  />
                </button>
              </div>

              {showHistoryDetail && (
                <div className="pt-3 border-t border-stone-150 space-y-2.5 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Rabi 2025 */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-black text-stone-900">
                        <span>Rabi 2025 (Wheat / गेहूं)</span>
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          98% Match
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-700 font-semibold">
                        <span>Predicted: 20.0 Qtl/Acre</span>
                        <span className="font-black text-stone-900">Actual: 20.4 Qtl/Acre</span>
                      </div>
                    </div>

                    {/* Kharif 2024 */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-black text-stone-900">
                        <span>Kharif 2024 (Soybean / सोयाबीन)</span>
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          96% Match
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-700 font-semibold">
                        <span>Predicted: 11.5 Qtl/Acre</span>
                        <span className="font-black text-stone-900">Actual: 10.9 Qtl/Acre</span>
                      </div>
                    </div>

                    {/* Rabi 2024 */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-black text-stone-900">
                        <span>Rabi 2024 (Mustard / सरसों)</span>
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          95% Match
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-700 font-semibold">
                        <span>Predicted: 8.8 Qtl/Acre</span>
                        <span className="font-black text-stone-900">Actual: 8.4 Qtl/Acre</span>
                      </div>
                    </div>

                    {/* Kharif 2023 */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-black text-stone-900">
                        <span>Kharif 2023 (Cotton / कपास)</span>
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          91% Match
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-700 font-semibold">
                        <span>Predicted: 13.8 Qtl/Acre</span>
                        <span className="font-black text-stone-900">Actual: 12.5 Qtl/Acre</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 10. AI ASSISTANT INTEGRATION — SUGGESTED PROMPTS */}
            <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 p-4 rounded-3xl border border-emerald-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-emerald-700" />
                  <h4 className="text-sm font-black text-stone-900">
                    {isHindi ? "एआई कृषि सलाहकार से पूछें" : "Ask AI About Your Yield Prediction"}
                  </h4>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                  {isHindi ? "वॉयस सपोर्ट" : "Voice AI"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  {
                    en: "Why is my yield estimate lower this season?",
                    hi: "इस सीज़न में मेरी उपज का अनुमान क्यों कम/ज्यादा है?",
                  },
                  {
                    en: "When should I expect to harvest?",
                    hi: "मुझे फसल की कटाई कब तक करनी चाहिए?",
                  },
                  {
                    en: "How can I improve my yield before harvest?",
                    hi: "कटाई से पहले उपज को 1-2 क्विंटल कैसे बढ़ाएं?",
                  },
                  {
                    en: "Is this a good yield compared to last year?",
                    hi: "क्या यह उपज पिछले वर्ष की तुलना में अच्छी है?",
                  },
                ].map((promptItem, idx) => {
                  const promptText = promptItem[currentLanguage] || promptItem.en;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        if (onOpenVoiceAssistantWithPrompt) {
                          onOpenVoiceAssistantWithPrompt(promptText, "yield_prediction");
                        }
                      }}
                      className="p-2.5 rounded-2xl bg-white hover:bg-emerald-100/60 border border-emerald-300 text-left text-xs font-bold text-stone-800 flex items-center justify-between gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer"
                    >
                      <span className="line-clamp-1">💬 {promptText}</span>
                      <ChevronRight size={14} className="text-emerald-700 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* FACTOR DETAIL MODAL / DRAWER */}
      {activeFactorDetail && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 border border-emerald-300 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">
                  {activeFactorDetail.id === "soil"
                    ? "🌱"
                    : activeFactorDetail.id === "weather"
                    ? "☀️"
                    : activeFactorDetail.id === "disease"
                    ? "🛡️"
                    : "🌾"}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900">
                    {activeFactorDetail.name[currentLanguage] || activeFactorDetail.name.en}
                  </h3>
                  <span className="text-xs font-bold text-emerald-700">
                    {activeFactorDetail.statusLabel[currentLanguage] ||
                      activeFactorDetail.statusLabel.en}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setActiveFactorDetail(null);
                }}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                {activeFactorDetail.detailTitle[currentLanguage] ||
                  activeFactorDetail.detailTitle.en}
              </span>
              <p className="text-xs font-semibold text-emerald-950 leading-relaxed">
                {activeFactorDetail.oneLiner[currentLanguage] || activeFactorDetail.oneLiner.en}
              </p>
            </div>

            {/* Bullet Points */}
            <div className="space-y-2">
              <span className="text-xs font-black text-stone-900 block">
                {isHindi ? "मुख्य अवलोकन व इनसाइट्स:" : "Key Observations & Measurements:"}
              </span>
              <ul className="space-y-2">
                {((activeFactorDetail.detailPoints &&
                  (activeFactorDetail.detailPoints[currentLanguage] ||
                    activeFactorDetail.detailPoints.en)) ||
                  []
                ).map((pt: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-medium text-stone-700">
                    <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-stone-200">
              <span className="text-xs font-bold text-stone-700">
                {isHindi ? "उपज पर प्रभाव:" : "Net Impact on Yield:"}
              </span>
              <span className="text-sm font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-xl">
                {activeFactorDetail.impactOnYield}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEffects.success();
                setActiveFactorDetail(null);
              }}
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              {t.common.done}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
