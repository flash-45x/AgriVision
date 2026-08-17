import React, { useState } from "react";
import {
  Building,
  ShieldCheck,
  MapPin,
  Users,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  MicOff,
  Upload,
  FileText,
  Sparkles,
  AlertTriangle,
  Lock,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import { LanguageCode, UserProfile } from "../../types";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";
import { INITIAL_FPO_PROFILE } from "../../data/fpoData";

interface FpoSetupWizardProps {
  currentLanguage: LanguageCode;
  phone: string;
  onBack: () => void;
  onComplete: (profile: UserProfile) => void;
}

export const FpoSetupWizard: React.FC<FpoSetupWizardProps> = ({
  currentLanguage,
  phone,
  onBack,
  onComplete,
}) => {
  // 6 Setup Steps:
  // 1 = Org Name, 2 = Reg ID, 3 = Location/Radius, 4 = Admin Name & Role, 5 = Member Count, 6 = Verification Document
  const [fpoStep, setFpoStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form states
  const [orgName, setOrgName] = useState("Malwa Krishi Vikas Producer Co. Ltd.");
  const [isListeningOrg, setIsListeningOrg] = useState(false);

  const [regNumber, setRegNumber] = useState("FPO-MP-2022-88490");

  const [serviceRegion, setServiceRegion] = useState("Ujjain Rural & Badnagar Tehsil (MP)");
  const [serviceRadiusKm, setServiceRadiusKm] = useState(35);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const [adminName, setAdminName] = useState("Vikram Rathore");
  const [adminRole, setAdminRole] = useState("Chief Executive Officer / Secretary");
  const [isListeningAdmin, setIsListeningAdmin] = useState(false);

  const [memberScale, setMemberScale] = useState("150 - 500 Farmers");

  const [uploadedDocName, setUploadedDocName] = useState<string | null>(
    "FPO_Registration_Certificate_MP8849.pdf"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [verificationApproved, setVerificationApproved] = useState(false);

  const stepsList = [
    { num: 1, label: "Organization", icon: Building },
    { num: 2, label: "Reg. ID", icon: ShieldCheck },
    { num: 3, label: "Region", icon: MapPin },
    { num: 4, label: "Admin Role", icon: Users },
    { num: 5, label: "Scale", icon: Sparkles },
    { num: 6, label: "Verification", icon: FileCheck },
  ];

  // Voice instructions
  const getAudioPrompt = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return "Enter your Farmer Producer Organization or Cooperative Society Name. You can type or tap the microphone to speak.";
      case 2:
        return "Enter your official FPO Registration Number or Cooperative Society Registration ID for institutional verification.";
      case 3:
        return "Confirm the geographic region and service radius covered by your organization.";
      case 4:
        return "Provide the primary administrator's name and designation such as Secretary or Manager.";
      case 5:
        return "Select the approximate number of member farmers linked to your organization.";
      case 6:
        return "Upload your FPO Registration Certificate or Society Incorporation Document to verify institutional legitimacy.";
      default:
        return "FPO Admin Verification Setup";
    }
  };

  const handleSpeechOrgName = () => {
    soundEffects.click();
    setIsListeningOrg(true);
    speakText("Please say your Organization or Cooperative Name", currentLanguage, () => {
      setTimeout(() => {
        setIsListeningOrg(false);
        const sampleNames = [
          "Malwa Krishi Vikas Producer Co. Ltd.",
          "Narmada Agro Farmer Producer Company",
          "Ujjain Krishi Sahakari Samiti",
          "Avantika Organic Farmers Cooperative",
        ];
        const chosen = sampleNames[Math.floor(Math.random() * sampleNames.length)];
        setOrgName(chosen);
        soundEffects.success();
        speakText(`Registered Organization name as ${chosen}`, currentLanguage);
      }, 1800);
    });
  };

  const handleSpeechAdminName = () => {
    soundEffects.click();
    setIsListeningAdmin(true);
    speakText("Please say the Administrator's Name", currentLanguage, () => {
      setTimeout(() => {
        setIsListeningAdmin(false);
        const sampleAdmins = ["Vikram Rathore", "Sunil Sharma", "Dr. Rajeshwar Patel", "Anuradha Chouhan"];
        const chosen = sampleAdmins[Math.floor(Math.random() * sampleAdmins.length)];
        setAdminName(chosen);
        soundEffects.success();
        speakText(`Admin name set as ${chosen}`, currentLanguage);
      }, 1600);
    });
  };

  const handleDetectGps = () => {
    soundEffects.click();
    setIsDetectingGps(true);
    setTimeout(() => {
      setIsDetectingGps(false);
      setServiceRegion("Ujjain District Hub (Badnagar & Mahidpur Blocks), MP");
      soundEffects.success();
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      soundEffects.success();
      setUploadedDocName(e.target.files[0].name);
    }
  };

  const handleCompleteSetup = () => {
    soundEffects.click();
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      setVerificationApproved(true);
      soundEffects.success();

      setTimeout(() => {
        const fpoProfile: UserProfile = {
          id: `user-fpo-${Date.now()}`,
          name: adminName.trim() || "Vikram Rathore",
          phone: phone || "+91 98765 43210",
          role: "fpo",
          language: currentLanguage,
          locationName: serviceRegion,
          landSizeAcre: "1,480 Acres (Aggregated)",
          primaryCrop: "Soybean & Wheat Cluster",
          skills: ["FPO Administration", "Bulk Input Procurement", "Mandi Linkage", "Gov Schemes"],
          isAvailableForWork: false,
          dailyRateWage: 0,
          hasIoTDevice: true,
          farmRiskScore: 32, // Cluster aggregate
          isRegistered: true,
          fpoDetails: {
            organizationName: orgName.trim() || INITIAL_FPO_PROFILE.organizationName,
            registrationNumber: regNumber.trim() || INITIAL_FPO_PROFILE.registrationNumber,
            serviceRegion: serviceRegion,
            serviceRadiusKm: serviceRadiusKm,
            adminName: adminName.trim() || INITIAL_FPO_PROFILE.adminName,
            adminRole: adminRole,
            memberCountRange: memberScale,
            verificationStatus: "Verified",
            certificateUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
            inviteCode: "FPO-MALWA-2026",
            totalAcresManaged: 1480,
            dominantCrops: ["Soybean", "Wheat", "Mustard", "Tomato", "Gram (Chana)"],
          },
        };
        onComplete(fpoProfile);
      }, 1200);
    }, 1400);
  };

  const progressPercent = (fpoStep / 6) * 100;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col p-4 sm:p-6 justify-between max-w-lg mx-auto w-full">
      {/* Top Header & Step Tracker */}
      <div className="w-full pt-1">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => {
              soundEffects.click();
              if (fpoStep > 1) {
                setFpoStep((prev) => (prev - 1) as any);
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-1 text-xs font-black text-stone-700 hover:text-stone-900 p-1 rounded-lg"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
            <ShieldCheck size={14} className="text-indigo-700" />
            <span className="text-xs font-black tracking-tight">
              Institutional Verification • Step {fpoStep} of 6
            </span>
          </div>

          <AudioButton
            textToSpeak={getAudioPrompt(fpoStep)}
            language={currentLanguage}
            size="sm"
          />
        </div>

        {/* Stepper Bar */}
        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-5">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Security Advisory Pill */}
        <div className="p-2.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-indigo-950 flex items-start gap-2.5 mb-5 shadow-2xs">
          <Lock size={16} className="text-indigo-700 shrink-0 mt-0.5" />
          <p className="text-[11px] font-semibold leading-relaxed">
            <strong className="font-black text-indigo-900">Organizational Access:</strong> As an FPO/Cooperative Admin, you will manage collective farmer records, cluster disease alerts, and bulk broadcasts. We verify registration documents for data privacy.
          </p>
        </div>

        {/* =========================================================
            STEP 1: ORGANIZATION NAME (Type or Speak)
            ========================================================= */}
        {fpoStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block mb-1">
                Step 1 of 6 • Organization Profile
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Organization Name
              </h2>
              <p className="text-xs font-bold text-stone-700 mt-1">
                Enter your registered FPO, FPC, or Primary Agricultural Credit Society (PACS) name.
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border-2 border-indigo-500 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <Building className="text-indigo-600 shrink-0" size={24} />
                <input
                  id="fpo-org-name-input"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Malwa Kisan Producer Co. Ltd."
                  className="flex-1 text-lg font-black text-stone-900 placeholder:text-stone-400 focus:outline-hidden bg-transparent"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSpeechOrgName}
                  className={`p-3 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-xs ${
                    isListeningOrg
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-300"
                  }`}
                  title="Speak organization name"
                >
                  {isListeningOrg ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              </div>

              {/* Sample Suggestions */}
              <div className="pt-2 border-t border-stone-100">
                <span className="text-[10px] font-black text-stone-700 uppercase block mb-1.5">
                  Or pick verified demo template:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Malwa Krishi Vikas Producer Co. Ltd.",
                    "Narmada Agro Farmer Producer Co.",
                    "Ujjain Kisan Sahakari Samiti",
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        setOrgName(s);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-indigo-50 hover:text-indigo-900 border border-stone-200 text-[11px] font-bold text-stone-700 active:scale-95 transition-all text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 2: REGISTRATION / ID NUMBER
            ========================================================= */}
        {fpoStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block mb-1">
                Step 2 of 6 • Legal Registration ID
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Registration / ID Number
              </h2>
              <p className="text-xs font-bold text-stone-700 mt-1">
                Enter your CIN, NABARD/SFAC FPO Registration ID, or Cooperative Society Number.
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border-2 border-indigo-500 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-indigo-600 shrink-0" size={24} />
                <input
                  id="fpo-reg-id-input"
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g. FPO-MP-2022-88490 or CIN Number"
                  className="flex-1 text-lg font-black font-mono uppercase text-stone-900 placeholder:text-stone-400 focus:outline-hidden bg-transparent"
                  autoFocus
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700" />
                  <span className="text-xs font-black text-emerald-900">
                    Format Verified (Ministry SFAC/NABARD Schema)
                  </span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-950">
                  Valid
                </span>
              </div>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="flex gap-2">
              {[
                { id: "FPO-MP-2022-88490", type: "SFAC Portal ID" },
                { id: "U01111MP2022PTC061294", type: "MCA CIN Reg" },
                { id: "COOP-UJJ-2019-4412", type: "PACS State ID" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setRegNumber(item.id);
                  }}
                  className="flex-1 p-2 rounded-xl bg-white border border-stone-200 text-left hover:border-indigo-400 transition-all"
                >
                  <span className="text-[9px] font-bold text-stone-700 block uppercase">{item.type}</span>
                  <span className="text-xs font-black text-stone-900 font-mono">{item.id}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 3: LOCATION / SERVICE REGION & RADIUS
            ========================================================= */}
        {fpoStep === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block mb-1">
                Step 3 of 6 • Service Coverage Area
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Region & Service Radius
              </h2>
              <p className="text-xs font-bold text-stone-700 mt-1">
                Define the geographical footprint of member farms for cluster pest and weather alerts.
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border-2 border-indigo-500 shadow-sm space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-stone-700 uppercase block">
                  District / Tehsil Coverage
                </label>
                <div className="flex items-center gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <MapPin className="text-indigo-600 shrink-0" size={20} />
                  <input
                    type="text"
                    value={serviceRegion}
                    onChange={(e) => setServiceRegion(e.target.value)}
                    className="flex-1 text-sm font-bold text-stone-900 bg-transparent focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleDetectGps}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-1"
                  >
                    {isDetectingGps ? <Loader2 size={14} className="animate-spin" /> : "GPS Auto"}
                  </button>
                </div>
              </div>

              {/* Service Radius Slider */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-900">Operating Radius</span>
                  <span className="text-sm font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    {serviceRadiusKm} km radius
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={serviceRadiusKm}
                  onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />

                <div className="flex justify-between text-[10px] font-bold text-stone-700">
                  <span>10 km (Local Cluster)</span>
                  <span>35 km (Standard Tehsil)</span>
                  <span>100 km (District Wide)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 4: ADMIN NAME & ROLE
            ========================================================= */}
        {fpoStep === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block mb-1">
                Step 4 of 6 • Authorized Officer
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Admin's Name & Role
              </h2>
              <p className="text-xs font-bold text-stone-700 mt-1">
                Specify the primary officer responsible for managing farm advisories and member data.
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border-2 border-indigo-500 shadow-sm space-y-4">
              {/* Admin Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-stone-700 uppercase block">
                  Admin Full Name
                </label>
                <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <Users className="text-indigo-600 shrink-0" size={20} />
                  <input
                    id="fpo-admin-name-input"
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g. Vikram Rathore"
                    className="flex-1 text-base font-black text-stone-900 bg-transparent focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleSpeechAdminName}
                    className="p-2 rounded-xl bg-indigo-100 text-indigo-900 hover:bg-indigo-200"
                    title="Speak Admin Name"
                  >
                    {isListeningAdmin ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>
              </div>

              {/* Admin Role Selector */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-black text-stone-700 uppercase block">
                  Designation / Organizational Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Chief Executive Officer / Secretary",
                    "General Manager (Operations)",
                    "Board Director / President",
                    "Lead Agronomist & Field Officer",
                  ].map((roleOption) => {
                    const isSelected = adminRole === roleOption;
                    return (
                      <button
                        key={roleOption}
                        type="button"
                        onClick={() => {
                          soundEffects.click();
                          setAdminRole(roleOption);
                        }}
                        className={`p-3 rounded-2xl text-left border-2 text-xs font-black transition-all ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-600 text-indigo-950 shadow-xs"
                            : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800"
                        }`}
                      >
                        {roleOption}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 5: MEMBER SCALE
            ========================================================= */}
        {fpoStep === 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block mb-1">
                Step 5 of 6 • Dashboard Sizing
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Approximate Member Count
              </h2>
              <p className="text-xs font-bold text-stone-700 mt-1">
                Helps configure dashboard metrics, server capacity, and bulk broadcast channels.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  scale: "50 - 150 Farmers",
                  label: "Cluster / Village Level FPO",
                  acres: "~250 - 600 Acres managed",
                  desc: "Ideal for small cooperative societies, pilot FPO projects, and village producer groups.",
                  icon: "🌱",
                },
                {
                  scale: "150 - 500 Farmers",
                  label: "Standard Tehsil FPC (Recommended)",
                  acres: "~1,000 - 2,500 Acres managed",
                  desc: "Includes automated risk heatmaps, collective input pools, and multi-village disease tracking.",
                  icon: "🏢",
                },
                {
                  scale: "500 - 2,000 Farmers",
                  label: "Large District Level Federation",
                  acres: "~3,000 - 10,000 Acres managed",
                  desc: "Multi-cluster oversight, warehouse integration, and institutional funding export reporting.",
                  icon: "🏛️",
                },
                {
                  scale: "2,000+ Farmers",
                  label: "Apex State / Multi-State Federation",
                  acres: "10,000+ Acres managed",
                  desc: "Enterprise scale with multi-admin role access and customized government scheme pipelines.",
                  icon: "🌐",
                },
              ].map((item) => {
                const isSelected = memberScale === item.scale;
                return (
                  <div
                    key={item.scale}
                    onClick={() => {
                      soundEffects.click();
                      setMemberScale(item.scale);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-700 shadow-md ring-2 ring-indigo-500"
                        : "bg-white hover:bg-stone-50 border-stone-200 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-stone-100 shrink-0">
                        {item.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-stone-900">{item.scale}</h4>
                          <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                            {item.label}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-stone-700 mt-0.5 line-clamp-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                        isSelected ? "border-indigo-700 bg-indigo-700 text-white" : "border-stone-400"
                      }`}
                    >
                      {isSelected && <Check size={12} className="stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 6: LEGITIMACY VERIFICATION STEP (Document Upload)
            ========================================================= */}
        {fpoStep === 6 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block mb-1">
                Step 6 of 6 • Institutional Verification
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Verification Document
              </h2>
              <p className="text-xs font-bold text-stone-700 mt-1">
                Upload your Certificate of Incorporation, Society Registration, or SFAC Empanelment letter.
              </p>
            </div>

            {/* Document Upload Card */}
            <div className="bg-white p-5 rounded-3xl border-2 border-dashed border-indigo-400 shadow-xs space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 mx-auto flex items-center justify-center">
                <FileText size={28} />
              </div>

              <div>
                <h4 className="font-black text-sm text-stone-900">
                  {uploadedDocName ? uploadedDocName : "Upload FPO Registration Certificate"}
                </h4>
                <p className="text-xs font-bold text-stone-700 mt-0.5">
                  Supports PDF, JPG, PNG (Max 15MB)
                </p>
              </div>

              {uploadedDocName && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-xs font-black block">Document Attached</span>
                      <span className="text-[10px] font-bold text-emerald-700">Digital Seal & MCA Hash Validated</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-emerald-200 text-emerald-900 font-black text-[10px]">
                    Verified
                  </span>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 pt-1">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs active:scale-95 transition-all flex items-center gap-2">
                  <Upload size={16} />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.success();
                    setUploadedDocName("Malwa_FPO_MCA_Certificate_2022.pdf");
                  }}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-300 active:scale-95"
                >
                  Use Sample Cert
                </button>
              </div>
            </div>

            {/* Institutional Security Notice */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2 text-left">
              <ShieldCheck size={18} className="text-amber-800 shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold leading-relaxed">
                <strong>Manual Review & Instant Sandbox:</strong> By proceeding, you confirm authorized representation of <span className="underline font-black">{orgName}</span> under Ministry of Agriculture FPO guidelines.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="w-full pt-4 pb-2">
        {fpoStep < 6 ? (
          <button
            id={`fpo-step-${fpoStep}-continue-btn`}
            type="button"
            onClick={() => {
              soundEffects.success();
              setFpoStep((prev) => (prev + 1) as any);
            }}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white font-black text-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Step {fpoStep + 1}</span>
            <ArrowRight size={22} className="stroke-[3]" />
          </button>
        ) : (
          <button
            id="fpo-verify-complete-btn"
            type="button"
            disabled={isUploading}
            onClick={handleCompleteSetup}
            className={`w-full py-4 px-6 rounded-2xl font-black text-lg shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 ${
              verificationApproved
                ? "bg-emerald-600 text-white"
                : isUploading
                ? "bg-indigo-900 text-white"
                : "bg-indigo-700 hover:bg-indigo-800 text-white"
            }`}
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={22} className="animate-spin" />
                <span>Verifying Certificate & Provisioning Dashboard...</span>
              </div>
            ) : verificationApproved ? (
              <div className="flex items-center gap-2">
                <Check size={24} className="stroke-[3]" />
                <span>Access Verified! Launching Workspace...</span>
              </div>
            ) : (
              <>
                <span>Submit & Access FPO Dashboard</span>
                <ShieldCheck size={22} className="stroke-[2.5]" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
