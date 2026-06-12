export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', isPopular: true, dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isPopular: true, dir: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', isPopular: true, dir: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', isPopular: false, dir: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isPopular: false, dir: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isPopular: false, dir: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', isPopular: false, dir: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isPopular: false, dir: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', isPopular: false, dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', isPopular: false, dir: 'rtl' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export function getLanguageConfig(code: string) {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
}

// Helper to load translations dynamically, falling back to english
export async function getTranslations(lang: string) {
  try {
    const defaultDict = await import('./locales/en.json');
    if (lang === 'en') return defaultDict.default;
    
    const dict = await import(`./locales/${lang}.json`);
    // Merge with English fallback for any missing keys
    return { ...defaultDict.default, ...dict.default };
  } catch (error) {
    console.error(`Failed to load translations for ${lang}`, error);
    const defaultDict = await import('./locales/en.json');
    return defaultDict.default;
  }
}
