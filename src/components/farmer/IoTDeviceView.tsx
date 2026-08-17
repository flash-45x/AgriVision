import React, { useState, useEffect } from "react";
import {
  Cpu,
  Droplets,
  Power,
  Sliders,
  QrCode,
  Battery,
  Wifi,
  WifiOff,
  RotateCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  Zap,
  Edit2,
  TrendingUp,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Info,
  Volume2,
  Play,
  Square,
  ShieldCheck,
  HelpCircle,
  FileText,
  Save,
  Plus,
  Hand,
} from "lucide-react";
import {
  LanguageCode,
  IoTSensorData,
  UserProfile,
} from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";

interface IoTDeviceViewProps {
  currentLanguage: LanguageCode;
  userProfile?: UserProfile;
  iotData: IoTSensorData;
  onTogglePump: () => void;
  onUpdateIotData?: (updated: Partial<IoTSensorData>) => void;
  onBack: () => void;
  onOpenFertilizer?: () => void;
  onOpenCropRecommend?: () => void;
  onOpenVoiceAssistantWithPrompt?: (prompt: string, section?: string) => void;
}

// 7-day historical reading items
interface HistoricalSensorDay {
  day: string;
  date: string;
  moisturePercent: number;
  ph: number;
  wateredMins: number;
  wateredType: "Auto AI" | "Manual" | "None";
}

const DEFAULT_7DAY_HISTORY: HistoricalSensorDay[] = [
  { day: "Sun", date: "Aug 10", moisturePercent: 52, ph: 6.8, wateredMins: 0, wateredType: "None" },
  { day: "Mon", date: "Aug 11", moisturePercent: 47, ph: 6.7, wateredMins: 30, wateredType: "Auto AI" },
  { day: "Tue", date: "Aug 12", moisturePercent: 44, ph: 6.8, wateredMins: 0, wateredType: "None" },
  { day: "Wed", date: "Aug 13", moisturePercent: 39, ph: 6.9, wateredMins: 35, wateredType: "Auto AI" },
  { day: "Thu", date: "Aug 14", moisturePercent: 48, ph: 6.8, wateredMins: 0, wateredType: "None" },
  { day: "Fri", date: "Aug 15", moisturePercent: 42, ph: 6.8, wateredMins: 45, wateredType: "Manual" },
  { day: "Sat (Today)", date: "Aug 16", moisturePercent: 38, ph: 6.8, wateredMins: 30, wateredType: "Auto AI" },
];

