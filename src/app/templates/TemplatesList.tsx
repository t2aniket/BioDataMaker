'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, ShieldCheck, Heart, Filter, CheckCircle2 } from 'lucide-react';
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

interface TemplatesListProps {
  initialTemplates: Template[];
  langCode: LanguageCode;
}

export default function TemplatesList({ initialTemplates, langCode }: TemplatesListProps) {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(langCode);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterPhoto, setFilterPhoto] = useState<'all' | 'photo' | 'nophoto'>('all');

  // Filter templates
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  const filteredTemplates = initialTemplates.filter((t) => {
    // Language check
    const supportsLang = t.languageSupport.includes(selectedLang);
    if (!supportsLang) return false;

    // Category check
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Free' && !t.isFree) return false;
      if (selectedCategory === 'Premium' && t.isFree) return false;
      if (selectedCategory === 'Regional' && !t.category.includes('Regional') && !t.category.includes('Traditional')) return false;
      if (selectedCategory === 'No-photo' && !t.category.includes('No-photo')) return false;
      if (selectedCategory === 'Royal' && !t.category.includes('Royal')) return false;
    }

    // Photo check
    const hasPhotoConfig = t.styleConfig.photo !== undefined || t.slug.includes('photo');
    const isNoPhotoCategory = t.category.includes('No-photo') || t.slug.includes('no-photo');
    if (filterPhoto === 'photo' && isNoPhotoCategory) return false;
    if (filterPhoto === 'nophoto' && !isNoPhotoCategory) return false;

    return true;
  });

  const handleSelectTemplate = (template: Template) => {
    // Save draft state
    const existingDraft = loadDraftLocal() || {
      language: selectedLang,
      templateId: template.id,
      formData: {},
    };
    existingDraft.language = selectedLang;
    existingDraft.templateId = template.id;
    saveDraftLocal(existingDraft);

    // Go to details page
    router.push(`/templates/${template.id}?lang=${selectedLang}`);
  };

  const categories = ['All', 'Free', 'Premium', 'Regional', 'Royal', 'No-photo'];

  return (
    <>
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

          <div className="flex items-center gap-4">
            {/* Language Switcher Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-sm">
              <Globe className="h-4 w-4 text-gray-500" />
              <select
                value={selectedLang}
                onChange={(e) => {
                  const val = e.target.value as LanguageCode;
                  setSelectedLang(val);
                  router.replace(`/templates?lang=${val}`);
                }}
                className="bg-transparent border-0 outline-hidden font-medium text-gray-700 focus:ring-0"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => router.push('/redownload')}
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block"
            >
              Find Order
            </button>
          </div>
        </div>
      </header>

      {/* Main section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
        {/* Intro */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Select a <span className="bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Biodata Template</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple templates are free forever. Premium templates start from just ₹10. Select a design to fill your biodata details.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo Filters */}
          <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 w-full md:w-auto justify-center md:justify-end">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <Filter className="h-3 w-3" /> Photo:
            </span>
            {(['all', 'photo', 'nophoto'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterPhoto(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  filterPhoto === mode
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {mode === 'all' ? 'All' : mode === 'photo' ? 'With Photo' : 'No Photo'}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => {
              const isPaid = !template.isFree;
              const priceText = template.isFree ? 'Free' : `₹${template.priceInPaise / 100}`;
              return (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:scale-103 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Template Card Visual */}
                  <div className="relative aspect-[3/4] bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden border-b border-gray-50">
                    {/* Simulated Template Preview */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      {/* Motif Header simulation */}
                      <div className="w-full h-8 border-b border-gray-200/50 flex justify-between items-center px-2">
                        <div className="h-2 w-12 bg-gray-300 rounded-full" />
                        <div className="h-3.5 w-3.5 rounded-full border border-gray-300" />
                        <div className="h-2 w-12 bg-gray-300 rounded-full" />
                      </div>

                      {/* simulated details */}
                      <div className="space-y-2 py-4">
                        <div className="h-3 w-3/4 bg-gray-300 rounded-md" />
                        <div className="h-2 w-1/2 bg-gray-200 rounded-md" />
                        <div className="h-2 w-2/3 bg-gray-200 rounded-md" />
                        <div className="h-2.5 w-1/2 bg-gray-300 rounded-md mt-4" />
                        <div className="h-2 w-3/4 bg-gray-200 rounded-md" />
                      </div>

                      {/* Motif Footer simulation */}
                      <div className="h-4 w-full border-t border-gray-200/50 flex justify-center items-center">
                        <div className="h-1.5 w-20 bg-gray-300 rounded-full" />
                      </div>
                    </div>

                    {/* Gradient Overlay based on categories */}
                    {template.styleConfig.theme === 'gold' && (
                      <div className="absolute inset-0 border-8 border-amber-400 bg-amber-50/10 opacity-70 group-hover:scale-105 transition-transform" />
                    )}
                    {template.styleConfig.theme === 'floral' && (
                      <div className="absolute inset-0 border-8 border-pink-200 bg-pink-50/10 opacity-70 group-hover:scale-105 transition-transform" />
                    )}
                    {template.styleConfig.theme === 'orange' && (
                      <div className="absolute inset-0 border-8 border-orange-400 bg-orange-50/10 opacity-70 group-hover:scale-105 transition-transform" />
                    )}
                    {template.styleConfig.theme === 'red' && (
                      <div className="absolute inset-0 border-8 border-red-500 bg-red-50/10 opacity-70 group-hover:scale-105 transition-transform" />
                    )}
                    {template.styleConfig.theme === 'green-gold' && (
                      <div className="absolute inset-0 border-8 border-emerald-600 bg-emerald-50/10 opacity-70 group-hover:scale-105 transition-transform" />
                    )}

                    {/* Badge */}
                    <span
                      className={`absolute top-4 left-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold shadow-xs ${
                        template.isFree
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {priceText}
                    </span>

                    {/* Category Label */}
                    <span className="absolute bottom-4 right-4 text-gray-400 text-2xs uppercase tracking-wider bg-white/95 px-2 py-0.5 rounded-md border border-gray-100 font-bold">
                      {template.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-lg">
                        {template.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Format: {template.supportedExports.join(', ')}
                      </p>
                    </div>

                    <button className="w-full py-2.5 rounded-xl border border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 text-sm font-semibold transition-all duration-200 cursor-pointer">
                      Customize Design
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-xs max-w-xl mx-auto space-y-4">
            <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-800 text-lg">No templates found</h3>
            <p className="text-sm text-gray-500">
              No template found matching your current category/filter for {langConfig.name}. Try selecting a different filter.
            </p>
          </div>
        )}
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
