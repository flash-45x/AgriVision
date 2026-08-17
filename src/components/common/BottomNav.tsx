import React from "react";
import {
  Home,
  Camera,
  Cpu,
  TrendingUp,
  Briefcase,
  Sprout,
  Droplets,
  Mic,
  Users,
  AlertCircle,
  LayoutDashboard,
  Megaphone,
  FileText,
  MessageSquareText,
} from "lucide-react";
import { UserRole, LanguageCode } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { soundEffects } from "../../utils/audio";

interface BottomNavProps {
  currentRole: UserRole;
  currentLanguage: LanguageCode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenVoiceAssistant: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRole,
  currentLanguage,
  activeTab,
  onTabChange,
  onOpenVoiceAssistant,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Define nav items according to role constraints
  const getNavItems = () => {
    switch (currentRole) {
      case "farmer":
        return [
          { id: "home", label: t.nav.home, icon: Home },
          { id: "camera", label: t.nav.camera, icon: Camera },
          { id: "assistant", label: t.nav.assistant, icon: Mic, isVoiceCenter: true },
          { id: "iot", label: t.nav.iot, icon: Cpu },
          { id: "prices", label: t.nav.prices, icon: TrendingUp },
        ];
      case "gardener":
        return [
          { id: "home", label: t.nav.plants, icon: Sprout },
          { id: "camera", label: t.nav.camera, icon: Camera },
          { id: "assistant", label: t.nav.assistant, icon: Mic, isVoiceCenter: true },
          { id: "water", label: t.nav.water || "Watering", icon: Droplets },
          { id: "alerts", label: t.nav.alerts, icon: AlertCircle },
        ];
      case "labour":
        return [
          { id: "home", label: t.nav.jobs, icon: Briefcase },
          { id: "applied", label: t.labour?.applied || "Applied", icon: FileText },
          { id: "assistant", label: t.nav.assistant, icon: Mic, isVoiceCenter: true },
          { id: "skills", label: t.labour?.skills || "Skills", icon: Users },
          { id: "alerts", label: t.nav.alerts, icon: AlertCircle },
        ];
      case "fpo":
        return [
          { id: "dashboard", label: t.fpo?.dashboard || "Dashboard", icon: LayoutDashboard },
          { id: "members", label: t.fpo?.members || "Members", icon: Users },
          { id: "broadcast", label: t.fpo?.broadcast || "Broadcast", icon: Megaphone },
          { id: "reports", label: t.fpo?.reports || "Reports", icon: FileText },
          { id: "chatbot", label: t.fpo?.chatbot || "AI Advisor", icon: MessageSquareText },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Main navigation"
      role="tablist"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-2 pb-safe"
    >
      <div className="max-w-md mx-auto flex items-center justify-around py-1 sm:py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isVoiceCenter) {
            return (
              <button
                key={item.id}
                id="bottom-nav-voice-assistant"
                type="button"
                aria-label={item.label}
                onClick={() => {
                  soundEffects.click();
                  onOpenVoiceAssistant();
                }}
                className="group relative -top-3.5 flex flex-col items-center justify-center focus:outline-hidden touch-manipulation min-w-[56px]"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-700/25 flex items-center justify-center ring-4 ring-white active:scale-90 transition-transform duration-150">
                  <Mic size={26} className="animate-pulse drop-shadow-xs" />
                </div>
                <span className="text-[11px] font-bold text-emerald-900 mt-1 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={item.label}
              onClick={() => {
                soundEffects.click();
                onTabChange(item.id);
              }}
              className="flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-2xl transition-all active:scale-95 min-w-[56px] sm:min-w-[64px] min-h-[48px] touch-manipulation focus:outline-hidden"
            >
              {/* Icon with active highlight pill and indicator dot */}
              <div
                className={`relative px-3.5 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/30 shadow-xs"
                    : "bg-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-100/60"
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-transform duration-200 ${
                    isActive
                      ? "text-emerald-700 stroke-[2.4] scale-105"
                      : "text-stone-500 group-hover:text-stone-700 stroke-[1.8]"
                  }`}
                />

                {/* Visible active indicator dot */}
                {isActive && (
                  <span
                    id={`active-dot-${item.id}`}
                    aria-hidden="true"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-xs animate-in zoom-in-50 duration-150"
                  />
                )}
              </div>

              {/* Label: Bold & Emerald when active, Regular & Stone when inactive */}
              <span
                className={`text-[11px] mt-0.5 whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? "text-emerald-800 font-bold tracking-tight"
                    : "text-stone-600 font-normal hover:text-stone-900"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
