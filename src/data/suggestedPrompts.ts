import { LanguageCode, UserRole } from "../types";

export interface PromptDefinition {
  id: string;
  role: UserRole;
  section: string;
  label: Partial<Record<LanguageCode, string>> & { en: string };
  answer: Partial<Record<LanguageCode, string>> & { en: string };
}

export const SUGGESTED_PROMPTS: PromptDefinition[] = [
  // =========================================================================
  // 1. FARMER ROLE
  // =========================================================================
  // Default prompts
  {
    id: "farmer_what_should_i_do_today",
    role: "farmer",
    section: "default",
    label: {
      en: "What should I do today?",
      hi: "मुझे आज क्या करना चाहिए?",
      te: "నేను ఈరోజు ఏమి చేయాలి?",
      ta: "இன்று நான் என்ன செய்ய வேண்டும்?",
    },
    answer: {
      en: "Water your Wheat field before 10 AM — soil moisture is at 38%, slightly below the ideal threshold. Weather is dry and sunny today, so this is a good time to irrigate.",
      hi: "सुबह 10 बजे से पहले अपने गेहूं के खेत में पानी दें — मिट्टी की नमी 38% है, जो आदर्श स्तर से थोड़ी कम है। आज मौसम शुष्क और धूप वाला है, इसलिए सिंचाई के लिए यह अच्छा समय है।",
      te: "ఉదయం 10 గంటల లోపు మీ గోధుమ చేనుకు నీరు పెట్టండి — నేలలో తేమ 38% గా ఉంది, ఇది సాధారణ స్థాయి కంటే కొద్దిగా తక్కువ. ఈరోజు వాతావరణం పొడిగా మరియు ఎండగా ఉన్నందున నీరు పెట్టడానికి ఇది సరైన సమయం.",
      ta: "காலை 10 மணிக்குள் உங்கள் கோதுமை வயலுக்கு தண்ணீர் பாய்ச்சவும் — மண் ஈரப்பதம் 38% ஆக உள்ளது, இது உகந்த அளவை விட சற்று குறைவு. இன்று வறண்ட மற்றும் வெயில் வானிலை உள்ளதால், பாசனம் செய்ய இது நல்ல நேரம்.",
    },
  },
  {
    id: "farmer_check_my_farm_risk_score",
    role: "farmer",
    section: "default",
    label: {
      en: "Check my farm risk score",
      hi: "मेरे खेत का रिस्क स्कोर जांचें",
      te: "నా పొలం రిస్క్ స్కోర్ చూడండి",
      ta: "எனது பண்ணை இடர் மதிப்பெண்ணை சரிபார்க்கவும்",
    },
    answer: {
      en: "Your Farm Risk Score is 34 out of 100 — Low Risk. Your soil moisture is a bit low, but weather, pest pressure, and market conditions are all stable.",
      hi: "आपके खेत का रिस्क स्कोर 100 में से 34 है — कम जोखिम (Low Risk)। आपकी मिट्टी की नमी थोड़ी कम है, लेकिन मौसम, कीट का दबाव और बाजार की स्थिति पूरी तरह स्थिर है।",
      te: "మీ పొలం రిస్క్ స్కోర్ 100కి 34 — తక్కువ రిస్క్. మీ మట్టి తేమ కొద్దిగా తక్కువగా ఉంది, కానీ వాతావరణం, తెగుళ్ల ప్రభావం మరియు మార్కెట్ పరిస్థితులు స్థిరంగా ఉన్నాయి.",
      ta: "உங்கள் பண்ணை இடர் மதிப்பெண் 100-க்கு 34 — குறைந்த ஆபத்து (Low Risk). உங்கள் மண் ஈரப்பதம் சற்று குறைவாக உள்ளது, ஆனால் வானிலை, பூச்சி தாக்குதல் மற்றும் சந்தை நிலவரங்கள் சீராக உள்ளன.",
    },
  },
  {
    id: "farmer_is_it_a_good_day_to_water",
    role: "farmer",
    section: "default",
    label: {
      en: "Is it a good day to water?",
      hi: "क्या आज पानी देने के लिए अच्छा दिन है?",
      te: "ఈరోజు నీరు పెట్టడానికి మంచి రోజా?",
      ta: "இன்று தண்ணீர் பாய்ச்ச நல்ல நாளா?",
    },
    answer: {
      en: "Yes, today is a good day to water. It's dry and sunny with no rain expected for the next 5 days, and your soil moisture is currently at 38%.",
      hi: "हाँ, आज पानी देने के लिए बहुत अच्छा दिन है। अगले 5 दिनों तक बारिश की कोई संभावना नहीं है, मौसम शुष्क व धूप वाला है और मिट्टी की नमी वर्तमान में 38% है।",
      te: "అవును, ఈరోజు నీరు పెట్టడానికి మంచి రోజు. రాబోయే 5 రోజులు వర్షం పడే అవకాశం లేదు, ఎండగా ఉంటుంది మరియు మీ మట్టి తేమ ప్రస్తుతం 38% వద్ద ఉంది.",
      ta: "ஆம், இன்று தண்ணீர் பாய்ச்ச நல்ல நாள். அடுத்த 5 நாட்களுக்கு மழைக்கு வாய்ப்பில்லை, வறண்ட வெயில் உள்ளது, மேலும் உங்கள் மண் ஈரப்பதம் தற்போது 38% ஆக உள்ளது.",
    },
  },
  {
    id: "farmer_scan_a_plant_for_disease",
    role: "farmer",
    section: "default",
    label: {
      en: "Scan a plant for disease",
      hi: "फसल रोग के लिए पौधा स्कैन करें",
      te: "తెగులు కోసం మొక్కను స్కాన్ చేయండి",
      ta: "நோய் பாதிப்பை ஸ்கேன் செய்யவும்",
    },
    answer: {
      en: "Opening the Disease Scan camera — point it at the affected leaf and I'll help identify any issues.",
      hi: "रोग स्कैन कैमरा खोला जा रहा है — इसे प्रभावित पत्ती की ओर रखें और मैं किसी भी समस्या की पहचान करने में आपकी मदद करूंगा।",
      te: "వ్యాధి స్కాన్ కెమెరా తెరవబడుతోంది — ప్రభావితమైన ఆకు వైపు చూపించండి, సమస్యను గుర్తించడంలో నేను సహాయం చేస్తాను.",
      ta: "நோய் ஸ்கேன் கேமரா திறக்கப்படுகிறது — பாதிக்கப்பட்ட இலையை நோக்கி கேமராவை காட்டவும், சிக்கலை அடையாளம் காண நான் உதவுகிறேன்.",
    },
  },
  {
    id: "farmer_whats_todays_mandi_price",
    role: "farmer",
    section: "default",
    label: {
      en: "What's today's mandi price?",
      hi: "आज का मंडी भाव क्या है?",
      te: "ఈరోజు మార్కెట్ ధర ఎంత?",
      ta: "இன்றைய மண்டி விலை என்ன?",
    },
    answer: {
      en: "Wheat is currently trading at ₹2,480 per quintal, up ₹120 from last week due to steady demand.",
      hi: "गेहूं वर्तमान में ₹2,480 प्रति क्विंटल पर बिक रहा है, जो स्थिर मांग के कारण पिछले सप्ताह की तुलना में ₹120 अधिक है।",
      te: "గోధుమ ప్రస్తుతం క్వింటాలుకు ₹2,480 వద్ద ట్రేడవుతోంది, స్థిరమైన డిమాండ్ కారణంగా గత వారం కంటే ₹120 పెరిగింది.",
      ta: "கோதுமை தற்போது குவிண்டாலுக்கு ₹2,480 ஆக விற்பனையாகிறது, சீரான தேவை காரணமாக கடந்த வாரத்தை விட ₹120 உயர்ந்துள்ளது.",
    },
  },
  {
    id: "farmer_what_fertilizer_do_i_need",
    role: "farmer",
    section: "default",
    label: {
      en: "What fertilizer do I need?",
      hi: "मुझे किस खाद की आवश्यकता है?",
      te: "నాకు ఏ ఎరువు అవసరం?",
      ta: "எனக்கு என்ன உரம் தேவை?",
    },
    answer: {
      en: "Based on your Wheat crop at the vegetative stage, we recommend applying Urea at 50kg per acre. Check the Fertilizer Recommendation tool for full details.",
      hi: "वानस्पतिक विकास चरण में आपकी गेहूं की फसल के आधार पर, हम प्रति एकड़ 50 किग्रा यूरिया डालने की सलाह देते हैं। पूरी जानकारी के लिए खाद अनुशंसा टूल देखें।",
      te: "శాకీయ దశలో ఉన్న మీ గోధుమ పంట ఆధారంగా, ఎకరానికి 50 కేజీల యూరియాను వేయాలని సిఫార్సు చేస్తున్నాము. పూర్తి వివరాల కోసం ఎరువుల సిఫార్సు టూల్‌ను చూడండి.",
      ta: "வளர்ச்சி நிலையில் உள்ள உங்கள் கோதுமை பயிரின் அடிப்படையில், ஏக்கருக்கு 50 கிலோ யூரியா இட பரிந்துரைக்கிறோம். முழு விவரங்களுக்கு உர பரிந்துரை கருவியை பார்க்கவும்.",
    },
  },

  // Home / Farm Risk Score section
  {
    id: "farmer_why_is_my_risk_score_high_today",
    role: "farmer",
    section: "risk",
    label: {
      en: "Why is my risk score high today?",
      hi: "आज मेरा रिस्क स्कोर अधिक क्यों है?",
      te: "ఈరోజు నా రిస్క్ స్కోర్ ఎందుకు ఎక్కువగా ఉంది?",
      ta: "இன்று எனது இடர் மதிப்பெண் ஏன் அதிகமாக உள்ளது?",
    },
    answer: {
      en: "Your risk score is currently Low (34/100). The main factor affecting it is a mild soil moisture deficit — irrigating today should help bring this down further.",
      hi: "आपका रिस्क स्कोर वर्तमान में कम (34/100) है। इसे प्रभावित करने वाला मुख्य कारक मिट्टी में नमी की हल्की कमी है — आज सिंचाई करने से यह और कम हो जाएगा।",
      te: "మీ రిస్క్ స్కోర్ ప్రస్తుతం తక్కువగా ఉంది (34/100). దీన్ని ప్రభావితం చేసే ప్రధాన అంశం మట్టి తేమ స్వల్పంగా తగ్గడం — ఈరోజు నీరు పెడితే ఇది మరింత తగ్గుతుంది.",
      ta: "உங்கள் இடர் மதிப்பெண் தற்போது குறைவாக உள்ளது (34/100). இதை பாதிக்கும் முக்கிய காரணி லேசான மண் ஈரப்பதம் பற்றாக்குறை — இன்று பாசனம் செய்வது இதை மேலும் குறைக்க உதவும்.",
    },
  },
  {
    id: "farmer_what_should_i_do_first_today",
    role: "farmer",
    section: "risk",
    label: {
      en: "What should I do first today?",
      hi: "आज मुझे सबसे पहले क्या करना चाहिए?",
      te: "ఈరోజు నేను మొదట ఏమి చేయాలి?",
      ta: "இன்று நான் முதலில் என்ன செய்ய வேண்டும்?",
    },
    answer: {
      en: "Your top priority today is morning irrigation, ideally before 10 AM, since soil moisture has dropped to 38%.",
      hi: "आज आपकी सर्वोच्च प्राथमिकता सुबह की सिंचाई है, जो सुबह 10 बजे से पहले होनी चाहिए, क्योंकि मिट्टी की नमी 38% तक गिर गई है।",
      te: "ఈరోజు మీ మొదటి ప్రాధాన్యత ఉదయం వేళ నీరు పెట్టడం, ముఖ్యంగా ఉదయం 10 గంటల లోపు, ఎందుకంటే మట్టి తేమ 38% కి తగ్గింది.",
      ta: "மண் ஈரப்பதம் 38% ஆக குறைந்துள்ளதால், காலை 10 மணிக்குள் தண்ணீர் பாய்ச்சுவதே இன்று உங்கள் முதல் முன்னுரிமை.",
    },
  },
  {
    id: "farmer_explain_my_soil_moisture_alert",
    role: "farmer",
    section: "risk",
    label: {
      en: "Explain my soil moisture alert",
      hi: "मेरे मिट्टी नमी अलर्ट के बारे में बताएं",
      te: "నా మట్టి తేమ హెచ్చరిక గురించి వివరించండి",
      ta: "எனது மண் ஈரப்பத எச்சரிக்கையை விளக்குங்கள்",
    },
    answer: {
      en: "Your soil moisture is at 38%, just below the 40% threshold. This means your crop may start experiencing mild water stress if not irrigated soon.",
      hi: "आपकी मिट्टी की नमी 38% है, जो 40% की सीमा से ठीक नीचे है। इसका मतलब है कि यदि जल्द ही सिंचाई नहीं की गई तो आपकी फसल को पानी की हल्की कमी का सामना करना पड़ सकता है।",
      te: "మీ మట్టి తేమ 38% వద్ద ఉంది, ఇది 40% పరిమితి కంటే కొద్దిగా తక్కువ. వెంటనే నీరు పెట్టకపోతే మీ పంట స్వల్ప నీటి ఎద్దడికి గురవుతుందని దీని అర్థం.",
      ta: "உங்கள் மண் ஈரப்பதம் 38% ஆக உள்ளது, இது 40% வரம்பிற்கு சற்று கீழே உள்ளது. இதன் பொருள் விரைவில் பாசனம் செய்யாவிட்டால் பயிரில் நீர் பற்றாக்குறை ஏற்படும்.",
    },
  },

  // Disease Scan section
  {
    id: "farmer_what_does_this_disease_mean_for_my_crop",
    role: "farmer",
    section: "disease",
    label: {
      en: "What does this disease mean for my crop?",
      hi: "इस बीमारी का मेरी फसल के लिए क्या मतलब है?",
      te: "ఈ తెగులు వల్ల నా పంటకు కలిగే నష్టం ఏమిటి?",
      ta: "இந்த நோய் எனது பயிருக்கு என்ன விளைவை ஏற்படுத்தும்?",
    },
    answer: {
      en: "This appears to be early blight, a fungal disease that affects leaves first and can spread to reduce yield if untreated.",
      hi: "यह अगेती झुलसा (Early Blight) प्रतीत होता है, जो एक फंगल रोग है। यह सबसे पहले पत्तियों को प्रभावित करता है और इलाज न किए जाने पर पैदावार कम कर सकता है।",
      te: "ఇది ముందస్తు ఆకు ఎండు తెగులుగా కనిపిస్తోంది. ఇది మొదట ఆకులను ప్రభావితం చేసే శిలీంధ్ర వ్యాధి మరియు చికిత్స చేయకపోతే దిగుబడిని తగ్గిస్తుంది.",
      ta: "இது ஆரம்பக்கால இலைக்கருகல் நோய் போல் தெரிகிறது. இது இலைகளை முதலில் பாதிக்கும் பூஞ்சை நோய், சிகிச்சையளிக்கப்படாவிட்டால் மகசூலைக் குறைக்கும்.",
    },
  },
  {
    id: "farmer_how_do_i_treat_this_naturally",
    role: "farmer",
    section: "disease",
    label: {
      en: "How do I treat this naturally?",
      hi: "मैं इसका प्राकृतिक उपचार कैसे करूं?",
      te: "దీనికి సహజంగా ఎలా చికిత్స చేయాలి?",
      ta: "இயற்கையாக இதற்கு எப்படி சிகிச்சை அளிப்பது?",
    },
    answer: {
      en: "A neem oil spray (5ml per litre of water) applied every 5-7 days can help manage early-stage fungal infections naturally.",
      hi: "प्रति 5-7 दिनों में नीम के तेल का स्प्रे (5 मिली प्रति लीटर पानी) प्रारंभिक चरण के फंगल संक्रमण को प्राकृतिक रूप से नियंत्रित करने में मदद कर सकता है।",
      te: "ప్రతి 5-7 రోజులకు వేప నూనె స్ప్రే (లీటరు నీటికి 5 మి.లీ) పిచికారీ చేయడం వల్ల ప్రారంభ దశలోని శిలీంధ్రాల ఇన్ఫెక్షన్‌ను సహజంగా నియంత్రించవచ్చు.",
      ta: "ஒவ்வொரு 5-7 நாட்களுக்கும் வேப்பெண்ணெய் தெளிப்பது (ஒரு லிட்டர் தண்ணீருக்கு 5 மிலி) ஆரம்ப நிலை பூஞ்சை தொற்றுகளை இயற்கையாக கட்டுப்படுத்த உதவும்.",
    },
  },
  {
    id: "farmer_will_this_spread_to_other_plants",
    role: "farmer",
    section: "disease",
    label: {
      en: "Will this spread to other plants?",
      hi: "क्या यह अन्य पौधों में फैलेगा?",
      te: "ఇది ఇతర మొక్కలకు వ్యాపిస్తుందా?",
      ta: "இது மற்ற தாவரங்களுக்கும் பரவுமா?",
    },
    answer: {
      en: "Yes, fungal diseases like this can spread through wind, water, and contact. It's best to isolate and treat affected plants quickly.",
      hi: "हाँ, इस तरह के फंगल रोग हवा, पानी और संपर्क से फैल सकते हैं। प्रभावित पौधों को अलग करना और तुरंत उपचार करना सबसे अच्छा है।",
      te: "అవును, ఇలాంటి శిలీంధ్ర వ్యాధులు గాలి, నీరు మరియు స్పర్శ ద్వారా వ్యాపిస్తాయి. ప్రభావితమైన మొక్కలను వెంటనే గుర్తించి చికిత్స చేయడం మంచిది.",
      ta: "ஆம், இதுபோன்ற பூஞ்சை நோய்கள் காற்று, நீர் மற்றும் தொடுதல் மூலம் பரவக்கூடும். பாதிக்கப்பட்ட தாவரங்களை விரைவாக பிரித்து சிகிச்சை அளிப்பது நல்லது.",
    },
  },
  {
    id: "farmer_how_much_pesticide_should_i_use",
    role: "farmer",
    section: "disease",
    label: {
      en: "How much pesticide should I use?",
      hi: "मुझे कितना कीटनाशक उपयोग करना चाहिए?",
      te: "నేను ఎంత పురుగుమందు వాడాలి?",
      ta: "நான் எவ்வளவு பூச்சிக்கொல்லி பயன்படுத்த வேண்டும்?",
    },
    answer: {
      en: "For this condition, apply the recommended fungicide at 2ml per litre of water, sprayed evenly on affected leaves in the early morning or evening.",
      hi: "इस स्थिति के लिए, अनुशंसित फफूंदनाशक को 2 मिली प्रति लीटर पानी में मिलाकर सुबह या शाम के समय प्रभावित पत्तियों पर समान रूप से छिड़कें।",
      te: "ఈ పరిస్థితికి, సిఫార్సు చేసిన శిలీంద్ర సంహారిణిని లీటరు నీటికి 2 మి.లీ చొప్పున కలిపి, తెల్లవారుజామున లేదా సాయంత్రం వేళల్లో ప్రభావిత ఆకులపై పిచికారీ చేయండి.",
      ta: "இந்த நிலைக்கு, பரிந்துரைக்கப்பட்ட பூஞ்சைக் கொல்லியை ஒரு லிட்டர் தண்ணீருக்கு 2 மிலி என்ற அளவில், அதிகாலை அல்லது மாலையில் பாதிக்கப்பட்ட இலைகளில் சீராக தெளிக்கவும்.",
    },
  },

  // Smart Sensors section
  {
    id: "farmer_is_my_soil_moisture_normal_right_now",
    role: "farmer",
    section: "sensors",
    label: {
      en: "Is my soil moisture normal right now?",
      hi: "क्या मेरी मिट्टी की नमी अभी सामान्य है?",
      te: "నా మట్టి తేమ ప్రస్తుతం సాధారణంగా ఉందా?",
      ta: "எனது மண் ஈரப்பதம் இப்போது சாதாரணமாக உள்ளதா?",
    },
    answer: {
      en: "Your current soil moisture is 38%, which is slightly below the ideal 40% threshold for your crop.",
      hi: "आपकी वर्तमान मिट्टी की नमी 38% है, जो आपकी फसल के लिए आदर्श 40% की सीमा से थोड़ी कम है।",
      te: "మీ ప్రస్తుత మట్టి తేమ 38%, ఇది మీ పంటకు అనువైన 40% పరిమితి కంటే కొద్దిగా తక్కువ.",
      ta: "உங்கள் தற்போதைய மண் ஈரப்பதம் 38% ஆகும், இது உங்கள் பயிருக்கு உகந்த 40% வரம்பை விட சற்று குறைவு.",
    },
  },
  {
    id: "farmer_when_should_i_water_next",
    role: "farmer",
    section: "sensors",
    label: {
      en: "When should I water next?",
      hi: "मुझे अगली बार पानी कब देना चाहिए?",
      te: "నేను తదుపరి ఎప్పుడు నీరు పెట్టాలి?",
      ta: "அடுத்து நான் எப்போது தண்ணீர் பாய்ச்ச வேண்டும்?",
    },
    answer: {
      en: "Based on current readings, you should water within the next few hours, ideally before 10 AM today.",
      hi: "वर्तमान रीडिंग के आधार पर, आपको अगले कुछ घंटों के भीतर पानी देना चाहिए, आदर्श रूप से आज सुबह 10 बजे से पहले।",
      te: "ప్రస్తుత రీడింగ్‌ల ఆధారంగా, మీరు రాబోయే కొద్ది గంటల్లో, ముఖ్యంగా ఈరోజు ఉదయం 10 గంటల లోపు నీరు పెట్టాలి.",
      ta: "தற்போதைய அளவீடுகளின் அடிப்படையில், அடுத்த சில மணிநேரங்களுக்குள், குறிப்பாக இன்று காலை 10 மணிக்குள் தண்ணீர் பாய்ச்ச வேண்டும்.",
    },
  },
  {
    id: "farmer_why_did_auto_irrigation_turn_on",
    role: "farmer",
    section: "sensors",
    label: {
      en: "Why did auto-irrigation turn on?",
      hi: "ऑटो-सिंचाई क्यों चालू हुई?",
      te: "ఆటో-ఇరిగేషన్ ఎందుకు ఆన్ అయింది?",
      ta: "தானியங்கி பாசனம் ஏன் இயக்கப்பட்டது?",
    },
    answer: {
      en: "Auto-irrigation activated because soil moisture dropped below your set threshold of 40%.",
      hi: "ऑटो-सिंचाई इसलिए सक्रिय हुई क्योंकि मिट्टी की नमी आपके द्वारा निर्धारित 40% की सीमा से नीचे गिर गई थी।",
      te: "మట్టి తేమ మీరు నిర్ణయించిన 40% పరిమితి కంటే తక్కువకు పడిపోవడం వల్ల ఆటో-ఇరిగేషన్ ఆన్ అయింది.",
      ta: "மண் ஈரப்பதம் நீங்கள் நிர்ணயித்த 40% வரம்பிற்குக் கீழே குறைந்ததால் தானியங்கி பாசனம் இயக்கப்பட்டது.",
    },
  },
  {
    id: "farmer_is_my_soil_ph_good_for_my_crop",
    role: "farmer",
    section: "sensors",
    label: {
      en: "Is my soil pH good for my crop?",
      hi: "क्या मेरी मिट्टी का pH मेरी फसल के लिए अच्छा है?",
      te: "నా మట్టి pH నా పంటకు మంచిదేనా?",
      ta: "எனது மண்ணின் pH பயிருக்கு உகந்ததா?",
    },
    answer: {
      en: "Your soil pH is 6.4, which is within the ideal range (6.0-7.0) for your Wheat crop.",
      hi: "आपकी मिट्टी का pH 6.4 है, जो आपकी गेहूं की फसल के लिए आदर्श सीमा (6.0-7.0) के भीतर है।",
      te: "మీ మట్టి pH 6.4 గా ఉంది, ఇది మీ గోధుమ పంటకు అనువైన పరిధిలో (6.0-7.0) ఉంది.",
      ta: "உங்கள் மண்ணின் pH 6.4 ஆக உள்ளது, இது கோதுமை பயிருக்கு உகந்த வரம்பிற்குள் (6.0-7.0) உள்ளது.",
    },
  },

  // Mandi Rates section
  {
    id: "farmer_should_i_sell_my_crop_today_or_wait",
    role: "farmer",
    section: "mandi",
    label: {
      en: "Should I sell my crop today or wait?",
      hi: "क्या मुझे अपनी फसल आज बेचनी चाहिए या प्रतीक्षा करनी चाहिए?",
      te: "నేను నా పంటను ఈరోజే అమ్మాలా లేక వేచి ఉండాలా?",
      ta: "நான் எனது பயிரை இன்றே விற்க வேண்டுமா அல்லது காத்திருக்க வேண்டுமா?",
    },
    answer: {
      en: "Wheat prices have risen ₹120 this week to ₹2,480/quintal, showing an upward trend — this may be a good time to sell if your crop is ready.",
      hi: "इस सप्ताह गेहूं की कीमतें ₹120 बढ़कर ₹2,480/क्विंटल हो गई हैं, जो तेजी का रुझान दिखा रही हैं — यदि आपकी फसल तैयार है तो बेचने का यह अच्छा समय हो सकता है।",
      te: "ఈ వారం గోధుమ ధరలు ₹120 పెరిగి ₹2,480/క్వింటాలుకు చేరుకున్నాయి — మీ పంట సిద్ధంగా ఉంటే అమ్మడానికి ఇది మంచి సమయం కావచ్చు.",
      ta: "கோதுமை விலை இந்த வாரம் ₹120 உயர்ந்து ₹2,480/குவிண்டாலாக உள்ளது — உங்கள் பயிர் தயாராக இருந்தால் விற்க இது நல்ல நேரமாக இருக்கலாம்.",
    },
  },
  {
    id: "farmer_which_nearby_market_has_the_best_price",
    role: "farmer",
    section: "mandi",
    label: {
      en: "Which nearby market has the best price?",
      hi: "किस नजदीकी मंडी में सबसे अच्छा भाव है?",
      te: "ఏ సమీప మార్కెట్‌లో ఉత్తమ ధర ఉంది?",
      ta: "அருகிலுள்ள எந்த சந்தையில் சிறந்த விலை கிடைக்கிறது?",
    },
    answer: {
      en: "Based on recent data, your local APMC mandi is currently offering competitive rates for Wheat and oilseeds.",
      hi: "हालिया आंकड़ों के आधार पर, आपकी स्थानीय एपीएमसी (APMC) मंडी वर्तमान में गेहूं और तिलहन के लिए सबसे प्रतिस्पर्धी भाव दे रही है।",
      te: "తాజా సమాచారం ప్రకారం, మీ స్థానిక APMC మార్కెట్ ప్రస్తుతం గోధుమలు మరియు నూనెగింజలకు అత్యుత్తమ ధరలను అందిస్తోంది.",
      ta: "சமீபத்திய தரவுகளின்படி, உங்கள் உள்ளூர் ஏபிஎம்சி மண்டி தற்போது கோதுமை மற்றும் எண்ணெய் வித்துக்களுக்கு சிறந்த விலையை வழங்குகிறது.",
    },
  },
  {
    id: "farmer_why_did_prices_drop_this_week",
    role: "farmer",
    section: "mandi",
    label: {
      en: "Why did prices drop this week?",
      hi: "इस सप्ताह कीमतें क्यों गिरीं?",
      te: "ఈ వారం ధరలు ఎందుకు తగ్గాయి?",
      ta: "இந்த வாரம் விலை ஏன் குறைந்தது?",
    },
    answer: {
      en: "Prices can fluctuate due to supply levels, demand changes, and transport costs — check the Mandi Rates screen for the latest trend.",
      hi: "आवक (सप्लाई), मांग में बदलाव और परिवहन लागत के कारण कीमतों में उतार-चढ़ाव हो सकता है — नवीनतम रुझानों के लिए मंडी भाव स्क्रीन देखें।",
      te: "సరఫరా స్థాయిలు, డిమాండ్ మార్పులు మరియు రవాణా ఖర్చుల వల్ల ధరల్లో హెచ్చుతగ్గులు ఉండవచ్చు — తాజా ట్రెండ్ కోసం మండి రేట్ల స్క్రీన్‌ను చూడండి.",
      ta: "வரத்து, தேவை மாற்றங்கள் மற்றும் போக்குவரத்து செலவுகள் காரணமாக விலைகள் மாறக்கூடும் — சமீபத்திய நிலவரத்திற்கு மண்டி விலை பக்கத்தைப் பார்க்கவும்.",
    },
  },

  // Fertilizer Recommendation section
  {
    id: "farmer_what_fertilizer_does_my_crop_need_now",
    role: "farmer",
    section: "fertilizer",
    label: {
      en: "What fertilizer does my crop need now?",
      hi: "मेरी फसल को अब किस खाद की आवश्यकता है?",
      te: "నా పంటకు ఇప్పుడు ఏ ఎరువు అవసరం?",
      ta: "எனது பயிருக்கு இப்போது என்ன உரம் தேவை?",
    },
    answer: {
      en: "For Wheat at the vegetative stage, apply Urea at approximately 50kg per acre.",
      hi: "वानस्पतिक विकास चरण में गेहूं के लिए, प्रति एकड़ लगभग 50 किग्रा यूरिया का प्रयोग करें।",
      te: "శాకీయ దశలో ఉన్న గోధుమ పంట కోసం, ఎకరానికి సుమారు 50 కేజీల యూరియాను వేయండి.",
      ta: "வளர்ச்சி நிலையில் உள்ள கோதுமைக்கு, ஏக்கருக்கு சுமார் 50 கிலோ யூரியாவைப் பயன்படுத்தவும்.",
    },
  },
  {
    id: "farmer_is_this_fertilizer_safe_for_organic_farming",
    role: "farmer",
    section: "fertilizer",
    label: {
      en: "Is this fertilizer safe for organic farming?",
      hi: "क्या यह खाद जैविक खेती के लिए सुरक्षित है?",
      te: "ఈ ఎరువు సేంద్రీయ వ్యవసాయానికి సురక్షితమేనా?",
      ta: "இந்த உரம் இயற்கை விவசாயத்திற்கு உகந்ததா?",
    },
    answer: {
      en: "Urea is a synthetic fertilizer and not certified for organic farming — consider vermicompost or organic alternatives if you're following organic practices.",
      hi: "यूरिया एक रासायनिक खाद है और जैविक खेती के लिए प्रमाणित नहीं है — यदि आप जैविक खेती कर रहे हैं तो वर्मीकम्पोस्ट या जैविक विकल्पों का उपयोग करें।",
      te: "యూరియా అనేది రసాయన ఎరువు మరియు సేంద్రీయ వ్యవసాయానికి ధృవీకరించబడలేదు — మీరు సేంద్రీయ పద్ధతులను అనుసరిస్తుంటే వర్మీకంపోస్ట్ లేదా సహజ ప్రత్యామ్నాయాలను వాడండి.",
      ta: "யூரியா ஒரு செயற்கை உரம் மற்றும் இயற்கை விவசாயத்திற்கு சான்றளிக்கப்படவில்லை — நீங்கள் இயற்கை விவசாயம் செய்தால் மண்புழு உரம் போன்றவற்றை பயன்படுத்தவும்.",
    },
  },
  {
    id: "farmer_how_often_should_i_apply_this",
    role: "farmer",
    section: "fertilizer",
    label: {
      en: "How often should I apply this?",
      hi: "मुझे इसे कितनी बार डालना चाहिए?",
      te: "నేను దీన్ని ఎంత తరచుగా వేయాలి?",
      ta: "இதை எவ்வளவு அடிக்கடி இட வேண்டும்?",
    },
    answer: {
      en: "Apply this fertilizer once at the current growth stage, and reassess at the next growth stage based on soil health.",
      hi: "इस खाद को वर्तमान विकास चरण में एक बार डालें, और मिट्टी के स्वास्थ्य के आधार पर अगले विकास चरण में पुनः मूल्यांकन करें।",
      te: "ఈ ఎరువును ప్రస్తుత పెరుగుదల దశలో ఒకసారి వేయండి మరియు మట్టి ఆరోగ్యం ఆధారంగా తదుపరి దశలో మళ్లీ నిర్ణయించండి.",
      ta: "இந்த உரத்தை தற்போதைய வளர்ச்சி நிலையில் ஒரு முறை இடவும், அடுத்த வளர்ச்சி கட்டத்தில் மண்ணின் தன்மைக்கேற்ப மீண்டும் இடவும்.",
    },
  },

  // Hire Labour section
  {
    id: "farmer_how_do_i_post_a_job_for_harvesting",
    role: "farmer",
    section: "labour",
    label: {
      en: "How do I post a job for harvesting?",
      hi: "मैं कटाई के लिए काम (जॉब) कैसे पोस्ट करूं?",
      te: "నేను పంట కోత పనిని ఎలా పోస్ట్ చేయాలి?",
      ta: "அறுவடை வேலைக்கான அறிவிப்பை எப்படி வெளியிடுவது?",
    },
    answer: {
      en: "Go to Hire Labour, tap 'Post a Job', select 'Harvesting' as the work type, set your duration and pay rate, and submit — nearby workers will be notified.",
      hi: "मजदूर हायर करें (Hire Labour) पर जाएं, 'Post a Job' पर टैप करें, कार्य के प्रकार में 'Harvesting' चुनें, दिन और मजदूरी दर तय करें और सबमिट करें — नजदीकी मजदूरों को सूचना मिल जाएगी।",
      te: "కూలీల నియామకం (Hire Labour) విభాగంలో 'Post a Job' పై నొక్కండి, పని రకంగా 'Harvesting' ఎంచుకోండి, రోజులు మరియు వేతనం నిర్ణయించి సబ్మిట్ చేయండి — సమీప కూలీలకు సమాచారం అందుతుంది.",
      ta: "கூலியாட்கள் பகுதிக்குச் சென்று, 'Post a Job' என்பதைத் தட்டி, 'Harvesting' என்பதைத் தேர்வுசெய்து, ஊதியத்தை நிர்ணயித்து சமர்ப்பிக்கவும் — தொழிலாளர்களுக்கு அறிவிக்கப்படும்.",
    },
  },
  {
    id: "farmer_how_many_workers_do_i_need_for_my_field_size",
    role: "farmer",
    section: "labour",
    label: {
      en: "How many workers do I need for my field size?",
      hi: "मेरे खेत के आकार के लिए कितने मजदूरों की आवश्यकता है?",
      te: "నా పొలం విస్తీర్ణానికి ఎంతమంది కూలీలు అవసరం?",
      ta: "எனது நில அளவிற்கு எத்தனை தொழிலாளர்கள் தேவை?",
    },
    answer: {
      en: "As a general guide, 1 worker can typically harvest about 0.5-1 acre per day depending on the crop — for larger fields, consider hiring 3-4 workers.",
      hi: "एक सामान्य नियम के रूप में, 1 मजदूर फसल के आधार पर प्रतिदिन लगभग 0.5-1 एकड़ की कटाई कर सकता है — बड़े खेतों के लिए, 3-4 मजदूर रखने पर विचार करें।",
      te: "సాధారణంగా పంటను బట్టి 1 కూలీ రోజుకు 0.5-1 ఎకరం కోయగలరు — పెద్ద పొలాల కోసం 3-4 మంది కూలీలను నియమించుకోవడం మంచిది.",
      ta: "பொதுவாக 1 தொழிலாளி ஒரு நாளைக்கு 0.5-1 ஏக்கர் வரை அறுவடை செய்வார் — பெரிய வயல்களுக்கு 3-4 தொழிலாளர்களை அமர்த்தலாம்.",
    },
  },

  // =========================================================================
  // 2. HOME GARDENER ROLE
  // =========================================================================
  // Default prompts
  {
    id: "gardener_hows_my_balcony_garden_doing",
    role: "gardener",
    section: "default",
    label: {
      en: "How's my balcony garden doing?",
      hi: "मेरा बालकनी गार्डन कैसा चल रहा है?",
      te: "నా బాల్కనీ తోట ఎలా ఉంది?",
      ta: "எனது பால்கனி தோட்டம் எப்படி உள்ளது?",
    },
    answer: {
      en: "Your plants are doing well overall! 2 of your 4 pots need watering today.",
      hi: "आपके पौधे कुल मिलाकर बहुत अच्छे हैं! आपके 4 में से 2 गमलों में आज पानी देने की आवश्यकता है।",
      te: "మీ మొక్కలు బాగానే ఉన్నాయి! మీ 4 కుండీలలో 2 కుండీలకు ఈరోజు నీరు అవసరం.",
      ta: "உங்கள் தாவரங்கள் நன்றாக உள்ளன! உங்கள் 4 தொட்டிகளில் 2 தொட்டிகளுக்கு இன்று தண்ணீர் தேவை.",
    },
  },
  {
    id: "gardener_what_should_i_water_today",
    role: "gardener",
    section: "default",
    label: {
      en: "What should I water today?",
      hi: "मुझे आज किसमें पानी देना चाहिए?",
      te: "ఈరోజు నేను దేనికి నీరు పెట్టాలి?",
      ta: "இன்று நான் எதற்கு தண்ணீர் ஊற்ற வேண்டும்?",
    },
    answer: {
      en: "Your Mint and Coriander pots need watering this morning.",
      hi: "आपके पुदीना और धनिए के गमलों में आज सुबह पानी देने की आवश्यकता है।",
      te: "మీ పుదీనా మరియు కొత్తిమీర కుండీలకు ఈ ఉదయం నీరు పెట్టాలి.",
      ta: "உங்கள் புதினா மற்றும் கொத்தமல்லி தொட்டிகளுக்கு இன்று காலை தண்ணீர் ஊற்ற வேண்டும்.",
    },
  },
  {
    id: "gardener_scan_my_plant_for_problems",
    role: "gardener",
    section: "default",
    label: {
      en: "Scan my plant for problems",
      hi: "समस्याओं के लिए मेरे पौधे को स्कैन करें",
      te: "సమస్యల కోసం నా మొక్కను స్కాన్ చేయండి",
      ta: "சிக்கல்களுக்கு எனது செடியை ஸ்கேன் செய்யவும்",
    },
    answer: {
      en: "Opening the camera — point it at the affected leaves and I'll help identify the issue.",
      hi: "कैमरा खोला जा रहा है — इसे प्रभावित पत्तियों की ओर रखें और मैं समस्या की पहचान करने में मदद करूंगा।",
      te: "కెమెరా తెరవబడుతోంది — ప్రభావిత ఆకుల వైపు చూపించండి, సమస్యను గుర్తించడంలో నేను సహాయం చేస్తాను.",
      ta: "கேமரா திறக்கப்படுகிறது — பாதிக்கப்பட்ட இலைகளை நோக்கி காட்டவும், நான் சிக்கலைக் கண்டறிய உதவுகிறேன்.",
    },
  },
  {
    id: "gardener_what_can_i_grow_this_season",
    role: "gardener",
    section: "default",
    label: {
      en: "What can I grow this season?",
      hi: "मैं इस मौसम में क्या उगा सकता हूँ?",
      te: "ఈ సీజన్‌లో నేను ఏమి పెంచగలను?",
      ta: "இந்த பருவத்தில் நான் என்ன வளர்க்கலாம்?",
    },
    answer: {
      en: "This season is great for growing tomatoes, chillies, and leafy greens like spinach in pots or small garden beds.",
      hi: "यह मौसम गमलों या छोटी क्यारियों में टमाटर, हरी मिर्च और पालक जैसी पत्तेदार सब्जियां उगाने के लिए बहुत अच्छा है।",
      te: "ఈ సీజన్ టమాటాలు, పచ్చిమిర్చి మరియు పాలకూర వంటి ఆకుకూరలను కుండీలలో పెంచడానికి చాలా అనుకూలం.",
      ta: "இந்த பருவம் தக்காளி, மிளகாய் மற்றும் கீரை போன்றவற்றை தொட்டிகளில் வளர்க்க மிகவும் சிறந்தது.",
    },
  },

  // My Plants section
  {
    id: "gardener_why_are_this_plants_leaves_yellow",
    role: "gardener",
    section: "plants",
    label: {
      en: "Why are this plant's leaves yellow?",
      hi: "इस पौधे की पत्तियां पीली क्यों हैं?",
      te: "ఈ మొక్క ఆకులు ఎందుకు పసుపు రంగులోకి మారాయి?",
      ta: "இந்த செடியின் இலைகள் ஏன் மஞ்சளாகின்றன?",
    },
    answer: {
      en: "Yellow leaves are often a sign of overwatering or nutrient deficiency. Check if the soil is staying too wet between waterings.",
      hi: "पीली पत्तियां अक्सर अधिक पानी देने या पोषक तत्वों की कमी का संकेत होती हैं। जांचें कि क्या पानी देने के बीच मिट्टी बहुत गीली तो नहीं रह रही है।",
      te: "ఆకులు పసుపు రంగులోకి మారడం అనేది అధికంగా నీరు పోయడం లేదా పోషకాల లోపం వల్ల జరుగుతుంది. మట్టి మరీ తడిగా ఉంటోందేమో తనిఖీ చేయండి.",
      ta: "மஞ்சள் இலைகள் பெரும்பாலும் அதிக நீர் அல்லது ஊட்டச்சத்து குறைபாட்டின் அறிகுறியாகும். மண் அதிக ஈரமாக இருக்கிறதா என்று சோதிக்கவும்.",
    },
  },
  {
    id: "gardener_how_often_should_i_water_this",
    role: "gardener",
    section: "plants",
    label: {
      en: "How often should I water this?",
      hi: "मुझे इसे कितनी बार पानी देना चाहिए?",
      te: "నేను దీనికి ఎంత తరచుగా నీరు పోయాలి?",
      ta: "இதற்கு எவ்வளவு அடிக்கடி தண்ணீர் ஊற்ற வேண்டும்?",
    },
    answer: {
      en: "Most potted plants like this do well with watering every 2-3 days, depending on weather and pot size.",
      hi: "मौसम और गमले के आकार के आधार पर, इस प्रकार के अधिकांश गमले के पौधों को हर 2-3 दिनों में पानी देना अच्छा रहता है।",
      te: "వాతావరణం మరియు కుండీ పరిమాణాన్ని బట్టి ఇలాంటి మొక్కలకు ప్రతి 2-3 రోజులకు ఒకసారి నీరు పోయడం మంచిది.",
      ta: "வானிலை மற்றும் தொட்டியின் அளவைப் பொறுத்து, இதுபோன்ற செடிகளுக்கு 2-3 நாட்களுக்கு ஒருமுறை தண்ணீர் ஊற்றுவது போதுமானது.",
    },
  },
  {
    id: "gardener_is_this_plant_getting_enough_sun",
    role: "gardener",
    section: "plants",
    label: {
      en: "Is this plant getting enough sun?",
      hi: "क्या इस पौधे को पर्याप्त धूप मिल रही है?",
      te: "ఈ మొక్కకు తగినంత ఎండ తగులుతోందా?",
      ta: "இந்த செடிக்கு போதுமான சூரிய ஒளி கிடைக்கிறதா?",
    },
    answer: {
      en: "Based on your balcony's direction, this plant should get at least 4-6 hours of sunlight for healthy growth.",
      hi: "आपकी बालकनी की दिशा के आधार पर, स्वस्थ विकास के लिए इस पौधे को कम से कम 4-6 घंटे की धूप मिलनी चाहिए।",
      te: "మీ బాల్కనీ దిశను బట్టి, ఆరోగ్యకరమైన పెరుగుదల కోసం ఈ మొక్కకు రోజుకు కనీసం 4-6 గంటల ఎండ తగలాలి.",
      ta: "உங்கள் பால்கனியின் அமைப்பின்படி, ஆரோக்கியமான வளர்ச்சிக்கு இந்த செடிக்கு குறைந்தது 4-6 மணிநேரம் சூரிய ஒளி கிடைக்க வேண்டும்.",
    },
  },

  // Disease Scan section (Gardener)
  {
    id: "gardener_whats_wrong_with_my_plant",
    role: "gardener",
    section: "disease",
    label: {
      en: "What's wrong with my plant?",
      hi: "मेरे पौधे में क्या खराबी है?",
      te: "నా మొక్కకు ఏమైంది?",
      ta: "எனது செடிக்கு என்ன பிரச்சனை?",
    },
    answer: {
      en: "This looks like a mild fungal spot on the leaves, common in humid conditions.",
      hi: "यह पत्तियों पर हल्का फंगल धब्बा जैसा दिखता है, जो आर्द्र (ह्यूमिड) मौसम में आम है।",
      te: "ఇది ఆకులపై తేలికపాటి శిలీంధ్ర మచ్చలా కనిపిస్తోంది, ఇది తేమతో కూడిన వాతావరణంలో సర్వసాధారణం.",
      ta: "இது இலைகளில் லேசான பூஞ்சை புள்ளி போல் தெரிகிறது, அதிக ஈரப்பதம் உள்ள சூழலில் இது பொதுவானது.",
    },
  },
  {
    id: "gardener_is_this_safe_to_treat_at_home",
    role: "gardener",
    section: "disease",
    label: {
      en: "Is this safe to treat at home?",
      hi: "क्या घर पर इसका इलाज करना सुरक्षित है?",
      te: "దీనికి ఇంట్లోనే చికిత్స చేయడం సురక్షితమేనా?",
      ta: "வீட்டிலேயே இதற்கு சிகிச்சை அளிப்பது பாதுகாப்பானதா?",
    },
    answer: {
      en: "Yes, this can typically be treated at home with a diluted neem oil spray — no chemical pesticides needed.",
      hi: "हाँ, इसे आमतौर पर हल्के नीम के तेल के स्प्रे से घर पर ही ठीक किया जा सकता है — किसी रासायनिक कीटनाशक की आवश्यकता नहीं है।",
      te: "అవును, వేపనూనె స్ప్రేతో ఇంట్లోనే సులభంగా నయం చేయవచ్చు — రసాయన మందులు అవసరం లేదు.",
      ta: "ஆம், இதை வேப்பெண்ணெய் தெளித்து வீட்டிலேயே எளிதாக குணப்படுத்தலாம் — ரசாயன மருந்துகள் தேவையில்லை.",
    },
  },
  {
    id: "gardener_will_this_spread_to_my_other_plants",
    role: "gardener",
    section: "disease",
    label: {
      en: "Will this spread to my other plants?",
      hi: "क्या यह मेरे अन्य पौधों में फैलेगा?",
      te: "ఇది నా ఇతర మొక్కలకు వ్యాపిస్తుందా?",
      ta: "இது எனது மற்ற செடிகளுக்கும் பரவுமா?",
    },
    answer: {
      en: "It's possible if plants are close together — consider spacing them out and treating the affected plant promptly.",
      hi: "यदि पौधे पास-पास रखे हैं तो यह संभव है — उन्हें थोड़ा दूर रखें और प्रभावित पौधे का तुरंत उपचार करें।",
      te: "మొక్కలు దగ్గరగా ఉంటే వ్యాపించే అవకాశం ఉంది — వాటి మధ్య కాస్త దూరం ఉంచి వెంటనే చికిత్స చేయండి.",
      ta: "செடிகள் நெருக்கமாக இருந்தால் பரவ வாய்ப்புள்ளது — இடைவெளி விட்டு பாதிக்கப்பட்ட செடிக்கு உடனடியாக சிகிச்சை அளிக்கவும்.",
    },
  },

  // Weather/Watering Guidance section
  {
    id: "gardener_should_i_water_today_or_skip_it",
    role: "gardener",
    section: "weather",
    label: {
      en: "Should I water today or skip it?",
      hi: "क्या मुझे आज पानी देना चाहिए या छोड़ देना चाहिए?",
      te: "నేను ఈరోజు నీరు పోయాలా లేక ఆపాలా?",
      ta: "இன்று தண்ணீர் ஊற்ற வேண்டுமா அல்லது தவிர்க்கலாமா?",
    },
    answer: {
      en: "You can skip watering today — rain is expected this evening.",
      hi: "आप आज पानी देना छोड़ सकते हैं — आज शाम बारिश की संभावना है।",
      te: "మీరు ఈరోజు నీరు పోయడం ఆపవచ్చు — ఈ సాయంత్రం వర్షం పడే అవకాశం ఉంది.",
      ta: "இன்று தண்ணீர் ஊற்றுவதை தவிர்க்கலாம் — இன்று மாலை மழை பெய்ய வாய்ப்புள்ளது.",
    },
  },
  {
    id: "gardener_is_today_good_for_planting",
    role: "gardener",
    section: "weather",
    label: {
      en: "Is today good for planting?",
      hi: "क्या आज पौधे लगाने के लिए अच्छा दिन है?",
      te: "మొక్కలు నాటడానికి ఈరోజు మంచిదేనా?",
      ta: "புதிய செடிகள் நட இன்று நல்ல நாளா?",
    },
    answer: {
      en: "Yes, today's mild weather is good for planting new seedlings.",
      hi: "हाँ, आज का सुहावना मौसम नए पौधे लगाने के लिए बहुत अच्छा है।",
      te: "అవును, కొత్త మొక్కలు నాటడానికి నేటి ఆహ్లాదకరమైన వాతావరణం చాలా మంచిది.",
      ta: "ஆம், புதிய நாற்றுகளை நட இன்றைய மிதமான வானிலை மிகவும் நல்லது.",
    },
  },

  // General gardening help
  {
    id: "gardener_what_pots_are_best_for_tomatoes",
    role: "gardener",
    section: "general",
    label: {
      en: "What pots are best for tomatoes?",
      hi: "टमाटर के लिए कौन से गमले सबसे अच्छे हैं?",
      te: "టమాటాలకు ఏ కుండీలు ఉత్తమమైనవి?",
      ta: "தக்காளி வளர்க்க எந்த தொட்டிகள் சிறந்தவை?",
    },
    answer: {
      en: "A pot at least 12-14 inches deep with good drainage holes works best for growing tomatoes.",
      hi: "टमाटर उगाने के लिए अच्छे जल निकासी छेद वाला कम से कम 12-14 इंच गहरा गमला सबसे अच्छा काम करता है।",
      te: "టమాటాలు పెంచడానికి మంచి డ్రైనేజీ రంధ్రాలు ఉన్న కనీసం 12-14 అంగుళాల లోతు గల కుండీ ఉత్తమమైనది.",
      ta: "தக்காளி வளர்க்க குறைந்தது 12-14 அங்குல ஆழமும், நல்ல வடிகால் வசதியும் கொண்ட தொட்டி சிறந்தது.",
    },
  },
  {
    id: "gardener_how_do_i_start_a_kitchen_garden",
    role: "gardener",
    section: "general",
    label: {
      en: "How do I start a kitchen garden?",
      hi: "मैं किचन गार्डन कैसे शुरू करूं?",
      te: "నేను కిచెన్ గార్డెన్‌ను ఎలా ప్రారంభించాలి?",
      ta: "சமையலறை தோட்டத்தை எப்படி தொடங்குவது?",
    },
    answer: {
      en: "Start small with easy plants like mint, coriander, or chillies in pots with good sunlight and regular watering.",
      hi: "अच्छी धूप और नियमित पानी वाले गमलों में पुदीना, धनिया या मिर्च जैसे आसान पौधों से छोटी शुरुआत करें।",
      te: "మంచి ఎండ మరియు నీటి సౌకర్యం ఉన్న కుండీలలో పుదీనా, కొత్తిమీర లేదా మిర్చి వంటి సులభమైన మొక్కలతో ప్రారంభించండి.",
      ta: "நல்ல சூரிய ஒளியுள்ள இடத்தில் புதினா, கொத்தமல்லி அல்லது மிளகாய் போன்ற எளிதான செடிகளுடன் தொடங்குங்கள்.",
    },
  },

  // =========================================================================
  // 3. FARM LABOUR ROLE
  // =========================================================================
  // Default prompts
  {
    id: "labour_find_work_near_me",
    role: "labour",
    section: "default",
    label: {
      en: "Find work near me",
      hi: "मेरे पास काम खोजें",
      te: "నా దగ్గర పనులు కనుగొనండి",
      ta: "எனக்கு அருகில் வேலை தேடுங்கள்",
    },
    answer: {
      en: "Showing available farm jobs near your location — check the Job Feed for details.",
      hi: "आपके स्थान के आस-पास उपलब्ध कृषि कार्य दिखाए जा रहे हैं — विवरण के लिए जॉब फीड देखें।",
      te: "మీ ప్రాంతం సమీపంలో అందుబాటులో ఉన్న వ్యవసాయ పనులను చూపుతున్నాము — వివరాల కోసం జాబ్ ఫీడ్ చూడండి.",
      ta: "உங்கள் இருப்பிடத்திற்கு அருகில் கிடைக்கும் வேலைகள் காட்டப்படுகின்றன — விவரங்களுக்கு ஜாப் ஃபீடை பார்க்கவும்.",
    },
  },
  {
    id: "labour_how_do_i_apply_for_a_job",
    role: "labour",
    section: "default",
    label: {
      en: "How do I apply for a job?",
      hi: "मैं किसी काम के लिए आवेदन कैसे करूं?",
      te: "నేను ఉద్యోగానికి ఎలా దరఖాస్తు చేయాలి?",
      ta: "நான் வேலைக்கு எப்படி விண்ணப்பிப்பது?",
    },
    answer: {
      en: "Tap on any job card, review the details, and tap 'Apply' — the farmer will be notified directly.",
      hi: "किसी भी जॉब कार्ड पर टैप करें, विवरण देखें और 'Apply' दबाएं — किसान को सीधे सूचित कर दिया जाएगा।",
      te: "ఏదైనా జాబ్ కార్డ్ పై నొక్కండి, వివరాలను చూసి 'Apply' నొక్కండి — రైతుకు నేరుగా సమాచారం అందుతుంది.",
      ta: "எந்தவொரு வேலை அட்டையையும் தட்டி, விவரங்களை சரிபார்த்து 'Apply' என்பதை அழுத்தவும் — விவசாயிக்கு தெரிவிக்கப்படும்.",
    },
  },
  {
    id: "labour_show_my_applied_jobs",
    role: "labour",
    section: "default",
    label: {
      en: "Show my applied jobs",
      hi: "मेरे द्वारा आवेदन किए गए काम दिखाएं",
      te: "నేను దరఖాస్తు చేసిన పనులను చూపించండి",
      ta: "நான் விண்ணப்பித்த வேலைகளைக் காட்டு",
    },
    answer: {
      en: "Here are the jobs you've applied to and their current status — check the Applied tab for details.",
      hi: "यहाँ वे काम हैं जिनके लिए आपने आवेदन किया है और उनकी स्थिति — विवरण के लिए Applied टैब देखें।",
      te: "మీరు దరఖాస్తు చేసిన ఉద్యోగాలు మరియు వాటి ప్రస్తుత స్థితి ఇక్కడ ఉన్నాయి — వివరాల కోసం Applied ట్యాబ్ చూడండి.",
      ta: "நீங்கள் விண்ணப்பித்த வேலைகள் மற்றும் அவற்றின் தற்போதைய நிலை இங்கே உள்ளது — விவரங்களுக்கு Applied தாவலை பார்க்கவும்.",
    },
  },
  {
    id: "labour_how_do_i_improve_my_profile_rating",
    role: "labour",
    section: "default",
    label: {
      en: "How do I improve my profile rating?",
      hi: "मैं अपनी प्रोफाइल रेटिंग कैसे सुधारूं?",
      te: "నా ప్రొఫైల్ రేటింగ్‌ను ఎలా మెరుగుపరచాలి?",
      ta: "எனது சுயவிவர மதிப்பீட்டை எவ்வாறு உயர்த்துவது?",
    },
    answer: {
      en: "Completing jobs reliably and communicating clearly with farmers helps build a strong rating over time.",
      hi: "काम को पूरी जिम्मेदारी से पूरा करना और किसानों के साथ स्पष्ट बातचीत समय के साथ आपकी रेटिंग को मजबूत बनाती है।",
      te: "పనులను నమ్మకంగా పూర్తి చేయడం మరియు రైతులతో సత్సంబంధాలు కలిగి ఉండటం వల్ల మీ రేటింగ్ పెరుగుతుంది.",
      ta: "வேலைகளை நம்பகத்தன்மையுடன் முடிப்பதும், விவசாயிகளிடம் தெளிவாகப் பேசுவதும் உங்கள் மதிப்பீட்டை உயர்த்தும்.",
    },
  },

  // Job Feed section
  {
    id: "labour_find_harvesting_work_nearby",
    role: "labour",
    section: "jobs",
    label: {
      en: "Find harvesting work nearby",
      hi: "पास में कटाई का काम खोजें",
      te: "సమీపంలో పంట కోత పనులను కనుగొనండి",
      ta: "அருகில் உள்ள அறுவடை வேலைகளைக் கண்டறியவும்",
    },
    answer: {
      en: "Showing harvesting jobs near your location, sorted by distance.",
      hi: "दूरी के अनुसार क्रमबद्ध आपके स्थान के निकट कटाई के काम दिखाए जा रहे हैं।",
      te: "మీ ప్రాంతానికి దగ్గరగా ఉన్న పంట కోత పనులను దూరం ఆధారంగా చూపిస్తున్నాము.",
      ta: "உங்கள் இருப்பிடத்திற்கு அருகிலுள்ள அறுவடை வேலைகள் தூரத்தின் அடிப்படையில் காட்டப்படுகின்றன.",
    },
  },
  {
    id: "labour_show_highest_paying_jobs_today",
    role: "labour",
    section: "jobs",
    label: {
      en: "Show highest paying jobs today",
      hi: "आज सबसे ज्यादा मजदूरी वाले काम दिखाएं",
      te: "ఈరోజు అత్యధిక వేతనం ఇచ్చే పనులను చూపించండి",
      ta: "இன்றைய அதிக சம்பள வேலைகளைக் காட்டு",
    },
    answer: {
      en: "Here are today's jobs sorted by pay rate, highest first.",
      hi: "यहाँ आज के काम मजदूरी दर के अनुसार उच्चतम से शुरू करते हुए दिखाए गए हैं।",
      te: "అత్యధిక వేతనం ఆధారంగా క్రమబద్ధీకరించబడిన నేటి ఉద్యోగాలు ఇక్కడ ఉన్నాయి.",
      ta: "அதிக ஊதியத்தின் அடிப்படையில் வரிசைப்படுத்தப்பட்ட இன்றைய வேலைகள் இங்கே உள்ளன.",
    },
  },
  {
    id: "labour_any_work_available_tomorrow",
    role: "labour",
    section: "jobs",
    label: {
      en: "Any work available tomorrow?",
      hi: "क्या कल कोई काम उपलब्ध है?",
      te: "రేపటికి ఏమైనా పనులు అందుబాటులో ఉన్నాయా?",
      ta: "நாளை ஏதேனும் வேலை உள்ளதா?",
    },
    answer: {
      en: "Checking job listings for tomorrow's availability — new postings are added daily.",
      hi: "कल की उपलब्धता के लिए काम की सूची जांची जा रही है — नए काम रोजाना जोड़े जाते हैं।",
      te: "రేపటి లభ్యత కోసం ఉద్యోగ జాబితాలు తనిఖీ చేయబడుతున్నాయి — ప్రతిరోజూ కొత్త పనులు పోస్ట్ చేయబడతాయి.",
      ta: "நாளைய வேலை வாய்ப்புகள் சரிபார்க்கப்படுகின்றன — தினமும் புதிய வேலைகள் பதிவேற்றப்படுகின்றன.",
    },
  },

  // Profile / Skills section
  {
    id: "labour_how_do_i_add_a_new_skill",
    role: "labour",
    section: "profile",
    label: {
      en: "How do I add a new skill?",
      hi: "मैं नया हुनर (Skill) कैसे जोड़ूं?",
      te: "నేను కొత్త నైపుణ్యాన్ని ఎలా జోడించాలి?",
      ta: "புதிய திறனை எப்படி சேர்ப்பது?",
    },
    answer: {
      en: "Go to your Profile, tap 'Edit Skills', and select any additional skills like spraying or weeding.",
      hi: "अपनी प्रोफाइल पर जाएं, 'Edit Skills' पर टैप करें, और छिड़काव या निराई जैसे अतिरिक्त हुनर चुनें।",
      te: "మీ ప్రొఫైల్‌కి వెళ్లి, 'Edit Skills' పై నొక్కి, స్ప్రేయింగ్ లేదా కలుపు తీయడం వంటి నైపుణ్యాలను ఎంచుకోండి.",
      ta: "உங்கள் சுயவிவரத்திற்குச் சென்று, 'Edit Skills' என்பதைத் தட்டி, மருந்து தெளித்தல் அல்லது களையெடுத்தல் போன்ற திறன்களைச் சேர்க்கவும்.",
    },
  },
  {
    id: "labour_how_do_i_update_my_availability",
    role: "labour",
    section: "profile",
    label: {
      en: "How do I update my availability?",
      hi: "मैं अपनी उपलब्धता (Availability) कैसे अपडेट करूं?",
      te: "నా లభ్యతను ఎలా అప్‌డేట్ చేయాలి?",
      ta: "எனது கிடைக்கும் நாட்களை எவ்வாறு மாற்றுவது?",
    },
    answer: {
      en: "Go to your Profile and tap on the availability calendar to mark the days you're free to work.",
      hi: "अपनी प्रोफाइल पर जाएं और काम के लिए उपलब्ध दिनों को चिह्नित करने के लिए कैलेंडर पर टैप करें।",
      te: "మీ ప్రొఫైల్‌కి వెళ్లి, మీరు పని చేయడానికి వీలుగా ఉన్న రోజులను క్యాలెండర్‌లో గుర్తించండి.",
      ta: "உங்கள் சுயவிவரத்திற்குச் சென்று, நீங்கள் வேலை செய்யக்கூடிய நாட்களைக் காலெண்டரில் குறிக்கவும்.",
    },
  },

  // Applied Jobs section
  {
    id: "labour_has_the_farmer_replied_yet",
    role: "labour",
    section: "applied",
    label: {
      en: "Has the farmer replied yet?",
      hi: "क्या किसान ने अभी तक उत्तर दिया है?",
      te: "రైతు నుండి స్పందన వచ్చిందా?",
      ta: "விவசாயி பதிலளித்துவிட்டாரா?",
    },
    answer: {
      en: "Check the status next to your application — it will show Pending, Accepted, or Declined.",
      hi: "अपने आवेदन के आगे की स्थिति जांचें — यह Pending, Accepted या Declined दिखाई देगी।",
      te: "మీ దరఖాస్తు పక్కన ఉన్న స్థితిని చూడండి — అది పెండింగ్, ఆమోదించబడింది లేదా తిరస్కరించబడింది అని చూపిస్తుంది.",
      ta: "உங்கள் விண்ணப்பத்தின் அருகிலுள்ள நிலையை சரிபார்க்கவும் — அது Pending, Accepted அல்லது Declined என காட்டும்.",
    },
  },
  {
    id: "labour_how_do_i_cancel_my_application",
    role: "labour",
    section: "applied",
    label: {
      en: "How do I cancel my application?",
      hi: "मैं अपना आवेदन कैसे रद्द करूं?",
      te: "నా దరఖాస్తును ఎలా రద్దు చేసుకోవాలి?",
      ta: "எனது விண்ணப்பத்தை எவ்வாறு ரத்து செய்வது?",
    },
    answer: {
      en: "Open the job from your Applied tab and tap 'Withdraw Application'.",
      hi: "अपने Applied टैब से उस काम को खोलें और 'Withdraw Application' पर टैप करें।",
      te: "మీ Applied ట్యాబ్ నుండి ఆ పనిని తెరిచి 'Withdraw Application' పై నొక్కండి.",
      ta: "Applied தாவலில் இருந்து வேலையைத் திறந்து 'Withdraw Application' என்பதைத் தட்டவும்.",
    },
  },

  // =========================================================================
  // 4. FPO MANAGER ROLE
  // =========================================================================
  // Default prompts
  {
    id: "fpo_how_many_members_are_at_risk_today",
    role: "fpo",
    section: "default",
    label: {
      en: "How many members are at risk today?",
      hi: "आज कितने सदस्य जोखिम (Risk) में हैं?",
      te: "ఈరోజు ఎంతమంది సభ్యులు రిస్క్‌లో ఉన్నారు?",
      ta: "இன்று எத்தனை உறுப்பினர்கள் இடர் நிலையில் உள்ளனர்?",
    },
    answer: {
      en: "Currently, 10% of your members are showing High Risk status, mainly due to soil moisture deficits.",
      hi: "वर्तमान में, आपके 10% सदस्य मुख्य रूप से मिट्टी में नमी की कमी के कारण उच्च जोखिम (High Risk) में हैं।",
      te: "ప్రస్తుతం, మీ సభ్యులలో 10% మంది ప్రధానంగా మట్టి తేమ లోపం కారణంగా అధిక రిస్క్ స్థితిలో ఉన్నారు.",
      ta: "தற்போது, உங்கள் உறுப்பினர்களில் 10% பேர் முக்கியமாக மண் ஈரப்பதம் பற்றாக்குறை காரணமாக அதிக ஆபத்தில் உள்ளனர்.",
    },
  },
  {
    id: "fpo_show_todays_alerts_summary",
    role: "fpo",
    section: "default",
    label: {
      en: "Show today's alerts summary",
      hi: "आज का अलर्ट सारांश दिखाएं",
      te: "నేటి హెచ్చరికల సారాంశాన్ని చూపించండి",
      ta: "இன்றைய எச்சரிக்கைகளின் சுருக்கத்தைக் காட்டு",
    },
    answer: {
      en: "You have 5 active alerts today across your members — mostly related to irrigation timing and one pest cluster warning.",
      hi: "आज आपके सदस्यों में 5 सक्रिय अलर्ट हैं — ज्यादातर सिंचाई के समय और एक कीट क्लस्टर चेतावनी से संबंधित हैं।",
      te: "ఈరోజు మీ సభ్యులలో 5 హెచ్చరికలు ఉన్నాయి — ఎక్కువగా నీటిపారుదల సమయం మరియు ఒక తెగుళ్ల హెచ్చరికకు సంబంధించినవి.",
      ta: "இன்று உங்கள் உறுப்பினர்களிடையே 5 எச்சரிக்கைகள் உள்ளன — பெரும்பாலும் பாசன நேரம் மற்றும் ஒரு பூச்சி எச்சரிக்கை.",
    },
  },
  {
    id: "fpo_which_crops_need_attention_this_week",
    role: "fpo",
    section: "default",
    label: {
      en: "Which crops need attention this week?",
      hi: "इस सप्ताह किन फसलों पर ध्यान देने की आवश्यकता है?",
      te: "ఈ వారం ఏ పంటలపై దృష్టి పెట్టాలి?",
      ta: "இந்த வாரம் எந்த பயிர்களில் கவனம் செலுத்த வேண்டும்?",
    },
    answer: {
      en: "Wheat and Mustard fields across several members are showing early signs of moisture stress this week.",
      hi: "कई सदस्यों के गेहूं और सरसों के खेतों में इस सप्ताह नमी के तनाव के शुरुआती लक्षण दिख रहे हैं।",
      te: "ఈ వారం పలువురు సభ్యుల గోధుమ మరియు ఆవాల పొలాల్లో తేమ లోపం ప్రారంభ సంకేతాలు కనిపిస్తున్నాయి.",
      ta: "பல உறுப்பினர்களின் கோதுமை மற்றும் கடுகு வயல்களில் இந்த வாரம் ஈரப்பத பற்றாக்குறை அறிகுறிகள் தென்படுகின்றன.",
    },
  },
  {
    id: "fpo_how_do_i_send_a_broadcast_alert",
    role: "fpo",
    section: "default",
    label: {
      en: "How do I send a broadcast alert?",
      hi: "मैं ब्रॉडकास्ट अलर्ट कैसे भेजूं?",
      te: "నేను బ్రాడ్‌కాస్ట్ హెచ్చరికను ఎలా పంపాలి?",
      ta: "அனைவருக்கும் எச்சரிக்கை செய்தியை எப்படி அனுப்புவது?",
    },
    answer: {
      en: "Go to Broadcast/Alerts, select your member group, type your message, and tap Send.",
      hi: "Broadcast/Alerts पर जाएं, अपना सदस्य समूह चुनें, संदेश टाइप करें और Send पर टैप करें।",
      te: "Broadcast/Alerts కు వెళ్లి, మీ సభ్యుల సమూహాన్ని ఎంచుకుని, సందేశాన్ని టైప్ చేసి Send నొక్కండి.",
      ta: "Broadcast/Alerts பகுதிக்குச் சென்று, குழுவைத் தேர்ந்தெடுத்து, செய்தியைத் தட்டச்சு செய்து Send அழுத்தவும்.",
    },
  },

  // Dashboard/Overview section
  {
    id: "fpo_why_is_the_average_risk_score_high",
    role: "fpo",
    section: "overview",
    label: {
      en: "Why is the average risk score high?",
      hi: "औसत रिस्क स्कोर अधिक क्यों है?",
      te: "సగటు రిస్క్ స్కోర్ ఎందుకు ఎక్కువగా ఉంది?",
      ta: "சராசரி இடர் மதிப்பெண் ஏன் அதிகமாக உள்ளது?",
    },
    answer: {
      en: "The average risk score is slightly elevated due to a regional dry spell affecting several members' soil moisture levels.",
      hi: "क्षेत्रीय शुष्क मौसम (dry spell) के कारण कई सदस्यों की मिट्टी की नमी प्रभावित होने से औसत रिस्क स्कोर थोड़ा बढ़ गया है।",
      te: "ప్రాంతీయ పొడి వాతావరణం వల్ల పలువురు సభ్యుల మట్టి తేమ తగ్గడంతో సగటు రిస్క్ స్కోర్ కొద్దిగా పెరిగింది.",
      ta: "வறண்ட வானிலை காரணமாக பல உறுப்பினர்களின் மண் ஈரப்பதம் குறைந்ததால் சராசரி இடர் மதிப்பெண் சற்று உயர்ந்துள்ளது.",
    },
  },
  {
    id: "fpo_which_region_has_the_most_alerts",
    role: "fpo",
    section: "overview",
    label: {
      en: "Which region has the most alerts?",
      hi: "किस क्षेत्र में सबसे अधिक अलर्ट हैं?",
      te: "ఏ ప్రాంతంలో ఎక్కువ హెచ్చరికలు ఉన్నాయి?",
      ta: "எந்த பகுதியில் அதிக எச்சரிக்கைகள் உள்ளன?",
    },
    answer: {
      en: "The eastern block of your member farms currently has the highest number of active alerts.",
      hi: "आपके सदस्य खेतों के पूर्वी ब्लॉक (Eastern Block) में वर्तमान में सबसे अधिक सक्रिय अलर्ट हैं।",
      te: "మీ సభ్యుల పొలాల తూర్పు బ్లాక్‌లో ప్రస్తుతం అత్యధిక సంఖ్యలో హెచ్చరికలు ఉన్నాయి.",
      ta: "உங்கள் உறுப்பினர்களின் கிழக்கு பகுதியில் தற்போது அதிக எண்ணிக்கையிலான எச்சரிக்கைகள் உள்ளன.",
    },
  },

  // Member Management section
  {
    id: "fpo_how_do_i_add_a_new_member",
    role: "fpo",
    section: "members",
    label: {
      en: "How do I add a new member?",
      hi: "मैं नया सदस्य कैसे जोड़ूं?",
      te: "నేను కొత్త సభ్యుడిని ఎలా చేర్చుకోవాలి?",
      ta: "புதிய உறுப்பினரை எவ்வாறு சேர்ப்பது?",
    },
    answer: {
      en: "Tap 'Add Member', then share the generated invite code or QR code with the farmer to link their account.",
      hi: "'Add Member' पर टैप करें, फिर किसान का खाता लिंक करने के लिए उत्पन्न इनवाइट कोड या QR कोड साझा करें।",
      te: "'Add Member' పై నొక్కండి, ఆపై రైతు ఖాతాను లింక్ చేయడానికి ఇన్వైట్ కోడ్ లేదా QR కోడ్‌ను షేర్ చేయండి.",
      ta: "'Add Member' என்பதைத் தட்டி, விவசாயியின் கணக்கை இணைக்க அழைப்புக் குறியீடு அல்லது QR குறியீட்டைப் பகிரவும்.",
    },
  },
  {
    id: "fpo_show_inactive_members",
    role: "fpo",
    section: "members",
    label: {
      en: "Show inactive members",
      hi: "निष्क्रिय सदस्य दिखाएं",
      te: "నిష్క్రియ సభ్యులను చూపించండి",
      ta: "செயலற்ற உறுப்பினர்களைக் காட்டு",
    },
    answer: {
      en: "Here are members who haven't logged in or updated data in the last 30 days.",
      hi: "यहाँ वे सदस्य हैं जिन्होंने पिछले 30 दिनों में लॉगिन नहीं किया है या डेटा अपडेट नहीं किया है।",
      te: "గత 30 రోజుల్లో లాగిన్ అవ్వని లేదా డేటాను అప్‌డేట్ చేయని సభ్యులు ఇక్కడ ఉన్నారు.",
      ta: "கடந்த 30 நாட்களில் உள்நுழையாத அல்லது தரவைப் புதுப்பிக்காத உறுப்பினர்கள் இங்கே உள்ளனர்.",
    },
  },

  // Bulk Insights & Reports section
  {
    id: "fpo_generate_this_months_report",
    role: "fpo",
    section: "reports",
    label: {
      en: "Generate this month's report",
      hi: "इस महीने की रिपोर्ट तैयार करें",
      te: "ఈ నెల నివేదికను రూపొందించండి",
      ta: "இந்த மாத அறிக்கையை உருவாக்கவும்",
    },
    answer: {
      en: "Generating your monthly summary report — this will include member risk trends, crop breakdown, and alert history.",
      hi: "आपकी मासिक सारांश रिपोर्ट तैयार की जा रही है — इसमें सदस्य जोखिम रुझान, फसल विवरण और अलर्ट इतिहास शामिल होगा।",
      te: "మీ నెలవారీ సారాంశ నివేదిక రూపొందించబడుతోంది — ఇందులో సభ్యుల రిస్క్ ట్రెండ్‌లు, పంట వివరాలు మరియు హెచ్చరికల చరిత్ర ఉంటాయి.",
      ta: "உங்கள் மாதாந்திர சுருக்க அறிக்கை உருவாக்கப்படுகிறது — இதில் இடர் போக்குகள், பயிர் விவரங்கள் மற்றும் எச்சரிக்கை வரலாறு இருக்கும்.",
    },
  },
  {
    id: "fpo_which_disease_is_spreading_across_members",
    role: "fpo",
    section: "reports",
    label: {
      en: "Which disease is spreading across members?",
      hi: "सदस्यों में कौन सी बीमारी फैल रही है?",
      te: "సభ్యులలో ఏ తెగులు వ్యాపిస్తోంది?",
      ta: "உறுப்பினர்களிடையே எந்த நோய் பரவுகிறது?",
    },
    answer: {
      en: "Early blight has been reported by multiple members in the same region this week — consider a broadcast advisory.",
      hi: "इस सप्ताह एक ही क्षेत्र के कई सदस्यों द्वारा अगेती झुलसा (Early Blight) की सूचना दी गई है — ब्रॉडकास्ट सलाह भेजने पर विचार करें।",
      te: "ఈ వారం ఒకే ప్రాంతంలోని పలువురు సభ్యులు ఎర్లీ బ్లైట్ తెగులును నివేదించారు — బ్రాడ్‌కాస్ట్ సలహాను పంపడం మంచిది.",
      ta: "இந்த வாரம் ஒரே பகுதியில் உள்ள பல உறுப்பினர்களால் ஆரம்பக்கால இலைக்கருகல் நோய் பதிவாகியுள்ளது — ஆலோசனை செய்தி அனுப்பவும்.",
    },
  },

  // Broadcast/Alerts section
  {
    id: "fpo_send_a_weather_warning_to_all_members",
    role: "fpo",
    section: "broadcast",
    label: {
      en: "Send a weather warning to all members",
      hi: "सभी सदस्यों को मौसम की चेतावनी भेजें",
      te: "అన్ని సభ్యులకు వాతావరణ హెచ్చరికను పంపండి",
      ta: "அனைத்து உறுப்பினர்களுக்கும் வானிலை எச்சரிக்கையை அனுப்பவும்",
    },
    answer: {
      en: "Drafting a weather warning broadcast — review and tap Send to notify all members.",
      hi: "मौसम चेतावनी ब्रॉडकास्ट का मसौदा तैयार किया जा रहा है — समीक्षा करें और सभी सदस्यों को सूचित करने के लिए Send दबाएं।",
      te: "వాతావరణ హెచ్చరిక డ్రాఫ్ట్ చేయబడుతోంది — సమీక్షించి సభ్యులందరికీ పంపడానికి Send నొక్కండి.",
      ta: "வானிலை எச்சரிக்கை செய்தி உருவாக்கப்படுகிறது — சரிபார்த்து அனைவருக்கும் அனுப்ப Send அழுத்தவும்.",
    },
  },
  {
    id: "fpo_notify_members_about_fertilizer_subsidy",
    role: "fpo",
    section: "broadcast",
    label: {
      en: "Notify members about fertilizer subsidy",
      hi: "खाद सब्सिडी के बारे में सदस्यों को सूचित करें",
      te: "ఎరువుల సబ్సిడీ గురించి సభ్యులకు తెలియజేయండి",
      ta: "உர மானியம் குறித்து உறுப்பினர்களுக்கு தெரிவிக்கவும்",
    },
    answer: {
      en: "Drafting a subsidy notification — review and tap Send to notify all members.",
      hi: "सब्सिडी अधिसूचना का मसौदा तैयार किया जा रहा है — समीक्षा करें और सभी सदस्यों को सूचित करने के लिए Send दबाएं।",
      te: "సబ్సిడీ సమాచారం డ్రాఫ్ట్ చేయబడుతోంది — సమీక్షించి సభ్యులందరికీ పంపడానికి Send నొక్కండి.",
      ta: "மானிய அறிவிப்பு செய்தி உருவாக்கப்படுகிறது — சரிபார்த்து அனைவருக்கும் அனுப்ப Send அழுத்தவும்.",
    },
  },
];

