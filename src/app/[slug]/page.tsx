import React from 'react';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getFontForLanguage } from '@/lib/fonts';
import { Globe, ArrowRight, ShieldCheck, Heart, Sparkles, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { LanguageCode } from '@/i18n/config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SEOLandingPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Defined SEO Pages mappings
  const languageSEO: Record<string, { code: string; name: string; nativeName: string; title: string; h1: string; desc: string; content: string }> = {
    'marathi-biodata-maker': {
      code: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
      title: 'Marathi Marriage Biodata Maker Online | मराठी बायोडाटा',
      h1: 'मराठी लग्नाचा बायोडाटा बनवा',
      desc: 'मराठीत लग्नाचा बायोडाटा (Biodata) बनवा. पाहितणी बॉर्डर आणि गणपती चिन्हासह उत्कृष्ट डिझाइन. १ मिनिटात पीडीएफ डाउनलोड करा.',
      content: 'लग्नासाठी बायोडाटा तयार करणे आता अगदी सोपे झाले आहे. आमच्या मराठी लग्नाच्या बायोडाटा मेकरसह तुम्ही अवघ्या काही मिनिटांत एक सुंदर आणि व्यावसायिक बायोडाटा तयार करू शकता. यामध्ये तुम्हाला विविध पारंपरिक आणि आधुनिक डिझाइन्स मिळतील, ज्या तुम्ही मोफत आणि अतिशय वाजवी दरात डाउनलोड करू शकता.',
    },
    'hindi-biodata-maker': {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      title: 'Hindi Marriage Biodata Maker Online | हिंदी विवाह बायोडाटा',
      h1: 'हिंदी में विवाह का बायोडाटा बनाएं',
      desc: 'विवाह के लिए सुंदर हिंदी बायोडाटा बनाएं। गणेशजी, ओम् और कलश प्रतीकों के साथ उत्तम डिज़ाइन। आसानी से पीडीएफ डाउनलोड करें।',
      content: 'शादी के लिए सर्वश्रेष्ठ बायोडाटा हिंदी में बनाएं। हमारे हिंदी विवाह बायोडाटा मेकर के साथ, आप कुछ ही मिनटों में अपनी पसंद के डिज़ाइन और प्रतीकों के साथ पीडीएफ तैयार कर सकते हैं। सरल डिज़ाइन हमेशा के लिए मुफ़्त हैं।',
    },
    'english-biodata-maker': {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      title: 'English Marriage Biodata Maker Online | Professional Layouts',
      h1: 'Create Marriage Biodata in English Online',
      desc: 'Generate a professional marriage biodata in English in minutes. Choose from elegant templates, upload your photo, and download free.',
      content: 'Make the perfect first impression with our professional English marriage biodata maker. Select from a variety of modern, classic, and royal layouts. Completely mobile friendly with simple steps.',
    },
    'gujarati-biodata-maker': {
      code: 'gu',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      title: 'Gujarati Marriage Biodata Maker Online | લગ્ન માટે બાયોડેટા',
      h1: 'લગ્ન માટે બાયોડેટા બનાવો ગુજરાતીમાં',
      desc: 'ગુજરાતીમાં લગ્નનો બાયોડેટા બનાવો. પટોળા અને ગણેશ/કળશ ચિહ્નો સાથે સુંદર ડિઝાઇન. પીડીએફ અને વર્ડ ફોર્મેટમાં ડાઉનલોડ કરો.',
      content: 'શા માટે લગ્ન માટે બાયોડેટા બનાવવા મોંઘા ખર્ચ કરવા? અમારા ગુજરાતી લગ્ન બાયોડેટા મેકરથી સુંદર ડિઝાઇન પસંદ કરો અને ગણતરીની મિનિટોમાં પીડીએફ અને એડિટેબલ વર્ડ ફાઇલ ડાઉનલોડ કરો.',
    },
    'tamil-biodata-maker': {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      title: 'Tamil Marriage Biodata Maker Online | திருமண பயோடேட்டா',
      h1: 'தமிழில் திருமண பயோடேட்டா உருவாக்குங்கள்',
      desc: 'திருமணத்திற்கு பயோடேட்டா தமிழில் உருவாக்குங்கள். கோலம் பார்டர்கள் மற்றும் மங்கள சின்னங்களுடன் சிறந்த வடிவமைப்பு.',
      content: 'உங்கள் வீட்டில் இருந்தபடியே அழகான தமிழ் திருமண பயோடேட்டாவை உருவாக்குங்கள். எளிய வடிவமைப்புகள் எப்போதும் இலவசம்.',
    },
    'telugu-biodata-maker': {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      title: 'Telugu Marriage Biodata Maker Online | పెళ్లి బయోడేటా',
      h1: 'తెలుగులో పెళ్లి బయోడేటా సృష్టించండి',
      desc: 'తెలుగులో వివాహ బయోడేటాను సృష్టించండి. కలంకారీ సరిహద్దులు మరియు నక్షత్రాలు, రాశులతో కూడిన వివరాలతో నిమిషాల్లో సిద్ధం చేయండి.',
      content: 'మా పెళ్లి బయోడేటా మేకర్ ద్వారా మీ వివరాలను తెలుగులో పూరించి, అత్యంత అందమైన డిజైన్లను ఉచితంగా లేదా కేవలం ₹10 నుండి డౌన్‌లోడ్ చేసుకోండి.',
    },
    'kannada-biodata-maker': {
      code: 'kn',
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      title: 'Kannada Marriage Biodata Maker Online | ಮದುವೆ ಬಯೋಡೇಟಾ',
      h1: 'ಕನ್ನಡದಲ್ಲಿ ಮದುವೆ ಬಯೋಡೇಟಾ ರಚಿಸಿ',
      desc: 'ಕನ್ನಡದಲ್ಲಿ ಆಕರ್ಷಕ ಮದುವೆಯ ಬಯೋಡೇಟಾವನ್ನು ರಚಿಸಿ. ಕಸೂತಿ ಮತ್ತು ಮೈಸೂರು ರಾಯಲ್ ಬಾರ್ಡರ್ ಶೈಲಿಯೊಂದಿಗೆ ಸುಲಭವಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
      content: 'ನಿಮ್ಮ ಮದುವೆಯ ಬಯೋಡೇಟಾವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಸಂಪೂರ್ಣ ವಿವರಗಳೊಂದಿಗೆ ಉಚಿತವಾಗಿ ರಚಿಸಿ. ನಿಮ್ಮ ಮೊಬైಲ್ ಮೂಲಕವೇ ನೇರವಾಗಿ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    },
    'bengali-biodata-maker': {
      code: 'bn',
      name: 'Bengali',
      nativeName: 'বাংলা',
      title: 'Bengali Marriage Biodata Maker Online | বিয়ের বায়োডাটা',
      h1: 'বাংলায় বিয়ের বায়োডাটা তৈরি করুন',
      desc: 'বাংলা বিয়ের বায়োডাটা তৈরি করুন। আলপনা বর্ডার এবং লাল-সাদা শুভ ডিজাইনের সাথে মাত্র ১ মিনিটে আকর্ষণীয় বায়োডাটা ডাউনলোড করুন।',
      content: 'বাঙালি সংস্কৃতি অনুযায়ী আলপনা বর্ডার দিয়ে বিয়ের জন্য বায়োডাটা তৈরি করুন অত্যন্ত সহজ উপায়ে।',
    },
    'punjabi-biodata-maker': {
      code: 'pa',
      name: 'Punjabi',
      nativeName: 'ਪੰਜਾਬੀ',
      title: 'Punjabi Marriage Biodata Maker Online | ਵਿਆਹ ਦਾ ਬਾਇਓਡਾਟਾ',
      h1: 'ਪੰਜਾਬੀ ਵਿੱਚ ਵਿਆਹ ਦਾ ਬਾਇਓਡਾਟਾ ਬਣਾਓ',
      desc: 'ਵਿਆਹ ਲਈ ਪੰਜਾਬੀ ਵਿੱਚ ਬਾਇਓਡਾਟਾ ਬਣਾਓ। ਫੁਲਕਾਰੀ ਡਿਜ਼ਾਈਨ ਅਤੇ ਖੰਡਾ ਨਿਸ਼ਾਨ ਵਿਕਲਪਾਂ ਨਾਲ ਸੁੰਦਰ ਬਾਇਓਡਾਟਾ ਡਾਊਨਲੋਡ ਕਰੋ।',
      content: 'ਸਾਡੇ ਆਨਲਾਈਨ ਬਾਇਓਡਾਟਾ ਮੇਕਰ ਨਾਲ ਪੰਜਾਬੀ ਵਿੱਚ ਆਪਣਾ ਵਿਆਹ ਦਾ ਰਿਜ਼ੂਮੇ/ਬਾਇਓਡਾਟਾ ਤਿਆਰ ਕਰੋ।',
    },
    'urdu-biodata-maker': {
      code: 'ur',
      name: 'Urdu',
      nativeName: 'اردو',
      title: 'Urdu Marriage Biodata Maker | بائیو ڈیٹا میکر اردو',
      h1: 'شادی کے لئے اردو میں خوبصورت بائیو ڈیٹا بنائیں',
      desc: 'اردو میں شادی کا بائیو ڈیٹا بنائیں۔ مغل محراب، ہندسی ڈیزائن اور چاند تارے کے اختیارات کے ساتھ پی ڈی ایف ڈاؤن لوڈ کریں۔',
      content: 'خوبصورت ہندسی بارڈرز اور دائیں سے بائیں (RTL) اردو نستعلیق رسم الخط کے ساتھ بائیو ڈیٹا بنائیں۔',
    },
  };

  const formatSEO: Record<string, { title: string; h1: string; desc: string; content: string; symbol: string }> = {
    'marriage-biodata-format-for-boy': {
      title: 'Marriage Biodata Format for Boy / Groom | Free PDF Download',
      h1: 'Marriage Biodata Format for Grooms & Boys',
      desc: 'Download professional marriage biodata format for boys. Choose clean, modern, and royal layouts suited for grooms. Start free.',
      content: 'Are you looking for a marriage biodata format for grooms? Access premium layouts customized specifically for boys, highlighting career, income, gotra, and education details.',
      symbol: 'Ganpati',
    },
    'marriage-biodata-format-for-girl': {
      title: 'Marriage Biodata Format for Girl / Bride | Elegant Designs',
      h1: 'Marriage Biodata Format for Brides & Girls',
      desc: 'Beautiful and elegant marriage biodata formats for girls. Choose floral and classic styles suited for brides. PDF & Word exports.',
      content: 'Find the most beautiful biodata templates for girls. Highlight education, family background, partner expectations, and hobbies in an elegant document.',
      symbol: 'Floral only',
    },
    'hindu-marriage-biodata-format': {
      title: 'Hindu Marriage Biodata Format | Ganesh & Om Motifs',
      h1: 'Hindu Marriage Biodata Format Online',
      desc: 'Traditional Hindu marriage biodata formats with Ganesh, Om, and Kalash motifs. Beautiful gold and saffron borders. Download PDF.',
      content: 'Generate traditional Hindu marriage biodatas with auspicious religious symbols (Ganesh, Om, Kalash, Lotus) and detailed gotra, rashi, and manglik specifications.',
      symbol: 'Ganpati',
    },
    'muslim-marriage-biodata-format': {
      title: 'Muslim Marriage Biodata Format | Mughal Arch & Islamic Themes',
      h1: 'Muslim Marriage Biodata Format Online',
      desc: 'Beautiful Islamic marriage biodata formats with crescent and geometric border motifs. Support for Urdu and English scripts.',
      content: 'Create elegant Nikah/Muslim marriage biodata documents featuring geometric motifs, Mughal arches, and crescent options. No random Arabic text.',
      symbol: 'Crescent',
    },
    'sikh-marriage-biodata-format': {
      title: 'Sikh Marriage Biodata Format | Khanda Motif & Punjabi Styles',
      h1: 'Sikh Marriage Biodata Format Online',
      desc: 'Professional Sikh marriage biodata formats with Khanda options and Phulkari inspired borders. Download in PDF or Word.',
      content: 'Designed for Sikh brides and grooms. Highlight family values, religious beliefs, and professional achievements with clean borders.',
      symbol: 'Khanda',
    },
    'christian-marriage-biodata-format': {
      title: 'Christian Marriage Biodata Format | White & Gold Cross Themes',
      h1: 'Christian Marriage Biodata Format Online',
      desc: 'Clean white and gold Christian marriage biodata layouts with optional holy cross symbols. Access professional PDF downloads.',
      content: 'Elegant, clean, and modern biodata formats for Christian marriages. Highlight church associations, family details, and career goals.',
      symbol: 'Cross',
    },
    'biodata-format-with-photo': {
      title: 'Marriage Biodata Format with Photo | Modern Frame Layouts',
      h1: 'Marriage Biodata Format with Photo',
      desc: 'Create marriage biodatas featuring profile photo frames. Upload and crop your photo easily on mobile. High-resolution PDF downloads.',
      content: 'First impressions matter. Add a clean, high-resolution photo to your biodata. Our templates feature custom photo positioning and scale options.',
      symbol: 'None',
    },
    'biodata-format-without-photo': {
      title: 'Marriage Biodata Format without Photo | Classic Layouts',
      h1: 'Marriage Biodata Format without Photo',
      desc: 'Classic marriage biodata formats focusing entirely on details and typography. Free clean and simple PDF download.',
      content: 'If you prefer a text-heavy, traditional look, download a template without a photo. Clean layouts with classic typography for readability.',
      symbol: 'None',
    },
    'editable-marriage-biodata-word-format': {
      title: 'Editable Marriage Biodata Word DOCX Format | Instant Edit',
      h1: 'Editable Marriage Biodata Word Formats',
      desc: 'Download editable marriage biodata files in Microsoft Word (.docx) format. Edit details easily on MS Word. Free & paid templates.',
      content: 'Prefer editing in Microsoft Word? Our premium templates unlock editable DOCX files. Download instantly and edit formatting at your convenience.',
      symbol: 'None',
    },
    'marriage-biodata-pdf-download': {
      title: 'Marriage Biodata PDF Download | Print-Ready A4 Layouts',
      h1: 'Marriage Biodata PDF Download',
      desc: 'Download high-quality print-ready marriage biodatas in PDF. Optimised A4 dimensions with crisp fonts. Start free.',
      content: 'Export your biodata as a print-ready A4 PDF. Optimized colors, margins, and script rendering for beautiful physical printouts.',
      symbol: 'None',
    },
    'royal-marriage-biodata-template': {
      title: 'Royal Marriage Biodata Templates | Gold Ornate Borders',
      h1: 'Royal Marriage Biodata Templates',
      desc: 'Premium marriage biodata templates featuring royal gold borders, mandala designs, and sophisticated colors. Start from ₹10.',
      content: 'Wow families with our royal gold frame and ornate border designs. Crafted for premium impressions starting from just ₹30.',
      symbol: 'None',
    },
    'simple-marriage-biodata-template': {
      title: 'Simple Marriage Biodata Templates | Free Forever',
      h1: 'Simple & Clean Marriage Biodata Templates',
      desc: 'Simple marriage biodata formats. Plain, clear, and easy to read. Completely free to customize and download PDF.',
      content: 'Simple, minimal layouts are completely free forever. Clean fonts and margins focusing entirely on your details.',
      symbol: 'None',
    },
  };

  // 2. Identify Page Type
  let seoData: any = null;
  let defaultLang: LanguageCode = 'en';

  if (languageSEO[slug]) {
    seoData = languageSEO[slug];
    defaultLang = languageSEO[slug].code as LanguageCode;
  } else if (formatSEO[slug]) {
    seoData = formatSEO[slug];
  } else {
    notFound();
  }

  // 3. Fetch compatible templates
  const templates = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { priceInPaise: 'asc' },
    take: 4,
  });

  const fontClass = getFontForLanguage(defaultLang);

  // FAQ mock list for JSON-LD schema
  const faqs = [
    {
      q: 'How can I create a marriage biodata for free?',
      a: 'Choose any simple template on our website. Simple templates are free forever and do not require any payment or sign up. You can fill in your details and download the PDF immediately.',
    },
    {
      q: 'Can I switch templates without re-entering my details?',
      a: 'Yes! Your form details are automatically saved locally and synced with our servers. You can switch templates and languages instantly at any step without losing your data.',
    },
    {
      q: 'What formats can I download?',
      a: 'For free templates, you can download a print-ready A4 PDF or a WhatsApp-friendly Image. Premium templates also unlock a fully editable Microsoft Word (DOCX) document.',
    },
  ];

  return (
    <div className={`min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50 flex flex-col justify-between ${fontClass}`}>
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
              B
            </span>
            <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Biodata Maker
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/languages"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero / content Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* H1 / Description */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            SEO Format Page
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            {seoData.h1}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {seoData.desc}
          </p>
        </div>

        {/* Content body */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 text-gray-700 text-base leading-relaxed">
          <p>{seoData.content}</p>
          <p>
            Create an amazing marriage biodata easily. Choose a layout, add your personal and career details, customize motifs, upload a photo, and export in seconds. Make a premium impression starting from free options.
          </p>
        </div>

        {/* Templates Preview gallery */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-950 text-center">
            Recommended Biodata Designs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {templates.map((t: any) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div className="aspect-[3/4] bg-slate-50 relative flex items-center justify-center p-4 border-b border-gray-50">
                  <div className="text-2xs font-bold text-gray-300 uppercase">Template Preview</div>
                  <span className="absolute top-3 left-3 bg-indigo-50 text-indigo-700 text-3xs font-bold px-2 py-0.5 rounded-full">
                    {t.isFree ? 'Free' : `₹${t.priceInPaise / 100}`}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <h4 className="font-bold text-sm text-gray-900">{t.name}</h4>
                  <Link
                    href={`/templates/${t.id}?lang=${defaultLang}`}
                    className="block w-full text-center py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Select Design
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-linear-to-r from-indigo-600 to-pink-600 p-8 sm:p-12 rounded-3xl text-white text-center space-y-6 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-black">
            Create Your Marriage Biodata Today
          </h3>
          <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base">
            Select your language, fill the details, preview and download free. Premium templates start from just ₹10.
          </p>
          <div className="flex justify-center">
            <Link
              href="/languages"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-600 font-extrabold px-8 py-4 rounded-xl shadow-lg transition-all text-base cursor-pointer hover:scale-103"
            >
              Start Creating Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-950 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-2 text-left">
                <h4 className="font-bold text-gray-950 text-sm flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-gray-600 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map((f) => ({
              '@type': 'Question',
              'name': f.q,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': f.a,
              },
            })),
          }),
        }}
      />

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
    </div>
  );
}
