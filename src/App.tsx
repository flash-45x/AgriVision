import React, { useState, useEffect, useMemo } from "react";
import {
  UserProfile,
  LanguageCode,
  UserRole,
  PriorityAction,
  FarmRiskFactor,
  IoTSensorData,
  MarketPriceItem,
  NotificationItem,
  LabourJob,
  DiseaseDiagnosis,
} from "./types";
import {
  INITIAL_USER,
  INITIAL_PRIORITY_ACTIONS,
  INITIAL_RISK_FACTORS,
  INITIAL_IOT_DATA,
  INITIAL_MARKET_PRICES,
  INITIAL_NOTIFICATIONS,
} from "./data/mockData";
import { TRANSLATIONS } from "./data/translations";

import { Header } from "./components/common/Header";
import { BottomNav } from "./components/common/BottomNav";
import { VoiceAssistantModal } from "./components/common/VoiceAssistantModal";
import { NotificationsModal } from "./components/common/NotificationsModal";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";

import { FarmerDashboard } from "./components/farmer/FarmerDashboard";
import { DiseaseScannerView } from "./components/farmer/DiseaseScannerView";
import { IoTDeviceView } from "./components/farmer/IoTDeviceView";
import { MarketPricesView } from "./components/farmer/MarketPricesView";
import { CropRecommendationView } from "./components/farmer/CropRecommendationView";
import { FertilizerRecommendationView } from "./components/farmer/FertilizerRecommendationView";
import { WeeklyWeatherView } from "./components/farmer/WeeklyWeatherView";
import { YieldPredictionView } from "./components/farmer/YieldPredictionView";
import { HireLabourModal } from "./components/farmer/HireLabourModal";

import { GardenerDashboard } from "./components/gardener/GardenerDashboard";
import { GardenerWeatherView } from "./components/gardener/GardenerWeatherView";
import { GardenerWeeklyWeatherView } from "./components/gardener/GardenerWeeklyWeatherView";
import { LabourDashboard } from "./components/labour/LabourDashboard";
import { FpoDashboard } from "./components/fpo/FpoDashboard";

