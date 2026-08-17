import React, { useState } from "react";
import {
  Droplets,
  Sun,
  CloudRain,
  CloudSun,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  Sparkles,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Info,
  Calendar,
  Layers,
} from "lucide-react";
import { LanguageCode, PlantCareItem } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { INITIAL_PLANTS } from "../../data/mockData";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";

interface GardenerWeatherViewProps {
  currentLanguage: LanguageCode;
  onBack: () => void;
  onOpenVoiceAssistant?: (prompt: string) => void;
  onOpenWeeklyWeather?: () => void;
}

interface PotWateringStatus {
  id: string;
  name: string;
  hindiName: string;
  category: string;
  emoji: string;
  potType: string;
  potSize: string;
  moisturePercent: number;
  needsWaterToday: boolean;
  waterDosage: string;
  lastWatered: string;
  sunExposure: string;
  isWateredToday: boolean;
}

const DEFAULT_POT_STATUSES: PotWateringStatus[] = [
  {
    id: "pot-1",
    name: "Cherry Tomato",
    hindiName: "चेरी टमाटर",
    category: "Vegetable",
    emoji: "🍅",
    potType: "Clay / Terracotta",
    potSize: "10-inch Pot",
    moisturePercent: 28,
    needsWaterToday: true,
    waterDosage: "~450 ml (until drainage)",
    lastWatered: "Yesterday, 7:00 AM",
    sunExposure: "Full Balcony Sun (6 hrs)",
    isWateredToday: false,
  },
  {
    id: "pot-2",
    name: "Fresh Mint (Pudina)",
    hindiName: "ताज़ा पुदीना",
    category: "Herb",
    emoji: "🌱",
    potType: "Plastic Planter",
    potSize: "8-inch Pot",
    moisturePercent: 32,
    needsWaterToday: true,
    waterDosage: "~300 ml (keep damp)",
    lastWatered: "2 days ago",
    sunExposure: "Partial Afternoon Shade",
    isWateredToday: false,
  },
  {
    id: "pot-3",
    name: "Holy Basil (Tulsi)",
    hindiName: "तुलसी का पौधा",
    category: "Sacred Herb",
    emoji: "🌿",
    potType: "Clay / Terracotta",
    potSize: "8-inch Pot",
    moisturePercent: 74,
    needsWaterToday: false,
    waterDosage: "Moist - Skip today",
    lastWatered: "Today, 6:45 AM",
    sunExposure: "Morning Light (4 hrs)",
    isWateredToday: true,
  },
  {
    id: "pot-4",
    name: "Green Chili Pepper",
    hindiName: "हरी मिर्च",
    category: "Vegetable",
    emoji: "🌶️",
    potType: "Fabric Grow Bag",
    potSize: "12-inch Bag",
    moisturePercent: 36,
    needsWaterToday: true,
    waterDosage: "~500 ml root drink",
    lastWatered: "Yesterday afternoon",
    sunExposure: "Full Terrace Sun",
    isWateredToday: false,
  },
  {
    id: "pot-5",
    name: "Desi Rose (Gulab)",
    hindiName: "देसी गुलाब",
    category: "Flower",
    emoji: "🌹",
    potType: "Glazed Ceramic",
    potSize: "12-inch Pot",
    moisturePercent: 68,
    needsWaterToday: false,
    waterDosage: "Moist - Skip today",
    lastWatered: "Yesterday morning",
    sunExposure: "Direct Balcony Sun",
    isWateredToday: true,
  },
  {
    id: "pot-6",
    name: "Aloe Vera",
    hindiName: "एलोवेरा (घृतकुमारी)",
    category: "Succulent",
    emoji: "🪴",
    potType: "Clay Pot",
    potSize: "6-inch Pot",
    moisturePercent: 82,
    needsWaterToday: false,
    waterDosage: "Drought hardy - Skip 3 days",
    lastWatered: "3 days ago",
    sunExposure: "Bright Indirect Light",
    isWateredToday: true,
  },
];