export const IoTDeviceView: React.FC<IoTDeviceViewProps> = ({
  currentLanguage,
  userProfile,
  iotData,
  onTogglePump,
  onUpdateIotData,
  onBack,
  onOpenFertilizer,
  onOpenCropRecommend,
  onOpenVoiceAssistantWithPrompt,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const isHindi = currentLanguage === "hi";

  // Connection mode simulation: "connected" | "offline" | "not_paired" | "software_only"
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "offline" | "not_paired" | "software_only">(
    iotData.pairedStatus || (iotData.isOnline ? "connected" : "offline")
  );

  // Nickname state
  const [deviceNickname, setDeviceNickname] = useState<string>(
    iotData.customNickname || "Main Field Sensor"
  );
  const [isEditingNickname, setIsEditingNickname] = useState<boolean>(false);
  const [tempNickname, setTempNickname] = useState<string>(deviceNickname);

  // Irrigation & Auto-mode state
  const [autoMode, setAutoMode] = useState<boolean>(iotData.autoIrrigationEnabled);
  const [moistureThreshold, setMoistureThreshold] = useState<number>(
    iotData.autoMoistureThreshold || 40
  );

  // Manual Duration Modal & Timer
  const [showDurationModal, setShowDurationModal] = useState<boolean>(false);
  const [selectedDurationMins, setSelectedDurationMins] = useState<number>(15);
  const [wateringTimeRemainingSec, setWateringTimeRemainingSec] = useState<number | null>(null);

  // Pairing Modal State
  const [showPairModal, setShowPairModal] = useState<boolean>(false);
  const [isPairing, setIsPairing] = useState<boolean>(false);
  const [pairedSuccess, setPairedSuccess] = useState<boolean>(false);
  const [selectedPairDeviceId, setSelectedPairDeviceId] = useState<string>("ESP32-AGRI-7749");

  // Calibration Modal State
  const [showCalibrateModal, setShowCalibrateModal] = useState<boolean>(false);
  const [calibrationStep, setCalibrationStep] = useState<number>(1);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [calibrationDone, setCalibrationDone] = useState<boolean>(false);

  // History & Trends view toggle
  const [showHistoryView, setShowHistoryView] = useState<boolean>(false);

  // Manual Soil Entry state
  const [manualPh, setManualPh] = useState<number>(iotData.soilPh || 6.8);
  const [manualNitrogen, setManualNitrogen] = useState<number>(240);
  const [manualPhosphorus, setManualPhosphorus] = useState<number>(28);
  const [manualPotassium, setManualPotassium] = useState<number>(180);
  const [manualMoisture, setManualMoisture] = useState<number>(iotData.soilMoisturePercent || 45);
  const [manualSoilType, setManualSoilType] = useState<string>(iotData.soilType || "Black Loamy Soil");
  const [manualSaved, setManualSaved] = useState<boolean>(false);
  const [showRentalModal, setShowRentalModal] = useState<boolean>(false);

  // Syncing state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncText, setLastSyncText] = useState<string>(iotData.lastSyncTime || "5 mins ago");

  // Timer countdown effect for active pump
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (iotData.pumpStatus === "ON") {
      if (wateringTimeRemainingSec === null) {
        setWateringTimeRemainingSec(selectedDurationMins * 60);
      } else if (wateringTimeRemainingSec > 0) {
        interval = setInterval(() => {
          setWateringTimeRemainingSec((prev) => {
            if (prev === null || prev <= 1) {
              // Time expired, turn off pump
              soundEffects.success();
              if (iotData.pumpStatus === "ON") onTogglePump();
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      setWateringTimeRemainingSec(null);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [iotData.pumpStatus, wateringTimeRemainingSec, selectedDurationMins]);

  // Handle threshold change
  const handleThresholdChange = (val: number) => {
    setMoistureThreshold(val);
    if (onUpdateIotData) {
      onUpdateIotData({ autoMoistureThreshold: val });
    }
  };

  // Handle auto mode toggle
  const handleToggleAutoMode = () => {
    soundEffects.click();
    const nextVal = !autoMode;
    setAutoMode(nextVal);
    if (onUpdateIotData) {
      onUpdateIotData({ autoIrrigationEnabled: nextVal });
    }
  };

  // Handle manual start watering
  const handleStartManualWatering = (mins: number) => {
    setSelectedDurationMins(mins);
    setWateringTimeRemainingSec(mins * 60);
    setShowDurationModal(false);
    soundEffects.pump(true);
    if (iotData.pumpStatus === "OFF") {
      onTogglePump();
    }
  };

  // Handle sync refresh
  const handleSyncRefresh = () => {
    soundEffects.click();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncText("Just now");
      soundEffects.success();
    }, 1200);
  };

  // Handle save nickname
  const handleSaveNickname = () => {
    soundEffects.click();
    const trimmed = tempNickname.trim() || "Main Field Sensor";
    setDeviceNickname(trimmed);
    setIsEditingNickname(false);
    if (onUpdateIotData) {
      onUpdateIotData({ customNickname: trimmed });
    }
  };

  // Simulate pairing
  const handleSimulatePairing = () => {
    soundEffects.camera();
    setIsPairing(true);
    setTimeout(() => {
      setIsPairing(false);
      setPairedSuccess(true);
      soundEffects.success();
      setTimeout(() => {
        setPairedSuccess(false);
        setShowPairModal(false);
        setConnectionStatus("connected");
        if (onUpdateIotData) {
          onUpdateIotData({
            isOnline: true,
            pairedStatus: "connected",
            deviceId: selectedPairDeviceId,
          });
        }
      }, 1500);
    }, 2200);
  };

  // Simulate calibration
  const handleRunCalibrationStep = () => {
    soundEffects.click();
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      if (calibrationStep === 1) {
        setCalibrationStep(2);
        soundEffects.success();
      } else {
        setCalibrationDone(true);
        soundEffects.success();
        setTimeout(() => {
          setShowCalibrateModal(false);
          setCalibrationDone(false);
          setCalibrationStep(1);
        }, 1800);
      }
    }, 1800);
  };

  // Status computations
  const getMoistureStatus = (m: number, threshold: number) => {
    if (m < 30) {
      return {
        level: "critical_dry",
        label: isHindi ? "अत्यधिक सूखा" : "Critically Dry",
        colorText: "text-rose-700",
        badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
        strokeColor: "#e11d48", // rose-600
        plainStatus: isHindi
          ? `मिट्टी में केवल ${m}% नमी है — तत्काल सिंचाई आवश्यक है।`
          : `Soil is dry (${m}%) — urgent irrigation needed.`,
        speech: isHindi
          ? `आपकी मिट्टी में नमी ${m} प्रतिशत है, जो बहुत कम है। सिंचाई चालू करने की सलाह है।`
          : `Your soil moisture is ${m} percent, which is very dry. Irrigation is recommended now.`,
      };
    }
    if (m < threshold) {
      return {
        level: "low",
        label: isHindi ? "कम नमी (सिंचाई निकट)" : "Low — Will Trigger Soon",
        colorText: "text-amber-700",
        badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
        strokeColor: "#f59e0b", // amber-500
        plainStatus: isHindi
          ? `मिट्टी में ${m}% नमी है — ${threshold}% थ्रेशोल्ड से नीचे, ऑटो-सिंचाई जल्द शुरू होगी।`
          : `Soil is a bit dry (${m}%) — below ${threshold}% threshold, auto-irrigation may trigger soon.`,
        speech: isHindi
          ? `आपकी मिट्टी की नमी ${m} प्रतिशत है, जो कम हो रही है। ऑटो-सिंचाई जल्द चालू हो सकती है।`
          : `Your soil moisture is ${m} percent, getting low. Auto-irrigation may start soon.`,
      };
    }
    if (m <= 75) {
      return {
        level: "optimal",
        label: isHindi ? "उत्तम नमी" : "Optimal / Good",
        colorText: "text-emerald-700",
        badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
        strokeColor: "#10b981", // emerald-500
        plainStatus: isHindi
          ? `मिट्टी में ${m}% पर्याप्त नमी है — फसल की जड़ों के लिए उत्तम।`
          : `Soil moisture is at a healthy ${m}% — ideal for root absorption.`,
        speech: isHindi
          ? `मिट्टी की नमी ${m} प्रतिशत है। फसल के लिए नमी एकदम सही है, अभी पानी देने की आवश्यकता नहीं है।`
          : `Your soil moisture is ${m} percent, which is optimal. No watering needed right now.`,
      };
    }
    return {
      level: "wet",
      label: isHindi ? "अधिक गीला" : "Saturated / Wet",
      colorText: "text-sky-700",
      badgeBg: "bg-sky-100 text-sky-900 border-sky-300",
      strokeColor: "#0284c7", // sky-600
      plainStatus: isHindi
        ? `मिट्टी में ${m}% अत्यधिक पानी है — जल निकासी सुनिश्चित करें।`
        : `Soil is heavily saturated (${m}%) — ensure drainage holes/furrows are clear.`,
      speech: isHindi
        ? `मिट्टी में नमी ${m} प्रतिशत है, जो बहुत अधिक है। पानी निकासी का ध्यान रखें।`
        : `Soil moisture is ${m} percent, fully saturated.`,
    };
  };

  const getPhStatus = (ph: number, cropName = "Wheat & Soybean") => {
    if (ph < 6.0) {
      return {
        level: "acidic",
        label: isHindi ? "अम्लीय (Acidic)" : "Acidic (Low pH)",
        colorText: "text-rose-700",
        badgeBg: "bg-rose-100 text-rose-900 border-rose-300",
        isOptimal: false,
        plainStatus: isHindi
          ? `pH (${ph}) कम है — पोषक तत्वों के अवशोषण में बाधा आ सकती है।`
          : `pH is low (${ph}) — may restrict phosphate & nitrogen uptake.`,
        actionText: isHindi ? "खाद सलाह में चूना मात्रा देखें →" : "See Lime Advisory →",
        speech: isHindi
          ? `मिट्टी का pH मान ${ph} है जो अम्लीय है। पोषक तत्वों के लिए कृषि चूने का प्रयोग करें।`
          : `Your soil pH is ${ph}, which is acidic. Agricultural lime is advised.`,
      };
    }
    if (ph > 7.5) {
      return {
        level: "alkaline",
        label: isHindi ? "क्षारीय (Alkaline)" : "Alkaline (High pH)",
        colorText: "text-indigo-700",
        badgeBg: "bg-indigo-100 text-indigo-900 border-indigo-300",
        isOptimal: false,
        plainStatus: isHindi
          ? `pH (${ph}) अधिक है — सूक्ष्म पोषक तत्वों (जिंक, आयरन) पर असर पड़ सकता है।`
          : `pH is a bit high (${ph}) — may affect micronutrient uptake (Zinc, Iron).`,
        actionText: isHindi ? "खाद सलाह में जिप्सम मात्रा देखें →" : "See Gypsum Advisory →",
        speech: isHindi
          ? `मिट्टी का pH मान ${ph} है जो क्षारीय है। जिप्सम और कम्पोस्ट का उपयोग करें।`
          : `Your soil pH is ${ph}, slightly high. Gypsum and organic compost can balance it.`,
      };
    }
    return {
      level: "optimal",
      label: isHindi ? "संतुलित / उत्तम" : "Optimal (Balanced)",
      colorText: "text-emerald-700",
      badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
      isOptimal: true,
      plainStatus: isHindi
        ? `आपकी ${cropName} फसल के लिए ${ph} pH एकदम सही है।`
        : `Good pH (${ph}) for your ${cropName} crop.`,
      actionText: isHindi ? "खाद सलाह देखें →" : "View Fertilizer Guide →",
      speech: isHindi
        ? `मिट्टी का pH मान ${ph} है, जो आपकी फसल के लिए बहुत अच्छा और संतुलित है।`
        : `Your soil pH is ${ph}, perfectly balanced for nutrient absorption.`,
    };
  };

  const moistureInfo = getMoistureStatus(iotData.soilMoisturePercent, moistureThreshold);
  const phInfo = getPhStatus(iotData.soilPh, userProfile?.primaryCrop || "Wheat");

  // Overall screen voice summary
  const screenVoiceSummary = isHindi
    ? `स्मार्ट सेंसर लाइव डेटा: मिट्टी की नमी ${iotData.soilMoisturePercent} प्रतिशत है, ${moistureInfo.plainStatus} मिट्टी का pH ${iotData.soilPh} है। मोटर पंप ${iotData.pumpStatus === "ON" ? "चालू" : "बंद"} है।`
    : `Smart Sensor Live: Soil moisture is ${iotData.soilMoisturePercent} percent. ${moistureInfo.plainStatus} Soil pH is ${iotData.soilPh}. Motor pump is currently ${iotData.pumpStatus}.`;

  return (
    <div
      id="smart-sensors-container"
      className="space-y-4 sm:space-y-5 pb-24 max-w-3xl mx-auto px-3 sm:px-4 pt-3 animate-in fade-in duration-200"
    >
      {/* 1. Header & Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          id="sensors-back-btn"
          type="button"
          onClick={() => {
            soundEffects.click();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs active:scale-95 transition-all shadow-2xs"
        >
          <ArrowLeft size={16} />
          <span>{isHindi ? "वापस" : "Back"}</span>
        </button>

        <div className="text-center flex-1 min-w-0">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl">⚡</span>
            <h2 className="font-black text-base sm:text-lg text-stone-900 truncate">
              {isHindi ? "स्मार्ट सॉइल सेंसर (IoT)" : "Smart Soil Sensors"}
            </h2>
          </div>
          <p className="text-[11px] font-bold text-stone-500 truncate">
            {isHindi ? "लाइव मिट्टी नमी, pH व ऑटो-सिंचाई" : "Live Soil Moisture, pH & Auto-Pump"}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="sensors-sync-btn"
            type="button"
            onClick={handleSyncRefresh}
            disabled={isSyncing || connectionStatus === "offline"}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 active:scale-95 transition-all disabled:opacity-50"
            title="Sync Live Node"
          >
            <RotateCw size={16} className={isSyncing ? "animate-spin text-emerald-600" : ""} />
          </button>
          <AudioButton
            textToSpeak={screenVoiceSummary}
            language={currentLanguage}
            size="sm"
          />
        </div>
      </div>

      {/* 2. Top Section: Device Status Bar & Quick Pairing */}
      <div
        id="sensor-device-status-card"
        className={`p-4 sm:p-5 rounded-3xl border-2 shadow-xs transition-all ${
          connectionStatus === "connected"
            ? "bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950 text-white border-stone-800 shadow-md"
            : connectionStatus === "offline"
            ? "bg-stone-100 text-stone-800 border-stone-300"
            : "bg-amber-50 text-amber-950 border-amber-300"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Device Icon & Editable Nickname */}
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                connectionStatus === "connected"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-400/40"
                  : connectionStatus === "offline"
                  ? "bg-stone-200 text-stone-600 border-stone-300"
                  : "bg-amber-200 text-amber-800 border-amber-300"
              }`}
            >
              <Cpu size={28} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {isEditingNickname ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tempNickname}
                      onChange={(e) => setTempNickname(e.target.value)}
                      className="px-2 py-0.5 rounded-lg bg-white text-stone-900 font-bold text-sm border border-emerald-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveNickname}
                      className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Save size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-sm sm:text-base">{deviceNickname}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setTempNickname(deviceNickname);
                        setIsEditingNickname(true);
                      }}
                      className="opacity-70 hover:opacity-100 text-xs p-1"
                      title="Edit Sensor Nickname"
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                )}

                {/* Connection Status Badge */}
                {connectionStatus === "connected" && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{isHindi ? "सक्रिय (Connected)" : "Connected"}</span>
                  </span>
                )}
                {connectionStatus === "offline" && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-stone-200 text-stone-700 border border-stone-300">
                    <WifiOff size={11} />
                    <span>{isHindi ? "ऑफ़लाइन (Offline)" : "Offline"}</span>
                  </span>
                )}
                {connectionStatus === "not_paired" && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900 border border-amber-300">
                    <AlertTriangle size={11} />
                    <span>{isHindi ? "जोड़ा नहीं गया" : "Not Paired"}</span>
                  </span>
                )}
                {connectionStatus === "software_only" && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-200 text-teal-900 border border-teal-300">
                    <FileText size={11} />
                    <span>{isHindi ? "मृदा स्वास्थ्य कार्ड मोड" : "Soil Card Mode"}</span>
                  </span>
                )}
              </div>

              {/* Node ID & Sync Freshness */}
              <div className="flex items-center gap-3 mt-1 text-xs opacity-80 flex-wrap">
                <span className="font-mono font-bold text-[11px]">
                  ID: {iotData.deviceId || "ESP32-AGRI-7749"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>
                    {isHindi ? `अपडेट: ${lastSyncText}` : `Updated ${lastSyncText}`}
                  </span>
                </span>
                {connectionStatus === "connected" && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-300 font-bold">
                      <Battery size={13} />
                      <span>{iotData.batteryPercent || 88}% Solar</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Pair New Device / Mode Simulator */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              id="pair-device-btn"
              type="button"
              onClick={() => {
                soundEffects.click();
                setShowPairModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <QrCode size={16} />
              <span>{isHindi ? "नया सेंसर जोड़ें" : "Pair New Device"}</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Mode Simulator Pills */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap text-[11px]">
          <span className="font-bold opacity-70">
            {isHindi ? "सेंसर स्थिति टेस्ट:" : "Device State Simulator:"}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setConnectionStatus("connected");
              }}
              className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all ${
                connectionStatus === "connected"
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              Connected
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setConnectionStatus("offline");
              }}
              className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all ${
                connectionStatus === "offline"
                  ? "bg-stone-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              Offline
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setConnectionStatus("not_paired");
              }}
              className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all ${
                connectionStatus === "not_paired"
                  ? "bg-amber-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              Not Paired
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setConnectionStatus("software_only");
              }}
              className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all ${
                connectionStatus === "software_only"
                  ? "bg-teal-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              Manual Soil Card
            </button>
          </div>
        </div>
      </div>

      {/* Offline Notice Banner */}
      {connectionStatus === "offline" && (
        <div
          id="sensor-offline-banner"
          className="p-3.5 rounded-2xl bg-stone-200 border-2 border-stone-300 text-stone-800 flex items-center justify-between gap-3 animate-in fade-in"
        >
          <div className="flex items-center gap-2.5">
            <WifiOff size={20} className="text-stone-600 shrink-0" />
            <div className="text-xs font-semibold">
              <strong>{isHindi ? "सेंसर ऑफ़लाइन है" : "Device is currently offline."}</strong>{" "}
              <span>
                {isHindi
                  ? "नीचे अंतिम ज्ञात डेटा (2 घंटे पूर्व) दिखाया जा रहा है।"
                  : "Showing last-known cached reading from 2 hours ago."}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSyncRefresh}
            className="px-3 py-1 rounded-xl bg-stone-700 hover:bg-stone-800 text-white font-black text-xs shrink-0 active:scale-95"
          >
            {isHindi ? "पुनः प्रयास" : "Retry Sync"}
          </button>
        </div>
      )}

      {/* 1. Empty State for Farmers Without a Connected IoT Device */}
      {connectionStatus === "not_paired" && (
        <div
          id="sensor-not-paired-empty-state"
          className="p-5 sm:p-7 rounded-3xl bg-white border-2 border-dashed border-stone-300 text-center space-y-6 shadow-xs animate-in fade-in"
        >
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto text-3xl shadow-inner">
            📡
          </div>

          <div className="max-w-lg mx-auto space-y-1.5">
            <h3 className="font-black text-lg sm:text-xl text-stone-900">
              {isHindi ? "कोई स्मार्ट सेंसर कनेक्ट नहीं है" : "No Smart Sensor Connected"}
            </h3>
            <p className="text-xs font-semibold text-stone-600 leading-relaxed">
              {isHindi
                ? "हार्डवेयर की आवश्यकता नहीं है! आप नया सेंसर जोड़ सकते हैं, आसान टैप द्वारा मृदा अनुमान दर्ज कर सकते हैं, या सीधे क्षेत्रीय मौसम डेटा के साथ आगे बढ़ सकते हैं।"
                : "IoT hardware is completely optional. Pair a sensor node for live telemetry, enter simple tap-based soil estimates, or skip directly to use season and weather models."}
            </p>
          </div>

          {/* 2 Primary Choice Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto text-left">
            {/* Option 1: Pair a Sensor (QR Flow) */}
            <div
              onClick={() => {
                soundEffects.click();
                setShowPairModal(true);
              }}
              className="p-4 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 border-2 border-stone-200 hover:border-emerald-500 cursor-pointer transition-all active:scale-98 group space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <QrCode size={20} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    {isHindi ? "लाइव डेटा" : "Live Telemetry"}
                  </span>
                </div>
                <h4 className="font-black text-sm text-stone-900 group-hover:text-emerald-900">
                  {isHindi ? "सेंसर जोड़ें (QR स्कैन)" : "Pair a Sensor"}
                </h4>
                <p className="text-[11px] font-semibold text-stone-500 leading-normal">
                  {isHindi
                    ? "ESP32 / LoRa सेंसर किट का QR कोड स्कैन करें व लाइव नमी और pH देखें।"
                    : "Scan device QR code on your ESP32 node for real-time moisture & pH data."}
                </p>
              </div>

              <button
                type="button"
                className="w-full py-2 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <QrCode size={14} />
                <span>{isHindi ? "QR स्कैन शुरू करें" : "Pair Device (Scan QR)"}</span>
              </button>
            </div>

            {/* Option 2: Enter Soil Data Manually */}
            <div
              onClick={() => {
                soundEffects.click();
                setConnectionStatus("software_only");
              }}
              className="p-4 rounded-2xl bg-stone-50 hover:bg-teal-50/50 border-2 border-stone-200 hover:border-teal-500 cursor-pointer transition-all active:scale-98 group space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Sliders size={20} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800">
                    {isHindi ? "+25% सटीकता" : "+25% Accuracy"}
                  </span>
                </div>
                <h4 className="font-black text-sm text-stone-900 group-hover:text-teal-900">
                  {isHindi ? "मैनुअल मृदा डेटा दर्ज करें" : "Enter Soil Data Manually"}
                </h4>
                <p className="text-[11px] font-semibold text-stone-500 leading-normal">
                  {isHindi
                    ? "आसान 1-टैप प्रीसेट द्वारा pH व नमी स्तर चुनें और फसल सलाह सटीकता बढ़ाएं।"
                    : "Simple tap-based pH and moisture presets to boost AI accuracy without hardware."}
                </p>
              </div>

              <button
                type="button"
                className="w-full py-2 rounded-xl bg-teal-700 group-hover:bg-teal-800 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <FileText size={14} />
                <span>{isHindi ? "डेटा दर्ज करें" : "Enter Soil Estimates"}</span>
              </button>
            </div>
          </div>

          {/* Always-Available Skip Option Container */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 max-w-xl mx-auto text-left space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-black text-xs text-stone-900">
                  {isHindi ? "छोड़ें — क्षेत्रीय मौसम व ऋतु आधार पर जारी रखें" : "Skip for Now — Regional Baseline Always Available"}
                </h5>
                <p className="text-[11px] font-medium text-stone-600 mt-0.5">
                  {isHindi
                    ? "फसल सिफारिश, खाद मार्गदर्शन, मौसम पूर्वानुमान, रोग कैमरा और मंडी भाव बिना किसी सेंसर के पूर्णतः कार्यरत रहेंगे।"
                    : "Crop recommendations, fertilizer dosage, disease detection, mandi prices, and weather forecasts work seamlessly using your location and season."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {onOpenCropRecommend && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    onOpenCropRecommend();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 font-bold text-xs active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>🌾 {isHindi ? "फसल सलाह देखें" : "View Crop Recommendations"}</span>
                  <ChevronRight size={13} />
                </button>
              )}
              {onOpenFertilizer && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    onOpenFertilizer();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 font-bold text-xs active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>🧪 {isHindi ? "खाद मार्गदर्शन देखें" : "View Fertilizer Guide"}</span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Manual Soil Data Entry Mode (Tap-based Estimates + Skip) */}
      {connectionStatus === "software_only" && (
        <div
          id="manual-soil-card-section"
          className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-teal-400 shadow-xs space-y-5 animate-in fade-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📋</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base sm:text-lg text-stone-900">
                    {isHindi ? "मृदा डेटा दर्ज करें (मैनुअल मोड)" : "Manual Soil Data Entry"}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800">
                    {isHindi ? "+25% सटीकता" : "+25% Boost"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-stone-500 mt-0.5">
                  {isHindi ? "आसान टैप द्वारा मिट्टी नमी व pH चुनें" : "Tap simple presets or adjust sliders for your field"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AudioButton
                textToSpeak={
                  isHindi
                    ? "आसान टैप द्वारा अपनी मिट्टी की नमी और pH चुनें ताकि फसल और खाद की सिफारिशें अधिक सटीक हो सकें।"
                    : "Tap presets for soil moisture and pH to improve AI crop and fertilizer recommendations."
                }
                language={currentLanguage}
                size="sm"
              />
            </div>
          </div>

          {/* Quick Tap Presets for Moisture */}
          <div className="space-y-2 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex justify-between items-center text-xs font-bold text-stone-800">
              <span className="flex items-center gap-1.5">
                <Droplets size={15} className="text-sky-600" />
                <span>{isHindi ? "मिट्टी की नमी (%):" : "Soil Moisture:"}</span>
              </span>
              <span className="font-black text-sky-900 bg-sky-100 px-2.5 py-0.5 rounded-md text-xs">
                {manualMoisture}% {manualMoisture < 35 ? "(Dry)" : manualMoisture < 65 ? "(Optimal)" : "(Wet)"}
              </span>
            </div>

            {/* 3 Quick Tap Moisture Chips */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: isHindi ? "सूखी मिट्टी (25%)" : "Dry (~25%)", icon: "🌵", val: 25 },
                { label: isHindi ? "अनुकूल नमी (45%)" : "Optimal (~45%)", icon: "🌾", val: 45 },
                { label: isHindi ? "गीली मिट्टी (70%)" : "Wet (~70%)", icon: "💧", val: 70 },
              ].map((chip) => (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setManualMoisture(chip.val);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
                    Math.abs(manualMoisture - chip.val) <= 5
                      ? "bg-sky-600 text-white border-sky-700 shadow-xs"
                      : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <span>{chip.icon}</span>
                  <span className="text-[11px] truncate">{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Fine-tune slider */}
            <div className="pt-2 space-y-1">
              <input
                type="range"
                min="10"
                max="90"
                step="1"
                value={manualMoisture}
                onChange={(e) => setManualMoisture(Number(e.target.value))}
                className="w-full accent-sky-600 h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-semibold text-stone-500">
                <span>10% (Sandy / Arid)</span>
                <span>45% (Balanced Loam)</span>
                <span>90% (Waterlogged)</span>
              </div>
            </div>
          </div>

          {/* Quick Tap Presets for pH */}
          <div className="space-y-2 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex justify-between items-center text-xs font-bold text-stone-800">
              <span className="flex items-center gap-1.5">
                <FlaskConical size={15} className="text-emerald-600" />
                <span>{isHindi ? "मिट्टी pH स्तर:" : "Soil pH Level:"}</span>
              </span>
              <span className="font-black text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-md text-xs">
                {manualPh} pH {manualPh < 6.0 ? "(Acidic)" : manualPh <= 7.5 ? "(Ideal)" : "(Alkaline)"}
              </span>
            </div>

            {/* 3 Quick Tap pH Chips */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: isHindi ? "अम्लीय (5.5 pH)" : "Acidic (5.5)", icon: "🍋", val: 5.5 },
                { label: isHindi ? "संतुलित (6.8 pH)" : "Optimal (6.8)", icon: "🌿", val: 6.8 },
                { label: isHindi ? "क्षारीय (8.2 pH)" : "Alkaline (8.2)", icon: "⚪", val: 8.2 },
              ].map((chip) => (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setManualPh(chip.val);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
                    Math.abs(manualPh - chip.val) <= 0.2
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                      : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <span>{chip.icon}</span>
                  <span className="text-[11px] truncate">{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Fine-tune slider */}
            <div className="pt-2 space-y-1">
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={manualPh}
                onChange={(e) => setManualPh(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-semibold text-stone-500">
                <span>4.5 (Acidic)</span>
                <span>6.5 - 7.5 (Best for Wheat & Mustard)</span>
                <span>9.0 (Alkaline)</span>
              </div>
            </div>
          </div>

          {/* Soil Type Quick Selector */}
          <div className="space-y-2 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-bold text-stone-800 block">
              {isHindi ? "मिट्टी का प्रकार (Soil Texture):" : "Soil Type / Texture:"}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: "Black Loamy Soil", hindi: "काली दोमट", icon: "🌱" },
                { name: "Red Loamy Soil", hindi: "लाल दोमट", icon: "🍂" },
                { name: "Sandy Alluvial", hindi: "बलुई जलोढ़", icon: "🌾" },
                { name: "Clayey Soil", hindi: "चिकनी मिट्टी", icon: "🪴" },
              ].map((st) => (
                <button
                  key={st.name}
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setManualSoilType(st.name);
                  }}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-0.5 ${
                    manualSoilType === st.name
                      ? "bg-teal-700 text-white border-teal-800 shadow-2xs"
                      : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <span className="text-sm">{st.icon}</span>
                  <span className="text-[11px] truncate">{isHindi ? st.hindi : st.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions & Confirmation */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.success();
                    setManualSaved(true);
                    if (onUpdateIotData) {
                      onUpdateIotData({
                        soilPh: manualPh,
                        soilMoisturePercent: manualMoisture,
                        soilType: manualSoilType,
                        isManualEntry: true,
                        pairedStatus: "software_only",
                      });
                    }
                    setTimeout(() => setManualSaved(false), 2500);
                  }}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>
                    {manualSaved
                      ? isHindi
                        ? "डेटा सहेज लिया गया!"
                        : "Soil Data Applied (+25% Boost)!"
                      : isHindi
                      ? "मृदा डेटा सहेजें (+25% सटीकता)"
                      : "Save Soil Data (+25% Boost)"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setManualPh(6.8);
                    setManualMoisture(40);
                    if (onUpdateIotData) {
                      onUpdateIotData({
                        soilPh: 6.8,
                        soilMoisturePercent: 40,
                        isManualEntry: false,
                        pairedStatus: "not_paired",
                      });
                    }
                    setConnectionStatus("not_paired");
                  }}
                  className="px-3.5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs active:scale-95"
                >
                  {isHindi ? "रीसेट करें" : "Reset / Skip"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setShowPairModal(true);
                }}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 self-start sm:self-center"
              >
                <QrCode size={14} />
                <span>{isHindi ? "सेंसर हार्डवेयर जोड़ें →" : "Pair Sensor Hardware instead →"}</span>
              </button>
            </div>

            {/* Quick shortcuts to see recommendations */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-100 flex-wrap">
              {onOpenCropRecommend && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    onOpenCropRecommend();
                  }}
                  className="text-xs font-black text-emerald-800 hover:underline flex items-center gap-1 mr-3"
                >
                  <span>🌾 {isHindi ? "अपडेटेड फसल सलाह देखें →" : "View Crop Recommendations →"}</span>
                </button>
              )}
              {onOpenFertilizer && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    onOpenFertilizer();
                  }}
                  className="text-xs font-black text-teal-800 hover:underline flex items-center gap-1"
                >
                  <span>🧪 {isHindi ? "अपडेटेड खाद गाइड देखें →" : "View Fertilizer Guide →"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Non-Hardware Auto-Irrigation Replacement Card (HIDDEN for Non-Hardware Users) */}
      {(connectionStatus === "not_paired" || connectionStatus === "software_only") && (
        <div
          id="non-hardware-irrigation-info-card"
          className="p-5 rounded-3xl bg-white border-2 border-stone-200 shadow-xs space-y-4 animate-in fade-in"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0 font-bold">
              💧
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-base text-stone-900">
                {isHindi ? "ऑटो-सिंचाई मोटर नियंत्रण (हार्डवेयर आवश्यक)" : "Auto-Irrigation Pump Control"}
              </h4>
              <p className="text-xs font-semibold text-stone-600 leading-relaxed">
                {isHindi
                  ? "स्वचालित मोटर चालू/बंद और नमी थ्रेशोल्ड ट्रिगर के लिए आपके खेत के मोटर स्टार्टर से जुड़ा IoT रिले नोड आवश्यक है। बिना हार्डवेयर के किसान मौसम टैब में दैनिक सिंचाई पूर्वानुमान देख सकते हैं।"
                  : "Automated pump start/stop and moisture threshold triggers require a paired IoT relay switch node on your motor starter. Farmers without hardware can still check daily irrigation timing in the Weather forecast."}
              </p>
            </div>
          </div>

          {/* Soft link to sensor kit rental offering */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <h5 className="font-black text-xs sm:text-sm text-emerald-950">
                  {isHindi ? "किराये पर स्मार्ट सेंसर किट (Rent-to-Use)" : "Rent a Plug-and-Play Sensor & Pump Kit"}
                </h5>
                <p className="text-[11px] font-semibold text-emerald-800">
                  {isHindi
                    ? "केवल ₹299/सीजन। शून्य अग्रिम उपकरण लागत। प्रोब व मोटर कंट्रोलर शामिल।"
                    : "Only ₹299/season. Zero upfront equipment cost. Includes capacitive soil probe & pump relay."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setShowRentalModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shrink-0 active:scale-95 shadow-xs transition-all self-start sm:self-center"
            >
              {isHindi ? "किट बुक करें (₹299)" : "Book Sensor Kit (₹299)"}
            </button>
          </div>
        </div>
      )}

      {/* Main Live Readings (Available for Connected & Offline) */}
      {(connectionStatus === "connected" || connectionStatus === "offline") && (
        <>
          {/* Calibration Alert Warning Banner (If sensor needs calibration) */}
          <div
            id="calibration-reminder-banner"
            className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl shrink-0">🧪</span>
              <div>
                <h4 className="font-black text-xs sm:text-sm">
                  {isHindi ? "pH सेंसर कैलिब्रेशन अनुस्मारक" : "pH Sensor Calibration Reminder"}
                </h4>
                <p className="text-[11px] font-semibold text-stone-700">
                  {isHindi
                    ? "सटीक रीडिंग के लिए हर 45 दिन में 2-स्टेप बफर सॉल्यूशन से जांचें।"
                    : "Last calibrated 42 days ago. Run a quick 2-step buffer test for optimal accuracy."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setShowCalibrateModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shrink-0 active:scale-95 transition-all shadow-2xs"
            >
              {isHindi ? "कैलिब्रेट करें" : "Calibrate"}
            </button>
          </div>

          {/* 3. Live Readings — Main Cards (Gauges & Dials) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Soil Moisture Dial Gauge */}
            <div
              id="soil-moisture-gauge-card"
              className={`p-5 rounded-3xl bg-white border-2 shadow-xs space-y-3 relative overflow-hidden ${
                connectionStatus === "offline" ? "opacity-75 border-stone-300" : "border-stone-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                    💧
                  </div>
                  <div>
                    <h3 className="font-black text-base text-stone-900">
                      {isHindi ? "मिट्टी की नमी" : "Soil Moisture"}
                    </h3>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${moistureInfo.badgeBg}`}>
                      {moistureInfo.label}
                    </span>
                  </div>
                </div>

                <AudioButton
                  textToSpeak={moistureInfo.speech}
                  language={currentLanguage}
                  size="sm"
                />
              </div>

              {/* Large Circular Radial Gauge Dial */}
              <div className="flex flex-col items-center justify-center py-2 relative">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Track (0-100%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-stone-100"
                      strokeWidth="10"
                      fill="transparent"
                    />

                    {/* Color Segment Arc (Dynamic) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={moistureInfo.strokeColor}
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * (Math.min(100, Math.max(0, iotData.soilMoisturePercent)) / 100))}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />

                    {/* Auto-Irrigation Threshold Marker Line (e.g., 40%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeDasharray="2 249.2"
                      strokeDashoffset={251.2 - (251.2 * (moistureThreshold / 100))}
                      fill="transparent"
                      strokeLinecap="butt"
                      className="opacity-90"
                    />
                  </svg>

                  {/* Center Text Display */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-stone-900 font-mono tracking-tight">
                      {iotData.soilMoisturePercent}%
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-700 mt-0.5">
                      {isHindi ? "कैपेसिटिव डेप्थ 15cm" : "Capacitive 15cm"}
                    </span>
                  </div>
                </div>

                {/* Threshold Indicator Badge on Gauge */}
                <div className="flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 mt-1">
                  <Zap size={13} className="text-amber-600 fill-amber-600" />
                  <span>
                    {isHindi
                      ? `${moistureThreshold}% से नीचे स्वतः सिंचाई`
                      : `Auto-waters below ${moistureThreshold}%`}
                  </span>
                </div>
              </div>

              {/* One-Line Plain Status */}
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 leading-relaxed">
                💡 {moistureInfo.plainStatus}
              </div>
            </div>

            {/* Card 2: Soil pH Dial Scale */}
            <div
              id="soil-ph-gauge-card"
              className={`p-5 rounded-3xl bg-white border-2 shadow-xs space-y-3 relative overflow-hidden ${
                connectionStatus === "offline" ? "opacity-75 border-stone-300" : "border-stone-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                    🧪
                  </div>
                  <div>
                    <h3 className="font-black text-base text-stone-900">
                      {isHindi ? "मिट्टी का pH" : "Soil pH Level"}
                    </h3>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${phInfo.badgeBg}`}>
                      {phInfo.label}
                    </span>
                  </div>
                </div>

                <AudioButton
                  textToSpeak={phInfo.speech}
                  language={currentLanguage}
                  size="sm"
                />
              </div>

              {/* Large Circular pH Gauge Scale (0 - 14) */}
              <div className="flex flex-col items-center justify-center py-2 relative">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-stone-100"
                      strokeWidth="10"
                      fill="transparent"
                    />

                    {/* Ideal Crop Green Zone (e.g., 6.0 to 7.5) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#86efac" // green-300
                      strokeWidth="10"
                      strokeDasharray={`${(1.5 / 14) * 251.2} 251.2`}
                      strokeDashoffset={251.2 - (251.2 * (6.0 / 14))}
                      fill="transparent"
                      className="opacity-70"
                    />

                    {/* Active pH Pointer Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={phInfo.isOptimal ? "#059669" : phInfo.level === "acidic" ? "#e11d48" : "#6366f1"}
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * (Math.min(14, Math.max(0, iotData.soilPh)) / 14))}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Center Text Display */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-stone-900 font-mono tracking-tight">
                      {iotData.soilPh}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-700 mt-0.5">
                      Scale 0 – 14 pH
                    </span>
                  </div>
                </div>

                {/* Ideal Range Crop Tag */}
                <div className="flex items-center gap-1 text-[11px] font-black text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mt-1">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>
                    {isHindi ? "गेहूं व सोयाबीन आदर्श: 6.0 – 7.2 pH" : "Ideal Crop Zone: 6.0 – 7.2 pH"}
                  </span>
                </div>
              </div>

              {/* One-Line Plain Status + Fertilizer Advisory Link */}
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 flex items-center justify-between gap-2 leading-relaxed">
                <div>💡 {phInfo.plainStatus}</div>
                {onOpenFertilizer && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      onOpenFertilizer();
                    }}
                    className="text-[11px] font-black text-emerald-700 hover:text-emerald-800 shrink-0 underline"
                  >
                    {phInfo.actionText}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 4. Auto-Irrigation & Relay Pump Controller Card */}
          <div
            id="auto-irrigation-control-card"
            className={`p-5 rounded-3xl bg-white border-2 shadow-sm space-y-4 transition-all ${
              autoMode ? "border-emerald-300 ring-1 ring-emerald-100" : "border-stone-300 ring-1 ring-stone-100"
            }`}
          >
            {/* Header: Motor Status & Mode Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (iotData.pumpStatus === "ON") {
                      soundEffects.pump(false);
                      onTogglePump();
                    } else {
                      handleStartManualWatering(selectedDurationMins || 30);
                    }
                  }}
                  title={
                    iotData.pumpStatus === "ON"
                      ? isHindi
                        ? "पंप बंद करने के लिए क्लिक करें"
                        : "Click to turn pump OFF"
                      : isHindi
                      ? "पंप चालू करने के लिए क्लिक करें"
                      : "Click to turn pump ON"
                  }
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-all cursor-pointer active:scale-95 ${
                    iotData.pumpStatus === "ON"
                      ? "bg-emerald-600 text-white animate-pulse shadow-md ring-4 ring-emerald-200 hover:bg-rose-600 hover:ring-rose-200"
                      : "bg-stone-100 text-stone-700 hover:bg-emerald-100 hover:text-emerald-800"
                  }`}
                >
                  <Power size={26} />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base sm:text-lg text-stone-900">
                      {isHindi ? "सबमर्सिबल मोटर पंप" : "Submersible Motor Pump"}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        iotData.pumpStatus === "ON"
                          ? "bg-emerald-600 text-white animate-pulse"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {iotData.pumpStatus === "ON"
                        ? isHindi
                          ? "सिंचाई जारी..."
                          : "Watering Now"
                        : isHindi
                        ? "बंद (Idle)"
                        : "Idle"}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-stone-700 mt-0.5 flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>
                      {isHindi ? "अंतिम सिंचाई: " : "Last Watered: "}
                      {iotData.lastWateredTime || "Today, 7:12 AM (30 mins)"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Mode Toggle Switch (Auto vs Manual) */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200 self-start sm:self-center shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    if (!autoMode) handleToggleAutoMode();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                    autoMode
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Zap size={13} className={autoMode ? "fill-white" : ""} />
                  <span>{isHindi ? "ऑटोमैटिक" : "Automatic"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (autoMode) handleToggleAutoMode();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                    !autoMode
                      ? "bg-stone-800 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Hand size={13} />
                  <span>{isHindi ? "मैनुअल" : "Manual"}</span>
                </button>
              </div>
            </div>

            {/* Active Watering Countdown Banner (Common when ON) */}
            {iotData.pumpStatus === "ON" && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl animate-bounce">
                    💧
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-emerald-950">
                      {isHindi ? "खेत में पानी चल रहा है..." : "Field irrigation in progress..."}
                    </h4>
                    <p className="text-xs font-bold text-emerald-800">
                      {wateringTimeRemainingSec !== null
                        ? isHindi
                          ? `शेष समय: ${Math.floor(wateringTimeRemainingSec / 60)} मिनट ${wateringTimeRemainingSec % 60} सेकंड`
                          : `Time remaining: ${Math.floor(wateringTimeRemainingSec / 60)}m ${wateringTimeRemainingSec % 60}s`
                        : isHindi
                        ? "रिले स्विच सक्रिय है"
                        : "Relay switch active"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.pump(false);
                    onTogglePump();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Square size={14} className="fill-white" />
                  <span>{isHindi ? "मोटर तुरंत बंद करें" : "Stop Watering Now"}</span>
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW A: AUTOMATIC MODE INTERFACE (Smart AI & Sensor Threshold-Driven)     */}
            {/* ========================================================================= */}
            {autoMode ? (
              <div className="space-y-3.5 animate-in fade-in" id="auto-mode-interface">
                {/* Auto Mode Info Banner */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-950">
                  <span className="text-lg shrink-0">⚡</span>
                  <div className="space-y-0.5">
                    <div className="font-black text-emerald-950 flex items-center gap-1.5">
                      <span>{isHindi ? "स्मार्ट ऑटो-सिंचाई सक्रिय (AI Auto-Pilot)" : "Smart Auto-Irrigation Active"}</span>
                      <span className="bg-emerald-200 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">Auto ON</span>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-800 leading-normal">
                      {isHindi
                        ? `सेंसर नमी < ${moistureThreshold}% होने पर मोटर स्वतः चालू करेगा और खेत पर्याप्त नम होने पर बंद कर देगा।`
                        : `Sensors automatically start the pump when moisture drops below ${moistureThreshold}% and stop when field capacity is reached.`}
                    </p>
                  </div>
                </div>

                {/* Direct Pump ON / OFF Button in Automatic Mode */}
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                        iotData.pumpStatus === "ON"
                          ? "bg-emerald-600 text-white animate-pulse"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      <Power size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                        <span>{isHindi ? "पंप नियंत्रण (Pump Override)" : "Instant Pump Control"}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                            iotData.pumpStatus === "ON"
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {iotData.pumpStatus === "ON" ? "PUMP RUNNING" : "PUMP OFF"}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 font-semibold">
                        {iotData.pumpStatus === "ON"
                          ? isHindi
                            ? "मोटर चालू है, तुरंत बंद करने के लिए नीचे दबाएं"
                            : "Motor is active. Press to stop anytime."
                          : isHindi
                          ? "ऑटो मोड में भी तुरंत पानी चालू करने के लिए दबाएं"
                          : "Start irrigation manually on-demand in Auto mode."}
                      </p>
                    </div>
                  </div>

                  {iotData.pumpStatus === "OFF" ? (
                    <button
                      id="auto-turn-on-pump-btn"
                      type="button"
                      onClick={() => handleStartManualWatering(30)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                      <Play size={14} className="fill-white" />
                      <span>{isHindi ? "पंप चालू करें (Water Now)" : "Turn Pump ON (Water Now)"}</span>
                    </button>
                  ) : (
                    <button
                      id="auto-turn-off-pump-btn"
                      type="button"
                      onClick={() => {
                        soundEffects.pump(false);
                        onTogglePump();
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 animate-pulse"
                    >
                      <Square size={14} className="fill-white" />
                      <span>{isHindi ? "पंप बंद करें (Turn OFF)" : "Turn Pump OFF (Stop)"}</span>
                    </button>
                  )}
                </div>

                {/* AI Auto-Irrigation Threshold Slider */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={18} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-stone-900">
                        {isHindi ? "ऑटो-सिंचाई ट्रिगर थ्रेशोल्ड" : "Auto-Irrigation Trigger Threshold"}
                      </span>
                    </div>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                      {isHindi ? `नमी < ${moistureThreshold}% पर चालू` : `Waters when < ${moistureThreshold}%`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="20"
                    max="60"
                    step="1"
                    value={moistureThreshold}
                    onChange={(e) => handleThresholdChange(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 cursor-pointer"
                  />

                  {/* Preset quick buttons for threshold */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { label: isHindi ? "25% (सूखी फसल)" : "25% (Dry Crops)", val: 25 },
                      { label: isHindi ? "40% (AI अनुशंसित)" : "40% (AI Recommended)", val: 40 },
                      { label: isHindi ? "55% (सघन पानी)" : "55% (Heavy Water)", val: 55 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => {
                          soundEffects.click();
                          handleThresholdChange(preset.val);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                          moistureThreshold === preset.val
                            ? "bg-emerald-600 text-white border-emerald-700 shadow-2xs"
                            : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] font-semibold text-stone-500 pt-0.5">
                    <span>20% (Chickpea / Mustard)</span>
                    <span className="text-emerald-800 font-black">Current Soil: {iotData.soilMoisturePercent}%</span>
                    <span>60% (Paddy / Sugarcane)</span>
                  </div>
                </div>

                {/* Auto Safeguards & Manual Override */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-stone-700">
                    <span className="text-base">☔</span>
                    <div>
                      <span className="font-bold block text-stone-900">
                        {isHindi ? "मौसम सुरक्षा लॉक (Rain Lockout)" : "Rain Lockout Protection"}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {isHindi ? "बारिश का पूर्वानुमान होने पर सिंचाई रोक देगा" : "Auto-pauses if rain is forecasted (>60%)"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      setShowDurationModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-black text-xs active:scale-95 transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
                  >
                    <Clock size={13} className="text-emerald-700" />
                    <span>{isHindi ? "कस्टम समय चुनें..." : "Custom Duration..."}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ========================================================================= */
              /* VIEW B: MANUAL MODE INTERFACE (Direct Farmer On-Demand Control)           */
              /* ========================================================================= */
              <div className="space-y-4 animate-in fade-in" id="manual-mode-interface">
                {/* Manual Mode Info Banner */}
                <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200 flex items-start gap-2.5 text-xs text-stone-800">
                  <span className="text-lg shrink-0">✋</span>
                  <div className="space-y-0.5">
                    <div className="font-black text-stone-900 flex items-center gap-1.5">
                      <span>{isHindi ? "मैनुअल नियंत्रण मोड (Direct Control)" : "Manual On-Demand Control Active"}</span>
                      <span className="bg-stone-200 text-stone-800 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">Manual Mode</span>
                    </div>
                    <p className="text-[11px] font-semibold text-stone-600 leading-normal">
                      {isHindi
                        ? "ऑटो-ट्रिगर थ्रेशोल्ड निष्क्रिय है। मोटर केवल आपके आदेश पर चलेगी और चयनित समय पूरा होने पर बंद होगी।"
                        : "Automatic sensor threshold trigger is paused. The pump only runs when you press Start, with safety auto-shutoff."}
                    </p>
                  </div>
                </div>

                {/* Duration Picker Chips */}
                <div className="space-y-2 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex justify-between items-center text-xs font-bold text-stone-800">
                    <span className="flex items-center gap-1.5">
                      <Clock size={15} className="text-emerald-700" />
                      <span>{isHindi ? "सिंचाई अवधि चुनें (Duration):" : "Select Watering Duration:"}</span>
                    </span>
                    <span className="font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md text-xs">
                      {selectedDurationMins} {isHindi ? "मिनट" : "Minutes"}
                    </span>
                  </div>

                  {/* 4 Quick Duration Presets */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { mins: 15, label: isHindi ? "15 मिनट (हल्की)" : "15 Mins (Light)", icon: "🌱" },
                      { mins: 30, label: isHindi ? "30 मिनट (मानक)" : "30 Mins (Standard)", icon: "💧" },
                      { mins: 45, label: isHindi ? "45 मिनट (गहरी)" : "45 Mins (Deep)", icon: "🌾" },
                      { mins: 60, label: isHindi ? "60 मिनट (सघन)" : "60 Mins (Heavy)", icon: "🌊" },
                    ].map((item) => (
                      <button
                        key={item.mins}
                        type="button"
                        onClick={() => {
                          soundEffects.click();
                          setSelectedDurationMins(item.mins);
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1 text-center ${
                          selectedDurationMins === item.mins
                            ? "bg-emerald-700 text-white border-emerald-800 shadow-xs ring-2 ring-emerald-300"
                            : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-[11px] truncate font-extrabold">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-semibold text-stone-500">
                      {isHindi ? "💡 समय समाप्त होने पर मोटर स्वतः बंद हो जाएगी" : "💡 Motor stops automatically after timer to prevent overflow"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setShowDurationModal(true);
                      }}
                      className="text-[11px] font-bold text-emerald-800 hover:underline"
                    >
                      {isHindi ? "कस्टम समय चुनें..." : "Custom Duration..."}
                    </button>
                  </div>
                </div>

                {/* Big Primary Start / Stop Pump Action Button */}
                {iotData.pumpStatus === "OFF" ? (
                  <button
                    id="manual-start-pump-btn"
                    type="button"
                    onClick={() => handleStartManualWatering(selectedDurationMins)}
                    className="w-full py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/20 active:scale-97 transition-all flex items-center justify-center gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={16} className="fill-white ml-0.5" />
                    </div>
                    <span>
                      {isHindi
                        ? `मोटर चालू करें (${selectedDurationMins} मिनट के लिए)`
                        : `Start Pump Now (${selectedDurationMins} Minutes)`}
                    </span>
                  </button>
                ) : (
                  <button
                    id="manual-stop-pump-btn"
                    type="button"
                    onClick={() => {
                      soundEffects.pump(false);
                      onTogglePump();
                    }}
                    className="w-full py-4 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm sm:text-base shadow-lg shadow-rose-600/20 active:scale-97 transition-all flex items-center justify-center gap-2.5"
                  >
                    <Square size={18} className="fill-white" />
                    <span>
                      {isHindi ? "मोटर तुरंत बंद करें (Stop Pump)" : "Stop Motor Pump Now"}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 5. Expandable 7-Day History & Trend View */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-stone-200 shadow-xs space-y-3">
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setShowHistoryView(!showHistoryView);
              }}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📊</span>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-stone-900">
                    {isHindi ? "7 दिनों का नमी व pH ट्रेंड और सिंचाई लॉग" : "7-Day Sensor Trends & Watering Log"}
                  </h3>
                  <p className="text-[11px] font-bold text-stone-500">
                    {isHindi ? "दैनिक नमी बदलाव और कब-कब पानी दिया गया" : "Historical moisture levels and irrigation timestamps"}
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
                {showHistoryView ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {showHistoryView && (
              <div className="pt-3 border-t border-stone-100 space-y-4 animate-in fade-in">
                {/* 7-Day Visual Moisture Bar & pH Line Chart */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-black text-stone-700">
                    <span>{isHindi ? "दैनिक नमी (%) व थ्रेशोल्ड लाइन" : "Daily Moisture (%) vs Trigger Threshold"}</span>
                    <span className="text-amber-700 text-[11px]">Threshold: {moistureThreshold}%</span>
                  </div>

                  {/* SVG Trend Bars */}
                  <div className="grid grid-cols-7 gap-2 pt-2 pb-1 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                    {DEFAULT_7DAY_HISTORY.map((hist, idx) => {
                      const isToday = idx === 6;
                      const heightPercent = Math.min(100, Math.max(10, hist.moisturePercent));
                      const isBelowThreshold = hist.moisturePercent < moistureThreshold;

                      return (
                        <div key={hist.day} className="flex flex-col items-center justify-end h-32 space-y-1">
                          <span className="text-[10px] font-bold text-stone-700">
                            {hist.moisturePercent}%
                          </span>

                          <div className="w-full bg-stone-200 rounded-t-lg h-20 relative flex items-end overflow-hidden">
                            {/* Bar fill */}
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t-lg transition-all ${
                                isBelowThreshold ? "bg-amber-500" : "bg-emerald-600"
                              }`}
                            />
                            {/* Watered Badge */}
                            {hist.wateredMins > 0 && (
                              <div
                                className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-black text-white bg-sky-600 px-1 rounded-sm"
                                title={`Watered ${hist.wateredMins}m`}
                              >
                                💧
                              </div>
                            )}
                          </div>

                          <span className={`text-[10px] font-black truncate ${isToday ? "text-emerald-900" : "text-stone-600"}`}>
                            {hist.day.split(" ")[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Watering History Events Log */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                    {isHindi ? "हालिया सिंचाई रिकॉर्ड" : "Past Watering Events Log"}
                  </h4>

                  <div className="space-y-1.5 text-xs font-semibold">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">💧</span>
                        <div>
                          <strong className="text-stone-900">Today, 7:12 AM</strong>
                          <span className="text-stone-500 ml-1.5">• 30 mins duration</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        Auto AI Triggered
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">💧</span>
                        <div>
                          <strong className="text-stone-900">Yesterday, 5:30 PM</strong>
                          <span className="text-stone-500 ml-1.5">• 45 mins duration</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-200 text-stone-800">
                        Manual Override
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">💧</span>
                        <div>
                          <strong className="text-stone-900">Aug 13, 6:00 AM</strong>
                          <span className="text-stone-500 ml-1.5">• 35 mins duration</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        Auto AI Triggered
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* 6. AI Assistant Integration: Suggested Sensor Prompts */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-stone-900 to-emerald-950 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-amber-400" />
            <h3 className="font-black text-sm sm:text-base text-white">
              {isHindi ? "एआई सलाहकार से सेंसर पर प्रश्न पूछें" : "Ask AI Assistant About Your Sensors"}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              if (onOpenVoiceAssistantWithPrompt) {
                onOpenVoiceAssistantWithPrompt(
                  isHindi
                    ? "मेरी मिट्टी की नमी 38% और pH 6.8 है। क्या आज फसल को पानी देना चाहिए?"
                    : "My soil moisture is 38% and pH is 6.8. When should I irrigate next?",
                  "smart_sensors"
                );
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-xs border border-white/20 active:scale-95"
          >
            {isHindi ? "बोलकर पूछें" : "Ask AI Now"}
          </button>
        </div>

        {/* 4 Clickable Suggested Prompt Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              if (onOpenVoiceAssistantWithPrompt) {
                onOpenVoiceAssistantWithPrompt(
                  isHindi ? "क्या मेरी मिट्टी में नमी अभी सामान्य है?" : "Is my soil moisture normal right now?",
                  "smart_sensors"
                );
              }
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs font-semibold text-teal-100 active:scale-98 transition-all flex items-center gap-2"
          >
            <span className="text-base">💧</span>
            <span className="truncate">
              {isHindi ? "क्या मिट्टी की नमी अभी सामान्य है?" : "Is my soil moisture normal right now?"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              if (onOpenVoiceAssistantWithPrompt) {
                onOpenVoiceAssistantWithPrompt(
                  isHindi ? "मुझे अगली सिंचाई कब करनी चाहिए?" : "When should I water next?",
                  "smart_sensors"
                );
              }
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs font-semibold text-teal-100 active:scale-98 transition-all flex items-center gap-2"
          >
            <span className="text-base">⏰</span>
            <span className="truncate">
              {isHindi ? "मुझे अगली सिंचाई कब करनी चाहिए?" : "When should I water next?"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              if (onOpenVoiceAssistantWithPrompt) {
                onOpenVoiceAssistantWithPrompt(
                  isHindi ? "ऑटो-सिंचाई मोटर क्यों चालू हुई?" : "Why did auto-irrigation turn on?",
                  "smart_sensors"
                );
              }
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs font-semibold text-teal-100 active:scale-98 transition-all flex items-center gap-2"
          >
            <span className="text-base">⚡</span>
            <span className="truncate">
              {isHindi ? "ऑटो-सिंचाई मोटर क्यों चालू हुई?" : "Why did auto-irrigation turn on?"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              if (onOpenVoiceAssistantWithPrompt) {
                onOpenVoiceAssistantWithPrompt(
                  isHindi ? "क्या मिट्टी का pH मेरी फसल के लिए सही है?" : "Is my soil pH good for my crop?",
                  "smart_sensors"
                );
              }
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs font-semibold text-teal-100 active:scale-98 transition-all flex items-center gap-2"
          >
            <span className="text-base">🧪</span>
            <span className="truncate">
              {isHindi ? "क्या मिट्टी का pH फसल के लिए सही है?" : "Is my soil pH good for my crop?"}
            </span>
          </button>
        </div>
      </div>

      {/* 7. Rent-To-Use Program Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📦</span>
          <div>
            <h4 className="font-black text-sm text-teal-950">
              {isHindi ? "किराये पर स्मार्ट सेंसर किट (Rent-to-Use)" : "Rent-to-Use Sensor Program"}
            </h4>
            <p className="text-xs text-teal-800">
              {isHindi
                ? "केवल ₹299/सीजन। शून्य अग्रिम उपकरण लागत।"
                : "Only ₹299/season. Zero upfront equipment cost for small farmers."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            alert(
              isHindi
                ? "बुकिंग अनुरोध दर्ज! निकटतम कृषि केंद्र से आपका सेंसर डिलीवर होगा।"
                : "Booking request sent! Local agricultural service center will deliver your sensor kit."
            );
          }}
          className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shrink-0 shadow-2xs active:scale-95"
        >
          {isHindi ? "किट बुक करें" : "Book Kit"}
        </button>
      </div>

      {/* MODAL 1: Manual Water Duration Picker Modal */}
      {showDurationModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💧</span>
                <h3 className="font-black text-base text-stone-900">
                  {isHindi ? "सिंचाई अवधि चुनें" : "Water for how long?"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDurationModal(false)}
                className="text-stone-500 hover:text-stone-900 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-semibold text-stone-600">
              {isHindi
                ? "सिंचाई शुरू करने के लिए समय चुनें। समय पूरा होने पर मोटर स्वतः बंद हो जाएगी:"
                : "Select how long to run the irrigation pump. The motor will turn off automatically:"}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setSelectedDurationMins(mins)}
                  className={`py-3 px-2 rounded-2xl font-black text-xs transition-all border ${
                    selectedDurationMins === mins
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300"
                      : "bg-stone-50 text-stone-800 border-stone-200 hover:bg-emerald-50 hover:border-emerald-300"
                  }`}
                >
                  {mins} {isHindi ? "मिनट" : "Mins"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDurationModal(false)}
                className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs active:scale-95"
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => handleStartManualWatering(selectedDurationMins)}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Play size={14} className="fill-white" />
                <span>{isHindi ? "सिंचाई शुरू करें" : "Start Watering"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Pair New Device / QR Code Scanner Modal */}
      {showPairModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <h3 className="font-black text-base text-stone-900">
                {isHindi ? "सेंसर किट जोड़ें (QR स्कैन)" : "Scan Kit QR Code"}
              </h3>
              <button
                type="button"
                onClick={() => setShowPairModal(false)}
                className="text-stone-500 hover:text-stone-900 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Viewfinder Window */}
            <div className="relative w-48 h-48 mx-auto rounded-3xl bg-stone-900 border-2 border-emerald-400 overflow-hidden flex items-center justify-center shadow-inner">
              {isPairing ? (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin mx-auto" />
                  <span className="text-xs font-bold text-emerald-400">
                    {isHindi ? "ESP32 नोड कनेक्ट हो रहा है..." : "Syncing ESP32 Node..."}
                  </span>
                </div>
              ) : pairedSuccess ? (
                <div className="space-y-1 text-emerald-400">
                  <CheckCircle2 size={44} className="mx-auto" />
                  <span className="text-xs font-black">
                    {isHindi ? "सफलतापूर्वक कनेक्ट हो गया!" : "Paired Successfully!"}
                  </span>
                </div>
              ) : (
                <div className="space-y-2 relative">
                  <QrCode size={96} className="text-stone-300 mx-auto opacity-70" />
                  <div className="w-full h-0.5 bg-emerald-400 absolute top-1/2 left-0 animate-pulse shadow-sm" />
                  <span className="text-[10px] text-stone-400 block">
                    {isHindi ? "कैमरे को QR कोड के सामने रखें" : "Align camera with QR code"}
                  </span>
                </div>
              )}
            </div>

            {/* Discovered nearby nodes */}
            <div className="text-left space-y-1.5">
              <label className="text-[11px] font-bold text-stone-600 block">
                {isHindi ? "उपलब्ध नोड चुनें:" : "Discovered Hardware Nodes:"}
              </label>
              <select
                value={selectedPairDeviceId}
                onChange={(e) => setSelectedPairDeviceId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 bg-stone-50"
              >
                <option value="ESP32-AGRI-7749">ESP32-AGRI-7749 (Signal: -68 dBm)</option>
                <option value="ESP32-NODE-B12">ESP32-NODE-B12 (Signal: -75 dBm)</option>
                <option value="LORA-PUMP-HUB-01">LORA-PUMP-HUB-01 (Signal: -62 dBm)</option>
              </select>
            </div>

            <button
              type="button"
              disabled={isPairing || pairedSuccess}
              onClick={handleSimulatePairing}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              {isHindi ? "स्कैन व कनेक्ट करें" : "Simulate Scan & Connect"}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: pH Sensor 2-Step Calibration Wizard */}
      {showCalibrateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧪</span>
                <h3 className="font-black text-base text-stone-900">
                  {isHindi ? "2-स्टेप pH कैलिब्रेशन" : "2-Step pH Calibration"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCalibrateModal(false)}
                className="text-stone-500 hover:text-stone-900 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {calibrationDone ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
                <h4 className="font-black text-sm text-stone-900">
                  {isHindi ? "कैलिब्रेशन पूर्ण!" : "Calibration Completed!"}
                </h4>
                <p className="text-xs text-stone-600">
                  {isHindi
                    ? "सेंसर 7.0 और 4.01 बफर मानों पर सटीक सेट हो गया है।"
                    : "Sensor calibrated with 7.0 and 4.01 standard buffers. Offset updated."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 space-y-1">
                  <div className="flex items-center justify-between font-black text-stone-900">
                    <span>
                      {calibrationStep === 1
                        ? isHindi
                          ? "स्टेप 1: pH 7.0 बफर सॉल्यूशन"
                          : "Step 1: pH 7.00 Neutral Buffer"
                        : isHindi
                        ? "स्टेप 2: pH 4.01 बफर सॉल्यूशन"
                        : "Step 2: pH 4.01 Acidic Buffer"}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {calibrationStep}/2
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    {calibrationStep === 1
                      ? isHindi
                        ? "प्रोब को साफ पानी से धोकर pH 7.0 घोल में डुबोएं।"
                        : "Rinse probe in distilled water and dip into pH 7.00 reference packet."
                      : isHindi
                        ? "प्रोब को pH 4.01 घोल में डुबोएं और स्थिर होने दें।"
                        : "Rinse probe again and dip into pH 4.01 reference packet."}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isCalibrating}
                  onClick={handleRunCalibrationStep}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isCalibrating && <RotateCw size={14} className="animate-spin" />}
                  <span>
                    {isCalibrating
                      ? isHindi
                        ? "रीडिंग जांच रहा है..."
                        : "Calibrating probe..."
                      : calibrationStep === 1
                      ? isHindi
                        ? "pH 7.0 कैलिब्रेट करें"
                        : "Calibrate Point 7.00"
                      : isHindi
                      ? "pH 4.01 कैलिब्रेट करें"
                      : "Calibrate Point 4.01"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: Rent-to-Use Sensor Kit Modal */}
      {showRentalModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📦</span>
                <h3 className="font-black text-base text-stone-900">
                  {isHindi ? "स्मार्ट सेंसर किट रेंटल" : "Rent-to-Use Sensor Kit"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRentalModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-emerald-950">
                  {isHindi ? "सीजनल रेंटल शुल्क:" : "Seasonal Subscription:"}
                </span>
                <span className="font-black text-emerald-900 text-sm bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  ₹299 / crop season
                </span>
              </div>
              <ul className="text-[11px] font-semibold text-emerald-800 space-y-1 list-disc list-inside pt-1">
                <li>{isHindi ? "कैपेसिटिव मिट्टी नमी व pH प्रोब" : "Capacitive soil moisture & pH probe"}</li>
                <li>{isHindi ? "सोलर पॉवर्ड LoRa/4G नोड" : "Solar-powered LoRa / 4G field node"}</li>
                <li>{isHindi ? "ऑटो-पंप रिले कंट्रोलर" : "Automated motor starter relay"}</li>
                <li>{isHindi ? "मुफ़्त ऑन-फार्म इंस्टालेशन व सपोर्ट" : "Free doorstep setup & KVK warranty"}</li>
              </ul>
            </div>

            <p className="text-xs text-stone-600 font-medium">
              {isHindi
                ? "आपके नजदीकी कृषि विज्ञान केंद्र (KVK) या ग्राम सेवा केंद्र द्वारा 48 घंटे में किट डिलीवर और इंस्टॉल की जाएगी।"
                : "Your local KVK or Gram Panchayat center will deliver and plug in the sensor node within 48 hours."}
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  soundEffects.success();
                  setShowRentalModal(false);
                  alert(
                    isHindi
                      ? "✅ बुकिंग अनुरोध दर्ज! आपका रेंटल ऑर्डर नंबर #KVK-8829 है।"
                      : "✅ Kit Request Received! Your rental confirmation ID is #KVK-8829."
                  );
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md active:scale-95 transition-all"
              >
                {isHindi ? "ऑर्डर कन्फर्म करें (₹299)" : "Confirm Booking (₹299)"}
              </button>
              <button
                type="button"
                onClick={() => setShowRentalModal(false)}
                className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs active:scale-95"
              >
                {isHindi ? "बाद में" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
