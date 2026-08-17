import { LanguageCode, UserRole } from "../types";

export interface HelplineItem {
  id: string;
  name: string;
  nameHi: string;
  number: string;
  displayNumber: string;
  operatingHours: string;
  operatingHoursHi: string;
  languagesSupported: string;
  languagesSupportedHi: string;
  description: string;
  descriptionHi: string;
  badge: string;
  badgeHi: string;
  isPrimary?: boolean;
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  iconName: string;
  tip?: string;
  tipHi?: string;
}

export interface GuideTopic {
  id: string;
  title: string;
  titleHi: string;
  shortDesc: string;
  shortDescHi: string;
  role: UserRole;
  category: string;
  iconName: string;
  estimatedMinutes: number;
  navigateAction: string;
  aiPrompt: string;
  aiPromptHi: string;
  steps: GuideStep[];
}

export interface FaqItem {
  id: string;
  category: "account" | "features" | "hardware" | "labour" | "general";
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
  roleScope?: UserRole[]; // If empty, applies to all
  tags: string[];
}

export interface CallbackRequest {
  id: string;
  name: string;
  phone: string;
  topic: string;
  preferredTime: string;
  notes?: string;
  timestamp: string;
  status: "pending" | "confirmed" | "completed";
}

export const HELPLINE_CONTACTS: HelplineItem[] = [
  {
    id: "kisan-call-centre",
    name: "Kisan Call Centre (KCC)",
    nameHi: "किसान कॉल सेंटर (केसीसी)",
    number: "18001801551",
    displayNumber: "1800-180-1551",
    operatingHours: "Available 6:00 AM – 10:00 PM, all days",
    operatingHoursHi: "सुबह 6:00 से रात 10:00 बजे तक, सभी दिन",
    languagesSupported: "Available in Hindi, English, Tamil, Telugu, Marathi, Punjabi, Bengali, Gujarati & Kannada",
    languagesSupportedHi: "हिंदी, अंग्रेजी, मराठी, पंजाबी, तमिल, तेलुगु, बंगाली व क्षेत्रीय भाषाओं में उपलब्ध",
    description: "Toll-free national helpline for immediate expert agricultural consultation, crop queries, pest advice, and government schemes.",
    descriptionHi: "राष्ट्रीय टोल-फ्री किसान हेल्पलाइन। फसल रोग, कीट प्रबंधन व सरकारी योजनाओं पर तुरंत विशेषज्ञ मार्गदर्शन प्राप्त करें।",
    badge: "Official Govt Line • Toll-Free",
    badgeHi: "सरकारी आधिकारिक लाइन • टोल-फ्री",
    isPrimary: true,
  },
  {
    id: "pm-fasal-bima",
    name: "PM Fasal Bima Yojana (PMFBY)",
    nameHi: "प्रधानमंत्री फसल बीमा योजना",
    number: "18002005142",
    displayNumber: "1800-200-5142",
    operatingHours: "Available 9:00 AM – 6:00 PM (Mon - Sat)",
    operatingHoursHi: "सुबह 9:00 से शाम 6:00 बजे तक (सोमवार - शनिवार)",
    languagesSupported: "Available in Hindi, English & all regional state languages",
    languagesSupportedHi: "हिंदी, अंग्रेजी व सभी राज्य भाषाओं में सहायता",
    description: "Assistance for crop damage reporting, unseasonal rain loss intimation, and insurance claim tracking.",
    descriptionHi: "बेमौसम बारिश, ओलावृष्टि व फसल नुकसान की सूचना एवं बीमा क्लेम सहायता।",
    badge: "Insurance & Claims",
    badgeHi: "फसल नुकसान व बीमा",
  },
  {
    id: "soil-fertilizer-desk",
    name: "Kisan Soil & Fertilizer Helpdesk",
    nameHi: "मृदा व उर्वरक विशेषज्ञ हेल्पलाइन",
    number: "1800110180",
    displayNumber: "1800-110-180",
    operatingHours: "Available 8:00 AM – 8:00 PM, all days",
    operatingHoursHi: "सुबह 8:00 से रात 8:00 बजे तक, सभी दिन",
    languagesSupported: "Hindi, English & State Languages",
    languagesSupportedHi: "हिंदी, अंग्रेजी व क्षेत्रीय भाषाएं",
    description: "Guidance on Soil Health Card, NPK ratios, nano urea application, and organic compost recipes.",
    descriptionHi: "मृदा स्वास्थ्य कार्ड, NPK खाद अनुपात, नैनो यूरिया व जैविक खाद की मात्रा पर परामर्श।",
    badge: "Soil & Nutrient Desk",
    badgeHi: "मृदा व खाद सलाह",
  },
];

export const WHATSAPP_SUPPORT = {
  phone: "9118001801551",
  displayNumber: "+91 1800 180 1551",
  defaultText: "Namaste AgriVision! I need assistance with my farm/app query. Please guide me.",
  defaultTextHi: "नमस्ते एग्रीविज़न! मुझे कृषि सलाह एवं ऐप उपयोग में सहायता चाहिए।",
};

export const SMS_SUPPORT = {
  number: "18001801551",
  defaultBody: "AGRI HELP: I need assistance with my farming crops/application.",
};

