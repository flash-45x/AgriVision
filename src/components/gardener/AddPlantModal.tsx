import React, { useState } from "react";
import { X, Plus, Check, Sprout, Sparkles } from "lucide-react";
import { LanguageCode, PlantCareItem } from "../../types";
import { GARDENER_PLANT_PRESETS } from "../../data/gardenerData";
import { soundEffects, speakText } from "../../utils/audio";

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onAddPlant: (newPlant: PlantCareItem) => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onAddPlant,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [customName, setCustomName] = useState("");

  if (!isOpen) return null;

  const categories = ["All", "Vegetable", "Herb", "Flower", "Fruit"];

  const filteredPresets =
    selectedCategory === "All"
      ? GARDENER_PLANT_PRESETS
      : GARDENER_PLANT_PRESETS.filter((p) => p.category === selectedCategory);

  const handleSelectPreset = (preset: typeof GARDENER_PLANT_PRESETS[0]) => {
    soundEffects.success();
    const newPlant: PlantCareItem = {
      id: `plant-${Date.now()}`,
      plantName: preset.name,
      variety: preset.hindiName,
      image: preset.image,
      wateredToday: false,
      moisturePercent: 35,
      healthStatus: "Needs Water",
      careTip: preset.careTip,
      growthStage: "growing",
      sunlightHours: preset.sunlight,
      wateringFrequency: preset.waterFrequency,
      potSizeRecommendation: preset.potSize,
      commonProblems: preset.commonProblems,
    };
    onAddPlant(newPlant);
    speakText(`Added ${preset.name} to your garden!`, currentLanguage);
    onClose();
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    soundEffects.success();
    const newPlant: PlantCareItem = {
      id: `plant-${Date.now()}`,
      plantName: customName.trim(),
      variety: "Custom Garden Plant",
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=80",
      wateredToday: false,
      moisturePercent: 40,
      healthStatus: "Good",
      careTip: "Keep soil moderately moist and ensure 4-6 hours of sunlight daily.",
      growthStage: "growing",
      sunlightHours: "4-6 hours bright sunlight",
      wateringFrequency: "Every 2 days (finger moisture test)",
      potSizeRecommendation: "8-10 inch pot with drainage",
      commonProblems: [
        { problem: "Yellow leaves", cause: "Overwatering", fix: "Let soil dry out 1 day", icon: "🍂" },
      ],
    };
    onAddPlant(newPlant);
    speakText(`Added ${customName} to your garden!`, currentLanguage);
    setCustomName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        id="add-plant-modal"
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col p-5 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪴</span>
            <div>
              <h2 className="font-black text-lg text-stone-900">Add Plant to Garden</h2>
              <p className="text-xs text-stone-500 font-semibold">
                Select from popular container plants or type a custom name
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center active:scale-95 transition-all"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                soundEffects.click();
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="p-2.5 rounded-2xl border-2 border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-400 text-left transition-all active:scale-95 group flex flex-col justify-between"
            >
              <div className="relative w-full h-20 rounded-xl overflow-hidden mb-2 bg-stone-200">
                <img
                  src={preset.image}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 text-base bg-white/80 rounded-md px-1 backdrop-blur-xs">
                  {preset.imageEmoji}
                </span>
              </div>
              <div>
                <h4 className="font-black text-xs text-stone-900 line-clamp-1">{preset.name}</h4>
                <p className="text-[10px] font-semibold text-stone-500 line-clamp-1">
                  {preset.hindiName.split("(")[0]}
                </p>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] font-bold text-emerald-800">
                <span>+ Add Plant</span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Plant Input */}
        <div className="pt-2 border-t border-stone-200 space-y-2">
          <label className="text-xs font-bold text-stone-700 block">
            Or type your plant name:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Jasmine, Lemongrass, Orchid..."
              className="flex-1 p-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              disabled={!customName.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-xs shadow-xs active:scale-95 flex items-center gap-1 shrink-0"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
