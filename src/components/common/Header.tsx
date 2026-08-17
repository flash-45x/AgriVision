import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Globe,
  Bell,
  Sparkles,
  Volume2,
  Shield,
  User,
  ChevronDown,
  Check,
  LogOut,
  Sliders,
  HelpCircle,
  AlertTriangle,
  X,
  Building2,
  Sprout,
  Briefcase,
} from "lucide-react";
import { UserRole, LanguageCode, UserProfile } from "../../types";
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from "../../data/translations";
import { soundEffects, speakText } from "../../utils/audio";
import { LanguageSelectionModal } from "./LanguageSelectionModal";
import { AgriVisionLogo } from "./AgriVisionLogo";
import { ProfileModal } from "./ProfileModal";
import { SettingsModal } from "./SettingsModal";
import { HelpSupportModal } from "./HelpSupportModal";

interface HeaderProps {
  currentRole: UserRole;
  currentLanguage: LanguageCode;
  userProfile?: UserProfile;
  onUpdateProfile?: (updated: UserProfile) => void;
  onRoleChange: (role: UserRole) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenNotifications: () => void;
  onOpenAssistant: (prompt?: string) => void;
  unreadNotifsCount: number;
  onLogout?: () => void;
  onNavigate?: (actionType: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentLanguage,
  userProfile,
  onUpdateProfile,
  onRoleChange,
  onLanguageChange,
  onOpenNotifications,
  onOpenAssistant,
  unreadNotifsCount,
  onLogout,
  onNavigate,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isFullLangModalOpen, setIsFullLangModalOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const roleLabels: Record<UserRole, { label: string; badgeColor: string; icon: string }> = {
    farmer: { label: t.roles.farmer.title, badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: "🌾" },
    gardener: { label: t.roles.gardener.title, badgeColor: "bg-teal-100 text-teal-800 border-teal-300", icon: "🌱" },
    labour: { label: t.roles.labour.title, badgeColor: "bg-amber-100 text-amber-800 border-amber-300", icon: "🛠️" },
    fpo: { label: t.roles.fpo.title, badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300", icon: "🏢" },
  };

  const handleConfirmLogout = () => {
    soundEffects.click();
    setIsLogoutConfirmOpen(false);
    setIsAccountOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-200/80 shadow-xs px-3 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand & Connectivity */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200/80 shadow-xs p-1 flex items-center justify-center">
            <AgriVisionLogo size={32} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-emerald-950">
                Agri<span className="text-emerald-600">Vision</span>
              </h1>
              <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                AI 3.7
              </span>
            </div>
            <p className="text-[11px] text-stone-700 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Action Controls: Role Switcher, Language Picker, Notifications, Account Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Role Switcher Button */}
          <div className="relative">
            <button
              id="header-role-btn"
              type="button"
              onClick={() => {
                soundEffects.click();
                setIsRoleOpen(!isRoleOpen);
                setIsLangOpen(false);
                setIsAccountOpen(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs sm:text-sm font-bold transition-all shadow-2xs active:scale-95 ${roleLabels[currentRole].badgeColor}`}
            >
              <span>{roleLabels[currentRole].icon}</span>
              <span className="hidden md:inline">{roleLabels[currentRole].label.split("(")[0]}</span>
              <span className="md:hidden capitalize">{currentRole}</span>
              <ChevronDown size={14} className="opacity-70" />
            </button>

            {/* Role Dropdown Menu */}
            {isRoleOpen && (
              <div
                id="role-dropdown-menu"
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-700 border-b border-stone-100">
                  {t.selectRole}
                </div>
                {(["farmer", "gardener", "labour", "fpo"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      onRoleChange(r);
                      setIsRoleOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors text-xs font-semibold ${
                      currentRole === r
                        ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                        : "hover:bg-stone-50 text-stone-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{roleLabels[r].icon}</span>
                      <div>
                        <div className="font-bold text-stone-900">{t.roles[r].title}</div>
                        <div className="text-[10px] text-stone-700 line-clamp-1">{t.roles[r].desc}</div>
                      </div>
                    </div>
                    {currentRole === r && <Check size={16} className="text-emerald-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher Tile Button */}
          <div className="relative">
            <button
              id="header-lang-btn"
              type="button"
              onClick={() => {
                soundEffects.click();
                setIsLangOpen(!isLangOpen);
                setIsRoleOpen(false);
                setIsAccountOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs sm:text-sm font-bold transition-all active:scale-95"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                {currentLangObj.flagOrScript}
              </span>
              <span className="hidden sm:inline font-bold">{currentLangObj.nativeName}</span>
              <ChevronDown size={14} className="opacity-60" />
            </button>

            {/* Language Selector Grid Dropdown */}
            {isLangOpen && (
              <div
                id="language-dropdown-grid"
                className="absolute right-0 mt-2 w-72 sm:w-84 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {t.selectLanguage}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLangOpen(false);
                      setIsFullLangModalOpen(true);
                    }}
                    title="Open Full Language Screen"
                    className="p-1 rounded-md text-emerald-700 hover:bg-emerald-50 flex items-center gap-1 text-[11px] font-bold"
                  >
                    <Globe size={13} />
                    <span>Full Grid</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        soundEffects.click();
                        onLanguageChange(lang.code);
                        speakText(lang.greeting, lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                        currentLanguage === lang.code
                          ? "bg-emerald-600 text-white font-bold shadow-xs"
                          : "bg-stone-50 hover:bg-emerald-50 text-stone-800 border border-stone-200"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${
                          currentLanguage === lang.code
                            ? "bg-white/20 text-white"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {lang.flagOrScript}
                      </span>
                      <div>
                        <div className="text-xs font-bold leading-tight">{lang.nativeName}</div>
                        <div
                          className={`text-[10px] ${
                            currentLanguage === lang.code ? "text-emerald-100" : "text-stone-700"
                          }`}
                        >
                          {lang.englishName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            id="header-notif-btn"
            type="button"
            onClick={() => {
              soundEffects.click();
              onOpenNotifications();
            }}
            title="Alerts & Notifications"
            className="relative p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-all active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <Bell size={19} />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white animate-bounce">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* New Account Button & Dropdown Menu */}
          <div className="relative">
            <button
              id="header-account-btn"
              type="button"
              onClick={() => {
                soundEffects.click();
                setIsAccountOpen(!isAccountOpen);
                setIsRoleOpen(false);
                setIsLangOpen(false);
              }}
              title="Account & Profile Menu"
              aria-label="Account and Settings"
              className={`p-2 rounded-xl border transition-all active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center ${
                isAccountOpen
                  ? "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs"
                  : "border-stone-200 bg-white hover:bg-stone-50 text-stone-700"
              }`}
            >
              {userProfile?.avatarIcon ? (
                <span className="text-lg leading-none">{userProfile.avatarIcon}</span>
              ) : (
                <User size={19} />
              )}
            </button>

            {/* Account Popover / Dropdown Menu */}
            {isAccountOpen && (
              <div
                id="account-dropdown-menu"
                className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                {/* User Summary Header */}
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center text-xl shrink-0 font-bold">
                      {userProfile?.avatarIcon || "👨‍🌾"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black text-stone-900 truncate">
                        {userProfile?.name || "Kisan Sathi"}
                      </div>
                      <div className="text-[11px] text-stone-700 truncate font-semibold">
                        +91 {userProfile?.phone || "9876543210"}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${roleLabels[currentRole].badgeColor}`}
                        >
                          {roleLabels[currentRole].icon} {currentRole}
                        </span>
                        <span className="text-[10px] text-stone-700 font-semibold truncate">
                          {userProfile?.locationName?.split(",")[0] || "Indore"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                  {/* 1. Profile */}
                  <button
                    id="account-menu-profile-btn"
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      setIsAccountOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 text-stone-800 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <User size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-900">
                        {currentLanguage === "hi" ? "मेरी प्रोफ़ाइल (Profile)" : "Profile"}
                      </div>
                      <div className="text-[10px] text-stone-700">
                        {currentLanguage === "hi" ? "नाम, फोन, गांव व फसल विवरण" : "View and edit profile details"}
                      </div>
                    </div>
                  </button>

                  {/* 2. Settings */}
                  <button
                    id="account-menu-settings-btn"
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      setIsAccountOpen(false);
                      setIsSettingsModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-100 text-stone-800 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:bg-stone-800 group-hover:text-white transition-colors">
                      <Sliders size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-stone-900 group-hover:text-stone-900">
                        {currentLanguage === "hi" ? "ऐप सेटिंग्स (Settings)" : "Settings"}
                      </div>
                      <div className="text-[10px] text-stone-700">
                        {currentLanguage === "hi" ? "सूचनाएं, ध्वनियां व इकाइयां" : "Notifications, audio & units"}
                      </div>
                    </div>
                  </button>

                  {/* 3. Help & Support */}
                  <button
                    id="account-menu-help-btn"
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      setIsAccountOpen(false);
                      setIsHelpModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-teal-50 text-stone-800 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                      <HelpCircle size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-stone-900 group-hover:text-teal-900">
                        {currentLanguage === "hi" ? "सहायता एवं संपर्क (Help)" : "Help / Support"}
                      </div>
                      <div className="text-[10px] text-stone-700">
                        {currentLanguage === "hi" ? "किसान कॉल सेंटर व एआई गाइड" : "Kisan Helpline, AI guide & FAQs"}
                      </div>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="my-1.5 border-t border-stone-200" />

                  {/* 4. Log Out (Red & Separated) */}
                  <button
                    id="account-menu-logout-btn"
                    type="button"
                    onClick={() => {
                      soundEffects.click();
                      setIsAccountOpen(false);
                      setIsLogoutConfirmOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <LogOut size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-extrabold text-rose-600 group-hover:text-rose-700">
                        {currentLanguage === "hi" ? "लॉग आउट करें (Log Out)" : "Log Out"}
                      </div>
                      <div className="text-[10px] text-rose-700">
                        {currentLanguage === "hi" ? "खाता बंद या स्विच करें" : "Sign out or switch phone number"}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Language Selection Modal (Re-accessible anytime) */}
      <LanguageSelectionModal
        isOpen={isFullLangModalOpen}
        onClose={() => setIsFullLangModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => {
          onLanguageChange(lang);
          setIsFullLangModalOpen(false);
        }}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        currentLanguage={currentLanguage}
        onUpdateProfile={(updated) => {
          if (onUpdateProfile) {
            onUpdateProfile(updated);
          }
        }}
        onRoleChange={onRoleChange}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />

      {/* Help & Support Modal */}
      <HelpSupportModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        currentLanguage={currentLanguage}
        currentRole={currentRole}
        userProfile={userProfile}
        onOpenAssistant={onOpenAssistant}
        onNavigate={onNavigate}
        onRoleChange={onRoleChange}
        onLanguageChange={onLanguageChange}
      />

      {/* Logout Confirmation Dialog Modal */}
      {isLogoutConfirmOpen &&
        createPortal(
          <div
            id="logout-confirm-modal-backdrop"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                soundEffects.click();
                setIsLogoutConfirmOpen(false);
              }
            }}
          >
            <div
              id="logout-confirm-modal-content"
              className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-sm w-full p-5 sm:p-6 text-center animate-in zoom-in-95 duration-150"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4 border border-rose-200">
                <LogOut size={28} />
              </div>

              <h3 className="text-lg font-black text-stone-900 tracking-tight">
                {currentLanguage === "hi" ? "क्या आप लॉग आउट करना चाहते हैं?" : "Are you sure you want to log out?"}
              </h3>

              <p className="text-xs text-stone-700 mt-2 leading-relaxed">
                {currentLanguage === "hi"
                  ? "लॉग आउट करने पर आपको दोबारा साइन इन करने के लिए अपना मोबाइल नंबर और ओटीपी दर्ज करना होगा।"
                  : "You will need to re-enter your mobile number and OTP verification to log back into your AgriVision workspace."}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  id="cancel-logout-btn"
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    setIsLogoutConfirmOpen(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-sm transition-all"
                >
                  {t.common.cancel}
                </button>

                <button
                  id="confirm-logout-btn"
                  type="button"
                  onClick={handleConfirmLogout}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md shadow-rose-600/20 active:scale-98 transition-all"
                >
                  {currentLanguage === "hi" ? "हाँ, लॉग आउट" : "Yes, Log Out"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};
