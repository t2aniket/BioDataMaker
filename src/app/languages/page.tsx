'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SUPPORTED_LANGUAGES, LanguageCode } from '@/i18n/config';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import { loadDraftLocal, saveDraftLocal } from '@/lib/draft';

export default function LanguageSelectorPage() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [labelMode, setLabelMode] = useState<'en' | 'native' | 'both'>('both');

  // Load existing draft configuration if any
  useEffect(() => {
    const draft = loadDraftLocal();
    if (draft) {
      if (draft.language) {
        setSelectedLang(draft.language as LanguageCode);
      }
      if (draft.labelMode) {
        setLabelMode(draft.labelMode as any);
      }
    }
  }, []);

  const handleProceed = () => {
    // Save language and label mode to local draft
    const draft = loadDraftLocal() || {
      language: selectedLang,
      templateId: `${selectedLang}-simple-clean-free`, // Default template slug variant
      formData: {},
    };
    draft.language = selectedLang;
    draft.labelMode = labelMode;
    draft.templateId = `${selectedLang}-simple-clean-free`;
    saveDraftLocal(draft);

    // Redirect to template gallery
    router.push(`/templates?lang=${selectedLang}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <span className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
              B
            </span>
            <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Biodata Maker
            </span>
          </div>
          <button
            onClick={() => router.push('/redownload')}
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Find Order
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8 bg-white/70 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-xl shadow-indigo-100/40 border border-white">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Easy & Multilingual
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Select Your <span className="bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Language</span>
            </h1>
            <p className="max-w-xl mx-auto text-base sm:text-lg text-gray-600">
              Choose your preferred language. You can create your marriage biodata and download it in the selected language.
            </p>
          </div>

          {/* Grid list of languages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-6">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 group ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-md scale-102'
                      : 'border-gray-100 bg-white hover:border-indigo-300 hover:shadow-md hover:scale-102'
                  }`}
                >
                  <span
                    className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold mb-3 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-50 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}
                  >
                    {lang.code.toUpperCase()}
                  </span>
                  <span className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {lang.nativeName}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    ({lang.name})
                  </span>

                  {lang.isPopular && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Label Mode Selector */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-4 max-w-2xl mx-auto pt-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
              <Globe className="h-4 w-4 text-indigo-600" />
              Choose Output Label Mode
            </h3>
            <p className="text-xs text-gray-400 text-center">
              Choose how headings (e.g., Name, Gotra) will appear on the final document:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { id: 'en', title: 'English Only', desc: 'e.g. Name' },
                { id: 'native', title: 'Regional Only', desc: 'e.g. नाम / नाव' },
                { id: 'both', title: 'Both English + Regional', desc: 'e.g. Name / नाम' },
              ].map((mode) => {
                const isSelected = labelMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setLabelMode(mode.id as any)}
                    className={`p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-sm font-bold">{mode.title}</span>
                    <span className="block text-3xs text-gray-400 font-medium mt-1">{mode.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <button
              onClick={handleProceed}
              className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-600 to-pink-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-indigo-300/50 hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer text-lg"
            >
              Select Template
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4">
          <p>© 2026 Free Biodata Maker. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
            <a href="/refund" className="hover:underline">Refund Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
