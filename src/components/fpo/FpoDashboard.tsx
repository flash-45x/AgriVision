import React, { useState, useEffect } from "react";
import { UserProfile, LanguageCode, FpoFarmerMember, FpoAdminProfile } from "../../types";
import { TRANSLATIONS } from "../../data/translations";
import { INITIAL_FPO_PROFILE, INITIAL_FPO_MEMBERS } from "../../data/fpoData";
import { FpoOverviewTab } from "./FpoOverviewTab";
import { FpoMembersTab } from "./FpoMembersTab";
import { FpoBroadcastTab } from "./FpoBroadcastTab";
import { FpoReportsTab } from "./FpoReportsTab";
import { FpoChatbotTab } from "./FpoChatbotTab";
import { FpoMemberProfileModal } from "./FpoMemberProfileModal";
import { FpoInviteModal } from "./FpoInviteModal";
import { soundEffects } from "../../utils/audio";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  FileSpreadsheet,
  Bot,
} from "lucide-react";

interface FpoDashboardProps {
  userProfile: UserProfile;
  currentLanguage: LanguageCode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenVoiceAssistantWithPrompt?: (prompt: string) => void;
}

const VALID_FPO_TABS = ["dashboard", "members", "broadcast", "reports", "chatbot"] as const;
type FpoTabId = (typeof VALID_FPO_TABS)[number];

const normalizeFpoTab = (tab?: string): FpoTabId => {
  if (!tab || tab === "home" || tab === "overview" || tab === "none") return "dashboard";
  if (VALID_FPO_TABS.includes(tab as FpoTabId)) return tab as FpoTabId;
  return "dashboard";
};

export const FpoDashboard: React.FC<FpoDashboardProps> = ({
  userProfile,
  currentLanguage,
  activeTab = "dashboard",
  onTabChange,
  onOpenVoiceAssistantWithPrompt,
}) => {
  const [currentTab, setCurrentTab] = useState<FpoTabId>(() => normalizeFpoTab(activeTab));
  const [members, setMembers] = useState<FpoFarmerMember[]>(INITIAL_FPO_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<FpoFarmerMember | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Sync external tab changes if activeTab prop changes
  useEffect(() => {
    setCurrentTab(normalizeFpoTab(activeTab));
  }, [activeTab]);

  const handleSwitchTab = (tab: string) => {
    soundEffects.click();
    const normalized = normalizeFpoTab(tab);
    setCurrentTab(normalized);
    if (onTabChange) {
      onTabChange(normalized);
    }
  };

  // Compile active FPO Profile merging userProfile.fpoDetails if present
  const fpoProfile: FpoAdminProfile = {
    ...INITIAL_FPO_PROFILE,
    organizationName:
      userProfile.fpoDetails?.organizationName ||
      userProfile.name ||
      INITIAL_FPO_PROFILE.organizationName,
    registrationNumber:
      userProfile.fpoDetails?.registrationNumber ||
      INITIAL_FPO_PROFILE.registrationNumber,
    serviceRegion:
      userProfile.fpoDetails?.serviceRegion ||
      userProfile.locationName ||
      INITIAL_FPO_PROFILE.serviceRegion,
    adminName: userProfile.fpoDetails?.adminName || INITIAL_FPO_PROFILE.adminName,
    adminRole: userProfile.fpoDetails?.adminRole || INITIAL_FPO_PROFILE.adminRole,
    memberCountRange:
      userProfile.fpoDetails?.approximateMemberCount ||
      INITIAL_FPO_PROFILE.memberCountRange,
  };

  const handleAddManualMember = (newMemData: {
    name: string;
    phone: string;
    village: string;
    landSizeAcres: number;
    primaryCrop: string;
  }) => {
    const newMember: FpoFarmerMember = {
      id: `mem-${Date.now()}`,
      name: newMemData.name,
      phone: newMemData.phone,
      village: newMemData.village,
      landSizeAcres: newMemData.landSizeAcres,
      primaryCrop: newMemData.primaryCrop,
      farmRiskScore: 24,
      riskLevel: "Low",
      hasActiveAlert: false,
      iotKitStatus: "Not Installed",
      pmKisanStatus: "Enrolled & Active",
      soilHealthCardStatus: "Updated (2025)",
      joinDate: "Just now",
      isActive: true,
      avatarIcon: "👨‍🌾",
      recentActivity: "Newly registered into FPO registry",
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-28 max-w-6xl mx-auto px-3 sm:px-6 pt-3 sm:pt-5 space-y-4">
      {/* Top Segmented Navigation Tabs for Quick Switching on Desktop & Mobile */}
      <div className="bg-white p-1.5 rounded-2xl border-2 border-stone-200 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: "dashboard", label: "Overview", icon: LayoutDashboard },
          { id: "members", label: "Members (342)", icon: Users },
          { id: "broadcast", label: "Broadcast & Labour", icon: Megaphone },
          { id: "reports", label: "Insights & Reports", icon: FileSpreadsheet },
          { id: "chatbot", label: "AI Copilot", icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSwitchTab(tab.id)}
              className={`flex-1 min-w-fit py-2.5 px-3 sm:px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 ${
                isActive
                  ? "bg-indigo-900 text-white shadow-xs"
                  : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Render */}
      {currentTab === "dashboard" && (
        <FpoOverviewTab
          fpoProfile={fpoProfile}
          members={members}
          currentLanguage={currentLanguage}
          onNavigateTab={handleSwitchTab}
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
          onSelectMember={(mem) => setSelectedMember(mem)}
        />
      )}

      {currentTab === "members" && (
        <FpoMembersTab
          members={members}
          currentLanguage={currentLanguage}
          onSelectMember={(mem) => setSelectedMember(mem)}
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
        />
      )}

      {currentTab === "broadcast" && (
        <FpoBroadcastTab
          currentLanguage={currentLanguage}
        />
      )}

      {currentTab === "reports" && (
        <FpoReportsTab
          currentLanguage={currentLanguage}
        />
      )}

      {currentTab === "chatbot" && (
        <FpoChatbotTab
          currentLanguage={currentLanguage}
          onNavigateTab={handleSwitchTab}
        />
      )}

      {/* Farmer Profile Inspector Modal */}
      {selectedMember && (
        <FpoMemberProfileModal
          member={selectedMember}
          currentLanguage={currentLanguage}
          onClose={() => setSelectedMember(null)}
          onRemoveMember={handleRemoveMember}
          onSendAlert={(mem) => {
            setSelectedMember(null);
            handleSwitchTab("broadcast");
          }}
        />
      )}

      {/* Invite & QR Code Modal */}
      {isInviteModalOpen && (
        <FpoInviteModal
          currentLanguage={currentLanguage}
          inviteCode={fpoProfile.inviteCode}
          orgName={fpoProfile.organizationName}
          onClose={() => setIsInviteModalOpen(false)}
          onAddManualMember={handleAddManualMember}
        />
      )}
    </div>
  );
};
