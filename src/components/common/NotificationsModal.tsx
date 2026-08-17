import React from "react";
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  Droplets,
  TrendingUp,
  Sparkles,
  Sun,
  Briefcase,
  Sprout,
  Users,
  Building2,
} from "lucide-react";
import { LanguageCode, NotificationItem, UserRole } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { AudioButton } from "./AudioButton";
import { soundEffects } from "../../utils/audio";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  currentLanguage: LanguageCode;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification: (id: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  currentLanguage,
  notifications,
  onMarkAllRead,
  onSelectNotification,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  if (!isOpen) return null;

  const getSubTitle = () => {
    const isHindi = currentLanguage === "hi";
    switch (currentRole) {
      case "farmer":
        return isHindi ? "खेत सलाह, सेंसर व मंडी अलर्ट" : "Real-time farm advisory & sensor alerts";
      case "gardener":
        return isHindi ? "गमले की देखभाल व सिंचाई रिमाइंडर" : "Balcony plant care & pot reminders";
      case "labour":
        return isHindi ? "नए काम व मजदूरी अपडेट" : "Job postings & application updates";
      case "fpo":
        return isHindi ? "क्लस्टर रोग व संस्था अलर्ट" : "Cluster outbreaks & member advisories";
      default:
        return "Real-time advisory alerts";
    }
  };

  const getEmptyMessage = () => {
    const isHindi = currentLanguage === "hi";
    switch (currentRole) {
      case "farmer":
        return isHindi ? "कोई नया खेत या सेंसर अलर्ट नहीं है" : "No active farm or sensor alerts";
      case "gardener":
        return isHindi ? "सभी पौधों में पानी भरा है और कोई अलर्ट नहीं" : "All pots watered! No active plant alerts";
      case "labour":
        return isHindi ? "फिलहाल कोई नया काम अलर्ट नहीं है" : "No active job alerts or updates";
      case "fpo":
        return isHindi ? "कोई नया क्लस्टर या सदस्य अलर्ट नहीं है" : "No active cluster or member alerts";
      default:
        return isHindi ? "कोई नया अलर्ट नहीं है" : "No active notifications";
    }
  };

  const getIcon = (cat: string) => {
    if (cat === "weather") return <Sun size={20} className="text-amber-600" />;
    if (cat === "disease" || cat === "pest") return <AlertTriangle size={20} className="text-rose-600" />;
    if (cat === "market") return <TrendingUp size={20} className="text-emerald-600" />;
    if (cat === "sensor" || cat === "irrigation" || cat === "watering") return <Droplets size={20} className="text-sky-600" />;
    if (cat === "job") return <Briefcase size={20} className="text-amber-700" />;
    if (cat === "plant") return <Sprout size={20} className="text-teal-600" />;
    if (cat === "fpo" || cat === "members") return <Building2 size={20} className="text-indigo-600" />;
    return <Sparkles size={20} className="text-indigo-600" />;
  };

  // Filter notifications strictly by active currentRole
  const filteredNotifications = notifications.filter((notif) => {
    if (notif.targetRoles && notif.targetRoles.length > 0) {
      return notif.targetRoles.includes(currentRole);
    }
    if (notif.role) {
      return notif.role === currentRole;
    }
    // Fallback: If no role tag, only show for farmer
    return currentRole === "farmer";
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 border border-stone-200 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <Bell size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-stone-900 leading-tight">
                  {t.nav.alerts}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                  {currentRole}
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-600 mt-0.5">{getSubTitle()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                onMarkAllRead();
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 active:scale-95"
            >
              <CheckCheck size={14} />
              <span>Mark Read</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 active:scale-95"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-stone-700 space-y-2">
              <Bell size={32} className="mx-auto opacity-30" />
              <p className="text-xs font-bold">{getEmptyMessage()}</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  soundEffects.click();
                  onSelectNotification(notif.id);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  notif.isRead
                    ? "bg-white border-stone-200 opacity-75"
                    : notif.severity === "high" || notif.urgency === "high" || notif.urgency === "critical"
                    ? "bg-rose-50 border-rose-300 shadow-2xs"
                    : "bg-emerald-50/60 border-emerald-300 shadow-2xs"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{getIcon(notif.category)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-stone-900">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-stone-700 mt-0.5 leading-relaxed">
                      {notif.message || notif.description}
                    </p>
                    <span className="text-[10px] font-semibold text-stone-500 block mt-1">
                      {notif.timestamp || notif.timeAgo || "Recent"}
                    </span>
                  </div>
                </div>

                <AudioButton
                  textToSpeak={`${notif.title}. ${notif.message || notif.description}`}
                  language={currentLanguage}
                  size="sm"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
