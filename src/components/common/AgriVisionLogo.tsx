import React from "react";

export type LogoVariant = "transparent" | "solid-white" | "solid-dark" | "monochrome-white";
export type LogoPresetSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "hero";

interface AgriVisionLogoProps {
  size?: number | LogoPresetSize;
  variant?: LogoVariant;
  showText?: boolean;
  textClassName?: string;
  className?: string;
  animated?: boolean;
  subText?: string;
  id?: string;
}

const SIZE_MAP: Record<LogoPresetSize, number> = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
  "2xl": 96,
  hero: 120,
};

export const AgriVisionLogo: React.FC<AgriVisionLogoProps> = ({
  size = "md",
  variant = "transparent",
  showText = false,
  textClassName = "",
  className = "",
  animated = false,
  subText,
  id = "agrivision-logo",
}) => {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] || 36;

  // Exact reproduction of the uploaded AgriVision brand logo
  const svgContent = (
    <svg
      viewBox="0 0 500 500"
      width={pixelSize}
      height={pixelSize}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${animated ? "animate-pulse" : ""} transition-transform`}
      style={{ aspectRatio: "1/1" }}
    >
      <g transform="translate(0, -10)">
        {/* 1. TOP SPROUT LEAVES */}
        {/* Left Leaf (Dark Forest Green) */}
        <path
          d="M 240,165 C 220,160 195,145 195,125 C 195,100 235,105 240,165 Z"
          fill="#1e6b3c"
        />

        {/* Center Leaf (Medium Deep Green) */}
        <path
          d="M 248,165 C 235,140 220,95 242,75 C 258,95 258,135 248,165 Z"
          fill="#2e7d43"
        />

        {/* Right Leaf Base (Lime/Vibrant Green) */}
        <path
          d="M 246,165 C 255,140 285,100 305,108 C 315,128 290,158 246,165 Z"
          fill="#7ac143"
        />
        {/* Right Leaf Inner Highlight Curve */}
        <path
          d="M 246,165 C 265,145 285,115 305,108 C 295,128 275,150 246,165 Z"
          fill="#88cf48"
        />

        {/* Central Sprout Stem */}
        <path
          d="M 247,192 C 248,175 247,155 246,145"
          stroke="#7ac143"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 2. OUTER GEAR / COG CRADLE (Deep Dark Teal/Green #0b3d36) */}
        <path
          d="M 135,205 
             L 165,200 
             C 175,260 210,300 250,300 
             C 290,300 325,260 335,200 
             L 365,205 
             L 363,230 
             L 345,236 
             C 342,252 334,268 322,282 
             L 339,298 
             L 318,318 
             L 298,306 
             C 283,316 267,322 250,324 
             L 250,344 
             L 220,344 
             L 220,324 
             C 203,322 187,316 172,306 
             L 152,318 
             L 131,298 
             L 148,282 
             C 136,268 128,252 125,236 
             L 107,230 
             L 105,205 
             Z"
          fill="#0b3d36"
        />

        {/* 3. INNER AGRICULTURAL HILL / FIELD SEMI-CIRCLE */}
        <g>
          {/* Base Dark Green Lower Furrow */}
          <path
            d="M 172,192 
               C 180,185 220,178 250,178 
               C 280,178 320,185 328,192 
               C 328,245 292,284 250,284 
               C 208,284 172,245 172,192 Z"
            fill="#145b32"
          />

          {/* Middle Green Furrow */}
          <path
            d="M 172,192 
               C 180,185 220,178 250,178 
               C 280,178 320,185 328,192 
               C 328,212 320,230 305,246 
               C 260,268 205,268 175,232 
               C 173,218 172,205 172,192 Z"
            fill="#3ea84b"
          />

          {/* Top Lime Green Layer */}
          <path
            d="M 172,192 
               C 180,185 220,178 250,178 
               C 280,178 320,185 328,192 
               C 328,198 326,204 322,210 
               C 275,230 220,232 178,212 
               C 174,205 172,198 172,192 Z"
            fill="#7ac143"
          />

          {/* White Curved Furrow Line 1 (Upper) */}
          <path
            d="M 176,214 
               C 220,234 275,232 324,210"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* White Curved Furrow Line 2 (Lower) */}
          <path
            d="M 188,248 
               C 226,275 272,274 312,248"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>
    </svg>
  );

  let wrappedIcon = svgContent;

  if (variant === "solid-white") {
    wrappedIcon = (
      <div
        className={`rounded-3xl bg-white shadow-xl border border-stone-200/80 flex items-center justify-center p-3 transition-transform hover:scale-105 ${className}`}
        style={{ width: pixelSize * 1.35, height: pixelSize * 1.35 }}
      >
        {svgContent}
      </div>
    );
  } else if (variant === "solid-dark") {
    wrappedIcon = (
      <div
        className={`rounded-3xl bg-stone-900 shadow-xl border border-stone-800 flex items-center justify-center p-3 transition-transform hover:scale-105 ${className}`}
        style={{ width: pixelSize * 1.35, height: pixelSize * 1.35 }}
      >
        {svgContent}
      </div>
    );
  }

  if (!showText) {
    return <div id={id} className={`inline-flex items-center justify-center shrink-0 ${className}`}>{wrappedIcon}</div>;
  }

  return (
    <div id={id} className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      {wrappedIcon}
      <div className="flex flex-col text-left">
        <span
          className={`font-black tracking-tight leading-none text-stone-900 ${textClassName || "text-lg sm:text-xl"}`}
        >
          Agri<span className="text-emerald-700">Vision</span>
        </span>
        {subText && (
          <span className="text-[10px] sm:text-[11px] font-bold text-stone-600 leading-tight mt-0.5">
            {subText}
          </span>
        )}
      </div>
    </div>
  );
};
