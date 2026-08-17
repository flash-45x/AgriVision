import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { speakText, stopSpeaking, isSpeaking, soundEffects } from "../../utils/audio";
import { LanguageCode } from "../../types";

interface AudioButtonProps {
  textToSpeak: string;
  language?: LanguageCode;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
  id?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  textToSpeak,
  language = "en",
  className = "",
  size = "md",
  label,
  id,
}) => {
  const [playing, setPlaying] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.click();

    if (playing) {
      stopSpeaking();
      setPlaying(false);
    } else {
      setPlaying(true);
      speakText(
        textToSpeak,
        (language || "en") as LanguageCode,
        () => setPlaying(true),
        () => setPlaying(false)
      );
    }
  };


  const sizeClasses = {
    sm: "p-1.5 text-xs min-h-[36px]",
    md: "p-2 text-sm min-h-[44px]",
    lg: "p-3 text-base min-h-[48px]",
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26,
  };

  return (
    <button
      id={id || `audio-btn-${Math.random().toString(36).substr(2, 6)}`}
      type="button"
      onClick={handleClick}
      title="Tap to listen"
      aria-label="Listen audio"
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all active:scale-95 ${
        playing
          ? "bg-emerald-600 text-white shadow-md ring-4 ring-emerald-300 animate-pulse"
          : "bg-emerald-100/90 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
      } ${sizeClasses[size]} ${className}`}
    >
      {playing ? (
        <VolumeX size={iconSizes[size]} className="animate-spin text-white" />
      ) : (
        <Volume2 size={iconSizes[size]} className="text-emerald-800" />
      )}
      {label && <span className="font-semibold text-xs whitespace-nowrap">{label}</span>}
    </button>
  );
};
