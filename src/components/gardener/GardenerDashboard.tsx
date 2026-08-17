import React, { useState, useEffect } from "react";
import {
  Sprout,
  Droplets,
  Camera,
  Sun,
  CloudSun,
  CloudRain,
  Sparkles,
  CheckCircle2,
  Plus,
  Heart,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Check,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Wind,
  Thermometer,
} from "lucide-react";
import {
  UserProfile,
  LanguageCode,
  PlantCareItem,
  GardenerWeeklyWeatherForecast,
} from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { INITIAL_PLANTS } from "../../data/mockData";
import { GARDENER_DIY_RECIPES, GARDENER_WEATHER_TIPS } from "../../data/gardenerData";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";
import {
  fetchGardenerWeeklyWeatherForecast,
  DEFAULT_GARDENER_WEEKLY_WEATHER,
} from "../../services/weatherService";
import { PlantDetailModal } from "./PlantDetailModal";
import { AddPlantModal } from "./AddPlantModal";

interface GardenerDashboardProps {
  userProfile: UserProfile;
  currentLanguage: LanguageCode;
  onOpenPlantDoctor: () => void;
  onOpenVoiceAssistantWithPrompt: (prompt: string, section?: string) => void;
  onOpenWateringGuide?: () => void;
  onOpenWeeklyWeather?: () => void;
}

interface ReminderTask {
  id: string;
  title: string;
  hindiTitle: string;
  category: "water" | "sun" | "compost" | "prune";
  emoji: string;
  isCompleted: boolean;
  timeHint: string;
}

