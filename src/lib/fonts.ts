import { 
  Noto_Sans, 
  Noto_Sans_Devanagari, 
  Noto_Sans_Gujarati, 
  Noto_Sans_Tamil, 
  Noto_Sans_Telugu, 
  Noto_Sans_Kannada, 
  Noto_Sans_Bengali, 
  Noto_Sans_Gurmukhi, 
  Noto_Nastaliq_Urdu 
} from 'next/font/google';

export const notoSans = Noto_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
export const notoSansDevanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], weight: ['400', '500', '600', '700'] }); // For Hindi, Marathi
export const notoSansGujarati = Noto_Sans_Gujarati({ subsets: ['gujarati'], weight: ['400', '500', '600', '700'] });
export const notoSansTamil = Noto_Sans_Tamil({ subsets: ['tamil'], weight: ['400', '500', '600', '700'] });
export const notoSansTelugu = Noto_Sans_Telugu({ subsets: ['telugu'], weight: ['400', '500', '600', '700'] });
export const notoSansKannada = Noto_Sans_Kannada({ subsets: ['kannada'], weight: ['400', '500', '600', '700'] });
export const notoSansBengali = Noto_Sans_Bengali({ subsets: ['bengali'], weight: ['400', '500', '600', '700'] });
export const notoSansGurmukhi = Noto_Sans_Gurmukhi({ subsets: ['gurmukhi'], weight: ['400', '500', '600', '700'] }); // For Punjabi
export const notoNastaliqUrdu = Noto_Nastaliq_Urdu({ subsets: ['arabic'], weight: ['400', '500', '600', '700'] });

export function getFontForLanguage(langCode: string) {
  switch (langCode) {
    case 'hi':
    case 'mr':
      return notoSansDevanagari.className;
    case 'gu':
      return notoSansGujarati.className;
    case 'ta':
      return notoSansTamil.className;
    case 'te':
      return notoSansTelugu.className;
    case 'kn':
      return notoSansKannada.className;
    case 'bn':
      return notoSansBengali.className;
    case 'pa':
      return notoSansGurmukhi.className;
    case 'ur':
      return notoNastaliqUrdu.className;
    case 'en':
    default:
      return notoSans.className;
  }
}
