export type UserRole = "farmer" | "gardener" | "labour" | "fpo";

export type LanguageCode = "en" | "hi" | "te" | "ta" | "mr" | "pa" | "bn" | "kn" | "gu";

export interface LanguageInfo {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  flagOrScript: string;
  greeting: string;
}

export interface FpoAdminProfile {
  organizationName: string;
  registrationNumber: string;
  serviceRegion: string;
  serviceRadiusKm: number;
  adminName: string;
  adminRole: string;
  memberCountRange: string;
  verificationStatus: "Verified" | "Under Review" | "Pending Document";
  certificateUrl?: string;
  inviteCode: string;
  totalAcresManaged: number;
  dominantCrops: string[];
}

export interface FpoFarmerMember {
  id: string;
  name: string;
  phone: string;
  village: string;
  landSizeAcres: number;
  primaryCrop: string;
  secondaryCrop?: string;
  farmRiskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  hasActiveAlert: boolean;
  alertDetails?: string;
  iotKitStatus: "Active Online" | "Battery Low" | "Offline" | "Not Installed";
  iotDeviceId?: string;
  lastMoisturePercent?: number;
  pmKisanStatus: "Enrolled & Active" | "Pending Verification" | "Not Enrolled";
  soilHealthCardStatus: "Updated (2025)" | "Due for Renewal" | "Not Issued";
  joinDate: string;
  isActive: boolean;
  avatarIcon?: string;
  recentActivity?: string;
}

export interface FpoClusterOutbreak {
  id: string;
  diseaseName: string;
  crop: string;
  affectedMembersCount: number;
  affectedVillages: string[];
  severity: "High" | "Medium" | "Warning";
  recommendedAction: string;
  dateDetected: string;
}

export interface FpoBroadcastAlert {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  channel: string;
  sentAt: string;
  recipientsCount: number;
  status: "Delivered" | "Broadcasting";
}

export interface FpoBulkLabourJob {
  id: string;
  title: string;
  crops: string[];
  villages: string[];
  totalWorkersNeeded: number;
  participatingFarmsCount: number;
  wagePerDay: number;
  dates: string;
  status: "Active Pool" | "Filled";
  description: string;
}

export interface FpoIotKitItem {
  id: string;
  deviceId: string;
  assignedFarmerName: string;
  village: string;
  crop: string;
  batteryPercent: number;
  signalStrength: "Strong" | "Good" | "Weak";
  lastSync: string;
  calibrationStatus: "Calibrated" | "Needs Re-calibration";
  status: "Online" | "Offline" | "Warning";
  moisture: number;
}

export interface GovSchemeItem {
  id: string;
  schemeName: string;
  code: string;
  enrolledCount: number;
  pendingCount: number;
  totalEligible: number;
  subsidyAmountPerAcre: string;
  deadline?: string;
  status: "Active" | "Upcoming" | "Closing Soon";
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  language: LanguageCode;
  locationName: string;
  landSizeAcre: string;
  primaryCrop: string;
  skills: string[];
  isAvailableForWork: boolean;
  dailyRateWage: number;
  hasIoTDevice: boolean;
  iotDeviceId?: string;
  farmRiskScore: number;
  isRegistered: boolean;
  avatarIcon?: string;
  photoUrl?: string;
  rating?: number;
  ratingCount?: number;
  badges?: string[];
  availabilityPeriod?: string;
  savedJobIds?: string[];
  appliedJobs?: { jobId: string; appliedDate: string; status: "Pending" | "Accepted" | "Completed" }[];
  fpoDetails?: FpoAdminProfile;
  gardeningLocationType?: string;
  experienceLevel?: string;
  selectedGrowingPlants?: string[];
}

export interface PriorityAction {
  id: string;
  title: string;
  category: "irrigation" | "spray" | "harvest" | "market" | "labour";
  urgency: "high" | "medium" | "low";
  iconName: string;
  dueTime: string;
  description: string;
  spokenAdvice: string;
  isCompleted: boolean;
  actionPayload?: string;
}

export interface FarmRiskFactor {
  id: string;
  title: string;
  category: "weather" | "disease" | "moisture" | "market";
  riskLevel: "low" | "medium" | "high";
  score: number;
  color: "green" | "yellow" | "red";
  description: string;
  iconName: string;
}

export interface DiseaseDiagnosis {
  id: string;
  timestamp: string;
  cropName: string;
  diseaseName: string;
  commonName: string;
  severity: "low" | "medium" | "high";
  colorStatus: "green" | "yellow" | "red";
  confidence: number;
  isHealthy: boolean;
  description: string;
  organicRemedy: string;
  chemicalTreatment: string;
  preventiveAction: string;
  spokenAdvice: string;
  imageUri?: string;
}

