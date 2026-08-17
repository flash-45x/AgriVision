import React, { useState, useEffect, useRef } from "react";
import {
  Globe,
  Phone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Sprout,
  Users,
  Briefcase,
  ChevronRight,
  RotateCcw,
  Check,
  Loader2,
  Building,
  Volume2,
  Mic,
  MicOff,
  Camera,
  Calendar as CalendarIcon,
  Star,
  ShieldCheck,
  Smile,
  X,
} from "lucide-react";
import { UserRole, LanguageCode, UserProfile } from "../../types";
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from "../../data/translations";
import { AudioButton } from "../common/AudioButton";
import { LanguageSelectionScreen } from "../common/LanguageSelectionScreen";
import { soundEffects, speakText, createSpeechRecognizer } from "../../utils/audio";
import { FpoSetupWizard } from "./FpoSetupWizard";
import { AgriVisionLogo } from "../common/AgriVisionLogo";

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  currentLanguage,
  onLanguageChange,
}) => {
  // Step flow: 'splash' -> 'language' -> 'login' -> 'otp' -> 'role' -> ('labour_setup' | 'fpo_setup' | 'gardener_setup' | 'quicksetup')
  const [step, setStep] = useState<"splash" | "language" | "login" | "otp" | "role" | "labour_setup" | "fpo_setup" | "gardener_setup" | "quicksetup">("splash");

  // Labour step index: 1 = Name, 2 = Location, 3 = Skills, 4 = Availability, 5 = Photo
  const [labourStep, setLabourStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Gardener step index: 1 = Name, 2 = Location, 3 = What growing, 4 = Where growing, 5 = Experience
  const [gardenerStep, setGardenerStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedGardenerPlants, setSelectedGardenerPlants] = useState<string[]>([
    "Tomato",
    "Mint (Pudina)",
    "Holy Basil (Tulsi)",
  ]);
  const [gardenerLocationType, setGardenerLocationType] = useState<string>("Balcony");
  const [gardenerExperience, setGardenerExperience] = useState<string>("Some experience");

  // Phone & OTP state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [autoFillDetected, setAutoFillDetected] = useState(false);

  // Role & Profile setup states
  const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");
  const [userName, setUserName] = useState("");
  const [isListeningName, setIsListeningName] = useState(false);
  const [locationName, setLocationName] = useState("Gram Pipliya, Ujjain Rural (MP)");
  const [landSize, setLandSize] = useState("2-5 Acres");
  const [selectedCrop, setSelectedCrop] = useState("Wheat & Soybean");

  // Labour specific quick setup state
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Harvesting", "Sowing"]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>("Available Now / Today");
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  );
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // 30-second Countdown Timer for OTP Resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Simulate auto-detecting incoming SMS code after 2 seconds on OTP step
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (step === "otp") {
      timeout = setTimeout(() => {
        setAutoFillDetected(true);
      }, 2000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [step]);

  // Big Numeric Keypad press handler
  const handleKeypadPress = (num: string) => {
    soundEffects.tap();
    if (step === "login") {
      if (phone.length < 10) {
        setPhone((prev) => prev + num);
      }
    } else if (step === "otp") {
      const nextIndex = otp.findIndex((val) => val === "");
      if (nextIndex !== -1) {
        const newOtp = [...otp];
        newOtp[nextIndex] = num;
        setOtp(newOtp);
      }
    }
  };

  const handleKeypadBackspace = () => {
    soundEffects.tap();
    if (step === "login") {
      setPhone((prev) => prev.slice(0, -1));
    } else if (step === "otp") {
      const filledIndices = otp
        .map((v, i) => (v !== "" ? i : -1))
        .filter((i) => i !== -1);
      if (filledIndices.length > 0) {
        const lastIdx = filledIndices[filledIndices.length - 1];
        const newOtp = [...otp];
        newOtp[lastIdx] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleApplyAutoFill = () => {
    soundEffects.success();
    setOtp(["5", "5", "7", "7"]);
    setAutoFillDetected(false);
  };

  const handleResendOtp = () => {
    soundEffects.click();
    setResendTimer(30);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    setAutoFillDetected(true);
    speakText("New OTP sent via SMS", currentLanguage);
  };

  const handleVerifyOtp = () => {
    soundEffects.click();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      soundEffects.success();

      setTimeout(() => {
        setStep("role");
        setVerificationSuccess(false);
      }, 1000);
    }, 900);
  };

  // Toggle skill selection for Labour
  const toggleSkill = (skill: string) => {
    soundEffects.click();
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Voice name input handler
  const handleStartVoiceName = () => {
    soundEffects.click();
    setIsListeningName(true);
    speakText("Please say your name", currentLanguage, () => {
      // Simulate/trigger speech recognition
      const names = ["Ramesh Patel", "Sunil Kumar", "Vikram Rathore", "Kailash Verma"];
      setTimeout(() => {
        setIsListeningName(false);
        const recognized = names[Math.floor(Math.random() * names.length)];
        setUserName(recognized);
        soundEffects.success();
        speakText(`Name registered as ${recognized}`, currentLanguage);
      }, 2000);
    });
  };

  const getVoiceInstruction = (currentStep: string) => {
    switch (currentStep) {
      case "splash":
        return `${t.appName}. ${t.tagline}. Press Get Started to begin.`;
      case "language":
        return "Please select your language. अपनी भाषा चुनें।";
      case "login":
        return "Enter your ten digit mobile number and tap Send OTP. अपना मोबाइल नंबर दर्ज करें।";
      case "otp":
        return "Enter the four digit code sent to your phone or tap auto-fill. चार अंकों का ओटीपी दर्ज करें।";
      case "role":
        return "Choose your role: Farmer, Home Gardener, Looking for Work, or FPO. अपनी भूमिका चुनें।";
      case "labour_name":
        return "What is your name? You can speak or type your name. अपना नाम बोलें या लिखें।";
      case "labour_location":
        return "GPS location detected. Tap confirm to lock your location. जीपीएस स्थान की पुष्टि करें।";
      case "labour_skills":
        return "Select the farm skills you know: Sowing, Harvesting, Spraying, Weeding, or General Labour.";
      case "labour_availability":
        return "When are you available to work? Tap Available Now, This Week, or pick dates.";
      case "labour_photo":
        return "Take or choose a profile photo for farmer trust, or skip to continue.";
      default:
        return "Welcome to AgriVision.";
    }
  };

  const completeLabourSetup = () => {
    soundEffects.success();
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: userName.trim() || "Ramesh Patel",
      phone: phone || "9876543210",
      role: "labour",
      language: currentLanguage,
      locationName,
      landSizeAcre: "None",
      primaryCrop: "Agricultural Labour",
      skills: selectedSkills,
      isRegistered: true,
      isAvailableForWork: selectedAvailability.includes("Available"),
      dailyRateWage: 550,
      hasIoTDevice: false,
      farmRiskScore: 10,
      photoUrl: selectedPhotoUrl,
      rating: 4.9,
      ratingCount: 28,
      badges: ["Reliable Worker", "Harvest Master", "Punctual", "Verified Aadhaar"],
      availabilityPeriod: selectedAvailability,
      savedJobIds: ["job-001"],
      appliedJobs: [
        {
          jobId: "job-002",
          appliedDate: "Yesterday",
          status: "Accepted",
        },
      ],
    };
    onComplete(newProfile);
  };

  // ==========================================
  // SCREEN 1: SPLASH SCREEN
  // ==========================================
  if (step === "splash") {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-between p-6 pb-12 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 via-stone-950 to-stone-900 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm flex items-center justify-between relative z-10 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Rural AI Assistant</span>
          </div>

          <AudioButton
            textToSpeak={getVoiceInstruction("splash")}
            language={currentLanguage}
            size="sm"
          />
        </div>

        <div className="flex flex-col items-center text-center space-y-6 max-w-sm my-auto relative z-10">
          {/* Centered Primary Placement for AgriVision Logo */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-[36px] blur-xl group-hover:bg-emerald-500/30 transition-all" />
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-[32px] bg-white p-4 shadow-2xl shadow-emerald-950/80 flex items-center justify-center border-2 border-emerald-400/60 transform transition-transform hover:scale-105">
              <AgriVisionLogo size={96} animated={false} id="splash-agrivision-logo" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
              Agri<span className="text-emerald-400">Vision</span>
            </h1>
            <p className="text-base sm:text-lg font-bold text-stone-300">
              {t.tagline || "Your Farming Assistant"}
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3 relative z-10">
          <button
            id="splash-get-started-btn"
            type="button"
            onClick={() => {
              soundEffects.success();
              setStep("language");
            }}
            className="w-full py-5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xl shadow-xl shadow-emerald-950/50 active:scale-98 transition-all flex items-center justify-center gap-3"
          >
            <span>{t.getStarted || "Get Started"}</span>
            <ArrowRight size={24} className="stroke-[3]" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // SCREEN 2: LANGUAGE SELECTION (VISUAL TILES)
  // ==========================================
  if (step === "language") {
    return (
      <LanguageSelectionScreen
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => onLanguageChange(lang)}
        onContinue={() => setStep("login")}
      />
    );
  }

  // ==========================================
  // SCREEN 3: MOBILE NUMBER ENTRY
  // ==========================================
  if (step === "login") {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col p-4 sm:p-6 justify-between max-w-md mx-auto w-full">
        <div className="w-full pt-2">
          {/* Top Brand Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80">
            <div className="flex items-center gap-2">
              <AgriVisionLogo size={30} />
              <div>
                <span className="font-extrabold text-base tracking-tight text-emerald-950 block leading-tight">
                  Agri<span className="text-emerald-600">Vision</span>
                </span>
                <span className="text-[10px] font-bold text-stone-700">Rural Copilot</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setStep("language");
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-xs font-bold text-emerald-800 hover:bg-emerald-50 active:scale-95"
            >
              <Globe size={13} />
              <span className="uppercase">{currentLanguage}</span>
            </button>
          </div>

          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-black text-stone-900">
              {t.phoneLogin || "Mobile Number"}
            </h2>
            <AudioButton
              textToSpeak={getVoiceInstruction("login")}
              language={currentLanguage}
              size="sm"
            />
          </div>
          <p className="text-xs font-bold text-stone-700 mb-4">
            Enter 10-digit phone number (अपना मोबाइल नंबर दर्ज करें)
          </p>

          <div className="bg-white rounded-2xl p-4 border-2 border-emerald-600 shadow-xs mb-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-900 font-black text-base border border-stone-300 shrink-0">
                <span className="text-lg">🇮🇳</span>
                <span>+91</span>
              </div>

              <div className="flex-1 text-right font-mono text-2xl sm:text-3xl font-black text-stone-950 tracking-wider overflow-hidden">
                {phone.length > 0 ? (
                  <span>
                    {phone.slice(0, 5)} {phone.slice(5)}
                  </span>
                ) : (
                  <span className="text-stone-400">••••• •••••</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-xs mx-auto">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleKeypadPress(n)}
                className="py-4 rounded-2xl bg-white hover:bg-stone-50 active:bg-emerald-100 text-2xl font-black text-stone-900 shadow-xs border-2 border-stone-200 transition-all active:scale-95 flex items-center justify-center min-h-[56px]"
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setPhone("9876543210");
              }}
              className="py-4 rounded-2xl bg-stone-200 hover:bg-stone-300 text-xs font-black text-stone-800 border-2 border-stone-300 active:scale-95 flex items-center justify-center uppercase tracking-wide min-h-[56px]"
            >
              Demo
            </button>

            <button
              type="button"
              onClick={() => handleKeypadPress("0")}
              className="py-4 rounded-2xl bg-white hover:bg-stone-50 active:bg-emerald-100 text-2xl font-black text-stone-900 shadow-xs border-2 border-stone-200 active:scale-95 flex items-center justify-center min-h-[56px]"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleKeypadBackspace}
              className="py-4 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-sm shadow-xs border-2 border-rose-300 active:scale-95 flex items-center justify-center min-h-[56px]"
            >
              ⌫ Del
            </button>
          </div>
        </div>

        <div className="w-full pt-4 pb-2">
          <button
            id="phone-send-otp-btn"
            type="button"
            disabled={phone.length < 10}
            onClick={() => {
              soundEffects.success();
              setStep("otp");
              setResendTimer(30);
              setCanResend(false);
              setOtp(["", "", "", ""]);
            }}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>{t.sendOtp || "Send OTP"}</span>
            <ArrowRight size={22} className="stroke-[3]" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // SCREEN 4: OTP VERIFICATION
  // ==========================================
  if (step === "otp") {
    const isOtpComplete = otp.every((d) => d !== "");

    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col p-4 sm:p-6 justify-between max-w-md mx-auto w-full">
        <div className="w-full pt-2">
          {/* Top Brand Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80">
            <div className="flex items-center gap-2">
              <AgriVisionLogo size={30} />
              <div>
                <span className="font-extrabold text-base tracking-tight text-emerald-950 block leading-tight">
                  Agri<span className="text-emerald-600">Vision</span>
                </span>
                <span className="text-[10px] font-bold text-stone-700">Security Gate</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setStep("login");
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 active:scale-95"
            >
              <ArrowLeft size={13} />
              <span>Change</span>
            </button>
          </div>

          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-black text-stone-900">
              {t.enterOtp || "OTP Verification"}
            </h2>
            <AudioButton
              textToSpeak={getVoiceInstruction("otp")}
              language={currentLanguage}
              size="sm"
            />
          </div>
          <p className="text-xs font-bold text-stone-700 mb-3">
            Code sent to +91 {phone || "9876543210"}
          </p>

          {autoFillDetected && (
            <div className="p-3 mb-3 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">📩</span>
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">SMS Auto-Detected:</span>
                  <span className="font-mono font-black text-emerald-950 text-base">5577</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleApplyAutoFill}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs active:scale-95"
              >
                Auto-fill
              </button>
            </div>
          )}

          <div className="flex justify-center gap-2.5 sm:gap-3 my-4">
            {otp.map((digit, idx) => (
              <div
                key={idx}
                className={`w-14 h-16 sm:w-16 sm:h-18 rounded-2xl border-2 flex items-center justify-center text-3xl font-black font-mono shadow-xs transition-all ${
                  digit
                    ? "border-emerald-700 bg-emerald-50 text-emerald-950 scale-102"
                    : "border-stone-300 bg-white text-stone-900"
                }`}
              >
                {digit}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center my-3">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOtp}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-black border border-stone-300 active:scale-95"
              >
                <RotateCcw size={14} />
                <span>Resend OTP (पुनः भेजें)</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Resend OTP in 00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}s</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-xs mx-auto mt-2">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleKeypadPress(n)}
                className="py-3.5 rounded-2xl bg-white hover:bg-stone-50 active:bg-emerald-100 text-2xl font-black text-stone-900 shadow-xs border-2 border-stone-200 active:scale-95 flex items-center justify-center min-h-[52px]"
              >
                {n}
              </button>
            ))}
            <div />
            <button
              type="button"
              onClick={() => handleKeypadPress("0")}
              className="py-3.5 rounded-2xl bg-white hover:bg-stone-50 active:bg-emerald-100 text-2xl font-black text-stone-900 shadow-xs border-2 border-stone-200 active:scale-95 flex items-center justify-center min-h-[52px]"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleKeypadBackspace}
              className="py-3.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-sm shadow-xs border-2 border-rose-300 active:scale-95 flex items-center justify-center min-h-[52px]"
            >
              ⌫ Del
            </button>
          </div>
        </div>

        <div className="w-full pt-4 pb-2">
          <button
            id="otp-verify-btn"
            type="button"
            disabled={!isOtpComplete || isVerifying || verificationSuccess}
            onClick={handleVerifyOtp}
            className={`w-full py-4 px-6 rounded-2xl font-black text-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 ${
              verificationSuccess
                ? "bg-emerald-600 text-white"
                : isVerifying
                ? "bg-emerald-800 text-white"
                : "bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white"
            }`}
          >
            {isVerifying ? (
              <Loader2 size={24} className="animate-spin" />
            ) : verificationSuccess ? (
              <div className="flex items-center gap-2 animate-in zoom-in">
                <Check size={26} className="stroke-[3]" />
              </div>
            ) : (
              <>
                <span>{t.verifyOtp || "Verify & Continue"}</span>
                <CheckCircle2 size={22} className="stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // SCREEN 5: ROLE SELECTION
  // ==========================================
  if (step === "role") {
    const rolesList: { role: UserRole; title: string; desc: string; icon: string; audioPrompt: string }[] = [
      {
        role: "farmer",
        title: t.roles.farmer.title,
        desc: t.roles.farmer.desc,
        icon: "🌾",
        audioPrompt: t.roles.farmer.voicePrompt,
      },
      {
        role: "gardener",
        title: t.roles.gardener.title,
        desc: t.roles.gardener.desc,
        icon: "🌱",
        audioPrompt: t.roles.gardener.voicePrompt,
      },
      {
        role: "labour",
        title: "Looking for Work (काम की तलाश)",
        desc: "Find nearby farm jobs, connect with farmers, daily wage work",
        icon: "🛠️",
        audioPrompt: "Looking for farm work. Sowing, harvesting, daily wages.",
      },
      {
        role: "fpo",
        title: t.roles.fpo.title,
        desc: t.roles.fpo.desc,
        icon: "🏢",
        audioPrompt: t.roles.fpo.voicePrompt,
      },
    ];

    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col p-4 sm:p-6 justify-between max-w-md mx-auto w-full">
        <div className="w-full pt-2">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-black text-stone-900">{t.selectRole || "Choose Role"}</h2>
            <AudioButton
              textToSpeak={getVoiceInstruction("role")}
              language={currentLanguage}
              size="sm"
            />
          </div>
          <p className="text-xs font-bold text-stone-700 mb-4">
            Select your farming workspace (अपनी भूमिका चुनें)
          </p>

          <div className="space-y-3">
            {rolesList.map((r) => {
              const isSelected = selectedRole === r.role;
              return (
                <div
                  key={r.role}
                  id={`role-card-${r.role}`}
                  onClick={() => {
                    soundEffects.click();
                    setSelectedRole(r.role);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-700 shadow-md ring-2 ring-emerald-500"
                      : "bg-white hover:bg-stone-50 border-stone-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-stone-100 shrink-0">
                      {r.icon}
                    </span>
                    <div>
                      <h3 className="font-black text-base text-stone-900 leading-tight">
                        {r.title}
                      </h3>
                      <p className="text-xs font-bold text-stone-700 line-clamp-1 mt-0.5">
                        {r.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <AudioButton
                      textToSpeak={r.audioPrompt}
                      language={currentLanguage}
                      size="sm"
                    />
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-emerald-700 bg-emerald-700 text-white" : "border-stone-400"
                      }`}
                    >
                      {isSelected && <Check size={14} className="stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full pt-4 pb-2">
          <button
            id="role-continue-btn"
            type="button"
            onClick={() => {
              soundEffects.success();
              if (selectedRole === "labour") {
                setStep("labour_setup");
                setLabourStep(1);
              } else if (selectedRole === "gardener") {
                setStep("gardener_setup");
                setGardenerStep(1);
              } else if (selectedRole === "fpo") {
                setStep("fpo_setup");
              } else {
                setStep("quicksetup");
              }
            }}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>{t.common.confirm || "Continue"}</span>
            <ArrowRight size={22} className="stroke-[3]" />
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 6: FPO / COOPERATIVE ORGANIZATIONAL SETUP & VERIFICATION WIZARD
  // =========================================================================
  if (step === "fpo_setup") {
    return (
      <FpoSetupWizard
        currentLanguage={currentLanguage}
        phone={phone}
        onBack={() => setStep("role")}
        onComplete={onComplete}
      />
    );
  }

  // =========================================================================
  // SCREEN 6.5: HOME GARDENER ONBOARDING (ONE QUESTION AT A TIME)
  // =========================================================================
  if (step === "gardener_setup") {
    const gardenerProgressPercent = (gardenerStep / 5) * 100;

    const availablePlants = [
      { name: "Tomato", hindi: "टमाटर", emoji: "🍅", image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=300&auto=format&fit=crop&q=80" },
      { name: "Green Chili", hindi: "हरी मिर्च", emoji: "🌶️", image: "https://images.unsplash.com/photo-1588879460618-9249e7d947d1?w=300&auto=format&fit=crop&q=80" },
      { name: "Mint (Pudina)", hindi: "पुदीना", emoji: "🌱", image: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=300&auto=format&fit=crop&q=80" },
      { name: "Holy Basil (Tulsi)", hindi: "तुलसी", emoji: "🌿", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&auto=format&fit=crop&q=80" },
      { name: "Desi Rose", hindi: "गुलाब", emoji: "🌹", image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&auto=format&fit=crop&q=80" },
      { name: "Spinach (Palak)", hindi: "पालक", emoji: "🥬", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&auto=format&fit=crop&q=80" },
      { name: "Coriander (Dhaniya)", hindi: "धनिया", emoji: "🌿", image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=300&auto=format&fit=crop&q=80" },
      { name: "Aloe Vera", hindi: "एलोवेरा", emoji: "🪴", image: "https://images.unsplash.com/photo-1589135233689-d56d11f67f65?w=300&auto=format&fit=crop&q=80" },
      { name: "Curry Leaves", hindi: "कढ़ी पत्ता", emoji: "🍃", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&auto=format&fit=crop&q=80" },
      { name: "Hibiscus (Gudhal)", hindi: "गुड़हल", emoji: "🌺", image: "https://images.unsplash.com/photo-1567689265664-1c48de61db0b?w=300&auto=format&fit=crop&q=80" },
      { name: "Lemon", hindi: "नींबू", emoji: "🍋", image: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=300&auto=format&fit=crop&q=80" },
      { name: "Fenugreek (Methi)", hindi: "मेथी", emoji: "🌱", image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=300&auto=format&fit=crop&q=80" },
    ];

    const gardenLocations = [
      { id: "Balcony", title: "Balcony", hindi: "बालकनी", icon: "☀️", desc: "Sunny railings & compact pots" },
      { id: "Terrace", title: "Terrace / Rooftop", hindi: "छत / टेरेस", icon: "🏡", desc: "Open sky & large planters" },
      { id: "Kitchen Garden", title: "Kitchen Garden", hindi: "किचन गार्डन", icon: "🥗", desc: "Fresh greens & herbs for cooking" },
      { id: "Pots", title: "Pots & Containers", hindi: "गमले", icon: "🪴", desc: "Window sills & indoor pots" },
      { id: "Small Backyard", title: "Small Backyard", hindi: "छोटा बगीचा", icon: "🌳", desc: "Fenced ground or small lawn" },
    ];

    const experienceLevels = [
      { id: "New to gardening", title: "New to gardening", hindi: "शुरुआती (नया शौक)", icon: "🌱", desc: "First time growing plants. Need simple step-by-step guidance." },
      { id: "Some experience", title: "Some experience", hindi: "कुछ अनुभव", icon: "🌿", desc: "I've kept a few potted plants or herbs alive." },
      { id: "Experienced", title: "Experienced", hindi: "अनुभवी", icon: "🪴", desc: "Seasoned home gardener familiar with potting soil & pruning." },
    ];

    const togglePlantSelection = (plantName: string) => {
      soundEffects.click();
      setSelectedGardenerPlants((prev) =>
        prev.includes(plantName)
          ? prev.filter((p) => p !== plantName)
          : [...prev, plantName]
      );
    };

    const completeGardenerSetup = () => {
      soundEffects.success();
      const newProfile: UserProfile = {
        id: `gardener-${Date.now()}`,
        name: userName.trim() || "Home Gardener",
        phone: phone || "9876543210",
        role: "gardener",
        language: currentLanguage,
        locationName: locationName || "Balcony Garden, Indore",
        landSizeAcre: "0",
        primaryCrop: selectedGardenerPlants[0] || "Potted Plants",
        skills: [],
        gardeningLocationType: gardenerLocationType,
        selectedGrowingPlants: selectedGardenerPlants,
        experienceLevel: gardenerExperience,
        isRegistered: true,
        isAvailableForWork: false,
        dailyRateWage: 0,
        hasIoTDevice: false,
        farmRiskScore: 0,
      };
      onComplete(newProfile);
    };

    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col p-4 sm:p-6 justify-between max-w-md mx-auto w-full">
        {/* Top Header & Progress */}
        <div className="w-full pt-2">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                if (gardenerStep > 1) {
                  setGardenerStep((prev) => (prev - 1) as any);
                } else {
                  setStep("role");
                }
              }}
              className="flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900 p-1 rounded-lg"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              Question {gardenerStep} of 5
            </span>

            <AudioButton
              textToSpeak={
                gardenerStep === 1
                  ? "What is your name? You can type or tap the microphone to speak."
                  : gardenerStep === 2
                  ? "Confirm your location for local sunlight and weather forecasts."
                  : gardenerStep === 3
                  ? "What plants are you growing in your home garden? Tap to select multiple."
                  : gardenerStep === 4
                  ? "Where is your garden located? Choose Balcony, Terrace, Kitchen Garden, or Pots."
                  : "What is your gardening experience level?"
              }
              language={currentLanguage}
              size="sm"
            />
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-5">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${gardenerProgressPercent}%` }}
            />
          </div>

          {/* =========================================================
              GARDENER STEP 1: NAME (Type or Speak)
              ========================================================= */}
          {gardenerStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Step 1 • Profile Setup
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  What is your name?
                </h2>
                <p className="text-xs font-bold text-stone-700 mt-1">
                  Type your name or tap the microphone to speak (अपना नाम बोलें या लिखें)
                </p>
              </div>

              <div className="bg-white p-4 rounded-3xl border-2 border-emerald-500 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="gardener-name-input"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Anjali Sharma"
                    className="flex-1 text-xl font-black text-stone-900 placeholder:text-stone-400 focus:outline-hidden bg-transparent"
                    autoFocus
                  />
                  <button
                    id="gardener-speak-name-mic-btn"
                    type="button"
                    onClick={handleStartVoiceName}
                    className={`p-3.5 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-xs ${
                      isListeningName
                        ? "bg-rose-500 text-white animate-pulse"
                        : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300"
                    }`}
                    title="Tap to speak your name"
                  >
                    {isListeningName ? <MicOff size={22} /> : <Mic size={22} />}
                  </button>
                </div>
                {isListeningName && (
                  <p className="text-xs font-bold text-rose-600 animate-pulse">
                    Listening... Speak your name now.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              GARDENER STEP 2: LOCATION (GPS Auto-detect)
              ========================================================= */}
          {gardenerStep === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Step 2 • Local Weather & Sunlight
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  Where is your garden?
                </h2>
                <p className="text-xs font-bold text-stone-700 mt-1">
                  Used for local weather alerts, season tips, and sunlight guides.
                </p>
              </div>

              <div className="bg-white p-4 rounded-3xl border-2 border-emerald-500 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <MapPin size={26} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-500">Selected Location</span>
                      <h3 className="text-base font-black text-stone-900">{locationName}</h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      setLocationName("Indore (MP)");
                      speakText("Location set to Indore", currentLanguage);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black active:scale-95"
                  >
                    Auto GPS
                  </button>
                </div>
              </div>

              {/* Quick Popular City Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-600 block">Or select your city:</span>
                <div className="grid grid-cols-2 gap-2">
                  {["Indore (MP)", "Bhopal (MP)", "Pune (MH)", "Bengaluru (KA)"].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setLocationName(city);
                      }}
                      className={`p-3 rounded-2xl border text-xs font-black text-left transition-all active:scale-95 flex items-center justify-between ${
                        locationName === city
                          ? "bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-500"
                          : "bg-white border-stone-200 text-stone-800 hover:bg-stone-50"
                      }`}
                    >
                      <span>{city}</span>
                      {locationName === city && <Check size={14} className="text-emerald-700 stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              GARDENER STEP 3: WHAT ARE YOU GROWING? (Visual Multi-Select)
              ========================================================= */}
          {gardenerStep === 3 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                    Step 3 • Plant Collection
                  </span>
                  <h2 className="text-2xl font-black text-stone-900">
                    What are you growing?
                  </h2>
                  <p className="text-xs font-bold text-stone-700 mt-0.5">
                    Tap to select (मल्टीपल पौधे चुनें):
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 shrink-0">
                  {selectedGardenerPlants.length} Selected
                </span>
              </div>

              {/* Picture Cards Grid */}
              <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
                {availablePlants.map((plant) => {
                  const isSelected = selectedGardenerPlants.includes(plant.name);
                  return (
                    <button
                      key={plant.name}
                      type="button"
                      onClick={() => togglePlantSelection(plant.name)}
                      className={`p-2 rounded-2xl border-2 text-center transition-all active:scale-95 relative flex flex-col items-center justify-between ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-400 shadow-xs"
                          : "bg-white border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="relative w-full h-14 rounded-xl overflow-hidden mb-1.5 bg-stone-100">
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-1 right-1 text-xs bg-white/90 rounded px-1">
                          {plant.emoji}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black text-[11px] text-stone-900 line-clamp-1">
                          {plant.name.split(" ")[0]}
                        </h4>
                        <span className="text-[9px] font-semibold text-stone-500 line-clamp-1">
                          {plant.hindi}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Check size={10} className="stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================
              GARDENER STEP 4: WHERE ARE YOU GROWING IT?
              ========================================================= */}
          {gardenerStep === 4 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Step 4 • Garden Location
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  Where are you growing?
                </h2>
                <p className="text-xs font-bold text-stone-700 mt-1">
                  Select your space to get optimal container & watering tips.
                </p>
              </div>

              <div className="space-y-2">
                {gardenLocations.map((loc) => {
                  const isSelected = gardenerLocationType === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setGardenerLocationType(loc.id);
                      }}
                      className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all active:scale-98 flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-400 shadow-sm"
                          : "bg-white border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-stone-100 shrink-0">
                          {loc.icon}
                        </span>
                        <div>
                          <h4 className="font-black text-sm text-stone-900">{loc.title}</h4>
                          <p className="text-xs text-stone-500 font-semibold mt-0.5">{loc.desc}</p>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300"
                        }`}
                      >
                        {isSelected && <Check size={14} className="stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================
              GARDENER STEP 5: EXPERIENCE LEVEL (Optional)
              ========================================================= */}
          {gardenerStep === 5 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Step 5 • Experience Level
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  How experienced are you?
                </h2>
                <p className="text-xs font-bold text-stone-700 mt-1">
                  We'll tailor your tips from beginner-friendly to seasoned.
                </p>
              </div>

              <div className="space-y-2.5">
                {experienceLevels.map((exp) => {
                  const isSelected = gardenerExperience === exp.id;
                  return (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setGardenerExperience(exp.id);
                      }}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-98 flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-400 shadow-sm"
                          : "bg-white border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-stone-100 shrink-0">
                          {exp.icon}
                        </span>
                        <div>
                          <h4 className="font-black text-sm text-stone-900">{exp.title}</h4>
                          <p className="text-xs text-stone-500 font-semibold mt-0.5">{exp.desc}</p>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300"
                        }`}
                      >
                        {isSelected && <Check size={14} className="stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Continue / Enter Garden Button */}
        <div className="w-full pt-4 pb-2">
          {gardenerStep < 5 ? (
            <button
              id={`gardener-step-${gardenerStep}-continue-btn`}
              type="button"
              onClick={() => {
                soundEffects.success();
                setGardenerStep((prev) => (prev + 1) as any);
              }}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight size={22} className="stroke-[3]" />
            </button>
          ) : (
            <button
              id="finish-gardener-setup-btn"
              type="button"
              onClick={completeGardenerSetup}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-black text-lg shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Sprout size={24} className="text-amber-300" />
              <span>Enter My Garden</span>
              <ArrowRight size={22} className="stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 7: "LOOKING FOR WORK" QUICK PROFILE SETUP (ONE QUESTION AT A TIME)
  // =========================================================================
  if (step === "labour_setup") {
    const progressPercent = (labourStep / 5) * 100;

    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col p-4 sm:p-6 justify-between max-w-md mx-auto w-full">
        {/* Top Progress Bar & Back Nav */}
        <div className="w-full pt-2">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                if (labourStep > 1) {
                  setLabourStep((prev) => (prev - 1) as any);
                } else {
                  setStep("role");
                }
              }}
              className="flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900 p-1 rounded-lg"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
              Question {labourStep} of 5
            </span>

            <AudioButton
              textToSpeak={
                labourStep === 1
                  ? getVoiceInstruction("labour_name")
                  : labourStep === 2
                  ? getVoiceInstruction("labour_location")
                  : labourStep === 3
                  ? getVoiceInstruction("labour_skills")
                  : labourStep === 4
                  ? getVoiceInstruction("labour_availability")
                  : getVoiceInstruction("labour_photo")
              }
              language={currentLanguage}
              size="sm"
            />
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* =========================================================
              QUESTION 1: NAME (Type or Speak)
              ========================================================= */}
          {labourStep === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Step 1 • Profile Setup
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  What is your name?
                </h2>
                <p className="text-xs font-bold text-stone-700 mt-1">
                  Type your name or tap the microphone to speak (अपना नाम बोलें या लिखें)
                </p>
              </div>

              {/* Large Input with Mic Button */}
              <div className="bg-white p-4 rounded-3xl border-2 border-amber-500 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="labour-name-input"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="flex-1 text-xl font-black text-stone-900 placeholder:text-stone-400 focus:outline-hidden bg-transparent"
                    autoFocus
                  />
                  <button
                    id="speak-name-mic-btn"
                    type="button"
                    onClick={handleStartVoiceName}
                    className={`p-3.5 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-xs ${
                      isListeningName
                        ? "bg-rose-500 text-white animate-pulse"
                        : "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                    }`}
                    title="Tap to speak your name"
                  >
                    {isListeningName ? <Mic size={22} /> : <Mic size={22} />}
                  </button>
                </div>

                {isListeningName && (
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-700 pt-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>Listening... बोलिए</span>
                  </div>
                )}
              </div>

              {/* Quick suggestions chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-stone-700 block">Quick Suggestions:</span>
                <div className="flex flex-wrap gap-2">
                  {["Ramesh Patel", "Sunil Kumar", "Vikram Singh", "Kailash Verma"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setUserName(preset);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-xs font-bold text-stone-800 active:scale-95"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              QUESTION 2: LOCATION (GPS Auto-detected)
              ========================================================= */}
          {labourStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Step 2 • Location
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  Confirm your location
                </h2>
                <p className="text-xs font-bold text-stone-700 mt-1">
                  GPS automatically detected nearest farm hub (स्थान की पुष्टि करें)
                </p>
              </div>

              {/* Visual GPS Location Card */}
              <div className="bg-white p-5 rounded-3xl border-2 border-emerald-500 shadow-sm space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin size={24} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      GPS Detected • High Accuracy
                    </span>
                    <h3 className="text-lg font-black text-stone-900 mt-0.5">{locationName}</h3>
                    <p className="text-xs font-bold text-stone-700 mt-0.5">Ujjain District • Madhya Pradesh</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>Coordinates: 23.185° N, 75.774° E</span>
                  <span className="text-emerald-700 font-black">Within 10 km</span>
                </div>
              </div>

              {/* Nearby Village Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-stone-700 block">Or Choose Nearby Village:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Gram Pipliya, Ujjain",
                    "Sanwer Road, Indore",
                    "Tajpur Village, MP",
                    "Nagda Rural Cluster",
                  ].map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setLocationName(loc);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-black border text-left transition-all ${
                        locationName === loc
                          ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                          : "bg-white text-stone-800 border-stone-300 hover:bg-stone-50"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              QUESTION 3: SKILLS TYPE (Multi-select Icon Cards)
              ========================================================= */}
          {labourStep === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Step 3 • Farm Skills
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  Select your skills
                </h2>
                <p className="text-xs font-bold text-stone-700 mt-1">
                  Tap cards to pick multiple skills (हुनर चुनें - एक से अधिक चुन सकते हैं)
                </p>
              </div>

              {/* 5 Required Skill Cards */}
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: "Sowing", name: "Sowing (बुवाई)", icon: "🌱", desc: "Seed planting, drilling & nursery transplant" },
                  { id: "Harvesting", name: "Harvesting (कटाई)", icon: "🌾", desc: "Wheat, soy & paddy crop cutting & bundling" },
                  { id: "Spraying", name: "Spraying (छिड़काव)", icon: "🧪", desc: "Knapsack battery sprayer & fertilizer foliar" },
                  { id: "Weeding", name: "Weeding (निराई)", icon: "🌿", desc: "Inter-row trenching & unwanted weed clearing" },
                  { id: "General Labour", name: "General Labour (मजदूरी)", icon: "🛠️", desc: "Drip pipe laying, loading sacks & farm repair" },
                ].map((skill) => {
                  const isSelected = selectedSkills.includes(skill.id);

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-left active:scale-98 ${
                        isSelected
                          ? "bg-amber-50 border-amber-600 shadow-md ring-2 ring-amber-400"
                          : "bg-white border-stone-200 hover:border-stone-300 shadow-xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-1.5 rounded-xl bg-stone-100 shrink-0">
                          {skill.icon}
                        </span>
                        <div>
                          <h4 className="font-black text-base text-stone-900 leading-tight">
                            {skill.name}
                          </h4>
                          <p className="text-xs font-bold text-stone-700 mt-0.5">{skill.desc}</p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-amber-600 border-amber-600 text-white" : "border-stone-400"
                        }`}
                      >
                        {isSelected && <Check size={14} className="stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================
              QUESTION 4: AVAILABILITY (Simple Calendar / Chip Tap)
              ========================================================= */}
          {labourStep === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Step 4 • Work Schedule
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  When are you available?
                </h2>
                <p className="text-xs font-bold text-stone-700 mt-1">
                  Tap your availability (उपलब्धता चुनें - कोई फॉर्म नहीं)
                </p>
              </div>

              {/* Simple Big Tap Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    id: "Available Now / Today",
                    title: "⚡ Available Now / Today (आज से तैयार)",
                    desc: "Immediate start • Farmers can contact you right now",
                    badge: "Best for immediate pay",
                  },
                  {
                    id: "Available This Week",
                    title: "📅 Available This Week (इस सप्ताह)",
                    desc: "Ready for upcoming 3 to 7 day harvesting projects",
                    badge: "High demand",
                  },
                  {
                    id: "Available Next Week",
                    title: "🗓️ Available Next Week (अगले सप्ताह से)",
                    desc: "Advance booking for seasonal farm operations",
                    badge: "Planned work",
                  },
                  {
                    id: "Weekends Only",
                    title: "🌴 Weekends Only (शनिवार - रविवार)",
                    desc: "Part-time farm support on Saturdays and Sundays",
                    badge: "Part time",
                  },
                ].map((avail) => {
                  const isSelected = selectedAvailability === avail.id;

                  return (
                    <button
                      key={avail.id}
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setSelectedAvailability(avail.id);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left active:scale-98 ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500"
                          : "bg-white border-stone-200 hover:border-stone-300 shadow-xs"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-base text-stone-900 leading-tight">
                            {avail.title}
                          </h4>
                        </div>
                        <p className="text-xs font-bold text-stone-700 mt-1">{avail.desc}</p>
                        <span className="inline-block text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md mt-1.5">
                          {avail.badge}
                        </span>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-400"
                        }`}
                      >
                        {isSelected && <Check size={14} className="stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 7-Day Mini Calendar Tap Selector */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-700 block mb-2">Next 7 Days Quick Overview:</span>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Today", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"].map((day, idx) => (
                    <div
                      key={day}
                      className={`p-2 rounded-xl text-xs font-black ${
                        idx < 4 ? "bg-emerald-100 text-emerald-950 border border-emerald-300" : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      <span className="block text-[10px] uppercase">{day}</span>
                      <span className="text-sm font-black">{14 + idx}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              QUESTION 5: PHOTO (Camera-first / Trust Profile)
              ========================================================= */}
          {labourStep === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Step 5 • Trust Profile (Optional)
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  Add a profile picture
                </h2>
                <p className="text-xs font-bold text-stone-700 mt-1">
                  Farmers trust worker profiles with verified photos 3x more (फोटो जोड़ें)
                </p>
              </div>

              {/* Main Photo Preview & Snap Area */}
              <div className="bg-white p-5 rounded-3xl border-2 border-amber-400 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
                <div className="relative">
                  <img
                    src={selectedPhotoUrl}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    className="w-28 h-28 rounded-3xl object-cover border-4 border-amber-500 shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-full shadow-md">
                    <ShieldCheck size={18} />
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-black text-base text-stone-900">{userName || "Ramesh Patel"}</h4>
                  <p className="text-xs font-bold text-stone-700">{locationName}</p>
                </div>

                {/* Camera / Snap Action */}
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.camera();
                    setCameraActive(true);
                    setTimeout(() => {
                      setCameraActive(false);
                      // Switch to another clean avatar or confirm
                      soundEffects.success();
                    }, 1200);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-2 shadow-xs active:scale-95"
                >
                  <Camera size={16} />
                  <span>{cameraActive ? "Snapping Photo..." : "Take Camera Photo"}</span>
                </button>
              </div>

              {/* Quick Preset Profile Pictures */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-stone-700 block">Or Choose a Verified Avatar:</span>
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
                  ].map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setSelectedPhotoUrl(url);
                      }}
                      className={`p-1 rounded-2xl border-2 shrink-0 transition-all ${
                        selectedPhotoUrl === url ? "border-amber-600 ring-2 ring-amber-400 scale-105" : "border-stone-200"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Preset ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Continue / Finish Button */}
        <div className="w-full pt-4 pb-2 space-y-2">
          {labourStep < 5 ? (
            <button
              id={`labour-step-${labourStep}-continue-btn`}
              type="button"
              onClick={() => {
                soundEffects.success();
                setLabourStep((prev) => (prev + 1) as any);
              }}
              className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight size={22} className="stroke-[3]" />
            </button>
          ) : (
            <button
              id="finish-labour-setup-btn"
              type="button"
              onClick={completeLabourSetup}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Open Work Dashboard</span>
              <CheckCircle2 size={22} className="stroke-[3]" />
            </button>
          )}

          {labourStep === 5 && (
            <button
              type="button"
              onClick={completeLabourSetup}
              className="w-full py-2 text-center text-xs font-bold text-stone-600 hover:text-stone-900"
            >
              Skip photo & enter dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // SCREEN 7: GENERIC QUICK SETUP FOR OTHER ROLES
  // ==========================================
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col p-4 sm:p-6 justify-between max-w-md mx-auto w-full">
      <div className="w-full pt-2 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
              {selectedRole.toUpperCase()} PROFILE
            </span>
            <h2 className="text-2xl font-black text-stone-900">Setup Details</h2>
          </div>
          <AudioButton
            textToSpeak="Setup your farm profile with your name and details."
            language={currentLanguage}
            size="sm"
          />
        </div>

        {/* Name input */}
        <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-xs space-y-1.5">
          <label className="text-xs font-bold text-stone-700 block">Your Name (आपका नाम)</label>
          <input
            id="setup-name-input"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g. Ramesh Patel"
            className="w-full p-3 rounded-xl border border-stone-300 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        {/* Location Detection Tap Card */}
        <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-700">Location (स्थान)</div>
              <div className="text-sm font-black text-stone-900">{locationName}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              setLocationName("Indore Rural, MP");
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold"
          >
            Auto GPS
          </button>
        </div>

        {/* Role Specific Visual Pickers */}
        {selectedRole === "farmer" && (
          <>
            <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-xs space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Land Size (ज़मीन का आकार)</label>
              <div className="grid grid-cols-2 gap-2">
                {["< 1 Acre", "2-5 Acres", "5-10 Acres", "10+ Acres"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      setLandSize(size);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black border transition-all ${
                      landSize === size
                        ? "bg-emerald-700 text-white border-emerald-800 shadow-xs"
                        : "bg-stone-50 text-stone-800 border-stone-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-xs space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Primary Crop (मुख्य फसल)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "Wheat & Soy", emoji: "🌾" },
                  { name: "Cotton", emoji: "🌱" },
                  { name: "Mustard", emoji: "🌼" },
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      setSelectedCrop(c.name);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedCrop === c.name
                        ? "bg-emerald-700 text-white border-emerald-800 shadow-xs"
                        : "bg-stone-50 text-stone-800 border-stone-300"
                    }`}
                  >
                    <span className="text-xl block">{c.emoji}</span>
                    <span className="text-[11px] font-black">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-full pt-4 pb-2">
        <button
          id="finish-setup-btn"
          type="button"
          onClick={() => {
            soundEffects.success();
            const newProfile: UserProfile = {
              id: `user-${Date.now()}`,
              name: userName.trim() || "Ramesh Patel",
              phone: phone || "9876543210",
              role: selectedRole,
              language: currentLanguage,
              locationName,
              landSizeAcre: landSize,
              primaryCrop: selectedCrop,
              skills: selectedSkills,
              isRegistered: true,
              isAvailableForWork: true,
              dailyRateWage: 550,
              hasIoTDevice: true,
              farmRiskScore: 34,
            };
            onComplete(newProfile);
          }}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Open Workspace</span>
          <ArrowRight size={22} className="stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

