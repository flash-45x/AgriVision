import React from "react";
import {
  X,
  Sun,
  Droplets,
  Sprout,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Volume2,
  ChevronRight,
} from "lucide-react";
import { PlantCareItem, LanguageCode } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";

interface PlantDetailModalProps {
  plant: PlantCareItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onUpdateStage?: (plantId: string, newStage: "seedling" | "growing" | "flowering_fruiting" | "harvest_mature") => void;
  onAskAboutPlant: (plantName: string, query?: string) => void;
}

const STAGES = [
  { id: "seedling", label: "Seedling / Sapling", emoji: "🌱" },
  { id: "growing", label: "Growing Bush", emoji: "🌿" },
  { id: "flowering_fruiting", label: "Flowering & Fruiting", emoji: "🌸" },
  { id: "harvest_mature", label: "Harvest / Mature", emoji: "🥗" },
] as const;

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  plant,
  isOpen,
  onClose,
  currentLanguage,
  onUpdateStage,
  onAskAboutPlant,
}) => {
  if (!isOpen || !plant) return null;

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const currentStage = plant.growthStage || "growing";

  const stageIndex = STAGES.findIndex((s) => s.id === currentStage);

  const getSunlightText = () => {
    if (plant.sunlightHours) return `${plant.sunlightHours} daily`;
    return "5-6 hours direct or bright sunlight";
  };

  const getWateringText = () => {
    if (plant.wateringFrequency) return plant.wateringFrequency;
    return "Every 1-2 days; let top inch of soil dry before watering";
  };

  const getPotSoilText = () => {
    if (plant.potSizeRecommendation) return plant.potSizeRecommendation;
    return "10-12 inch pot with good drainage & 40% compost mix";
  };

  const fullDescriptionForAudio = `${plant.plantName}, ${plant.variety || "Container Garden Plant"}. Care Summary: Sunlight: ${getSunlightText()}. Watering: ${getWateringText()}. Pot & Soil: ${getPotSoilText()}. Current growth stage: ${
    STAGES.find((s) => s.id === currentStage)?.label || "Growing"
  }. Tip: ${plant.careTip}`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        id="plant-detail-modal"
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Modal Header & Hero Image */}
        <div className="relative h-48 sm:h-56 w-full bg-stone-900 shrink-0">
          <img
            src={plant.image}
            alt={plant.plantName}
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              onClose();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center active:scale-95 transition-all"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Audio Button */}
          <div className="absolute top-4 left-4">
            <AudioButton
              textToSpeak={fullDescriptionForAudio}
              language={currentLanguage}
              size="sm"
            />
          </div>

          {/* Plant Name Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/90 text-white backdrop-blur-xs">
                {plant.healthStatus || "Thriving"}
              </span>
              <span className="text-xs font-bold text-stone-200">
                {plant.moisturePercent}% Pot Moisture
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight drop-shadow-sm mt-1">
              {plant.plantName}
            </h2>
            <p className="text-xs text-stone-300 font-semibold">{plant.variety}</p>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* 1. Care Summary Cards */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout size={15} className="text-emerald-600" />
              <span>Plant Care Summary (देखभाल नियम)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Sunlight */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                  <Sun size={16} className="text-amber-600" />
                  <span>Sunlight (धूप)</span>
                </div>
                <p className="text-xs font-semibold text-stone-700 leading-snug">
                  {getSunlightText()}
                </p>
              </div>

              {/* Watering */}
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-sky-900">
                  <Droplets size={16} className="text-sky-600" />
                  <span>Watering (पानी)</span>
                </div>
                <p className="text-xs font-semibold text-stone-700 leading-snug">
                  {getWateringText()}
                </p>
              </div>

              {/* Pot & Soil */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                  <Layers size={16} className="text-emerald-600" />
                  <span>Pot & Soil (गमला व मिट्टी)</span>
                </div>
                <p className="text-xs font-semibold text-stone-700 leading-snug">
                  {getPotSoilText()}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Growth Stage Tracker */}
          <div className="space-y-2.5 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={15} className="text-teal-600" />
                <span>Growth Stage Tracker (वृद्धि चरण)</span>
              </h3>
              <span className="text-[10px] font-bold text-stone-700">Tap to update</span>
            </div>

            {/* Stepper Progression */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {STAGES.map((stg, idx) => {
                const isCurrent = stg.id === currentStage;
                const isPast = idx <= stageIndex;
                return (
                  <button
                    key={stg.id}
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      if (onUpdateStage) {
                        onUpdateStage(plant.id, stg.id);
                        speakText(`Updated stage to ${stg.label}`, currentLanguage);
                      }
                    }}
                    className={`p-2 rounded-xl text-center border transition-all active:scale-95 flex flex-col items-center justify-between ${
                      isCurrent
                        ? "bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-400 shadow-xs"
                        : isPast
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{stg.emoji}</span>
                    <span className="text-[10px] font-black leading-tight line-clamp-2">
                      {stg.label.split("/")[0]}
                    </span>
                    {isCurrent && (
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Care Tip */}
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-start gap-2.5">
            <span className="text-lg">💡</span>
            <div>
              <span className="font-black block text-teal-900">Gardener Golden Rule:</span>
              <p className="font-semibold mt-0.5 leading-relaxed">{plant.careTip}</p>
            </div>
          </div>

          {/* 4. Common Problems & Quick Fixes */}
          {plant.commonProblems && plant.commonProblems.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={15} className="text-rose-600" />
                <span>Common Problems & Quick Fixes (सामान्य समस्याएं)</span>
              </h3>

              <div className="space-y-2">
                {plant.commonProblems.map((prob, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-black text-xs text-stone-900">
                        <span>{prob.icon || "⚠️"}</span>
                        <span>{prob.problem}</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        {prob.cause}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-stone-700 pl-5">
                      👉 <strong className="text-emerald-800">Quick Fix:</strong> {prob.fix}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. "Ask about this plant" Button */}
          <div className="pt-2">
            <button
              id="ask-about-this-plant-btn"
              type="button"
              onClick={() => {
                soundEffects.click();
                onClose();
                onAskAboutPlant(
                  plant.plantName,
                  `How do I take best care of my ${plant.plantName} in this weather?`
                );
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={18} className="text-amber-300" />
              <span>Ask AI About This {plant.plantName}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