export interface IoTSensorData {
  deviceId: string;
  deviceName: string;
  isOnline: boolean;
  soilMoisturePercent: number;
  soilPh: number;
  ambientTempC: number;
  ambientHumidityPercent: number;
  pumpStatus: "ON" | "OFF";
  autoIrrigationEnabled: boolean;
  autoMoistureThreshold: number;
  lastWateredTime: string;
  batteryPercent: number;
  lastSyncTime: string;
  pairedStatus?: "connected" | "offline" | "not_paired" | "software_only";
  customNickname?: string;
  signalDbm?: number;
  lastCalibrationDate?: string;
  needsCalibration?: boolean;
  isManualEntry?: boolean;
  soilType?: string;
}

export interface MarketPriceItem {
  id: string;
  cropName: string;
  hindiName: string;
  currentPrice: number;
  previousPrice: number;
  changeAmount: number;
  changeDirection: "up" | "down" | "steady";
  unit: string;
  mandiName: string;
  distanceKm: number;
  bestSellingWindow: string;
  trendReason: string;
  history: { day: string; price: number }[];
}

export interface JobListing {
  id: string;
  title: string;
  farmOwnerName?: string;
  farmName?: string;
  farmerPhone?: string;
  farmerPhoto?: string;
  farmerRating?: number;
  locationName?: string;
  location?: string;
  distanceKm: number;
  workType?: string;
  jobType?: string;
  wagePerDay: number;
  durationDays: number | string;
  workersNeeded: number;
  workersApplied?: number;
  foodProvided: boolean;
  transportProvided?: boolean;
  accommodationProvided?: boolean;
  startDate?: string;
  datesNeeded?: string;
  urgent?: boolean;
  datePosted?: string;
  phoneContact?: string;
  status: "open" | "filled" | "OPEN" | "FILLED";
  hasApplied?: boolean;
  isSaved?: boolean;
  description?: string;
  lat?: number;
  lng?: number;
}

export type LabourJob = JobListing;

export interface PlantCareItem {
  id: string;
  name?: string;
  plantName?: string;
  nickname?: string;
  hindiName?: string;
  variety?: string;
  category?: "Vegetable" | "Herb" | "Flower" | "Fruit" | string;
  imageEmoji?: string;
  image?: string;
  waterIntervalDays?: number;
  lastWateredDaysAgo?: number;
  wateredToday?: boolean;
  needsWaterToday?: boolean;
  moisturePercent?: number;
  sunlightRequirement?: string;
  sunlightHours?: string;
  waterFrequency?: string;
  wateringFrequency?: string;
  soilPreference?: string;
  potSize?: string;
  potSizeRecommendation?: string;
  growthStage?: "seedling" | "growing" | "flowering_fruiting" | "harvest_mature" | string;
  commonProblems?: { problem: string; cause: string; fix: string; icon: string }[];
  healthStatus?: "healthy" | "needs-care" | "water-now" | "Thriving" | "Healthy" | "Needs Water" | "Needs Attention" | string;
  quickTip?: string;
  careTip?: string;
  remindersEnabled?: boolean;
}

export interface CropRecommendation {
  crop: string;
  suitabilityScore: number;
  colorStatus: "green" | "yellow" | "red";
  durationDays: string;
  expectedYield: string;
  profitPotential: string;
  waterNeed: "Low" | "Medium" | "High" | string;
  soilMatch: string;
  reason: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  imageUri?: string;
  spokenText?: string;
  isAudioPlaying?: boolean;
}

export interface AlertNotification {
  id: string;
  title: string;
  category: "weather" | "irrigation" | "pest" | "market" | "job" | "disease" | "sensor" | "general" | string;
  urgency?: "critical" | "warning" | "info" | "high" | "medium" | "low" | string;
  severity?: "critical" | "warning" | "info" | "high" | "medium" | "low" | string;
  timeAgo?: string;
  timestamp?: string;
  description?: string;
  message?: string;
  spokenSummary?: string;
  isRead: boolean;
  targetRoles?: UserRole[];
  role?: UserRole;
}

export type NotificationItem = AlertNotification;

export type WeatherConditionType =
  | "sunny"
  | "clear"
  | "partly_cloudy"
  | "cloudy"
  | "light_rain"
  | "heavy_rain"
  | "thunderstorm"
  | "frost"
  | "windy";

