import React, { useState } from "react";
import {
  FlaskConical,
  ArrowLeft,
  CheckCircle2,
  Volume2,
  Sparkles,
  Droplets,
  Calendar,
  Layers,
  Info,
  Clock,
  RotateCcw,
  Sliders,
  Cpu,
  ChevronRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { LanguageCode, IoTSensorData } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";
import {
  CROP_VISUALS,
  getCropVisual,
  MUSTARD_CROP_SVG,
  COTTON_CROP_SVG,
  SUGARCANE_CROP_SVG,
  RICE_PADDY_CROP_SVG,
  SOYBEAN_CROP_SVG,
  HEALTHY_WHEAT_SVG,
} from "../../data/plantImages";

interface FertilizerRecommendationViewProps {
  currentLanguage: LanguageCode;
  iotData?: IoTSensorData;
  onBack: () => void;
}

// 1. Common Indian & Global Farm Crops
export interface CropOption {
  id: string;
  name: string;
  nativeNames: Partial<Record<LanguageCode, string>>;
  category: "cereal" | "pulse" | "cash" | "vegetable" | "oilseed";
  image: string;
  iconEmoji: string;
}

export const CROP_OPTIONS: CropOption[] = [
  {
    id: "wheat",
    name: "Wheat (गेहूं)",
    nativeNames: {
      hi: "गेहूं (Wheat)",
      te: "గోధుమ (Wheat)",
      ta: "கோதுமை (Wheat)",
      mr: "गहू (Wheat)",
      pa: "ਕਣਕ (Wheat)",
      bn: "গম (Wheat)",
      kn: "ಗೋಧಿ (Wheat)",
      gu: "ઘઉં (Wheat)",
    },
    category: "cereal",
    image: CROP_VISUALS.wheat.photo,
    iconEmoji: "🌾",
  },
  {
    id: "rice",
    name: "Rice / Paddy (धान)",
    nativeNames: {
      hi: "धान / चावल (Paddy)",
      te: "వరి (Paddy)",
      ta: "நெல் (Paddy)",
      mr: "भात / धान (Paddy)",
      pa: "ਝੋਨਾ (Paddy)",
      bn: "ধান (Paddy)",
      kn: "ಭತ್ತ (Paddy)",
      gu: "ડાંગર (Paddy)",
    },
    category: "cereal",
    image: CROP_VISUALS.rice.photo,
    iconEmoji: "🌾",
  },
  {
    id: "cotton",
    name: "Cotton (कपास)",
    nativeNames: {
      hi: "कपास (Cotton)",
      te: "పత్తి (Cotton)",
      ta: "பருத்தி (Cotton)",
      mr: "कापूस (Cotton)",
      pa: "ਕਪਾਹ (Cotton)",
      bn: "তুলা (Cotton)",
      kn: "ಹತ್ತಿ (Cotton)",
      gu: "કપાસ (Cotton)",
    },
    category: "cash",
    image: CROP_VISUALS.cotton.photo,
    iconEmoji: "☁️",
  },
  {
    id: "sugarcane",
    name: "Sugarcane (गन्ना)",
    nativeNames: {
      hi: "गन्ना (Sugarcane)",
      te: "చెరకు (Sugarcane)",
      ta: "கரும்பு (Sugarcane)",
      mr: "ऊस (Sugarcane)",
      pa: "ਗੰਨਾ (Sugarcane)",
      bn: "আখ (Sugarcane)",
      kn: "ಕಬ್ಬು (Sugarcane)",
      gu: "શેરડી (Sugarcane)",
    },
    category: "cash",
    image: CROP_VISUALS.sugarcane.photo,
    iconEmoji: "🎋",
  },
  {
    id: "mustard",
    name: "Mustard (सरसों)",
    nativeNames: {
      hi: "सरसों (Mustard)",
      te: "ఆవాలు (Mustard)",
      ta: "கடுகு (Mustard)",
      mr: "मोहरी (Mustard)",
      pa: "ਸਰ੍ਹੋਂ (Mustard)",
      bn: "সরিષા (Mustard)",
      kn: "ಸಾಸಿವೆ (Mustard)",
      gu: "રાઈ / સરસવ (Mustard)",
    },
    category: "oilseed",
    image: CROP_VISUALS.mustard.photo,
    iconEmoji: "🌼",
  },
  {
    id: "maize",
    name: "Maize / Corn (मक्का)",
    nativeNames: {
      hi: "मक्का (Maize)",
      te: "మొక్కజొన్న (Maize)",
      ta: "மக்காச்சோளம் (Maize)",
      mr: "मका (Maize)",
      pa: "ਮੱਕੀ (Maize)",
      bn: "ভუტ্টা (Maize)",
      kn: "ಮೆಕ್ಕೆಜೋಳ (Maize)",
      gu: "મકાઈ (Maize)",
    },
    category: "cereal",
    image: CROP_VISUALS.maize.photo,
    iconEmoji: "🌽",
  },
  {
    id: "tomato",
    name: "Tomato (टमाटर)",
    nativeNames: {
      hi: "टमाटर (Tomato)",
      te: "టమోటా (Tomato)",
      ta: "தக்காளி (Tomato)",
      mr: "टोमॅटो (Tomato)",
      pa: "ਟਮਾਟਰ (Tomato)",
      bn: "টমেটো (Tomato)",
      kn: "ಟೊಮೇಟೊ (Tomato)",
      gu: "ટામેટા (Tomato)",
    },
    category: "vegetable",
    image: CROP_VISUALS.tomato.photo,
    iconEmoji: "🍅",
  },
  {
    id: "potato",
    name: "Potato (आलू)",
    nativeNames: {
      hi: "आलू (Potato)",
      te: "బంగాళాదుంప (Potato)",
      ta: "உருளைக்கிழங்கு (Potato)",
      mr: "बटाटा (Potato)",
      pa: "ਆਲੂ (Potato)",
      bn: "আলু (Potato)",
      kn: "ಆಲೂಗಡ್ಡೆ (Potato)",
      gu: "બટાકા (Potato)",
    },
    category: "vegetable",
    image: CROP_VISUALS.potato.photo,
    iconEmoji: "🥔",
  },
  {
    id: "soybean",
    name: "Soybean (सोयाबीन)",
    nativeNames: {
      hi: "सोयाबीन (Soybean)",
      te: "సోయాబీన్ (Soybean)",
      ta: "சோயாபீன் (Soybean)",
      mr: "सोयाबीन (Soybean)",
      pa: "ਸੋਇਆਬੀਨ (Soybean)",
      bn: "সয়াবিন (Soybean)",
      kn: "ಸೋಯಾಬೀನ್ (Soybean)",
      gu: "સોયાબીન (Soybean)",
    },
    category: "pulse",
    image: CROP_VISUALS.soybean.photo,
    iconEmoji: "🌱",
  },
  {
    id: "chilli",
    name: "Chilli (मिर्च)",
    nativeNames: {
      hi: "हरी मिर्च (Chilli)",
      te: "మిరపకाय (Chilli)",
      ta: "பச்சை மிளகாய் (Chilli)",
      mr: "हिरवी मिरची (Chilli)",
      pa: "ਹਰੀ ਮਿਰਚ (Chilli)",
      bn: "কাঁচা মরিচ (Chilli)",
      kn: "ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ (Chilli)",
      gu: "લીલા મરચા (Chilli)",
    },
    category: "vegetable",
    image: CROP_VISUALS.chilli.photo,
    iconEmoji: "🌶️",
  },
  {
    id: "onion",
    name: "Onion (प्याज)",
    nativeNames: {
      hi: "प्याज (Onion)",
      te: "ఉల్లిపాయ (Onion)",
      ta: "வெங்காயம் (Onion)",
      mr: "कांदा (Onion)",
      pa: "ਪਿਆਜ਼ (Onion)",
      bn: "পেঁয়াজ (Onion)",
      kn: "ಈರುಳ್ಳಿ (Onion)",
      gu: "ડુંગળી (Onion)",
    },
    category: "vegetable",
    image: CROP_VISUALS.onion.photo,
    iconEmoji: "🧅",
  },
  {
    id: "groundnut",
    name: "Groundnut (मूंगफली)",
    nativeNames: {
      hi: "मूंगफली (Groundnut)",
      te: "వేరుశెనగ (Groundnut)",
      ta: "நிலக்கடலை (Groundnut)",
      mr: "भुईमूग (Groundnut)",
      pa: "ਮੂੰਗਫਲੀ (Groundnut)",
      bn: "চিনাবাদাম (Groundnut)",
      kn: "ಕಡಲೆಕಾಯಿ (Groundnut)",
      gu: "મગફળી (Groundnut)",
    },
    category: "oilseed",
    image: CROP_VISUALS.groundnut.photo,
    iconEmoji: "🥜",
  },
];

// 2. Growth Stages
export interface GrowthStage {
  id: "sowing" | "vegetative" | "flowering" | "fruiting";
  title: string;
  hindiTitle: string;
  iconEmoji: string;
  description: string;
  timingHint: string;
}

export const GROWTH_STAGES: GrowthStage[] = [
  {
    id: "sowing",
    title: "Sowing / Basal Stage",
    hindiTitle: "बुवाई व प्रारंभिक अवस्था (Sowing)",
    iconEmoji: "🌱",
    description: "Initial seed planting or root establishment",
    timingHint: "Apply at the time of final ploughing / sowing",
  },
  {
    id: "vegetative",
    title: "Vegetative / Tillering",
    hindiTitle: "वानस्पतिक वृद्धि / कल्ले फूटना (Vegetative)",
    iconEmoji: "🌿",
    description: "Active leaf, stem & tiller development (20-40 days)",
    timingHint: "Apply along with first or second irrigation",
  },
  {
    id: "flowering",
    title: "Flowering / Heading Stage",
    hindiTitle: "फूल आने की अवस्था (Flowering)",
    iconEmoji: "🌸",
    description: "Flower formation and pollination window",
    timingHint: "Apply just before flower initiation to prevent drop",
  },
  {
    id: "fruiting",
    title: "Fruiting / Grain Filling",
    hindiTitle: "दाना भराव व फल पकना (Fruiting)",
    iconEmoji: "🌾",
    description: "Grain weight increase and ripening",
    timingHint: "Apply foliar spray during early fruit / grain milk stage",
  },
];

// Soil condition presets
export type SoilNutrientLevel = "low" | "medium" | "high" | "not_sure";

export interface RecommendationResult {
  fertilizerName: string;
  fertilizerType: "chemical" | "organic" | "bio";
  quantityPerAcre: string;
  timingText: string;
  applicationMethod: "Broadcast (छिटकना)" | "Soil Mix / Basal" | "Foliar Spray (स्प्रे)" | "Fertigation / Drip";
  methodIcon: string;
  secondaryOption?: {
    name: string;
    quantity: string;
    note: string;
  };
  keyBenefits: string[];
  spokenSummary: string;
}

// Recommendation calculation logic based on agronomy guidelines
export function calculateFertilizerRecommendation(
  cropId: string,
  stageId: string,
  soilStatus: SoilNutrientLevel,
  soilPh?: number
): RecommendationResult {
  const crop = CROP_OPTIONS.find((c) => c.id === cropId)?.name || "Crop";
  const stage = GROWTH_STAGES.find((s) => s.id === stageId)?.title || "Stage";

  // 1. Sowing / Basal stage recommendations
  if (stageId === "sowing") {
    if (cropId === "wheat" || cropId === "rice" || cropId === "maize") {
      return {
        fertilizerName: "DAP (Di-Ammonium Phosphate) + Urea",
        fertilizerType: "chemical",
        quantityPerAcre: soilStatus === "low" ? "55 kg DAP + 20 kg Urea" : "50 kg DAP + 15 kg Urea",
        timingText: "Apply directly at seed sowing / final ploughing",
        applicationMethod: "Soil Mix / Basal",
        methodIcon: "🚜",
        secondaryOption: {
          name: "Well-rotted Cow Dung Compost (FYM) + Neem Cake",
          quantity: "2 tonnes FYM + 100 kg Neem Cake per acre",
          note: "Mix 15 days before sowing for organic soil conditioning",
        },
        keyBenefits: [
          "Promotes deep root penetration in young seedlings",
          "Phosphorus rich for early vigorous germination",
          "Balanced starter nitrogen for uniform field emergence",
        ],
        spokenSummary: `For ${crop} at sowing stage, apply 50 kg DAP and 15 kg Urea per acre. Mix into the soil during final ploughing before seed drill.`,
      };
    }

    if (cropId === "mustard" || cropId === "soybean") {
      return {
        fertilizerName: "SSP (Single Super Phosphate) + Bentonite Sulphur",
        fertilizerType: "chemical",
        quantityPerAcre: "75 kg SSP + 10 kg Sulphur per acre",
        timingText: "Incorporate into top 4 inches of soil at sowing",
        applicationMethod: "Soil Mix / Basal",
        methodIcon: "🚜",
        secondaryOption: {
          name: "Trichoderma & PSB Bio-fertilizer",
          quantity: "2 kg seed mix per acre",
          note: "Prevents collar rot and enhances phosphorus uptake",
        },
        keyBenefits: [
          "Sulphur dramatically boosts oil percentage and seed weight",
          "Calcium content strengthens root nodules",
          "Improves frost resistance during early winter",
        ],
        spokenSummary: `For ${crop} at sowing stage, apply 75 kg Single Super Phosphate with 10 kg Sulphur per acre for maximum oil content and root growth.`,
      };
    }

    if (cropId === "sugarcane" || cropId === "cotton") {
      return {
        fertilizerName: "NPK 12:32:16 + Zinc Sulphate (21%)",
        fertilizerType: "chemical",
        quantityPerAcre: "75 kg NPK + 10 kg Zinc Sulphate",
        timingText: "Apply in furrows along with cane setts / seed placement",
        applicationMethod: "Soil Mix / Basal",
        methodIcon: "🚜",
        keyBenefits: [
          "Essential Zinc prevents Khaira deficiency and stunted nodes",
          "Balanced NPK ensures strong cane tillering",
        ],
        spokenSummary: `For ${crop}, apply 75 kg NPK 12:32:16 with 10 kg Zinc Sulphate per acre in the open furrows.`,
      };
    }

    // Vegetables (Tomato, Potato, Chilli)
    return {
      fertilizerName: "NPK 19:19:19 + Vermicompost",
      fertilizerType: "chemical",
      quantityPerAcre: "50 kg NPK 19:19:19 + 500 kg Vermicompost",
      timingText: "Apply in transplant beds 2-3 days before planting",
      applicationMethod: "Soil Mix / Basal",
      methodIcon: "🌱",
      keyBenefits: [
        "Provides immediate balanced nutrition to transplant roots",
        "Vermicompost retains soil moisture and beneficial microbes",
      ],
      spokenSummary: `For ${crop} planting, mix 50 kg NPK 19:19:19 and 500 kg Vermicompost per acre in your nursery beds.`,
    };
  }

  // 2. Vegetative / Tillering stage recommendations
  if (stageId === "vegetative") {
    if (cropId === "wheat" || cropId === "rice" || cropId === "maize" || cropId === "sugarcane") {
      return {
        fertilizerName: "Neem Coated Urea (First Top Dressing)",
        fertilizerType: "chemical",
        quantityPerAcre: soilStatus === "low" ? "45 kg per acre" : "35 kg per acre",
        timingText: "Apply immediately before or after 1st irrigation (21-30 days)",
        applicationMethod: "Broadcast (छिटकना)",
        methodIcon: "🌾",
        secondaryOption: {
          name: "Nano Urea (Liquid Spray)",
          quantity: "500 ml per 100 Litres water per acre",
          note: "Foliar spray on active green leaves during cool morning hours",
        },
        keyBenefits: [
          "Triggers rapid tillering and lush dark green chlorophyll",
          "Neem coating reduces nitrogen leaching in wet soil",
          "Boosts plant height and active biomass",
        ],
        spokenSummary: `For ${crop} in vegetative stage, broadcast 35 to 45 kg of Neem Coated Urea per acre right before or after your first irrigation.`,
      };
    }

    // Vegetables / Cotton / Mustard
    return {
      fertilizerName: "Water Soluble 19:19:19 (Foliar)",
      fertilizerType: "chemical",
      quantityPerAcre: "1 kg in 150L Water per acre",
      timingText: "Spray in the morning (8 AM - 11 AM) or evening",
      applicationMethod: "Foliar Spray (स्प्रे)",
      methodIcon: "🚿",
      keyBenefits: [
        "100% water soluble for rapid 48-hour leaf absorption",
        "Enhances branching, leaf canopy, and vigorous growth",
      ],
      spokenSummary: `For ${crop} vegetative growth, spray 1 kg of water-soluble NPK 19:19:19 in 150 litres of water per acre.`,
    };
  }

  // 3. Flowering / Heading stage recommendations
  if (stageId === "flowering") {
    return {
      fertilizerName: "0:52:34 (Mono Potassium Phosphate) + Boron (20%)",
      fertilizerType: "chemical",
      quantityPerAcre: "1 kg 0:52:34 + 200g Boron in 150L water per acre",
      timingText: "Apply just as first 10-15% flowers emerge (Do not delay)",
      applicationMethod: "Foliar Spray (स्प्रे)",
      methodIcon: "🚿",
      secondaryOption: {
        name: "Seaweed Extract Organic Biostimulant",
        quantity: "300 ml in 150L water",
        note: "Prevents blossom drop during dry heat waves",
      },
      keyBenefits: [
        "Phosphorus and Potassium maximize flower retention & pollen fertility",
        "Boron prevents flower drop and ensures full pollination",
        "Zero nitrogen prevents excess vegetative growth during bloom",
      ],
      spokenSummary: `At flowering stage for ${crop}, spray 1 kg of 0:52:34 with 200 grams of Boron in 150 litres of water per acre. This stops flower dropping and increases fruit setting.`,
    };
  }

  // 4. Fruiting / Grain Filling stage recommendations
  return {
    fertilizerName: "0:0:50 (Potassium Sulphate) / MOP",
    fertilizerType: "chemical",
    quantityPerAcre: "1.5 kg (Foliar) OR 25 kg MOP (Soil) per acre",
    timingText: "Apply during early grain milk / fruit enlargement stage",
    applicationMethod: "Foliar Spray (स्प्रे)",
    methodIcon: "🚿",
    secondaryOption: {
      name: "Chelated Micronutrient Mixture",
      quantity: "250g in 150L water",
      note: "Gives bright natural shine and uniform ripening",
    },
    keyBenefits: [
      "Potassium increases grain weight, plumpness and test weight",
      "Enhances natural color, sweetness, and market selling price",
      "Increases shelf life and post-harvest storage resistance",
    ],
    spokenSummary: `For ${crop} in fruiting and grain filling stage, spray 1.5 kg of 0:0:50 Potassium Sulphate per acre to get heavy, shiny grains and maximum mandi price.`,
  };
}

export const FertilizerRecommendationView: React.FC<FertilizerRecommendationViewProps> = ({
  currentLanguage,
  iotData,
  onBack,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Wizard Step: 1 (Crop) -> 2 (Growth Stage) -> 3 (Soil & IoT Info) -> 4 (Results)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Selections
  const [selectedCropId, setSelectedCropId] = useState<string>("wheat");
  const [selectedStageId, setSelectedStageId] = useState<string>("sowing");
  const [soilStatus, setSoilStatus] = useState<SoilNutrientLevel>(
    iotData ? (iotData.soilPh >= 6.5 && iotData.soilPh <= 7.5 ? "medium" : "low") : "medium"
  );
  const [useIotData, setUseIotData] = useState<boolean>(!!iotData);

  // Result Cache
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  const selectedCrop = CROP_OPTIONS.find((c) => c.id === selectedCropId) || CROP_OPTIONS[0];
  const selectedStage = GROWTH_STAGES.find((s) => s.id === selectedStageId) || GROWTH_STAGES[0];

  const handleSelectCrop = (cropId: string) => {
    soundEffects.click();
    setSelectedCropId(cropId);
    setCurrentStep(2);
  };

  const handleSelectStage = (stageId: string) => {
    soundEffects.click();
    setSelectedStageId(stageId);
    setCurrentStep(3);
  };

  const handleGenerateRecommendation = () => {
    soundEffects.success();
    const result = calculateFertilizerRecommendation(
      selectedCropId,
      selectedStageId,
      soilStatus,
      iotData?.soilPh
    );
    setRecommendation(result);
    setCurrentStep(4);

    // Auto speak summary
    if (result.spokenSummary) {
      speakText(result.spokenSummary, currentLanguage);
    }
  };

  const handleResetFlow = () => {
    soundEffects.click();
    setCurrentStep(1);
    setRecommendation(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-28 max-w-3xl mx-auto px-3 sm:px-4 pt-2">
      {/* Top Breadcrumb / Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            if (currentStep > 1) {
              setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs active:scale-95 transition-all"
        >
          <ArrowLeft size={16} />
          <span>{currentStep === 1 ? "Back to Farm" : "Previous Step"}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FlaskConical size={16} />
          </div>
          <h2 className="font-black text-base sm:text-lg text-stone-900 leading-none">
            Fertilizer Recommendation
          </h2>
        </div>

        <AudioButton
          textToSpeak="Fertilizer advisory tool. Select your crop, growth stage, and soil info to get precise fertilizer dosage per acre."
          language={currentLanguage}
          size="sm"
        />
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs">
        <div className="flex items-center justify-between gap-1 text-center">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              setCurrentStep(1);
            }}
            className={`flex-1 flex flex-col items-center gap-1 transition-all ${
              currentStep >= 1 ? "opacity-100" : "opacity-40"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep === 1
                  ? "bg-emerald-600 text-white shadow-xs scale-105"
                  : currentStep > 1
                  ? "bg-emerald-100 text-emerald-800 font-bold"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {currentStep > 1 ? <Check size={14} /> : "1"}
            </div>
            <span className="text-[10px] font-bold text-stone-800 truncate max-w-[70px]">
              1. Crop
            </span>
          </button>

          <div className={`h-0.5 flex-1 ${currentStep >= 2 ? "bg-emerald-500" : "bg-stone-200"}`} />

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => {
              if (selectedCropId) {
                soundEffects.click();
                setCurrentStep(2);
              }
            }}
            className={`flex-1 flex flex-col items-center gap-1 transition-all ${
              currentStep >= 2 ? "opacity-100" : "opacity-40"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep === 2
                  ? "bg-emerald-600 text-white shadow-xs scale-105"
                  : currentStep > 2
                  ? "bg-emerald-100 text-emerald-800 font-bold"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {currentStep > 2 ? <Check size={14} /> : "2"}
            </div>
            <span className="text-[10px] font-bold text-stone-800 truncate max-w-[70px]">
              2. Stage
            </span>
          </button>

          <div className={`h-0.5 flex-1 ${currentStep >= 3 ? "bg-emerald-500" : "bg-stone-200"}`} />

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => {
              if (selectedStageId) {
                soundEffects.click();
                setCurrentStep(3);
              }
            }}
            className={`flex-1 flex flex-col items-center gap-1 transition-all ${
              currentStep >= 3 ? "opacity-100" : "opacity-40"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep === 3
                  ? "bg-emerald-600 text-white shadow-xs scale-105"
                  : currentStep > 3
                  ? "bg-emerald-100 text-emerald-800 font-bold"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {currentStep > 3 ? <Check size={14} /> : "3"}
            </div>
            <span className="text-[10px] font-bold text-stone-800 truncate max-w-[70px]">
              3. Soil Info
            </span>
          </button>

          <div className={`h-0.5 flex-1 ${currentStep >= 4 ? "bg-emerald-500" : "bg-stone-200"}`} />

          {/* Step 4 */}
          <div
            className={`flex-1 flex flex-col items-center gap-1 transition-all ${
              currentStep === 4 ? "opacity-100" : "opacity-40"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep === 4
                  ? "bg-emerald-600 text-white shadow-xs scale-105"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              4
            </div>
            <span className="text-[10px] font-bold text-stone-800 truncate max-w-[70px]">
              4. Dose Result
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* STEP 1: SELECT CROP (Large Picture Cards) */}
      {/* ======================================================== */}
      {currentStep === 1 && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                Step 1 of 3
              </span>
              <h3 className="text-lg sm:text-xl font-black text-stone-900">
                Select Your Farm Crop (फसल चुनें)
              </h3>
            </div>
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-xl">
              Tap 1 Card
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CROP_OPTIONS.map((crop) => {
              const isSelected = selectedCropId === crop.id;
              const displayName =
                crop.nativeNames[currentLanguage] || crop.name;

              return (
                <button
                  key={crop.id}
                  id={`fertilizer-crop-card-${crop.id}`}
                  type="button"
                  onClick={() => handleSelectCrop(crop.id)}
                  className={`group relative rounded-3xl overflow-hidden border-2 text-left transition-all active:scale-95 flex flex-col justify-between ${
                    isSelected
                      ? "border-emerald-600 ring-3 ring-emerald-500/20 bg-emerald-50/60 shadow-md scale-[1.02]"
                      : "border-stone-200 bg-white hover:border-emerald-300 hover:shadow-xs"
                  }`}
                >
                  {/* Crop Photo with Gradient Overlay */}
                  <div className="relative h-28 w-full overflow-hidden bg-stone-100">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const visual = getCropVisual(crop.id);
                        (e.currentTarget as HTMLImageElement).src = visual.fallback;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-2xl drop-shadow-md">
                      {crop.iconEmoji}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                        <Check size={14} />
                      </div>
                    )}
                  </div>

                  {/* Crop Info */}
                  <div className="p-3">
                    <div className="font-black text-sm text-stone-900 leading-tight">
                      {displayName}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                      {crop.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 2: SELECT GROWTH STAGE (Icon-based picker) */}
      {/* ======================================================== */}
      {currentStep === 2 && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                Step 2 of 3 • {selectedCrop.name}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-stone-900">
                Current Growth Stage (वृद्धि अवस्था)
              </h3>
            </div>
            <AudioButton
              textToSpeak="Select the current growth stage of your crop: Sowing, Vegetative, Flowering, or Fruiting."
              language={currentLanguage}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GROWTH_STAGES.map((stage) => {
              const isSelected = selectedStageId === stage.id;

              return (
                <button
                  key={stage.id}
                  id={`fertilizer-stage-card-${stage.id}`}
                  type="button"
                  onClick={() => handleSelectStage(stage.id)}
                  className={`p-4 rounded-3xl border-2 text-left transition-all active:scale-95 flex items-start justify-between ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm"
                      : "bg-white border-stone-200 hover:border-emerald-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                        isSelected ? "bg-emerald-600 text-white shadow-xs" : "bg-stone-100 text-stone-800"
                      }`}
                    >
                      {stage.iconEmoji}
                    </div>
                    <div>
                      <div className="font-black text-base text-stone-900">
                        {stage.hindiTitle}
                      </div>
                      <div className="text-xs font-semibold text-stone-700 mt-0.5">
                        {stage.description}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 mt-1.5">
                        <Clock size={12} />
                        <span>{stage.timingHint}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-stone-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 3: SOIL INFO (Auto IoT Sensor or Simple Presets) */}
      {/* ======================================================== */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                Step 3 of 3 • Optional Soil Condition
              </span>
              <h3 className="text-lg sm:text-xl font-black text-stone-900">
                Soil Fertility & Sensor Data (मिट्टी की स्थिति)
              </h3>
            </div>
            <AudioButton
              textToSpeak="Provide soil condition or use connected IoT sensors to fine-tune the fertilizer dosage."
              language={currentLanguage}
              size="sm"
            />
          </div>

          {/* Soil Telemetry / Manual Estimates Card */}
          {iotData && (
            <div
              className={`p-4 rounded-3xl border-2 shadow-xs space-y-2 ${
                iotData.pairedStatus === "connected"
                  ? "bg-gradient-to-r from-sky-50 to-blue-50 border-sky-300"
                  : iotData.isManualEntry || iotData.pairedStatus === "software_only"
                  ? "bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-300"
                  : "bg-stone-50 border-stone-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl text-white flex items-center justify-center ${
                      iotData.pairedStatus === "connected"
                        ? "bg-sky-600"
                        : iotData.isManualEntry || iotData.pairedStatus === "software_only"
                        ? "bg-teal-700"
                        : "bg-stone-500"
                    }`}
                  >
                    {iotData.pairedStatus === "connected" ? (
                      <Cpu size={18} />
                    ) : (
                      <FlaskConical size={18} />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                      {iotData.pairedStatus === "connected"
                        ? "IoT Live Telemetry Active"
                        : iotData.isManualEntry || iotData.pairedStatus === "software_only"
                        ? "Manual Soil Estimates Applied"
                        : "Regional Baseline Soil Data"}
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                        {iotData.pairedStatus === "connected" ? "95% Accuracy" : "+25% Boost"}
                      </span>
                    </span>
                    <div className="text-[11px] text-stone-600 font-semibold">
                      {iotData.pairedStatus === "connected"
                        ? "Node: ESP32 Farm Hub (Live Sync)"
                        : iotData.isManualEntry || iotData.pairedStatus === "software_only"
                        ? `Custom Soil Data • ${iotData.soilType || "Loamy Soil"}`
                        : "Standard climate & regional crop guidelines"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.tap();
                    setUseIotData(!useIotData);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                    useIotData
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-white text-stone-700 border border-stone-300"
                  }`}
                >
                  {useIotData ? "Auto-Applied" : "Override"}
                </button>
              </div>

              {useIotData && (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-white p-2.5 rounded-2xl border border-stone-200 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-500 block">Soil pH</span>
                    <span className="text-base font-black text-stone-900">{iotData.soilPh} pH</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-2xl border border-stone-200 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-500 block">Moisture</span>
                    <span className="text-base font-black text-stone-900">
                      {iotData.soilMoisturePercent}%
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-2xl border border-stone-200 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-500 block">Soil Texture</span>
                    <span className="text-xs font-black text-emerald-800 truncate block">
                      {iotData.soilType ? iotData.soilType.split(" ")[0] : "Loamy"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Simple Tap Presets */}
          <div className="space-y-2">
            <span className="text-xs font-black text-stone-800 px-1">
              Select Soil Fertility Level (मिट्टी की उर्वरता):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "low", label: "Low Fertility (कम उपजाऊ)", hint: "Needs +15% extra nitrogen" },
                { id: "medium", label: "Medium / Normal (सामान्य)", hint: "Standard balanced dose" },
                { id: "high", label: "Rich Soil (उपजाऊ)", hint: "Reduce chemical nitrogen" },
                { id: "not_sure", label: "Not Sure (जानकारी नहीं)", hint: "Use state avg baseline" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundEffects.tap();
                    setSoilStatus(item.id as SoilNutrientLevel);
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all active:scale-95 flex flex-col justify-between ${
                    soilStatus === item.id
                      ? "bg-emerald-100/70 border-emerald-600 text-emerald-950 shadow-xs"
                      : "bg-white border-stone-200 hover:border-stone-300 text-stone-800"
                  }`}
                >
                  <div className="font-black text-xs">{item.label}</div>
                  <span className="text-[10px] font-bold text-stone-600 mt-1">{item.hint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Summary Overview Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedCrop.iconEmoji}</span>
              <div>
                <div className="text-xs font-black text-stone-900">
                  {selectedCrop.name} • {selectedStage.title}
                </div>
                <div className="text-[11px] font-semibold text-stone-600">
                  Ready to calculate optimal per-acre fertilizer requirements
                </div>
              </div>
            </div>
          </div>

          {/* Action Generate Button */}
          <button
            id="calculate-fertilizer-submit-btn"
            type="button"
            onClick={handleGenerateRecommendation}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-base shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles size={20} />
            <span>Calculate Fertilizer Dose (खाद की मात्रा देखें)</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4: RESULTS SCREEN (Recommended Fertilizer & Per-Acre Dose) */}
      {/* ======================================================== */}
      {currentStep === 4 && recommendation && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          {/* Top Result Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-lg relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 border border-white/20">
                  {selectedCrop.iconEmoji}
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide">
                    Optimal Dose Advisory • {selectedCrop.name}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {recommendation.fertilizerName}
                  </h3>
                </div>
              </div>

              {/* Read Aloud Button */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.tap();
                  speakText(recommendation.spokenSummary, currentLanguage);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs active:scale-95 transition-all shadow-sm"
              >
                <Volume2 size={16} />
                <span>Read Aloud</span>
              </button>
            </div>

            {/* Huge Per Acre Quantity Display */}
            <div className="mt-5 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 relative z-10">
              <div>
                <span className="text-xs font-bold text-emerald-200 uppercase block">
                  Required Dose Per Acre (प्रति एकड़ मात्रा)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight mt-0.5">
                  {recommendation.quantityPerAcre}
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-100">
                <ShieldCheck size={16} className="text-emerald-300" />
                <span>Agronomist Verified Baseline</span>
              </div>
            </div>
          </div>

          {/* Key Application Logistics (Timing & Method) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Timing Card */}
            <div className="p-4 rounded-3xl bg-white border-2 border-amber-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                <Calendar size={18} className="text-amber-600" />
                <span>Best Timing to Apply (सही समय)</span>
              </div>
              <p className="text-xs font-bold text-stone-800 leading-relaxed">
                {recommendation.timingText}
              </p>
              <div className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                Stage: {selectedStage.title}
              </div>
            </div>

            {/* Method Card */}
            <div className="p-4 rounded-3xl bg-white border-2 border-emerald-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                <span className="text-lg">{recommendation.methodIcon}</span>
                <span>Application Method (डालने की विधि)</span>
              </div>
              <p className="text-xs font-bold text-stone-800 leading-relaxed">
                {recommendation.applicationMethod}
              </p>
              <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                Even root / foliage coverage
              </div>
            </div>
          </div>

          {/* Agronomic Benefits List */}
          <div className="p-4 rounded-3xl bg-white border-2 border-stone-200 shadow-2xs space-y-2.5">
            <h4 className="font-black text-sm text-stone-900 flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-600" />
              <span>Why This Recommendation? (इसके फायदे)</span>
            </h4>
            <div className="space-y-1.5">
              {recommendation.keyBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-stone-700">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary / Organic Alternative */}
          {recommendation.secondaryOption && (
            <div className="p-4 rounded-3xl bg-emerald-50/80 border-2 border-emerald-300 shadow-2xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base">🍃</span>
                <span className="font-black text-xs text-emerald-950 uppercase tracking-wide">
                  Organic / Soil Bio Alternative (जैविक विकल्प)
                </span>
              </div>
              <div className="font-black text-sm text-emerald-900">
                {recommendation.secondaryOption.name} • {recommendation.secondaryOption.quantity}
              </div>
              <div className="text-[11px] font-semibold text-emerald-800">
                {recommendation.secondaryOption.note}
              </div>
            </div>
          )}

          {/* Bottom Action Buttons: Re-calculate or Back */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetFlow}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-white border-2 border-stone-300 hover:bg-stone-50 font-black text-xs sm:text-sm text-stone-800 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={16} />
              <span>Check Another Crop</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                onBack();
              }}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-xs sm:text-sm text-white active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <CheckCircle2 size={16} />
              <span>Done & Return</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