export default function App() {
  // State: User Profile & Onboarding
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("agrivision_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USER;
  });

  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(
    userProfile.language || "hi"
  );
  const [currentRole, setCurrentRole] = useState<UserRole>(
    userProfile.role || "farmer"
  );

  // Active View / Tab
  const [activeTab, setActiveTab] = useState<string>("home");

  // Secondary Views inside Farmer Role
  const [subView, setSubView] = useState<
    | "none"
    | "disease_camera"
    | "iot_sensors"
    | "market_prices"
    | "crop_recommend"
    | "fertilizer_recommend"
    | "weekly_weather"
    | "gardener_weekly_weather"
    | "yield_prediction"
  >("none");

  // Dynamic Data States
  const [priorityActions, setPriorityActions] = useState<PriorityAction[]>(
    INITIAL_PRIORITY_ACTIONS
  );
  const [riskFactors, setRiskFactors] = useState<FarmRiskFactor[]>(
    INITIAL_RISK_FACTORS
  );
  const [iotData, setIotData] = useState<IoTSensorData>(INITIAL_IOT_DATA);
  const [marketPrices, setMarketPrices] = useState<MarketPriceItem[]>(
    INITIAL_MARKET_PRICES
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );

  // Modals
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | undefined>();
  const [assistantSourceSection, setAssistantSourceSection] = useState<string>("default");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHireLabourOpen, setIsHireLabourOpen] = useState(false);

  // Save profile changes
  useEffect(() => {
    localStorage.setItem("agrivision_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  // Sync role & language changes
  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    setUserProfile((prev) => ({ ...prev, language: lang }));
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setUserProfile((prev) => ({ ...prev, role }));
    setActiveTab(role === "fpo" ? "dashboard" : "home");
    setSubView("none");
  };

  const handleTogglePriorityAction = (actionId: string) => {
    setPriorityActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, isCompleted: !a.isCompleted } : a))
    );
  };

  const handleTogglePump = () => {
    setIotData((prev) => {
      const nextStatus = prev.pumpStatus === "ON" ? "OFF" : "ON";
      const nextMoisture = nextStatus === "ON" ? Math.min(100, prev.soilMoisturePercent + 12) : prev.soilMoisturePercent;
      return {
        ...prev,
        pumpStatus: nextStatus,
        soilMoisturePercent: nextMoisture,
        lastIrrigationTime: nextStatus === "ON" ? "Running now" : "Just now",
      };
    });
  };

  const handleJobCreated = (newJob: LabourJob) => {
    // Add notification alert strictly for farmer
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "New Job Broadcasted",
      message: `Your job for ${newJob.workersNeeded} workers (${newJob.jobType}) is now live to nearby labourers.`,
      timestamp: "Just now",
      severity: "low",
      category: "job",
      isRead: false,
      targetRoles: ["farmer"],
      role: "farmer",
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleOpenVoiceAssistantWithPrompt = (prompt?: string, section?: string) => {
    setAssistantPrompt(prompt);
    const computedSection = section || (subView !== "none" ? subView : activeTab || "default");
    setAssistantSourceSection(computedSection);
    setIsAssistantOpen(true);
  };

  const handleAssistantNavigateAction = (actionType: string) => {
    setIsAssistantOpen(false);
    switch (actionType) {
      case "navigate_disease":
        setActiveTab("camera");
        setSubView("disease_camera");
        break;
      case "navigate_mandi":
        setActiveTab("prices");
        setSubView("market_prices");
        break;
      case "navigate_weather":
        setActiveTab("home");
        if (currentRole === "gardener") {
          setSubView("gardener_weekly_weather");
        } else {
          setSubView("weekly_weather");
        }
        break;
      case "navigate_fertilizer":
        setActiveTab("home");
        setSubView("fertilizer_recommend");
        break;
      case "navigate_yield_prediction":
        setActiveTab("home");
        setSubView("yield_prediction");
        break;
      case "navigate_iot":
        setActiveTab("iot");
        setSubView("iot_sensors");
        break;
      case "navigate_hire_labour":
        setIsHireLabourOpen(true);
        break;
      case "navigate_job_feed":
        setActiveTab("home");
        setSubView("none");
        break;
      case "navigate_applied_jobs":
        setActiveTab("applied");
        setSubView("none");
        break;
      case "navigate_skills":
        setActiveTab("skills");
        setSubView("none");
        break;
      case "navigate_broadcast":
        setActiveTab("broadcast");
        setSubView("none");
        break;
      case "navigate_members":
        setActiveTab("members");
        setSubView("none");
        break;
      case "navigate_reports":
        setActiveTab("reports");
        setSubView("none");
        break;
      case "navigate_add_plant":
        setActiveTab("home");
        setSubView("none");
        break;
      case "navigate_water_reminders":
        setActiveTab("weather");
        setSubView("none");
        break;
      default:
        break;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home" || tab === "dashboard") {
      setSubView("none");
    } else if (tab === "camera") {
      setSubView("disease_camera");
    } else if (tab === "iot") {
      setSubView("iot_sensors");
    } else if (tab === "prices") {
      setSubView("market_prices");
    } else if (tab === "alerts") {
      setIsNotificationsOpen(true);
    } else {
      setSubView("none");
    }
  };

  const getEffectiveBottomNavTab = (): string => {
    if (currentRole === "farmer") {
      if (subView === "disease_camera") return "camera";
      if (subView === "iot_sensors") return "iot";
      if (subView === "market_prices") return "prices";
      // Sub-pages like crop recommendation, fertilizer, or weekly weather opened from home keep parent "home" active
      if (
        subView === "crop_recommend" ||
        subView === "fertilizer_recommend" ||
        subView === "weekly_weather"
      )
        return "home";
      return activeTab === "camera" || activeTab === "iot" || activeTab === "prices"
        ? activeTab
        : "home";
    }

    if (currentRole === "gardener") {
      if (subView === "disease_camera") return "camera";
      if (subView === "gardener_weekly_weather" || subView === "weekly_weather") return "home";
      if (activeTab === "camera" || activeTab === "water" || activeTab === "alerts") {
        return activeTab;
      }
      return "home";
    }

    if (currentRole === "labour") {
      if (activeTab === "skills" || activeTab === "profile") return "skills";
      if (activeTab === "applied" || activeTab === "applied_saved" || activeTab === "saved") return "applied";
      if (activeTab === "alerts") return "alerts";
      return "home";
    }

    if (currentRole === "fpo") {
      if (subView === "iot_sensors" || subView === "market_prices") return "dashboard";
      if (
        activeTab === "members" ||
        activeTab === "broadcast" ||
        activeTab === "reports" ||
        activeTab === "chatbot"
      ) {
        return activeTab;
      }
      return "dashboard";
    }

    return activeTab || "home";
  };

  // Strictly filter global data feeds by active currentRole
  const roleMarketPrices = useMemo(() => {
    // Only farmer and FPO manager workspaces utilize mandi market commodity prices
    if (currentRole === "farmer" || currentRole === "fpo") {
      return marketPrices;
    }
    return [];
  }, [marketPrices, currentRole]);

  const roleRiskFactors = useMemo(() => {
    // Only farmer workspace displays multi-vector farm risk scores
    if (currentRole === "farmer") {
      return riskFactors;
    }
    return [];
  }, [riskFactors, currentRole]);

  const roleIotData = useMemo(() => {
    // IoT sensor nodes are for field farmers and FPO managers
    return iotData;
  }, [iotData]);

  // Strictly filter notifications by active currentRole
  const roleNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (n.targetRoles && n.targetRoles.length > 0) {
        return n.targetRoles.includes(currentRole);
      }
      if (n.role) {
        return n.role === currentRole;
      }
      return currentRole === "farmer";
    });
  }, [notifications, currentRole]);

  // Unread badge strictly reflects current role notifications
  const unreadNotifsCount = useMemo(() => {
    return roleNotifications.filter((n) => !n.isRead).length;
  }, [roleNotifications]);

  // If user is not yet registered, display the Onboarding Flow
  if (!userProfile.isRegistered) {
    return (
      <OnboardingFlow
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onComplete={(newProfile) => {
          setUserProfile(newProfile);
          setCurrentRole(newProfile.role);
          setCurrentLanguage(newProfile.language);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-emerald-200">
      {/* Universal Top Header */}
      <Header
        currentRole={currentRole}
        currentLanguage={currentLanguage}
        userProfile={userProfile}
        onUpdateProfile={(updated) => setUserProfile(updated)}
        onRoleChange={handleRoleChange}
        onLanguageChange={handleLanguageChange}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAssistant={(prompt) => {
          setAssistantPrompt(prompt);
          setIsAssistantOpen(true);
        }}
        unreadNotifsCount={unreadNotifsCount}
        onNavigate={handleAssistantNavigateAction}
        onLogout={() => {
          setUserProfile((prev) => ({ ...prev, isRegistered: false }));
        }}
      />

      {/* Main Role-Based Workspaces & Sub-Views */}
      <main className="max-w-5xl mx-auto">
        {/* Farmer Workspace */}
        {currentRole === "farmer" && (
          <>
            {subView === "none" && (
              <FarmerDashboard
                userProfile={userProfile}
                currentLanguage={currentLanguage}
                priorityActions={priorityActions}
                onToggleAction={handleTogglePriorityAction}
                riskFactors={roleRiskFactors}
                iotData={roleIotData}
                onTogglePump={handleTogglePump}
                marketPrices={roleMarketPrices}
                onOpenDiseaseCamera={() => {
                  setActiveTab("camera");
                  setSubView("disease_camera");
                }}
                onOpenIoT={() => {
                  setActiveTab("iot");
                  setSubView("iot_sensors");
                }}
                onOpenMarketPrices={() => {
                  setActiveTab("prices");
                  setSubView("market_prices");
                }}
                onOpenCropRecommend={() => {
                  setActiveTab("home");
                  setSubView("crop_recommend");
                }}
                onOpenFertilizer={() => {
                  setActiveTab("home");
                  setSubView("fertilizer_recommend");
                }}
                onOpenWeeklyWeather={() => {
                  setActiveTab("home");
                  setSubView("weekly_weather");
                }}
                onOpenYieldPrediction={() => {
                  setActiveTab("home");
                  setSubView("yield_prediction");
                }}
                onOpenHireLabour={() => setIsHireLabourOpen(true)}
                onOpenVoiceAssistantWithPrompt={handleOpenVoiceAssistantWithPrompt}
              />
            )}

            {subView === "yield_prediction" && (
              <YieldPredictionView
                currentLanguage={currentLanguage}
                userProfile={userProfile}
                iotData={iotData}
                onBack={() => {
                  setActiveTab("home");
                  setSubView("none");
                }}
                onOpenMarketPrices={() => {
                  setActiveTab("prices");
                  setSubView("market_prices");
                }}
                onOpenFertilizer={() => {
                  setActiveTab("home");
                  setSubView("fertilizer_recommend");
                }}
                onOpenHireLabour={() => setIsHireLabourOpen(true)}
                onOpenIoT={() => {
                  setActiveTab("iot");
                  setSubView("iot_sensors");
                }}
                onOpenVoiceAssistantWithPrompt={handleOpenVoiceAssistantWithPrompt}
              />
            )}

            {subView === "weekly_weather" && (
              <WeeklyWeatherView
                currentLanguage={currentLanguage}
                userProfile={userProfile}
                onBack={() => {
                  setActiveTab("home");
                  setSubView("none");
                }}
                onOpenVoiceAssistantWithPrompt={handleOpenVoiceAssistantWithPrompt}
              />
            )}

            {subView === "disease_camera" && (
              <DiseaseScannerView
                currentLanguage={currentLanguage}
                currentRole={currentRole}
                onBack={() => {
                  setActiveTab("home");
                  setSubView("none");
                }}
              />
            )}

            {subView === "iot_sensors" && (
              <IoTDeviceView
                currentLanguage={currentLanguage}
                userProfile={userProfile}
                iotData={iotData}
                onTogglePump={handleTogglePump}
                onUpdateIotData={(updated) => setIotData((prev) => ({ ...prev, ...updated }))}
                onBack={() => {
                  setActiveTab("home");
                  setSubView("none");
                }}
                onOpenFertilizer={() => {
                  setActiveTab("home");
                  setSubView("fertilizer_recommend");
                }}
                onOpenCropRecommend={() => {
                  setActiveTab("home");
                  setSubView("crop_recommend");
                }}
                onOpenVoiceAssistantWithPrompt={(prompt) =>
                  handleOpenVoiceAssistantWithPrompt(prompt, "smart_sensors")
                }
              />
            )}

            {subView === "market_prices" && (
              <MarketPricesView
                currentLanguage={currentLanguage}
                marketPrices={marketPrices}
                onBack={() => {
                  setActiveTab("home");
                  setSubView("none");
                }}
              />
            )}

            {subView === "crop_recommend" && (
              <CropRecommendationView
                currentLanguage={currentLanguage}
                userProfile={userProfile}
                iotData={iotData}
                onBack={() => {
                  setActiveTab("home");
                  setSubView("none");
                }}
                onOpenSoilEntry={() => {
                  setActiveTab("iot");
                  setSubView("iot_sensors");
                }}
              />
            )}

            {subView === "fertilizer_recommend" && (
              <FertilizerRecommendationView
                currentLanguage={currentLanguage}
                iotData={iotData}
                onBack={() => {
                  setActiveTab("home");
                  setSubView("none");
                }}
              />
            )}
          </>
        )}

        {/* Casual Gardener Workspace */}
        {currentRole === "gardener" && (
          <>
            {subView === "disease_camera" || activeTab === "camera" ? (
              <DiseaseScannerView
                currentLanguage={currentLanguage}
                currentRole={currentRole}
                onBack={() => {
                  setActiveTab("home");
                  setSubView("none");
                }}
              />
            ) : subView === "gardener_weekly_weather" || subView === "weekly_weather" ? (
              <GardenerWeeklyWeatherView
                currentLanguage={currentLanguage}
                userProfile={userProfile}
                onBack={() => {
                  setActiveTab("home");
                  setSubView("none");
                }}
                onOpenVoiceAssistantWithPrompt={(prompt) =>
                  handleOpenVoiceAssistantWithPrompt(prompt, "weekly_weather")
                }
              />
            ) : activeTab === "water" ? (
              <GardenerWeatherView
                currentLanguage={currentLanguage}
                onBack={() => {
                  setActiveTab("home");
                  setSubView("none");
                }}
                onOpenVoiceAssistant={(prompt) =>
                  handleOpenVoiceAssistantWithPrompt(prompt, "watering_weather")
                }
                onOpenWeeklyWeather={() => {
                  setActiveTab("home");
                  setSubView("gardener_weekly_weather");
                }}
              />
            ) : (
              <GardenerDashboard
                userProfile={userProfile}
                currentLanguage={currentLanguage}
                onOpenPlantDoctor={() => {
                  setActiveTab("camera");
                  setSubView("disease_camera");
                }}
                onOpenWateringGuide={() => {
                  setActiveTab("water");
                }}
                onOpenWeeklyWeather={() => {
                  setActiveTab("home");
                  setSubView("gardener_weekly_weather");
                }}
                onOpenVoiceAssistantWithPrompt={handleOpenVoiceAssistantWithPrompt}
              />
            )}
          </>
        )}

        {/* Labour / Job Seeker Workspace */}
        {currentRole === "labour" && (
          <LabourDashboard
            userProfile={userProfile}
            currentLanguage={currentLanguage}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            onOpenVoiceAssistantWithPrompt={handleOpenVoiceAssistantWithPrompt}
          />
        )}

        {/* FPO / Cooperative Workspace */}
        {currentRole === "fpo" && (
          <>
            {subView === "iot_sensors" ? (
              <IoTDeviceView
                currentLanguage={currentLanguage}
                iotData={iotData}
                onTogglePump={handleTogglePump}
                onBack={() => {
                  setActiveTab("dashboard");
                  setSubView("none");
                }}
              />
            ) : subView === "market_prices" ? (
              <MarketPricesView
                currentLanguage={currentLanguage}
                marketPrices={marketPrices}
                onBack={() => {
                  setActiveTab("dashboard");
                  setSubView("none");
                }}
              />
            ) : (
              <FpoDashboard
                userProfile={userProfile}
                currentLanguage={currentLanguage}
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
                onOpenVoiceAssistantWithPrompt={handleOpenVoiceAssistantWithPrompt}
              />
            )}
          </>
        )}
      </main>

      {/* Universal Floating / Fixed Bottom Navigation */}
      <BottomNav
        currentRole={currentRole}
        currentLanguage={currentLanguage}
        activeTab={getEffectiveBottomNavTab()}
        onTabChange={handleTabChange}
        onOpenVoiceAssistant={() => {
          setAssistantPrompt(undefined);
          setAssistantSourceSection("default");
          setIsAssistantOpen(true);
        }}
      />

      {/* Unified AI Voice & Camera Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentRole={currentRole}
        currentLanguage={currentLanguage}
        initialQuery={assistantPrompt}
        sourceSection={assistantSourceSection}
        pendingActionTitle={priorityActions.find((a) => !a.isCompleted)?.title}
        userProfile={userProfile}
        iotData={iotData}
        riskFactors={riskFactors}
        priorityActions={priorityActions}
        marketPrices={marketPrices}
        onNavigateAction={handleAssistantNavigateAction}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        currentRole={currentRole}
        currentLanguage={currentLanguage}
        notifications={roleNotifications}
        onMarkAllRead={() => {
          setNotifications((prev) =>
            prev.map((n) => {
              const matchesRole =
                (n.targetRoles && n.targetRoles.includes(currentRole)) ||
                n.role === currentRole;
              return matchesRole ? { ...n, isRead: true } : n;
            })
          );
        }}
        onSelectNotification={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
          );
        }}
      />

      {/* Farmer Hire Labour Wizard Modal */}
      <HireLabourModal
        isOpen={isHireLabourOpen}
        onClose={() => setIsHireLabourOpen(false)}
        currentLanguage={currentLanguage}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
}
