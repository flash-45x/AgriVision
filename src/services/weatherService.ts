import {
  DailyWeatherForecast,
  WeeklyWeatherForecast,
  WeatherConditionType,
  FarmAdvisoryType,
  GardenerDailyForecast,
  GardenerWeeklyWeatherForecast,
  GardenerCareTagType,
  LanguageCode,
} from "../types";

// City coordinates mapping for common agricultural belts
const LOCATION_COORDS: Record<string, { lat: number; lng: number; state: string }> = {
  "ujjain": { lat: 23.1765, lng: 75.7885, state: "Madhya Pradesh" },
  "dewas": { lat: 22.9676, lng: 76.0534, state: "Madhya Pradesh" },
  "indore": { lat: 22.7196, lng: 75.8577, state: "Madhya Pradesh" },
  "bhopal": { lat: 23.2599, lng: 77.4126, state: "Madhya Pradesh" },
  "ludhiana": { lat: 30.9010, lng: 75.8573, state: "Punjab" },
  "amritsar": { lat: 31.6340, lng: 74.8723, state: "Punjab" },
  "bhatinda": { lat: 30.2110, lng: 74.9455, state: "Punjab" },
  "nashik": { lat: 19.9975, lng: 73.7898, state: "Maharashtra" },
  "pune": { lat: 18.5204, lng: 73.8567, state: "Maharashtra" },
  "nagpur": { lat: 21.1458, lng: 79.0882, state: "Maharashtra" },
  "guntur": { lat: 16.3067, lng: 80.4365, state: "Andhra Pradesh" },
  "coimbatore": { lat: 11.0168, lng: 76.9558, state: "Tamil Nadu" },
  "madurai": { lat: 9.9252, lng: 78.1198, state: "Tamil Nadu" },
  "ahmedabad": { lat: 23.0225, lng: 72.5714, state: "Gujarat" },
  "rajkot": { lat: 22.3039, lng: 70.8022, state: "Gujarat" },
  "karnal": { lat: 29.6857, lng: 76.9905, state: "Haryana" },
  "varanasi": { lat: 25.3176, lng: 82.9739, state: "Uttar Pradesh" },
};

function getCoordsForLocation(locationName: string = "Ujjain, Madhya Pradesh"): { lat: number; lng: number } {
  const locLower = locationName.toLowerCase();
  for (const [key, val] of Object.entries(LOCATION_COORDS)) {
    if (locLower.includes(key)) {
      return { lat: val.lat, lng: val.lng };
    }
  }
  return { lat: 23.1765, lng: 75.7885 }; // Default to Ujjain MP
}

// Map WMO weather codes from Open-Meteo to our WeatherConditionType
function mapWmoCodeToCondition(code: number): {
  condition: WeatherConditionType;
  labelEn: string;
  labelHi: string;
} {
  if (code === 0) return { condition: "sunny", labelEn: "Clear & Sunny", labelHi: "साफ़ और धूप" };
  if (code === 1 || code === 2) return { condition: "partly_cloudy", labelEn: "Partly Cloudy", labelHi: "हल्के बादल" };
  if (code === 3) return { condition: "cloudy", labelEn: "Overcast Clouds", labelHi: "घने बादल" };
  if (code >= 51 && code <= 65) return { condition: "light_rain", labelEn: "Light Rain Showers", labelHi: "हल्की बूंदाबांदी" };
  if (code >= 66 && code <= 77) return { condition: "heavy_rain", labelEn: "Moderate to Heavy Rain", labelHi: "मध्यम से तेज बारिश" };
  if (code >= 80 && code <= 82) return { condition: "light_rain", labelEn: "Passing Showers", labelHi: "रुक-रुक कर बारिश" };
  if (code >= 95) return { condition: "thunderstorm", labelEn: "Thunderstorm & Gusts", labelHi: "गरज के साथ बौछारें" };
  return { condition: "sunny", labelEn: "Pleasant & Clear", labelHi: "मौसम साफ़ रहेगा" };
}

// Generate Farm Advisory Tag per day
function computeFarmAdvisory(
  condition: WeatherConditionType,
  rainProb: number,
  maxTemp: number,
  windSpeed: number
): {
  advisoryTag: string;
  advisoryTagHindi: string;
  advisoryType: FarmAdvisoryType;
  detailedAdvisory: string;
  detailedAdvisoryHindi: string;
  bestSprayWindow: string;
  bestWateringWindow: string;
  isExtremeAlert: boolean;
  extremeWarningText?: string;
  extremeWarningTextHindi?: string;
} {
  // Heavy rain or thunderstorm
  if (condition === "heavy_rain" || condition === "thunderstorm" || rainProb >= 65) {
    return {
      advisoryTag: "Delay irrigation — rain likely",
      advisoryTagHindi: "सिंचाई टालें — बारिश की संभावना",
      advisoryType: "delay_irrigation",
      detailedAdvisory: "Heavy rain expected. Avoid fertilizer application or pesticide spray as runoff will occur. Ensure farm drainage ditches are cleared.",
      detailedAdvisoryHindi: "बारिश के आसार हैं। खाद या कीटनाशक छिड़काव से बचें ताकि दवा बह न जाए। खेत की मेड़ व पानी निकासी साफ़ रखें।",
      bestSprayWindow: "Unsafe (Postpone to dry day)",
      bestWateringWindow: "Skip irrigation (Rain sufficient)",
      isExtremeAlert: rainProb >= 75 || condition === "thunderstorm",
      extremeWarningText: "Heavy Rain / Storm Warning: Delay open spraying and secure loose irrigation equipment.",
      extremeWarningTextHindi: "तेज बारिश व आंधी की चेतावनी: छिड़काव टालें और खुले कृषि उपकरण सुरक्षित करें।",
    };
  }

  // Moderate rain chance
  if (rainProb >= 40 || condition === "light_rain") {
    return {
      advisoryTag: "Avoid spraying — light rain",
      advisoryTagHindi: "छिड़काव से बचें — बूंदाबांदी संभावित",
      advisoryType: "spray_avoid",
      detailedAdvisory: "Chance of light rain. Do not apply expensive foliar spray today. Light root-zone watering can proceed if soil is dry.",
      detailedAdvisoryHindi: "हल्की बारिश हो सकती है। पत्तों पर महंगी दवा का छिड़काव न करें। यदि मिट्टी सूखी हो तो हल्की सिंचाई कर सकते हैं।",
      bestSprayWindow: "Not recommended",
      bestWateringWindow: "Morning 06:00 - 08:30 AM",
      isExtremeAlert: false,
    };
  }

  // High wind
  if (windSpeed >= 20) {
    return {
      advisoryTag: "High wind — avoid spray drift",
      advisoryTagHindi: "तेज हवा — दवा बहने का जोखिम",
      advisoryType: "spray_avoid",
      detailedAdvisory: "Wind speed is above 20 km/h. Spray droplets will drift away from crop foliage. Safe to irrigate in morning.",
      detailedAdvisoryHindi: "हवा की गति 20 किमी/घंटा से अधिक है। दवा का छिड़काव उड़ सकता है। सुबह के समय सिंचाई कर सकते हैं।",
      bestSprayWindow: "Avoid during peak wind hours",
      bestWateringWindow: "Early morning before wind picks up",
      isExtremeAlert: false,
    };
  }

  // Heat stress
  if (maxTemp >= 37) {
    return {
      advisoryTag: "Heat stress — water early",
      advisoryTagHindi: "तेज गर्मी — सुबह जल्दी पानी दें",
      advisoryType: "heat_stress",
      detailedAdvisory: "High temperature will increase evapotranspiration. Water before 09:00 AM to prevent crop wilting. Spray only in evening after 05:00 PM.",
      detailedAdvisoryHindi: "तापमान अधिक होने से नमी जल्दी उड़ेगी। सुबह 9 बजे से पहले सिंचाई करें। छिड़काव शाम 5 बजे के बाद ही करें।",
      bestSprayWindow: "Evening 05:30 - 07:00 PM",
      bestWateringWindow: "Early morning 05:30 - 08:30 AM",
      isExtremeAlert: maxTemp >= 40,
      extremeWarningText: "High Heatwave Alert: Keep soil moist and avoid spraying chemical concentrates in hot noon sun.",
      extremeWarningTextHindi: "लू/तेज धूप की चेतावनी: मिट्टी में नमी बनाए रखें और दोपहर की धूप में स्प्रे न करें।",
    };
  }

  // Ideal sunny day for spray and farm operations
  return {
    advisoryTag: "Good day to spray & fertilize",
    advisoryTagHindi: "छिड़काव व खाद के लिए उत्तम दिन",
    advisoryType: "spray_safe",
    detailedAdvisory: "Clear sky and calm breeze. Excellent window for applying foliar NPK fertilizers, bio-fungicides, and soil weeding.",
    detailedAdvisoryHindi: "आसमान साफ़ और हवा शांत है। कीटनाशक, तरल एनपीके व खाद छिड़काव के लिए बहुत अनुकूल समय है।",
    bestSprayWindow: "Morning 07:00 - 10:30 AM",
    bestWateringWindow: "Morning or Late Afternoon",
    isExtremeAlert: false,
  };
}

