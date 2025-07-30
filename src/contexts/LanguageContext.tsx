import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
    currentLocale: string;
    setLocale: (locale: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [currentLocale, setCurrentLocale] = useState<string>(() => {
        // Try to get saved language from localStorage, default to 'en'
        const savedLocale = localStorage.getItem('preferredLanguage');
        return savedLocale || 'en';
    });

    const setLocale = (locale: string) => {
        setCurrentLocale(locale);
        // Save to localStorage to persist across page reloads and navigation
        localStorage.setItem('preferredLanguage', locale);
    };

    // Ensure the locale is saved when component mounts
    useEffect(() => {
        localStorage.setItem('preferredLanguage', currentLocale);
    }, [currentLocale]);

    const value = {
        currentLocale,
        setLocale
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
