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
  FlaskConical,
  Sprout,
  Volume2,
} from "lucide-react";
import {
  LanguageCode,
  WeeklyWeatherForecast,
  DailyWeatherForecast,
  WeatherConditionType,
  FarmAdvisoryType,
  UserProfile,
} from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";
import {
  fetchWeeklyWeatherForecast,
  DEFAULT_WEEKLY_WEATHER,
} from "../../services/weatherService";

interface WeeklyWeatherViewProps {
  currentLanguage: LanguageCode;
  userProfile: UserProfile;
  onBack: () => void;
  onOpenVoiceAssistantWithPrompt?: (prompt: string) => void;
}

export const WeeklyWeatherView: React.FC<WeeklyWeatherViewProps> = ({
  currentLanguage,
  userProfile,
  onBack,
  onOpenVoiceAssistantWithPrompt,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const isHindi = currentLanguage === "hi";

  const [forecast, setForecast] = useState<WeeklyWeatherForecast>(DEFAULT_WEEKLY_WEATHER);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const locationName = userProfile.locationName || "Ujjain, Madhya Pradesh";

  // Load weather data on mount or location change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchWeeklyWeatherForecast(locationName)
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
      const data = await fetchWeeklyWeatherForecast(locationName);
      setForecast(data);
      soundEffects.success();
    } catch {
      soundEffects.click();
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDay: DailyWeatherForecast =
    forecast.days[selectedDayIndex] || forecast.days[0] || DEFAULT_WEEKLY_WEATHER.days[0];

  // Helper to get large recognizable weather icon
  const getWeatherIcon = (condition: WeatherConditionType, className: string = "w-8 h-8") => {
    switch (condition) {
      case "sunny":
      case "clear":
        return <Sun className={`${className} text-amber-500`} />;
      case "partly_cloudy":
        return <CloudSun className={`${className} text-amber-400`} />;
      case "cloudy":
        return <Cloud className={`${className} text-stone-400`} />;
      case "light_rain":
        return <CloudRain className={`${className} text-sky-500`} />;
      case "heavy_rain":
        return <CloudRain className={`${className} text-blue-600`} />;
      case "thunderstorm":
        return <CloudLightning className={`${className} text-indigo-600`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  // Advisory tag badge style
  const getAdvisoryBadgeStyle = (type: FarmAdvisoryType) => {
    switch (type) {
      case "spray_safe":
      case "harvest_safe":
      case "sowing_good":
        return {
          bg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          cardBorder: "border-emerald-300 hover:border-emerald-400",
          icon: "✅",
        };
      case "delay_irrigation":
        return {
          bg: "bg-sky-100 text-sky-900 border-sky-300",
          cardBorder: "border-sky-300 hover:border-sky-400",
          icon: "🌧️",
        };
      case "spray_avoid":
        return {
          bg: "bg-amber-100 text-amber-900 border-amber-300",
          cardBorder: "border-amber-300 hover:border-amber-400",
          icon: "⚠️",
        };
      case "heat_stress":
      case "frost_warning":
        return {
          bg: "bg-rose-100 text-rose-900 border-rose-300",
          cardBorder: "border-rose-300 hover:border-rose-400",
          icon: "🚨",
        };
      default:
        return {
          bg: "bg-stone-100 text-stone-800 border-stone-300",
          cardBorder: "border-stone-200 hover:border-stone-300",
          icon: "☀️",
        };
    }
  };

  // Week Speech Summary Text
  const weekSpokenText = isHindi
    ? forecast.weekSummaryTextHindi || forecast.weekSummaryText
    : forecast.weekSummaryText;

  return (
    <div className="space-y-4 sm:space-y-5 pb-24 max-w-4xl mx-auto px-3 sm:px-4 pt-3 animate-in fade-in duration-200">
      {/* 1. Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          id="weekly-weather-back-btn"
          onClick={() => {
            soundEffects.click();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs active:scale-95 transition-all"
        >
          <ArrowLeft size={16} />
          <span>{t.common.back}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl">⛅</span>
          <h2 className="font-black text-base sm:text-lg text-stone-900">
            {isHindi ? "साप्ताहिक मौसम पूर्वानुमान" : "Weekly Weather Forecast"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="weekly-weather-refresh-btn"
            onClick={handleRefresh}
            title="Refresh forecast"
            disabled={isLoading}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 active:scale-90 transition-all disabled:opacity-50"
          >
            <RotateCw size={16} className={isLoading ? "animate-spin text-emerald-600" : ""} />
          </button>
          <AudioButton
            textToSpeak={weekSpokenText}
            language={currentLanguage}
            size="sm"
          />
        </div>
      </div>

      {/* Location and Last Updated Badge */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-1.5 text-stone-700 font-bold">
          <span>📍 {forecast.locationName}</span>
        </div>
        <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
          🕒 {isHindi ? "अंतिम अपडेट:" : "Updated:"} {forecast.lastUpdated}
        </span>
      </div>

      {/* 2. Extreme Weather Warning Banner (Prominent Red / Amber alert if detected) */}
      {forecast.hasExtremeWarning && (
        <div
          id="extreme-weather-banner"
          className="p-4 rounded-3xl bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md space-y-2.5 animate-in slide-in-from-top duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                <AlertTriangle size={22} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-rose-200">
                  {isHindi ? "मौसम चेतावनी अलर्ट" : "Weather Advisory Warning"}
                </span>
                <h3 className="font-black text-base sm:text-lg leading-tight">
                  {isHindi
                    ? forecast.extremeWarningTitleHindi || forecast.extremeWarningTitle || "खराब मौसम अलर्ट"
                    : forecast.extremeWarningTitle || "Extreme Weather Alert"}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                speakText(
                  isHindi
                    ? forecast.extremeWarningMessageHindi || forecast.extremeWarningMessage || ""
                    : forecast.extremeWarningMessage || "",
                  currentLanguage
                );
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/25 hover:bg-white/35 text-white font-black text-xs shrink-0 active:scale-95 transition-all border border-white/30"
            >
              <Volume2 size={14} />
              <span>{isHindi ? "सुने" : "Read Aloud"}</span>
            </button>
          </div>

          <p className="text-xs font-semibold text-rose-50 leading-relaxed bg-black/20 p-2.5 rounded-2xl border border-white/15">
            {isHindi
              ? forecast.extremeWarningMessageHindi || forecast.extremeWarningMessage
              : forecast.extremeWarningMessage}
          </p>
        </div>
      )}

      {/* 3. Today's Detail (Expanded Top Section) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-md relative overflow-hidden space-y-4">
        {/* Background Subtle Sun Glow */}
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          {/* Left: Weather Condition & Large Temperature */}
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xs flex items-center justify-center p-2 text-white shadow-xs">
              {getWeatherIcon(forecast.currentCondition, "w-10 h-10")}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                  {forecast.currentTempC}°C
                </span>
                <span className="text-xs font-bold text-amber-100">
                  {isHindi ? "अनुभूत" : "Feels like"} {forecast.currentFeelsLikeC}°C
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mt-1">
                {isHindi ? forecast.currentConditionLabelHindi : forecast.currentConditionLabel}
              </h3>
            </div>
          </div>

          {/* Right: Audio Speak Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="speak-today-weather-btn"
              onClick={() => {
                soundEffects.click();
                const todayText = isHindi
                  ? `आज का तापमान ${forecast.currentTempC} डिग्री सेल्सियस है। मौसम ${forecast.currentConditionLabelHindi} रहेगा। ${forecast.days[0]?.detailedAdvisoryHindi || ""}`
                  : `Today's temperature is ${forecast.currentTempC} degrees Celsius. Condition is ${forecast.currentConditionLabel}. ${forecast.days[0]?.detailedAdvisory || ""}`;
                speakText(todayText, currentLanguage);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs backdrop-blur-xs border border-white/20 active:scale-95 transition-all"
            >
              <Volume2 size={15} />
              <span>{isHindi ? "आज का मौसम सुनें" : "Today's Audio"}</span>
            </button>
          </div>
        </div>

        {/* 4 Accessible High-Contrast Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 relative z-10">
          <div className="p-2.5 rounded-2xl bg-black/20 backdrop-blur-xs border border-white/15 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Droplets size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-100 block">
                {isHindi ? "बारिश की संभावना" : "Rain Chance"}
              </span>
              <span className="text-sm font-black text-white">
                {forecast.days[0]?.rainProbabilityPercent ?? 10}%
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-black/20 backdrop-blur-xs border border-white/15 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Wind size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-100 block">
                {isHindi ? "हवा की गति" : "Wind Speed"}
              </span>
              <span className="text-sm font-black text-white">
                {forecast.currentWindSpeedKmh} km/h
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-black/20 backdrop-blur-xs border border-white/15 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Thermometer size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-100 block">
                {isHindi ? "हवा में नमी" : "Humidity"}
              </span>
              <span className="text-sm font-black text-white">
                {forecast.currentHumidityPercent}%
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-black/20 backdrop-blur-xs border border-white/15 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Sun size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-100 block">
                {isHindi ? "धूप व यूवी" : "Sun / UV Index"}
              </span>
              <span className="text-sm font-black text-white">
                Level {forecast.days[0]?.uvIndex ?? 7}
              </span>
            </div>
          </div>
        </div>

        {/* Today's Actionable Farming Advisory Box */}
        <div className="p-3 rounded-2xl bg-white text-stone-900 shadow-sm space-y-1 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
              <span>🌾</span>
              <span>{isHindi ? "आज का कृषि परामर्श:" : "Today's Farming Advisory:"}</span>
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
              {isHindi ? forecast.days[0]?.advisoryTagHindi : forecast.days[0]?.advisoryTag}
            </span>
          </div>
          <p className="text-xs font-semibold text-stone-700 leading-snug">
            {isHindi ? forecast.days[0]?.detailedAdvisoryHindi : forecast.days[0]?.detailedAdvisory}
          </p>
        </div>
      </div>

      {/* 4. 7-Day Forecast Strip (Horizontal Scroll / Grid) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-black text-base text-stone-900 flex items-center gap-1.5">
              <span>📅</span>
              <span>{isHindi ? "7 दिनों का मौसम स्ट्रिप" : "7-Day Forecast Strip"}</span>
            </h3>
            <p className="text-[11px] font-semibold text-stone-700">
              {isHindi
                ? "दिन चुनकर विस्तृत परामर्श व छिड़काव का समय देखें"
                : "Tap any day to see farming advisory & spray timings"}
            </p>
          </div>
          <span className="text-xs font-bold text-stone-700">7 Days</span>
        </div>

        {/* Horizontal Scrollable Strip of 7 Days */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {forecast.days.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            const badge = getAdvisoryBadgeStyle(day.advisoryType);

            return (
              <button
                key={day.id}
                type="button"
                id={`forecast-day-card-${idx}`}
                onClick={() => {
                  soundEffects.click();
                  setSelectedDayIndex(idx);
                }}
                className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between transition-all active:scale-95 ${
                  isSelected
                    ? "bg-amber-50 border-amber-500 ring-2 ring-amber-400 shadow-md scale-[1.02]"
                    : `bg-white ${badge.cardBorder} shadow-2xs`
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="font-black text-xs text-stone-900 block leading-tight">
                      {isHindi && idx === 0
                        ? "आज"
                        : isHindi && idx === 1
                        ? "कल"
                        : day.dayName}
                    </span>
                    <span className="text-[10px] font-bold text-stone-700">{day.dateFormatted}</span>
                  </div>
                  {idx === 0 && (
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-500 text-white text-[9px] font-black uppercase">
                      {isHindi ? "आज" : "Now"}
                    </span>
                  )}
                </div>

                {/* Weather Icon (Large & high contrast) */}
                <div className="my-2.5 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-150 flex items-center justify-center">
                    {getWeatherIcon(day.condition, "w-8 h-8")}
                  </div>
                </div>

                {/* Temperatures (High / Low) */}
                <div className="flex items-baseline justify-between w-full">
                  <span className="text-base font-black text-stone-900">{day.tempHighC}°</span>
                  <span className="text-xs font-bold text-stone-700">{day.tempLowC}°</span>
                </div>

                {/* Rain Probability Pill */}
                <div className="flex items-center gap-1 text-[11px] font-bold text-sky-700 mt-1">
                  <Droplets size={12} className="shrink-0 text-sky-500" />
                  <span>{day.rainProbabilityPercent}%</span>
                </div>

                {/* Advisory Tag (Short, icon-based) */}
                <div
                  className={`mt-2 px-1.5 py-1 rounded-lg text-[9px] font-black border leading-tight truncate w-full ${badge.bg}`}
                >
                  <span>{badge.icon} </span>
                  <span>{isHindi ? day.advisoryTagHindi : day.advisoryTag}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Selected Day Deep Agronomic Detail Card (One tap deeper) */}
      <div
        id="selected-day-detail-box"
        className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-stone-200 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
              {getWeatherIcon(selectedDay.condition, "w-7 h-7")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-base text-stone-900">
                  {isHindi && selectedDayIndex === 0
                    ? "आज का मौसम विवरण"
                    : isHindi && selectedDayIndex === 1
                    ? "कल का मौसम विवरण"
                    : `${selectedDay.dayName} (${selectedDay.dateFormatted})`}
                </h4>
                <span className="text-xs font-bold text-stone-700">
                  • {selectedDay.tempHighC}°C / {selectedDay.tempLowC}°C
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-700">
                {isHindi ? selectedDay.conditionLabelHindi : selectedDay.conditionLabel}
              </p>
            </div>
          </div>

          <AudioButton
            textToSpeak={
              isHindi
                ? `${selectedDay.dayName} का पूर्वानुमान: तापमान ${selectedDay.tempHighC} डिग्री। ${selectedDay.detailedAdvisoryHindi || ""}`
                : `${selectedDay.dayName} forecast: Temperature ${selectedDay.tempHighC} degrees. ${selectedDay.detailedAdvisory}`
            }
            language={currentLanguage}
            size="sm"
          />
        </div>

        {/* Advisory Explanation Box */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
              <FlaskConical size={16} className="text-emerald-700" />
              <span>{isHindi ? "कृषि कार्य सलाह व समय:" : "Farming Advisory & Best Timing:"}</span>
            </span>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-emerald-200/70 text-emerald-900">
              {isHindi ? selectedDay.advisoryTagHindi : selectedDay.advisoryTag}
            </span>
          </div>
          <p className="text-xs font-medium text-stone-800 leading-relaxed">
            {isHindi ? selectedDay.detailedAdvisoryHindi : selectedDay.detailedAdvisory}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-200/60 text-xs font-bold">
            <div className="flex items-center gap-2 text-stone-700">
              <span className="text-emerald-700">🧪 {isHindi ? "छिड़काव समय:" : "Spray Window:"}</span>
              <strong className="text-stone-900">{selectedDay.bestSprayWindow || "Morning"}</strong>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <span className="text-sky-700">💧 {isHindi ? "सिंचाई समय:" : "Irrigation Window:"}</span>
              <strong className="text-stone-900">{selectedDay.bestWateringWindow || "Morning"}</strong>
            </div>
          </div>
        </div>

        {/* 3 Secondary Metric Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold text-stone-700 block">{isHindi ? "बारिश संभावना" : "Rain Chance"}</span>
            <span className="font-black text-stone-900 mt-0.5 block">{selectedDay.rainProbabilityPercent}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold text-stone-700 block">{isHindi ? "हवा की गति" : "Wind Speed"}</span>
            <span className="font-black text-stone-900 mt-0.5 block">{selectedDay.windSpeedKmh} km/h</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold text-stone-700 block">{isHindi ? "हवा में नमी" : "Humidity"}</span>
            <span className="font-black text-stone-900 mt-0.5 block">{selectedDay.humidityPercent}%</span>
          </div>
        </div>
      </div>

      {/* 6. Farm Weekly Planning Matrix (Connected with Farm Risk Engine) */}
      <div className="p-4 rounded-3xl bg-stone-900 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <div>
              <h4 className="font-black text-sm sm:text-base">
                {isHindi ? "इस सप्ताह का कृषि नियोजन" : "7-Day Farm Planning Matrix"}
              </h4>
              <span className="text-[10px] text-stone-300 font-bold">
                {isHindi ? "फार्म रिस्क स्कोर (18/100) के साथ संरेखित" : "Aligned with Farm Risk Score Model"}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
            🛡️ Low Weather Risk
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          {/* Best Spray Days */}
          <div className="p-3 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-black">
              <span>🧪</span>
              <span>{isHindi ? "छिड़काव के उत्तम दिन" : "Best Spray Days"}</span>
            </div>
            <p className="text-xs font-bold text-white">
              {forecast.farmPlanningSummary?.sprayDays?.join(", ") || "Mon, Tue, Wed"}
            </p>
            <span className="text-[10px] text-stone-300 block">
              {isHindi ? "शांत हवा, बारिश का खतरा नहीं" : "Low wind & no rain runoff"}
            </span>
          </div>

          {/* Best Irrigation Days */}
          <div className="p-3 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-sky-300 font-black">
              <span>💧</span>
              <span>{isHindi ? "सिंचाई के दिन" : "Irrigation Days"}</span>
            </div>
            <p className="text-xs font-bold text-white">
              {forecast.farmPlanningSummary?.irrigationDays?.join(", ") || "Today, Thu"}
            </p>
            <span className="text-[10px] text-stone-300 block">
              {isHindi ? "सेंसर नमी 38% के अनुसार" : "Based on IoT 38% moisture"}
            </span>
          </div>

          {/* Best Harvest Days */}
          <div className="p-3 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-black">
              <span>🌾</span>
              <span>{isHindi ? "कटाई व गहाई के दिन" : "Harvest & Sowing"}</span>
            </div>
            <p className="text-xs font-bold text-white">
              {forecast.farmPlanningSummary?.harvestDays?.join(", ") || "Wed, Sat, Sun"}
            </p>
            <span className="text-[10px] text-stone-300 block">
              {isHindi ? "सूखी धूप में गहाई सुरक्षित" : "Dry weather for grain threshing"}
            </span>
          </div>
        </div>
      </div>

      {/* 7. AI Assistant Weather CTA */}
      <div className="pt-1">
        <button
          type="button"
          id="ask-ai-weather-cta-btn"
          onClick={() => {
            soundEffects.click();
            if (onOpenVoiceAssistantWithPrompt) {
              onOpenVoiceAssistantWithPrompt(
                isHindi
                  ? "क्या इस हफ्ते फसल पर छिड़काव करना सुरक्षित है?"
                  : "What is the weather this week and is it a good time to spray?"
              );
            }
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 hover:from-black hover:to-stone-900 text-white font-black text-xs shadow-md active:scale-98 flex items-center justify-center gap-2 transition-all border border-stone-700"
        >
          <Sparkles size={16} className="text-amber-400" />
          <span>
            {isHindi
              ? "एआई वॉइस साथी से मौसम व छिड़काव की सलाह पूछें"
              : "Ask AI Assistant: 'Is it a good week to spray?'"}
          </span>
        </button>
      </div>
    </div>
  );
};
