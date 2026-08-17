import React, { useState } from "react";
import {
  X,
  QrCode,
  Copy,
  Check,
  Share2,
  UserPlus,
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { LanguageCode } from "../../types";
import { soundEffects, speakText } from "../../utils/audio";
import { AudioButton } from "../common/AudioButton";

interface FpoInviteModalProps {
  currentLanguage: LanguageCode;
  inviteCode: string;
  orgName: string;
  onClose: () => void;
  onAddManualMember: (member: {
    name: string;
    phone: string;
    village: string;
    landSizeAcres: number;
    primaryCrop: string;
  }) => void;
}

export const FpoInviteModal: React.FC<FpoInviteModalProps> = ({
  currentLanguage,
  inviteCode,
  orgName,
  onClose,
  onAddManualMember,
}) => {
  const [activeTab, setActiveTab] = useState<"qr" | "manual">("qr");
  const [copied, setCopied] = useState(false);

  // Manual Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("Gram Pipliya");
  const [acres, setAcres] = useState("3.5");
  const [crop, setCrop] = useState("Wheat");
  const [manualSuccess, setManualSuccess] = useState(false);

  const handleCopyCode = () => {
    soundEffects.success();
    navigator.clipboard?.writeText(inviteCode);
    setCopied(true);
    speakText(`Invite code ${inviteCode} copied to clipboard`, currentLanguage);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    soundEffects.click();
    const shareText = `Join ${orgName} on AgriVision! Use FPO Link Code: ${inviteCode} or scan the onboarding QR Code to link your farm for advisory & MSP linkage.`;
    if (navigator.share) {
      navigator.share({
        title: `Join ${orgName}`,
        text: shareText,
      }).catch(() => {});
    } else {
      handleCopyCode();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundEffects.success();
    onAddManualMember({
      name: name.trim(),
      phone: phone.trim() || "+91 98765 00000",
      village: village.trim(),
      landSizeAcres: parseFloat(acres) || 3.0,
      primaryCrop: crop,
    });
    setManualSuccess(true);
    speakText(`Farmer ${name} successfully enrolled in FPO registry`, currentLanguage);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">Add / Invite Farmers</h3>
              <p className="text-xs text-indigo-200">{orgName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector: QR Code vs Manual Add */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 flex gap-2">
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              setActiveTab("qr");
            }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "qr"
                ? "bg-white text-indigo-950 shadow-xs border border-stone-300"
                : "text-stone-700 hover:text-stone-900"
            }`}
          >
            <QrCode size={16} />
            <span>FPO QR / Invite Code</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              setActiveTab("manual");
            }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "manual"
                ? "bg-white text-indigo-950 shadow-xs border border-stone-300"
                : "text-stone-700 hover:text-stone-900"
            }`}
          >
            <UserPlus size={16} />
            <span>Manual Enrollment</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-stone-900">
          {activeTab === "qr" ? (
            <div className="space-y-4 text-center">
              <div>
                <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block">
                  Self-Service Farmer Onboarding
                </span>
                <h4 className="text-base font-black text-stone-900">
                  Scan QR Code to Auto-Link Account
                </h4>
                <p className="text-xs font-semibold text-stone-700 mt-0.5">
                  Farmers scan this during their initial app onboarding to link their farm to your FPO.
                </p>
              </div>

              {/* Dynamic Simulated High-Contrast QR Code Card */}
              <div className="p-5 rounded-3xl bg-indigo-50/70 border-2 border-indigo-300 inline-block mx-auto shadow-sm">
                <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-2xl p-3.5 mx-auto border-2 border-indigo-900 shadow-inner flex flex-col items-center justify-between">
                  {/* Styled QR Matrix pattern visualization */}
                  <div className="w-full h-full bg-stone-950 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between">
                      <div className="w-10 h-10 border-4 border-white bg-indigo-600 rounded-sm" />
                      <div className="w-10 h-10 border-4 border-white bg-indigo-600 rounded-sm" />
                    </div>
                    <div className="flex items-center justify-center py-2">
                      <div className="px-2 py-1 rounded bg-white text-indigo-950 font-black text-[10px] tracking-widest uppercase">
                        AGRI-FPO
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-10 h-10 border-4 border-white bg-indigo-600 rounded-sm" />
                      <div className="w-6 h-6 bg-emerald-400 rounded-xs" />
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] font-black uppercase text-stone-700 tracking-wider block">
                    FPO Unique Linking Code
                  </span>
                  <span className="text-xl font-black font-mono text-indigo-950 tracking-wider select-all">
                    {inviteCode}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex-1 py-3 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-black text-xs border border-indigo-300 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                  <span>{copied ? "Code Copied!" : "Copy Code"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  <span>Share QR / Link</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-3.5">
              <div>
                <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block">
                  Desk Registry Entry
                </span>
                <h4 className="text-base font-black text-stone-900">
                  Register Farmer Directly
                </h4>
                <p className="text-xs font-semibold text-stone-700 mt-0.5">
                  Enter farmer details to manually link their records and land registry to your FPO.
                </p>
              </div>

              {manualSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                  <span className="text-xs font-black">
                    Farmer successfully added to active roster!
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-black text-stone-700">Farmer Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bherulal Ji Chouhan"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-sm text-stone-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-stone-700">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98221 54312"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-sm text-stone-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-black text-stone-700">Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-sm text-stone-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-stone-700">Landholding (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-sm text-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-stone-700">Primary Crop</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-sm text-stone-900 bg-white"
                >
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Gram (Chana)">Gram / Chana (चना)</option>
                  <option value="Garlic">Garlic (लहसुन)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus size={18} />
                <span>Save to FPO Member Registry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
