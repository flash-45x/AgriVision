import React, { useState } from "react";
import {
  X,
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
  Utensils,
  Plus,
  Minus,
} from "lucide-react";
import { LanguageCode, LabourJob } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";

interface HireLabourModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onJobCreated: (job: LabourJob) => void;
}

export const HireLabourModal: React.FC<HireLabourModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onJobCreated,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const [jobType, setJobType] = useState("Harvesting");
  const [workersCount, setWorkersCount] = useState(3);
  const [wageRate, setWageRate] = useState(550);
  const [daysCount, setDaysCount] = useState(2);
  const [foodProvided, setFoodProvided] = useState(true);

  if (!isOpen) return null;

  const jobTypes = [
    { name: "Harvesting (फसल कटाई)", emoji: "🌾" },
    { name: "Sowing & Seeding (बुवाई)", emoji: "🌱" },
    { name: "Weeding (खुरपणी / निराई)", emoji: "🌿" },
    { name: "Pesticide Spraying (छिड़काव)", emoji: "🧪" },
    { name: "Tractor & Ploughing (जुताई)", emoji: "🚜" },
  ];

  const handlePost = () => {
    soundEffects.success();
    const newJob: LabourJob = {
      id: `job-${Date.now()}`,
      title: `${jobType.split(" ")[0]} Workers Needed`,
      farmName: "Ramesh Patel Farm (Field A)",
      farmerPhone: "+91 98765 43210",
      jobType,
      wagePerDay: wageRate,
      workersNeeded: workersCount,
      durationDays: `${daysCount} Days`,
      location: "Ujjain Rural, MP",
      distanceKm: 2.1,
      foodProvided,
      accommodationProvided: false,
      startDate: "Tomorrow Morning (7:00 AM)",
      status: "OPEN",
      description: `Need ${workersCount} energetic workers for ${jobType.split(" ")[0]}. Fast cash payment upon daily completion.`,
    };

    onJobCreated(newJob);
    speakText("Labour job has been broadcasted to all nearby workers.", currentLanguage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-5 border border-emerald-300 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
              <Users size={22} />
            </div>
            <div>
              <h3 className="font-black text-lg text-stone-900 leading-tight">
                {t.farmer.hireLabour}
              </h3>
              <p className="text-xs font-semibold text-stone-700">Broadcast request to nearby workers</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-700 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* 1. Job Type Cards */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 block">
            1. Select Work Type / कार्य का प्रकार
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {jobTypes.map((jt) => (
              <button
                key={jt.name}
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setJobType(jt.name);
                }}
                className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                  jobType === jt.name
                    ? "bg-orange-600 text-white border-orange-600 shadow-xs font-bold"
                    : "bg-stone-50 text-stone-800 border-stone-200"
                }`}
              >
                <span className="text-2xl mb-1">{jt.emoji}</span>
                <span className="text-xs leading-tight line-clamp-1">{jt.name.split("(")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Daily Wage Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-stone-700">
              2. Daily Wage / दैनिक मजदूरी (₹ per Worker)
            </label>
            <span className="font-black text-base text-emerald-950 font-mono">
              ₹{wageRate} / day
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[450, 500, 550, 600].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setWageRate(rate);
                }}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  wageRate === rate
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-stone-50 text-stone-800 border-stone-200"
                }`}
              >
                ₹{rate}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Number of Workers & Days */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <span className="text-[11px] font-bold text-stone-700 block">Workers Needed</span>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setWorkersCount(Math.max(1, workersCount - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center font-bold"
              >
                <Minus size={16} />
              </button>
              <span className="text-lg font-black text-stone-900">{workersCount} People</span>
              <button
                type="button"
                onClick={() => setWorkersCount(workersCount + 1)}
                className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center font-bold"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <span className="text-[11px] font-bold text-stone-700 block">Duration</span>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setDaysCount(Math.max(1, daysCount - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center font-bold"
              >
                <Minus size={16} />
              </button>
              <span className="text-lg font-black text-stone-900">{daysCount} Days</span>
              <button
                type="button"
                onClick={() => setDaysCount(daysCount + 1)}
                className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center font-bold"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Food / Tea Toggle */}
        <div
          onClick={() => {
            soundEffects.click();
            setFoodProvided(!foodProvided);
          }}
          className="p-3 rounded-2xl border border-stone-200 bg-white flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Utensils size={20} className="text-amber-600" />
            <div>
              <div className="text-xs font-bold text-stone-900">Provide Lunch / Tea & Snacks</div>
              <p className="text-[10px] text-stone-700">Increases worker sign-up speed by 40%</p>
            </div>
          </div>
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              foodProvided ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300"
            }`}
          >
            {foodProvided && <CheckCircle2 size={16} />}
          </div>
        </div>

        {/* Post Button */}
        <button
          id="confirm-post-job-btn"
          type="button"
          onClick={handlePost}
          className="w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-base shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Post Job Now (₹{(wageRate * workersCount * daysCount).toLocaleString()} Total)</span>
          <CheckCircle2 size={20} />
        </button>
      </div>
    </div>
  );
};
