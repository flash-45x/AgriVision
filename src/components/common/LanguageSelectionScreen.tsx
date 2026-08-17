import React, { useState } from "react";
import { Globe, Check, ArrowRight, Volume2, Sparkles, X } from "lucide-react";
import { LanguageCode } from "../../types";
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from "../../data/translations";
import { soundEffects, speakText, stopSpeaking } from "../../utils/audio";
import { AgriVisionLogo } from "./AgriVisionLogo";

// Distinct visual palette for language script badges
const LANGUAGE_BADGE_CONFIG: Record<
  LanguageCode,
  {
    scriptChar: string;
    badgeBg: string;
    badgeText: string;
    cardBorderHover: string;
  }
> = {
  hi: {
    scriptChar: "क",
    badgeBg: "bg-amber-500",
    badgeText: "text-white",
    cardBorderHover: "hover:border-amber-400",
  },
  en: {
    scriptChar: "A",
    badgeBg: "bg-emerald-600",
    badgeText: "text-white",
    cardBorderHover: "hover:border-emerald-400",
  },
  te: {
    scriptChar: "అ",
    badgeBg: "bg-blue-600",
    badgeText: "text-white",
    cardBorderHover: "hover:border-blue-400",
  },
  ta: {
    scriptChar: "த",
    badgeBg: "bg-rose-500",
    badgeText: "text-white",
    cardBorderHover: "hover:border-rose-400",
  },
  mr: {
    scriptChar: "म",
    badgeBg: "bg-orange-500",
    badgeText: "text-white",
    cardBorderHover: "hover:border-orange-400",
  },
  pa: {
    scriptChar: "ੳ",
    badgeBg: "bg-yellow-500",
    badgeText: "text-stone-900",
    cardBorderHover: "hover:border-yellow-400",
  },
  bn: {
    scriptChar: "ব",
    badgeBg: "bg-teal-600",
    badgeText: "text-white",
    cardBorderHover: "hover:border-teal-400",
  },
  kn: {
    scriptChar: "ಕ",
    badgeBg: "bg-purple-600",
    badgeText: "text-white",
    cardBorderHover: "hover:border-purple-400",
  },
  gu: {
    scriptChar: "ગ",
    badgeBg: "bg-pink-600",
    badgeText: "text-white",
    cardBorderHover: "hover:border-pink-400",
  },
};

