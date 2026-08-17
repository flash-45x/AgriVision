import React, { useState, useMemo } from "react";
import {
  Briefcase,
  MapPin,
  Calendar,
  PhoneCall,
  CheckCircle2,
  Utensils,
  Clock,
  Sparkles,
  Users,
  Filter,
  Volume2,
  Mic,
  Search,
  Bookmark,
  BookmarkCheck,
  Star,
  ShieldCheck,
  Award,
  ChevronRight,
  X,
  Phone,
  Navigation,
  Map as MapIcon,
  List,
  Check,
  AlertCircle,
  Truck,
  Zap,
  DollarSign,
  HeartHandshake,
  UserCheck,
  RotateCcw,
  Edit3,
} from "lucide-react";
import { UserProfile, LanguageCode, LabourJob } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { INITIAL_JOBS } from "../../data/mockData";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText, createSpeechRecognizer } from "../../utils/audio";

interface LabourDashboardProps {
  userProfile: UserProfile;
  currentLanguage: LanguageCode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenVoiceAssistantWithPrompt: (prompt: string) => void;
}

type LabourTopTab = "feed" | "applied_saved" | "profile";

const normalizeLabourTab = (tab?: string): LabourTopTab => {
  if (!tab || tab === "home" || tab === "jobs" || tab === "feed") return "feed";
  if (tab === "skills" || tab === "profile") return "profile";
  if (tab === "applied" || tab === "applied_saved" || tab === "saved") return "applied_saved";
  return "feed";
};