export const GardenerDashboard: React.FC<GardenerDashboardProps> = ({
  userProfile,
  currentLanguage,
  onOpenPlantDoctor,
  onOpenVoiceAssistantWithPrompt,
  onOpenWateringGuide,
  onOpenWeeklyWeather,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const isHindi = currentLanguage === "hi";

  // Plants state
  const [plants, setPlants] = useState<PlantCareItem[]>(INITIAL_PLANTS);

  // Selected Plant for Detail Modal
  const [selectedPlant, setSelectedPlant] = useState<PlantCareItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);

  // Weekly Weather Forecast State
  const [weeklyForecast, setWeeklyForecast] = useState<GardenerWeeklyWeatherForecast>(
    DEFAULT_GARDENER_WEEKLY_WEATHER
  );

  useEffect(() => {
    let isMounted = true;
    fetchGardenerWeeklyWeatherForecast(userProfile.locationName || "Balcony Garden")
      .then((data) => {
        if (isMounted) {
          setWeeklyForecast(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [userProfile.locationName]);

  // Reminders state
  const [reminders, setReminders] = useState<ReminderTask[]>([
    {
      id: "rem-1",
      title: "Water Fresh Mint & Coriander pots",
      hindiTitle: "पुदीना और धनिए के गमले में पानी डालें",
      category: "water",
      emoji: "💧",
      isCompleted: false,
      timeHint: "Morning (8:00 AM)",
    },
    {
      id: "rem-2",
      title: "Move Cherry Tomato to full sun side",
      hindiTitle: "टमाटर के गमले को धूप वाली जगह रखें",
      category: "sun",
      emoji: "☀️",
      isCompleted: false,
      timeHint: "Before noon",
    },
    {
      id: "rem-3",
      title: "Feed 1 spoon vermicompost to Rose plant",
      hindiTitle: "गुलाब के गमले में 1 चम्मच वर्मीकम्पोस्ट डालें",
      category: "compost",
      emoji: "🪴",
      isCompleted: true,
      timeHint: "Weekly task",
    },
    {
      id: "rem-4",
      title: "Pinch Tulsi flower spikes (Manjari) for bushier growth",
      hindiTitle: "तुलसी की मंजरी को पिंच करें ताकि पौधा घना बने",
      category: "prune",
      emoji: "✂️",
      isCompleted: false,
      timeHint: "Evening",
    },
  ]);

  // Greeting logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", hindi: "शुभ प्रभात", emoji: "☀️" };
    if (hour < 17) return { text: "Good Afternoon", hindi: "शुभ दोपहर", emoji: "🌤️" };
    return { text: "Good Evening", hindi: "शुभ संध्या", emoji: "🌙" };
  };

  const greeting = getGreeting();
  const pendingWaterCount = plants.filter((p) => !p.wateredToday).length;
  const pendingRemindersCount = reminders.filter((r) => !r.isCompleted).length;

  const handleToggleWater = (plantId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEffects.click();
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === plantId) {
          const nextStatus = !p.wateredToday;
          if (nextStatus) {
            soundEffects.success();
            speakText(`${p.plantName} marked as watered!`, currentLanguage);
          }
          return {
            ...p,
            wateredToday: nextStatus,
            moisturePercent: nextStatus ? 85 : 30,
            healthStatus: nextStatus ? "Thriving" : "Needs Water",
          };
        }
        return p;
      })
    );
  };

  const handleToggleReminder = (remId: string) => {
    soundEffects.click();
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === remId) {
          const nextDone = !r.isCompleted;
          if (nextDone) {
            soundEffects.success();
            speakText(`Task completed!`, currentLanguage);
          }
          return { ...r, isCompleted: nextDone };
        }
        return r;
      })
    );
  };

  const handleUpdatePlantStage = (
    plantId: string,
    newStage: "seedling" | "growing" | "flowering_fruiting" | "harvest_mature"
  ) => {
    setPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, growthStage: newStage } : p))
    );
    if (selectedPlant && selectedPlant.id === plantId) {
      setSelectedPlant((prev) => (prev ? { ...prev, growthStage: newStage } : null));
    }
  };

  const handleAddPlant = (newPlant: PlantCareItem) => {
    setPlants((prev) => [newPlant, ...prev]);
  };

  // Weather Tip
  const weatherTip = GARDENER_WEATHER_TIPS[0];

  const greetingSummarySpeech = `${greeting.text}, ${userProfile.name}. In your garden, ${
    pendingWaterCount > 0 ? `${pendingWaterCount} plants need water today.` : "all plants are watered."
  } Today's weather in ${userProfile.locationName || "your area"} is Sunny, 32 degrees Celsius. ${
    weatherTip.tip
  }`;

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 max-w-3xl mx-auto px-3 sm:px-4 pt-3 animate-in fade-in duration-200">
      {/* 1. Time-Aware Greeting & Garden Health Card */}
      <div
        id="gardener-greeting-card"
        className="p-5 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-teal-700 text-white shadow-md space-y-3"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{greeting.emoji}</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {currentLanguage === "hi"
                  ? `${greeting.hindi}, ${userProfile.name}!`
                  : `${greeting.text}, ${userProfile.name}!`}
              </h2>
            </div>
            <p className="text-xs text-teal-100 font-medium">
              {userProfile.locationName || "Balcony Garden"} • Sunny, 32°C
            </p>
          </div>

          <AudioButton
            textToSpeak={greetingSummarySpeech}
            language={currentLanguage}
            size="sm"
          />
        </div>

        {/* Quick Health Summary Pill Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-white/15 border border-white/10 backdrop-blur-xs flex items-center gap-2">
            <span className="text-xl">🪴</span>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-teal-200">
                Total Plants
              </div>
              <div className="text-sm font-black">{plants.length} Pots</div>
            </div>
          </div>

          <div
            onClick={() => onOpenWateringGuide && onOpenWateringGuide()}
            className="p-2.5 rounded-2xl bg-white/15 border border-white/10 backdrop-blur-xs flex items-center gap-2 cursor-pointer hover:bg-white/20 transition-all"
          >
            <span className="text-xl">💧</span>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-sky-200">
                Water Status
              </div>
              <div className="text-sm font-black">
                {pendingWaterCount === 0 ? "All Watered ✓" : `${pendingWaterCount} Need Water`}
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-2.5 rounded-2xl bg-white/15 border border-white/10 backdrop-blur-xs flex items-center gap-2">
            <span className="text-xl">☀️</span>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-amber-200">
                Balcony Sun
              </div>
              <div className="text-sm font-black">Good Morning Light</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Reminders (Tap to Complete) */}
      <div id="gardener-today-reminders" className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h3 className="font-black text-base text-stone-900">Today's Reminders</h3>
            {pendingRemindersCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">
                {pendingRemindersCount} pending
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900">
                All Done 🎉
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold text-stone-500">Tap to check off</span>
        </div>

        <div className="space-y-2">
          {reminders.map((rem) => (
            <button
              key={rem.id}
              type="button"
              onClick={() => handleToggleReminder(rem.id)}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all active:scale-98 ${
                rem.isCompleted
                  ? "bg-stone-50 border-stone-200 opacity-60"
                  : "bg-white border-emerald-200 hover:border-emerald-400 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    rem.isCompleted
                      ? "bg-emerald-600 border-emerald-700 text-white"
                      : "bg-white border-stone-300 text-transparent"
                  }`}
                >
                  <Check size={16} className="stroke-[3]" />
                </div>
                <div>
                  <h4
                    className={`font-black text-xs sm:text-sm ${
                      rem.isCompleted
                        ? "line-through text-stone-500 font-semibold"
                        : "text-stone-900"
                    }`}
                  >
                    {currentLanguage === "hi" ? rem.hindiTitle : rem.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-stone-500">
                    {rem.timeHint}
                  </span>
                </div>
              </div>

              <span className="text-xl shrink-0">{rem.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. This Week's Weather Forecast Card for Balcony Plants */}
      <div
        id="gardener-weekly-weather-card"
        className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-emerald-200 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
              🌤️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-stone-900">
                  {isHindi ? "इस सप्ताह का मौसम (7 दिन)" : "This Week's Weather"}
                </h3>
                {weeklyForecast.hasPotHarmWarning && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                    {isHindi ? "अलर्ट" : "Pot Alert"}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-bold text-stone-500">
                {isHindi ? "बालकनी व गमलों के लिए मौसम पूर्वानुमान" : "7-Day Balcony & Container Forecast"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <AudioButton
              textToSpeak={
                isHindi
                  ? weeklyForecast.weekSummaryTextHindi
                  : weeklyForecast.weekSummaryText
              }
              language={currentLanguage}
              size="sm"
            />
            {onOpenWeeklyWeather && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.click();
                  onOpenWeeklyWeather();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs active:scale-95 transition-all shadow-2xs"
              >
                <span>{isHindi ? "पूरा देखें" : "View 7 Days"}</span>
                <ChevronRight size={14} className="stroke-[3]" />
              </button>
            )}
          </div>
        </div>

        {/* 7-Day Forecast Mini Preview Strip */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 pt-1">
          {weeklyForecast.days.slice(0, 7).map((day, idx) => (
            <div
              key={day.id || idx}
              onClick={() => {
                soundEffects.click();
                if (onOpenWeeklyWeather) onOpenWeeklyWeather();
              }}
              className={`p-2 rounded-2xl border text-center transition-all cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 flex flex-col justify-between ${
                idx === 0
                  ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200"
                  : "bg-stone-50 border-stone-200"
              }`}
            >
              <span className={`text-[10px] font-black truncate ${idx === 0 ? "text-emerald-900 font-black" : "text-stone-700"}`}>
                {day.dayName}
              </span>
              <div className="my-1 text-base">
                {day.condition === "sunny" || day.condition === "clear"
                  ? "☀️"
                  : day.condition === "partly_cloudy"
                  ? "⛅"
                  : day.condition === "light_rain" || day.condition === "heavy_rain"
                  ? "🌧️"
                  : day.condition === "thunderstorm"
                  ? "⛈️"
                  : day.condition === "windy"
                  ? "💨"
                  : "🌤️"}
              </div>
              <div className="text-[10px] font-black text-stone-900">
                {day.tempHighC}° / <span className="text-stone-500 font-semibold">{day.tempLowC}°</span>
              </div>
              {day.rainProbabilityPercent >= 30 && (
                <div className="text-[9px] font-bold text-sky-700 mt-0.5 flex items-center justify-center gap-0.5">
                  <span>💧</span>
                  <span>{day.rainProbabilityPercent}%</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Today's Plant Care Tag & Quick Advisory */}
        <div
          onClick={() => {
            soundEffects.click();
            if (onOpenWeeklyWeather) onOpenWeeklyWeather();
          }}
          className="p-3 rounded-2xl bg-teal-50 border border-teal-200 cursor-pointer hover:bg-teal-100/70 transition-all flex items-start gap-2.5"
        >
          <span className="text-xl shrink-0 mt-0.5">🌿</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-900 bg-teal-200/80 px-2 py-0.5 rounded-md">
                {isHindi
                  ? weeklyForecast.days[0]?.gardenerTagHindi || "आज की देखभाल"
                  : weeklyForecast.days[0]?.gardenerTag || "Today's Pot Care"}
              </span>
              <span className="text-[11px] font-bold text-teal-800 truncate">
                {weeklyForecast.days[0]?.wateringAdvice}
              </span>
            </div>
            <p className="text-xs font-semibold text-stone-800 leading-relaxed mt-1 line-clamp-2">
              {isHindi
                ? weeklyForecast.days[0]?.potPlantCareTipHindi
                : weeklyForecast.days[0]?.potPlantCareTip}
            </p>
          </div>
          <ChevronRight size={16} className="text-teal-700 shrink-0 self-center" />
        </div>
      </div>

      {/* 4. Weather-Based Tip of the Day */}
      <div
        id="weather-tip-card"
        className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-200 shadow-2xs space-y-1.5 flex items-start gap-3"
      >
        <span className="text-2xl mt-0.5">💡</span>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-xs uppercase tracking-wider text-amber-900">
              Weather Tip of the Day • {weatherTip.title}
            </h4>
            <AudioButton
              textToSpeak={`Tip of the day: ${weatherTip.title}. ${weatherTip.tip}`}
              language={currentLanguage}
              size="sm"
            />
          </div>
          <p className="text-xs font-semibold text-stone-800 leading-relaxed">
            {currentLanguage === "hi" ? weatherTip.hindiTip : weatherTip.tip}
          </p>
        </div>
      </div>

      {/* 5. Quick Doctor AI Snap Banner */}
      <div
        onClick={() => {
          soundEffects.camera();
          onOpenPlantDoctor();
        }}
        className="p-4 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm flex items-center justify-between cursor-pointer active:scale-98 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Camera size={26} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-sm sm:text-base">Plant Doctor AI</h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white text-amber-900">
                Instant Snap
              </span>
            </div>
            <p className="text-xs text-amber-100 font-semibold mt-0.5">
              Yellow leaves or pests? Take a quick photo for organic home cures.
            </p>
          </div>
        </div>

        <ChevronRight size={22} className="stroke-[3]" />
      </div>

      {/* 5. "My Plants" Section */}
      <div id="gardener-my-plants-section" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪴</span>
            <h3 className="font-black text-base sm:text-lg text-stone-900">
              {t.gardener.myPlants}
            </h3>
            <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
              {plants.length} Plants
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              setIsAddPlantOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs active:scale-95 flex items-center gap-1"
          >
            <Plus size={15} />
            <span>Add Plant</span>
          </button>
        </div>

        {/* Plants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {plants.map((plant) => (
            <div
              key={plant.id}
              onClick={() => {
                soundEffects.click();
                setSelectedPlant(plant);
                setIsDetailOpen(true);
              }}
              className={`p-3.5 rounded-3xl border-2 transition-all bg-white cursor-pointer hover:shadow-md active:scale-99 flex flex-col justify-between ${
                plant.wateredToday
                  ? "border-emerald-200 shadow-2xs"
                  : "border-sky-300 ring-1 ring-sky-200 shadow-xs"
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={plant.image}
                  alt={plant.plantName}
                  className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shadow-2xs shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-base text-stone-900 line-clamp-1">
                        {plant.plantName}
                      </h4>
                      <span className="text-[11px] font-semibold text-stone-500 line-clamp-1">
                        {plant.variety}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        plant.wateredToday
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-sky-100 text-sky-900"
                      }`}
                    >
                      {plant.wateredToday ? "Hydrated" : "Needs Water"}
                    </span>
                  </div>

                  {/* Moisture Indicator Bar */}
                  <div className="flex items-center gap-2 text-xs pt-1">
                    <span className="text-[10px] font-bold text-stone-500">Moisture:</span>
                    <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          plant.moisturePercent < 40 ? "bg-amber-500" : "bg-teal-500"
                        }`}
                        style={{ width: `${plant.moisturePercent}%` }}
                      />
                    </div>
                    <span className="font-black text-stone-700 text-[11px]">
                      {plant.moisturePercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-600 line-clamp-1">
                  🔍 Tap for Care Guide
                </span>

                <button
                  type="button"
                  onClick={(e) => handleToggleWater(plant.id, e)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs ${
                    plant.wateredToday
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-sky-600 hover:bg-sky-700 text-white"
                  }`}
                >
                  <Droplets size={14} />
                  <span>{plant.wateredToday ? "Watered ✓" : "Water Now"}</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add Plant Card Placeholder */}
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              setIsAddPlantOpen(true);
            }}
            className="p-6 rounded-3xl border-2 border-dashed border-stone-300 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50/50 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 group min-h-[140px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-emerald-600 text-stone-400 group-hover:text-white flex items-center justify-center shadow-2xs transition-colors">
              <Plus size={24} />
            </div>
            <div>
              <span className="font-black text-sm text-stone-800 group-hover:text-emerald-950">
                + Add Another Plant
              </span>
              <p className="text-[11px] text-stone-500 font-semibold">
                Chili, Rose, Coriander, Aloe Vera & more
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 6. DIY Organic Home Fertilizer Recipes */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-base sm:text-lg text-stone-900 flex items-center gap-2">
            <span>🧪</span>
            <span>{t.gardener.diyFertilizer}</span>
          </h3>
          <span className="text-xs font-bold text-stone-500">100% Home Kitchen Safe</span>
        </div>

        <div className="space-y-2.5">
          {GARDENER_DIY_RECIPES.map((diy, idx) => (
            <div
              key={idx}
              className="p-4 rounded-3xl bg-white border-2 border-stone-200 shadow-2xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{diy.emoji}</span>
                  <div>
                    <h4 className="font-black text-sm sm:text-base text-stone-900">
                      {diy.title}
                    </h4>
                    <span className="text-xs font-semibold text-teal-800">{diy.target}</span>
                  </div>
                </div>
                <AudioButton
                  textToSpeak={`${diy.title}. ${diy.target}. Recipe: ${diy.recipe}`}
                  language={currentLanguage}
                  size="sm"
                />
              </div>
              <p className="text-xs font-medium text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed">
                📖 {diy.recipe}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <PlantDetailModal
        plant={selectedPlant}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        currentLanguage={currentLanguage}
        onUpdateStage={handleUpdatePlantStage}
        onAskAboutPlant={(plantName, query) => {
          onOpenVoiceAssistantWithPrompt(
            query || `How do I take care of my ${plantName}?`,
            "my_plants"
          );
        }}
      />

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
        currentLanguage={currentLanguage}
        onAddPlant={handleAddPlant}
      />
    </div>
  );
};
