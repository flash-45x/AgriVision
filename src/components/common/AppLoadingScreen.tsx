import React from "react";
import { AgriVisionLogo } from "./AgriVisionLogo";

interface AppLoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullscreen?: boolean;
}

export const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({
  message = "Loading AgriVision...",
  subMessage = "Connecting rural intelligence network",
  fullscreen = true,
}) => {
  return (
    <div
      id="app-loading-screen"
      className={`${
        fullscreen
          ? "fixed inset-0 z-50 bg-stone-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white"
          : "w-full py-12 flex flex-col items-center justify-center text-stone-900"
      }`}
    >
      <div className="relative flex items-center justify-center mb-6">
        {/* Glowing background ripple */}
        <div className="absolute w-32 h-32 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
        <div className="absolute w-24 h-24 rounded-full bg-emerald-500/30 blur-xl pointer-events-none" />

        {/* Logo Card */}
        <div className="relative z-10 w-24 h-24 rounded-3xl bg-white shadow-2xl p-4 flex items-center justify-center border-2 border-emerald-400">
          <AgriVisionLogo size={64} animated={true} />
        </div>
      </div>

      <div className="text-center space-y-1.5 max-w-xs">
        <h3 className="text-lg font-black tracking-tight text-white drop-shadow-sm">
          {message}
        </h3>
        {subMessage && (
          <p className="text-xs font-semibold text-emerald-300/80">
            {subMessage}
          </p>
        )}
      </div>

      {/* Modern Pill Progress Bar */}
      <div className="w-48 h-1.5 bg-stone-800 rounded-full overflow-hidden mt-5">
        <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full animate-pulse w-3/4" />
      </div>
    </div>
  );
};
