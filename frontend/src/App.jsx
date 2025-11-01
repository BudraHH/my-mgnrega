import { useState } from 'react';
import Home from './pages/Home';
import './index.css';
import { LanguageProvider } from './context/LanguageContext'; // ✅ IMPORT
import { useLanguage } from './hooks/useLanguage';
import {Route, Routes} from "react-router-dom";
import Compare from "./pages/Compare.jsx"; // ✅ IMPORT

function AppHeader() {
    const { language, setLanguage, t } = useLanguage(); // ✅ USE HOOK

    return (
            <header className="w-full bg-white shadow-sm border-b border-gray-200 flex items-center justify-between">
                {/* Header Title */}
                <div className="lg:w-10/12 mx-auto px-4 sm:px-6 lg:px-10 py-4">
                    <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{t('appTitle')}</h1>
                    <p className="text-gray-600 mt-1 text-xs sm:text-base">{t('appSubtitle')}</p>
                </div>
                <div className="lg:w-2/12 mx-auto px-4 sm:px-6 lg:px-10 pb-4 ">
                    <div className="bg-white flex flex-col md:flex-row justify-center md:items-center md:justify-between md:gap-2">
                        <label className="hidden md:block md:text-base font-semibold text-gray-800 block">
                            {t('language')}:
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full cursor-pointer text-xs md:text-base md:w-48 py-2 px-2 md:px-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-semibold focus:outline-none focus:border-gray-600"
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                            <option value="ta">தமிழ்</option>
                        </select>
                    </div>
                </div>
            </header>
    );
}

function App() {
    return (
        <LanguageProvider>
            <div className="min-h-screen bg-white">
                <AppHeader />
                <main className="mx-auto p-4 sm:p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/compare" element={<Compare/>} />
                    </Routes>
                </main>
            </div>
        </LanguageProvider>
    );
}

export default App;
