import React, { useState, useRef } from "react";
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Droplet,
  Volume2,
  RotateCcw,
  ArrowLeft,
  Info,
} from "lucide-react";
import { LanguageCode, UserRole, DiseaseDiagnosis } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { SAMPLE_DISEASE_CARDS } from "../../data/mockData";
import {
  TOMATO_LEAF_BLIGHT_SVG,
  POWDERY_MILDEW_SVG,
  HEALTHY_WHEAT_SVG,
} from "../../data/plantImages";
import { diagnoseCropImage } from "../../services/api";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";
import { AgriVisionLogo } from "../common/AgriVisionLogo";

interface DiseaseScannerViewProps {
  currentLanguage: LanguageCode;
  currentRole: UserRole;
  onBack: () => void;
  onOpenAssistantWithDiagnosis?: (diag: DiseaseDiagnosis) => void;
}

export const DiseaseScannerView: React.FC<DiseaseScannerViewProps> = ({
  currentLanguage,
  currentRole,
  onBack,
  onOpenAssistantWithDiagnosis,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropName, setCropName] = useState("Tomato / Vegetable");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosis | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEffects.camera();
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      runDiagnosis(base64);
    };
    reader.readAsDataURL(file);
  };

  const isGardener = currentRole === "gardener";

  const handleSelectSample = (sample: typeof SAMPLE_DISEASE_CARDS[0]) => {
    soundEffects.click();
    setSelectedImage(sample.image);
    setCropName(sample.crop);

    if (sample.crop === "Tomato") {
      const tomatoDiag: DiseaseDiagnosis = {
        id: `diag-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        cropName: isGardener ? "Balcony Tomato (टमाटर)" : "Tomato (टमाटर)",
        diseaseName: "Early Leaf Blight (Alternaria solani)",
        commonName: isGardener ? "Potted Tomato Leaf Spot (पत्तियों पर काले धब्बे)" : "टमाटर का अगेती झुलसा रोग (Leaf Blight)",
        severity: isGardener ? "medium" : "high",
        colorStatus: "yellow",
        confidence: 96,
        isHealthy: false,
        description: isGardener
          ? "Brown circular spots on lower leaves from water splashing on soil."
          : "Dark brown circular spots with concentric target rings and yellow chlorotic halos on lower foliage.",
        organicRemedy: isGardener
          ? "Mix 1 tsp (5ml) Neem oil + 2 drops liquid dish soap in 1L water. Spray leaves in morning."
          : sample.organic,
        chemicalTreatment: isGardener
          ? "For balcony pots, stick to organic neem oil spray or 1/2 tsp baking soda in 1L water."
          : sample.chemical,
        preventiveAction: isGardener
          ? "Snip off affected lower leaves with clean scissors. Water at the soil base, not on leaves."
          : "Prune infected lower leaves, avoid wetting foliage during irrigation, and ensure good plant spacing.",
        spokenAdvice: isGardener
          ? "Mild leaf spot detected on your tomato plant. Prune the bottom infected leaves and spray 5ml neem oil solution."
          : "Early leaf blight detected on tomato. Spray 5ml neem oil per liter water and apply mancozeb fungicide.",
        imageUri: sample.image,
      };
      setDiagnosis(tomatoDiag);
      speakText(tomatoDiag.spokenAdvice, currentLanguage);
      soundEffects.success();
    } else if (sample.crop === "Cucurbits / Peas" || sample.crop.includes("Peas") || sample.crop.includes("Rose")) {
      const mildewDiag: DiseaseDiagnosis = {
        id: `diag-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        cropName: isGardener ? "Rose / Balcony Vine (गुलाब/सब्जी)" : "Cucurbits / Peas (सब्जियां)",
        diseaseName: "Powdery Mildew (Fungal)",
        commonName: isGardener ? "White Powder on Leaves (सफेद फफूंद)" : "सफेद चूर्णिल फफूंद (छाछिया रोग)",
        severity: "medium",
        colorStatus: "yellow",
        confidence: 94,
        isHealthy: false,
        description: isGardener
          ? "White powdery coating on upper leaf surfaces due to humidity and low airflow."
          : "White talcum-powder like fungal patches covering the upper leaf surfaces.",
        organicRemedy: isGardener
          ? "Mix 2 tablespoons sour buttermilk in 1 glass of water (1:9) or 1/2 tsp baking soda + 1L water and spray."
          : sample.organic,
        chemicalTreatment: isGardener
          ? "Natural remedy: Spray diluted sour buttermilk or neem oil in morning sun."
          : sample.chemical,
        preventiveAction: isGardener
          ? "Move pot to a brighter spot with 4-5 hours of direct sunlight and good breeze."
          : "Increase sunlight exposure, improve air circulation, and spray sour buttermilk solution.",
        spokenAdvice: isGardener
          ? "Powdery mildew detected on your potted plant. Spray diluted sour buttermilk solution in morning sunlight."
          : "Powdery mildew detected on vegetable leaves. Spray diluted sour buttermilk in bright sunlight.",
        imageUri: sample.image,
      };
      setDiagnosis(mildewDiag);
      speakText(mildewDiag.spokenAdvice, currentLanguage);
      soundEffects.success();
    } else {
      const healthyDiag: DiseaseDiagnosis = {
        id: `diag-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        cropName: isGardener ? "Potted Mint / Basil (पुदीना/तुलसी)" : "Wheat (गेहूं)",
        diseaseName: "Healthy Green Foliage",
        commonName: isGardener ? "Healthy Plant (स्वस्थ हरा पौधा)" : "स्वस्थ हरी फसल (No Disease)",
        severity: "low",
        colorStatus: "green",
        confidence: 98,
        isHealthy: true,
        description: isGardener
          ? "Lush, vibrant green foliage with strong stems and healthy new growth."
          : "Vigorous green foliage with strong tillers and healthy vegetative growth.",
        organicRemedy: isGardener
          ? "Add 1 handful of vermicompost or composted manure once a month."
          : sample.organic,
        chemicalTreatment: isGardener
          ? "No chemical spray needed! Plant is flourishing naturally."
          : sample.chemical,
        preventiveAction: isGardener
          ? "Keep soil moist with regular morning watering and harvest top leaves to encourage bushiness."
          : "Maintain balanced irrigation and top dress with vermicompost as scheduled.",
        spokenAdvice: isGardener
          ? "Your plant foliage is vibrant and healthy! No treatment needed."
          : "Your wheat crop foliage is healthy and vigorous! No chemical spray needed.",
        imageUri: sample.image,
      };
      setDiagnosis(healthyDiag);
      speakText(healthyDiag.spokenAdvice, currentLanguage);
      soundEffects.success();
    }
  };

  const runDiagnosis = async (imgBase64: string, cropOverride?: string) => {
    setIsLoading(true);
    setDiagnosis(null);

    try {
      const result = await diagnoseCropImage({
        imageBase64: imgBase64,
        cropName: cropOverride || cropName,
        language: currentLanguage,
        role: currentRole,
      });
      setDiagnosis(result);
      soundEffects.success();

      // Automatically speak diagnosis summary
      speakText(result.spokenAdvice, currentLanguage);
    } catch (err) {
      console.error("Diagnosis failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (colorStatus: string) => {
    if (colorStatus === "green") return { bg: "bg-emerald-50 border-emerald-400 text-emerald-950", badge: "bg-emerald-600 text-white", icon: CheckCircle2 };
    if (colorStatus === "red") return { bg: "bg-rose-50 border-rose-400 text-rose-950", badge: "bg-rose-600 text-white", icon: ShieldAlert };
    return { bg: "bg-amber-50 border-amber-400 text-amber-950", badge: "bg-amber-600 text-white", icon: AlertTriangle };
  };

  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto px-3 sm:px-4 pt-3">
      {/* Top Bar with Back Button */}
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
          <span className="text-xl">📸</span>
          <h2 className="font-black text-lg text-stone-900">Crop Health & Disease AI</h2>
        </div>

        <AudioButton
          textToSpeak="Take a clear photo of the infected leaf or choose from the sample photos below to diagnose crop diseases."
          language={currentLanguage}
          size="sm"
        />
      </div>

      {/* Camera Capture & Upload Card */}
      <div className="bg-white rounded-3xl border-2 border-dashed border-emerald-400 p-4 sm:p-6 text-center space-y-4 shadow-xs">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageFile}
          className="hidden"
          id="disease-view-file-input"
        />

        {selectedImage ? (
          <div className="relative rounded-2xl overflow-hidden max-h-64 sm:max-h-72 border-2 border-emerald-300 shadow-sm mx-auto">
            <img
              src={selectedImage}
              alt="Inspected crop leaf"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => {
                soundEffects.camera();
                fileInputRef.current?.click();
              }}
              className="absolute bottom-3 right-3 px-3 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-900 text-white font-bold text-xs backdrop-blur-sm flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <RotateCcw size={14} />
              <span>Retake Photo</span>
            </button>
          </div>
        ) : (
          <div className="py-6 space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs animate-pulse">
              <Camera size={42} />
            </div>
            <div>
              <h3 className="font-black text-lg text-stone-900">Show us the Leaf or Pest</h3>
              <p className="text-xs font-semibold text-stone-700 max-w-xs mx-auto mt-1">
                Take a close-up photo in sunlight. Gemini AI will diagnose disease, organic cures, and spray dosages.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            id="camera-snap-leaf-btn"
            type="button"
            onClick={() => {
              soundEffects.camera();
              fileInputRef.current?.click();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Camera size={20} />
            <span>{selectedImage ? "Take Another Photo" : "Open Camera / Gallery"}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-6 rounded-3xl bg-white border-2 border-emerald-300 shadow-sm text-center space-y-3">
          <div className="relative flex items-center justify-center mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
            <div className="relative w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-300 p-2 flex items-center justify-center shadow-xs">
              <AgriVisionLogo size={36} animated={true} />
            </div>
          </div>
          <h4 className="font-black text-base text-emerald-950">Analyzing Leaf Pathology...</h4>
          <p className="text-xs font-semibold text-stone-700">
            Checking against 10,000+ agricultural disease patterns with Gemini 3.7 Flash...
          </p>
        </div>
      )}

      {/* Diagnosis Results Card */}
      {diagnosis && !isLoading && (
        <div
          id="disease-diagnosis-result-card"
          className={`p-5 rounded-3xl border-2 ${
            getStatusColor(diagnosis.colorStatus).bg
          } shadow-md space-y-4 animate-in fade-in zoom-in-95 duration-200`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                getStatusColor(diagnosis.colorStatus).badge
              }`}>
                {diagnosis.isHealthy ? "Healthy" : `${diagnosis.severity} Risk`}
              </span>
              <span className="text-xs font-bold text-stone-700">
                {diagnosis.confidence}% Confidence
              </span>
            </div>
            <AudioButton
              textToSpeak={diagnosis.spokenAdvice}
              language={currentLanguage}
              size="sm"
            />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
              {diagnosis.diseaseName}
            </h3>
            <div className="text-xs font-extrabold text-stone-700 mt-0.5">
              {diagnosis.commonName}
            </div>
          </div>

          {/* Spoken Advice Callout */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-black/10 text-xs font-medium text-stone-800 leading-relaxed flex items-start gap-2">
            <span className="text-base">📢</span>
            <p className="font-semibold">{diagnosis.spokenAdvice}</p>
          </div>

          {/* Treatment Breakdown Grid */}
          <div className="space-y-2.5 pt-1">
            {/* Organic Treatment */}
            <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                <span>🌱</span>
                <span>Organic & Natural Remedy (जैविक उपाय)</span>
              </div>
              <p className="text-xs font-medium text-stone-700 leading-relaxed">
                {diagnosis.organicRemedy}
              </p>
            </div>

            {/* Chemical / Garden Alternative Treatment */}
            {!diagnosis.isHealthy && (
              <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                  <span>🧪</span>
                  <span>
                    {isGardener
                      ? "Gentle Garden / Mild Solution (सुरक्षित विकल्प)"
                      : "Recommended Chemical Spray (कीटनाशक / फफूंदनाशक)"}
                  </span>
                </div>
                <p className="text-xs font-medium text-stone-700 leading-relaxed">
                  {diagnosis.chemicalTreatment}
                </p>
              </div>
            )}

            {/* Preventive Action */}
            <div className="p-3.5 rounded-2xl bg-white border border-sky-200 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-sky-950">
                <span>🛡️</span>
                <span>
                  {isGardener ? "Balcony Care & Prevention (पौधों की देखभाल)" : "Field Prevention (भविष्य की रोकथाम)"}
                </span>
              </div>
              <p className="text-xs font-medium text-stone-700 leading-relaxed">
                {diagnosis.preventiveAction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Test Sample Gallery */}
      <div className="space-y-2.5 pt-2">
        <h4 className="font-black text-sm text-stone-900 flex items-center gap-1.5">
          <span>🧪</span>
          <span>Or Tap a Sample Leaf to Test AI:</span>
        </h4>

        <div className="grid grid-cols-3 gap-2.5">
          {SAMPLE_DISEASE_CARDS.map((sample, idx) => {
            const isSelected = selectedImage === sample.image;
            const displayCrop = isGardener
              ? sample.crop === "Tomato"
                ? "Tomato Pot"
                : sample.crop.includes("Cucurbit")
                ? "Rose / Creeper"
                : "Mint / Tulsi"
              : sample.crop;

            const displayTitle = isGardener
              ? sample.title.includes("Blight")
                ? "Leaf Spot"
                : sample.title.includes("Mildew")
                ? "White Mildew"
                : "Healthy Leaf"
              : sample.title.includes("Blight")
              ? "Leaf Blight"
              : sample.title.includes("Mildew")
              ? "Powdery Mildew"
              : "Healthy Wheat";

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`p-2 rounded-2xl bg-white hover:bg-emerald-50 border shadow-xs flex flex-col items-center text-center transition-all active:scale-95 relative overflow-hidden ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-500 bg-emerald-50/60"
                    : "border-stone-200"
                }`}
              >
                <img
                  src={sample.image}
                  alt={sample.title}
                  className="w-full h-16 sm:h-20 rounded-xl object-cover mb-1.5 border border-stone-200 bg-stone-900"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      sample.crop === "Tomato"
                        ? TOMATO_LEAF_BLIGHT_SVG
                        : sample.crop.includes("Cucurbit")
                        ? POWDERY_MILDEW_SVG
                        : HEALTHY_WHEAT_SVG;
                  }}
                />
                <span className="text-[11px] font-black text-stone-900 line-clamp-1">
                  {displayCrop}
                </span>
                <span className="text-[9px] font-semibold text-stone-700 line-clamp-1">
                  {displayTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
