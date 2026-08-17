import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  PhoneCall,
  MessageSquare,
  Bot,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Camera,
  Cpu,
  Users,
  TrendingUp,
  PlusCircle,
  Droplet,
  Briefcase,
  Send,
  UserCheck,
  Megaphone,
  FileSpreadsheet,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Radio,
  BookOpen,
  Calendar,
  Layers,
  MapPin,
  Maximize2,
  SlidersHorizontal,
  DollarSign,
  Heart,
  Shield,
  Activity,
  AlertTriangle,
  CheckSquare,
  CornerDownRight,
  Zap,
  QrCode,
  Droplets,
  Store,
  Filter,
  BarChart3,
  Sun,
  Crosshair,
  List,
  Award,
  ToggleRight,
  FileText,
  Target,
  Edit3,
  PieChart,
  FolderCheck,
  Download,
  PhoneForwarded,
  Check,
} from "lucide-react";
import { LanguageCode, UserRole, UserProfile } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { soundEffects, speakText, stopSpeaking, isSpeaking } from "../../utils/audio";
import {
  HELPLINE_CONTACTS,
  WHATSAPP_SUPPORT,
  SMS_SUPPORT,
  AI_GUIDES,
  FAQS_DATA,
  GuideTopic,
  GuideStep,
  FaqItem,
  CallbackRequest,
  getRoleGuides,
  getFilteredFaqs,
} from "../../data/helpSupportData";

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  currentRole?: UserRole;
  userProfile?: UserProfile;
  onOpenAssistant: (prompt?: string, section?: string) => void;
  onNavigate?: (actionType: string) => void;
  onRoleChange?: (role: UserRole) => void;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  currentRole = "farmer",
  userProfile,
  onOpenAssistant,
  onNavigate,
  onRoleChange,
  onLanguageChange,
}) => {
  // Main Top-Level Sections: "helpline" | "guides" | "faqs"
  const [activeSection, setActiveSection] = useState<"helpline" | "guides" | "faqs">("helpline");

  // Filter & Search states
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole>(currentRole);
  const [faqCategory, setFaqCategory] = useState<"all" | "account" | "features" | "hardware" | "labour" | "general">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({ "faq-account-1": true });
  const [faqFeedback, setFaqFeedback] = useState<Record<string, "helpful" | "unhelpful">>({});

  // Active Walkthrough Guide Modal
  const [activeGuide, setActiveGuide] = useState<GuideTopic | null>(null);

  // Callback request form states
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false);
  const [callbackName, setCallbackName] = useState(userProfile?.name || "");
  const [callbackPhone, setCallbackPhone] = useState(userProfile?.phone || "");
  const [callbackTopic, setCallbackTopic] = useState("Crop Disease / Pest Advisory");
  const [callbackTimeSlot, setCallbackTimeSlot] = useState("Within 15-30 mins (Urgent)");
  const [callbackNotes, setCallbackNotes] = useState("");
  const [activeCallbackRequest, setActiveCallbackRequest] = useState<CallbackRequest | null>(null);
  const [callbackSuccessMsg, setCallbackSuccessMsg] = useState(false);

  // Audio Speech state
  const [speakingItemId, setSpeakingItemId] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const isHindi = currentLanguage === "hi";

  // Sync role filter with prop when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedRoleFilter(currentRole);
      if (userProfile?.name) setCallbackName(userProfile.name);
      if (userProfile?.phone) setCallbackPhone(userProfile.phone);

      // Load saved callback request from localStorage if any
      try {
        const saved = localStorage.getItem("agrivision_callback_req");
        if (saved) {
          setActiveCallbackRequest(JSON.parse(saved));
        }
      } catch (e) {
        // ignore
      }
    } else {
      stopSpeaking();
      setSpeakingItemId(null);
    }
  }, [isOpen, currentRole, userProfile]);

  if (!isOpen) return null;

  // Toggle FAQ accordion
  const toggleFaq = (id: string) => {
    soundEffects.click();
    setOpenFaqIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // FAQ feedback
  const handleFaqFeedback = (faqId: string, type: "helpful" | "unhelpful") => {
    soundEffects.click();
    setFaqFeedback((prev) => ({ ...prev, [faqId]: type }));
  };

  // Voice speech handler
  const handleToggleSpeak = (itemId: string, textToSpeak: string) => {
    if (speakingItemId === itemId) {
      stopSpeaking();
      setSpeakingItemId(null);
    } else {
      soundEffects.click();
      setSpeakingItemId(itemId);
      speakText(textToSpeak, currentLanguage, () => {
        setSpeakingItemId(null);
      });
    }
  };

  // Submit Callback Request
  const handleSubmitCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim() || callbackPhone.length < 10) {
      alert(isHindi ? "कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें" : "Please enter a valid 10-digit mobile number");
      return;
    }

    soundEffects.click();
    const req: CallbackRequest = {
      id: `KCC-${Date.now().toString().slice(-6)}`,
      name: callbackName || "Farmer",
      phone: callbackPhone,
      topic: callbackTopic,
      preferredTime: callbackTimeSlot,
      notes: callbackNotes,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "confirmed",
    };

    setActiveCallbackRequest(req);
    setIsCallbackFormOpen(false);
    setCallbackSuccessMsg(true);
    try {
      localStorage.setItem("agrivision_callback_req", JSON.stringify(req));
    } catch (e) {
      // ignore
    }

    const spokenText = isHindi
      ? `कॉल बैक अनुरोध स्वीकार कर लिया गया है। संदर्भ संख्या ${req.id}। हमारे किसान मित्र अधिकारी शीघ्र ही आपसे संपर्क करेंगे।`
      : `Callback request received. Ref ID ${req.id}. A Kisan Mitra agriculture officer will call your phone shortly.`;
    speakText(spokenText, currentLanguage);

    setTimeout(() => {
      setCallbackSuccessMsg(false);
    }, 6000);
  };

  // Cancel Callback Request
  const handleCancelCallback = () => {
    soundEffects.click();
    setActiveCallbackRequest(null);
    try {
      localStorage.removeItem("agrivision_callback_req");
    } catch (e) {
      // ignore
    }
  };

  // Map icon name to Lucide Icon component
  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "Camera":
        return <Camera className={className} />;
      case "ShieldAlert":
        return <ShieldAlertIcon className={className} />;
      case "Cpu":
        return <Cpu className={className} />;
      case "Sprout":
        return <SproutIcon className={className} />;
      case "Users":
        return <Users className={className} />;
      case "TrendingUp":
        return <TrendingUp className={className} />;
      case "PlusCircle":
        return <PlusCircle className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "Droplet":
        return <Droplet className={className} />;
      case "Briefcase":
        return <Briefcase className={className} />;
      case "Send":
        return <Send className={className} />;
      case "UserCheck":
        return <UserCheck className={className} />;
      case "Megaphone":
        return <Megaphone className={className} />;
      case "FileSpreadsheet":
        return <FileSpreadsheet className={className} />;
      case "Maximize2":
        return <Maximize2 className={className} />;
      case "CheckCircle":
        return <CheckCircle2 className={className} />;
      case "Volume2":
        return <Volume2 className={className} />;
      case "Activity":
        return <Activity className={className} />;
      case "AlertTriangle":
        return <AlertTriangle className={className} />;
      case "CheckSquare":
        return <CheckSquare className={className} />;
      case "CornerDownRight":
        return <CornerDownRight className={className} />;
      case "Zap":
        return <Zap className={className} />;
      case "QrCode":
        return <QrCode className={className} />;
      case "Droplets":
        return <Droplets className={className} />;
      case "Layers":
        return <Layers className={className} />;
      case "MapPin":
        return <MapPin className={className} />;
      case "Calendar":
        return <Calendar className={className} />;
      case "UserPlus":
        return <UserPlusIcon className={className} />;
      case "DollarSign":
        return <DollarSign className={className} />;
      case "Radio":
        return <Radio className={className} />;
      case "Store":
        return <Store className={className} />;
      case "Filter":
        return <Filter className={className} />;
      case "BarChart3":
        return <BarChart3 className={className} />;
      case "Sun":
        return <Sun className={className} />;
      case "Heart":
        return <Heart className={className} />;
      case "Crosshair":
        return <Crosshair className={className} />;
      case "Check":
        return <Check className={className} />;
      case "CloudRain":
        return <CloudRainIcon className={className} />;
      case "CheckCircle2":
        return <CheckCircle2 className={className} />;
      case "Shield":
        return <Shield className={className} />;
      case "List":
        return <List className={className} />;
      case "SlidersHorizontal":
        return <SlidersHorizontal className={className} />;
      case "Clock":
        return <Clock className={className} />;
      case "Award":
        return <Award className={className} />;
      case "ToggleRight":
        return <ToggleRight className={className} />;
      case "FileText":
        return <FileText className={className} />;
      case "Target":
        return <Target className={className} />;
      case "Edit3":
        return <Edit3 className={className} />;
      case "PieChart":
        return <PieChart className={className} />;
      case "FolderCheck":
        return <FolderCheck className={className} />;
      case "Download":
        return <Download className={className} />;
      default:
        return <HelpCircle className={className} />;
    }
  };

  // Filtered guides & FAQs
  const displayedGuides = getRoleGuides(selectedRoleFilter);
  const displayedFaqs = getFilteredFaqs(faqCategory, searchQuery, selectedRoleFilter);

  // Role display metadata
  const roleDisplay: Record<UserRole, { title: string; titleHi: string; icon: string; bg: string }> = {
    farmer: { title: "Farmer", titleHi: "किसान", icon: "🌾", bg: "bg-emerald-100 text-emerald-900 border-emerald-300" },
    gardener: { title: "Home Gardener", titleHi: "होम गार्डनर", icon: "🌱", bg: "bg-teal-100 text-teal-900 border-teal-300" },
    labour: { title: "Farm Labour", titleHi: "कृषि श्रमिक", icon: "🛠️", bg: "bg-amber-100 text-amber-900 border-amber-300" },
    fpo: { title: "FPO Manager", titleHi: "FPO प्रबंधक", icon: "🏢", bg: "bg-indigo-100 text-indigo-900 border-indigo-300" },
  };

  return createPortal(
    <div
      id="help-support-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEffects.click();
          stopSpeaking();
          onClose();
        }
      }}
    >
      <div
        id="help-support-modal-content"
        className="bg-stone-50 rounded-3xl shadow-2xl border border-stone-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-amber-300 shadow-inner">
              <HelpCircle size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                  {isHindi ? "सहायता एवं संपर्क केंद्र" : "Help & Support Center"}
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-300/40 text-emerald-100 uppercase tracking-wide">
                  24x7
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                {isHindi
                  ? "किसान कॉल सेंटर हेल्पलाइन, एआई गाइड व सामान्य प्रश्न"
                  : "National Kisan Helpline, In-App AI Guides & FAQs"}
              </p>
            </div>
          </div>
          <button
            id="close-help-modal-btn"
            type="button"
            onClick={() => {
              soundEffects.click();
              stopSpeaking();
              onClose();
            }}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 border border-white/20"
            title="Close Help Center"
          >
            <X size={20} />
          </button>
        </div>

        {/* Top-Level Structure: 3 Main Large Tappable Cards / Sections */}
        <div className="bg-white border-b border-stone-200 p-3 sm:p-4 shrink-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Section 1: Kisan Helpline Card */}
            <button
              id="help-tab-helpline"
              type="button"
              onClick={() => {
                soundEffects.click();
                setActiveSection("helpline");
              }}
              className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                activeSection === "helpline"
                  ? "bg-emerald-50/90 border-emerald-600 shadow-sm ring-2 ring-emerald-600/20"
                  : "bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-stone-700"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeSection === "helpline"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-stone-200/80 text-stone-700"
                  }`}
                >
                  <PhoneCall size={18} />
                </div>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Toll-Free
                </span>
              </div>
              <div>
                <div
                  className={`text-xs sm:text-sm font-extrabold line-clamp-1 ${
                    activeSection === "helpline" ? "text-emerald-900" : "text-stone-900"
                  }`}
                >
                  {isHindi ? "किसान हेल्पलाइन" : "Kisan Helpline"}
                </div>
                <div className="text-[10px] sm:text-[11px] text-stone-600 font-medium line-clamp-1">
                  {isHindi ? "फोन व व्हाट्सएप सहायता" : "Human / Phone Support"}
                </div>
              </div>
            </button>

            {/* Section 2: AI Guide Card */}
            <button
              id="help-tab-guides"
              type="button"
              onClick={() => {
                soundEffects.click();
                setActiveSection("guides");
              }}
              className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                activeSection === "guides"
                  ? "bg-teal-50/90 border-teal-600 shadow-sm ring-2 ring-teal-600/20"
                  : "bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-stone-700"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeSection === "guides"
                      ? "bg-teal-600 text-white shadow-xs"
                      : "bg-stone-200/80 text-stone-700"
                  }`}
                >
                  <BookOpen size={18} />
                </div>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800 border border-teal-200">
                  {displayedGuides.length} Guides
                </span>
              </div>
              <div>
                <div
                  className={`text-xs sm:text-sm font-extrabold line-clamp-1 ${
                    activeSection === "guides" ? "text-teal-900" : "text-stone-900"
                  }`}
                >
                  {isHindi ? "एआई गाइड" : "AI Guide"}
                </div>
                <div className="text-[10px] sm:text-[11px] text-stone-600 font-medium line-clamp-1">
                  {isHindi ? "स्टेप-बाय-स्टेप वॉकथ्रू" : "Interactive Walkthroughs"}
                </div>
              </div>
            </button>

            {/* Section 3: FAQs Card */}
            <button
              id="help-tab-faqs"
              type="button"
              onClick={() => {
                soundEffects.click();
                setActiveSection("faqs");
              }}
              className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                activeSection === "faqs"
                  ? "bg-indigo-50/90 border-indigo-600 shadow-sm ring-2 ring-indigo-600/20"
                  : "bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-stone-700"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeSection === "faqs"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-stone-200/80 text-stone-700"
                  }`}
                >
                  <HelpCircle size={18} />
                </div>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {displayedFaqs.length} Q&A
                </span>
              </div>
              <div>
                <div
                  className={`text-xs sm:text-sm font-extrabold line-clamp-1 ${
                    activeSection === "faqs" ? "text-indigo-900" : "text-stone-900"
                  }`}
                >
                  {isHindi ? "सामान्य प्रश्न (FAQs)" : "FAQs"}
                </div>
                <div className="text-[10px] sm:text-[11px] text-stone-600 font-medium line-clamp-1">
                  {isHindi ? "अक्सर पूछे जाने वाले सवाल" : "Answers by Category"}
                </div>
              </div>
            </button>
          </div>

          {/* Quick Role Scoper Selector */}
          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-stone-700 shrink-0">
              {isHindi ? "दिखाई जा रही सामग्री:" : "Showing Guides & Help for:"}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {(["farmer", "gardener", "labour", "fpo"] as UserRole[]).map((r) => {
                const meta = roleDisplay[r];
                const isSelected = selectedRoleFilter === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      setSelectedRoleFilter(r);
                    }}
                    className={`py-1 px-2.5 rounded-full font-bold text-[11px] transition-all flex items-center gap-1 border ${
                      isSelected
                        ? `${meta.bg} shadow-xs font-black`
                        : "bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-200"
                    }`}
                  >
                    <span>{meta.icon}</span>
                    <span>{isHindi ? meta.titleHi : meta.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* ========================================================================= */}
          {/* SECTION 1: KISAN HELPLINE (HUMAN / PHONE SUPPORT) */}
          {/* ========================================================================= */}
          {activeSection === "helpline" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Primary Call Kisan Helpline Hero Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-800 to-emerald-900 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-[11px] font-bold border border-emerald-300/30">
                        <ShieldCheck size={13} className="text-amber-300" />
                        <span>{isHindi ? "राष्ट्रीय कृषि हेल्पलाइन" : "Govt of India Official Helpline"}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black mt-1">
                        {isHindi ? "किसान कॉल सेंटर (KCC)" : "Kisan Call Centre (KCC)"}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-400 text-emerald-950 font-black text-xs">
                        {isHindi ? "खुला है • 6 AM – 10 PM" : "Open 6 AM – 10 PM"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
                    {isHindi
                      ? "कृषि विशेषज्ञों से फसल रोग, कीटनाशक मात्रा, मौसम चेतावनी व सरकारी योजनाओं पर तुरंत फोन पर बात करें।"
                      : "Direct toll-free consultation with certified agronomists for emergency crop issues, pest outbreaks, and government schemes."}
                  </p>

                  <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider">
                        {isHindi ? "टोल-फ्री फोन नंबर" : "Toll-Free Phone Number"}
                      </div>
                      <div className="text-2xl font-black tracking-wider text-amber-300">
                        1800-180-1551
                      </div>
                      <div className="text-[11px] text-emerald-100 font-semibold mt-0.5">
                        {isHindi
                          ? "🌐 हिंदी, अंग्रेजी, मराठी, तमिल, तेलुगु, पंजाबी सहित 9 भाषाओं में उपलब्ध"
                          : "🌐 Support available in Hindi, English, and regional Indian languages"}
                      </div>
                    </div>

                    <a
                      id="call-kisan-helpline-btn"
                      href="tel:18001801551"
                      onClick={() => soundEffects.click()}
                      className="w-full sm:w-auto py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
                    >
                      <PhoneCall size={18} />
                      <span>{isHindi ? "कॉल करें (Call Helpline)" : "Call Kisan Helpline"}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Secondary Helplines Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <PhoneCall size={14} className="text-emerald-700" />
                    {isHindi ? "विशिष्ट विशेषज्ञ हेल्पलाइन" : "Specialized Advisory Helplines"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* PM Fasal Bima */}
                  <div className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 shadow-2xs transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          {isHindi ? "बीमा व क्लेम" : "Crop Insurance"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleSpeak(
                              "pmfby-speak",
                              isHindi
                                ? "प्रधानमंत्री फसल बीमा योजना हेल्पलाइन 1800 200 5142 पर फसल नुकसान की सूचना 72 घंटे में दें।"
                                : "PM Fasal Bima Helpline 1800-200-5142 for crop damage claims within 72 hours."
                            )
                          }
                          className="p-1 text-stone-400 hover:text-stone-700"
                          title="Listen"
                        >
                          {speakingItemId === "pmfby-speak" ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                      </div>
                      <div className="font-bold text-sm text-stone-900 mt-1">
                        {isHindi ? "प्रधानमंत्री फसल बीमा (PMFBY)" : "PM Fasal Bima Yojana"}
                      </div>
                      <div className="text-xs text-stone-600 mt-0.5 line-clamp-2">
                        {isHindi
                          ? "बेमौसम बारिश या ओलावृष्टि से हुए नुकसान की सूचना 72 घंटे में दर्ज कराएं।"
                          : "Intimate crop loss due to unseasonal rain/hailstorm within 72 hours."}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div className="font-extrabold text-sm text-amber-700">1800-200-5142</div>
                      <a
                        href="tel:18002005142"
                        onClick={() => soundEffects.click()}
                        className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                      >
                        <PhoneCall size={13} />
                        <span>{isHindi ? "कॉल" : "Call"}</span>
                      </a>
                    </div>
                  </div>

                  {/* Soil & Fertilizer Desk */}
                  <div className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-teal-400 shadow-2xs transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                          {isHindi ? "मृदा व खाद सलाह" : "Soil & Nutrients"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleSpeak(
                              "soil-speak",
                              isHindi
                                ? "मृदा व उर्वरक विशेषज्ञ हेल्पलाइन 1800 110 180 पर NPK मात्रा व जैविक खाद की जानकारी लें।"
                                : "Soil & Fertilizer Helpdesk 1800-110-180 for NPK dosages and soil testing guidance."
                            )
                          }
                          className="p-1 text-stone-400 hover:text-stone-700"
                          title="Listen"
                        >
                          {speakingItemId === "soil-speak" ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                      </div>
                      <div className="font-bold text-sm text-stone-900 mt-1">
                        {isHindi ? "मृदा व उर्वरक सहायता डेस्क" : "Soil Health & Nutrient Desk"}
                      </div>
                      <div className="text-xs text-stone-600 mt-0.5 line-clamp-2">
                        {isHindi
                          ? "मिट्टी जांच, NPK अनुपात, यूरिया व जैविक खाद की सही मात्रा जानें।"
                          : "Guidance on Soil Health Card, balanced NPK dosing, and nano urea."}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div className="font-extrabold text-sm text-teal-700">1800-110-180</div>
                      <a
                        href="tel:1800110180"
                        onClick={() => soundEffects.click()}
                        className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                      >
                        <PhoneCall size={13} />
                        <span>{isHindi ? "कॉल" : "Call"}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp & SMS Alternative Options */}
              <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <MessageSquare size={15} className="text-emerald-700" />
                    <span>{isHindi ? "व्हाट्सएप व एसएमएस संदेश सहायता" : "WhatsApp & SMS Support Options"}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-semibold">
                    {isHindi ? "यदि कॉल नहीं करना चाहते" : "Text Alternatives"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* WhatsApp Support */}
                  <a
                    id="help-whatsapp-btn"
                    href={`https://wa.me/${WHATSAPP_SUPPORT.phone}?text=${encodeURIComponent(
                      isHindi ? WHATSAPP_SUPPORT.defaultTextHi : WHATSAPP_SUPPORT.defaultText
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEffects.click()}
                    className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        WA
                      </div>
                      <div>
                        <div className="text-xs font-black group-hover:text-emerald-950">
                          {isHindi ? "व्हाट्सएप पर चैट करें" : "Chat on WhatsApp"}
                        </div>
                        <div className="text-[10px] text-emerald-700">{WHATSAPP_SUPPORT.displayNumber}</div>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  {/* SMS Support */}
                  <a
                    id="help-sms-btn"
                    href={`sms:${SMS_SUPPORT.number}?body=${encodeURIComponent(SMS_SUPPORT.defaultBody)}`}
                    onClick={() => soundEffects.click()}
                    className="p-3 rounded-xl bg-stone-50 hover:bg-stone-200/70 border border-stone-300 text-stone-900 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-stone-700 text-white flex items-center justify-center font-bold text-xs">
                        SMS
                      </div>
                      <div>
                        <div className="text-xs font-black group-hover:text-stone-950">
                          {isHindi ? "एसएमएस से सवाल भेजें" : "Send SMS Query"}
                        </div>
                        <div className="text-[10px] text-stone-600">{SMS_SUPPORT.number}</div>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-stone-700 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Request a Callback Option */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                      <PhoneForwarded size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-stone-900">
                        {isHindi ? "कॉल बैक का अनुरोध करें (Request a Callback)" : "Request a Callback"}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {isHindi
                          ? "कमजोर नेटवर्क होने पर फॉर्म भरें, सहायता टीम आपको खुद फोन करेगी"
                          : "For poor network areas — submit details and our support officer will call you back"}
                      </p>
                    </div>
                  </div>
                  {!isCallbackFormOpen && !activeCallbackRequest && (
                    <button
                      id="open-callback-form-btn"
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setIsCallbackFormOpen(true);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition-all"
                    >
                      {isHindi ? "फॉर्म भरें" : "Request Now"}
                    </button>
                  )}
                </div>

                {/* Active Callback Status Banner */}
                {activeCallbackRequest && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span className="font-extrabold text-xs">
                          {isHindi ? "कॉल बैक अनुरोध सक्रिय है" : "Callback Request Active"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        Ref: {activeCallbackRequest.id}
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      {isHindi
                        ? `हमारे कृषि अधिकारी श्री ${activeCallbackRequest.name} को फोन नंबर ${activeCallbackRequest.phone} पर ${activeCallbackRequest.preferredTime} में संपर्क करेंगे।`
                        : `Our agricultural specialist will call ${activeCallbackRequest.name} at ${activeCallbackRequest.phone} (${activeCallbackRequest.preferredTime}).`}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-amber-800 font-semibold">
                        Topic: {activeCallbackRequest.topic}
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelCallback}
                        className="text-rose-700 font-bold hover:underline"
                      >
                        {isHindi ? "अनुरोध रद्द करें" : "Cancel Request"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Callback Form Drawer */}
                {isCallbackFormOpen && (
                  <form onSubmit={handleSubmitCallback} className="pt-2 border-t border-stone-100 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {isHindi ? "आपका नाम (Name)" : "Your Name"}
                        </label>
                        <input
                          type="text"
                          value={callbackName}
                          onChange={(e) => setCallbackName(e.target.value)}
                          placeholder="Farmer Name"
                          className="w-full py-2 px-3 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {isHindi ? "मोबाइल नंबर (Phone Number)" : "Phone Number"}
                        </label>
                        <input
                          type="tel"
                          value={callbackPhone}
                          onChange={(e) => setCallbackPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full py-2 px-3 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {isHindi ? "समस्या का विषय (Topic)" : "Query Topic"}
                        </label>
                        <select
                          value={callbackTopic}
                          onChange={(e) => setCallbackTopic(e.target.value)}
                          className="w-full py-2 px-3 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium text-stone-800"
                        >
                          <option value="Crop Disease / Pest Advisory">Crop Disease / Pest Urgent Help</option>
                          <option value="Soil Sensor & IoT Connection">Soil Sensor & IoT Connection</option>
                          <option value="Fertilizer / NPK Schedule">Fertilizer & NPK Dosage Plan</option>
                          <option value="Mandi Prices & Selling Advice">Mandi Rates & Selling</option>
                          <option value="PM Fasal Bima Insurance Claim">PM Fasal Bima / Insurance Claim</option>
                          <option value="Labour Marketplace Query">Labour Marketplace Query</option>
                          <option value="App Feature / General Help">App Feature / General Help</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {isHindi ? "कॉल का समय (Preferred Time Slot)" : "Preferred Time Slot"}
                        </label>
                        <select
                          value={callbackTimeSlot}
                          onChange={(e) => setCallbackTimeSlot(e.target.value)}
                          className="w-full py-2 px-3 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium text-stone-800"
                        >
                          <option value="Within 15-30 mins (Urgent)">Within 15-30 mins (Urgent)</option>
                          <option value="Morning (8 AM – 12 PM)">Morning (8 AM – 12 PM)</option>
                          <option value="Afternoon (12 PM – 4 PM)">Afternoon (12 PM – 4 PM)</option>
                          <option value="Evening (4 PM – 8 PM)">Evening (4 PM – 8 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {isHindi ? "अतिरिक्त विवरण / टिप्पणी (Optional Note)" : "Brief Description / Note (Optional)"}
                      </label>
                      <input
                        type="text"
                        value={callbackNotes}
                        onChange={(e) => setCallbackNotes(e.target.value)}
                        placeholder="e.g. Wheat leaves turning yellow with spots..."
                        className="w-full py-2 px-3 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          soundEffects.click();
                          setIsCallbackFormOpen(false);
                        }}
                        className="py-2 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs"
                      >
                        {isHindi ? "रद्द करें" : "Cancel"}
                      </button>
                      <button
                        id="submit-callback-req-btn"
                        type="submit"
                        className="py-2 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Send size={14} />
                        <span>{isHindi ? "अनुरोध भेजें" : "Submit Callback Request"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: AI GUIDE (ROLE-SCOPED FEATURE WALKTHROUGHS) */}
          {/* ========================================================================= */}
          {activeSection === "guides" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                    <BookOpen size={16} className="text-teal-700" />
                    <span>
                      {isHindi
                        ? `${roleDisplay[selectedRoleFilter].titleHi} के लिए एआई गाइड`
                        : `Interactive Feature Guides for ${roleDisplay[selectedRoleFilter].title}`}
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    {isHindi
                      ? "ऐप की सुविधाओं को आसानी से समझने के लिए किसी भी विषय पर टैप करें"
                      : "Tap any topic to see step-by-step visual instructions with voice read-aloud"}
                  </p>
                </div>
              </div>

              {/* Guide Topics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayedGuides.map((guide) => {
                  return (
                    <div
                      key={guide.id}
                      className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                      onClick={() => {
                        soundEffects.click();
                        setActiveGuide(guide);
                      }}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            {renderIcon(guide.iconName, "w-5 h-5")}
                          </div>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                            {guide.steps.length} Steps • {guide.estimatedMinutes} min
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-stone-900 group-hover:text-teal-900 leading-snug">
                            {isHindi ? guide.titleHi : guide.title}
                          </h4>
                          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                            {isHindi ? guide.shortDescHi : guide.shortDesc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-teal-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>{isHindi ? "गाइड देखें" : "View Steps"}</span>
                          <ArrowRight size={13} />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundEffects.click();
                            onClose();
                            onOpenAssistant(isHindi ? guide.aiPromptHi : guide.aiPrompt);
                          }}
                          className="py-1 px-2.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-[11px] flex items-center gap-1"
                          title="Ask AI directly"
                        >
                          <Bot size={13} />
                          <span>{isHindi ? "एआई से पूछें" : "Ask AI"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fast Direct AI Copilot Prompt Launcher */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-amber-300 shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">
                      {isHindi ? "अपनी भाषा में बोलकर सवाल पूछें" : "Need more specific help? Ask AgriVision AI"}
                    </h4>
                    <p className="text-xs text-emerald-100">
                      {isHindi
                        ? "बोलकर या लिखकर कोई भी कृषि सवाल 24/7 पूछें"
                        : "Ask anything conversationally in your native voice or text"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    onClose();
                    onOpenAssistant(
                      isHindi
                        ? "नमस्ते! मुझे ऐप का उपयोग करने में सहायता चाहिए।"
                        : "Hello! I need assistance navigating and using AgriVision features."
                    );
                  }}
                  className="w-full sm:w-auto py-2 px-4 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs flex items-center justify-center gap-2 shadow-xs shrink-0"
                >
                  <Bot size={15} />
                  <span>{isHindi ? "एआई साथी से बात करें" : "Open AI Voice Copilot"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: FAQS (ORGANIZED BY TOPIC ACCORDION) */}
          {/* ========================================================================= */}
          {activeSection === "faqs" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Search Bar & Categories */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isHindi
                        ? "सवाल खोजें (उदा. ओटीपी, सेंसर, रिस्क स्कोर, मुफ्त)..."
                        : "Search FAQs (e.g. OTP, sensor, risk score, free, offline)..."
                    }
                    className="w-full py-2.5 pl-10 pr-4 text-xs sm:text-sm rounded-2xl bg-white border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-stone-900 shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: "all", label: "All Questions", labelHi: "सभी प्रश्न" },
                    { id: "account", label: "Account & Login", labelHi: "खाता व लॉगिन" },
                    { id: "features", label: "App Features", labelHi: "ऐप फीचर्स" },
                    { id: "hardware", label: "Hardware & Sensors", labelHi: "सेंसर किट" },
                    { id: "labour", label: "Labour Marketplace", labelHi: "मजदूर बाजार" },
                    { id: "general", label: "General & Privacy", labelHi: "सुरक्षा व अन्य" },
                  ].map((cat) => {
                    const isSelected = faqCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          soundEffects.click();
                          setFaqCategory(cat.id as any);
                        }}
                        className={`py-1.5 px-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all border ${
                          isSelected
                            ? "bg-indigo-700 text-white border-indigo-800 shadow-xs"
                            : "bg-white hover:bg-stone-100 text-stone-700 border-stone-200"
                        }`}
                      >
                        {isHindi ? cat.labelHi : cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FAQ Accordion List */}
              <div className="space-y-2.5">
                {displayedFaqs.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 space-y-2">
                    <HelpCircle size={28} className="mx-auto text-stone-300" />
                    <p className="text-xs font-bold text-stone-600">
                      {isHindi ? "कोई प्रश्न नहीं मिला" : "No questions matched your search query"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setFaqCategory("all");
                      }}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      {isHindi ? "फ़िल्टर रीसेट करें" : "Reset Filters"}
                    </button>
                  </div>
                ) : (
                  displayedFaqs.map((faq) => {
                    const isOpen = !!openFaqIds[faq.id];
                    const feedback = faqFeedback[faq.id];
                    const questionText = isHindi ? faq.questionHi : faq.question;
                    const answerText = isHindi ? faq.answerHi : faq.answer;

                    return (
                      <div
                        key={faq.id}
                        className={`border rounded-2xl overflow-hidden transition-all bg-white ${
                          isOpen ? "border-indigo-300 shadow-xs" : "border-stone-200"
                        }`}
                      >
                        {/* FAQ Question Button */}
                        <button
                          type="button"
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-stone-50/80 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 flex-1">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                                isOpen ? "bg-indigo-100 text-indigo-800" : "bg-stone-100 text-stone-500"
                              }`}
                            >
                              Q
                            </div>
                            <span className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                              {questionText}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isOpen ? (
                              <ChevronUp size={18} className="text-indigo-600" />
                            ) : (
                              <ChevronDown size={18} className="text-stone-400" />
                            )}
                          </div>
                        </button>

                        {/* FAQ Answer Body */}
                        {isOpen && (
                          <div className="p-4 pt-1 bg-stone-50/60 border-t border-stone-100 space-y-3">
                            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                              {answerText}
                            </p>

                            {/* Actions & Feedback Row */}
                            <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between flex-wrap gap-2 text-xs">
                              {/* Voice Read Aloud */}
                              <button
                                type="button"
                                onClick={() => handleToggleSpeak(faq.id, `${questionText}. ${answerText}`)}
                                className={`py-1 px-2.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors ${
                                  speakingItemId === faq.id
                                    ? "bg-indigo-600 text-white animate-pulse"
                                    : "bg-white hover:bg-stone-200 text-stone-700 border border-stone-200"
                                }`}
                              >
                                {speakingItemId === faq.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                                <span>
                                  {speakingItemId === faq.id
                                    ? isHindi
                                      ? "रोकें"
                                      : "Stop"
                                    : isHindi
                                    ? "आवाज़ में सुनें"
                                    : "Read Aloud"}
                                </span>
                              </button>

                              {/* Was this helpful thumbs up/down */}
                              <div className="flex items-center gap-2 text-stone-500">
                                <span className="text-[11px] font-semibold">
                                  {isHindi ? "क्या यह मददगार था?" : "Was this helpful?"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleFaqFeedback(faq.id, "helpful")}
                                  className={`p-1 rounded-md transition-colors ${
                                    feedback === "helpful"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "hover:bg-stone-200 text-stone-500"
                                  }`}
                                  title="Yes, helpful"
                                >
                                  <ThumbsUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleFaqFeedback(faq.id, "unhelpful")}
                                  className={`p-1 rounded-md transition-colors ${
                                    feedback === "unhelpful"
                                      ? "bg-rose-100 text-rose-800"
                                      : "hover:bg-stone-200 text-stone-500"
                                  }`}
                                  title="Not helpful"
                                >
                                  <ThumbsDown size={14} />
                                </button>
                                {feedback && (
                                  <span className="text-[10px] text-emerald-700 font-bold ml-1">
                                    {isHindi ? "धन्यवाद!" : "Thanks!"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Still Need Help? Bottom Link Banner */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <div className="font-extrabold text-xs sm:text-sm">
                    {isHindi ? "क्या आपका सवाल यहां नहीं मिला?" : "Still need help with your issue?"}
                  </div>
                  <div className="text-[11px] text-indigo-800 mt-0.5">
                    {isHindi
                      ? "किसान हेल्पलाइन पर सीधे बात करें या एआई कृषि साथी से पूछें।"
                      : "Connect directly with our Kisan Helpline specialists or AI Assistant."}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      setActiveSection("helpline");
                    }}
                    className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <PhoneCall size={14} />
                    <span>{isHindi ? "हेल्पलाइन कॉल" : "Call Helpline"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      onClose();
                      onOpenAssistant(
                        isHindi
                          ? "मुझे इस बारे में सहायता चाहिए..."
                          : "I need help with a question not listed in FAQs."
                      );
                    }}
                    className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Bot size={14} />
                    <span>{isHindi ? "एआई से पूछें" : "Ask AI"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-bold">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span>{isHindi ? "कृषि एवं किसान कल्याण मंत्रालय समर्थित" : "Ministry of Agriculture Grounded"}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              stopSpeaking();
              onClose();
            }}
            className="py-2 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all active:scale-95 shadow-2xs"
          >
            {t.common.close}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GUIDE WALKTHROUGH POPUP MODAL (<5 STEPS VIEWER) */}
      {/* ========================================================================= */}
      {activeGuide && (
        <div
          id="guide-walkthrough-backdrop"
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              soundEffects.click();
              stopSpeaking();
              setActiveGuide(null);
            }
          }}
        >
          <div
            id="guide-walkthrough-content"
            className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
          >
            {/* Guide Header */}
            <div className="bg-gradient-to-r from-teal-800 to-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-amber-300">
                  {renderIcon(activeGuide.iconName, "w-5 h-5")}
                </div>
                <div>
                  <div className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/20 text-teal-100 uppercase tracking-wider inline-block">
                    {activeGuide.category} • {activeGuide.steps.length} Steps
                  </div>
                  <h3 className="text-base sm:text-lg font-black leading-tight mt-0.5">
                    {isHindi ? activeGuide.titleHi : activeGuide.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.click();
                  stopSpeaking();
                  setActiveGuide(null);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Guide Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <p className="text-xs text-stone-600 font-medium">
                  {isHindi ? activeGuide.shortDescHi : activeGuide.shortDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const fullText = `${isHindi ? activeGuide.titleHi : activeGuide.title}. ${activeGuide.steps
                      .map((s) => `Step ${s.stepNumber}: ${isHindi ? s.titleHi : s.title}. ${isHindi ? s.descriptionHi : s.description}`)
                      .join(". ")}`;
                    handleToggleSpeak(`guide-${activeGuide.id}`, fullText);
                  }}
                  className={`p-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 ml-2 transition-all ${
                    speakingItemId === `guide-${activeGuide.id}`
                      ? "bg-teal-600 text-white animate-pulse"
                      : "bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200"
                  }`}
                  title="Read Aloud Entire Guide"
                >
                  {speakingItemId === `guide-${activeGuide.id}` ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  <span className="hidden sm:inline">
                    {speakingItemId === `guide-${activeGuide.id}` ? "Stop" : "Read Aloud"}
                  </span>
                </button>
              </div>

              {/* Steps List (< 5 steps) */}
              <div className="space-y-3">
                {activeGuide.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3 relative group"
                  >
                    <div className="w-7 h-7 rounded-xl bg-teal-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-extrabold text-xs sm:text-sm text-stone-900 flex items-center justify-between">
                        <span>{isHindi ? step.titleHi : step.title}</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-medium">
                        {isHindi ? step.descriptionHi : step.description}
                      </p>
                      {(step.tip || step.tipHi) && (
                        <div className="mt-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 font-semibold flex items-center gap-1.5">
                          <Sparkles size={13} className="text-amber-600 shrink-0" />
                          <span>{isHindi ? step.tipHi : step.tip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guide Footer Actions */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => {
                  soundEffects.click();
                  stopSpeaking();
                  setActiveGuide(null);
                  onClose();
                  onOpenAssistant(isHindi ? activeGuide.aiPromptHi : activeGuide.aiPrompt);
                }}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-300"
              >
                <Bot size={15} />
                <span>{isHindi ? "एआई से सवाल पूछें" : "Ask Follow-up in AI"}</span>
              </button>

              <button
                id="launch-guide-feature-btn"
                type="button"
                onClick={() => {
                  soundEffects.click();
                  stopSpeaking();
                  setActiveGuide(null);
                  onClose();
                  if (onNavigate) {
                    onNavigate(activeGuide.navigateAction);
                  }
                }}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <span>{isHindi ? "सीधे यह सुविधा खोलें" : "Launch Feature Now"}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

// Fallback Icon helpers
function ShieldAlertIcon(props: { className?: string }) {
  return <ShieldCheck {...props} />;
}
function SproutIcon(props: { className?: string }) {
  return <PlusCircle {...props} />;
}
function UserPlusIcon(props: { className?: string }) {
  return <Users {...props} />;
}
function CloudRainIcon(props: { className?: string }) {
  return <Droplets {...props} />;
}
