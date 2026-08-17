import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Bell, Volume2, VolumeX, Sliders, Globe, Check, ShieldCheck, Database, Smartphone, Save } from "lucide-react";
import { LanguageCode } from "../../types";
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from "../../data/translations";
import { soundEffects } from "../../utils/audio";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Preferences state
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [marketAlerts, setMarketAlerts] = useState(true);
  const [iotAlerts, setIotAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unitSystem, setUnitSystem] = useState<"metric" | "traditional">("metric");
  const [lowDataMode, setLowDataMode] = useState(false);
  const [offlineSync, setOfflineSync] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem("agrivision_app_settings");
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.weatherAlerts !== undefined) setWeatherAlerts(parsed.weatherAlerts);
        if (parsed.marketAlerts !== undefined) setMarketAlerts(parsed.marketAlerts);
        if (parsed.iotAlerts !== undefined) setIotAlerts(parsed.iotAlerts);
        if (parsed.soundEnabled !== undefined) setSoundEnabled(parsed.soundEnabled);
        if (parsed.unitSystem) setUnitSystem(parsed.unitSystem);
        if (parsed.lowDataMode !== undefined) setLowDataMode(parsed.lowDataMode);
        if (parsed.offlineSync !== undefined) setOfflineSync(parsed.offlineSync);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    soundEffects.click();
    const settings = {
      weatherAlerts,
      marketAlerts,
      iotAlerts,
      soundEnabled,
      unitSystem,
      lowDataMode,
      offlineSync,
    };
    localStorage.setItem("agrivision_app_settings", JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return createPortal(
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEffects.click();
          onClose();
        }
      }}
    >
      <div
        id="settings-modal-content"
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400">
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                {currentLanguage === "hi" ? "ऐप सेटिंग्स (Settings)" : "App Preferences & Settings"}
              </h2>
              <p className="text-xs text-stone-300 font-medium">
                {currentLanguage === "hi"
                  ? "सूचनाएं, ध्वनियां, भाषा और इकाइयां"
                  : "Notifications, audio, language & units"}
              </p>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            type="button"
            onClick={() => {
              soundEffects.click();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {/* Section 1: Notifications & Alerts */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
              <Bell size={14} className="text-emerald-700" />
              <span>{currentLanguage === "hi" ? "अलर्ट एवं सूचनाएं (Notifications)" : "Alerts & Notifications"}</span>
            </div>
            <div className="space-y-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {currentLanguage === "hi" ? "मौसम व बारिश चेतावनी" : "Severe Weather & Rain Alerts"}
                  </div>
                  <div className="text-[11px] text-stone-700">
                    {currentLanguage === "hi" ? "भारी बारिश और ओलावृष्टि अलर्ट" : "High-priority cyclone, frost & storm warnings"}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={weatherAlerts}
                  onChange={(e) => setWeatherAlerts(e.target.checked)}
                  className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer"
                />
              </label>

              <div className="border-t border-stone-200/80 my-1" />

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {currentLanguage === "hi" ? "दैनिक मंडी भाव अलर्ट" : "Daily Mandi Price Updates"}
                  </div>
                  <div className="text-[11px] text-stone-700">
                    {currentLanguage === "hi" ? "सुबह 9 बजे नजदीकी मंडी के ताज़ा भाव" : "Daily 9:00 AM wholesale crop price changes"}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={marketAlerts}
                  onChange={(e) => setMarketAlerts(e.target.checked)}
                  className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer"
                />
              </label>

              <div className="border-t border-stone-200/80 my-1" />

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {currentLanguage === "hi" ? "स्मार्ट सिंचाई व मोटर अलर्ट" : "IoT Sensor & Pump Threshold Alerts"}
                  </div>
                  <div className="text-[11px] text-stone-700">
                    {currentLanguage === "hi" ? "नमी कम होने या मोटर शुरू होने पर" : "Alert when soil moisture drops below 30%"}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={iotAlerts}
                  onChange={(e) => setIotAlerts(e.target.checked)}
                  className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 2: Audio & Feedback */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
              <Volume2 size={14} className="text-emerald-700" />
              <span>{currentLanguage === "hi" ? "ध्वनि एवं स्पर्श प्रतिक्रिया" : "Audio & Haptic Feedback"}</span>
            </div>
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <div className="flex items-center gap-2.5">
                  {soundEnabled ? <Volume2 size={18} className="text-emerald-700" /> : <VolumeX size={18} className="text-stone-700" />}
                  <div>
                    <div className="text-xs font-bold text-stone-900">
                      {currentLanguage === "hi" ? "बटन एवं क्रिया ध्वनि प्रभाव" : "Button Click & Action Chimes"}
                    </div>
                    <div className="text-[11px] text-stone-700">
                      {currentLanguage === "hi" ? "बटन दबाने और स्कैन पर सुखद आवाज़" : "Audible feedback for accessible tapping"}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Measurement Units */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
              <Smartphone size={14} className="text-emerald-700" />
              <span>{currentLanguage === "hi" ? "माप इकाइयां (Units of Measure)" : "Units & Measurement"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setUnitSystem("metric");
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  unitSystem === "metric"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400/30"
                    : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                <div className="text-xs font-black">Metric Standard</div>
                <div className="text-[10px] text-stone-700 mt-0.5">Acres, °Celsius, Quintal / Kg</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setUnitSystem("traditional");
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  unitSystem === "traditional"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400/30"
                    : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                <div className="text-xs font-black">Regional Units</div>
                <div className="text-[10px] text-stone-700 mt-0.5">Bigha / Guntha, Man / Maund</div>
              </button>
            </div>
          </div>

          {/* Section 4: Data & Offline Sync */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
              <Database size={14} className="text-emerald-700" />
              <span>{currentLanguage === "hi" ? "डेटा एवं ऑफ़लाइन मोड" : "Data Usage & Offline Sync"}</span>
            </div>
            <div className="space-y-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {currentLanguage === "hi" ? "कम डेटा खपत मोड (Low Data Mode)" : "Low Data & Fast Photo Compress"}
                  </div>
                  <div className="text-[11px] text-stone-700">
                    {currentLanguage === "hi" ? "धीमे 2G/3G नेटवर्क पर तेज़ अपलोड" : "Optimizes camera images for rural 2G/3G connectivity"}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={lowDataMode}
                  onChange={(e) => setLowDataMode(e.target.checked)}
                  className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer"
                />
              </label>

              <div className="border-t border-stone-200/80 my-1" />

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {currentLanguage === "hi" ? "ऑफ़लाइन ज्ञान बैंक (Offline Cache)" : "Offline Advisory Cache"}
                  </div>
                  <div className="text-[11px] text-stone-700">
                    {currentLanguage === "hi" ? "इंटरनेट न होने पर भी रोग गाइड देखें" : "Keep pest treatment guides accessible without internet"}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={offlineSync}
                  onChange={(e) => setOfflineSync(e.target.checked)}
                  className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-3">
          <button
            id="save-settings-btn"
            type="button"
            onClick={handleSave}
            className={`flex-1 py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 text-white ${
              savedSuccess
                ? "bg-emerald-800 shadow-emerald-900/30"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20"
            }`}
          >
            {savedSuccess ? (
              <>
                <Check size={18} className="stroke-[3]" />
                <span>{currentLanguage === "hi" ? "सेटिंग्स सहेजी गईं!" : "Preferences Saved!"}</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{currentLanguage === "hi" ? "प्राथमिकताएं सहेजें" : "Save Preferences"}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              onClose();
            }}
            className="py-3.5 px-4 rounded-2xl border border-stone-300 hover:bg-stone-200 text-stone-700 font-bold text-sm transition-all"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
