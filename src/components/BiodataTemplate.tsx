'use client';

import React from 'react';
import { getFontForLanguage } from '@/lib/fonts';
import { BIODATA_FORM_SCHEMA } from '@/i18n/schema';

interface BiodataTemplateProps {
  formData: Record<string, any>;
  templateStyle: {
    theme: string;
    font?: string;
    border?: string;
    motif?: string;
    pattern?: string;
    layout?: string;
    photo?: string;
  };
  langCode: string;
  dict: any;
  photoUrl?: string;
  watermark?: boolean;
}

export function BiodataTemplate({
  formData,
  templateStyle,
  langCode,
  dict,
  photoUrl,
  watermark = false,
}: BiodataTemplateProps) {
  const isRtl = langCode === 'ur';
  const fontClass = getFontForLanguage(langCode);

  // Parse custom photo adjustments
  const photoScale = Number(formData.photoScale) || 1;
  const photoX = Number(formData.photoX) || 0;
  const photoY = Number(formData.photoY) || 0;

  // Selected symbol
  const symbol = formData.selectedSymbol || 'None';

  // Render cultural symbol SVGs
  const renderSymbol = () => {
    switch (symbol) {
      case 'Ganpati':
        return (
          <svg className="h-10 w-10 mx-auto fill-orange-600" viewBox="0 0 100 100">
            <path d="M50,10 C45,10 40,15 40,22 C40,25 41,27 43,29 C37,33 34,40 34,47 C34,55 41,62 50,62 C59,62 66,55 66,47 C66,40 63,33 57,29 C59,27 60,25 60,22 C60,15 55,10 50,10 Z M50,18 C52,18 54,20 54,22 C54,24 52,26 50,26 C48,26 46,24 46,22 C46,20 48,18 50,18 Z M45,35 C47,35 48,37 48,39 C48,41 47,43 45,43 C43,43 42,41 42,39 C42,37 43,35 45,35 Z M55,35 C57,35 58,37 58,39 C58,41 57,43 55,43 C53,43 52,41 52,39 C52,37 53,35 55,35 Z M50,44 C47,44 45,46 45,49 L45,55 C45,57 48,59 50,59 C52,59 55,57 55,55 L55,49 C55,46 53,44 50,44 Z" />
            <path d="M50,50 C44,50 42,54 42,57 C42,65 58,65 58,57 C58,54 56,50 50,50 Z" />
          </svg>
        );
      case 'Om':
        return (
          <svg className="h-10 w-10 mx-auto fill-red-800" viewBox="0 0 100 100">
            <path d="M50,15 C45,15 41,18 39,22 C37,18 33,15 28,15 C20,15 14,21 14,29 C14,40 25,52 39,64 C41,66 45,67 47,67 C49,67 53,66 55,64 C69,52 80,40 80,29 C80,21 74,15 66,15 C61,15 57,18 55,22 C53,18 49,15 50,15 Z" className="opacity-0" />
            {/* Om Sanskrit Character path approximation */}
            <text x="50" y="60" textAnchor="middle" fontSize="45" fontWeight="bold" className="fill-amber-700">ॐ</text>
          </svg>
        );
      case 'Kalash':
        return (
          <svg className="h-10 w-10 mx-auto stroke-amber-600 fill-none stroke-2" viewBox="0 0 100 100">
            <path d="M50,15 L62,32 L38,32 Z" className="fill-emerald-600 stroke-none" />
            <ellipse cx="50" cy="35" rx="15" ry="5" className="fill-amber-100" />
            <path d="M35,35 C35,65 65,65 65,35" />
            <circle cx="50" cy="22" r="5" className="fill-red-600 stroke-none" />
            <line x1="30" y1="35" x2="70" y2="35" />
          </svg>
        );
      case 'Lotus':
        return (
          <svg className="h-10 w-10 mx-auto fill-pink-500" viewBox="0 0 100 100">
            <path d="M50,25 C45,35 40,45 40,55 C40,65 45,75 50,75 C55,75 60,65 60,55 C60,45 55,35 50,25 Z" />
            <path d="M50,45 C38,47 28,52 28,62 C28,72 38,75 50,75 C62,75 72,72 72,62 C72,52 62,47 50,45 Z" className="opacity-60" />
            <path d="M50,55 C42,56 35,59 35,66 C35,73 42,75 50,75 C58,75 65,73 65,66 C65,59 58,56 50,55 Z" className="opacity-80" />
          </svg>
        );
      case 'Crescent':
        return (
          <svg className="h-10 w-10 mx-auto fill-emerald-700" viewBox="0 0 100 100">
            <path d="M60,20 C40,20 25,35 25,55 C25,75 40,90 60,90 C45,90 35,80 35,55 C35,30 45,20 60,20 Z" />
            <polygon points="65,42 69,52 79,52 71,58 74,68 65,62 56,68 59,58 51,52 61,52" />
          </svg>
        );
      case 'Khanda':
        return (
          <svg className="h-10 w-10 mx-auto fill-orange-500" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="18" className="fill-none stroke-orange-500 stroke-4" />
            <path d="M50,15 L50,85 M46,30 L54,30 M46,70 L54,70" stroke="currentColor" strokeWidth="4" />
            <path d="M30,35 C22,45 22,55 30,65 C33,68 37,70 42,66 C38,62 36,55 36,50 C36,45 38,38 42,34 C37,30 33,32 30,35 Z" />
            <path d="M70,35 C78,45 78,55 70,65 C67,68 63,70 58,66 C62,62 64,55 64,50 C64,45 62,38 58,34 C63,30 67,32 70,35 Z" />
          </svg>
        );
      case 'Cross':
        return (
          <svg className="h-10 w-10 mx-auto fill-amber-700" viewBox="0 0 100 100">
            <path d="M44,15 L56,15 L56,35 L76,35 L76,47 L56,47 L56,85 L44,85 L44,47 L24,47 L24,35 L44,35 Z" />
          </svg>
        );
      case 'Jain Symbol':
        return (
          <svg className="h-10 w-10 mx-auto stroke-orange-600 fill-none stroke-2" viewBox="0 0 100 100">
            {/* Outline of Jain Ahimsa Hand */}
            <path d="M50,15 C45,15 42,20 42,25 C42,28 45,30 45,32 C41,35 38,40 38,46 C38,60 50,75 50,85 C50,75 62,60 62,46 C62,40 59,35 55,32 C55,30 58,28 58,25 C58,20 55,15 50,15 Z" />
            <circle cx="50" cy="48" r="6" className="fill-orange-100" />
            <text x="50" y="52" textAnchor="middle" fontSize="10" className="fill-orange-600 stroke-none font-bold">अहिंसा</text>
          </svg>
        );
      case 'Floral only':
        return (
          <svg className="h-10 w-10 mx-auto fill-pink-600" viewBox="0 0 100 100">
            <path d="M50,35 C42,20 58,20 50,35 Z M50,65 C42,80 58,80 50,65 Z M35,50 C20,42 20,58 35,50 Z M65,50 C80,42 80,58 65,50 Z" />
            <circle cx="50" cy="50" r="5" className="fill-amber-400" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Determine borders and background styles
  let themeBg = 'bg-white text-gray-900';
  let borderStyle = 'border-2 border-gray-200';
  let borderMotif = '';

  const t = templateStyle.theme;

  if (t === 'gold') {
    themeBg = 'bg-amber-50/20 text-yellow-950';
    borderStyle = 'border-8 border-double border-amber-400 p-8';
  } else if (t === 'floral') {
    themeBg = 'bg-pink-50/10 text-pink-950';
    borderStyle = 'border-6 border-pink-200 p-8';
    borderMotif = 'bg-radial from-pink-100 to-transparent';
  } else if (t === 'orange') {
    themeBg = 'bg-orange-50/30 text-orange-950';
    borderStyle = 'border-8 border-orange-500/80 p-8 rounded-xl';
  } else if (t === 'red') {
    themeBg = 'bg-red-50/30 text-red-950';
    borderStyle = 'border-10 border-red-700/95 p-8';
  } else if (t === 'green-gold') {
    themeBg = 'bg-emerald-50/20 text-emerald-950';
    borderStyle = 'border-8 border-emerald-600 p-8';
  } else if (t === 'blue') {
    themeBg = 'bg-blue-50/20 text-blue-950';
    borderStyle = 'border-4 border-blue-400 p-8';
  } else if (t === 'dark') {
    themeBg = 'bg-slate-900 text-slate-100';
    borderStyle = 'border-4 border-slate-700 p-8';
  } else if (t === 'silver') {
    themeBg = 'bg-slate-50/50 text-slate-900';
    borderStyle = 'border-8 border-slate-300 p-8';
  } else if (t === 'rose') {
    themeBg = 'bg-rose-50/30 text-rose-950';
    borderStyle = 'border-6 border-rose-300 p-8';
  } else if (t === 'cream') {
    themeBg = 'bg-amber-50/30 text-yellow-950';
    borderStyle = 'border-4 border-amber-300 p-8';
  } else if (t === 'cyan-green') {
    themeBg = 'bg-teal-50/30 text-teal-950';
    borderStyle = 'border-6 border-teal-500 p-8';
  } else if (t === 'maroon-gold') {
    themeBg = 'bg-rose-50/10 text-rose-950';
    borderStyle = 'border-8 border-red-900 p-8';
  }

  // Cultural design borders/motifs
  const isPaithani = templateStyle.pattern === 'paithani' || t === 'orange';
  const isPatola = templateStyle.pattern === 'patola' || t === 'red';
  const isPhulkari = templateStyle.pattern === 'phulkari' || templateStyle.theme === 'multicolor';
  const isAlpana = templateStyle.motif === 'alpana' || templateStyle.theme === 'white-red';
  const isKolam = templateStyle.motif === 'kolam' || templateStyle.theme === 'yellow';
  const isMughal = templateStyle.pattern === 'royal-arch' || templateStyle.theme === 'green-gold';

  // Rendering a field only if it exists in formData
  const renderField = (fieldId: string, dictKey: string) => {
    const val = formData[fieldId];
    if (!val) return null; // Hide empty fields!
    const label = dict[dictKey] || dictKey;

    return (
      <div key={fieldId} className="flex flex-col sm:flex-row border-b border-gray-100/40 py-2 sm:py-3 text-sm">
        <span className="font-bold text-gray-500 sm:w-1/3 text-left">
          {label}:
        </span>
        <span className="font-semibold text-gray-900 sm:w-2/3 text-left">
          {val}
        </span>
      </div>
    );
  };

  return (
    <div
      id="biodata-print-layout"
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`print-container relative w-full aspect-[1/1.414] bg-white shadow-2xl mx-auto ${fontClass} ${themeBg} overflow-hidden`}
      style={{
        boxSizing: 'border-box',
        maxWidth: '794px', // A4 pixel width at 96 DPI
        minHeight: '1123px', // A4 pixel height
        padding: '24px',
      }}
    >
      {/* Decorative patterns based on Design Pack */}
      {isPaithani && (
        <div className="absolute top-0 inset-x-0 h-4 bg-linear-to-r from-orange-600 via-amber-400 to-orange-600 opacity-90" />
      )}
      {isPatola && (
        <div className="absolute inset-y-0 left-0 w-3 bg-red-800 opacity-80 repeating-linear-gradient" />
      )}
      {isPhulkari && (
        <div className="absolute top-0 inset-x-0 h-3 bg-linear-to-r from-pink-500 via-yellow-400 via-green-400 to-pink-500 opacity-90" />
      )}
      {isKolam && (
        <div className="absolute bottom-2 right-2 h-16 w-16 opacity-30">
          {/* Decorative Kolam dots grid SVG */}
          <svg viewBox="0 0 100 100" className="stroke-yellow-600 fill-none stroke-2">
            <circle cx="20" cy="20" r="2" className="fill-yellow-600" />
            <circle cx="50" cy="20" r="2" className="fill-yellow-600" />
            <circle cx="80" cy="20" r="2" className="fill-yellow-600" />
            <circle cx="20" cy="50" r="2" className="fill-yellow-600" />
            <circle cx="50" cy="50" r="2" className="fill-yellow-600" />
            <circle cx="80" cy="50" r="2" className="fill-yellow-600" />
            <circle cx="20" cy="80" r="2" className="fill-yellow-600" />
            <circle cx="50" cy="80" r="2" className="fill-yellow-600" />
            <circle cx="80" cy="80" r="2" className="fill-yellow-600" />
            <path d="M20,20 C35,20 35,50 50,50 C65,50 65,80 80,80" />
            <path d="M80,20 C65,20 65,50 50,50 C35,50 35,80 20,80" />
          </svg>
        </div>
      )}

      {/* Main Inner Border Frame */}
      <div className={`h-full w-full flex flex-col justify-between ${borderStyle} ${borderMotif} relative`}>
        
        {/* Cultural motifs */}
        {isAlpana && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-8 opacity-40">
            <svg viewBox="0 0 100 20" className="stroke-red-600 fill-none stroke-2">
              <path d="M10,10 Q25,0 50,10 Q75,20 90,10" />
              <circle cx="50" cy="10" r="3" className="fill-red-600" />
            </svg>
          </div>
        )}

        {/* Top: Header, Symbol, Profile Pic */}
        <div className="space-y-6">
          {/* Symbol */}
          {symbol !== 'None' && (
            <div className="pt-2 text-center">
              {renderSymbol()}
            </div>
          )}

          {/* Heading */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase text-indigo-950 font-serif">
              {dict.ui.submit || 'BIODATA'}
            </h1>
            <div className="h-1 w-24 bg-linear-to-r from-amber-500 to-indigo-600 mx-auto rounded-full" />
          </div>

          {/* Name & Photo Section (Flex/Grid) */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between border-b border-gray-100 pb-6">
            <div className="flex-1 space-y-2 text-center sm:text-left">
              {formData.fullName && (
                <h2 className="text-xl sm:text-2xl font-black text-gray-950">
                  {formData.fullName}
                </h2>
              )}
              {formData.maritalStatus && (
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 inline-block px-2.5 py-1 rounded-md">
                  {formData.maritalStatus}
                </p>
              )}
            </div>

            {/* Render Profile Photo if uploaded and matches layout type */}
            {photoUrl && templateStyle.photo !== 'none' && (
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-xl bg-gray-50 border-2 border-amber-300 shadow-lg overflow-hidden shrink-0 relative">
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="object-cover"
                  style={{
                    transform: `scale(${photoScale}) translate(${photoX}px, ${photoY}px)`,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            )}
          </div>

          {/* Sections Render Loop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {BIODATA_FORM_SCHEMA.map((section) => {
              // Check if all fields in this section are empty. If yes, hide the whole section!
              const hasVisibleFields = section.fields.some((f) => !!formData[f.id]);
              if (!hasVisibleFields) return null;

              return (
                <div key={section.id} className="space-y-2 col-span-1 md:col-span-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-900 border-b-2 border-indigo-100 pb-1.5 mb-2 font-serif text-left">
                    {dict[section.titleKey] || section.titleKey}
                  </h3>
                  <div className="grid grid-cols-1 gap-x-4">
                    {section.fields.map((field) =>
                      renderField(field.id, field.dictKey)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Watermark for free downloads */}
        {watermark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-45 select-none z-0">
            <span className="text-slate-200/40 text-4xl sm:text-6xl font-black uppercase tracking-widest">
              Free Biodata Maker
            </span>
          </div>
        )}

        {/* Footer info: Website link */}
        <div className="text-center pt-6 border-t border-gray-100/50">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {watermark ? 'Created with Free Biodata Maker (freebiodatamaker.com)' : 'freebiodatamaker.com'}
          </p>
        </div>
      </div>
    </div>
  );
}
