import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translate, LANGUAGES } from '../constants/strings';

const STORAGE_KEY = 'kobciye_language';

const LocalizationContext = createContext(null);

export function LocalizationProvider({ children }) {
  const [language, setLanguageState] = useState(LANGUAGES.english);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((code) => {
      if (code === 'so') setLanguageState(LANGUAGES.somali);
    });
  }, []);

  const setLanguage = useCallback(async (lang) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(STORAGE_KEY, lang.code);
  }, []);

  const toggle = useCallback(() => {
    setLanguage(language.code === 'en' ? LANGUAGES.somali : LANGUAGES.english);
  }, [language, setLanguage]);

  const t = useCallback((key) => translate(key, language.code), [language]);

  const value = useMemo(() => ({ language, setLanguage, toggle, t }), [language, setLanguage, toggle, t]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const ctx = useContext(LocalizationContext);
  if (!ctx) throw new Error('useLocalization must be used within LocalizationProvider');
  return ctx;
}
