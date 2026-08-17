import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Sprout,
  Volume2,
  Flower2,
  Info,
} from "lucide-react";
import {
  LanguageCode,
  UserProfile,
  GardenerWeeklyWeatherForecast,
  GardenerDailyForecast,
  WeatherConditionType,
  GardenerCareTagType,
} from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";
import {
  fetchGardenerWeeklyWeatherForecast,
  DEFAULT_GARDENER_WEEKLY_WEATHER,
} from "../../services/weatherService";

interface GardenerWeeklyWeatherViewProps {
  currentLanguage: LanguageCode;
  userProfile: UserProfile;
  onBack: () => void;
  onOpenVoiceAssistantWithPrompt?: (prompt: string) => void;
}

export const GardenerWeeklyWeatherView: React.FC<GardenerWeeklyWeatherViewProps> = ({
  currentLanguage,
  userProfile,
  onBack,
  onOpenVoiceAssistantWithPrompt,
}) => {
  const isHindi = currentLanguage === "hi";

  const [forecast, setForecast] = useState<GardenerWeeklyWeatherForecast>(
    DEFAULT_GARDENER_WEEKLY_WEATHER
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const locationName = userProfile.locationName || "Balcony & Terrace Garden";

  // Load weather data on mount or location change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchGardenerWeeklyWeatherForecast(locationName)
      .then((data) => {
        if (isMounted) {
          setForecast(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [locationName]);

  const handleRefresh = async () => {
    soundEffects.click();
    setIsLoading(true);
    try {
      const data = await fetchGardenerWeeklyWeatherForecast(locationName);
      setForecast(data);
      soundEffects.success();
    } catch {
      soundEffects.click();
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDay: GardenerDailyForecast =
    forecast.days[selectedDayIndex] ||
    forecast.days[0] ||
    DEFAULT_GARDENER_WEEKLY_WEATHER.days[0];

  // Helper to get large recognizable weather icon
  const getWeatherIcon = (condition: WeatherConditionType, className = "w-8 h-8") => {
    switch (condition) {
      case "sunny":
      case "clear":
        return <Sun className={`${className} text-amber-500`} />;
      case "partly_cloudy":
        return <CloudSun className={`${className} text-amber-400`} />;
      case "cloudy":
        return <Cloud className={`${className} text-stone-400`} />;
      case "light_rain":
        return <CloudRain className={`${className} text-sky-400`} />;
      case "heavy_rain":
        return <CloudRain className={`${className} text-blue-600`} />;
      case "thunderstorm":
        return <CloudLightning className={`${className} text-indigo-600`} />;
      case "frost":
        return <Thermometer className={`${className} text-cyan-500`} />;
      case "windy":
        return <Wind className={`${className} text-teal-600`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  // Helper for plant care tag styling & badge icon
  const getCareTagBadge = (tagType: GardenerCareTagType) => {
    switch (tagType) {
      case "water_good":
        return {
          bg: "bg-emerald-100 text-emerald-950 border-emerald-300",
          indicatorBg: "bg-emerald-600",
          icon: "💧",
          title: "Good Day to Water",
        };
      case "skip_water_rain":
        return {
          bg: "bg-sky-100 text-sky-950 border-sky-300",
          indicatorBg: "bg-sky-600",
          icon: "🌧️",
          title: "Rain — Skip Watering",
        };
      case "afternoon_shade":
        return {
          bg: "bg-amber-100 text-amber-950 border-amber-300",
          indicatorBg: "bg-amber-600",
          icon: "☀️",
          title: "Hot Sun — Provide Shade",
        };
      case "strong_wind_shelter":
        return {
          bg: "bg-orange-100 text-orange-950 border-orange-300",
          indicatorBg: "bg-orange-600",
          icon: "💨",
          title: "Windy — Secure Pots",
        };
      case "frost_protect":
        return {
          bg: "bg-cyan-100 text-cyan-950 border-cyan-300",
          indicatorBg: "bg-cyan-600",
          icon: "❄️",
          title: "Cold — Move Pots Inside",
        };
      case "compost_feed":
        return {
          bg: "bg-purple-100 text-purple-950 border-purple-300",
          indicatorBg: "bg-purple-600",
          icon: "🪴",
          title: "Great Day to Feed Compost",
        };
      case "check_moisture":
      default:
        return {
          bg: "bg-teal-100 text-teal-950 border-teal-300",
          indicatorBg: "bg-teal-600",
          icon: "👆",
          title: "Check 1-Inch Moisture",
        };
    }
  };

  const weeklySummarySpeechText = isHindi
    ? forecast.weekSummaryTextHindi
    : forecast.weekSummaryText;

  return (
    <div
      id="gardener-weekly-weather-container"
      className="space-y-4 sm:space-y-5 pb-24 max-w-3xl mx-auto px-3 sm:px-4 pt-3 animate-in fade-in duration-200"
    >
      {/* 1. Header & Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          id="gardener-weather-back-btn"
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
            <span className="text-xl">🪴</span>
            <h2 className="font-black text-base sm:text-lg text-stone-900 truncate">
              {isHindi ? "इस सप्ताह का मौसम (गमले व बालकनी)" : "This Week's Weather"}
            </h2>
          </div>
          <p className="text-[11px] font-bold text-stone-500 truncate">
            {locationName} • {forecast.lastUpdated}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="gardener-weather-refresh-btn"
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 active:scale-95 transition-all disabled:opacity-50"
            title="Refresh Live Weather"
          >
            <RotateCw size={16} className={isLoading ? "animate-spin text-teal-600" : ""} />
          </button>
          <AudioButton
            textToSpeak={weeklySummarySpeechText}
            language={currentLanguage}
            size="sm"
          />
        </div>
      </div>

      {/* 2. Warning Banner ONLY for conditions that harm potted/balcony plants */}
      {forecast.hasPotHarmWarning && (
        <div
          id="gardener-pot-harm-warning-banner"
          className={`p-4 rounded-3xl border-2 shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            forecast.potHarmSeverity === "critical"
              ? "bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-200"
              : "bg-amber-50 border-amber-300 text-amber-950 ring-1 ring-amber-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-2xs ${
                forecast.potHarmSeverity === "critical"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {forecast.potHarmIcon || "⚠️"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-sm sm:text-base">
                  {isHindi
                    ? forecast.potHarmTitleHindi || "गमलों के लिए मौसम चेतावनी"
                    : forecast.potHarmTitle || "Weather Alert for Balcony Pots"}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${
                    forecast.potHarmSeverity === "critical"
                      ? "bg-rose-600 text-white"
                      : "bg-amber-600 text-white"
                  }`}
                >
                  {isHindi ? "सावधानी" : "Pot Alert"}
                </span>
              </div>
              <p className="text-xs font-semibold mt-1 leading-relaxed text-stone-800">
                {isHindi ? forecast.potHarmMessageHindi : forecast.potHarmMessage}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-end sm:self-center">
            <AudioButton
              textToSpeak={
                isHindi
                  ? `${forecast.potHarmTitleHindi}. ${forecast.potHarmMessageHindi}`
                  : `${forecast.potHarmTitle}. ${forecast.potHarmMessage}`
              }
              language={currentLanguage}
              size="sm"
            />
          </div>
        </div>
      )}

      {/* 3. Voice Read-Aloud Weekly Summary Strip */}
      <div
        id="gardener-weekly-voice-summary-card"
        className="p-4 rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-800 to-teal-900 text-white shadow-md space-y-2.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎙️</span>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-teal-200">
              {isHindi ? "साप्ताहिक मौसम सारांश व गमला सलाह" : "7-Day Balcony Weather Summary"}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => speakText(weeklySummarySpeechText, currentLanguage)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-black active:scale-95 transition-all backdrop-blur-xs border border-white/20"
          >
            <Volume2 size={14} />
            <span>{isHindi ? "बोलकर सुनें" : "Listen Audio"}</span>
          </button>
        </div>

        <p className="text-xs font-semibold text-teal-50 leading-relaxed bg-black/20 p-3 rounded-2xl border border-white/10">
          {weeklySummarySpeechText}
        </p>

        {/* 7-Day Hydration Quick Calendar */}
        <div className="pt-1 flex items-center justify-between gap-2 flex-wrap text-[11px] font-bold text-teal-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              <strong>{isHindi ? "पानी के दिन:" : "Watering Days:"}</strong>{" "}
              {forecast.weeklyPlan.wateringDays.join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-300"></span>
            <span>
              <strong>{isHindi ? "पानी न दें (बारिश):" : "Skip Watering:"}</strong>{" "}
              {forecast.weeklyPlan.skipWaterDays.join(", ")}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Simplified 7-Day Forecast Strip (Day-wise cards) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-sm text-stone-900 flex items-center gap-1.5">
            <span>📅</span>
            <span>{isHindi ? "7 दिनों का दैनिक पूर्वानुमान" : "7-Day Forecast Strip"}</span>
          </h3>
          <span className="text-[11px] font-bold text-stone-500">
            {isHindi ? "दिन चुनकर गमला सलाह देखें" : "Tap any day to see pot care"}
          </span>
        </div>

        {/* Horizontal scroll strip on mobile / grid on tablet & desktop */}
        <div
          id="gardener-7day-strip"
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2"
        >
          {forecast.days.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            const tagBadge = getCareTagBadge(day.careTagType);

            return (
              <button
                key={day.id}
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setSelectedDayIndex(idx);
                }}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-96 flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? "bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-emerald-500"
                    : "bg-white text-stone-800 border-stone-200 hover:border-emerald-300 hover:bg-stone-50 shadow-2xs"
                }`}
              >
                {/* Top: Day Name & Date */}
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black truncate ${
                        isSelected ? "text-emerald-300" : "text-stone-900"
                      }`}
                    >
                      {day.dayName}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        isSelected ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      {day.dateFormatted}
                    </span>
                  </div>

                  {/* Weather Icon & Condition */}
                  <div className="my-2 flex flex-col items-center justify-center text-center">
                    <div className="p-1 rounded-xl">
                      {getWeatherIcon(day.condition, "w-8 h-8")}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-1 line-clamp-1 ${
                        isSelected ? "text-stone-200" : "text-stone-600"
                      }`}
                    >
                      {isHindi ? day.conditionLabelHindi : day.conditionLabel}
                    </span>
                  </div>
                </div>

                {/* High / Low Temp & Rain Chance */}
                <div className="pt-1.5 border-t border-stone-100/20 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className={isSelected ? "text-white" : "text-stone-900"}>
                      {day.tempHighC}°
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        isSelected ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      {day.tempLowC}°
                    </span>
                  </div>

                  {/* Rain Probability Badge */}
                  <div
                    className={`flex items-center justify-center gap-1 text-[10px] font-bold py-0.5 px-1.5 rounded-md ${
                      day.rainProbabilityPercent >= 40
                        ? "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                        : isSelected
                        ? "bg-white/10 text-stone-300"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    <Droplets size={11} className={day.rainProbabilityPercent >= 40 ? "text-sky-400" : ""} />
                    <span>{day.rainProbabilityPercent}%</span>
                  </div>

                  {/* Plant Care Tag Badge */}
                  <div
                    className={`text-[10px] font-extrabold px-1.5 py-1 rounded-lg line-clamp-2 leading-tight text-center ${
                      isSelected
                        ? "bg-emerald-500 text-stone-950"
                        : `${tagBadge.bg} border`
                    }`}
                  >
                    <span>{tagBadge.icon} </span>
                    <span>{isHindi ? day.gardenerTagHindi : day.gardenerTag}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Expanded Day Detail: Plant-Care Guide for Containers */}
      <div
        id="gardener-selected-day-card"
        className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-stone-200 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
              {getWeatherIcon(selectedDay.condition, "w-10 h-10")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  {selectedDay.dayName} ({selectedDay.dateFormatted})
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-stone-100 text-stone-800">
                  {isHindi ? selectedDay.conditionLabelHindi : selectedDay.conditionLabel}
                </span>
              </div>
              <p className="text-xs font-bold text-stone-500 mt-0.5">
                {isHindi ? "तापमान:" : "Temperature:"} {selectedDay.tempHighC}°C High /{" "}
                {selectedDay.tempLowC}°C Low • Feels like {selectedDay.feelsLikeC}°C
              </p>
            </div>
          </div>

          <AudioButton
            textToSpeak={
              isHindi
                ? `${selectedDay.dayName} का मौसम: ${selectedDay.conditionLabelHindi}, तापमान ${selectedDay.tempHighC} डिग्री। ${selectedDay.potPlantCareTipHindi}`
                : `${selectedDay.dayName} Weather: ${selectedDay.conditionLabel}, High of ${selectedDay.tempHighC} degrees. Care advice: ${selectedDay.potPlantCareTip}`
            }
            language={currentLanguage}
            size="sm"
          />
        </div>

        {/* Metric Badges (Rain, Humidity, Wind, UV) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center gap-2">
            <Droplets size={20} className="text-sky-600 shrink-0" />
            <div>
              <div className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                {isHindi ? "बारिश संभावना" : "Rain Chance"}
              </div>
              <div className="text-sm font-black text-sky-950">
                {selectedDay.rainProbabilityPercent}%{" "}
                {selectedDay.expectedRainMm > 0 && `(${selectedDay.expectedRainMm} mm)`}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center gap-2">
            <span className="text-lg">💧</span>
            <div>
              <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                {isHindi ? "हवा की नमी" : "Air Humidity"}
              </div>
              <div className="text-sm font-black text-teal-950">
                {selectedDay.humidityPercent}%
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-2">
            <Wind size={20} className="text-stone-600 shrink-0" />
            <div>
              <div className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                {isHindi ? "हवा की गति" : "Wind Speed"}
              </div>
              <div className="text-sm font-black text-stone-900">
                {selectedDay.windSpeedKmh} km/h
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2">
            <Sun size={20} className="text-amber-600 shrink-0" />
            <div>
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                {isHindi ? "धूप का स्तर (UV)" : "Balcony UV"}
              </div>
              <div className="text-sm font-black text-amber-950">
                {selectedDay.uvIndex || 6} / 10
              </div>
            </div>
          </div>
        </div>

        {/* Primary Balcony Care Tag & Advice */}
        <div
          className={`p-4 rounded-2xl border-2 space-y-2 ${
            getCareTagBadge(selectedDay.careTagType).bg
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {getCareTagBadge(selectedDay.careTagType).icon}
              </span>
              <h4 className="font-black text-sm sm:text-base">
                {isHindi ? selectedDay.gardenerTagHindi : selectedDay.gardenerTag}
              </h4>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/80 shadow-2xs">
              {isHindi ? selectedDay.wateringAdviceHindi : selectedDay.wateringAdvice}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold leading-relaxed">
            {isHindi ? selectedDay.potPlantCareTipHindi : selectedDay.potPlantCareTip}
          </p>
        </div>

        {/* Specific Plant Care Tips for this day's weather */}
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-500">
            {isHindi ? "गमले व बालकनी पौधों के लिए खास निर्देश" : "Balcony Container Checklist for This Day"}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-stone-700">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
              <span className="text-base mt-0.5">🌿</span>
              <div>
                <strong className="text-stone-900">
                  {isHindi ? "पुदीना, धनिया व तुलसी:" : "Mint, Coriander & Tulsi:"}
                </strong>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  {selectedDay.tempHighC >= 35
                    ? isHindi
                      ? "दोपहर में छांव में रखें और पत्तों पर हल्का पानी छिड़कें।"
                      : "Shift to partial afternoon shade and mist leaves lightly."
                    : selectedDay.rainProbabilityPercent >= 50
                    ? isHindi
                      ? "बारिश का आनंद लेने दें, गमले का पानी निकासी छेद साफ़ रखें।"
                      : "Let them soak in rain; ensure bottom drainage holes are clear."
                    : isHindi
                      ? "सुबह 7-9 बजे जड़ों में हल्का पानी दें।"
                      : "Give a gentle morning root drink between 7:00 and 9:00 AM."}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
              <span className="text-base mt-0.5">🪴</span>
              <div>
                <strong className="text-stone-900">
                  {isHindi ? "सकुलेंट्स व एलोवेरा:" : "Succulents & Aloe Vera:"}
                </strong>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  {selectedDay.rainProbabilityPercent >= 50
                    ? isHindi
                      ? "छत या शेड के नीचे रखें ताकि अधिक बारिश से जड़ें न गलें।"
                      : "Keep under balcony roof to prevent root rot from heavy rain."
                    : isHindi
                      ? "मिट्टी पूरी तरह सूखी हो तभी पानी दें (हर 3-4 दिन में)।"
                      : "Water only when potting soil is bone dry (every 3–4 days)."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Ask AI Assistant for customized weather care */}
      <div className="pt-1">
        <button
          id="gardener-weather-ask-ai-btn"
          type="button"
          onClick={() => {
            soundEffects.click();
            if (onOpenVoiceAssistantWithPrompt) {
              onOpenVoiceAssistantWithPrompt(
                "How should I care for my balcony plants in this week's weather?"
              );
            }
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-black text-white font-black text-xs sm:text-sm shadow-md active:scale-98 flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles size={16} className="text-amber-400" />
          <span>
            {isHindi
              ? "एआई साथी से इस मौसम में पौधों की देखभाल पूछें"
              : "Ask AI Assistant About This Week's Balcony Weather"}
          </span>
        </button>
      </div>
    </div>
  );
};
