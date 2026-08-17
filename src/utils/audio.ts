import { LanguageCode } from "../types";

// Audio Context Singleton for instant sound effects
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Trigger subtle haptic vibration on devices supporting navigator.vibrate
export function triggerHaptic(duration: number | number[] = 10): void {
  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Ignore vibration error
    }
  }
}

// Sound effects generator using Web Audio API synthesis
export const soundEffects = {
  // Soft, subtle UI "pop / gentle tick" (under 60ms, warm sine drop, quiet) + light haptic
  click: () => {
    triggerHaptic(12);
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Gentle rounded sine wave starting at a warm tone (520Hz) dropping swiftly to 260Hz
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.045);
      
      // Soft gain envelope: gentle peak at 0.065 (under 7% volume) decaying to zero in 45ms
      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore audio synthesis errors
    }
  },

  // Soft subtle tap specifically tailored for keypad numbers / quick toggles
  tap: () => {
    triggerHaptic(8);
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.035);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  },

  // Joyful success chime (e.g. Applied for job, Saved farm data, Pump turned on)
  success: () => {
    triggerHaptic([15, 40, 20]);
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.09, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.23);
      });
    } catch {
      // Ignore
    }
  },

  // Camera shutter snap sound
  camera: () => {
    triggerHaptic(25);
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // White noise click + pitch drop
      const bufferSize = Math.floor(ctx.sampleRate * 0.06);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1200;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start(now);
    } catch {
      // Ignore
    }
  },

  // Alert / Warning tone
  alert: () => {
    triggerHaptic([30, 60, 30]);
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.setValueAtTime(290, now + 0.08);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore
    }
  },

  // Water pump hum toggle sound
  pump: (isOn: boolean) => {
    triggerHaptic(20);
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(isOn ? 180 : 320, now);
      osc.frequency.exponentialRampToValueAtTime(isOn ? 360 : 120, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  },
};

// Language map for Web Speech API
const langVoiceMap: Record<LanguageCode, string[]> = {
  en: ["en-IN", "en-US", "en-GB", "en"],
  hi: ["hi-IN", "hi", "mr-IN"],
  te: ["te-IN", "te", "hi-IN"],
  ta: ["ta-IN", "ta", "hi-IN"],
  mr: ["mr-IN", "mr", "hi-IN"],
  pa: ["pa-IN", "pa", "hi-IN"],
  bn: ["bn-IN", "bn-BD", "bn", "hi-IN"],
  kn: ["kn-IN", "kn", "hi-IN"],
  gu: ["gu-IN", "gu", "hi-IN"],
};

// Text-to-Speech playback manager
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

export function speakText(
  text: string,
  lang: LanguageCode = "en",
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }

  stopSpeaking();
  if (!text || text.trim() === "") {
    onEnd?.();
    return;
  }

  const cleanText = text.replace(/[*_#`[\]()]/g, "").trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance;

  // Find preferred voice matching language
  const targetLocales = langVoiceMap[lang] || ["en-IN", "en"];
  const voices = window.speechSynthesis.getVoices();
  let matchedVoice = voices.find((v) => targetLocales.some((l) => v.lang.startsWith(l)));

  if (!matchedVoice && voices.length > 0) {
    // Default to first available Indian English or English voice
    matchedVoice = voices.find((v) => v.lang.includes("en-IN") || v.lang.includes("en")) || voices[0];
  }

  if (matchedVoice) {
    utterance.voice = matchedVoice;
    utterance.lang = matchedVoice.lang;
  } else {
    utterance.lang = targetLocales[0] || "en-US";
  }

  utterance.rate = 0.95; // Slightly slower for clear rural comprehension
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}

// Browser Speech Recognition for voice search & assistant
export function createSpeechRecognizer(
  lang: LanguageCode = "en",
  onResult: (transcript: string) => void,
  onError: (err: any) => void,
  onEnd: () => void
) {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  const targetLocales = langVoiceMap[lang] || ["en-IN"];
  recognition.lang = targetLocales[0];
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = Array.from(event.results)
      .map((result: any) => result[0].transcript)
      .join("");
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
