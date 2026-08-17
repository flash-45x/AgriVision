import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  QrCode,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  ArrowUpDown,
  Phone,
  Droplets,
  CheckCircle2,
} from "lucide-react";
import { FpoFarmerMember, LanguageCode } from "../../types";
import { AudioButton } from "../common/AudioButton";
import { soundEffects } from "../../utils/audio";

interface FpoMembersTabProps {
  members: FpoFarmerMember[];
  currentLanguage: LanguageCode;
  onSelectMember: (member: FpoFarmerMember) => void;
  onOpenInviteModal: () => void;
}

export const FpoMembersTab: React.FC<FpoMembersTabProps> = ({
  members,
  currentLanguage,
  onSelectMember,
  onOpenInviteModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low" | "iot">("all");
  const [villageFilter, setVillageFilter] = useState<string>("all");

  const villagesList = Array.from(new Set(members.map((m) => m.village)));

  // Filter members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery) ||
      member.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.primaryCrop.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk =
      riskFilter === "all"
        ? true
        : riskFilter === "high"
        ? member.riskLevel === "High"
        : riskFilter === "medium"
        ? member.riskLevel === "Medium"
        : riskFilter === "low"
        ? member.riskLevel === "Low"
        : riskFilter === "iot"
        ? member.iotKitStatus.includes("Active") || member.iotKitStatus.includes("Battery")
        : true;

    const matchesVillage = villageFilter === "all" ? true : member.village === villageFilter;

    return matchesSearch && matchesRisk && matchesVillage;
  });

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "High":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "Medium":
        return "bg-amber-100 text-amber-900 border-amber-300";
      default:
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header Bar & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border-2 border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Member Farmers Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-900">
              342 Total Members
            </span>
          </div>
          <p className="text-xs font-bold text-stone-700 mt-0.5">
            Search, monitor individual farm risk scores, and manage FPO enrollment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioButton
            textToSpeak="Member Directory. 342 farmers enrolled across Ujjain district. Tap any farmer profile to inspect their risk score, crops, or IoT sensor status."
            language={currentLanguage}
            size="sm"
          />

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              onOpenInviteModal();
            }}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2"
          >
            <UserPlus size={16} />
            <span>Add / Invite Member</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Risk Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
          <Search size={18} className="text-stone-700 shrink-0 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farmer by name, phone, village, or crop (e.g. Ramesh, Soybean)..."
            className="flex-1 text-sm font-bold text-stone-900 bg-transparent focus:outline-hidden placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-stone-700 px-2 py-1 hover:text-stone-900"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-black text-stone-700 uppercase mr-1">Filter Risk:</span>
          {[
            { id: "all", label: "All (342)" },
            { id: "high", label: "🔴 High Risk (41)" },
            { id: "medium", label: "🟡 Medium (89)" },
            { id: "low", label: "🟢 Low Risk (212)" },
            { id: "iot", label: "⚡ Smart IoT (74)" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => {
                soundEffects.click();
                setRiskFilter(pill.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                riskFilter === pill.id
                  ? "bg-indigo-900 text-white shadow-xs"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-700"
              }`}
            >
              {pill.label}
            </button>
          ))}

          {/* Village Filter Select */}
          <select
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="ml-auto px-3 py-1.5 rounded-xl text-xs font-black bg-stone-100 border border-stone-300 text-stone-800 focus:outline-hidden"
          >
            <option value="all">All Villages</option>
            {villagesList.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Member List Cards */}
      <div className="space-y-2.5">
        {filteredMembers.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-stone-300 text-center space-y-2">
            <p className="text-sm font-black text-stone-700">No member farmers match this query.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setRiskFilter("all");
                setVillageFilter("all");
              }}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => {
                soundEffects.click();
                onSelectMember(member);
              }}
              className="bg-white hover:bg-stone-50 p-4 rounded-3xl border-2 border-stone-200 hover:border-indigo-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all active:scale-99"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center text-2xl font-bold shrink-0 border border-stone-200">
                  {member.avatarIcon || "🌾"}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-stone-900 leading-tight">
                      {member.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${getRiskBadge(
                        member.riskLevel
                      )}`}
                    >
                      Risk: {member.farmRiskScore}/100
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-stone-700 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {member.village}
                    </span>
                    <span>•</span>
                    <span className="text-indigo-950 font-black">
                      {member.landSizeAcres} Acres ({member.primaryCrop})
                    </span>
                    {member.secondaryCrop && (
                      <span className="text-stone-700 font-semibold">
                        + {member.secondaryCrop}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Tags & Action Arrow */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <div className="flex items-center gap-1.5">
                  {member.hasActiveAlert && (
                    <span className="px-2 py-1 rounded-lg bg-rose-100 text-rose-800 text-[10px] font-black flex items-center gap-1">
                      <AlertTriangle size={11} />
                      Alert Flagged
                    </span>
                  )}

                  {member.iotKitStatus.includes("Active") && (
                    <span className="px-2 py-1 rounded-lg bg-sky-100 text-sky-900 text-[10px] font-black flex items-center gap-1">
                      <Cpu size={11} />
                      IoT {member.lastMoisturePercent}%
                    </span>
                  )}

                  <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-[10px] font-black hidden sm:inline-block">
                    PM-KISAN ✓
                  </span>
                </div>

                <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 group-hover:bg-indigo-100 group-hover:text-indigo-900">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
