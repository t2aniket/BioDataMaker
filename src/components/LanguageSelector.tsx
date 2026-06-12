import React from 'react';
import { SUPPORTED_LANGUAGES, LanguageCode } from '@/i18n/config';
import { Check, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  selectedLang: LanguageCode;
  onSelect: (lang: LanguageCode) => void;
  dict: any; // The UI dictionary for translations
}

export function LanguageSelector({ selectedLang, onSelect, dict }: LanguageSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {dict.ui.selectLanguage}
        </h2>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Choose your preferred language to generate the biodata.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className={cn(
                "relative flex items-center justify-between p-6 rounded-2xl border-2 text-left transition-all duration-200",
                isSelected
                  ? "border-blue-600 bg-blue-50/50 shadow-sm"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              )}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-gray-900" dir={lang.dir}>
                    {lang.nativeName}
                  </span>
                  {lang.isPopular && (
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                      {dict.ui.popular || "Popular"}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-sm text-gray-500">
                  {lang.name}
                </span>
              </div>
              
              <div className={cn(
                "h-6 w-6 rounded-full border flex items-center justify-center transition-colors",
                isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"
              )}>
                {isSelected && <Check className="h-4 w-4 text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