export const AI_GUIDES: GuideTopic[] = [
  // --- FARMER GUIDES ---
  {
    id: "farmer-disease-scan",
    title: "How to scan a crop for disease",
    titleHi: "फसल में बीमारी की पहचान (कैमरा स्कैन) कैसे करें",
    shortDesc: "Snap a photo of an infected leaf to get instant AI disease diagnosis and organic/chemical remedies.",
    shortDescHi: "पत्ते की फोटो खींचें और तुरंत रोग का नाम, जैविक व रासायनिक उपचार पाएं।",
    role: "farmer",
    category: "Crop Health",
    iconName: "Camera",
    estimatedMinutes: 2,
    navigateAction: "navigate_disease",
    aiPrompt: "How do I scan my crop leaf for disease diagnosis in AgriVision?",
    aiPromptHi: "एग्रीविज़न में फसल की बीमारी पहचानने के लिए पत्ता कैसे स्कैन करें?",
    steps: [
      {
        stepNumber: 1,
        title: "Tap the Disease Camera button",
        titleHi: "नीचे 'रोग पहचान (कैमरा)' पर टैप करें",
        description: "Open the camera from the bottom navigation or tap 'Scan Crop' on your farmer dashboard.",
        descriptionHi: "नीचे दिए गए कैमरा आइकन या मुख्य डैशबोर्ड पर 'फसल स्कैन करें' बटन दबाएं।",
        iconName: "Camera",
      },
      {
        stepNumber: 2,
        title: "Take a clear leaf photo in good light",
        titleHi: "अच्छी रोशनी में पत्ते की स्पष्ट फोटो खींचें",
        description: "Focus on the spots, yellowing, or damaged leaf area. Hold the phone steady 15–20 cm away.",
        descriptionHi: "धब्बे या रोगग्रस्त हिस्से पर कैमरा केंद्रित रखें। फोन को 15-20 सेमी की दूरी पर स्थिर रखें।",
        iconName: "Maximize2",
        tip: "Avoid harsh glare or blurry movement for >95% diagnosis accuracy.",
        tipHi: "धूप की सीधी चमक से बचें ताकि एआई सटीक पहचान कर सके।",
      },
      {
        stepNumber: 3,
        title: "View Diagnosis & Treatment Plan",
        titleHi: "रोग की पहचान व उपचार तालिका देखें",
        description: "The AI identifies the exact pathogen, severity score, organic home remedies, and chemical spray dosages.",
        descriptionHi: "एआई तुरंत रोग का सटीक नाम, गंभीरता और नीम का तेल/फफूंदनाशक की सही मात्रा बताता है।",
        iconName: "CheckCircle",
      },
      {
        stepNumber: 4,
        title: "Listen to Voice Summary & Save",
        titleHi: "आवाज़ में सुनें और नुस्खा सहेजें",
        description: "Tap the speaker icon to hear the remedy in your native language, and save it to your farm logs.",
        descriptionHi: "स्पीकर बटन दबाकर अपनी भाषा में उपचार सुनें और इसे रिकॉर्ड में सहेज लें।",
        iconName: "Volume2",
      },
    ],
  },
  {
    id: "farmer-risk-score",
    title: "How to check my Farm Risk Score",
    titleHi: "खेत का जोखिम स्कोर (Farm Risk Score) कैसे देखें",
    shortDesc: "Understand your composite risk index based on weather, pest outbreaks, soil moisture, and market price dips.",
    shortDescHi: "मौसम, कीट प्रकोप, मिट्टी की नमी व मंडी भाव के आधार पर खेत की सुरक्षा जांचें।",
    role: "farmer",
    category: "Farm Protection",
    iconName: "ShieldAlert",
    estimatedMinutes: 2,
    navigateAction: "navigate_weather",
    aiPrompt: "Explain how my Farm Risk Score is calculated and how to lower it.",
    aiPromptHi: "मेरा फार्म रिस्क स्कोर कैसे बनता है और इसे कम कैसे करें?",
    steps: [
      {
        stepNumber: 1,
        title: "Check the Top Risk Gauge",
        titleHi: "डैशबोर्ड पर मुख्य रिस्क मीटर देखें",
        description: "Your dashboard shows a 0–100 Farm Risk Score (0–30 Low, 31–60 Moderate, 61+ High Risk).",
        descriptionHi: "मुख्य स्क्रीन पर 0 से 100 के बीच स्कोर दिखता है। 30 से कम सुरक्षित और 60 से ऊपर चेतावनी है।",
        iconName: "Activity",
      },
      {
        stepNumber: 2,
        title: "Review Active Threat Factors",
        titleHi: "सक्रिय खतरे और मौसम की चेतावनी जांचें",
        description: "See specific threat cards like 'Heavy Rain Alert', 'Yellow Rust Nearby', or 'Dry Soil Stress'.",
        descriptionHi: "नीचे 'भारी बारिश', 'कीट प्रकोप' या 'कम नमी' जैसे चेतावनी कार्ड पर ध्यान दें।",
        iconName: "AlertTriangle",
      },
      {
        stepNumber: 3,
        title: "Complete Priority Actions",
        titleHi: "दिए गए जरूरी कृषि कार्य पूरे करें",
        description: "Follow the recommended preventive actions (e.g., clear drainage channels, apply protective spray).",
        descriptionHi: "सुझाए गए कार्य (जैसे जल निकासी नालियां बनाना, छिड़काव करना) पूरे करके चेकबॉक्स दबाएं।",
        iconName: "CheckSquare",
        tip: "Completing priority tasks dynamically lowers your farm's risk score.",
        tipHi: "कार्य पूरा करने पर आपका जोखिम स्कोर तुरंत घट जाता है।",
      },
    ],
  },
  {
    id: "farmer-iot-sensor",
    title: "How to connect a soil sensor",
    titleHi: "मिट्टी नमी व pH सेंसर (IoT Kit) कैसे जोड़ें",
    shortDesc: "Pair your wireless capacitive soil probe to monitor live root moisture, temperature, and automated irrigation.",
    shortDescHi: "वायरलेस मिट्टी सेंसर जोड़कर वास्तविक समय की नमी देखें और ऑटो-मोटर चालू करें।",
    role: "farmer",
    category: "Smart Hardware",
    iconName: "Cpu",
    estimatedMinutes: 3,
    navigateAction: "navigate_iot",
    aiPrompt: "How do I pair and configure my AgriVision IoT soil moisture sensor kit?",
    aiPromptHi: "एग्रीविज़न मिट्टी नमी सेंसर किट को कैसे कनेक्ट और सेट करें?",
    steps: [
      {
        stepNumber: 1,
        title: "Insert Sensor Probe in Root Zone",
        titleHi: "सेंसर रॉड को पौधे की जड़ के पास मिट्टी में गाड़ें",
        description: "Push the stainless steel/capacitive probe 15 cm deep into the soil where crop roots absorb water.",
        descriptionHi: "सेंसर की रॉड को पौधे की जड़ के पास 15 सेमी गहराई में सीधी मिट्टी में लगाएं।",
        iconName: "CornerDownRight",
      },
      {
        stepNumber: 2,
        title: "Switch on Device & Go to IoT Tab",
        titleHi: "डिवाइस ऑन करें और 'स्मार्ट सेंसर' टैब खोलें",
        description: "Power on the solar/battery unit. In the app, navigate to the 'IoT Sensors' section.",
        descriptionHi: "डिवाइस का बटन ऑन करें और ऐप में 'स्मार्ट सेंसर' टैब पर जाएं।",
        iconName: "Zap",
      },
      {
        stepNumber: 3,
        title: "Pair Device ID / Scan QR",
        titleHi: "डिवाइस आईडी दर्ज करें या क्यूआर स्कैन करें",
        description: "Tap 'Pair New Sensor' and enter the 6-digit Device ID printed on the sensor box.",
        descriptionHi: "'नया सेंसर जोड़ें' दबाकर बॉक्स पर लिखी 6 अंकों की डिवाइस आईडी दर्ज करें।",
        iconName: "QrCode",
      },
      {
        stepNumber: 4,
        title: "Enable Auto-Irrigation Threshold",
        titleHi: "ऑटो-सिंचाई और नमी सीमा तय करें",
        description: "Set your target moisture level (e.g. 35%). The water motor pump will turn on automatically when soil dries.",
        descriptionHi: "न्यूनतम नमी (जैसे 35%) सेट करें। मिट्टी सूखते ही मोटर अपने आप चालू हो जाएगी।",
        iconName: "Droplets",
      },
    ],
  },
  {
    id: "farmer-fertilizer",
    title: "How to get a fertilizer recommendation",
    titleHi: "खाद व पोषण की सटीक मात्रा (Fertilizer Schedule) कैसे पाएं",
    shortDesc: "Calculate balanced NPK dosage, micro-nutrients, and application stages tailored to your crop and land size.",
    shortDescHi: "अपनी फसल व जमीन के अनुसार यूरिया, डीएपी, पोटाश व जिंक की सटीक खुराक जानें।",
    role: "farmer",
    category: "Nutrient Management",
    iconName: "Sprout",
    estimatedMinutes: 2,
    navigateAction: "navigate_fertilizer",
    aiPrompt: "How to generate a custom fertilizer calculation for my crop?",
    aiPromptHi: "अपनी फसल के लिए खाद की मात्रा कैसे निकालें?",
    steps: [
      {
        stepNumber: 1,
        title: "Select your Crop & Growth Stage",
        titleHi: "अपनी फसल व विकास अवस्था चुनें",
        description: "Choose Wheat, Paddy, Cotton, Mustard, etc., and specify vegetative, flowering, or grain filling stage.",
        descriptionHi: "गेहूं, धान, कपास आदि में से फसल चुनें और बुवाई, बढ़वार या फूल आने की अवस्था बताएं।",
        iconName: "Layers",
      },
      {
        stepNumber: 2,
        title: "Enter Land Area & Soil Type",
        titleHi: "जमीन का रकबा (एकड़/बीघा) व मिट्टी प्रकार भरें",
        description: "Enter your acreage (e.g., 2.5 Acres) and specify Black, Alluvial, Red, or Sandy Loam soil.",
        descriptionHi: "खेत का क्षेत्रफल और काली, दोमट या रेतीली मिट्टी का प्रकार चुनें।",
        iconName: "MapPin",
      },
      {
        stepNumber: 3,
        title: "Get Split Dosage & Schedule",
        titleHi: "किस्तों में खाद देने की समय सारिणी पाएं",
        description: "View exact bags of Urea, DAP, MOP, Zinc Sulphate, plus bio-fertilizers and organic alternatives.",
        descriptionHi: "यूरिया, डीएपी, पोटाश की बोरी संख्या और कब-कब डालना है, इसका पूरा कैलेंडर देखें।",
        iconName: "Calendar",
      },
    ],
  },
  {
    id: "farmer-hire-labour",
    title: "How to hire farm labour",
    titleHi: "खेत के लिए मजदूर कैसे बुलाएं (Hire Farm Labour)",
    shortDesc: "Post a job with daily wage, required workers, and crop activity to instantly alert nearby agricultural workers.",
    shortDescHi: "मजदूरी दर और आवश्यक संख्या डालकर काम पोस्ट करें, आसपास के मजदूरों को तुरंत सूचना पहुंचेगी।",
    role: "farmer",
    category: "Labour",
    iconName: "Users",
    estimatedMinutes: 2,
    navigateAction: "navigate_hire_labour",
    aiPrompt: "How do I post a farm labour job to hire workers nearby?",
    aiPromptHi: "खेत में काम के लिए मजदूर बुलाने का काम कैसे पोस्ट करें?",
    steps: [
      {
        stepNumber: 1,
        title: "Tap 'Hire Labour' on Dashboard",
        titleHi: "डैशबोर्ड पर 'मजदूर बुलाएं' बटन दबाएं",
        description: "Open the Labour module from your home screen or quick actions banner.",
        descriptionHi: "मुख्य स्क्रीन पर 'मजदूर बुलाएं' विकल्प पर टैप करें।",
        iconName: "UserPlus",
      },
      {
        stepNumber: 2,
        title: "Set Work Details & Daily Wage",
        titleHi: "काम का प्रकार, संख्या व दैनिक मजदूरी तय करें",
        description: "Specify task (e.g. Cotton Picking, Weeding, Spraying), number of workers needed, and daily pay rate (₹/day).",
        descriptionHi: "काम (निराई, कटाई, छिड़काव), मजदूरों की संख्या और प्रति दिन मजदूरी (₹) दर्ज करें।",
        iconName: "DollarSign",
      },
      {
        stepNumber: 3,
        title: "Broadcast to Nearby Workers",
        titleHi: "आसपास के श्रमिकों को काम भेजें",
        description: "Publish your request. Workers in your village and neighbouring panchayats will receive instant phone alerts.",
        descriptionHi: "काम सबमिट करें। गांव व नजदीकी क्षेत्रों के श्रमिकों को तुरंत एसएमएस/ऐप नोटिफिकेशन मिलेगा।",
        iconName: "Radio",
      },
    ],
  },
  {
    id: "farmer-mandi-prices",
    title: "How to check mandi prices",
    titleHi: "मंडी के ताज़ा भाव (Mandi Prices) कैसे देखें",
    shortDesc: "Compare live commodity rates, MSP benchmarks, and price trends across APMC markets near your location.",
    shortDescHi: "नजदीकी APMC मंडियों में फसलों के आज के भाव, न्यूनतम समर्थन मूल्य और रुझान देखें।",
    role: "farmer",
    category: "Markets",
    iconName: "TrendingUp",
    estimatedMinutes: 2,
    navigateAction: "navigate_mandi",
    aiPrompt: "How can I check live APMC mandi prices and compare nearby market rates?",
    aiPromptHi: "ताज़ा मंडी भाव और नजदीकी मंडियों की तुलना कैसे करें?",
    steps: [
      {
        stepNumber: 1,
        title: "Go to Mandi Prices Tab",
        titleHi: "नीचे 'मंडी भाव' टैब पर जाएं",
        description: "Tap the 'Mandi Prices' icon on the navigation bar to view real-time e-NAM & Agmarknet market data.",
        descriptionHi: "नेविगेशन बार पर 'मंडी भाव' आइकन पर क्लिक करें।",
        iconName: "Store",
      },
      {
        stepNumber: 2,
        title: "Filter by Crop & District",
        titleHi: "फसल और जिले के अनुसार खोजें",
        description: "Select your crop (e.g., Soybean, Wheat, Onion) to compare min, max, and modal trading prices.",
        descriptionHi: "अपनी फसल चुनें और विभिन्न मंडियों के न्यूनतम, अधिकतम व मॉडल भाव की तुलना करें।",
        iconName: "Filter",
      },
      {
        stepNumber: 3,
        title: "Track Price Trends & Best Time to Sell",
        titleHi: "मूल्य रुझान और बेचने का सही समय समझें",
        description: "View weekly upward/downward price signals to make profitable selling decisions.",
        descriptionHi: "भाव बढ़ने या घटने का अनुमान देखकर सही समय पर उपज बेचने का निर्णय लें।",
        iconName: "BarChart3",
      },
    ],
  },

  // --- HOME GARDENER GUIDES ---
  {
    id: "gardener-add-plant",
    title: "How to add a plant",
    titleHi: "बगीचे में नया पौधा (Add Plant) कैसे जोड़ें",
    shortDesc: "Add indoor, balcony, or terrace garden plants to receive custom sunlight, soil, and watering care schedules.",
    shortDescHi: "अपने गमले या बालकनी के पौधे जोड़ें और धूप, खाद व पानी देने का शेड्यूल पाएं।",
    role: "gardener",
    category: "My Garden",
    iconName: "PlusCircle",
    estimatedMinutes: 2,
    navigateAction: "navigate_add_plant",
    aiPrompt: "How do I add a new plant and set up its care schedule in home garden mode?",
    aiPromptHi: "होम गार्डनर मोड में नया पौधा कैसे जोड़ें और उसकी देखभाल कैसे शुरू करें?",
    steps: [
      {
        stepNumber: 1,
        title: "Tap '+ Add Plant' on Garden Home",
        titleHi: "गार्डन स्क्रीन पर '+ नया पौधा जोड़ें' दबाएं",
        description: "Click the add plant button on your Home Garden dashboard.",
        descriptionHi: "होम स्क्रीन पर दिए गए हरे रंग के '+ नया पौधा जोड़ें' बटन पर क्लिक करें।",
        iconName: "Plus",
      },
      {
        stepNumber: 2,
        title: "Choose Plant Species & Pot Location",
        titleHi: "पौधे की प्रजाति और स्थान (बालकनी/गमला) चुनें",
        description: "Select from popular varieties (Tomato, Money Plant, Rose, Tulsi, Chillies) or type a custom plant name.",
        descriptionHi: "टमाटर, गुलाब, तुलसी, मनी प्लांट आदि में से चुनें या अपना नाम लिखें।",
        iconName: "Sun",
      },
      {
        stepNumber: 3,
        title: "Get Personalized Care Guide",
        titleHi: "दैनिक देखभाल व पोषण गाइड पाएं",
        description: "AgriVision sets up optimal watering frequency, soil moisture tips, and homemade organic fertilizer tips.",
        descriptionHi: "ऐप अपने आप पानी देने का समय, जैविक खाद और छंटाई के सुझाव सेट कर देता है।",
        iconName: "Heart",
      },
    ],
  },
  {
    id: "gardener-scan-plant",
    title: "How to scan my plant for problems",
    titleHi: "पौधे की बीमारी या कीट (Plant Doctor) कैसे स्कैन करें",
    shortDesc: "Diagnose yellow leaves, curling, bugs, or fungus on your home plants with instant organic kitchen solutions.",
    shortDescHi: "घर के पौधों में पीली पत्तियां, कीड़े या फंगस की पहचान करें और आसान घरेलू उपाय पाएं।",
    role: "gardener",
    category: "Plant Doctor",
    iconName: "Sparkles",
    estimatedMinutes: 2,
    navigateAction: "navigate_disease",
    aiPrompt: "How can I diagnose leaf issues on my home potted plants using the Plant Doctor camera?",
    aiPromptHi: "प्लांट डॉक्टर कैमरा से गमले के पौधे की बीमारी कैसे पहचानें?",
    steps: [
      {
        stepNumber: 1,
        title: "Open Plant Doctor Camera",
        titleHi: "प्लांट डॉक्टर कैमरा खोलें",
        description: "Tap the Plant Doctor button on your gardener dashboard or camera tab.",
        descriptionHi: "डैशबोर्ड पर 'प्लांट डॉक्टर' या नीचे कैमरा आइकन पर टैप करें।",
        iconName: "Camera",
      },
      {
        stepNumber: 2,
        title: "Capture Affected Leaf or Stem",
        titleHi: "प्रभावित पत्ती या तने की साफ फोटो लें",
        description: "Ensure the camera is focused on the yellowing, spots, or insects.",
        descriptionHi: "पीले पत्तों या कीड़ों पर कैमरा फोकस करके स्पष्ट फोटो खींचें।",
        iconName: "Crosshair",
      },
      {
        stepNumber: 3,
        title: "Apply Safe Kitchen & Organic Remedies",
        titleHi: "घरेलू व सुरक्षित जैविक उपाय अपनाएं",
        description: "Get gentle organic solutions like neem oil spray, cinnamon powder, mild soap wash, or vermicompost tea.",
        descriptionHi: "नीम तेल स्प्रे, हल्दी पानी, दालचीनी या वर्मीकम्पोस्ट जैसे सुरक्षित उपाय देखें।",
        iconName: "Check",
      },
    ],
  },
  {
    id: "gardener-water-reminders",
    title: "How to set watering reminders",
    titleHi: "पानी देने का शेड्यूल व मौसम अलर्ट कैसे सेट करें",
    shortDesc: "Automate smart watering notifications that automatically adjust when rainfall or high humidity is detected.",
    shortDescHi: "बारिश व धूप के अनुसार पौधे को पानी देने के स्मार्ट नोटिफिकेशन सेट करें।",
    role: "gardener",
    category: "Watering",
    iconName: "Droplet",
    estimatedMinutes: 1,
    navigateAction: "navigate_water_reminders",
    aiPrompt: "How do smart watering reminders work for home plants in AgriVision?",
    aiPromptHi: "होम गार्डनिंग में स्मार्ट वाटरिंग रिमाइंडर कैसे काम करते हैं?",
    steps: [
      {
        stepNumber: 1,
        title: "Open Watering & Weather Section",
        titleHi: "पानी व मौसम गाइड टैब खोलें",
        description: "Tap 'Watering' on the bottom bar to view moisture status across all your plants.",
        descriptionHi: "नीचे 'पानी व मौसम' टैब पर जाएं और सभी पौधों की नमी स्थिति देखें।",
        iconName: "CloudRain",
      },
      {
        stepNumber: 2,
        title: "Log Watering with 1-Tap",
        titleHi: "एक टैप में पानी देना दर्ज करें",
        description: "Tap 'Mark Watered' after giving water. The app resets the timer based on the plant's root depth.",
        descriptionHi: "पानी देने के बाद 'पानी दिया' पर क्लिक करें। ऐप अगला समय तय कर देगा।",
        iconName: "CheckCircle2",
      },
      {
        stepNumber: 3,
        title: "Rain Skip Protection",
        titleHi: "बारिश के दिनों में ऑटो-स्किप सुरक्षा",
        description: "If rain is forecast in your city, the app sends a reminder to skip watering outdoor balcony pots.",
        descriptionHi: "बारिश होने पर ऐप खुद आपको बालकनी के पौधों में पानी न देने की सलाह देता है।",
        iconName: "Shield",
      },
    ],
  },

  // --- FARM LABOUR GUIDES ---
  {
    id: "labour-find-jobs",
    title: "How to find jobs near me",
    titleHi: "नजदीकी कृषि काम (Find Farm Jobs) कैसे खोजें",
    shortDesc: "Browse available farm tasks in your village and nearby panchayats filtered by daily wage and crop type.",
    shortDescHi: "अपने गांव व आसपास के खेतों में मजदूरी काम, दैनिक वेतन और फसल प्रकार के अनुसार खोजें।",
    role: "labour",
    category: "Work Feed",
    iconName: "Briefcase",
    estimatedMinutes: 2,
    navigateAction: "navigate_job_feed",
    aiPrompt: "How can agricultural workers search and filter local farm job listings?",
    aiPromptHi: "कृषि श्रमिक अपने आसपास के काम कैसे ढूंढ और देख सकते हैं?",
    steps: [
      {
        stepNumber: 1,
        title: "Open Farm Jobs Feed",
        titleHi: "मजदूरी काम सूची (Jobs Feed) खोलें",
        description: "Your main dashboard shows verified openings posted by local farmers seeking workers.",
        descriptionHi: "मुख्य स्क्रीन पर स्थानीय किसानों द्वारा पोस्ट किए गए सभी काम दिखाई देते हैं।",
        iconName: "List",
      },
      {
        stepNumber: 2,
        title: "Filter by Daily Wage or Crop",
        titleHi: "दैनिक मजदूरी या फसल के अनुसार छांटें",
        description: "Use quick filter pills (e.g. ₹500+/day, Harvesting, Cotton Picking, Within 5 km).",
        descriptionHi: "फिल्टर बटन (जैसे ₹500+/दिन, कपास तुड़ाई, 5 किमी के अंदर) का उपयोग करें।",
        iconName: "SlidersHorizontal",
      },
      {
        stepNumber: 3,
        title: "View Farm Location & Requirements",
        titleHi: "खेत का स्थान, तारीख व कार्य विवरण देखें",
        description: "Check the exact village, required days, meal/transport provisions, and total workers needed.",
        descriptionHi: "गांव का नाम, काम के दिन, चाय-नाश्ता सुविधा और कुल आवश्यक मजदूर देखें।",
        iconName: "MapPin",
      },
    ],
  },
  {
    id: "labour-apply-job",
    title: "How to apply for a job",
    titleHi: "काम के लिए आवेदन (Apply for Job) कैसे करें",
    shortDesc: "Apply with a single tap or directly call the farm owner to confirm your work dates and daily wage.",
    shortDescHi: "एक टैप में आवेदन करें या सीधे किसान को फोन लगाकर काम पक्का करें।",
    role: "labour",
    category: "Job Application",
    iconName: "Send",
    estimatedMinutes: 1,
    navigateAction: "navigate_job_feed",
    aiPrompt: "How do I apply for a job or contact the farm owner in AgriVision Labour mode?",
    aiPromptHi: "काम के लिए आवेदन कैसे करें और किसान से फोन पर कैसे बात करें?",
    steps: [
      {
        stepNumber: 1,
        title: "Tap 'Apply Now' on Job Card",
        titleHi: "काम कार्ड पर 'आवेदन करें' दबाएं",
        description: "Click the green 'Apply' button. Your verified profile with phone number is sent to the farmer.",
        descriptionHi: "हरे रंग का 'आवेदन करें' बटन दबाएं। आपका नाम व फोन नंबर किसान के पास पहुंच जाएगा।",
        iconName: "CheckCircle",
      },
      {
        stepNumber: 2,
        title: "Call Farmer Directly (One-Tap)",
        titleHi: "किसान को सीधे कॉल करें",
        description: "Tap the phone call icon to speak with the farm owner directly to confirm reporting time and address.",
        descriptionHi: "फोन आइकन दबाकर सीधे किसान से बात करें और पहुंचने का समय व स्थान पक्का करें।",
        iconName: "PhoneCall",
      },
      {
        stepNumber: 3,
        title: "Track Status in 'Applied' Tab",
        titleHi: "'स्वीकृत/आवेदन' टैब में स्थिति देखें",
        description: "View all your active applications, accepted jobs, and past payment logs in one place.",
        descriptionHi: "अपने सभी चालू आवेदन और स्वीकृत काम 'आवेदन' टैब में देखें।",
        iconName: "Clock",
      },
    ],
  },
  {
    id: "labour-update-profile",
    title: "How to update my profile and skills",
    titleHi: "अपनी प्रोफाइल, कौशल व दैनिक मजदूरी दर कैसे बदलें",
    shortDesc: "Add harvesting, tractor driving, or spraying skills and set your daily wage to get higher-paying job invites.",
    shortDescHi: "कटाई, ट्रैक्टर चालन या स्प्रे कौशल जोड़ें और दैनिक मजदूरी दर अपडेट करें।",
    role: "labour",
    category: "Skills & Wage",
    iconName: "UserCheck",
    estimatedMinutes: 2,
    navigateAction: "navigate_skills",
    aiPrompt: "How can a farm labourer update their work skills, availability, and wage rate?",
    aiPromptHi: "श्रमिक अपनी प्रोफाइल में कौशल और मजदूरी दर कैसे अपडेट करें?",
    steps: [
      {
        stepNumber: 1,
        title: "Navigate to Skills & Profile Tab",
        titleHi: "'कौशल व प्रोफाइल' टैब पर जाएं",
        description: "Tap the 'Skills' icon on the bottom navigation bar.",
        descriptionHi: "नीचे नेविगेशन बार पर 'कौशल' विकल्प पर क्लिक करें।",
        iconName: "Award",
      },
      {
        stepNumber: 2,
        title: "Toggle Work Availability & Daily Wage",
        titleHi: "काम के लिए उपलब्धता और मजदूरी दर सेट करें",
        description: "Turn on 'Available for Work' switch and update your preferred daily wage rate (e.g. ₹550/day).",
        descriptionHi: "'काम के लिए उपलब्ध' चालू करें और अपनी दैनिक मजदूरी दर (जैसे ₹550/दिन) भरें।",
        iconName: "ToggleRight",
      },
      {
        stepNumber: 3,
        title: "Select Agricultural Skills",
        titleHi: "अपने कृषि कौशल (Skills) चुनें",
        description: "Select skills like Tractor Operation, Chemical Spraying, Sugarcane Cutting, Sowing, or Weeding.",
        descriptionHi: "ट्रैक्टर चलाना, दवा छिड़काव, गन्ना कटाई, बुवाई या निराई जैसे कौशल चुनें।",
        iconName: "CheckSquare",
      },
    ],
  },

  // --- FPO MANAGER GUIDES ---
  {
    id: "fpo-add-members",
    title: "How to add members",
    titleHi: "एफपीओ में नए किसान सदस्य (Add Members) कैसे जोड़ें",
    shortDesc: "Register cooperative farmer members, log their land size, primary crops, and assign smart IoT soil kits.",
    shortDescHi: "सहकारी संस्था में किसान सदस्य जोड़ें, उनकी जमीन, फसल और IoT किट दर्ज करें।",
    role: "fpo",
    category: "Member Registry",
    iconName: "UserPlus",
    estimatedMinutes: 2,
    navigateAction: "navigate_members",
    aiPrompt: "How does an FPO administrator add and manage farmer members in AgriVision?",
    aiPromptHi: "FPO प्रबंधक नए किसान सदस्यों को कैसे जोड़ और प्रबंधित कर सकते हैं?",
    steps: [
      {
        stepNumber: 1,
        title: "Open Member Directory",
        titleHi: "सदस्य सूची (Members) टैब खोलें",
        description: "Navigate to the 'Members' tab on your FPO management dashboard.",
        descriptionHi: "FPO डैशबोर्ड पर 'सदस्य' टैब पर क्लिक करें।",
        iconName: "Users",
      },
      {
        stepNumber: 2,
        title: "Tap '+ Add Farmer Member'",
        titleHi: "'+ नया सदस्य जोड़ें' बटन दबाएं",
        description: "Click the add member button to open the member enrollment form.",
        descriptionHi: "नया सदस्य जोड़ने का फॉर्म खोलने के लिए ऊपर दिए बटन पर क्लिक करें।",
        iconName: "PlusCircle",
      },
      {
        stepNumber: 3,
        title: "Enter Farmer Details & Land Size",
        titleHi: "किसान का नाम, फोन नंबर व जमीन का रकबा भरें",
        description: "Fill name, mobile number, village, acreage, primary crop, and PM-Kisan verification status.",
        descriptionHi: "किसान का नाम, मोबाइल, गांव, एकड़ में जमीन और मुख्य फसल दर्ज करें।",
        iconName: "FileText",
      },
      {
        stepNumber: 4,
        title: "Assign IoT Kit & Save",
        titleHi: "IoT सेंसर किट लिंक करें और सहेजें",
        description: "Optionally assign a soil sensor kit ID to track their field moisture centrally in the cluster map.",
        descriptionHi: "यदि उपलब्ध हो तो मिट्टी सेंसर किट लिंक करें ताकि क्लस्टर में नमी की निगरानी हो सके।",
        iconName: "Cpu",
      },
    ],
  },
  {
    id: "fpo-broadcast-alert",
    title: "How to send a broadcast alert",
    titleHi: "सभी किसान सदस्यों को सामूहिक सूचना (Broadcast Alert) कैसे भेजें",
    shortDesc: "Send urgent pest warnings, weather advisories, or procurement price notices via SMS & WhatsApp in 1 click.",
    shortDescHi: "कीट चेतावनी, मौसम अलर्ट या मंडी खरीद सूचना एक क्लिक में सभी किसानों को एसएमएस से भेजें।",
    role: "fpo",
    category: "Communication",
    iconName: "Megaphone",
    estimatedMinutes: 2,
    navigateAction: "navigate_broadcast",
    aiPrompt: "How can FPO managers send cluster-wide weather or pest broadcast alerts to members?",
    aiPromptHi: "FPO प्रबंधक अपने सदस्यों को मौसम व कीट अलर्ट का ब्रॉडकास्ट संदेश कैसे भेजें?",
    steps: [
      {
        stepNumber: 1,
        title: "Go to Broadcast Alerts Tab",
        titleHi: "'ब्रॉडकास्ट संदेश' टैब पर जाएं",
        description: "Open the communication center from the FPO navigation bar.",
        descriptionHi: "FPO नेविगेशन बार से 'ब्रॉडकास्ट' टैब पर जाएं।",
        iconName: "Radio",
      },
      {
        stepNumber: 2,
        title: "Choose Target Audience & Channel",
        titleHi: "लक्षित किसान समूह और माध्यम (SMS/WhatsApp) चुनें",
        description: "Select all members, specific crop growers (e.g. Cotton farmers), or specific villages.",
        descriptionHi: "सभी किसान, केवल कपास उगाने वाले या किसी खास गांव के सदस्यों को चुनें।",
        iconName: "Target",
      },
      {
        stepNumber: 3,
        title: "Compose Advisory Message",
        titleHi: "संदेश लिखें या एआई टेम्पलेट चुनें",
        description: "Type your announcement or select ready-made government advisories for instant translation.",
        descriptionHi: "अपना संदेश लिखें या तैयार एआई कृषि सलाह टेम्पलेट में से चुनें।",
        iconName: "Edit3",
      },
      {
        stepNumber: 4,
        title: "Tap Send Broadcast",
        titleHi: "'ब्रॉडकास्ट भेजें' पर क्लिक करें",
        description: "Dispatch the notification immediately. Track real-time delivery status and recipient count.",
        descriptionHi: "संदेश तुरंत भेजें और कितनों को डिलीवर हुआ, इसकी रीयल-टाइम रिपोर्ट देखें।",
        iconName: "Send",
      },
    ],
  },
  {
    id: "fpo-generate-report",
    title: "How to generate a report",
    titleHi: "सामूहिक उत्पादन व इनपुट मांग रिपोर्ट (Reports) कैसे बनाएं",
    shortDesc: "Export aggregate harvest forecasts, bulk fertilizer demand, and subsidy compliance reports for government filing.",
    shortDescHi: "कुल पैदावार अनुमान, थोक खाद मांग और सरकारी सब्सिडी रिपोर्ट एक्सेल/पीडीएफ में निकालें।",
    role: "fpo",
    category: "Analytics & Reports",
    iconName: "FileSpreadsheet",
    estimatedMinutes: 2,
    navigateAction: "navigate_reports",
    aiPrompt: "How do I generate and export cluster harvest and bulk input demand reports for FPOs?",
    aiPromptHi: "FPO के लिए सामूहिक फसल उत्पादन और थोक खाद मांग की रिपोर्ट कैसे बनाएं?",
    steps: [
      {
        stepNumber: 1,
        title: "Open Reports & Analytics Tab",
        titleHi: "'रिपोर्ट्स व एनालिटिक्स' टैब खोलें",
        description: "Click the 'Reports' icon in the FPO navigation menu.",
        descriptionHi: "FPO मेनू में 'रिपोर्ट्स' विकल्प पर क्लिक करें।",
        iconName: "PieChart",
      },
      {
        stepNumber: 2,
        title: "Select Report Category",
        titleHi: "रिपोर्ट का प्रकार चुनें",
        description: "Choose from Aggregate Crop Yield Forecast, Bulk Fertilizer & Seed Demand, or Risk Assessment Audit.",
        descriptionHi: "कुल उत्पादन अनुमान, थोक खाद-बीज मांग या क्लस्टर जोखिम रिपोर्ट में से चुनें।",
        iconName: "FolderCheck",
      },
      {
        stepNumber: 3,
        title: "Filter by Season & Villages",
        titleHi: "सीजन (खरीफ/रबी) और गांव का चयन करें",
        description: "Refine data parameters by Kharif/Rabi cycle and active farmer clusters.",
        descriptionHi: "खरीफ/रबी सीजन और संबंधित क्लस्टर गांवों के अनुसार डेटा फिल्टर करें।",
        iconName: "Calendar",
      },
      {
        stepNumber: 4,
        title: "Download PDF / Share with NABARD",
        titleHi: "पीडीएफ डाउनलोड करें या साझा करें",
        description: "Export the official report format ready for submission to banks, NABARD, or state agriculture departments.",
        descriptionHi: "नाबार्ड या कृषि विभाग में जमा करने हेतु आधिकारिक प्रारूप में डाउनलोड करें।",
        iconName: "Download",
      },
    ],
  },
];