export const GardenerWeatherView: React.FC<GardenerWeatherViewProps> = ({
  currentLanguage,
  onBack,
  onOpenVoiceAssistant,
  onOpenWeeklyWeather,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [potList, setPotList] = useState<PotWateringStatus[]>(DEFAULT_POT_STATUSES);
  const [filterMode, setFilterMode] = useState<"all" | "thirsty" | "hydrated">("all");
  const [selectedPotType, setSelectedPotType] = useState<string>("clay");

  // Filter pots
  const thirstyCount = potList.filter((p) => p.needsWaterToday && !p.isWateredToday).length;
  const hydratedCount = potList.length - thirstyCount;

  const filteredPots = potList.filter((pot) => {
    if (filterMode === "thirsty") return pot.needsWaterToday && !pot.isWateredToday;
    if (filterMode === "hydrated") return !pot.needsWaterToday || pot.isWateredToday;
    return true;
  });

  // Toggle water status for an individual pot
  const handleToggleWater = (id: string) => {
    soundEffects.success();
    setPotList((prev) =>
      prev.map((pot) => {
        if (pot.id === id) {
          const nextWatered = !pot.isWateredToday;
          return {
            ...pot,
            isWateredToday: nextWatered,
            moisturePercent: nextWatered ? 85 : 30,
            lastWatered: nextWatered ? "Just now" : "Yesterday",
          };
        }
        return pot;
      })
    );
  };

  // Bulk water all thirsty pots
  const handleWaterAllThirsty = () => {
    soundEffects.success();
    setPotList((prev) =>
      prev.map((pot) => {
        if (pot.needsWaterToday) {
          return {
            ...pot,
            isWateredToday: true,
            moisturePercent: 85,
            lastWatered: "Just now",
          };
        }
        return pot;
      })
    );
  };

  // Reset demo watering state
  const handleResetPots = () => {
    soundEffects.click();
    setPotList(DEFAULT_POT_STATUSES);
  };

  // 3-Day Forecast with Plant Impact
  const forecastDays = [
    {
      day: "Today",
      date: "Tue, Mar 24",
      temp: "32°C / 19°C",
      weather: "Sunny & Warm",
      icon: Sun,
      iconColor: "text-amber-500",
      action: "Morning Watering",
      actionColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      plantImpact: "Container soil dries quickly in balcony sun. Water before 9 AM.",
      hindiImpact: "तेज धूप में गमलों की मिट्टी जल्दी सूखती है। सुबह 9 बजे से पहले पानी दें।",
    },
    {
      day: "Tomorrow",
      date: "Wed, Mar 25",
      temp: "33°C / 20°C",
      weather: "Partly Cloudy",
      icon: CloudSun,
      iconColor: "text-amber-400",
      action: "Finger Test First",
      actionColor: "bg-amber-100 text-amber-900 border-amber-300",
      plantImpact: "Check 1-inch soil moisture. Mist delicate mint & coriander leaves.",
      hindiImpact: "1 इंच गहराई तक मिट्टी जांचें। पुदीना और धनिए की पत्तियों पर हल्की फुहार करें।",
    },
    {
      day: "Thursday",
      date: "Thu, Mar 26",
      temp: "28°C / 18°C",
      weather: "Scattered Showers",
      icon: CloudRain,
      iconColor: "text-sky-500",
      action: "Skip Outdoor Pots",
      actionColor: "bg-sky-100 text-sky-900 border-sky-300",
      plantImpact: "Rain hydrates terrace pots. Move delicate succulent pots under cover.",
      hindiImpact: "बारिश से खुली छत के गमलों को पानी मिलेगा। एलोवेरा व सकुलेंट्स को भीगने से बचाएं।",
    },
  ];

  // Container Type Care Guides
  const potTypes = [
    {
      id: "clay",
      name: "Clay / Terracotta",
      emoji: "🏺",
      dryingRate: "Fast (Porous)",
      tip: "Breathes well and cools roots, but dries fast in sunny balconies. Needs daily 1-inch finger check.",
    },
    {
      id: "plastic",
      name: "Plastic Planters",
      emoji: "🪴",
      dryingRate: "Slow to Moderate",
      tip: "Retains moisture much longer. Beware of overwatering and verify bottom drainage holes stay unblocked.",
    },
    {
      id: "ceramic",
      name: "Glazed Ceramic",
      emoji: "🏺",
      dryingRate: "Slow Drying",
      tip: "Soil stays damp for 2-3 days. Always feel topsoil dryness before giving more water.",
    },
    {
      id: "growbag",
      name: "Fabric Grow Bags",
      emoji: "👜",
      dryingRate: "Very Fast (High Airflow)",
      tip: "Excellent aeration with zero root circling. Requires steady morning watering and coco-peat mulch.",
    },
  ];

  const speechSummary = `Pot Watering Status: ${thirstyCount} pots need water today, ${hydratedCount} are well hydrated. Today's balcony temperature is 32 degrees sunny. Check the 1-inch topsoil before watering.`;

  return (
    <div className="space-y-4 sm:space-y-5 pb-24 max-w-2xl mx-auto px-3 sm:px-4 pt-3 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs active:scale-95 transition-all"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl">💧</span>
          <h2 className="font-black text-lg text-stone-900">
            {currentLanguage === "hi" ? "गमलों में पानी व देखभाल" : "Pot & Plant Watering"}
          </h2>
        </div>

        <AudioButton
          textToSpeak={speechSummary}
          language={currentLanguage}
          size="sm"
        />
      </div>

      {/* 1. Today's Container Hydration Summary Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-sky-900 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Droplets size={24} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-200">
                {currentLanguage === "hi" ? "आज की पानी स्थिति" : "Today's Pot Hydration"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                {thirstyCount > 0
                  ? `${thirstyCount} ${currentLanguage === "hi" ? "गमलों को पानी चाहिए" : "Pots Need Water"}`
                  : `${currentLanguage === "hi" ? "सभी गमले हरे-भरे हैं" : "All Pots Well Hydrated"}`}
              </h3>
            </div>
          </div>

          <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-xs text-white font-black text-xs border border-white/20">
            ☀️ 32°C Sunny
          </span>
        </div>

        <p className="text-xs font-semibold text-teal-100 leading-relaxed bg-black/20 p-3 rounded-2xl border border-white/10">
          {currentLanguage === "hi"
            ? "आज धूप तेज रहेगी। गमलों की ऊपरी मिट्टी जल्दी सूख सकती है। सुबह के समय जड़ों में पानी दें और दोपहर की सीधी धूप से नाजुक पौधों को बचाएं।"
            : "Sunny balcony weather today. Container soil evaporates faster than ground soil. Water early at the root base and protect tender leafy greens during peak afternoon sun."}
        </p>

        {/* 1-Inch Finger Test Callout */}
        <div className="flex items-start gap-2 text-xs font-bold text-teal-200 pt-1">
          <span className="text-base">👆</span>
          <p className="leading-snug">
            <strong>{currentLanguage === "hi" ? "1-इंच नियम:" : "1-Inch Finger Test:"}</strong>{" "}
            {currentLanguage === "hi"
              ? "मिट्टी में 1 इंच उंगली डालकर देखें। सूखी लगे तभी पानी दें, जब तक कि नीचे के छेद से कुछ बूंदें न टपकें।"
              : "Insert your index finger 1 inch into the pot soil. Only water if it feels dry to the touch."}
          </p>
        </div>
      </div>

      {/* 2. Per-Pot / Per-Plant Watering Status Section */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h3 className="font-black text-sm text-stone-900 flex items-center gap-1.5">
              <span>🪴</span>
              <span>{currentLanguage === "hi" ? "गमलेवार पानी स्थिति" : "Per-Pot Watering Status"}</span>
            </h3>
            <p className="text-[11px] font-semibold text-stone-500">
              {currentLanguage === "hi"
                ? "हर गमले की नमी व पानी की मात्रा देखें"
                : "Individual container moisture & hydration tracker"}
            </p>
          </div>

          {/* Quick Bulk Action */}
          {thirstyCount > 0 && (
            <button
              type="button"
              onClick={handleWaterAllThirsty}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-xs active:scale-95 transition-all"
            >
              <Droplets size={14} />
              <span>{currentLanguage === "hi" ? "सभी प्यासे गमलों को पानी दें" : "Water All Thirsty Pots"}</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              setFilterMode("all");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterMode === "all"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            {currentLanguage === "hi" ? "सभी गमले" : "All Pots"} ({potList.length})
          </button>
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              setFilterMode("thirsty");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterMode === "thirsty"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            <span>💧</span>
            <span>{currentLanguage === "hi" ? "पानी चाहिए" : "Needs Water"}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-amber-900/20 text-[10px] font-black">
              {thirstyCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              setFilterMode("hydrated");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterMode === "hydrated"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <span>✅</span>
            <span>{currentLanguage === "hi" ? "पानी दिया हुआ" : "Hydrated"}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-900/20 text-[10px] font-black">
              {hydratedCount}
            </span>
          </button>
        </div>

        {/* List of Potted Plants */}
        <div className="space-y-2.5">
          {filteredPots.map((pot) => {
            const isThirsty = pot.needsWaterToday && !pot.isWateredToday;
            const isHydrated = !isThirsty;

            return (
              <div
                key={pot.id}
                className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition-all ${
                  isThirsty
                    ? "border-amber-300 ring-1 ring-amber-200 shadow-xs"
                    : "border-stone-200 shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Plant Icon & Info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                      {pot.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-black text-sm text-stone-900">
                          {currentLanguage === "hi" ? pot.hindiName : pot.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                          {pot.potSize}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-stone-500">
                        <span>🏺 {pot.potType}</span>
                        <span>•</span>
                        <span>{pot.sunExposure}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Pill & Toggle Button */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                        isThirsty
                          ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}
                    >
                      {isThirsty
                        ? currentLanguage === "hi"
                          ? "पानी दें"
                          : "Needs Water"
                        : currentLanguage === "hi"
                        ? "संतुष्ट"
                        : "Hydrated"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleWater(pot.id)}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-xs ${
                        isThirsty
                          ? "bg-teal-600 hover:bg-teal-700 text-white ring-1 ring-teal-500"
                          : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                      }`}
                    >
                      {isThirsty ? (
                        <>
                          <Droplets size={14} className="text-teal-200" />
                          <span>{currentLanguage === "hi" ? "पानी दिया" : "Water Pot"}</span>
                        </>
                      ) : (
                        <>
                          <Check size={14} className="text-emerald-700" />
                          <span>{currentLanguage === "hi" ? "हो गया" : "Watered"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Bottom: Soil Moisture Meter & Watering Advice */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-stone-600 flex items-center gap-1">
                      <span>💧 Pot Soil Moisture:</span>
                      <strong
                        className={
                          pot.moisturePercent < 40
                            ? "text-amber-700"
                            : pot.moisturePercent < 75
                            ? "text-emerald-700"
                            : "text-sky-700"
                        }
                      >
                        {pot.moisturePercent}% (
                        {pot.moisturePercent < 40
                          ? "Dry Topsoil"
                          : pot.moisturePercent < 75
                          ? "Moist & Healthy"
                          : "Wet & Damp"}
                        )
                      </strong>
                    </span>
                    <span className="text-stone-400 text-[10px]">
                      Last: {pot.lastWatered}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pot.moisturePercent < 40
                          ? "bg-gradient-to-r from-amber-400 to-amber-500"
                          : pot.moisturePercent < 75
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : "bg-gradient-to-r from-sky-400 to-blue-500"
                      }`}
                      style={{ width: `${pot.moisturePercent}%` }}
                    />
                  </div>

                  {/* Recommended Dosage */}
                  <div className="flex items-center justify-between text-[11px] text-stone-600 pt-0.5">
                    <span className="font-semibold">
                      🥛 {currentLanguage === "hi" ? "अनुशंसित मात्रा:" : "Dosage:"}{" "}
                      <strong className="text-stone-800">{pot.waterDosage}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Container / Pot Material Drying Guide */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-sm text-stone-900 flex items-center gap-1.5">
            <span>🏺</span>
            <span>{currentLanguage === "hi" ? "गमले का प्रकार व सुखाने की गति" : "Pot Material & Drying Speed"}</span>
          </h3>
          <span className="text-[11px] font-bold text-stone-500">Container Guide</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {potTypes.map((pt) => (
            <button
              key={pt.id}
              type="button"
              onClick={() => {
                soundEffects.click();
                setSelectedPotType(pt.id);
              }}
              className={`p-3 rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-between ${
                selectedPotType === pt.id
                  ? "bg-teal-800 text-white border-teal-900 ring-2 ring-teal-400 shadow-xs"
                  : "bg-white text-stone-800 border-stone-200 hover:bg-stone-50"
              }`}
            >
              <span className="text-2xl mb-1">{pt.emoji}</span>
              <span className="text-xs font-black line-clamp-1">{pt.name.split("/")[0]}</span>
              <span
                className={`text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded-md ${
                  selectedPotType === pt.id
                    ? "bg-teal-950 text-teal-200"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {pt.dryingRate.split("(")[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Pot Care Details */}
        {(() => {
          const selected = potTypes.find((p) => p.id === selectedPotType) || potTypes[0];
          return (
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-teal-950 flex items-center gap-1.5">
                  <span>{selected.emoji}</span>
                  <span>{selected.name} Hydration Tip</span>
                </span>
                <span className="text-[10px] font-black text-teal-800 bg-teal-200/70 px-2 py-0.5 rounded-md">
                  {selected.dryingRate}
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-800 leading-relaxed pt-0.5">
                {selected.tip}
              </p>
            </div>
          );
        })()}
      </div>

      {/* 4. 3-Day Balcony Outlook & Impact */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-sm text-stone-900 flex items-center gap-1.5">
            <span>⛅</span>
            <span>{currentLanguage === "hi" ? "3 दिन का मौसम व गमलों पर प्रभाव" : "3-Day Balcony Outlook"}</span>
          </h3>
          {onOpenWeeklyWeather && (
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                onOpenWeeklyWeather();
              }}
              className="text-[11px] font-black text-teal-800 hover:text-teal-900 flex items-center gap-0.5"
            >
              <span>{currentLanguage === "hi" ? "पूरा 7-दिन मौसम देखें →" : "View 7-Day Weather →"}</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          {forecastDays.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 shrink-0">
                    <Icon size={24} className={f.iconColor} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-xs sm:text-sm text-stone-900">{f.day}</h4>
                      <span className="text-[11px] font-bold text-stone-500">({f.date})</span>
                    </div>
                    <p className="text-xs font-semibold text-stone-700 mt-0.5">
                      {currentLanguage === "hi" ? f.hindiImpact : f.plantImpact}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <span className="text-xs font-black text-stone-800">{f.temp}</span>
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black border ${f.actionColor}`}
                  >
                    {f.action}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Quick Assistant CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            if (onOpenVoiceAssistant) {
              onOpenVoiceAssistant("Which of my balcony pots need watering today?");
            }
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-black text-white font-black text-xs shadow-md active:scale-98 flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles size={16} className="text-amber-400" />
          <span>{currentLanguage === "hi" ? "एआई साथी से गमलों में पानी की सलाह लें" : "Ask AI Assistant About Today's Watering"}</span>
        </button>
      </div>
    </div>
  );
};
