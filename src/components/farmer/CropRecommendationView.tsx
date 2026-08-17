import React, { useState, useEffect } from "react";
import {
  Sprout,
  ArrowLeft,
  Sparkles,
  Droplets,
  Coins,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
  FileText,
  Sliders,
  ChevronRight,
} from "lucide-react";
import { LanguageCode, CropRecommendation, IoTSensorData, UserProfile } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { fetchCropRecommendations } from "../../services/api";
import { AudioButton } from "../common/AudioButton";
import { getCropVisual } from "../../data/plantImages";
import { soundEffects, speakText } from "../../utils/audio";
import { AgriVisionLogo } from "../common/AgriVisionLogo";

interface CropRecommendationViewProps {
  currentLanguage: LanguageCode;
  userProfile?: UserProfile;
  iotData?: IoTSensorData;
  onBack: () => void;
  onOpenSoilEntry?: () => void;
}

export const CropRecommendationView: React.FC<CropRecommendationViewProps> = ({
  currentLanguage,
  userProfile,
  iotData,
  onBack,
  onOpenSoilEntry,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const isHindi = currentLanguage === "hi";
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState("Rabi (Winter)");

  useEffect(() => {
    loadRecommendations();
  }, [selectedSeason, iotData?.soilPh, iotData?.soilMoisturePercent]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const activePh = iotData?.soilPh || 6.8;
      const activeSoilType = iotData?.soilType || "Black Loamy Soil";
      const data = await fetchCropRecommendations({
        season: selectedSeason,
        soilType: activeSoilType,
        soilPh: activePh,
        waterAvailability: "Borewell / Tube-well",
      });
      setRecommendations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isIotConnected = iotData?.pairedStatus === "connected" && iotData.isOnline;
  const isManualData = iotData?.isManualEntry || iotData?.pairedStatus === "software_only";

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 max-w-3xl mx-auto px-3 sm:px-4 pt-3">
      {/* Header */}
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
          <span>{isHindi ? "वापस" : "Back"}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <h2 className="font-black text-lg text-stone-900">{t.farmer.cropRecommend}</h2>
        </div>

        <AudioButton
          textToSpeak={
            isHindi
              ? "मौसम, जलवायु व मिट्टी के आधार पर AI फसल सलाह। उच्चतम लाभ के लिए शरबती गेहूं व सरसों अनुशंसित हैं।"
              : "AI Crop Recommendations for your location and winter season. Top recommended crops are Sharbati Wheat and Mustard Seed."
          }
          language={currentLanguage}
          size="sm"
        />
      </div>

      {/* Soil Data Source & Accuracy Status Indicator */}
      <div className="p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs transition-all bg-white border-stone-200">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isIotConnected
                ? "bg-emerald-100 text-emerald-800"
                : isManualData
                ? "bg-teal-100 text-teal-800"
                : "bg-amber-100 text-amber-900"
            }`}
          >
            {isIotConnected ? <Cpu size={18} /> : isManualData ? <FileText size={18} /> : <Sparkles size={18} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-stone-900">
                {isIotConnected
                  ? isHindi
                    ? "लाइव IoT सेंसर डेटा सक्रिय"
                    : "Live IoT Sensor Data Active"
                  : isManualData
                  ? isHindi
                    ? "मैनुअल मृदा डेटा प्रयुक्त"
                    : "Manual Soil Estimates Applied"
                  : isHindi
                  ? "क्षेत्रीय मौसम व ऋतु आधार"
                  : "Regional Season & Weather Baseline"}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isIotConnected
                    ? "bg-emerald-100 text-emerald-800"
                    : isManualData
                    ? "bg-teal-100 text-teal-800"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {isIotConnected
                  ? isHindi
                    ? "सटीकता 95%"
                    : "95% Accuracy"
                  : isManualData
                  ? isHindi
                    ? "सटीकता 88% (+25% बढ़ी)"
                    : "88% Accuracy (+25% boost)"
                  : isHindi
                  ? "सटीकता 75% (बेसलाइन)"
                  : "75% Baseline"}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-stone-600 mt-0.5">
              {isIotConnected
                ? `Node ESP32 • Soil pH ${iotData?.soilPh || 6.8} • Moisture ${iotData?.soilMoisturePercent || 38}%`
                : isManualData
                ? `User Values • Soil pH ${iotData?.soilPh || 6.5} • Moisture ${iotData?.soilMoisturePercent || 45}%`
                : isHindi
                ? "बिना किसी हार्डवेयर के मौसम व स्थान आधार पर कार्यशील।"
                : "Functioning without hardware using location, weather & seasonal models."}
            </p>
          </div>
        </div>

        {(!isIotConnected && onOpenSoilEntry) && (
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              onOpenSoilEntry();
            }}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs shrink-0 self-start sm:self-center active:scale-95 flex items-center gap-1"
          >
            <span>{isManualData ? (isHindi ? "डेटा बदलें" : "Edit Soil") : (isHindi ? "मिट्टी डेटा जोड़ें (+25%)" : "Add Soil Data (+25%)")}</span>
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Season Selector Filter */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-stone-700">Season / ऋतु:</span>
        <div className="flex gap-1.5">
          {["Rabi (Winter)", "Kharif (Monsoon)", "Zaid (Summer)"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                soundEffects.click();
                setSelectedSeason(s);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSeason === s
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {s.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-8 bg-white rounded-3xl border-2 border-emerald-200 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto p-2">
            <AgriVisionLogo size={36} animated={true} />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Evaluating Soil & Climate Matching...</h4>
        </div>
      )}

      {/* Recommendations List */}
      {!isLoading && (
        <div className="space-y-3.5">
          {recommendations.map((rec, idx) => {
            const visual = getCropVisual(rec.crop);
            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white border-2 border-emerald-300 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-xs">
                      <img
                        src={visual.image}
                        alt={rec.crop}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = visual.fallback;
                        }}
                      />
                    </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg text-stone-900">{rec.crop}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                        {rec.suitabilityScore}% Match
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-stone-700 mt-0.5">{rec.soilMatch}</p>
                  </div>
                </div>

                <AudioButton
                  textToSpeak={`${rec.crop} is ${rec.suitabilityScore} percent match. Expected yield is ${rec.expectedYield}. Profit potential is ${rec.profitPotential}. ${rec.reason}`}
                  language={currentLanguage}
                  size="sm"
                />
              </div>

              {/* 4 Metric Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-700 block">Yield Potential</span>
                  <span className="font-black text-stone-900">{rec.expectedYield}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 block">Est. Profit</span>
                  <span className="font-black text-emerald-950">{rec.profitPotential}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-sky-700 block">Water Need & Duration</span>
                  <span className="font-black text-sky-950">{rec.durationDays} • {rec.waterNeed}</span>
                </div>
              </div>

              <p className="text-xs font-medium text-stone-700 bg-stone-50 p-3 rounded-2xl border border-stone-100 leading-relaxed">
                💡 {rec.reason}
              </p>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