/**
 * Normalizes text for robust key matching across minor punctuation and whitespace differences
 */
function normalizeQuestion(text: string): string {
  return (text || "")
    .toLowerCase()
    .replace(/[—–\-?.,!'"“”‘’/\\()[\]{}:;]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Build fast O(1) lookup dictionary for labels in all languages and direct IDs
const PROMPT_LOOKUP_MAP = new Map<string, PromptDefinition>();

for (const prompt of SUGGESTED_PROMPTS) {
  PROMPT_LOOKUP_MAP.set(prompt.id, prompt);
  for (const lang of ["en", "hi", "te", "ta"] as LanguageCode[]) {
    const labelText = prompt.label[lang];
    if (labelText) {
      PROMPT_LOOKUP_MAP.set(normalizeQuestion(labelText), prompt);
    }
  }
}

/**
 * Checks if a question is one of the suggested/quick-tap questions and returns
 * its exact hardcoded response immediately without any API call or delay.
 */
export function getHardcodedSuggestedAnswer(
  questionText: string,
  targetLang: LanguageCode = "en"
): { found: true; reply: string; spokenText: string } | { found: false } {
  if (!questionText) return { found: false };

  const norm = normalizeQuestion(questionText);
  const matchedPrompt = PROMPT_LOOKUP_MAP.get(norm);

  if (matchedPrompt) {
    const reply = matchedPrompt.answer[targetLang] || matchedPrompt.answer.en;
    return {
      found: true,
      reply,
      spokenText: reply,
    };
  }

  // Fallback fuzzy substring matching on English prompts
  for (const prompt of SUGGESTED_PROMPTS) {
    const enNorm = normalizeQuestion(prompt.label.en);
    if (norm === enNorm || norm.includes(enNorm) || enNorm.includes(norm)) {
      const reply = prompt.answer[targetLang] || prompt.answer.en;
      return {
        found: true,
        reply,
        spokenText: reply,
      };
    }
  }

  return { found: false };
}

export interface SuggestedPromptItem {
  id: string;
  text: string;
  category?: string;
  spokenText?: string;
  actionType?: string;
  isSeasonal?: boolean;
}

/**
 * Helper to retrieve suggested questions for a given role and optional section
 */
export function getPromptsForRoleAndSection(
  role: UserRole,
  section?: string,
  language: LanguageCode = "en"
): { id: string; label: string; answer: string }[] {
  let filtered = SUGGESTED_PROMPTS.filter((p) => p.role === role);
  if (section && section !== "default") {
    const sectionSpecific = filtered.filter((p) => p.section === section);
    if (sectionSpecific.length > 0) {
      filtered = sectionSpecific;
    }
  }

  return filtered.map((p) => ({
    id: p.id,
    label: p.label[language] || p.label.en,
    answer: p.answer[language] || p.answer.en,
  }));
}

/**
 * Backward-compatible helper for UI components displaying the prompt chips
 */
export function getSuggestedPrompts(
  role: UserRole,
  section: string = "default",
  language: LanguageCode = "en",
  pendingActionTitle?: string
): SuggestedPromptItem[] {
  // Normalize section
  let sec = section;
  if (sec === "job_feed") sec = "jobs";
  if (sec === "profile_skills") sec = "profile";
  if (sec === "applied_jobs") sec = "applied";
  if (sec === "dashboard") sec = "overview";

  const list = getPromptsForRoleAndSection(role, sec, language);
  return list.map((item) => ({
    id: item.id,
    text: item.label,
    spokenText: item.label,
    actionType: item.id.includes("scan") ? "scan" : undefined,
  }));
}
