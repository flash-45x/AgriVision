import React from "react";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Building,
  ShieldCheck,
  Cpu,
  Droplets,
  Bug,
  CloudRain,
  ArrowRight,
  Megaphone,
  QrCode,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";
import { FpoAdminProfile, FpoFarmerMember, LanguageCode } from "../../types";
import { AudioButton } from "../common/AudioButton";
import { soundEffects } from "../../utils/audio";

interface FpoOverviewTabProps {
  fpoProfile: FpoAdminProfile;
  members: FpoFarmerMember[];
  currentLanguage: LanguageCode;
  onNavigateTab: (tabId: string) => void;
  onOpenInviteModal: () => void;
  onSelectMember: (member: FpoFarmerMember) => void;
}

export const FpoOverviewTab: React.FC<FpoOverviewTabProps> = ({
  fpoProfile,
  members,
  currentLanguage,
  onNavigateTab,
  onOpenInviteModal,
  onSelectMember,
}) => {
  // Compute dynamic stats
  const totalMembersCount = 342; // scaled realistic FPO total
  const activeMembersCount = 318;
  const inactiveCount = totalMembersCount - activeMembersCount;

  const lowRiskCount = 212; // ~62%
  const medRiskCount = 89; // ~26%
  const highRiskCount = 41; // ~12%

  const activeAlertsCount = 18;
  const highRiskFarmsSample = members.filter((m) => m.riskLevel === "High");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. FPO Verified Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-950 text-white shadow-md space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/15 text-white flex items-center justify-center text-3xl font-black backdrop-blur-xs border border-white/20">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black leading-tight">
                  {fpoProfile.organizationName}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-200 mt-1">
                <span className="flex items-center gap-1 font-semibold">
                  <MapPin size={13} />
                  {fpoProfile.serviceRegion}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px] border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck size={11} />
                  Verified • {fpoProfile.registrationNumber}
                </span>
              </div>
            </div>
          </div>

          <AudioButton
            textToSpeak={`Welcome to ${fpoProfile.organizationName} Admin Dashboard. 342 linked member farmers managing 1,480 acres. Overall cluster risk is 62 percent Low, 26 percent Medium, and 12 percent High Risk. 18 active alerts require attention.`}
            language={currentLanguage}
            size="sm"
          />
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-stone-900">
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-stone-200">
            <span className="text-[10px] font-black text-stone-700 uppercase tracking-wider block">
              Land Managed
            </span>
            <span className="text-xl font-black text-indigo-950 block mt-0.5">
              {fpoProfile.totalAcresManaged.toLocaleString()} Acres
            </span>
            <span className="text-[10px] font-bold text-emerald-800">
              Across 8 Village Blocks
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-stone-200">
            <span className="text-[10px] font-black text-stone-700 uppercase tracking-wider block">
              Total Members
            </span>
            <span className="text-xl font-black text-indigo-950 block mt-0.5">
              {totalMembersCount} Farmers
            </span>
            <span className="text-[10px] font-bold text-emerald-800">
              {activeMembersCount} Active • {inactiveCount} Pending
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-stone-200">
            <span className="text-[10px] font-black text-stone-700 uppercase tracking-wider block">
              Dominant Crops
            </span>
            <span className="text-base font-black text-indigo-950 block mt-0.5 truncate">
              Soybean, Wheat
            </span>
            <span className="text-[10px] font-bold text-stone-700">
              Mustard & Tomato Clusters
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-stone-200">
            <span className="text-[10px] font-black text-stone-700 uppercase tracking-wider block">
              Avg. Yield Estimate
            </span>
            <span className="text-xl font-black text-emerald-900 block mt-0.5">
              18.5 Qtl / Acre
            </span>
            <span className="text-[10px] font-bold text-emerald-800">
              +14% vs District Avg
            </span>
          </div>
        </div>
      </div>

      {/* 2. Aggregated Farm Risk Score Card (Distribution Across Members) */}
      <div className="p-5 rounded-3xl bg-white border-2 border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block">
              Cluster Telemetry Analysis
            </span>
            <h3 className="text-lg font-black text-stone-900">
              Aggregated Farm Risk Score
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 font-black text-xs border border-emerald-200">
              Avg Score: 32/100 (Safe)
            </span>
          </div>
        </div>

        {/* Multi-Segmented Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: "62%" }}
              title="62% Low Risk"
            />
            <div
              className="bg-amber-400 h-full transition-all duration-500"
              style={{ width: "26%" }}
              title="26% Medium Risk"
            />
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: "12%" }}
              title="12% High Risk"
            />
          </div>

          {/* Risk Distribution Breakdown Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-black text-emerald-900 block">62% Low Risk</span>
              <span className="text-[10px] font-bold text-emerald-800">
                {lowRiskCount} Member Farms
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-black text-amber-900 block">26% Medium Risk</span>
              <span className="text-[10px] font-bold text-amber-800">
                {medRiskCount} Member Farms
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-xs font-black text-rose-900 block">12% High Risk</span>
              <span className="text-[10px] font-bold text-rose-800">
                {highRiskCount} Member Farms
              </span>
            </div>
          </div>
        </div>

        {/* Risk Breakdown Insights */}
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-stone-800 leading-relaxed">
            <strong className="text-stone-900">Primary Stress Driver:</strong> Concentric leaf blight in Tomato plots (Unhel cluster) and localized soil moisture deficit in 41 farms awaiting canal rotation.
          </p>
        </div>
      </div>

      {/* 3. Alerts Summary (Weather / Disease / Irrigation) */}
      <div className="p-5 rounded-3xl bg-white border-2 border-rose-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                Active Member Alerts Summary
              </h3>
              <p className="text-xs font-bold text-rose-900">
                {activeAlertsCount} active alerts flagged across 14 member farms today
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              onNavigateTab("broadcast");
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Megaphone size={14} />
            <span>Broadcast Alert</span>
          </button>
        </div>

        {/* Alert Type Pills */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2">
            <Bug className="text-rose-600 shrink-0" size={18} />
            <div>
              <span className="text-xs font-black text-stone-900 block">8 Disease Flags</span>
              <span className="text-[10px] font-bold text-rose-800">Early Blight & Mosaic</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-center gap-2">
            <Droplets className="text-sky-600 shrink-0" size={18} />
            <div>
              <span className="text-xs font-black text-stone-900 block">6 Moisture Alerts</span>
              <span className="text-[10px] font-bold text-sky-800">&lt;25% Soil Moisture</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2">
            <CloudRain className="text-amber-600 shrink-0" size={18} />
            <div>
              <span className="text-xs font-black text-stone-900 block">4 Rain Warnings</span>
              <span className="text-[10px] font-bold text-amber-800">Delay Urea Spray</span>
            </div>
          </div>
        </div>

        {/* Urgent High-Risk Farms Carousel/List */}
        <div className="space-y-2">
          <span className="text-[11px] font-black text-stone-700 uppercase tracking-wider block">
            Critical Member Plots Requiring Action:
          </span>

          <div className="space-y-2">
            {highRiskFarmsSample.map((farmer) => (
              <div
                key={farmer.id}
                onClick={() => {
                  soundEffects.click();
                  onSelectMember(farmer);
                }}
                className="p-3 rounded-2xl bg-rose-50/60 hover:bg-rose-100/60 border border-rose-200 flex items-center justify-between cursor-pointer transition-all active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-1.5 rounded-xl bg-white shadow-2xs">
                    {farmer.avatarIcon || "🚜"}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-stone-900">{farmer.name}</h4>
                      <span className="text-[10px] font-extrabold text-rose-800 bg-rose-200/80 px-2 py-0.2 rounded-md">
                        {farmer.primaryCrop} • {farmer.landSizeAcres} Ac
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-rose-900 mt-0.5 line-clamp-1">
                      {farmer.alertDetails}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-black text-rose-700">
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Quick Administrative Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            onOpenInviteModal();
          }}
          className="p-4 rounded-3xl bg-white hover:bg-indigo-50 border-2 border-stone-200 hover:border-indigo-400 shadow-xs flex flex-col items-center text-center transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2">
            <QrCode size={24} />
          </div>
          <span className="text-xs font-black text-stone-900">Invite Members</span>
          <span className="text-[10px] font-bold text-stone-700 mt-0.5">
            QR & Link Code
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            onNavigateTab("broadcast");
          }}
          className="p-4 rounded-3xl bg-white hover:bg-amber-50 border-2 border-stone-200 hover:border-amber-400 shadow-xs flex flex-col items-center text-center transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
            <Megaphone size={24} />
          </div>
          <span className="text-xs font-black text-stone-900">Bulk Broadcast</span>
          <span className="text-[10px] font-bold text-stone-700 mt-0.5">
            SMS & Push Alert
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            onNavigateTab("broadcast");
          }}
          className="p-4 rounded-3xl bg-white hover:bg-emerald-50 border-2 border-stone-200 hover:border-emerald-400 shadow-xs flex flex-col items-center text-center transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
            <Briefcase size={24} />
          </div>
          <span className="text-xs font-black text-stone-900">Labour Pooling</span>
          <span className="text-[10px] font-bold text-stone-700 mt-0.5">
            Collective Jobs
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            onNavigateTab("reports");
          }}
          className="p-4 rounded-3xl bg-white hover:bg-sky-50 border-2 border-stone-200 hover:border-sky-400 shadow-xs flex flex-col items-center text-center transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mb-2">
            <Layers size={24} />
          </div>
          <span className="text-xs font-black text-stone-900">Compliance & Reports</span>
          <span className="text-[10px] font-bold text-stone-700 mt-0.5">
            Export PDF/Excel
          </span>
        </button>
      </div>
    </div>
  );
};