interface LanguageSelectionScreenProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onContinue?: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  currentLanguage,
  onSelectLanguage,
  onContinue,
  onClose,
  isModal = false,
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(currentLanguage);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.en;

  const handleLanguageClick = (langCode: LanguageCode) => {
    soundEffects.click();
    setSelectedLang(langCode);
    onSelectLanguage(langCode);

    // Play native spoken greeting in chosen language
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    if (langObj) {
      speakText(langObj.greeting, langCode);
    }
  };

  const handleReadAloudHeader = () => {
    soundEffects.click();
    const prompt =
      selectedLang === "hi"
        ? "अपनी पसंदीदा भाषा चुनें। पूरी ऐप और आवाज़ इसी भाषा में काम करेगी।"
        : selectedLang === "te"
        ? "దయచేసి మీ భాషను ఎంచుకోండి. యాప్ మరియు వాయిస్ మొత్తం మారతాయి."
        : selectedLang === "ta"
        ? "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும். ஆப் முழுவதும் மாற்றப்படும்."
        : "Choose your language. AgriVision will localize text, voice, and AI responses.";
    speakText(prompt, selectedLang);
  };

  const handleConfirm = () => {
    soundEffects.success();
    stopSpeaking();
    onSelectLanguage(selectedLang);
    if (onContinue) {
      onContinue();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div
      id="language-selection-screen"
      className={`${
        isModal
          ? "w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-stone-200 p-5 sm:p-7 relative max-h-[90vh] overflow-y-auto"
          : "min-h-screen bg-stone-100 text-stone-900 flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto w-full"
      }`}
    >
      {/* Top Header Row with Title, Globe Icon & Read-Aloud button */}
      <div className="w-full pt-1 sm:pt-2">
        {/* Brand Bar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/80">
          <div className="flex items-center gap-2">
            <AgriVisionLogo size={28} />
            <span className="font-extrabold text-base tracking-tight text-emerald-950">
              Agri<span className="text-emerald-600">Vision</span>
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Language Engine
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <Globe size={20} className="text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-tight">
                {t.selectLanguage || "Choose Your Language"}
              </h1>
              <span className="text-[11px] font-bold text-stone-700">
                {t.tagline || "Your Personal AI Farming Companion"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleReadAloudHeader}
              title="Listen to Instructions"
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all active:scale-95 flex items-center justify-center"
            >
              <Volume2 size={18} />
            </button>
            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all active:scale-95"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Informative Subtext Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-2.5 sm:p-3 mb-4 flex items-center gap-2.5 text-xs text-emerald-950 font-bold">
          <Sparkles size={16} className="text-emerald-600 shrink-0" />
          <span>
            {selectedLang === "hi"
              ? "भाषा बदलते ही स्क्रीन, एआई सलाह, आवाज और मंडी भाव तुरंत बदल जाएंगे।"
              : selectedLang === "te"
              ? "భాష ఎంచుకోగానే మొత్తం స్క్రీన్లు, AI సమాధానాలు మరియు వాయిస్ మారతాయి."
              : selectedLang === "ta"
              ? "மொழி தேர்வானதும் அனைத்து திரைகள், குரல் மற்றும் AI உடனடியாக மாறும்."
              : "Selection instantly localizes UI text, Voice Narration, and AI responses."}
          </span>
        </div>

        {/* 2-Cards Per Row Grid */}
        <div
          id="languages-grid-2col"
          className="grid grid-cols-2 gap-3 sm:gap-3.5 my-2"
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            const config = LANGUAGE_BADGE_CONFIG[lang.code] || {
              scriptChar: lang.flagOrScript,
              badgeBg: "bg-emerald-600",
              badgeText: "text-white",
              cardBorderHover: "hover:border-emerald-300",
            };

            return (
              <button
                key={lang.code}
                id={`lang-card-${lang.code}`}
                type="button"
                onClick={() => handleLanguageClick(lang.code)}
                className={`relative p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all duration-200 active:scale-96 min-h-[120px] sm:min-h-[130px] group ${
                  isSelected
                    ? "bg-emerald-700 text-white border-emerald-800 shadow-lg ring-2 ring-emerald-400 ring-offset-2"
                    : `bg-white text-stone-900 border-stone-200 hover:bg-stone-50 ${config.cardBorderHover} shadow-xs`
                }`}
              >
                {/* Selected Checkmark Badge (Top Right) */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-150">
                    <Check size={12} className="stroke-[3.5]" />
                  </div>
                )}

                {/* Circular Regional Script Badge */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl mb-2 transition-transform group-hover:scale-105 shadow-xs ${
                    isSelected
                      ? "bg-white text-emerald-800 shadow-md ring-2 ring-white/50"
                      : `${config.badgeBg} ${config.badgeText}`
                  }`}
                >
                  <span>{config.scriptChar}</span>
                </div>

                {/* Native Script Name (Large, Bold) */}
                <span
                  className={`font-black text-base sm:text-lg leading-tight tracking-tight ${
                    isSelected ? "text-white" : "text-stone-900"
                  }`}
                >
                  {lang.nativeName}
                </span>

                {/* English Transliteration */}
                <span
                  className={`text-xs font-semibold mt-0.5 ${
                    isSelected ? "text-emerald-100" : "text-stone-700"
                  }`}
                >
                  {lang.englishName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Action / Continue Button */}
      <div className="w-full pt-4 sm:pt-6 pb-2">
        <button
          id="language-confirm-continue-btn"
          type="button"
          onClick={handleConfirm}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg shadow-xl shadow-emerald-950/20 active:scale-98 transition-all flex items-center justify-center gap-2.5"
        >
          <span>{t.common?.next || t.common?.confirm || t.getStarted || "Continue"}</span>
          <ArrowRight size={22} className="stroke-[3]" />
        </button>

        {/* Sub-label showing current selection in selected script */}
        <p className="text-center text-[11px] font-bold text-stone-700 mt-2">
          {selectedLang === "hi"
            ? "चुनी हुई भाषा: हिंदी (Hindi)"
            : selectedLang === "te"
            ? "ఎంచుకున్న భాష: తెలుగు (Telugu)"
            : selectedLang === "ta"
            ? "தேர்ந்தெடுக்கப்பட்ட மொழி: தமிழ் (Tamil)"
            : selectedLang === "mr"
            ? "निवडलेली भाषा: मराठी (Marathi)"
            : selectedLang === "pa"
            ? "ਚੁਣੀ ਹੋਈ ਭਾਸ਼ਾ: ਪੰਜਾਬੀ (Punjabi)"
            : selectedLang === "bn"
            ? "নির্বাচিত ভাষা: বাংলা (Bengali)"
            : selectedLang === "kn"
            ? "ಆಯ್ಕೆಮಾಡಿದ ಭಾಷೆ: ಕನ್ನಡ (Kannada)"
            : selectedLang === "gu"
            ? "પસંદ કરેલી ભાષા: ગુજરાતી (Gujarati)"
            : "Selected Language: English"}
        </p>
      </div>
    </div>
  );
};
