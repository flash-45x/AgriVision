import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Droplets,
  Camera,
  Sprout,
  TrendingUp,
  Users,
  Cpu,
  Sun,
  CloudRain,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Calendar,
  PhoneCall,
  Power,
  RotateCw,
  Plus,
  FlaskConical,
} from "lucide-react";
import {
  UserProfile,
  LanguageCode,
  PriorityAction,
  FarmRiskFactor,
  IoTSensorData,
  MarketPriceItem,
} from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";

interface FarmerDashboardProps {
  userProfile: UserProfile;
  currentLanguage: LanguageCode;
  priorityActions: PriorityAction[];
  onToggleAction: (actionId: string) => void;
  riskFactors: FarmRiskFactor[];
  iotData: IoTSensorData;
  onTogglePump: () => void;
  marketPrices: MarketPriceItem[];
  onOpenDiseaseCamera: () => void;
  onOpenIoT: () => void;
  onOpenMarketPrices: () => void;
  onOpenCropRecommend: () => void;
  onOpenFertilizer?: () => void;
  onOpenHireLabour: () => void;
  onOpenWeeklyWeather?: () => void;
  onOpenYieldPrediction?: () => void;
  onOpenVoiceAssistantWithPrompt: (prompt: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  userProfile,
  currentLanguage,
  priorityActions,
  onToggleAction,
  riskFactors,
  iotData,
  onTogglePump,
  marketPrices,
  onOpenDiseaseCamera,
  onOpenIoT,
  onOpenMarketPrices,
  onOpenCropRecommend,
  onOpenFertilizer,
  onOpenHireLabour,
  onOpenWeeklyWeather,
  onOpenYieldPrediction,
  onOpenVoiceAssistantWithPrompt,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const isHindi = currentLanguage === "hi";
  const [showYieldReportModal, setShowYieldReportModal] = useState(false);

  // Calculate overall Farm Risk Score (0-100)
  const riskScore = userProfile.farmRiskScore || 28;
  const riskCategory =
    riskScore < 35
      ? { label: t.farmer.riskSafe, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-300", gaugeColor: "#059669", ring: "stroke-emerald-600" }
      : riskScore < 65
      ? { label: t.farmer.riskWarning, color: "text-amber-700", bg: "bg-amber-50 border-amber-300", gaugeColor: "#d97706", ring: "stroke-amber-500" }
      : { label: t.farmer.riskAlert, color: "text-rose-700", bg: "bg-rose-50 border-rose-300", gaugeColor: "#e11d48", ring: "stroke-rose-600" };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 max-w-4xl mx-auto px-3 sm:px-4 pt-3">
      {/* 1. Farm Risk Score Circular Gauge Card (0-100 Red/Yellow/Green at a glance) */}
      <div
        id="farm-risk-score-card"
        className={`p-4 sm:p-5 rounded-3xl border-2 ${riskCategory.bg} shadow-xs relative overflow-hidden transition-all`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                {t.farmer.riskScore}
              </h2>
              <span className={`text-xs font-black uppercase tracking-wider ${riskCategory.color}`}>
                {riskCategory.label}
              </span>
            </div>
          </div>
          <AudioButton
            textToSpeak={`Farm risk score is ${riskScore} out of 100. Farm conditions are ${riskCategory.label}. Weather and market conditions are favorable.`}
            language={currentLanguage}
            size="sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 pt-1">
          {/* Circular SVG Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-stone-200"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={riskCategory.ring}
                strokeWidth="12"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * riskScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-stone-900 leading-none">{riskScore}</span>
              <span className="text-[10px] font-bold text-stone-700 uppercase">/ 100</span>
            </div>
          </div>

          {/* 4 Multi-factor Status Pills */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {riskFactors.map((factor) => {
              const statusColor =
                factor.color === "green"
                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                  : factor.color === "yellow"
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-rose-100 text-rose-900 border-rose-300";

              return (
                <div
                  key={factor.id}
                  className={`p-2.5 rounded-2xl border ${statusColor} flex items-center gap-2`}
                >
                  <span
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      factor.color === "green"
                        ? "bg-emerald-600 animate-pulse"
                        : factor.color === "yellow"
                        ? "bg-amber-500"
                        : "bg-rose-600"
                    }`}
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-black truncate">{factor.title}</div>
                    <div className="text-[10px] opacity-80 truncate">{factor.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Today's Priority Actions (Large tappable cards with audio speak) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h3 className="font-black text-base sm:text-lg text-stone-900">
              {t.farmer.todayActions}
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
            {priorityActions.filter((a) => !a.isCompleted).length} Pending
          </span>
        </div>

        <div className="space-y-2.5">
          {priorityActions.map((action) => (
            <div
              key={action.id}
              id={`priority-action-${action.id}`}
              onClick={() => {
                soundEffects.click();
                onToggleAction(action.id);
              }}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                action.isCompleted
                  ? "bg-stone-100 border-stone-300 opacity-60 line-through"
                  : action.urgency === "high"
                  ? "bg-white border-amber-300 shadow-sm hover:border-amber-400"
                  : "bg-white border-stone-200 shadow-xs hover:border-emerald-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    action.isCompleted
                      ? "bg-stone-200 text-stone-700"
                      : action.urgency === "high"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {action.category === "irrigation" && <Droplets size={24} />}
                  {action.category === "spray" && <Sprout size={24} />}
                  {action.category === "market" && <TrendingUp size={24} />}
                  {action.category === "labour" && <Users size={24} />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm sm:text-base text-stone-900">
                      {action.title}
                    </h4>
                    {action.urgency === "high" && !action.isCompleted && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-stone-700 mt-0.5">{action.description}</p>
                  <div className="text-[11px] font-bold text-stone-700 mt-1 flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{action.dueTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <AudioButton
                  textToSpeak={action.spokenAdvice}
                  language={currentLanguage}
                  size="sm"
                />
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                    action.isCompleted
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-stone-300 bg-white"
                  }`}
                >
                  {action.isCompleted && <CheckCircle2 size={18} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Water Today Indicator + IoT Live Quick Toggle Bar */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-300 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💧</span>
            <div>
              <h3 className="font-black text-base sm:text-lg text-sky-950">
                {t.farmer.waterToday}
              </h3>
              <div className="text-xs font-extrabold text-sky-700">
                {iotData.soilMoisturePercent < 40 ? t.farmer.waterYes : t.farmer.waterNo}
              </div>
            </div>
          </div>
          <AudioButton
            textToSpeak={`Soil moisture is at ${iotData.soilMoisturePercent} percent. ${
              iotData.soilMoisturePercent < 40
                ? "Watering is recommended today for 45 minutes."
                : "No watering needed today, moisture level is sufficient."
            }`}
            language={currentLanguage}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Soil Moisture Pill */}
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              onOpenIoT();
            }}
            className="bg-white p-3 rounded-2xl border border-sky-200 shadow-2xs hover:border-sky-400 text-left transition-all active:scale-95 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-700 block">{t.farmer.soilMoisture}</span>
              <span className="text-[10px] text-sky-700 font-bold">→</span>
            </div>
            <div className="text-xl font-black text-sky-900 mt-0.5">
              {iotData.soilMoisturePercent}%
            </div>
            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-sm">
              {iotData.soilMoisturePercent < 40 ? "Mild Deficit" : "Optimal"}
            </span>
          </button>

          {/* Soil pH Pill */}
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              onOpenIoT();
            }}
            className="bg-white p-3 rounded-2xl border border-sky-200 shadow-2xs hover:border-emerald-400 text-left transition-all active:scale-95 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-700 block">{t.farmer.soilPh}</span>
              <span className="text-[10px] text-emerald-700 font-bold">→</span>
            </div>
            <div className="text-xl font-black text-emerald-900 mt-0.5">
              {iotData.soilPh} pH
            </div>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
              Optimal / Bal.
            </span>
          </button>

          {/* Pump Control Button */}
          <button
            id="farmer-pump-toggle-btn"
            type="button"
            onClick={() => {
              soundEffects.pump(iotData.pumpStatus === "OFF");
              onTogglePump();
            }}
            className={`col-span-2 p-3 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-95 ${
              iotData.pumpStatus === "ON"
                ? "bg-emerald-600 text-white border-emerald-700 shadow-md animate-pulse"
                : "bg-white text-stone-800 border-sky-300 hover:bg-sky-100/50"
            }`}
          >
            <div className="flex items-center gap-2.5 text-left">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  iotData.pumpStatus === "ON" ? "bg-white text-emerald-700" : "bg-sky-100 text-sky-800"
                }`}
              >
                <Power size={20} />
              </div>
              <div>
                <div className="text-xs font-black">
                  {iotData.pumpStatus === "ON" ? t.farmer.pumpOn : t.farmer.pumpOff}
                </div>
                <div className="text-[10px] opacity-80">
                  {iotData.autoIrrigationEnabled ? "Auto-AI Threshold" : "Manual Override"}
                </div>
              </div>
            </div>

            <span className="text-xs font-black underline uppercase">
              {iotData.pumpStatus === "ON" ? "Turn OFF" : "Turn ON"}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Main 6-Action Icon Grid (Large visual tiles for low-literacy farmers) */}
      <div>
        <h3 className="font-black text-base sm:text-lg text-stone-900 mb-3 px-1 flex items-center gap-2">
          <span>🚜</span>
          <span>Farm Tools & Services</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Action 1: Snap Disease Photo */}
          <button
            id="farmer-tile-disease-scan"
            type="button"
            onClick={() => {
              soundEffects.camera();
              onOpenDiseaseCamera();
            }}
            className="p-4 rounded-3xl bg-amber-50 hover:bg-amber-100/80 border-2 border-amber-300 shadow-xs flex flex-col items-center justify-center text-center transition-all active:scale-95 min-h-[135px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-2 shadow-xs">
              <Camera size={30} />
            </div>
            <span className="font-black text-sm text-amber-950 leading-tight">
              {t.farmer.diseaseScan}
            </span>
            <span className="text-[10px] font-bold text-amber-800 mt-1">AI Crop Doctor</span>
          </button>

          {/* Action 2: Live Mandi Market Prices */}
          <button
            id="farmer-tile-market-prices"
            type="button"
            onClick={() => {
              soundEffects.click();
              onOpenMarketPrices();
            }}
            className="p-4 rounded-3xl bg-emerald-50 hover:bg-emerald-100/80 border-2 border-emerald-300 shadow-xs flex flex-col items-center justify-center text-center transition-all active:scale-95 min-h-[135px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs">
              <TrendingUp size={30} />
            </div>
            <span className="font-black text-sm text-emerald-950 leading-tight">
              {t.farmer.marketPrices}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 mt-1">Wheat ₹2,480 (+₹120)</span>
          </button>

          {/* Action 3: Hire Labour Workers */}
          <button
            id="farmer-tile-hire-labour"
            type="button"
            onClick={() => {
              soundEffects.click();
              onOpenHireLabour();
            }}
            className="p-4 rounded-3xl bg-orange-50 hover:bg-orange-100/80 border-2 border-orange-300 shadow-xs flex flex-col items-center justify-center text-center transition-all active:scale-95 min-h-[135px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center mb-2 shadow-xs">
              <Users size={30} />
            </div>
            <span className="font-black text-sm text-orange-950 leading-tight">
              {t.farmer.hireLabour}
            </span>
            <span className="text-[10px] font-bold text-orange-800 mt-1">1-Tap Job Post</span>
          </button>

          {/* Action 4: Crop Recommendations */}
          <button
            id="farmer-tile-crop-recommend"
            type="button"
            onClick={() => {
              soundEffects.click();
              onOpenCropRecommend();
            }}
            className="p-4 rounded-3xl bg-teal-50 hover:bg-teal-100/80 border-2 border-teal-300 shadow-xs flex flex-col items-center justify-center text-center transition-all active:scale-95 min-h-[135px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-2 shadow-xs">
              <Sprout size={30} />
            </div>
            <span className="font-black text-sm text-teal-950 leading-tight">
              {t.farmer.cropRecommend}
            </span>
            <span className="text-[10px] font-bold text-teal-700 mt-1">Season & Soil AI</span>
          </button>

          {/* Action 5: Weekly Weather Forecast */}
          <button
            id="farmer-tile-weekly-weather"
            type="button"
            onClick={() => {
              soundEffects.click();
              if (onOpenWeeklyWeather) {
                onOpenWeeklyWeather();
              }
            }}
            className="p-4 rounded-3xl bg-amber-50 hover:bg-amber-100/80 border-2 border-amber-300 shadow-xs flex flex-col items-center justify-center text-center transition-all active:scale-95 min-h-[135px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mb-2 shadow-xs">
              <Sun size={30} />
            </div>
            <span className="font-black text-sm text-amber-950 leading-tight">
              {isHindi ? "साप्ताहिक मौसम" : "Weekly Weather"}
            </span>
            <span className="text-[10px] font-bold text-amber-800 mt-1">7-Day Farm Forecast</span>
          </button>

          {/* Action 6: Fertilizer Recommendation */}
          <button
            id="farmer-tile-fertilizer-recommend"
            type="button"
            onClick={() => {
              soundEffects.click();
              if (onOpenFertilizer) {
                onOpenFertilizer();
              }
            }}
            className="p-4 rounded-3xl bg-lime-50 hover:bg-lime-100/80 border-2 border-lime-300 shadow-xs flex flex-col items-center justify-center text-center transition-all active:scale-95 min-h-[135px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-lime-600 text-white flex items-center justify-center mb-2 shadow-xs">
              <FlaskConical size={30} />
            </div>
            <span className="font-black text-sm text-lime-950 leading-tight">
              Fertilizer Advisory
            </span>
            <span className="text-[10px] font-bold text-lime-800 mt-1">Per-Acre NPK Dose</span>
          </button>

          {/* Action 7: IoT ESP32 Smart Sensors */}
          <button
            id="farmer-tile-iot-sensors"
            type="button"
            onClick={() => {
              soundEffects.click();
              onOpenIoT();
            }}
            className="p-4 rounded-3xl bg-sky-50 hover:bg-sky-100/80 border-2 border-sky-300 shadow-xs flex flex-col items-center justify-center text-center transition-all active:scale-95 min-h-[135px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-2 shadow-xs">
              <Cpu size={30} />
            </div>
            <span className="font-black text-sm text-sky-950 leading-tight">
              {t.farmer.iotStatus}
            </span>
            <span className="text-[10px] font-bold text-sky-700 mt-1">ESP32 Live Node</span>
          </button>

          {/* Action 8: Yield Prediction & Farm Report */}
          <button
            id="farmer-tile-yield-report"
            type="button"
            onClick={() => {
              soundEffects.click();
              if (onOpenYieldPrediction) {
                onOpenYieldPrediction();
              } else {
                setShowYieldReportModal(true);
              }
            }}
            className="p-4 rounded-3xl bg-indigo-50 hover:bg-indigo-100/80 border-2 border-indigo-300 shadow-xs flex flex-col items-center justify-center text-center transition-all active:scale-95 min-h-[135px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-xs">
              <BarChart3 size={30} />
            </div>
            <span className="font-black text-sm text-indigo-950 leading-tight">
              {isHindi ? "उपज अनुमान" : "Yield Prediction"}
            </span>
            <span className="text-[10px] font-bold text-indigo-700 mt-1">
              {isHindi ? "अनुमानित 21.5 क्विंटल/एकड़" : "Estimated 21.5 Qtl/Acre"}
            </span>
          </button>
        </div>
      </div>

      {/* 5. Weather Risk & 3-Day Preview Card with Quick Link to Full 7-Day View */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
              <Sun size={24} />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-700">{userProfile.locationName}</div>
              <h4 className="font-black text-base sm:text-lg text-stone-900">
                32°C • {isHindi ? "धूप व सुहावना" : "Clear & Sunny"}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {onOpenWeeklyWeather && (
              <button
                type="button"
                id="view-full-weather-btn"
                onClick={() => {
                  soundEffects.click();
                  onOpenWeeklyWeather();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs border border-amber-300 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>{isHindi ? "7 दिन का मौसम" : "7-Day Forecast"}</span>
                <ChevronRight size={14} />
              </button>
            )}
            <AudioButton
              textToSpeak={`Weather in ${userProfile.locationName} is 32 degrees Celsius, clear and sunny. No rain forecast for five days. Good condition for spray and harvest.`}
              language={currentLanguage}
              size="sm"
            />
          </div>
        </div>

        {/* 3-Day Mini Weather Preview Strip */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          <div
            onClick={() => {
              if (onOpenWeeklyWeather) {
                soundEffects.click();
                onOpenWeeklyWeather();
              }
            }}
            className="p-2.5 rounded-2xl bg-amber-50/60 border border-amber-200 cursor-pointer hover:bg-amber-100/70 transition-all text-center"
          >
            <span className="text-[11px] font-black text-stone-900 block">{isHindi ? "आज" : "Today"}</span>
            <div className="text-base font-black text-stone-900 my-0.5">33° / 20°</div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-md">
              ✅ {isHindi ? "स्प्रे करें" : "Safe to Spray"}
            </span>
          </div>

          <div
            onClick={() => {
              if (onOpenWeeklyWeather) {
                soundEffects.click();
                onOpenWeeklyWeather();
              }
            }}
            className="p-2.5 rounded-2xl bg-amber-50/60 border border-amber-200 cursor-pointer hover:bg-amber-100/70 transition-all text-center"
          >
            <span className="text-[11px] font-black text-stone-900 block">{isHindi ? "कल" : "Tomorrow"}</span>
            <div className="text-base font-black text-stone-900 my-0.5">34° / 21°</div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-md">
              🌾 {isHindi ? "बुवाई/कटाई" : "Good Sowing"}
            </span>
          </div>

          <div
            onClick={() => {
              if (onOpenWeeklyWeather) {
                soundEffects.click();
                onOpenWeeklyWeather();
              }
            }}
            className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-all text-center"
          >
            <span className="text-[11px] font-black text-stone-900 block">{isHindi ? "गुरुवार" : "Thursday"}</span>
            <div className="text-base font-black text-stone-900 my-0.5">32° / 20°</div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md">
              ⛅ {isHindi ? "हल्के बादल" : "Partly Cloudy"}
            </span>
          </div>
        </div>

        <p className="text-xs font-semibold text-stone-700 leading-relaxed bg-stone-50 p-2.5 rounded-2xl border border-stone-150">
          ☀️ {isHindi
            ? "अगले 5 दिन मौसम मुख्यतः सूखा व गर्म रहेगा। गेहूं की कटाई व फोलियर स्प्रे के लिए अनुकूल समय है।"
            : "Next 5 days will stay dry and warm. Safe to apply foliar fertilizers and harvest mature wheat before Thursday."}
        </p>
      </div>

      {/* Yield Report Modal */}
      {showYieldReportModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 border border-emerald-300 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <h3 className="text-lg font-black text-stone-900">Estimated Harvest & Yield</h3>
              </div>
              <AudioButton
                textToSpeak="Your estimated harvest is 21 quintals per acre with total farm output around 94 quintals. Projected gross profit is 2 lakh 33 thousand rupees."
                language={currentLanguage}
                size="sm"
              />
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 text-center space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Predicted Yield for {userProfile.primaryCrop}
              </span>
              <div className="text-3xl font-black text-emerald-950">21.5 Qtl / Acre</div>
              <p className="text-xs font-semibold text-emerald-700">
                Total Output: ~94 Quintals across {userProfile.landSizeAcre}
              </p>
            </div>

            {/* Visual Yield Gauge Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>Historic Avg: 18 Qtl</span>
                <span className="text-emerald-700 font-extrabold">+19% Above Benchmark</span>
              </div>
              <div className="w-full h-4 rounded-full bg-stone-200 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full w-[82%]" />
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs font-medium space-y-1 text-stone-700">
              <div className="flex justify-between">
                <span>Estimated Market Value:</span>
                <span className="font-black text-stone-900">₹2,33,120</span>
              </div>
              <div className="flex justify-between">
                <span>Input Cost (Seed, Bio-spray):</span>
                <span className="font-bold text-stone-700">-₹42,000</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-200 text-emerald-900 font-black">
                <span>Projected Net Profit:</span>
                <span>₹1,91,120</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEffects.success();
                setShowYieldReportModal(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md active:scale-95 transition-all"
            >
              {t.common.done}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
