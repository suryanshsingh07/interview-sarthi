import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations, supportedLanguages } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('appLang') || 'English');

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  const t = (key) => {
    // If the selected language doesn't have the translation, fallback to English
    const dict = translations[lang] || translations['English'];
    return dict[key] || translations['English'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