export const LabourDashboard: React.FC<LabourDashboardProps> = ({
  userProfile,
  currentLanguage,
  activeTab: externalActiveTab,
  onTabChange,
  onOpenVoiceAssistantWithPrompt,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Top navigation tab: 'feed' | 'applied_saved' | 'profile'
  const [activeTab, setActiveTab] = useState<LabourTopTab>(() =>
    normalizeLabourTab(externalActiveTab)
  );

  // Sync external tab changes (e.g., from bottom navigation)
  React.useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(normalizeLabourTab(externalActiveTab));
    }
  }, [externalActiveTab]);

  const handleSwitchTab = (tab: LabourTopTab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab === "profile" ? "skills" : tab === "feed" ? "home" : tab);
    }
  };

  // Sub-tab inside Applied/Saved: 'applied' | 'saved'
  const [appliedSubTab, setAppliedSubTab] = useState<"applied" | "saved">("applied");

  // View Mode: 'list' | 'map'
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // State for jobs and user interactions
  const [jobs, setJobs] = useState<LabourJob[]>(INITIAL_JOBS);
  const [isAvailable, setIsAvailable] = useState(userProfile.isAvailableForWork ?? true);
  const [dailyWage, setDailyWage] = useState(userProfile.dailyRateWage || 550);
  const [mySkills, setMySkills] = useState<string[]>(
    userProfile.skills && userProfile.skills.length > 0
      ? userProfile.skills
      : ["Harvesting", "Sowing", "Spraying", "Weeding"]
  );
  const [availabilitySchedule, setAvailabilitySchedule] = useState<string>(
    userProfile.availabilityPeriod || "Available Now / Today"
  );

  // Applied & Saved job track lists
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(
    userProfile.appliedJobs ? userProfile.appliedJobs.map((a) => a.jobId) : ["job-002"]
  );
  const [savedJobIds, setSavedJobIds] = useState<string[]>(
    userProfile.savedJobIds || ["job-001", "job-003"]
  );

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [isListeningVoiceSearch, setIsListeningVoiceSearch] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Modal states
  const [selectedJobForModal, setSelectedJobForModal] = useState<LabourJob | null>(null);
  const [callFarmerModalJob, setCallFarmerModalJob] = useState<LabourJob | null>(null);
  const [mapSelectedJob, setMapSelectedJob] = useState<LabourJob | null>(null);

  // Toggle saving a job
  const handleToggleSave = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEffects.click();
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
    } else {
      setSavedJobIds((prev) => [...prev, jobId]);
      speakText("Job saved to your bookmarks", currentLanguage);
    }
  };

  // Apply for a job
  const handleApply = (job: LabourJob, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEffects.success();
    if (!appliedJobIds.includes(job.id)) {
      setAppliedJobIds((prev) => [job.id, ...prev]);
      speakText(`Application submitted for ${job.title}. Farmer will review your profile.`, currentLanguage);
    }
  };

  // Initiate direct call
  const handleOpenCallModal = (job: LabourJob, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEffects.click();
    setCallFarmerModalJob(job);
  };

  // Voice Search Handler
  const handleStartVoiceSearch = () => {
    soundEffects.click();
    setIsListeningVoiceSearch(true);

    const voiceSamples = [
      "Harvesting work near me",
      "Spraying jobs",
      "Sowing work ₹600+",
      "Urgent work within 5 km",
    ];

    speakText("Say what work you are looking for", currentLanguage, () => {
      setTimeout(() => {
        setIsListeningVoiceSearch(false);
        const recognized = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];
        setSearchQuery(recognized);
        soundEffects.success();
        speakText(`Showing results for ${recognized}`, currentLanguage);
      }, 2000);
    });
  };

  // Toggle skills in Profile
  const handleToggleSkill = (skill: string) => {
    soundEffects.click();
    if (mySkills.includes(skill)) {
      if (mySkills.length > 1) {
        setMySkills(mySkills.filter((s) => s !== skill));
      }
    } else {
      setMySkills([...mySkills, skill]);
    }
  };

  // Filtered jobs list based on filter chips and search query
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchesFilter =
        selectedFilter === "all" ||
        j.jobType.toLowerCase().includes(selectedFilter.toLowerCase()) ||
        j.title.toLowerCase().includes(selectedFilter.toLowerCase());

      const matchesSearch =
        searchQuery.trim() === "" ||
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.jobType.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [jobs, selectedFilter, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-28 max-w-4xl mx-auto px-3 sm:px-4 pt-3">
      {/* =========================================================
          TOP NAVIGATION BAR (Job Feed | Applied / Saved | My Profile)
          ========================================================= */}
      <div className="bg-white p-1.5 rounded-2xl border-2 border-stone-200 shadow-xs flex items-center justify-between gap-1">
        <button
          id="labour-tab-feed"
          type="button"
          onClick={() => {
            soundEffects.click();
            handleSwitchTab("feed");
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "feed"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          <Briefcase size={16} />
          <span>Job Feed</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === "feed" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-900"
            }`}
          >
            {jobs.length}
          </span>
        </button>

        <button
          id="labour-tab-applied"
          type="button"
          onClick={() => {
            soundEffects.click();
            handleSwitchTab("applied_saved");
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "applied_saved"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          <CheckCircle2 size={16} />
          <span>Applied / Saved</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === "applied_saved"
                ? "bg-white/20 text-white"
                : "bg-emerald-100 text-emerald-900"
            }`}
          >
            {appliedJobIds.length + savedJobIds.length}
          </span>
        </button>

        <button
          id="labour-tab-profile"
          type="button"
          onClick={() => {
            soundEffects.click();
            handleSwitchTab("profile");
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "profile"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          <Star size={16} />
          <span>My Profile & Skills</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold flex items-center gap-0.5 ${
              activeTab === "profile" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-950"
            }`}
          >
            ★ 4.9
          </span>
        </button>
      </div>

      {/* =========================================================
          TAB 1: JOB FEED (Main Screen)
          ========================================================= */}
      {activeTab === "feed" && (
        <div className="space-y-4">
          {/* Worker Status & Availability Quick Toggle Bar */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-orange-800 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  userProfile.photoUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                }
                alt={userProfile.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-base sm:text-lg text-white leading-tight">
                    {userProfile.name || "Ramesh Patel"}
                  </h3>
                  <span className="bg-amber-500/40 text-amber-100 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5">
                    ★ 4.9
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-200 mt-0.5">
                  <span>Rate: ₹{dailyWage}/day</span>
                  <span>•</span>
                  <span>{userProfile.locationName || "Ujjain (MP)"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.click();
                  setIsAvailable(!isAvailable);
                  speakText(
                    !isAvailable
                      ? "You are now active for farm work"
                      : "Work availability turned off",
                    currentLanguage
                  );
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all active:scale-95 shadow-xs ${
                  isAvailable
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse"
                    : "bg-stone-700 text-stone-300"
                }`}
              >
                {isAvailable ? "🟢 ACTIVE" : "⚪ OFF"}
              </button>

              <AudioButton
                textToSpeak={`Welcome ${userProfile.name}. There are ${filteredJobs.length} open farm jobs near you. Daily wage averages between 500 and 700 rupees.`}
                language={currentLanguage}
                size="sm"
              />
            </div>
          </div>

          {/* Search Bar with Voice Search Mic & List/Map Toggle */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              {/* Voice / Text Search Input */}
              <div className="flex-1 bg-white rounded-2xl border-2 border-stone-200 focus-within:border-amber-500 shadow-xs flex items-center px-3 py-1.5 transition-all">
                <Search size={18} className="text-stone-400 shrink-0 mr-2" />
                <input
                  id="job-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search work (e.g., harvesting, spraying, ₹600)..."
                  className="w-full text-xs sm:text-sm font-bold text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-stone-400 hover:text-stone-600 p-1 mr-1"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  id="voice-search-mic-btn"
                  type="button"
                  onClick={handleStartVoiceSearch}
                  className={`p-2 rounded-xl transition-all active:scale-95 shrink-0 ${
                    isListeningVoiceSearch
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                  }`}
                  title="Voice Search (बोलकर खोजें)"
                >
                  <Mic size={18} />
                </button>
              </div>

              {/* List vs Map Toggle */}
              <div className="bg-white p-1 rounded-2xl border-2 border-stone-200 shadow-xs flex items-center shrink-0">
                <button
                  id="toggle-view-list"
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setViewMode("list");
                  }}
                  className={`p-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                    viewMode === "list"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                  title="List View"
                >
                  <List size={18} />
                  <span className="hidden sm:inline">List</span>
                </button>

                <button
                  id="toggle-view-map"
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setViewMode("map");
                  }}
                  className={`p-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                    viewMode === "map"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                  title="Map View"
                >
                  <MapIcon size={18} />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>
            </div>

            {/* Voice Search active badge */}
            {isListeningVoiceSearch && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>Listening for voice search... say "harvesting work near me" (बोलिए...)</span>
              </div>
            )}

            {/* Category Filter Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { label: "All Work", id: "all", icon: "📋" },
                { label: "Harvesting (कटाई)", id: "harvest", icon: "🌾" },
                { label: "Sowing (बुवाई)", id: "sow", icon: "🌱" },
                { label: "Spraying (छिड़काव)", id: "spray", icon: "🧪" },
                { label: "Weeding (निराई)", id: "weed", icon: "🌿" },
                { label: "General Labour (मजदूरी)", id: "labour", icon: "🛠️" },
              ].map((f) => (
                <button
                  key={f.id}
                  id={`filter-chip-${f.id}`}
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setSelectedFilter(f.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-black shrink-0 transition-all flex items-center gap-1.5 border ${
                    selectedFilter === f.id
                      ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                      : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* =========================================================
              VIEW MODE: LIST VIEW
              ========================================================= */}
          {viewMode === "list" && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between px-1 text-xs font-bold text-stone-700">
                <span>Showing {filteredJobs.length} Farm Jobs Nearby</span>
                <span>Sorted by nearest distance</span>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border-2 border-stone-200 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 text-3xl flex items-center justify-center mx-auto">
                    🌾
                  </div>
                  <h4 className="text-base font-black text-stone-900">No matching jobs found</h4>
                  <p className="text-xs font-bold text-stone-600 max-w-xs mx-auto">
                    Try clearing search or picking another skill category
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedFilter("all");
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const isApplied = appliedJobIds.includes(job.id);
                  const isSaved = savedJobIds.includes(job.id);

                  return (
                    <div
                      key={job.id}
                      id={`job-card-${job.id}`}
                      onClick={() => {
                        soundEffects.click();
                        setSelectedJobForModal(job);
                      }}
                      className="p-5 rounded-3xl bg-white border-2 border-stone-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 relative group"
                    >
                      {/* Top Row: Job Icon + Title + Pay Rate */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-2xl shrink-0 mt-0.5 border border-amber-200">
                            {job.jobType.includes("Harvest") && "🌾"}
                            {job.jobType.includes("Spray") && "🧪"}
                            {job.jobType.includes("Weed") && "🌿"}
                            {job.jobType.includes("Sow") && "🌱"}
                            {job.jobType.includes("Labour") && "🛠️"}
                            {!job.jobType.match(/Harvest|Spray|Weed|Sow|Labour/) && "🌾"}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-black text-base sm:text-lg text-stone-900 leading-tight">
                                {job.title}
                              </h4>
                              {job.urgency === "urgent" && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black flex items-center gap-0.5 border border-rose-200">
                                  <Zap size={10} />
                                  Urgent
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-bold text-stone-700 mt-0.5 flex items-center gap-1">
                              <span>{job.farmName}</span>
                              <span>•</span>
                              <span className="text-amber-700 font-black">★ {job.farmerRating || "4.8"}</span>
                            </p>

                            <div className="flex items-center gap-1 text-xs font-bold text-stone-600 mt-1">
                              <MapPin size={13} className="text-amber-600 shrink-0" />
                              <span>
                                {job.location} • {job.distanceKm} km away
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Pay Rate Badge */}
                        <div className="text-right shrink-0">
                          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono leading-none">
                            ₹{job.wagePerDay}
                          </div>
                          <span className="text-[10px] font-bold text-stone-700 uppercase">per day</span>
                        </div>
                      </div>

                      {/* Middle Row: Duration, Workers Needed, Food & Transport Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-stone-100 text-stone-800 flex items-center gap-1">
                          <Clock size={12} />
                          <span>{job.durationDays}</span>
                        </span>

                        <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                          <Users size={12} />
                          <span>{job.workersNeeded} Workers Needed</span>
                        </span>

                        {job.foodProvided && (
                          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                            <Utensils size={12} />
                            <span>{t.labour.foodProvided || "Free Food"}</span>
                          </span>
                        )}

                        {job.transportProvided && (
                          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1">
                            <Truck size={12} />
                            <span>Transport Provided</span>
                          </span>
                        )}
                      </div>

                      {/* Bottom Row: Actions (Listen Audio | Bookmark | Call | Apply) */}
                      <div
                        className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1.5">
                          <AudioButton
                            textToSpeak={`${job.title}. Daily pay is ${job.wagePerDay} rupees. ${
                              job.workersNeeded
                            } workers needed for ${job.durationDays}. Located at ${job.farmName} in ${
                              job.location
                            }, ${job.distanceKm} km away. ${
                              job.foodProvided ? "Free food provided." : ""
                            }`}
                            language={currentLanguage}
                            size="sm"
                            label="Listen"
                          />

                          <button
                            type="button"
                            onClick={(e) => handleToggleSave(job.id, e)}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                              isSaved
                                ? "bg-amber-100 text-amber-900 border-amber-300"
                                : "bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200"
                            }`}
                            title={isSaved ? "Saved" : "Save Job"}
                          >
                            {isSaved ? (
                              <BookmarkCheck size={16} className="text-amber-800" />
                            ) : (
                              <Bookmark size={16} />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleOpenCallModal(job, e)}
                            className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-black text-xs flex items-center gap-1.5 transition-all active:scale-95"
                          >
                            <PhoneCall size={14} className="text-amber-700" />
                            <span>Call</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleApply(job, e)}
                            className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                              isApplied
                                ? "bg-emerald-600 text-white"
                                : "bg-amber-600 hover:bg-amber-700 text-white"
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <Check size={14} className="stroke-[3]" />
                                <span>Applied</span>
                              </>
                            ) : (
                              <>
                                <Briefcase size={14} />
                                <span>Apply</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* =========================================================
              VIEW MODE: MAP VIEW (Interactive Rural Map Representation)
              ========================================================= */}
          {viewMode === "map" && (
            <div className="space-y-3">
              <div className="bg-emerald-950 text-white p-4 rounded-3xl shadow-md space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation size={18} className="text-emerald-400" />
                    <h4 className="font-black text-sm text-white">Rural Job Map • Ujjain Hub</h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-300">
                    {filteredJobs.length} Farms with Open Work
                  </span>
                </div>

                {/* SVG Rural Map Canvas */}
                <div className="relative w-full h-80 bg-stone-900 rounded-2xl border-2 border-emerald-800/60 overflow-hidden flex items-center justify-center p-4">
                  {/* Subtle Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

                  {/* Concentric Distance Rings */}
                  <div className="absolute w-64 h-64 rounded-full border border-emerald-500/20 pointer-events-none" />
                  <div className="absolute w-44 h-44 rounded-full border border-emerald-500/30 pointer-events-none" />
                  <div className="absolute w-24 h-24 rounded-full border border-emerald-500/40 pointer-events-none" />

                  <span className="absolute top-2 right-3 text-[10px] font-bold text-stone-400">
                    Radius: 10 km
                  </span>

                  {/* User Location Center Beacon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/40 animate-ping absolute" />
                    <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-black">
                      📍
                    </div>
                    <span className="text-[10px] font-black text-emerald-300 bg-stone-950/80 px-2 py-0.5 rounded-full mt-1 border border-emerald-600/50">
                      You (Gram Pipliya)
                    </span>
                  </div>

                  {/* Farm Pins with Dynamic Positions */}
                  {filteredJobs.map((job, idx) => {
                    const offsets = [
                      { top: "25%", left: "28%" },
                      { top: "30%", left: "75%" },
                      { top: "72%", left: "32%" },
                      { top: "68%", left: "70%" },
                      { top: "18%", left: "54%" },
                      { top: "82%", left: "50%" },
                    ];
                    const pos = offsets[idx % offsets.length];
                    const isSelected = mapSelectedJob?.id === job.id;

                    return (
                      <button
                        key={job.id}
                        type="button"
                        onClick={() => {
                          soundEffects.click();
                          setMapSelectedJob(job);
                        }}
                        style={{ top: pos.top, left: pos.left }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all transform hover:scale-110 flex flex-col items-center ${
                          isSelected ? "scale-115 z-40" : ""
                        }`}
                      >
                        <div
                          className={`px-2 py-1 rounded-xl font-black text-[11px] font-mono shadow-md flex items-center gap-1 border ${
                            isSelected
                              ? "bg-amber-400 text-stone-950 border-white ring-2 ring-amber-300"
                              : "bg-emerald-600 text-white border-emerald-400"
                          }`}
                        >
                          <span>🌾</span>
                          <span>₹{job.wagePerDay}</span>
                        </div>
                        <span className="text-[9px] font-bold text-stone-300 bg-stone-950/90 px-1.5 py-0.2 rounded mt-0.5 whitespace-nowrap">
                          {job.distanceKm} km
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Sheet Card Preview for Selected Pin on Map */}
                {mapSelectedJob && (
                  <div className="bg-white text-stone-900 p-4 rounded-2xl border-2 border-amber-400 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">🌾</span>
                          <h4 className="font-black text-base text-stone-900">
                            {mapSelectedJob.title}
                          </h4>
                        </div>
                        <p className="text-xs font-bold text-stone-700 mt-0.5">
                          {mapSelectedJob.farmName} • {mapSelectedJob.distanceKm} km away
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-700 font-mono">
                          ₹{mapSelectedJob.wagePerDay}
                        </div>
                        <span className="text-[10px] font-bold text-stone-600 uppercase">per day</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedJobForModal(mapSelectedJob)}
                        className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs text-center"
                      >
                        View Full Details
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenCallModal(mapSelectedJob)}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-black text-xs flex items-center gap-1.5"
                      >
                        <PhoneCall size={14} className="text-amber-700" />
                        <span>Call</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          TAB 2: APPLIED & SAVED JOBS
          ========================================================= */}
      {activeTab === "applied_saved" && (
        <div className="space-y-4">
          {/* Sub-tab toggle */}
          <div className="bg-white p-1 rounded-2xl border-2 border-stone-200 shadow-xs flex items-center">
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setAppliedSubTab("applied");
              }}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                appliedSubTab === "applied"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <CheckCircle2 size={16} />
              <span>Applied Jobs ({appliedJobIds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setAppliedSubTab("saved");
              }}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                appliedSubTab === "saved"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <Bookmark size={16} />
              <span>Saved Jobs ({savedJobIds.length})</span>
            </button>
          </div>

          {/* Sub-tab content: APPLIED JOBS */}
          {appliedSubTab === "applied" && (
            <div className="space-y-3">
              {appliedJobIds.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border-2 border-stone-200 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-500 text-3xl flex items-center justify-center mx-auto">
                    📝
                  </div>
                  <h4 className="text-base font-black text-stone-900">No applications yet</h4>
                  <p className="text-xs font-bold text-stone-600">
                    Browse the job feed and tap Apply to connect with farm owners.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("feed")}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-black text-xs"
                  >
                    Explore Farm Jobs
                  </button>
                </div>
              ) : (
                appliedJobIds.map((jobId) => {
                  const job = jobs.find((j) => j.id === jobId) || jobs[0];
                  // Demo status progression
                  const status = jobId === "job-002" ? "Accepted" : "Pending";

                  return (
                    <div
                      key={jobId}
                      className="p-5 rounded-3xl bg-white border-2 border-stone-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🌾</span>
                            <h4 className="font-black text-base text-stone-900">{job.title}</h4>
                          </div>
                          <p className="text-xs font-bold text-stone-700 mt-0.5">
                            {job.farmName} • {job.location}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {status === "Accepted" ? (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 size={13} className="text-emerald-700" />
                              <span>Accepted (Hired!)</span>
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1">
                              <Clock size={13} className="text-amber-700" />
                              <span>Pending Review</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-stone-700 pt-1">
                        <span>Daily Rate: ₹{job.wagePerDay}/day</span>
                        <span>Duration: {job.durationDays}</span>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedJobForModal(job)}
                          className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold"
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenCallModal(job)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <PhoneCall size={14} />
                          <span>Call Farmer ({job.farmerPhone || "+91 98260 11223"})</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Sub-tab content: SAVED JOBS */}
          {appliedSubTab === "saved" && (
            <div className="space-y-3">
              {savedJobIds.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border-2 border-stone-200 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-500 text-3xl flex items-center justify-center mx-auto">
                    🔖
                  </div>
                  <h4 className="text-base font-black text-stone-900">No saved jobs</h4>
                  <p className="text-xs font-bold text-stone-600">
                    Tap the bookmark icon on any job card to save it for later review.
                  </p>
                </div>
              ) : (
                savedJobIds.map((jobId) => {
                  const job = jobs.find((j) => j.id === jobId) || jobs[0];

                  return (
                    <div
                      key={jobId}
                      className="p-5 rounded-3xl bg-white border-2 border-stone-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🌾</span>
                            <h4 className="font-black text-base text-stone-900">{job.title}</h4>
                          </div>
                          <p className="text-xs font-bold text-stone-700 mt-0.5">
                            {job.farmName} • {job.location} ({job.distanceKm} km)
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-emerald-700 font-mono">
                            ₹{job.wagePerDay}
                          </div>
                          <span className="text-[10px] font-bold text-stone-600">per day</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleSave(job.id)}
                          className="text-xs font-bold text-rose-700 hover:text-rose-900 p-1"
                        >
                          Remove from Saved
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApply(job)}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <Briefcase size={14} />
                          <span>Apply Now</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          TAB 3: MY PROFILE (Ratings, Badges, Skills & Availability)
          ========================================================= */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          {/* Worker Profile Header Card */}
          <div className="bg-white p-5 rounded-3xl border-2 border-amber-400 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    userProfile.photoUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  }
                  alt={userProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-3xl object-cover border-4 border-amber-500 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-xs">
                  <ShieldCheck size={16} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-stone-900">{userProfile.name}</h3>
                  <span className="bg-emerald-100 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                    Aadhaar Verified
                  </span>
                </div>
                <p className="text-xs font-bold text-stone-700 mt-0.5">
                  {userProfile.phone || "+91 98765 43210"} • {userProfile.locationName}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} className="fill-amber-400 stroke-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs font-black text-stone-900">4.9 / 5.0</span>
                  <span className="text-xs font-bold text-stone-600">(28 completed jobs)</span>
                </div>
              </div>
            </div>

            {/* Daily Wage Expectation Stepper */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900 block">Expected Daily Wage</span>
                <span className="text-xs font-semibold text-amber-700">Shown to hiring farmers</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setDailyWage((w) => Math.max(400, w - 50));
                  }}
                  className="w-8 h-8 rounded-xl bg-white text-stone-900 font-black text-base border border-stone-300 flex items-center justify-center active:scale-95 shadow-xs"
                >
                  -
                </button>
                <span className="text-lg font-black text-stone-950 font-mono">₹{dailyWage}</span>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setDailyWage((w) => Math.min(1000, w + 50));
                  }}
                  className="w-8 h-8 rounded-xl bg-white text-stone-900 font-black text-base border border-stone-300 flex items-center justify-center active:scale-95 shadow-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Badges Earned (Trust-building) */}
          <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-amber-600" />
                <h4 className="font-black text-base text-stone-900">Earned Badges & Trust</h4>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Top Rated Worker
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { title: "Reliable Worker", desc: "20+ jobs on time", icon: "🏆" },
                { title: "Harvest Master", desc: "Expert wheat & soy", icon: "🌾" },
                { title: "Punctual", desc: "100% arrival rate", icon: "⏰" },
                { title: "Safety Certified", desc: "Sprayer certified", icon: "🧪" },
                { title: "5★ Team Lead", desc: "Manages 4 workers", icon: "👥" },
                { title: "Verified ID", desc: "Govt ID on file", icon: "🛡️" },
              ].map((badge) => (
                <div
                  key={badge.title}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-1"
                >
                  <span className="text-2xl block">{badge.icon}</span>
                  <div className="font-black text-xs text-stone-900 leading-tight">{badge.title}</div>
                  <div className="text-[11px] font-bold text-stone-600">{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Registered Skills (Editable) */}
          <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-base text-stone-900">Your Skills (हुनर)</h4>
                <p className="text-xs font-bold text-stone-600">Tap cards to add or remove skills</p>
              </div>
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                {mySkills.length} Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "Sowing", name: "Sowing (बुवाई)", icon: "🌱" },
                { id: "Harvesting", name: "Harvesting (कटाई)", icon: "🌾" },
                { id: "Spraying", name: "Spraying (छिड़काव)", icon: "🧪" },
                { id: "Weeding", name: "Weeding (निराई)", icon: "🌿" },
                { id: "General Labour", name: "General Labour (मजदूरी)", icon: "🛠️" },
                { id: "Tractor Driving", name: "Tractor Driving (ट्रैक्टर)", icon: "🚜" },
              ].map((skill) => {
                const isSelected = mySkills.includes(skill.id);

                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleToggleSkill(skill.id)}
                    className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between text-left active:scale-95 ${
                      isSelected
                        ? "bg-amber-50 border-amber-600 shadow-xs"
                        : "bg-white border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1 bg-stone-100 rounded-xl">{skill.icon}</span>
                      <span className="font-black text-xs text-stone-900">{skill.name}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? "bg-amber-600 border-amber-600 text-white" : "border-stone-400"
                      }`}
                    >
                      {isSelected && <Check size={12} className="stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability Calendar & Schedule (Editable) */}
          <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-xs space-y-3">
            <div>
              <h4 className="font-black text-base text-stone-900">Work Availability</h4>
              <p className="text-xs font-bold text-stone-600">
                Tap to update when you can take farm jobs
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                "Available Now / Today",
                "Available This Week",
                "Available Next Week",
                "Weekends Only",
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setAvailabilitySchedule(opt);
                  }}
                  className={`p-3 rounded-2xl border text-xs font-black transition-all ${
                    availabilitySchedule === opt
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                      : "bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 1: JOB DETAIL MODAL (Tap on card to open)
          ========================================================= */}
      {selectedJobForModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white text-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-400 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold shrink-0">
                  🌾
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 leading-tight">
                    {selectedJobForModal.title}
                  </h3>
                  <p className="text-xs font-bold text-stone-700 mt-0.5">
                    {selectedJobForModal.farmName} • {selectedJobForModal.location}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJobForModal(null)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Wage & Key Stats */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">Offered Daily Wage</span>
                <span className="text-xs font-semibold text-emerald-700">
                  Total for {selectedJobForModal.durationDays}: ₹
                  {(parseInt(selectedJobForModal.durationDays) || 4) * selectedJobForModal.wagePerDay}
                </span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-emerald-800 font-mono">
                  ₹{selectedJobForModal.wagePerDay}
                </div>
                <span className="text-[10px] font-bold text-stone-600 uppercase">per day</span>
              </div>
            </div>

            {/* Farmer Trust Card */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-700 block">Farmer Profile & Trust Info:</span>
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedJobForModal.farmerPhoto ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                  }
                  alt="Farmer"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-stone-300"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-black text-sm text-stone-900">
                      {selectedJobForModal.farmerName || "Suresh Choudhary"}
                    </h5>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.2 rounded-md">
                      ★ {selectedJobForModal.farmerRating || "4.8"}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-stone-600 mt-0.5">
                    Verified Landowner • 14 farm jobs completed
                  </p>
                </div>
              </div>
            </div>

            {/* Perks & Details */}
            <div className="space-y-2 text-xs font-bold text-stone-800">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-amber-600" />
                <span>
                  Dates Needed:{" "}
                  <strong className="text-stone-950">
                    {selectedJobForModal.datesNeeded || "Tomorrow - Friday (4 Days)"}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-amber-600" />
                <span>
                  Positions:{" "}
                  <strong className="text-stone-950">
                    {selectedJobForModal.workersNeeded} Workers (3 already applied)
                  </strong>
                </span>
              </div>
              {selectedJobForModal.foodProvided && (
                <div className="flex items-center gap-2 text-emerald-800">
                  <Utensils size={14} />
                  <span>Free Lunch, Morning Tea & Refreshments provided on farm</span>
                </div>
              )}
              {selectedJobForModal.transportProvided && (
                <div className="flex items-center gap-2 text-blue-800">
                  <Truck size={14} />
                  <span>Tractor pickup available at Village Chowk at 7:30 AM</span>
                </div>
              )}
            </div>

            {/* Spoken Advice */}
            <div className="pt-2">
              <AudioButton
                textToSpeak={`Job Details for ${selectedJobForModal.title}. Offered pay is ${
                  selectedJobForModal.wagePerDay
                } rupees per day. Farmer name is ${
                  selectedJobForModal.farmerName || "Suresh Choudhary"
                } with 4.8 star rating. ${
                  selectedJobForModal.foodProvided ? "Free lunch and tea provided." : ""
                }`}
                language={currentLanguage}
                size="sm"
                label="Listen Full Details"
              />
            </div>

            {/* Two Large Action Buttons */}
            <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  handleOpenCallModal(selectedJobForModal);
                  setSelectedJobForModal(null);
                }}
                className="py-3.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-black text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <PhoneCall size={18} className="text-amber-700" />
                <span>Call Farmer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleApply(selectedJobForModal);
                  setSelectedJobForModal(null);
                  setActiveTab("applied_saved");
                }}
                className="py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <Briefcase size={18} />
                <span>Apply for Job</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: CALL FARMER DIRECT DIALER MODAL
          ========================================================= */}
      {callFarmerModalJob && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white text-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-emerald-500 space-y-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 text-3xl flex items-center justify-center mx-auto shadow-xs">
              <PhoneCall size={32} />
            </div>

            <div>
              <h3 className="text-xl font-black text-stone-900">
                Call {callFarmerModalJob.farmerName || "Farmer"}
              </h3>
              <p className="text-xs font-bold text-stone-700 mt-1">
                {callFarmerModalJob.farmName} • {callFarmerModalJob.title}
              </p>
            </div>

            {/* Big Phone Number Box */}
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 font-mono text-2xl font-black text-stone-950 tracking-wider">
              {callFarmerModalJob.farmerPhone || "+91 98260 11223"}
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`tel:${callFarmerModalJob.farmerPhone || "9826011223"}`}
                onClick={() => {
                  soundEffects.success();
                  setCallFarmerModalJob(null);
                }}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                <span>Open Phone Dialer</span>
              </a>

              <button
                type="button"
                onClick={() => setCallFarmerModalJob(null)}
                className="w-full py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