export const FAQS_DATA: FaqItem[] = [
  // --- ACCOUNT & LOGIN ---
  {
    id: "faq-account-1",
    category: "account",
    question: "I didn't receive my OTP, what do I do?",
    questionHi: "मुझे ओटीपी (OTP) प्राप्त नहीं हुआ, मुझे क्या करना चाहिए?",
    answer: "Check your mobile signal bar. Ensure your 10-digit number is correct without leading zeros. If SMS is delayed, tap 'Resend OTP' or choose 'Verify via Voice Call' after 30 seconds.",
    answerHi: "अपने मोबाइल का नेटवर्क चेक करें और सुनिश्चित करें कि 10 अंकों का फोन नंबर सही है। 30 सेकंड बाद 'पुनः ओटीपी भेजें' या 'वॉइस कॉल से सत्यापन' विकल्प पर टैप करें।",
    tags: ["otp", "login", "sms", "phone", "verification"],
  },
  {
    id: "faq-account-2",
    category: "account",
    question: "How do I change my language?",
    questionHi: "मैं ऐप की भाषा कैसे बदलूं?",
    answer: "Tap the Language icon (🌐) at the top of your screen anytime, or open Account Menu -> App Settings -> Language. AgriVision supports 9 Indian languages with instant full-screen voice translation.",
    answerHi: "स्क्रीन के ऊपर दाईं ओर भाषा आइकन (🌐) दबाएं, या खाता मेनू -> भाषा पर जाएं। आप हिंदी, अंग्रेजी, मराठी, तमिल, तेलुगु, पंजाबी सहित 9 भाषाओं में कभी भी बदल सकते हैं।",
    tags: ["language", "hindi", "telugu", "tamil", "punjabi", "marathi"],
  },
  {
    id: "faq-account-3",
    category: "account",
    question: "How do I switch my role (Farmer / Gardener / Labour / FPO)?",
    questionHi: "मैं अपनी भूमिका (किसान / होम गार्डनर / कृषि श्रमिक / FPO) कैसे बदलूं?",
    answer: "Tap your Role Badge in the top header or open Account Menu -> 'Switch Workspace Role'. You can change roles anytime without losing your registered farm data or saved jobs.",
    answerHi: "ऊपर हेडर में अपने रोल बैज पर टैप करें या खाता मेनू में 'रोल बदलें' चुनें। आप बिना कोई डेटा खोए कभी भी किसान, गार्डनर या श्रमिक मोड में स्विच कर सकते हैं।",
    tags: ["role", "farmer", "gardener", "labour", "fpo", "switch"],
  },

  // --- APP FEATURES ---
  {
    id: "faq-features-1",
    category: "features",
    question: "Why is my Farm Risk Score high?",
    questionHi: "मेरा फार्म रिस्क स्कोर (Farm Risk Score) अधिक क्यों है?",
    answer: "The risk score rises when weather forecasts indicate extreme heat or heavy unseasonal rain, soil moisture drops below 30%, or pest outbreaks are reported within 15 km of your village. Check the 'Priority Actions' list to complete preventive steps and lower your score.",
    answerHi: "रिस्क स्कोर तब बढ़ता है जब खराब मौसम का पूर्वानुमान हो, मिट्टी की नमी 30% से कम हो, या आसपास 15 किमी में कीट प्रकोप की सूचना हो। स्कोर घटाने के लिए 'जरूरी कार्य' पूरे करें।",
    roleScope: ["farmer", "fpo"],
    tags: ["risk", "score", "weather", "pest", "safety"],
  },
  {
    id: "faq-features-2",
    category: "features",
    question: "How accurate is the yield prediction?",
    questionHi: "फसल उत्पादन (Yield Prediction) का अनुमान कितना सटीक है?",
    answer: "Our yield models combine IMD satellite meteorological data, historical regional APMC harvest records, and live soil sensor data with approximately 92% calibrated field accuracy.",
    answerHi: "हमारा उत्पादन मॉडल मौसम उपग्रह डेटा, पिछले 10 वर्षों के APMC मंडी रिकॉर्ड और मिट्टी सेंसर डेटा को मिलाकर लगभग 92% सटीकता के साथ पैदावार का अनुमान लगाता है।",
    roleScope: ["farmer", "fpo"],
    tags: ["yield", "prediction", "accuracy", "harvest", "quintal"],
  },
  {
    id: "faq-features-3",
    category: "features",
    question: "Does the app work without internet?",
    questionHi: "क्या ऐप बिना इंटरनेट (ऑफ़लाइन) भी काम करता है?",
    answer: "Yes! Saved crop advisory sheets, fertilizer dosage schedules, emergency helpline numbers, and recent disease diagnoses remain fully available offline. Any new field records automatically sync once connectivity returns.",
    answerHi: "हाँ! सहेजी गई फसल गाइड, खाद तालिका, आपातकालीन हेल्पलाइन नंबर और हालिया रोग रिकॉर्ड बिना इंटरनेट के भी काम करते हैं। इंटरनेट आते ही नया डेटा अपने आप सिंक हो जाता है।",
    tags: ["offline", "internet", "sync", "network", "cache"],
  },

  // --- HARDWARE / SENSORS ---
  {
    id: "faq-hardware-1",
    category: "hardware",
    question: "How do I set up my soil sensor?",
    questionHi: "मिट्टी नमी व pH सेंसर (Soil Sensor) कैसे लगाएं?",
    answer: "Insert the waterproof capacitive sensor probe vertically 15 cm into your crop root zone. Switch on the solar-powered transmitter box and enter the 6-digit Device ID in the 'IoT Sensors' section of the app.",
    answerHi: "सेंसर की रॉड को पौधे की जड़ के पास 15 सेमी गहराई में सीधी मिट्टी में लगाएं। सोलर बॉक्स का स्विच ऑन करें और ऐप के 'स्मार्ट सेंसर' टैब में डिवाइस आईडी दर्ज करें।",
    roleScope: ["farmer", "fpo"],
    tags: ["sensor", "iot", "probe", "setup", "moisture"],
  },
  {
    id: "faq-hardware-2",
    category: "hardware",
    question: "Why is my sensor showing 'Offline'?",
    questionHi: "मेरा सेंसर 'ऑफ़लाइन (Offline)' क्यों दिखाई दे रहा है?",
    answer: "Ensure the solar panel on the sensor unit is clean and facing direct sunlight. Verify that the LoRa/SIM antenna is upright. If the issue persists, tap 'Re-sync Device' in the IoT tab or check battery health.",
    answerHi: "सुनिश्चित करें कि सोलर पैनल पर धूल न हो और धूप सीधी पड़ रही हो। एंटीना सीधा रखें। यदि समस्या बनी रहे, तो 'डिवाइस री-सिंक करें' बटन दबाएं।",
    roleScope: ["farmer", "fpo"],
    tags: ["offline", "sensor", "battery", "solar", "troubleshoot"],
  },
  {
    id: "faq-hardware-3",
    category: "hardware",
    question: "How much does the sensor kit cost?",
    questionHi: "स्मार्ट मिट्टी सेंसर किट की कीमत क्या है और सब्सिडी कैसे मिलेगी?",
    answer: "AgriVision IoT kits are eligible for 60% to 80% government subsidy under the PMKSY Precision Farming Scheme for small and marginal farmers. Contact your local FPO or Krishi Vigyan Kendra (KVK) to apply.",
    answerHi: "पीएम कृषि सिंचाई योजना (PMKSY) के तहत छोटे व सीमांत किसानों को स्मार्ट सेंसर किट पर 60% से 80% तक सरकारी सब्सिडी मिलती है। आवेदन हेतु अपने स्थानीय FPO या KVK केंद्र से संपर्क करें।",
    roleScope: ["farmer", "fpo"],
    tags: ["cost", "price", "subsidy", "pmksy", "kvk", "purchase"],
  },

  // --- LABOUR MARKETPLACE ---
  {
    id: "faq-labour-1",
    category: "labour",
    question: "How do I know a worker or farmer is trustworthy?",
    questionHi: "मुझे कैसे पता चलेगा कि कोई श्रमिक या किसान भरोसेमंद है?",
    answer: "Every profile on AgriVision is OTP-verified with phone numbers, village endorsements, completed job ratings, and trust badges. Both parties can review past work history before accepting a job.",
    answerHi: "एग्रीविज़न पर सभी उपयोगकर्ता फोन नंबर व ओटीपी से सत्यापित हैं। प्रोफाइल पर गांव का नाम, पूर्ण किए गए काम की स्टार रेटिंग और विश्वास बैज देखकर आप काम तय कर सकते हैं।",
    roleScope: ["farmer", "labour", "fpo"],
    tags: ["trust", "verified", "labour", "rating", "safety"],
  },
  {
    id: "faq-labour-2",
    category: "labour",
    question: "What if a job doesn't pay as promised?",
    questionHi: "यदि काम की तय मजदूरी नहीं मिलती तो क्या करें?",
    answer: "Daily wages agreed in the job post are recorded in the app logs. If there is a dispute, tap 'Report Issue' on the job card or call the Kisan Helpline for immediate local mediation and grievance logging.",
    answerHi: "काम की तय दर ऐप में दर्ज रहती है। विवाद की स्थिति में जॉब कार्ड पर 'समस्या दर्ज करें' दबाएं या किसान हेल्पलाइन पर शिकायत दर्ज कराएं।",
    roleScope: ["farmer", "labour", "fpo"],
    tags: ["payment", "wage", "dispute", "complaint", "helpline"],
  },

  // --- GENERAL ---
  {
    id: "faq-general-1",
    category: "general",
    question: "Is my farm data safe and private?",
    questionHi: "क्या मेरा कृषि डेटा और व्यक्तिगत जानकारी सुरक्षित है?",
    answer: "Yes. All your farm coordinates, field images, and phone numbers are encrypted under strict Digital Agriculture privacy protocols. Your personal data is never sold to third-party commercial advertisers.",
    answerHi: "हाँ! आपकी खेत की लोकेशन, फोटो और फोन नंबर पूरी तरह एन्क्रिप्टेड व सुरक्षित हैं। आपका निजी डेटा कभी किसी विज्ञापनदाता को नहीं बेचा जाता।",
    tags: ["privacy", "security", "data", "encryption", "safe"],
  },
  {
    id: "faq-general-2",
    category: "general",
    question: "Is the app free to use?",
    questionHi: "क्या यह ऐप पूरी तरह निःशुल्क (Free) है?",
    answer: "Yes! Core features including AI crop disease diagnosis, live weather advisories, APMC mandi rates, and the 24/7 AI Kisan Assistant are 100% free for all farmers, gardeners, and workers across India.",
    answerHi: "हाँ! फसल रोग पहचान, मौसम सलाह, मंडी भाव और 24/7 एआई किसान साथी जैसी सभी मुख्य सुविधाएं देश के सभी किसानों व श्रमिकों के लिए 100% मुफ्त हैं।",
    tags: ["free", "cost", "pricing", "charges", "subscription"],
  },
];

/**
 * Filter guides by user role with fallback to all guides
 */
export function getRoleGuides(role: UserRole): GuideTopic[] {
  const filtered = AI_GUIDES.filter((g) => g.role === role);
  return filtered.length > 0 ? filtered : AI_GUIDES;
}

/**
 * Filter FAQs by category, search query, and user role
 */
export function getFilteredFaqs(
  category: "all" | "account" | "features" | "hardware" | "labour" | "general",
  searchQuery: string,
  currentRole: UserRole
): FaqItem[] {
  let list = FAQS_DATA;

  // Filter by category if not 'all'
  if (category !== "all") {
    list = list.filter((item) => item.category === category);
  }

  // Filter by search query if present
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.questionHi.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.answerHi.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return list;
}
