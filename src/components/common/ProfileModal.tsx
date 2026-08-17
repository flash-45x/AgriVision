import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, User, Phone, MapPin, Sprout, Briefcase, Check, Shield, Camera, Award, Sparkles, Building2, Save } from "lucide-react";
import { UserProfile, LanguageCode, UserRole } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { soundEffects } from "../../utils/audio";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  currentLanguage: LanguageCode;
  onUpdateProfile: (updated: UserProfile) => void;
  onRoleChange?: (role: UserRole) => void;
}

const AVATAR_OPTIONS = ["👨‍🌾", "👩‍🌾", "🌱", "🌻", "🚜", "🌾", "🏡", "👷‍♂️", "🏢"];

const SKILLS_LIST = [
  "Harvesting (कटाई)",
  "Sowing & Seeding (बुवाई)",
  "Tractor Driving (ट्रैक्टर)",
  "Pesticide Spray (छिड़काव)",
  "Drip Irrigation (ड्रिप सिंचाई)",
  "Weeding (निराई-गुड़ाई)",
  "Pruning (छंटाई)",
  "Packaging (पैकिंग)",
];

const CROP_OPTIONS = [
  "Wheat (गेहूं)",
  "Paddy / Rice (धान)",
  "Cotton (कपास)",
  "Mustard (सरसों)",
  "Soybean (सोयाबीन)",
  "Sugarcane (गन्ना)",
  "Tomato (टमाटर)",
  "Potato (आलू)",
  "Onion (प्याज)",
  "Chilli (मिर्च)",
  "Maize (मक्का)",
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  currentLanguage,
  onUpdateProfile,
  onRoleChange,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Local form state
  const [name, setName] = useState(userProfile?.name || "Kisan Sathi");
  const [phone, setPhone] = useState(userProfile?.phone || "9876543210");
  const [locationName, setLocationName] = useState(userProfile?.locationName || "Indore, Madhya Pradesh");
  const [landSizeAcre, setLandSizeAcre] = useState(userProfile?.landSizeAcre || "3.5");
  const [primaryCrop, setPrimaryCrop] = useState(userProfile?.primaryCrop || "Wheat (गेहूं)");
  const [dailyRateWage, setDailyRateWage] = useState(userProfile?.dailyRateWage || 450);
  const [skills, setSkills] = useState<string[]>(userProfile?.skills || ["Harvesting (कटाई)", "Sowing & Seeding (बुवाई)"]);
  const [avatarIcon, setAvatarIcon] = useState(userProfile?.avatarIcon || "👨‍🌾");
  const [isAvailableForWork, setIsAvailableForWork] = useState(userProfile?.isAvailableForWork ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleSkill = (skill: string) => {
    soundEffects.click();
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.click();

    const updatedProfile: UserProfile = {
      ...(userProfile || {
        id: "usr-" + Date.now(),
        role: "farmer",
        language: currentLanguage,
        farmRiskScore: 18,
        hasIoTDevice: true,
        isRegistered: true,
      }),
      name: name.trim() || "Kisan Sathi",
      phone: phone.trim() || "9876543210",
      locationName: locationName.trim() || "Indore, Madhya Pradesh",
      landSizeAcre,
      primaryCrop,
      dailyRateWage: Number(dailyRateWage) || 450,
      skills,
      avatarIcon,
      isAvailableForWork,
    };

    onUpdateProfile(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const currentRole = userProfile?.role || "farmer";

  return createPortal(
    <div
      id="profile-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEffects.click();
          onClose();
        }
      }}
    >
      <div
        id="profile-modal-content"
        className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-2xl shadow-inner">
              {avatarIcon}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                {currentLanguage === "hi" ? "मेरी प्रोफ़ाइल (Profile)" : "User Profile & Account"}
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                {currentLanguage === "hi"
                  ? "व्यक्तिगत जानकारी और कृषि विवरण अपडेट करें"
                  : "View and edit your personal & farming details"}
              </p>
            </div>
          </div>
          <button
            id="close-profile-modal-btn"
            type="button"
            onClick={() => {
              soundEffects.click();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              {currentLanguage === "hi" ? "प्रोफ़ाइल अवतार चुनें" : "Select Profile Avatar"}
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {AVATAR_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setAvatarIcon(icon);
                  }}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all ${
                    avatarIcon === icon
                      ? "bg-emerald-600 text-white scale-110 shadow-md ring-2 ring-emerald-500 ring-offset-2"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-emerald-700" />
              <span>{currentLanguage === "hi" ? "पूरा नाम (Full Name)" : "Full Name"}</span>
            </label>
            <input
              id="profile-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-stone-900 font-semibold text-sm outline-hidden transition-all"
              placeholder="e.g. Ramesh Kumar Patel"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Phone size={14} className="text-emerald-700" />
              <span>{currentLanguage === "hi" ? "मोबाइल नंबर (Phone Number)" : "Phone Number"}</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-3 rounded-xl bg-stone-100 border border-stone-300 text-stone-700 font-bold text-sm">
                +91
              </span>
              <input
                id="profile-phone-input"
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-stone-900 font-semibold text-sm outline-hidden transition-all tracking-wider"
                placeholder="9876543210"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-700" />
              <span>{currentLanguage === "hi" ? "गांव / जिला (Location / Village)" : "Location / Village & State"}</span>
            </label>
            <input
              id="profile-location-input"
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-stone-900 font-semibold text-sm outline-hidden transition-all"
              placeholder="e.g. Indore, Madhya Pradesh"
            />
          </div>

          {/* Role-Specific Fields */}
          {currentRole === "farmer" && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <Sprout size={15} />
                <span>{currentLanguage === "hi" ? "खेत एवं फसल विवरण" : "Farm & Crop Details"}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {currentLanguage === "hi" ? "भूमि का आकार (एकड़)" : "Land Size (Acres)"}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={landSizeAcre}
                    onChange={(e) => setLandSizeAcre(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-emerald-200 bg-white font-bold text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="3.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {currentLanguage === "hi" ? "मुख्य फसल" : "Primary Crop"}
                  </label>
                  <select
                    value={primaryCrop}
                    onChange={(e) => setPrimaryCrop(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-emerald-200 bg-white font-bold text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {CROP_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentRole === "labour" && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <Briefcase size={15} />
                  <span>{currentLanguage === "hi" ? "मजदूरी एवं कार्य उपलब्धता" : "Work Availability & Wages"}</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-stone-700">
                    {isAvailableForWork ? "🟢 Available" : "⚪ Busy"}
                  </span>
                  <input
                    type="checkbox"
                    checked={isAvailableForWork}
                    onChange={(e) => setIsAvailableForWork(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {currentLanguage === "hi" ? "अपेक्षित दैनिक मजदूरी (₹ / दिन)" : "Expected Daily Wage (₹ / Day)"}
                </label>
                <input
                  type="number"
                  value={dailyRateWage}
                  onChange={(e) => setDailyRateWage(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-amber-200 bg-white font-bold text-sm text-stone-900 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="450"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {currentLanguage === "hi" ? "कौशल चुनें (Skills)" : "Your Skills & Capabilities"}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SKILLS_LIST.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => handleToggleSkill(sk)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                        skills.includes(sk)
                          ? "bg-amber-600 text-white font-bold shadow-xs"
                          : "bg-white text-stone-700 border border-stone-200 hover:bg-amber-50"
                      }`}
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentRole === "gardener" && (
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
                <Sprout size={15} />
                <span>{currentLanguage === "hi" ? "गार्डन का प्रकार" : "Garden Type & Space"}</span>
              </div>
              <p className="text-xs text-stone-700">
                {currentLanguage === "hi"
                  ? "घर के पौधे, गमले, बालकनी व छत के बगीचे की देखभाल सक्रिय है।"
                  : "Balcony & Terrace Garden Care profile is active."}
              </p>
            </div>
          )}

          {currentRole === "fpo" && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                <Building2 size={15} />
                <span>{currentLanguage === "hi" ? "FPO संगठन विवरण" : "FPO Cooperative Profile"}</span>
              </div>
              <p className="text-xs text-stone-700">
                <strong>Org:</strong> {userProfile?.fpoDetails?.organizationName || "Indore Kisan Producer Co."} (Code:{" "}
                {userProfile?.fpoDetails?.inviteCode || "FPO-IND-2025"})
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              id="save-profile-btn"
              type="submit"
              className={`flex-1 py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 text-white ${
                savedSuccess
                  ? "bg-emerald-800 shadow-emerald-900/30"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20"
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check size={18} className="stroke-[3]" />
                  <span>{currentLanguage === "hi" ? "सफलतापूर्वक सहेजा गया!" : "Profile Saved!"}</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>{currentLanguage === "hi" ? "बदलाव सहेजें (Save Changes)" : "Save Profile Details"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                onClose();
              }}
              className="py-3.5 px-4 rounded-2xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-sm transition-all"
            >
              {t.common.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