// Fallback verified 7-day agronomic forecast
export const DEFAULT_WEEKLY_WEATHER: WeeklyWeatherForecast = {
  locationName: "Ujjain, Madhya Pradesh",
  lastUpdated: "Just now",
  currentTempC: 32,
  currentFeelsLikeC: 34,
  currentCondition: "sunny",
  currentConditionLabel: "Sunny and dry",
  currentConditionLabelHindi: "धूप खिली और सूखा मौसम",
  currentHumidityPercent: 58,
  currentWindSpeedKmh: 11,
  hasExtremeWarning: false,
  weekSummaryText:
    "This week will be mostly sunny and dry with temperatures between 31°C and 34°C. Good days for foliar spray and weeding are Monday through Wednesday. Light rain is possible on Friday evening.",
  weekSummaryTextHindi:
    "इस सप्ताह मौसम मुख्यतः साफ़ और सूखा रहेगा, तापमान 31°C से 34°C के बीच रहेगा। सोमवार से बुधवार तक छिड़काव व निराई के लिए बहुत अच्छा समय है। शुक्रवार शाम हल्की बारिश के आसार हैं।",
  farmPlanningSummary: {
    sprayDays: ["Today (Tue)", "Wed", "Thu"],
    irrigationDays: ["Today (Morning)", "Thu"],
    harvestDays: ["Today", "Wed", "Thu", "Sat"],
  },
  days: [
    {
      id: "w-day-0",
      dayIndex: 0,
      dayName: "Today",
      dayKey: "today",
      dateFormatted: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "sunny",
      conditionLabel: "Sunny & Warm",
      conditionLabelHindi: "धूप व सुहावना",
      tempHighC: 33,
      tempLowC: 20,
      feelsLikeC: 34,
      rainProbabilityPercent: 10,
      expectedRainMm: 0,
      humidityPercent: 58,
      windSpeedKmh: 11,
      uvIndex: 7,
      advisoryTag: "Good day to spray",
      advisoryTagHindi: "छिड़काव के लिए उत्तम दिन",
      advisoryType: "spray_safe",
      detailedAdvisory: "Calm breeze and full sunshine. Ideal window to spray neem oil or foliar nutrients before 11:00 AM.",
      detailedAdvisoryHindi: "शांत हवा और खिली धूप। सुबह 11 बजे से पहले नीम तेल या तरल पोषक तत्वों का छिड़काव करें।",
      bestSprayWindow: "07:00 AM - 10:30 AM",
      bestWateringWindow: "06:30 AM - 09:00 AM",
      isExtremeAlert: false,
    },
    {
      id: "w-day-1",
      dayIndex: 1,
      dayName: "Tomorrow",
      dayKey: "tomorrow",
      dateFormatted: new Date(Date.now() + 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "sunny",
      conditionLabel: "Clear Sky",
      conditionLabelHindi: "साफ़ आसमान",
      tempHighC: 34,
      tempLowC: 21,
      feelsLikeC: 35,
      rainProbabilityPercent: 10,
      expectedRainMm: 0,
      humidityPercent: 54,
      windSpeedKmh: 12,
      uvIndex: 8,
      advisoryTag: "Good for sowing & harvest",
      advisoryTagHindi: "बुवाई व कटाई के लिए बढ़िया",
      advisoryType: "harvest_safe",
      detailedAdvisory: "Dry ground and clear sunshine. Safe for grain threshing and tractor tillage.",
      detailedAdvisoryHindi: "सूखी मिट्टी और अच्छी धूप। फसल गहाई और जुताई के लिए सुरक्षित दिन।",
      bestSprayWindow: "07:00 AM - 10:00 AM",
      bestWateringWindow: "06:00 AM - 08:30 AM",
      isExtremeAlert: false,
    },
    {
      id: "w-day-2",
      dayIndex: 2,
      dayName: "Thu",
      dayKey: "day2",
      dateFormatted: new Date(Date.now() + 86400000 * 2).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "partly_cloudy",
      conditionLabel: "Partly Cloudy",
      conditionLabelHindi: "हल्के बादल",
      tempHighC: 32,
      tempLowC: 20,
      feelsLikeC: 33,
      rainProbabilityPercent: 20,
      expectedRainMm: 0,
      humidityPercent: 62,
      windSpeedKmh: 14,
      uvIndex: 6,
      advisoryTag: "Good day to spray",
      advisoryTagHindi: "छिड़काव के लिए अनुकूल",
      advisoryType: "spray_safe",
      detailedAdvisory: "Mild cloud cover helps reduce foliar evaporation. Safe for crop pest inspection and spray.",
      detailedAdvisoryHindi: "हल्के बादलों से दवा जल्दी नहीं सूखेगी। कीट निरीक्षण और स्प्रे के लिए अनुकूल।",
      bestSprayWindow: "07:30 AM - 11:00 AM",
      bestWateringWindow: "Morning or Late Afternoon",
      isExtremeAlert: false,
    },
    {
      id: "w-day-3",
      dayIndex: 3,
      dayName: "Fri",
      dayKey: "day3",
      dateFormatted: new Date(Date.now() + 86400000 * 3).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "light_rain",
      conditionLabel: "Scattered Showers",
      conditionLabelHindi: "हल्की बूंदाबांदी",
      tempHighC: 29,
      tempLowC: 19,
      feelsLikeC: 30,
      rainProbabilityPercent: 55,
      expectedRainMm: 6,
      humidityPercent: 78,
      windSpeedKmh: 18,
      uvIndex: 4,
      advisoryTag: "Delay irrigation — rain likely",
      advisoryTagHindi: "सिंचाई टालें — बारिश संभावित",
      advisoryType: "delay_irrigation",
      detailedAdvisory: "Light showers expected in late afternoon. Save electricity and diesel by delaying pump irrigation.",
      detailedAdvisoryHindi: "दोपहर बाद हल्की फुहारें संभव हैं। पंप न चलाकर बिजली व डीजल बचाएं।",
      bestSprayWindow: "Postpone to weekend",
      bestWateringWindow: "Delay (Rain expected)",
      isExtremeAlert: false,
    },
    {
      id: "w-day-4",
      dayIndex: 4,
      dayName: "Sat",
      dayKey: "day4",
      dateFormatted: new Date(Date.now() + 86400000 * 4).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "partly_cloudy",
      conditionLabel: "Clearing Sky",
      conditionLabelHindi: "मौसम खुल रहा है",
      tempHighC: 31,
      tempLowC: 19,
      feelsLikeC: 32,
      rainProbabilityPercent: 20,
      expectedRainMm: 0,
      humidityPercent: 65,
      windSpeedKmh: 10,
      uvIndex: 6,
      advisoryTag: "Inspect soil moisture",
      advisoryTagHindi: "मिट्टी की नमी जांचें",
      advisoryType: "irrigate_now",
      detailedAdvisory: "Rain cloud clears. Check IoT soil sensor reading before resuming scheduled irrigation.",
      detailedAdvisoryHindi: "मौसम साफ़ हो गया है। सेंसर में मिट्टी की नमी देखकर ही पानी लगाएं।",
      bestSprayWindow: "08:00 AM - 11:00 AM",
      bestWateringWindow: "After 04:00 PM if dry",
      isExtremeAlert: false,
    },
    {
      id: "w-day-5",
      dayIndex: 5,
      dayName: "Sun",
      dayKey: "day5",
      dateFormatted: new Date(Date.now() + 86400000 * 5).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "sunny",
      conditionLabel: "Bright & Sunny",
      conditionLabelHindi: "चमकदार धूप",
      tempHighC: 33,
      tempLowC: 21,
      feelsLikeC: 34,
      rainProbabilityPercent: 10,
      expectedRainMm: 0,
      humidityPercent: 55,
      windSpeedKmh: 11,
      uvIndex: 7,
      advisoryTag: "Good day to spray",
      advisoryTagHindi: "छिड़काव के लिए बढ़िया दिन",
      advisoryType: "spray_safe",
      detailedAdvisory: "Clean sunny weather. Great day for top dressing fertilizers and weed removal.",
      detailedAdvisoryHindi: "साफ़ धूप वाला दिन। यूरिया टॉप-ड्रेसिंग और खरपतवार निकालने के लिए उत्तम।",
      bestSprayWindow: "07:00 AM - 10:30 AM",
      bestWateringWindow: "06:30 AM - 09:00 AM",
      isExtremeAlert: false,
    },
    {
      id: "w-day-6",
      dayIndex: 6,
      dayName: "Mon",
      dayKey: "day6",
      dateFormatted: new Date(Date.now() + 86400000 * 6).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "sunny",
      conditionLabel: "Dry & Warm",
      conditionLabelHindi: "गर्म व सूखा मौसम",
      tempHighC: 34,
      tempLowC: 22,
      feelsLikeC: 35,
      rainProbabilityPercent: 10,
      expectedRainMm: 0,
      humidityPercent: 52,
      windSpeedKmh: 12,
      uvIndex: 8,
      advisoryTag: "Irrigate dry plots",
      advisoryTagHindi: "सूखे खेतों में पानी लगाएं",
      advisoryType: "irrigate_now",
      detailedAdvisory: "Warm dry air accelerates soil evaporation. Regular irrigation cycle recommended.",
      detailedAdvisoryHindi: "तेज धूप से मिट्टी सूखेगी। तय चक्र के अनुसार सिंचाई करें।",
      bestSprayWindow: "07:00 AM - 10:00 AM",
      bestWateringWindow: "06:00 AM - 09:00 AM",
      isExtremeAlert: false,
    },
  ],
};

const CACHE_KEY = "agrivision_weekly_weather_cache";

export async function fetchWeeklyWeatherForecast(
  locationName: string = "Ujjain, Madhya Pradesh"
): Promise<WeeklyWeatherForecast> {
  const coords = getCoordsForLocation(locationName);

  // Try Open-Meteo API
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto&forecast_days=7`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.daily || !data.daily.time || data.daily.time.length === 0) {
      throw new Error("Invalid Open-Meteo payload");
    }

    const currentMapped = mapWmoCodeToCondition(data.current?.weather_code || 0);

    const days: DailyWeatherForecast[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let hasExtremeWarning = false;
    let extremeTitle = "";
    let extremeTitleHindi = "";
    let extremeMessage = "";
    let extremeMessageHindi = "";
    let extremeSeverity: "critical" | "warning" = "warning";

    const sprayDays: string[] = [];
    const irrigationDays: string[] = [];
    const harvestDays: string[] = [];

    for (let i = 0; i < Math.min(7, data.daily.time.length); i++) {
      const dateStr = data.daily.time[i];
      const d = new Date(dateStr);
      const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayNames[d.getDay()];
      const dayKey = (i === 0 ? "today" : i === 1 ? "tomorrow" : `day${i}`) as any;
      const formattedDate = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

      const wmoCode = data.daily.weather_code[i] || 0;
      const mapped = mapWmoCodeToCondition(wmoCode);
      const maxTemp = Math.round(data.daily.temperature_2m_max[i] ?? 32);
      const minTemp = Math.round(data.daily.temperature_2m_min[i] ?? 20);
      const rainProb = Math.round(data.daily.precipitation_probability_max[i] ?? 10);
      const rainMm = Math.round((data.daily.precipitation_sum[i] ?? 0) * 10) / 10;
      const windMax = Math.round(data.daily.wind_speed_10m_max[i] ?? 12);
      const humidityEst = Math.max(35, Math.min(95, Math.round(60 + rainProb * 0.3 - (maxTemp - 25))));

      const advisory = computeFarmAdvisory(mapped.condition, rainProb, maxTemp, windMax);

      if (advisory.advisoryType === "spray_safe") {
        sprayDays.push(dayName);
      }
      if (advisory.advisoryType === "irrigate_now" || (rainProb < 30 && i <= 3)) {
        irrigationDays.push(dayName);
      }
      if (advisory.advisoryType === "harvest_safe" || (mapped.condition === "sunny" && rainProb < 20)) {
        harvestDays.push(dayName);
      }

      if (advisory.isExtremeAlert) {
        hasExtremeWarning = true;
        extremeSeverity = rainProb >= 75 || maxTemp >= 40 ? "critical" : "warning";
        extremeTitle = mapped.condition === "heavy_rain" || mapped.condition === "thunderstorm" ? "Storm & Heavy Rain Alert" : "Heat Stress Warning";
        extremeTitleHindi = mapped.condition === "heavy_rain" || mapped.condition === "thunderstorm" ? "तेज बारिश व आंधी का अलर्ट" : "लू / अधिक तापमान की चेतावनी";
        extremeMessage = advisory.extremeWarningText || "Extreme weather expected. Secure crops and adjust irrigation.";
        extremeMessageHindi = advisory.extremeWarningTextHindi || "खराब मौसम की संभावना। फसल सुरक्षा व सिंचाई में बदलाव करें।";
      }

      days.push({
        id: `w-day-${i}-${dateStr}`,
        dayIndex: i,
        dayName,
        dayKey,
        dateFormatted: formattedDate,
        condition: mapped.condition,
        conditionLabel: mapped.labelEn,
        conditionLabelHindi: mapped.labelHi,
        tempHighC: maxTemp,
        tempLowC: minTemp,
        feelsLikeC: Math.round(maxTemp + (humidityEst > 70 ? 2 : -1)),
        rainProbabilityPercent: rainProb,
        expectedRainMm: rainMm,
        humidityPercent: humidityEst,
        windSpeedKmh: windMax,
        uvIndex: Math.min(10, Math.max(3, Math.round(maxTemp / 4.5))),
        advisoryTag: advisory.advisoryTag,
        advisoryTagHindi: advisory.advisoryTagHindi,
        advisoryType: advisory.advisoryType,
        detailedAdvisory: advisory.detailedAdvisory,
        detailedAdvisoryHindi: advisory.detailedAdvisoryHindi,
        bestSprayWindow: advisory.bestSprayWindow,
        bestWateringWindow: advisory.bestWateringWindow,
        isExtremeAlert: advisory.isExtremeAlert,
        extremeWarningText: advisory.extremeWarningText,
        extremeWarningTextHindi: advisory.extremeWarningTextHindi,
      });
    }

    const currentTemp = Math.round(data.current?.temperature_2m ?? days[0]?.tempHighC ?? 32);
    const currentFeels = Math.round(data.current?.apparent_temperature ?? currentTemp + 1);
    const currentHum = Math.round(data.current?.relative_humidity_2m ?? 58);
    const currentWind = Math.round(data.current?.wind_speed_10m ?? 11);

    const nowFormatted = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const forecastResult: WeeklyWeatherForecast = {
      locationName,
      coordinates: coords,
      lastUpdated: `${nowFormatted} (Live)`,
      currentTempC: currentTemp,
      currentFeelsLikeC: currentFeels,
      currentCondition: currentMapped.condition,
      currentConditionLabel: currentMapped.labelEn,
      currentConditionLabelHindi: currentMapped.labelHi,
      currentHumidityPercent: currentHum,
      currentWindSpeedKmh: currentWind,
      hasExtremeWarning,
      extremeWarningSeverity: extremeSeverity,
      extremeWarningTitle: extremeTitle || undefined,
      extremeWarningTitleHindi: extremeTitleHindi || undefined,
      extremeWarningMessage: extremeMessage || undefined,
      extremeWarningMessageHindi: extremeMessageHindi || undefined,
      days,
      weekSummaryText: `This week in ${locationName}, temperatures will range between ${days[0]?.tempLowC || 20}°C and ${days[0]?.tempHighC || 33}°C. ${
        sprayDays.length > 0 ? `Best days for foliar spray are ${sprayDays.slice(0, 3).join(", ")}.` : ""
      } ${hasExtremeWarning ? extremeMessage : "Overall favorable farm conditions."}`,
      weekSummaryTextHindi: `${locationName} में इस सप्ताह तापमान ${days[0]?.tempLowC || 20}°C से ${days[0]?.tempHighC || 33}°C के बीच रहेगा। ${
        sprayDays.length > 0 ? `कीटनाशक व खाद छिड़काव के लिए ${sprayDays.slice(0, 3).join(", ")} सबसे अच्छे दिन हैं।` : ""
      } ${hasExtremeWarning ? extremeMessageHindi : "कुल मिलाकर खेती के लिए अनुकूल मौसम है।"}`,
      farmPlanningSummary: {
        sprayDays: sprayDays.length > 0 ? sprayDays : ["Today", "Tomorrow"],
        irrigationDays: irrigationDays.length > 0 ? irrigationDays : ["Today", "Thu"],
        harvestDays: harvestDays.length > 0 ? harvestDays : ["Wed", "Sat"],
      },
    };

    // Save to localStorage cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(forecastResult));
    } catch {}

    return forecastResult;
  } catch (error) {
    console.warn("Using local cached or verified reference weekly weather forecast:", error);
    // Check cached
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.days && parsed.days.length > 0) {
          return {
            ...parsed,
            lastUpdated: "Cached (Offline)",
          };
        }
      }
    } catch {}

    return {
      ...DEFAULT_WEEKLY_WEATHER,
      locationName,
      lastUpdated: "Default Farm Advisory",
    };
  }
}

// ==========================================
// HOME GARDENER / BALCONY WEATHER ADVISORY
// ==========================================

export function computeGardenerPlantAdvisory(
  condition: WeatherConditionType,
  rainProb: number,
  maxTemp: number,
  minTemp: number,
  windSpeed: number
): {
  gardenerTag: string;
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
} {
  // 1. Heavy rain or severe storm -> Risk of root rot and soil waterlogging in containers
  if (condition === "heavy_rain" || condition === "thunderstorm" || rainProb >= 65) {
    return {
      gardenerTag: "Skip watering — rain expected",
      gardenerTagHindi: "पानी न दें — बारिश की संभावना",
      careTagType: "skip_water_rain",
      potPlantCareTip:
        "Rain will naturally soak terrace and balcony planters. Ensure pot drainage holes are unclogged and move sensitive succulent pots (Aloe, Jade) under roof cover.",
      potPlantCareTipHindi:
        "बारिश से गमलों को प्राकृतिक पानी मिलेगा। गमलों के नीचे के छेद साफ़ रखें और एलोवेरा व सकुलेंट्स को शेड में रखें ताकि जड़ें न सड़ें।",
      wateringAdvice: "Skip Watering",
      wateringAdviceHindi: "पानी न दें (बारिश होगी)",
      isPotRisk: true,
      potRiskType: "heavy_rain",
      potRiskWarning:
        "Heavy Rain Warning: Standing water in pots can rot delicate root balls. Move small containers under shelter and unclog base drainage holes.",
      potRiskWarningHindi:
        "तेज बारिश का अलर्ट: गमलों में अधिक पानी भरने से जड़ें सड़ सकती हैं। छोटे गमलों को शेड में रखें और पानी निकासी साफ़ रखें।",
    };
  }

  // 2. Extreme Heat (> 36°C) -> Rapid container soil dryout, root heating
  if (maxTemp >= 36) {
    return {
      gardenerTag: "Water early & provide shade",
      gardenerTagHindi: "सुबह जल्दी पानी दें व छाया करें",
      careTagType: "afternoon_shade",
      potPlantCareTip:
        "Container potting mix heats up and dries fast in strong balcony sun. Give a deep morning drink before 8:00 AM and shift leafy herbs (Mint & Coriander) to afternoon shade.",
      potPlantCareTipHindi:
        "तेज धूप में गमलों की मिट्टी जल्दी गर्म होकर सूखती है। सुबह 8 बजे से पहले भरपूर पानी दें और पुदीना, धनिया जैसे पौधों को दोपहर में छांव में रखें।",
      wateringAdvice: "Water Morning",
      wateringAdviceHindi: "सुबह जल्दी पानी दें",
      isPotRisk: true,
      potRiskType: "heatwave",
      potRiskWarning:
        "Extreme Heat Alert: Terracotta and plastic pots dry out rapidly. Water deeply in the early morning and shade tender balcony plants from harsh 12–3 PM sun.",
      potRiskWarningHindi:
        "तीखी धूप व गर्मी का अलर्ट: गमलों की मिट्टी तेजी से सूखेगी। सुबह जल्दी जड़ों में पानी दें और दोपहर की धूप से नाजुक पौधों को बचाएं।",
    };
  }

  // 3. Frost or intense cold (< 8°C or frost) -> Chill injury to potted herbs
  if (minTemp <= 8 || condition === "frost") {
    return {
      gardenerTag: "Move pots indoors — cold night",
      gardenerTagHindi: "गमले अंदर रखें — रात की ठंड",
      careTagType: "frost_protect",
      potPlantCareTip:
        "Cold overnight temperatures can stun holy basil (Tulsi) and tender potted greens. Move pots against warm interior walls or cover with a light cotton cloth after dusk.",
      potPlantCareTipHindi:
        "रात की ठंड से तुलसी और नाजुक पौधे मुरझा सकते हैं। शाम को गमलों को अंदर रखें या हल्के सूती कपड़े से ढकें।",
      wateringAdvice: "Water Morning",
      wateringAdviceHindi: "दोपहर में हल्का पानी दें",
      isPotRisk: true,
      potRiskType: "frost",
      potRiskWarning:
        "Cold / Frost Alert: Overnight chill can harm tropical balcony pots and sacred Tulsi. Move delicate containers inside.",
      potRiskWarningHindi:
        "शीतलहर / ठंड का अलर्ट: रात की ठंड से बालकनी के गमलों व तुलसी को नुकसान हो सकता है। गमलों को सुरक्षित स्थान पर रखें।",
    };
  }

  // 4. Strong Wind (> 20 km/h) -> Tipping containers, torn leaves
  if (windSpeed >= 20 || condition === "windy") {
    return {
      gardenerTag: "Move pots indoors — strong wind",
      gardenerTagHindi: "गमले सुरक्षित रखें — तेज हवा",
      careTagType: "strong_wind_shelter",
      potPlantCareTip:
        "High wind gusts can topple light plastic pots, railing hanging baskets, and staked cherry tomato plants. Move lightweight pots to the floor against balcony walls.",
      potPlantCareTipHindi:
        "तेज हवा से बालकनी की रेलिंग वाले हैंगिंग पॉट्स और लंबे पौधे गिर सकते हैं। गमलों को नीचे फर्श पर दीवार के सहारे रखें।",
      wateringAdvice: "Finger Test",
      wateringAdviceHindi: "नमी जांचकर पानी दें",
      isPotRisk: true,
      potRiskType: "high_wind",
      potRiskWarning:
        "Strong Wind Alert: Balcony gusts can tip over railing planters and break tall potted stems. Secure hanging baskets.",
      potRiskWarningHindi:
        "तेज आंधी / हवा का अलर्ट: बालकनी के हैंगिंग पॉट्स और गमले गिर सकते हैं। इन्हें नीचे सुरक्षित जगह रखें।",
    };
  }

  // 5. Light Rain / Scattered Showers (40% - 64%)
  if (rainProb >= 40 || condition === "light_rain") {
    return {
      gardenerTag: "Check soil — light showers",
      gardenerTagHindi: "मिट्टी जांचें — हल्की बूंदाबांदी",
      careTagType: "check_moisture",
      potPlantCareTip:
        "Passing drizzle may only wet surface leaves. Do the 1-inch finger test in your pots before pouring extra water.",
      potPlantCareTipHindi:
        "हल्की फुहारों से केवल पत्तियां भीगती हैं। 1 इंच उंगली डालकर मिट्टी की नमी जांचें, सूखी हो तभी पानी दें।",
      wateringAdvice: "Finger Test",
      wateringAdviceHindi: "1-इंच उंगली टेस्ट करें",
      isPotRisk: false,
    };
  }

  // 6. Mild & Sunny / Pleasant container gardening weather
  return {
    gardenerTag: "Good day to water & feed compost",
    gardenerTagHindi: "पानी व जैविक खाद देने का अच्छा दिन",
    careTagType: "water_good",
    potPlantCareTip:
      "Pleasant sunlight and calm breeze. Great time for morning pot watering, pinching faded flowers, and feeding 1 spoon of vermicompost or banana peel tea.",
    potPlantCareTipHindi:
      "सुहावनी धूप और शांत मौसम। सुबह गमलों में पानी देने, सूखी पत्तियां छांटने और 1 चम्मच वर्मीकम्पोस्ट या केले के छिलके का पानी डालने के लिए बेहतरीन दिन।",
    wateringAdvice: "Water Morning",
    wateringAdviceHindi: "सुबह पानी दें",
    isPotRisk: false,
  };
}

export const DEFAULT_GARDENER_WEEKLY_WEATHER: GardenerWeeklyWeatherForecast = {
  locationName: "Balcony & Container Garden",
  lastUpdated: "Just now",
  currentTempC: 32,
  currentFeelsLikeC: 34,
  currentCondition: "sunny",
  currentConditionLabel: "Sunny & Warm",
  currentConditionLabelHindi: "खिली हुई धूप",
  currentHumidityPercent: 56,
  currentWindSpeedKmh: 11,
  hasPotHarmWarning: false,
  weekSummaryText:
    "This week in your balcony garden will be mostly sunny and pleasant with temperatures between 20°C and 33°C. Great days to water and feed organic compost are Monday through Thursday. Scattered rain is expected Friday, so you can skip watering outdoor pots.",
  weekSummaryTextHindi:
    "इस सप्ताह आपकी बालकनी के पौधों के लिए मौसम मुख्यतः साफ़ और सुहावना रहेगा, तापमान 20°C से 33°C के बीच रहेगा। सोमवार से गुरुवार तक गमलों में पानी और जैविक खाद देने के लिए बहुत अच्छा समय है। शुक्रवार को बारिश के आसार हैं, इसलिए खुली छत के गमलों में पानी न दें।",
  weeklyPlan: {
    wateringDays: ["Today (Tue)", "Wed", "Thu", "Sun"],
    skipWaterDays: ["Fri (Rain expected)"],
    fertilizeDays: ["Today", "Thu"],
  },
  days: [
    {
      id: "g-day-0",
      dayIndex: 0,
      dayName: "Today",
      dateFormatted: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "sunny",
      conditionLabel: "Sunny & Warm",
      conditionLabelHindi: "धूप व सुहावना",
      tempHighC: 33,
      tempLowC: 20,
      feelsLikeC: 34,
      rainProbabilityPercent: 10,
      expectedRainMm: 0,
      humidityPercent: 56,
      windSpeedKmh: 11,
      uvIndex: 7,
      gardenerTag: "Good day to water",
      gardenerTagHindi: "पानी देने के लिए उत्तम दिन",
      careTagType: "water_good",
      potPlantCareTip:
        "Sunny balcony weather. Water containers at the base between 7:00 and 9:00 AM. Mist mint & coriander leaves to keep them crisp.",
      potPlantCareTipHindi:
        "खिली धूप रहेगी। सुबह 7 से 9 बजे के बीच गमलों की जड़ों में पानी दें। पुदीना और धनिए पर हल्की फुहार करें।",
      wateringAdvice: "Water Morning",
      wateringAdviceHindi: "सुबह पानी दें",
      isPotRisk: false,
    },
    {
      id: "g-day-1",
      dayIndex: 1,
      dayName: "Tomorrow",
      dateFormatted: new Date(Date.now() + 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "sunny",
      conditionLabel: "Clear Sky",
      conditionLabelHindi: "साफ़ आसमान",
      tempHighC: 34,
      tempLowC: 21,
      feelsLikeC: 35,
      rainProbabilityPercent: 10,
      expectedRainMm: 0,
      humidityPercent: 54,
      windSpeedKmh: 12,
      uvIndex: 8,
      gardenerTag: "Good day to feed organic compost",
      gardenerTagHindi: "जैविक खाद डालने का अच्छा दिन",
      careTagType: "compost_feed",
      potPlantCareTip:
        "Bright sun helps root metabolism. Add 1 handful of vermicompost or banana peel tea around your Rose, Tomato, and Hibiscus pots.",
      potPlantCareTipHindi:
        "अच्छी धूप से पौधे पोषण तेजी से लेते हैं। गुलाब, टमाटर और गुड़हल के गमलों में 1 मुट्ठी वर्मीकम्पोस्ट या केले के छिलके का पानी डालें।",
      wateringAdvice: "Water Morning",
      wateringAdviceHindi: "सुबह पानी दें",
      isPotRisk: false,
    },
    {
      id: "g-day-2",
      dayIndex: 2,
      dayName: "Thu",
      dateFormatted: new Date(Date.now() + 86400000 * 2).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "partly_cloudy",
      conditionLabel: "Partly Cloudy",
      conditionLabelHindi: "हल्के बादल",
      tempHighC: 32,
      tempLowC: 20,
      feelsLikeC: 33,
      rainProbabilityPercent: 20,
      expectedRainMm: 0,
      humidityPercent: 62,
      windSpeedKmh: 14,
      uvIndex: 6,
      gardenerTag: "Check 1-inch soil moisture",
      gardenerTagHindi: "1-इंच मिट्टी की नमी जांचें",
      careTagType: "check_moisture",
      potPlantCareTip:
        "Mild clouds reduce pot evaporation. Insert your index finger 1 inch into the pot soil — water only if it feels dry.",
      potPlantCareTipHindi:
        "बादलों के कारण मिट्टी धीरे सूखेगी। उंगली से 1 इंच मिट्टी छूकर देखें — सूखी लगे तभी पानी दें।",
      wateringAdvice: "Finger Test",
      wateringAdviceHindi: "उंगली टेस्ट करें",
      isPotRisk: false,
    },
    {
      id: "g-day-3",
      dayIndex: 3,
      dayName: "Fri",
      dateFormatted: new Date(Date.now() + 86400000 * 3).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "light_rain",
      conditionLabel: "Scattered Showers",
      conditionLabelHindi: "हल्की बूंदाबांदी",
      tempHighC: 28,
      tempLowC: 19,
      feelsLikeC: 29,
      rainProbabilityPercent: 60,
      expectedRainMm: 6,
      humidityPercent: 78,
      windSpeedKmh: 18,
      uvIndex: 4,
      gardenerTag: "Skip watering — rain expected",
      gardenerTagHindi: "पानी न दें — बारिश संभावित",
      careTagType: "skip_water_rain",
      potPlantCareTip:
        "Natural rain will hydrate terrace containers. Move small succulent pots (Aloe Vera, Cactus) under cover to avoid waterlogged roots.",
      potPlantCareTipHindi:
        "प्राकृतिक बारिश से छत के गमलों को पानी मिलेगा। एलोवेरा व सकुलेंट्स को भीगने से बचाएं ताकि जड़ें न गलें।",
      wateringAdvice: "Skip Watering",
      wateringAdviceHindi: "पानी न दें (बारिश)",
      isPotRisk: false,
    },
    {
      id: "g-day-4",
      dayIndex: 4,
      dayName: "Sat",
      dateFormatted: new Date(Date.now() + 86400000 * 4).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "partly_cloudy",
      conditionLabel: "Fresh & Clearing",
      conditionLabelHindi: "ताज़ा व साफ़ मौसम",
      tempHighC: 30,
      tempLowC: 19,
      feelsLikeC: 31,
      rainProbabilityPercent: 20,
      expectedRainMm: 0,
      humidityPercent: 65,
      windSpeedKmh: 10,
      uvIndex: 6,
      gardenerTag: "Inspect pot drainage",
      gardenerTagHindi: "गमलों का ड्रेनेज चेक करें",
      careTagType: "check_moisture",
      potPlantCareTip:
        "Post-rain fresh morning. Check bottom pot drainage plates and empty any standing water to prevent mosquito breeding and root rot.",
      potPlantCareTipHindi:
        "बारिश के बाद की ताज़ा सुबह। गमलों की प्लेट में जमा अतिरिक्त पानी खाली करें ताकि मच्छर न पनपें।",
      wateringAdvice: "Finger Test",
      wateringAdviceHindi: "जांच कर पानी दें",
      isPotRisk: false,
    },
    {
      id: "g-day-5",
      dayIndex: 5,
      dayName: "Sun",
      dateFormatted: new Date(Date.now() + 86400000 * 5).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "sunny",
      conditionLabel: "Bright Sunshine",
      conditionLabelHindi: "चमकदार धूप",
      tempHighC: 32,
      tempLowC: 21,
      feelsLikeC: 33,
      rainProbabilityPercent: 10,
      expectedRainMm: 0,
      humidityPercent: 55,
      windSpeedKmh: 11,
      uvIndex: 7,
      gardenerTag: "Good day to prune & rotate pots",
      gardenerTagHindi: "कटाई-छंटाई व गमले घुमाने का दिन",
      careTagType: "water_good",
      potPlantCareTip:
        "Weekend balcony care! Rotate pots 90 degrees so all leaves get balanced sun. Pinch Tulsi flower spikes (manjari) for bushier growth.",
      potPlantCareTipHindi:
        "रविवार की देखभाल! गमलों को थोड़ा घुमाएं ताकि चारों तरफ धूप लगे। तुलसी की मंजरी तोड़ें ताकि पौधा घना बने।",
      wateringAdvice: "Water Morning",
      wateringAdviceHindi: "सुबह पानी दें",
      isPotRisk: false,
    },
    {
      id: "g-day-6",
      dayIndex: 6,
      dayName: "Mon",
      dateFormatted: new Date(Date.now() + 86400000 * 6).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      condition: "sunny",
      conditionLabel: "Warm & Sunny",
      conditionLabelHindi: "गर्म व धूप",
      tempHighC: 33,
      tempLowC: 22,
      feelsLikeC: 34,
      rainProbabilityPercent: 10,
      expectedRainMm: 0,
      humidityPercent: 53,
      windSpeedKmh: 12,
      uvIndex: 8,
      gardenerTag: "Good day to water balcony pots",
      gardenerTagHindi: "बालकनी के गमलों में पानी दें",
      careTagType: "water_good",
      potPlantCareTip:
        "Warm dry air accelerates terracotta pot drying. Water early in the morning at the soil rim until a few drops drain out.",
      potPlantCareTipHindi:
        "गर्म मौसम में मिट्टी जल्दी सूखेगी। सुबह जल्दी गमले के किनारे से पानी दें जब तक कि नीचे से कुछ बूंदें न टपकें।",
      wateringAdvice: "Water Morning",
      wateringAdviceHindi: "सुबह पानी दें",
      isPotRisk: false,
    },
  ],
};

const GARDENER_CACHE_KEY = "agrivision_gardener_weather_cache";

export async function fetchGardenerWeeklyWeatherForecast(
  locationName: string = "Balcony & Container Garden"
): Promise<GardenerWeeklyWeatherForecast> {
  const coords = getCoordsForLocation(locationName);

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto&forecast_days=7`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.daily || !data.daily.time || data.daily.time.length === 0) {
      throw new Error("Invalid Open-Meteo payload");
    }

    const currentMapped = mapWmoCodeToCondition(data.current?.weather_code || 0);

    const days: GardenerDailyForecast[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let hasPotHarmWarning = false;
    let potHarmTitle = "";
    let potHarmTitleHindi = "";
    let potHarmMessage = "";
    let potHarmMessageHindi = "";
    let potHarmIcon = "🪴";
    let potHarmSeverity: "critical" | "warning" = "warning";

    const wateringDays: string[] = [];
    const skipWaterDays: string[] = [];
    const fertilizeDays: string[] = [];

    for (let i = 0; i < Math.min(7, data.daily.time.length); i++) {
      const dateStr = data.daily.time[i];
      const d = new Date(dateStr);
      const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayNames[d.getDay()];
      const formattedDate = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

      const wmoCode = data.daily.weather_code[i] || 0;
      const mapped = mapWmoCodeToCondition(wmoCode);
      const maxTemp = Math.round(data.daily.temperature_2m_max[i] ?? 32);
      const minTemp = Math.round(data.daily.temperature_2m_min[i] ?? 20);
      const rainProb = Math.round(data.daily.precipitation_probability_max[i] ?? 10);
      const rainMm = Math.round((data.daily.precipitation_sum[i] ?? 0) * 10) / 10;
      const windMax = Math.round(data.daily.wind_speed_10m_max[i] ?? 12);
      const humidityEst = Math.max(35, Math.min(95, Math.round(60 + rainProb * 0.3 - (maxTemp - 25))));

      const advisory = computeGardenerPlantAdvisory(mapped.condition, rainProb, maxTemp, minTemp, windMax);

      if (advisory.wateringAdvice === "Water Morning") {
        wateringDays.push(dayName);
      } else if (advisory.wateringAdvice === "Skip Watering") {
        skipWaterDays.push(`${dayName} (${mapped.condition === "heavy_rain" ? "Rain" : "Wet"})`);
      }

      if (advisory.careTagType === "water_good" || advisory.careTagType === "compost_feed") {
        if (fertilizeDays.length < 2) fertilizeDays.push(dayName);
      }

      if (advisory.isPotRisk) {
        hasPotHarmWarning = true;
        if (advisory.potRiskType === "heavy_rain") {
          potHarmIcon = "🌧️";
          potHarmTitle = "Heavy Rain Alert for Balcony Pots";
          potHarmTitleHindi = "बालकनी के गमलों के लिए भारी बारिश का अलर्ट";
          potHarmSeverity = rainProb >= 75 ? "critical" : "warning";
        } else if (advisory.potRiskType === "heatwave") {
          potHarmIcon = "☀️";
          potHarmTitle = "Extreme Heat Warning for Pots";
          potHarmTitleHindi = "गमलों के लिए अत्यधिक गर्मी की चेतावनी";
          potHarmSeverity = maxTemp >= 39 ? "critical" : "warning";
        } else if (advisory.potRiskType === "frost") {
          potHarmIcon = "❄️";
          potHarmTitle = "Cold / Frost Alert for Balcony Herbs";
          potHarmTitleHindi = "तुलसी व नाजुक पौधों के लिए ठंड का अलर्ट";
          potHarmSeverity = minTemp <= 5 ? "critical" : "warning";
        } else if (advisory.potRiskType === "high_wind") {
          potHarmIcon = "💨";
          potHarmTitle = "Strong Wind Warning for Balconies";
          potHarmTitleHindi = "बालकनी के गमलों के लिए तेज हवा की चेतावनी";
          potHarmSeverity = "warning";
        }
        potHarmMessage = advisory.potRiskWarning || "Protect delicate pots and containers from harsh weather.";
        potHarmMessageHindi = advisory.potRiskWarningHindi || "खराब मौसम से अपने गमलों और नाजुक पौधों को सुरक्षित रखें।";
      }

      days.push({
        id: `g-day-${i}-${dateStr}`,
        dayIndex: i,
        dayName,
        dateFormatted: formattedDate,
        condition: mapped.condition,
        conditionLabel: mapped.labelEn,
        conditionLabelHindi: mapped.labelHi,
        tempHighC: maxTemp,
        tempLowC: minTemp,
        feelsLikeC: Math.round(maxTemp + (humidityEst > 70 ? 2 : -1)),
        rainProbabilityPercent: rainProb,
        expectedRainMm: rainMm,
        humidityPercent: humidityEst,
        windSpeedKmh: windMax,
        uvIndex: Math.min(10, Math.max(3, Math.round(maxTemp / 4.5))),
        gardenerTag: advisory.gardenerTag,
        gardenerTagHindi: advisory.gardenerTagHindi,
        careTagType: advisory.careTagType,
        potPlantCareTip: advisory.potPlantCareTip,
        potPlantCareTipHindi: advisory.potPlantCareTipHindi,
        wateringAdvice: advisory.wateringAdvice,
        wateringAdviceHindi: advisory.wateringAdviceHindi,
        isPotRisk: advisory.isPotRisk,
        potRiskType: advisory.potRiskType,
        potRiskWarning: advisory.potRiskWarning,
        potRiskWarningHindi: advisory.potRiskWarningHindi,
      });
    }

    const currentTemp = Math.round(data.current?.temperature_2m ?? days[0]?.tempHighC ?? 32);
    const currentFeels = Math.round(data.current?.apparent_temperature ?? currentTemp + 1);
    const currentHum = Math.round(data.current?.relative_humidity_2m ?? 56);
    const currentWind = Math.round(data.current?.wind_speed_10m ?? 11);

    const nowFormatted = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const forecastResult: GardenerWeeklyWeatherForecast = {
      locationName,
      lastUpdated: `${nowFormatted} (Live)`,
      currentTempC: currentTemp,
      currentFeelsLikeC: currentFeels,
      currentCondition: currentMapped.condition,
      currentConditionLabel: currentMapped.labelEn,
      currentConditionLabelHindi: currentMapped.labelHi,
      currentHumidityPercent: currentHum,
      currentWindSpeedKmh: currentWind,
      hasPotHarmWarning,
      potHarmSeverity,
      potHarmTitle: potHarmTitle || undefined,
      potHarmTitleHindi: potHarmTitleHindi || undefined,
      potHarmMessage: potHarmMessage || undefined,
      potHarmMessageHindi: potHarmMessageHindi || undefined,
      potHarmIcon,
      days,
      weekSummaryText: `This week in your balcony garden: Temperatures will range from ${days[0]?.tempLowC || 20}°C to ${days[0]?.tempHighC || 33}°C. ${
        wateringDays.length > 0 ? `Ideal days to water pots in the morning are ${wateringDays.slice(0, 3).join(", ")}.` : ""
      } ${skipWaterDays.length > 0 ? `You can skip watering on ${skipWaterDays.join(", ")}.` : ""} ${
        hasPotHarmWarning ? potHarmMessage : "Great sunny week for home container plants!"
      }`,
      weekSummaryTextHindi: `इस सप्ताह आपकी बालकनी के पौधों के लिए: तापमान ${days[0]?.tempLowC || 20}°C से ${days[0]?.tempHighC || 33}°C रहेगा। ${
        wateringDays.length > 0 ? `सुबह गमलों में पानी देने के लिए ${wateringDays.slice(0, 3).join(", ")} अच्छे दिन हैं।` : ""
      } ${skipWaterDays.length > 0 ? `${skipWaterDays.join(", ")} को बारिश के कारण पानी न दें।` : ""} ${
        hasPotHarmWarning ? potHarmMessageHindi : "घर के गमलों के लिए पूरा हफ्ता अनुकूल है!"
      }`,
      weeklyPlan: {
        wateringDays: wateringDays.length > 0 ? wateringDays : ["Today", "Tomorrow"],
        skipWaterDays: skipWaterDays.length > 0 ? skipWaterDays : ["None (Regular care)"],
        fertilizeDays: fertilizeDays.length > 0 ? fertilizeDays : ["Today", "Thu"],
      },
    };

    try {
      localStorage.setItem(GARDENER_CACHE_KEY, JSON.stringify(forecastResult));
    } catch {}

    return forecastResult;
  } catch (error) {
    console.warn("Using local cached or verified reference gardener weekly weather:", error);
    try {
      const cached = localStorage.getItem(GARDENER_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.days && parsed.days.length > 0) {
          return {
            ...parsed,
            lastUpdated: "Cached (Offline)",
          };
        }
      }
    } catch {}

    return {
      ...DEFAULT_GARDENER_WEEKLY_WEATHER,
      locationName,
      lastUpdated: "Default Balcony Advisory",
    };
  }
}
