import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LanguageCode } from "../types";
import { TRANSLATIONS, TranslationDict, SUPPORTED_LANGUAGES } from "../data/translations";

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDict;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "agrivision_language";
const PROFILE_STORAGE_KEY = "agrivision_profile";

export const LanguageProvider: React.FC<{
  children: ReactNode;
  initialLanguage?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}> = ({ children, initialLanguage, onLanguageChange }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    if (initialLanguage) return initialLanguage;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode;
      if (stored && TRANSLATIONS[stored]) return stored;
      try {
        const profileRaw = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (profileRaw) {
          const profile = JSON.parse(profileRaw);
          if (profile.language && TRANSLATIONS[profile.language as LanguageCode]) {
            return profile.language as LanguageCode;
          }
        }
      } catch {
        // ignore JSON parse errors
      }
    }
    return "hi";
  });

  const setLanguage = (newLang: LanguageCode) => {
    if (!TRANSLATIONS[newLang]) return;
    setCurrentLanguageState(newLang);

    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      try {
        const profileRaw = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (profileRaw) {
          const profile = JSON.parse(profileRaw);
          profile.language = newLang;
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        }
      } catch {
        // ignore
      }
    }

    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      currentLanguage: "hi",
      setLanguage: () => {},
      t: TRANSLATIONS.hi,
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
};
