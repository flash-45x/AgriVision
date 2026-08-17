import React, { useState } from "react";
import {
  X,
  Phone,
  MessageSquare,
  MapPin,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  Droplets,
  Calendar,
  Trash2,
  CheckCircle2,
  Lock,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import { FpoFarmerMember, LanguageCode } from "../../types";
import { soundEffects, speakText } from "../../utils/audio";
import { AudioButton } from "../common/AudioButton";

interface FpoMemberProfileModalProps {
  member: FpoFarmerMember;
  currentLanguage: LanguageCode;
  onClose: () => void;
  onRemoveMember: (id: string) => void;
  onSendAlert: (member: FpoFarmerMember) => void;
}

export const FpoMemberProfileModal: React.FC<FpoMemberProfileModalProps> = ({
  member,
  currentLanguage,
  onClose,
  onRemoveMember,
  onSendAlert,
}) => {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const getRiskColorClass = (level: string) => {
    switch (level) {
      case "High":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "Medium":
        return "bg-amber-100 text-amber-900 border-amber-300";
      default:
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
    }
  };

  const handleCall = () => {
    soundEffects.click();
    window.location.href = `tel:${member.phone.replace(/[^0-9+]/g, "")}`;
  };

  const handleSendDirectSms = () => {
    soundEffects.success();
    setSmsSent(true);
    speakText(`Direct SMS notification dispatched to ${member.name}`, currentLanguage);
    setTimeout(() => setSmsSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl font-bold backdrop-blur-xs">
              {member.avatarIcon || "🌾"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black">{member.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-emerald-950">
                  {member.isActive ? "Active Member" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-indigo-200 flex items-center gap-1 mt-0.5">
                <MapPin size={12} />
                <span>{member.village} • Joined {member.joinDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton
              textToSpeak={`Farmer Profile: ${member.name} from ${member.village}. Cultivates ${member.landSizeAcres} acres with primary crop ${member.primaryCrop}. Farm risk score is ${member.farmRiskScore} out of 100.`}
              language={currentLanguage}
              size="sm"
            />
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
        </div>

        {/* Scrollable Profile Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-stone-900">
          {/* Data Privacy / Consent Badge */}
          <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-2">
            <Lock size={14} className="text-indigo-700 shrink-0 mt-0.5" />
            <p className="text-[11px] font-semibold text-indigo-950 leading-relaxed">
              <strong>FPO Data Consent:</strong> Aggregated agronomy and IoT telemetry shared under verified farmer membership agreement #FPO-{member.id.toUpperCase()}.
            </p>
          </div>

          {/* Farm Risk Score Banner */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black text-stone-700 uppercase tracking-wider block">
                Aggregated Farm Risk Score
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-stone-900">{member.farmRiskScore}</span>
                <span className="text-xs font-bold text-stone-700">/ 100</span>
                <span
                  className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-black border ${getRiskColorClass(
                    member.riskLevel
                  )}`}
                >
                  {member.riskLevel} Risk
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-stone-700 block">Total Landholding</span>
              <span className="text-base font-black text-indigo-950">{member.landSizeAcres} Acres</span>
            </div>
          </div>

          {/* Active Alert Banner if any */}
          {member.hasActiveAlert && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-start gap-3">
              <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="text-xs font-black text-rose-950 uppercase tracking-tight">
                  Active Field Alert Flagged
                </h4>
                <p className="text-xs font-bold text-rose-900 mt-0.5">
                  {member.alertDetails || "High pest or moisture vulnerability detected in field."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSendAlert(member)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs active:scale-95 transition-all"
              >
                Send Fix
              </button>
            </div>
          )}

          {/* Key Farming Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-black text-stone-700 uppercase block">Crops Cultivated</span>
              <span className="text-sm font-black text-stone-900 block mt-0.5">
                {member.primaryCrop} {member.secondaryCrop ? `& ${member.secondaryCrop}` : ""}
              </span>
              <span className="text-[10px] font-semibold text-stone-700">Rabi & Kharif Cycles</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-black text-stone-700 uppercase block">Smart IoT Sensor</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Cpu size={14} className="text-indigo-600" />
                <span className="text-xs font-black text-stone-900">{member.iotKitStatus}</span>
              </div>
              <span className="text-[10px] font-semibold text-stone-700">
                Moisture: {member.lastMoisturePercent ? `${member.lastMoisturePercent}%` : "N/A"}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-black text-stone-700 uppercase block">PM-KISAN Status</span>
              <span className="text-xs font-black text-emerald-900 block mt-0.5">
                {member.pmKisanStatus}
              </span>
              <span className="text-[10px] font-semibold text-stone-700">Direct Benefit Transfer</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-black text-stone-700 uppercase block">Soil Health Card</span>
              <span className="text-xs font-black text-stone-900 block mt-0.5">
                {member.soilHealthCardStatus}
              </span>
              <span className="text-[10px] font-semibold text-stone-700">NPK Micro-testing</span>
            </div>
          </div>

          {/* Recent Activity Log */}
          {member.recentActivity && (
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-black text-stone-700 uppercase block">
                Recent Farmer Activity
              </span>
              <p className="text-xs font-semibold text-stone-800">
                "{member.recentActivity}"
              </p>
            </div>
          )}

          {/* Direct Communication Quick Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleCall}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              <span>Call Farmer ({member.phone.slice(-4)})</span>
            </button>

            <button
              type="button"
              onClick={handleSendDirectSms}
              className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              <span>{smsSent ? "SMS Dispatched!" : "Send Advisory SMS"}</span>
            </button>
          </div>

          {/* Remove / Deactivate Section */}
          <div className="pt-2 border-t border-stone-200">
            {!showConfirmRemove ? (
              <button
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setShowConfirmRemove(true);
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Remove or Deactivate Member from FPO</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
                <p className="text-xs font-bold text-rose-950">
                  Are you sure you want to deactivate <strong>{member.name}</strong> from this FPO?
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      onRemoveMember(member.id);
                      onClose();
                    }}
                    className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-black text-xs shadow-xs active:scale-95"
                  >
                    Confirm Deactivation
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmRemove(false)}
                    className="px-3 py-1.5 rounded-xl bg-stone-200 text-stone-800 font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
