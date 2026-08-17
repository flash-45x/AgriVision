import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  PhoneCall,
  ChevronRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { LanguageCode, MarketPriceItem } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";

interface MarketPricesViewProps {
  currentLanguage: LanguageCode;
  marketPrices: MarketPriceItem[];
  onBack: () => void;
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({
  currentLanguage,
  marketPrices,
  onBack,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [selectedCropId, setSelectedCropId] = useState<string>(marketPrices[0]?.id || "mp-1");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const selectedItem = marketPrices.find((m) => m.id === selectedCropId) || marketPrices[0];

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 max-w-3xl mx-auto px-3 sm:px-4 pt-3">
      {/* Top Header */}
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
          <span className="text-xl">📈</span>
          <h2 className="font-black text-lg text-stone-900">{t.farmer.marketPrices}</h2>
        </div>

        <AudioButton
          textToSpeak="Live Mandi market rates. Wheat price in Ujjain is 2,480 rupees per quintal, up 120 rupees. Best time to sell is within the next 4 to 7 days."
          language={currentLanguage}
          size="sm"
        />
      </div>

      {/* Hero Mandi Intelligence Banner */}
      {selectedItem && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-800 to-green-900 text-white shadow-md space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                {selectedItem.mandiName} • {selectedItem.distanceKm} km away
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                {selectedItem.cropName}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-black text-yellow-300 font-mono">
                ₹{selectedItem.currentPrice.toLocaleString()}
              </div>
              <span className="text-[11px] font-bold text-emerald-100">per {selectedItem.unit}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                selectedItem.trend === "up" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
              }`}
            >
              {selectedItem.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {selectedItem.priceChangePercent} (7 Days)
            </span>

            <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-bold backdrop-blur-xs text-white border border-white/20">
              💡 {selectedItem.advisory}
            </span>
          </div>
        </div>
      )}

      {/* Mandi Rates List */}
      <div className="space-y-3">
        <h3 className="font-black text-base text-stone-900 px-1">APMC Wholesale Mandi Rates</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {marketPrices.map((item) => {
            const isSelected = selectedCropId === item.id;
            const isUp = item.trend === "up";

            return (
              <div
                key={item.id}
                id={`market-card-${item.id}`}
                onClick={() => {
                  soundEffects.click();
                  setSelectedCropId(item.id);
                }}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500"
                    : "bg-white hover:bg-stone-50 border-stone-200 shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-2xs ${
                      isUp ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {item.cropName.includes("Wheat") && "🌾"}
                    {item.cropName.includes("Soybean") && "🌱"}
                    {item.cropName.includes("Cotton") && "☁️"}
                    {item.cropName.includes("Tomato") && "🍅"}
                    {item.cropName.includes("Mustard") && "🌼"}
                  </div>

                  <div>
                    <h4 className="font-black text-base text-stone-900">{item.cropName}</h4>
                    <div className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                      <MapPin size={11} />
                      <span>{item.mandiName}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-lg text-stone-900 font-mono">
                    ₹{item.currentPrice.toLocaleString()}
                  </div>
                  <div
                    className={`text-xs font-black flex items-center justify-end gap-0.5 ${
                      isUp ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>{item.priceChangePercent}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Buyer Connect Call Button */}
      <div className="p-4 rounded-3xl bg-stone-900 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400 text-stone-900 flex items-center justify-center font-bold">
            <PhoneCall size={20} />
          </div>
          <div>
            <div className="font-black text-sm text-white">Direct Mandi Commission Agent</div>
            <p className="text-xs text-stone-300">Guaranteed instant weighing & payment</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            alert("Connecting to Verified Mandi Trader: Shri Balaji Agro Traders (+91 734 251 9890)");
          }}
          className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-stone-950 font-black text-xs shadow-xs active:scale-95 transition-all"
        >
          Call Agent
        </button>
      </div>
    </div>
  );
};
