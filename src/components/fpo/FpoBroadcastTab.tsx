import React, { useState } from "react";
import {
  Megaphone,
  Send,
  Users,
  Briefcase,
  Cpu,
  Radio,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  PlusCircle,
  PhoneCall,
  Battery,
  Wifi,
  Wrench,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  FpoBroadcastAlert,
  FpoBulkLabourJob,
  FpoIotKitItem,
  LanguageCode,
} from "../../types";
import {
  INITIAL_BROADCAST_ALERTS,
  INITIAL_BULK_LABOUR_POOLS,
  INITIAL_IOT_KITS,
} from "../../data/fpoData";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";

interface FpoBroadcastTabProps {
  currentLanguage: LanguageCode;
  onPostLabourJob?: () => void;
}

export const FpoBroadcastTab: React.FC<FpoBroadcastTabProps> = ({
  currentLanguage,
}) => {
  const [subSection, setSubSection] = useState<"broadcast" | "labour" | "iot">("broadcast");

  // Broadcast Composer States
  const [title, setTitle] = useState("Heavy Rain & Thunderstorm Advisory");
  const [message, setMessage] = useState(
    "35-45mm unseasonal rainfall forecasted in Ujjain district within 36 hours. Please delay urea/chemical spray application to prevent nutrient leaching runoff."
  );
  const [targetAudience, setTargetAudience] = useState("All Members (342 Farmers)");
  const [channel, setChannel] = useState("SMS + App Push");
  const [broadcasts, setBroadcasts] = useState<FpoBroadcastAlert[]>(INITIAL_BROADCAST_ALERTS);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Labour Pooling States
  const [labourPools, setLabourPools] = useState<FpoBulkLabourJob[]>(INITIAL_BULK_LABOUR_POOLS);
  const [showNewLabourModal, setShowNewLabourModal] = useState(false);
  const [poolTitle, setPoolTitle] = useState("");
  const [poolWorkers, setPoolWorkers] = useState("25");
  const [poolFarms, setPoolFarms] = useState("4");
  const [poolWage, setPoolWage] = useState("550");
  const [poolDates, setPoolDates] = useState("Next 5 Days");

  // IoT Kits State
  const [iotKits, setIotKits] = useState<FpoIotKitItem[]>(INITIAL_IOT_KITS);
  const [iotFilter, setIotFilter] = useState<"all" | "warning" | "offline">("all");

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    soundEffects.click();
    setIsBroadcasting(true);

    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSuccess(true);
      soundEffects.success();

      const newAlert: FpoBroadcastAlert = {
        id: `broad-${Date.now()}`,
        title: title.trim(),
        message: message.trim(),
        targetAudience,
        channel,
        sentAt: "Just now",
        recipientsCount: targetAudience.includes("342")
          ? 342
          : targetAudience.includes("Soybean")
          ? 185
          : targetAudience.includes("Wheat")
          ? 120
          : 40,
        status: "Delivered",
      };

      setBroadcasts((prev) => [newAlert, ...prev]);
      speakText(`Broadcast successfully transmitted to ${targetAudience}`, currentLanguage);

      setTimeout(() => {
        setBroadcastSuccess(false);
      }, 3000);
    }, 1200);
  };

  const handleCreateLabourPool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poolTitle.trim()) return;

    soundEffects.success();
    const newPool: FpoBulkLabourJob = {
      id: `pool-${Date.now()}`,
      title: poolTitle.trim(),
      crops: ["Wheat & Soybean"],
      villages: ["Gram Pipliya", "Gram Badnagar"],
      totalWorkersNeeded: parseInt(poolWorkers) || 20,
      participatingFarmsCount: parseInt(poolFarms) || 3,
      wagePerDay: parseInt(poolWage) || 550,
      dates: poolDates,
      status: "Active Pool",
      description: `Aggregated harvest requirement across ${poolFarms} farms. Standard daily wage of ₹${poolWage} with collective transport provided.`,
    };

    setLabourPools((prev) => [newPool, ...prev]);
    setShowNewLabourModal(false);
    setPoolTitle("");
    speakText("New collective labour pool requirement published to local workers", currentLanguage);
  };

  const filteredIotKits = iotKits.filter((kit) => {
    if (iotFilter === "warning") return kit.status === "Warning" || kit.batteryPercent < 20;
    if (iotFilter === "offline") return kit.status === "Offline";
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top 3 Sub-Section Switcher Tabs */}
      <div className="bg-white p-2 rounded-3xl border-2 border-stone-200 shadow-xs flex gap-2">
        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            setSubSection("broadcast");
          }}
          className={`flex-1 py-3 px-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
            subSection === "broadcast"
              ? "bg-amber-500 text-amber-950 shadow-xs"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          <Megaphone size={16} />
          <span>Broadcast Advisories</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            setSubSection("labour");
          }}
          className={`flex-1 py-3 px-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
            subSection === "labour"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          <Briefcase size={16} />
          <span>Labour Coordination</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.click();
            setSubSection("iot");
          }}
          className={`flex-1 py-3 px-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
            subSection === "iot"
              ? "bg-sky-600 text-white shadow-xs"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          <Cpu size={16} />
          <span>IoT Kits Management</span>
        </button>
      </div>

      {/* =========================================================
          SECTION 1: BROADCAST ADVISORIES & COMPOSER
          ========================================================= */}
      {subSection === "broadcast" && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
          {/* Broadcast Composer Card */}
          <div className="bg-white p-5 rounded-3xl border-2 border-amber-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Radio size={22} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                    Send Mass Advisory Alert
                  </h3>
                  <p className="text-xs font-bold text-stone-700">
                    Transmits instant alerts via SMS, WhatsApp push, and Voice IVR.
                  </p>
                </div>
              </div>

              <AudioButton
                textToSpeak={`Previewing Broadcast: ${title}. ${message}`}
                language={currentLanguage}
                size="sm"
              />
            </div>

            {broadcastSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-center gap-2.5 animate-in zoom-in-95">
                <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
                <span className="text-xs font-black">
                  Broadcast successfully dispatched to {targetAudience}!
                </span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3.5">
              {/* Quick Template Selector */}
              <div>
                <span className="text-[10px] font-black text-stone-700 uppercase tracking-wider block mb-1.5">
                  Quick Urgent Templates:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    {
                      t: "Heavy Rain: Delay Urea Application",
                      m: "Thunderstorms & 35-45mm rain expected within 36 hours. Delay urea and chemical fertilizer top dressing to prevent loss.",
                    },
                    {
                      t: "Early Leaf Blight Outbreak Alert",
                      m: "Leaf blight spots confirmed in Unhel block. Inspect tomato and potato crops; apply bio-fungicide or Mancozeb spray.",
                    },
                    {
                      t: "Mandi Wheat Price at ₹2,480 Peak",
                      m: "Ujjain Mandi spot price is ₹120 above MSP. FPO grain aggregation center is open for collective selling slots.",
                    },
                  ].map((temp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setTitle(temp.t);
                        setMessage(temp.m);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 text-[11px] font-bold text-stone-700 active:scale-95 transition-all text-left"
                    >
                      {temp.t.split(":")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-black text-stone-700">Advisory Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 font-bold text-sm text-stone-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Message Body */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-stone-700">Advisory Message Body</label>
                  <span className="text-[10px] font-bold text-stone-700">
                    {message.length} characters (1 SMS segment)
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 font-semibold text-sm text-stone-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Audience & Channel Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-black text-stone-700">Target Audience Filter</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-900 bg-stone-50"
                  >
                    <option value="All Members (342 Farmers)">All Members (342 Farmers)</option>
                    <option value="Soybean Farmers (185 Farmers)">Soybean Farmers (185 Farmers)</option>
                    <option value="Wheat Growers (120 Farmers)">Wheat Growers (120 Farmers)</option>
                    <option value="Tomato & Veg Growers (40 Farmers)">Tomato & Veg Growers (40 Farmers)</option>
                    <option value="High Risk Farms Only (41 Farmers)">High Risk Farms Only (41 Farmers)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-stone-700">Delivery Channels</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-900 bg-stone-50"
                  >
                    <option value="SMS + App Push">SMS + App Push Notification</option>
                    <option value="Voice Call (IVR) + SMS">Automated Voice Call (IVR) + SMS</option>
                    <option value="In-App Push Only">In-App Push Notification Only</option>
                  </select>
                </div>
              </div>

              {/* Submit Broadcast Button */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => speakText(message, currentLanguage)}
                  className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs border border-stone-300 flex items-center gap-1.5 active:scale-95"
                >
                  <Volume2 size={16} />
                  <span>Preview Audio</span>
                </button>

                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="flex-1 py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  <span>{isBroadcasting ? "Transmitting to Farmers..." : "Send Live Broadcast Now"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Broadcast History Feed */}
          <div className="space-y-3">
            <span className="text-[11px] font-black text-stone-700 uppercase tracking-wider block">
              Recent Broadcast Delivery History:
            </span>

            <div className="space-y-2.5">
              {broadcasts.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-3xl bg-white border-2 border-stone-200 shadow-xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-sm text-stone-900">{item.title}</h4>
                      <p className="text-[11px] font-bold text-indigo-900 mt-0.5">
                        Target: {item.targetAudience} • {item.channel}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      {item.status} ({item.recipientsCount})
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-stone-700 bg-stone-50 p-2.5 rounded-xl">
                    "{item.message}"
                  </p>

                  <div className="text-[10px] font-bold text-stone-700 flex justify-between pt-1">
                    <span>Transmitted {item.sentAt}</span>
                    <span className="text-emerald-800">100% Carrier Delivery Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 2: BULK LABOUR COORDINATION & POOLING
          ========================================================= */}
      {subSection === "labour" && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-3xl bg-emerald-900 text-white shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black leading-tight">
                Bulk Farm Labour Pooling
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                Aggregate harvesting and sowing labour demand across multiple member farms.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setShowNewLabourModal(true);
              }}
              className="px-4 py-2 rounded-2xl bg-white text-emerald-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <PlusCircle size={16} />
              <span>Create Labour Pool</span>
            </button>
          </div>

          {/* Active Pools Cards */}
          <div className="space-y-3">
            <span className="text-[11px] font-black text-stone-700 uppercase tracking-wider block">
              Active Collective Labour Pools:
            </span>

            {labourPools.map((pool) => (
              <div
                key={pool.id}
                className="bg-white p-5 rounded-3xl border-2 border-emerald-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                      {pool.participatingFarmsCount} Farms Aggregated • {pool.crops.join(", ")}
                    </span>
                    <h4 className="text-base font-black text-stone-900 mt-0.5">{pool.title}</h4>
                    <p className="text-xs font-bold text-stone-700 flex items-center gap-1 mt-0.5">
                      <Clock size={12} />
                      {pool.dates} • {pool.villages.join(", ")}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950">
                    {pool.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-stone-800 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                  {pool.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-stone-900">
                      Required: <strong className="text-emerald-800 font-black">{pool.totalWorkersNeeded} Workers</strong>
                    </span>
                    <span>•</span>
                    <span className="font-black text-stone-900">
                      Guaranteed Wage: <strong className="text-emerald-800 font-black">₹{pool.wagePerDay}/day</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.success();
                      alert(`Broadcasting pooled job requirement to 140 registered local farm workers in ${pool.villages.join(", ")}.`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs active:scale-95"
                  >
                    Ping Registered Workers
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to Create New Labour Pool */}
          {showNewLabourModal && (
            <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white max-w-md w-full rounded-3xl p-5 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-lg text-stone-900">
                    New Collective Labour Pool
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowNewLabourModal(false)}
                    className="p-1 rounded-lg text-stone-700 hover:text-stone-900"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateLabourPool} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-stone-700">Pool Requirement Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wheat Harvesting & Bagging Team"
                      value={poolTitle}
                      onChange={(e) => setPoolTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-sm text-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-stone-700">Workers Needed</label>
                      <input
                        type="number"
                        value={poolWorkers}
                        onChange={(e) => setPoolWorkers(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-sm text-stone-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-stone-700">Farms Pooled</label>
                      <input
                        type="number"
                        value={poolFarms}
                        onChange={(e) => setPoolFarms(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-sm text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-stone-700">Daily Wage (₹)</label>
                      <input
                        type="number"
                        value={poolWage}
                        onChange={(e) => setPoolWage(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-sm text-stone-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-stone-700">Dates / Duration</label>
                      <input
                        type="text"
                        value={poolDates}
                        onChange={(e) => setPoolDates(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-sm text-stone-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md mt-2 active:scale-98"
                  >
                    Post Labour Pool to Labour Dashboard
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          SECTION 3: BULK IOT KIT MANAGEMENT & HEALTH
          ========================================================= */}
      {subSection === "iot" && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-3xl border-2 border-sky-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black text-sky-800 uppercase tracking-wider block">
                  Hardware Fleet Telemetry
                </span>
                <h3 className="text-lg font-black text-stone-900">
                  Distributed Soil Sensor Kits
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-950">
                74 Total Units Distributed
              </span>
            </div>

            {/* Quick Fleet Health Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-black text-emerald-900 block">68 Online</span>
                <span className="text-[10px] font-bold text-emerald-800">Transmitting Data</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-black text-amber-900 block">4 Battery Low</span>
                <span className="text-[10px] font-bold text-amber-800">&lt;20% Power</span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-xs font-black text-rose-900 block">2 Offline</span>
                <span className="text-[10px] font-bold text-rose-800">Signal Lost</span>
              </div>
            </div>
          </div>

          {/* IoT Device Roster Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black text-stone-700 uppercase tracking-wider">
                Active Member Sensor Installations:
              </span>

              <div className="flex gap-1.5">
                {["all", "warning", "offline"].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      setIotFilter(f as any);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                      iotFilter === f
                        ? "bg-sky-900 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredIotKits.map((kit) => (
                <div
                  key={kit.id}
                  className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 ${
                        kit.status === "Online"
                          ? "bg-emerald-600"
                          : kit.status === "Warning"
                          ? "bg-amber-600"
                          : "bg-rose-600"
                      }`}
                    >
                      <Cpu size={20} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-stone-900 font-mono">
                          {kit.deviceId}
                        </h4>
                        <span className="text-[10px] font-extrabold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                          {kit.crop}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-stone-700 mt-0.5">
                        Farmer: <strong className="text-stone-900">{kit.assignedFarmerName}</strong> ({kit.village})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-black text-stone-700 block">Moisture</span>
                        <span className="font-black text-stone-900">{kit.moisture}%</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-black text-stone-700 block">Battery</span>
                        <span
                          className={`font-black ${
                            kit.batteryPercent < 25 ? "text-rose-600" : "text-emerald-700"
                          }`}
                        >
                          {kit.batteryPercent}%
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-black text-stone-700 block">Calibration</span>
                        <span className="font-black text-stone-800 text-[11px]">
                          {kit.calibrationStatus}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.success();
                        alert(`Triggering OTA diagnostic ping to device ${kit.deviceId}. Farmer ${kit.assignedFarmerName} notified.`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-900 border border-sky-300 font-black text-xs hover:bg-sky-100 active:scale-95"
                    >
                      Diagnose
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
