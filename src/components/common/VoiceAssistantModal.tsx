import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Mic,
  Send,
  Camera,
  Volume2,
  VolumeX,
  Sparkles,
  User,
} from "lucide-react";
import { UserRole, LanguageCode, ChatMessage, UserProfile, IoTSensorData, FarmRiskFactor, PriorityAction, MarketPriceItem } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { sendChatMessage, diagnoseCropImage } from "../../services/api";
import { speakText, stopSpeaking, soundEffects, createSpeechRecognizer } from "../../utils/audio";
import { AgriVisionLogo } from "./AgriVisionLogo";
import { getSuggestedPrompts, SuggestedPromptItem, getHardcodedSuggestedAnswer } from "../../data/suggestedPrompts";
import { INITIAL_JOB_LISTINGS, INITIAL_PLANTS, INITIAL_USER_PROFILE, INITIAL_IOT_DATA, INITIAL_RISK_FACTORS, INITIAL_PRIORITY_ACTIONS, INITIAL_MARKET_PRICES } from "../../data/mockData";
import { INITIAL_FPO_PROFILE, INITIAL_FPO_MEMBERS } from "../../data/fpoData";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  currentLanguage: LanguageCode;
  initialQuery?: string;
  initialImage?: string;
  sourceSection?: string;
  pendingActionTitle?: string;
  userProfile?: UserProfile;
  iotData?: IoTSensorData;
  riskFactors?: FarmRiskFactor[];
  priorityActions?: PriorityAction[];
  marketPrices?: MarketPriceItem[];
  onNavigateAction?: (actionType: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  currentLanguage,
  initialQuery,
  initialImage,
  sourceSection = "default",
  pendingActionTitle,
  userProfile,
  iotData,
  riskFactors,
  priorityActions,
  marketPrices,
  onNavigateAction,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const getRoleWelcome = () => {
    const isHindi = currentLanguage === "hi";
    switch (currentRole) {
      case "farmer":
        return isHindi
          ? "नमस्ते! मैं आपका एग्रीविजन AI सलाहकार हूँ। मुझसे फसल स्वास्थ्य, खेत रिस्क, IoT सेंसर, आज के मंडी भाव या मजदूर बुकिंग के बारे में पूछें।"
          : "Namaste! I am your AgriVision AI Copilot. Ask me in your voice about crop health, farm risk, IoT sensor data, today's mandi rates, or booking local farm labour.";
      case "gardener":
        return isHindi
          ? "नमस्ते! मैं आपका होम गार्डनिंग AI सहायक हूँ। मुझसे गमलों में पानी डालने, धूप की जरूरत, जैविक खाद या पत्तों की बीमारी के बारे में पूछें।"
          : "Hello! I am your Plant Care Assistant. Ask me about watering schedules, balcony sunlight, potting soil, natural pest remedies, or leaf yellowing for your potted plants.";
      case "labour":
        return isHindi
          ? "नमस्ते! मैं आपका रोजगार AI सहायक हूँ। मुझसे नजदीकी फसल कटाई के काम, दैनिक मजदूरी, आवेदन की स्थिति या हुनर प्रोफाइल के बारे में पूछें।"
          : "Namaste! I am your Job Assistant. Ask me about high-paying harvesting jobs nearby, daily wage rates, application status, or updating your farm skills.";
      case "fpo":
        return isHindi
          ? "नमस्ते! मैं आपका FPO AI कोपायलट हूँ। मुझसे सदस्य क्लस्टर रिस्क, गांवों में रोग प्रकोप, थोक खाद खरीद या SMS ब्रॉडकास्ट के बारे में पूछें।"
          : "Welcome! I am your FPO AI Copilot. Ask me about member cluster risk, disease outbreaks across villages, IoT moisture telemetry, collective input bulk buying, or broadcasting advisories.";
      default:
        return t.assistant.subtitle;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg-welcome",
      sender: "assistant",
      text: getRoleWelcome(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      spokenText: getRoleWelcome(),
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [currentlySpeakingPromptId, setCurrentlySpeakingPromptId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>(sourceSection || "default");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const recognizerRef = useRef<any>(null);

  // Sync selectedSection and welcome message whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSection(sourceSection || "default");
      // Reset welcome message for active role if chat only has welcome
      setMessages((prev) => {
        if (prev.length <= 1) {
          const welcome = getRoleWelcome();
          return [
            {
              id: "msg-welcome",
              sender: "assistant",
              text: welcome,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              spokenText: welcome,
            },
          ];
        }
        return prev;
      });
    }
  }, [isOpen, sourceSection, currentRole, currentLanguage]);

  // Auto scroll to latest message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle initial query if opened with one
  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSendMessage(initialQuery);
    }
    if (isOpen && initialImage) {
      setSelectedImage(initialImage);
    }
  }, [isOpen, initialQuery, initialImage]);

  if (!isOpen) return null;

  // Category navigation tabs per role
  const getRoleSections = (): { id: string; label: string }[] => {
    const isHindi = currentLanguage === "hi";
    const isTelugu = currentLanguage === "te";
    const isTamil = currentLanguage === "ta";

    switch (currentRole) {
      case "farmer":
        return [
          { id: "default", label: isHindi ? "मुख्य सुझाव" : isTelugu ? "డిఫాల్ట్" : isTamil ? "முக்கியம்" : "Default" },
          { id: "home", label: isHindi ? "खेत रिस्क" : isTelugu ? "పొలం రిస్క్" : isTamil ? "இடர் மேலாண்மை" : "Farm Risk" },
          { id: "disease_scan", label: isHindi ? "रोग जांच" : isTelugu ? "తెగులు స్కాన్" : isTamil ? "நோய் ஸ்கேன்" : "Disease Scan" },
          { id: "smart_sensors", label: isHindi ? "स्मार्ट सेंसर" : isTelugu ? "సెన్సార్లు" : isTamil ? "சென்சார்கள்" : "Sensors (IoT)" },
          { id: "mandi_rates", label: isHindi ? "मंडी भाव" : isTelugu ? "మార్కెట్ ధరలు" : isTamil ? "மண்டி விலை" : "Mandi Rates" },
          { id: "fertilizer_recommend", label: isHindi ? "खाद सलाह" : isTelugu ? "ఎరువులు" : isTamil ? "உர பரிந்துரை" : "Fertilizer" },
          { id: "yield_prediction", label: isHindi ? "उपज अनुमान" : isTelugu ? "దిగుబడి" : isTamil ? "விளைச்சல்" : "Yield Forecast" },
          { id: "hire_labour", label: isHindi ? "मजदूर बुक" : isTelugu ? "కూలీలు" : isTamil ? "வேலையாட்கள்" : "Hire Labour" },
        ];
      case "gardener":
        return [
          { id: "default", label: isHindi ? "मुख्य सुझाव" : isTelugu ? "డిఫాల్ట్" : isTamil ? "முக்கியம்" : "Default" },
          { id: "plants", label: isHindi ? "मेरे पौधे" : isTelugu ? "నా మొక్కలు" : isTamil ? "என் செடிகள்" : "My Plants" },
          { id: "disease_scan", label: isHindi ? "रोग जांच" : isTelugu ? "తెగులు స్కాన్" : isTamil ? "நோய் ஸ்கேன்" : "Plant Doctor" },
          { id: "water", label: isHindi ? "सिंचाई व मौसम" : isTelugu ? "నీరు & వాతావరణం" : isTamil ? "நீர்ப்பாசனம்" : "Water & Weather" },
          { id: "gardening_help", label: isHindi ? "बागवानी गाइड" : isTelugu ? "గార్డెనింగ్ సహాయం" : isTamil ? "தோட்டக்கலை" : "Gardening Tips" },
        ];
      case "labour":
        return [
          { id: "default", label: isHindi ? "मुख्य सुझाव" : isTelugu ? "డిఫాల్ట్" : isTamil ? "முக்கியம்" : "Default" },
          { id: "job_feed", label: isHindi ? "काम खोजें" : isTelugu ? "పనుల ఫీడ్" : isTamil ? "வேலைகள்" : "Job Feed" },
          { id: "profile_skills", label: isHindi ? "हुनर व प्रोफाइल" : isTelugu ? "నైపుణ్యాలు" : isTamil ? "திறமைகள்" : "Skills & Profile" },
          { id: "applied_jobs", label: isHindi ? "आवेदन की गई" : isTelugu ? "దరఖాస్తులు" : isTamil ? "விண்ணப்பங்கள்" : "Applied Jobs" },
        ];
      case "fpo":
        return [
          { id: "default", label: isHindi ? "मुख्य सुझाव" : isTelugu ? "డిఫాల్ట్" : isTamil ? "முக்கியம்" : "Default" },
          { id: "dashboard", label: isHindi ? "डैशबोर्ड" : isTelugu ? "డ్యాష్‌బోర్డ్" : isTamil ? "முகப்பு" : "Dashboard" },
          { id: "members", label: isHindi ? "किसान सदस्य" : isTelugu ? "సభ్యులు" : isTamil ? "உறுப்பினர்கள்" : "Members" },
          { id: "reports", label: isHindi ? "रिपोर्ट्स व डेटा" : isTelugu ? "నివేదికలు" : isTamil ? "அறிக்கைகள்" : "Reports & Insights" },
          { id: "broadcast", label: isHindi ? "ब्रॉडकास्ट अलर्ट" : isTelugu ? "బ్రాడ్‌కాస్ట్" : isTamil ? "அறிவிப்புகள்" : "Broadcast" },
        ];
      default:
        return [{ id: "default", label: "Default" }];
    }
  };

  const currentPrompts = getSuggestedPrompts(
    currentRole,
    selectedSection,
    currentLanguage,
    pendingActionTitle
  );

  const handlePlayAudio = (msgId: string, textToSpeak: string) => {
    if (currentlySpeakingId === msgId) {
      stopSpeaking();
      setCurrentlySpeakingId(null);
      return;
    }
    soundEffects.click();
    setCurrentlySpeakingPromptId(null);
    setCurrentlySpeakingId(msgId);
    speakText(
      textToSpeak,
      currentLanguage,
      () => setCurrentlySpeakingId(msgId),
      () => setCurrentlySpeakingId(null)
    );
  };

  const handleSpeakPrompt = (promptId: string, textToSpeak: string) => {
    if (currentlySpeakingPromptId === promptId) {
      stopSpeaking();
      setCurrentlySpeakingPromptId(null);
      return;
    }
    soundEffects.click();
    setCurrentlySpeakingId(null);
    setCurrentlySpeakingPromptId(promptId);
    speakText(
      textToSpeak,
      currentLanguage,
      () => setCurrentlySpeakingPromptId(promptId),
      () => setCurrentlySpeakingPromptId(null)
    );
  };

  const handlePromptClick = (prompt: SuggestedPromptItem) => {
    soundEffects.click();
    stopSpeaking();
    setCurrentlySpeakingId(null);
    setCurrentlySpeakingPromptId(null);

    // If it's an action-oriented prompt and deep linking is provided, execute action
    if (prompt.actionType && onNavigateAction) {
      onNavigateAction(prompt.actionType);
      return;
    }

    // Otherwise send as chat message
    handleSendMessage(prompt.text);
  };

  const handleStartVoiceRecording = () => {
    soundEffects.click();
    if (isRecording) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      currentLanguage,
      (transcript) => {
        setInputVal(transcript);
      },
      (error) => {
        console.warn("Speech recognition error:", error);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
        setIsRecording(true);
      } catch (err) {
        console.warn("Recognizer start failed:", err);
      }
    } else {
      // Fallback: simulate voice transcription
      setIsRecording(true);
      setTimeout(() => {
        const sampleQuery =
          currentRole === "farmer"
            ? "Should I water my crop today?"
            : currentRole === "gardener"
            ? "Why are my tomato leaves turning yellow?"
            : currentRole === "labour"
            ? "Show harvesting jobs near me"
            : "Show disease cluster summary across member farms";
        setInputVal(sampleQuery);
        setIsRecording(false);
      }, 2000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEffects.camera();
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const queryText = (textOverride || inputVal).trim();
    if (!queryText && !selectedImage) return;

    soundEffects.click();
    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: queryText || "Analyzed crop photo",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      imageUri: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal("");
    const imgToSend = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let replyText = "";
      let spokenText = "";

      // Check if this query matches one of our exact hardcoded suggested questions
      const hardcoded = !imgToSend ? getHardcodedSuggestedAnswer(queryText, currentLanguage) : { found: false as const };

      if (hardcoded.found) {
        replyText = hardcoded.reply;
        spokenText = hardcoded.spokenText;
      } else if (imgToSend) {
        // Run diagnosis on photo
        const diagnosis = await diagnoseCropImage({
          imageBase64: imgToSend,
          cropName: queryText || "Field Crop",
          language: currentLanguage,
          role: currentRole,
        });

        replyText = `🌿 **Diagnosis: ${diagnosis.diseaseName}** (${diagnosis.confidence}% confidence)\n\n• **Status:** ${
          diagnosis.isHealthy ? "Healthy & Strong" : diagnosis.severity.toUpperCase() + " Severity"
        }\n• **Symptom:** ${diagnosis.description}\n• **Organic Cure:** ${
          diagnosis.organicRemedy
        }\n• **Chemical Spray:** ${diagnosis.chemicalTreatment}`;
        spokenText = diagnosis.spokenAdvice;
      } else {
        const effectiveProfile = userProfile || INITIAL_USER_PROFILE;
        const effectiveIot = iotData || INITIAL_IOT_DATA;
        const effectiveRiskFactors = riskFactors || INITIAL_RISK_FACTORS;
        const effectivePriorityActions = priorityActions || INITIAL_PRIORITY_ACTIONS;
        const effectiveMarketPrices = marketPrices || INITIAL_MARKET_PRICES;

        const chatRes = await sendChatMessage({
          message: queryText,
          role: currentRole,
          language: currentLanguage,
          context: {
            role: currentRole,
            language: currentLanguage,
            section: selectedSection,
            userProfile: effectiveProfile,
            iotData: effectiveIot,
            riskFactors: effectiveRiskFactors,
            priorityActions: effectivePriorityActions,
            marketPrices: effectiveMarketPrices,
            availableJobs: INITIAL_JOB_LISTINGS,
            gardenerPlants: INITIAL_PLANTS,
            fpoProfile: INITIAL_FPO_PROFILE,
            fpoMembers: INITIAL_FPO_MEMBERS,
          },
        });
        replyText = chatRes.reply;
        spokenText = chatRes.spokenText;
      }

      const botMsgId = `bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        spokenText,
      };

      setMessages((prev) => [...prev, botMsg]);
      soundEffects.success();

      // Automatically speak the response
      speakText(
        spokenText,
        currentLanguage,
        () => setCurrentlySpeakingId(botMsgId),
        () => setCurrentlySpeakingId(null)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="voice-assistant-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="voice-assistant-container"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col h-[90vh] max-h-[750px] overflow-hidden border border-emerald-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-900 p-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shadow-xs border border-emerald-300/60">
              <AgriVisionLogo size={32} />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg flex items-center gap-1.5">
                {t.assistant.title}
                <Sparkles size={16} className="text-yellow-300 animate-pulse" />
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                {currentRole === "farmer"
                  ? "Smart Kisan AI Companion"
                  : currentRole === "gardener"
                  ? "Home Plant Doctor & Advisor"
                  : currentRole === "labour"
                  ? "Farm Worker Job Assistant"
                  : "FPO Strategic Intelligence AI"}
              </p>
            </div>
          </div>

          <button
            id="close-assistant-btn"
            type="button"
            onClick={() => {
              stopSpeaking();
              soundEffects.click();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Chat History */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-white border border-emerald-300 p-0.5 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <AgriVisionLogo size={22} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs transition-all ${
                    isUser
                      ? "bg-emerald-700 text-white rounded-tr-xs"
                      : "bg-white text-stone-900 border border-stone-200 rounded-tl-xs"
                  }`}
                >
                  {/* Attached photo thumbnail if any */}
                  {msg.imageUri && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 max-h-48">
                      <img
                        src={msg.imageUri}
                        alt="Attached crop"
                        className="w-full h-auto object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="text-sm font-medium whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-black/10 text-[10px] opacity-80">
                    <span>{msg.timestamp}</span>

                    {/* Audio Listen button for assistant message */}
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(msg.id, msg.spokenText || msg.text)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-bold transition-all ${
                          currentlySpeakingId === msg.id
                            ? "bg-emerald-600 text-white animate-pulse"
                            : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        }`}
                      >
                        {currentlySpeakingId === msg.id ? (
                          <>
                            <VolumeX size={12} />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={12} />
                            <span>{t.common.listen}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-stone-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-stone-700 text-xs font-semibold">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center animate-spin">
                <Sparkles size={16} />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>{t.common.loading}</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Image Preview before sending */}
        {selectedImage && (
          <div className="p-3 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={selectedImage}
                alt="Selected preview"
                className="w-12 h-12 rounded-xl object-cover border border-emerald-300 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-bold text-emerald-900">
                Photo attached. Ready to diagnose!
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="p-1 rounded-full text-stone-700 hover:bg-stone-200"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Voice recording state waveform banner */}
        {isRecording && (
          <div className="bg-rose-50 border-t border-rose-200 p-3 flex items-center justify-center gap-3 text-rose-800 font-bold text-sm animate-pulse">
            <Mic size={20} className="text-rose-600 animate-bounce" />
            <span>{t.assistant.listening}</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-pulse" />
              <span className="w-1.5 h-6 bg-rose-600 rounded-full animate-pulse delay-75" />
              <span className="w-1.5 h-8 bg-rose-700 rounded-full animate-pulse delay-150" />
              <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-pulse delay-100" />
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAPPABLE SUGGESTED QUICK PROMPTS (ROLE & SECTION SCOPED) */}
        {/* ==================================================== */}
        <div className="border-t border-stone-200 bg-stone-50/95 px-3 py-2">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-500" />
              Topics:
            </span>
            {getRoleSections().map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setSelectedSection(sec.id);
                }}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap transition-all ${
                  selectedSection === sec.id
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200"
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Quick Prompts Horizontal Chip List */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {currentPrompts.map((p) => {
              const isSpeakingThis = currentlySpeakingPromptId === p.id;
              return (
                <div
                  key={p.id}
                  id={`suggested-prompt-${p.id}`}
                  className={`inline-flex items-center rounded-2xl border text-xs font-semibold shrink-0 shadow-2xs transition-all ${
                    p.actionType
                      ? "bg-emerald-50/90 border-emerald-300 text-emerald-950 hover:bg-emerald-100"
                      : "bg-white border-stone-200 text-stone-800 hover:bg-stone-100"
                  }`}
                >
                  {/* Speaker Read-Aloud Button */}
                  <button
                    type="button"
                    title="Listen to question"
                    aria-label={`Listen to: ${p.text}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeakPrompt(p.id, p.text);
                    }}
                    className={`p-1.5 pl-2 rounded-l-2xl flex items-center justify-center transition-colors ${
                      isSpeakingThis
                        ? "text-emerald-700 bg-emerald-200 animate-pulse"
                        : "text-stone-400 hover:text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    {isSpeakingThis ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  </button>

                  {/* Divider */}
                  <span className="w-px h-3.5 bg-stone-300/80" />

                  {/* Tappable Prompt Text */}
                  <button
                    type="button"
                    onClick={() => handlePromptClick(p)}
                    className="px-2.5 py-1.5 pr-3 text-left whitespace-nowrap active:scale-95 transition-transform flex items-center gap-1.5"
                  >
                    <span>{p.text}</span>
                    {p.actionType && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-emerald-700 text-white tracking-wider">
                        Go
                      </span>
                    )}
                    {p.isSeasonal && (
                      <span className="text-[10px]" title="Seasonal suggestion">
                        🌱
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Bar: Camera + Mic + Text + Send */}
        <div className="p-3 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Camera Photo Picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
              id="assistant-camera-input"
            />
            <button
              type="button"
              onClick={() => {
                soundEffects.camera();
                fileInputRef.current?.click();
              }}
              title={t.assistant.snapPhoto}
              className="p-3 rounded-2xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-300 min-w-[48px] min-h-[48px] flex items-center justify-center active:scale-90 transition-transform"
            >
              <Camera size={22} />
            </button>

            {/* Voice Mic Button */}
            <button
              type="button"
              onClick={handleStartVoiceRecording}
              title={t.assistant.tapToSpeak}
              className={`p-3 rounded-2xl min-w-[48px] min-h-[48px] flex items-center justify-center active:scale-90 transition-all font-bold ${
                isRecording
                  ? "bg-rose-600 text-white shadow-lg ring-4 ring-rose-200 animate-bounce"
                  : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300"
              }`}
            >
              <Mic size={22} />
            </button>

            {/* Text Input Field */}
            <input
              id="assistant-text-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t.assistant.askPlaceholder}
              className="flex-1 bg-stone-100 border border-stone-300 rounded-2xl px-3.5 py-3 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium placeholder:text-stone-700"
            />

            {/* Send Button */}
            <button
              id="assistant-send-btn"
              type="submit"
              disabled={isLoading || (!inputVal.trim() && !selectedImage)}
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-md min-w-[48px] min-h-[48px] flex items-center justify-center active:scale-95 transition-all"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

