import { createContext, useState, useCallback } from 'react';
import { translations } from '../locales/translations';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const t = useCallback((key) => {
        return translations[language]?.[key] || translations['en']?.[key] || key;
    }, [language]);

    const value = {
        language,
        setLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}