export type FarmAdvisoryType =
  | "spray_safe"
  | "spray_avoid"
  | "irrigate_now"
  | "delay_irrigation"
  | "sowing_good"
  | "harvest_safe"
  | "frost_warning"
  | "heat_stress";

export interface DailyWeatherForecast {
  id: string;
  dayIndex: number;
  dayName: string; // e.g. "Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"
  dayKey: "today" | "tomorrow" | "day2" | "day3" | "day4" | "day5" | "day6";
  dateFormatted: string; // "15 Aug", "16 Aug"
  condition: WeatherConditionType;
  conditionLabel: string;
  conditionLabelHindi?: string;
  tempHighC: number;
  tempLowC: number;
  feelsLikeC: number;
  rainProbabilityPercent: number;
  expectedRainMm: number;
  humidityPercent: number;
  windSpeedKmh: number;
  uvIndex?: number;
  advisoryTag: string; // e.g., "Good day to spray"
  advisoryType: FarmAdvisoryType;
  advisoryTagHindi?: string;
  isExtremeAlert?: boolean;
  extremeWarningText?: string;
  extremeWarningTextHindi?: string;
  detailedAdvisory: string;
  detailedAdvisoryHindi?: string;
  bestSprayWindow?: string;
  bestWateringWindow?: string;
}

export interface WeeklyWeatherForecast {
  locationName: string;
  coordinates?: { lat: number; lng: number };
  lastUpdated: string;
  currentTempC: number;
  currentFeelsLikeC: number;
  currentCondition: WeatherConditionType;
  currentConditionLabel: string;
  currentConditionLabelHindi: string;
  currentHumidityPercent: number;
  currentWindSpeedKmh: number;
  hasExtremeWarning: boolean;
  extremeWarningSeverity?: "critical" | "warning";
  extremeWarningTitle?: string;
  extremeWarningTitleHindi?: string;
  extremeWarningMessage?: string;
  extremeWarningMessageHindi?: string;
  days: DailyWeatherForecast[];
  weekSummaryText: string;
  weekSummaryTextHindi: string;
  farmPlanningSummary: {
    sprayDays: string[];
    irrigationDays: string[];
    harvestDays: string[];
  };
}

export type GardenerCareTagType =
  | "water_good"
  | "skip_water_rain"
  | "strong_wind_shelter"
  | "afternoon_shade"
  | "frost_protect"
  | "heavy_rain_drainage"
  | "compost_feed"
  | "mist_leaves"
  | "check_moisture";

export interface GardenerDailyForecast {
  id: string;
  dayIndex: number;
  dayName: string; // e.g. "Today", "Tomorrow", "Thu", "Fri"
  dateFormatted: string; // e.g. "15 Aug"
  condition: WeatherConditionType;
  conditionLabel: string;
  conditionLabelHindi: string;
  tempHighC: number;
  tempLowC: number;
  feelsLikeC: number;
  rainProbabilityPercent: number;
  expectedRainMm: number;
  humidityPercent: number;
  windSpeedKmh: number;
  uvIndex?: number;
  gardenerTag: string; // e.g., "Good day to water", "Skip watering — rain expected"
  gardenerTagHindi: string;
  careTagType: GardenerCareTagType;
  potPlantCareTip: string;
  potPlantCareTipHindi: string;
  wateringAdvice: "Water Morning" | "Skip Watering" | "Finger Test" | "Light Mist";
  wateringAdviceHindi: string;
  isPotRisk: boolean;
  potRiskType?: "heavy_rain" | "heatwave" | "frost" | "high_wind";
  potRiskWarning?: string;
  potRiskWarningHindi?: string;
}

export interface GardenerWeeklyWeatherForecast {
  locationName: string;
  lastUpdated: string;
  currentTempC: number;
  currentFeelsLikeC: number;
  currentCondition: WeatherConditionType;
  currentConditionLabel: string;
  currentConditionLabelHindi: string;
  currentHumidityPercent: number;
  currentWindSpeedKmh: number;
  hasPotHarmWarning: boolean;
  potHarmSeverity?: "critical" | "warning";
  potHarmTitle?: string;
  potHarmTitleHindi?: string;
  potHarmMessage?: string;
  potHarmMessageHindi?: string;
  potHarmIcon?: string;
  days: GardenerDailyForecast[];
  weekSummaryText: string;
  weekSummaryTextHindi: string;
  weeklyPlan: {
    wateringDays: string[];
    skipWaterDays: string[];
    fertilizeDays: string[];
  };
}

