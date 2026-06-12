'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, ArrowLeft, CheckCircle, Smartphone, Printer, Sparkles, Award } from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '@/i18n/config';
import { loadDraftLocal, saveDraftLocal } from '@/lib/draft';

interface Template {
  id: string;
  slug: string;
  name: string;
  category: string;
  languageSupport: string[];
  priceInPaise: number;
  isFree: boolean;
  previewImage: string;
  styleConfig: any;
  supportedExports: string[];
}

interface TemplateDetailClientProps {
  template: Template;
  initialLang: LanguageCode;
}

export default function TemplateDetailClient({ template, initialLang }: TemplateDetailClientProps) {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(initialLang);

  const priceText = template.isFree ? 'Free' : `₹${template.priceInPaise / 100}`;
  const supportedLanguagesList = SUPPORTED_LANGUAGES.filter((l) =>
    template.languageSupport.includes(l.code)
  );

  const handleUseTemplate = () => {
    // Sync draft language & template ID local
    const draft = loadDraftLocal() || {
      language: selectedLang,
      templateId: template.id,
      formData: {},
    };
    draft.language = selectedLang;
    draft.templateId = template.id;
    saveDraftLocal(draft);

    // Redirect to form builder
    router.push(`/create`);
  };

  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Gallery
          </button>
          <div className="flex items-center gap-2">
            <span className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              B
            </span>
            <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent hidden sm:inline">
              Biodata Maker
            </span>
          </div>
        </div>
      </header>

      {/* Main Details Panel */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left: Preview visual */}
          <div className="p-8 sm:p-12 bg-linear-to-b from-slate-50 to-slate-100 border-r border-gray-100 flex flex-col justify-center items-center relative min-h-[400px]">
            {/* Visual template simulation */}
            <div className="w-full max-w-[320px] aspect-[3/4] bg-white rounded-2xl shadow-2xl p-6 relative border border-gray-100 flex flex-col justify-between overflow-hidden">
              {/* Motif Frame visual */}
              {template.styleConfig.theme === 'gold' && (
                <div className="absolute inset-0 border-8 border-amber-400 bg-amber-50/5" />
              )}
              {template.styleConfig.theme === 'floral' && (
                <div className="absolute inset-0 border-8 border-pink-200 bg-pink-50/5" />
              )}
              {template.styleConfig.theme === 'orange' && (
                <div className="absolute inset-0 border-8 border-orange-400 bg-orange-50/5" />
              )}
              {template.styleConfig.theme === 'red' && (
                <div className="absolute inset-0 border-8 border-red-500 bg-red-50/5" />
              )}
              {template.styleConfig.theme === 'green-gold' && (
                <div className="absolute inset-0 border-8 border-emerald-600 bg-emerald-50/5" />
              )}

              <div className="z-10 w-full h-8 border-b border-gray-100 flex justify-between items-center px-1">
                <div className="h-1.5 w-10 bg-indigo-100 rounded-full" />
                <div className="h-4 w-4 bg-indigo-50 rounded-full flex items-center justify-center text-[8px] text-indigo-400 font-bold border border-indigo-200">
                  ॐ
                </div>
                <div className="h-1.5 w-10 bg-indigo-100 rounded-full" />
              </div>

              <div className="z-10 space-y-3 py-6">
                <div className="h-4 w-3/4 bg-gray-200 rounded-md" />
                <div className="h-2 w-1/2 bg-gray-100 rounded-md" />
                <div className="h-2 w-2/3 bg-gray-100 rounded-md" />
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-50">
                  <div className="h-2 bg-gray-100 rounded-md" />
                  <div className="h-2 bg-gray-100 rounded-md" />
                  <div className="h-2 bg-gray-100 rounded-md" />
                  <div className="h-2 bg-gray-100 rounded-md" />
                </div>
              </div>

              <div className="z-10 h-6 border-t border-gray-100 flex justify-center items-center">
                <div className="h-1 w-16 bg-indigo-100 rounded-full" />
              </div>
            </div>

            <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full border border-gray-100 font-bold text-xs shadow-xs text-gray-700 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-indigo-600" />
              {template.category}
            </div>
          </div>

          {/* Right: Info details */}
          <div className="p-8 sm:p-12 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">
                  Premium Quality Design
                </span>
                <h1 className="text-3xl font-extrabold text-gray-950 mt-2">
                  {template.name}
                </h1>
                <p className="text-2xl font-bold text-indigo-600">
                  Price: {priceText}{' '}
                  {template.isFree ? (
                    <span className="text-xs font-normal text-emerald-600 ml-1">(Free Forever)</span>
                  ) : (
                    <span className="text-xs font-normal text-gray-500 ml-1">(One-time payment to download)</span>
                  )}
                </p>
              </div>

              {/* Languages switch */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Select Design Language
                </label>
                <div className="flex flex-wrap gap-2">
                  {supportedLanguagesList.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${
                        selectedLang === lang.code
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checklist details */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Template Features
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    High-res PDF Download
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    High-res Image (PNG)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Editable Word DOCX
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    A4 Print Ready Layout
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Mobile Optimized View
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Correct Font Rendering
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleUseTemplate}
                className="w-full bg-linear-to-r from-indigo-600 to-pink-600 hover:shadow-indigo-300/40 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:scale-101 active:scale-99 transition-all duration-300 text-center cursor-pointer text-lg"
              >
                Create Biodata Now
              </button>
              <p className="text-center text-xs text-gray-400">
                No registration or account creation required. Start filling details instantly.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100 text-center text-xs text-gray-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4">
          <p>© 2026 Free Biodata Maker. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
            <a href="/refund" className="hover:underline">Refund Policy</a>
          </div>
        </div>
      </footer>
    </>
  );
}
