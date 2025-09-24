import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBrowserLanguage } from '../lib/i18n'; // Import browser language detection

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && (savedLanguage === 'EN' || savedLanguage === 'BN')) {
      return savedLanguage;
    }
    const browserLang = getBrowserLanguage();
    return browserLang === 'BN' ? 'BN' : 'EN';
  });

  useEffect(() => {
    // Only update if localStorage changes externally
    const handleStorage = () => {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage && (savedLanguage === 'EN' || savedLanguage === 'BN')) {
        setLanguage(savedLanguage);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
    
    // Dispatch event for components that need to react to language changes
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLanguage }));
  };

  const value = {
    language,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};