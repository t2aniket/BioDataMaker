'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Heart, ShieldCheck, ArrowRight, Printer, Sparkles, Check, X, Award, Smartphone, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  const trustCards = [
    { title: 'No Login Required', desc: 'No email or account creation needed. Start immediately.', icon: ShieldCheck },
    { title: 'Simple Templates Free', desc: 'Simple templates are genuinely free with branding.', icon: CheckCircle },
    { title: 'Premium after Preview', desc: 'Upgrade to premium templates only if you like the design preview.', icon: Award },
    { title: 'PDF & Image Downloads', desc: 'Download as high-quality print-ready PDF or shareable PNG.', icon: Printer },
    { title: '10 Indian Languages', desc: 'Create biodata in Hindi, Marathi, Tamil, Telugu, Urdu, and more.', icon: Globe },
    { title: 'Private & Secure', desc: 'Your personal data is encrypted and automatically deleted after 48 hours.', icon: ShieldCheck },
  ];

  const steps = [
    { step: '1', title: 'Select Language', desc: 'Choose from English or 9 Indian regional languages.' },
    { step: '2', title: 'Choose Template', desc: 'Pick from 120+ free simple or premium regional layouts.' },
    { step: '3', title: 'Fill Details', desc: 'Enter bio, education, family details, and crop a photo.' },
    { step: '4', title: 'Live Preview', desc: 'See a live, formatted A4 preview of your document.' },
    { step: '5', title: 'Download or Upgrade', desc: 'Download free watermarked PDF/Image or unlock premium designs.' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50 flex flex-col justify-between overflow-x-hidden">
      {/* Navbar */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 animate-pulse">
              B
            </span>
            <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Free Biodata Maker
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/redownload"
              className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Find Order
            </Link>
            <Link
              href="/languages"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer"
            >
              Create Free Biodata
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 px-4 max-w-7xl mx-auto text-center space-y-8">
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            100% Secure & Private
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-950 tracking-tight leading-none">
            Free Biodata Maker <br />
            <span className="bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">For Marriage</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create your marriage biodata in your own language. Simple templates are free. Premium designs are available after preview.
          </p>
        </div>

        {/* Hero CTA */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => router.push('/languages')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-pink-600 hover:shadow-indigo-300/40 text-white font-bold px-8 py-4.5 rounded-xl shadow-lg hover:scale-103 active:scale-98 transition-all duration-300 cursor-pointer text-base"
          >
            Create Free Biodata
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => router.push('/templates')}
            className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-gray-200 hover:border-indigo-600 bg-white hover:bg-indigo-50/20 text-gray-700 hover:text-indigo-700 font-bold px-8 py-4.5 rounded-xl hover:scale-103 active:scale-98 transition-all duration-300 cursor-pointer text-base"
          >
            View Templates
          </button>
        </div>

        {/* Pricing tag note */}
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          “Simple templates are free. Premium designs unlock after preview.”
        </p>
      </section>

      {/* Trust Cards Section */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-950">Why Choose Us?</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Our editor is built with the best modern practices to save your time and keep your data safe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trustCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-950 text-base">{card.title}</h3>
                  <p className="text-xs text-gray-500 leading-normal">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-950">Free vs Premium Features</h2>
          <p className="text-gray-500 text-sm">
            Choose a simple layout for free, or unlock premium designs only after checking your live preview.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-gray-700 uppercase font-bold text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Features</th>
                <th className="px-6 py-4 text-emerald-600">Free Templates</th>
                <th className="px-6 py-4 text-indigo-600">Premium Templates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-950">Cultural Design Themes</td>
                <td className="px-6 py-4">Simple Layouts</td>
                <td className="px-6 py-4 font-bold text-indigo-600 flex items-center gap-1.5"><Check className="h-4.5 w-4.5" /> 120+ Regional Styles</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-950">Watermark Status</td>
                <td className="px-6 py-4 text-amber-600 font-semibold">Includes Branding Watermark</td>
                <td className="px-6 py-4 text-emerald-600 font-bold flex items-center gap-1.5"><Check className="h-4.5 w-4.5" /> Fully Watermark Free</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-950">Editable Word DOCX</td>
                <td className="px-6 py-4 text-rose-600 flex items-center gap-1.5"><X className="h-4.5 w-4.5" /> Locked</td>
                <td className="px-6 py-4 text-emerald-600 font-bold flex items-center gap-1.5"><Check className="h-4.5 w-4.5" /> Yes (Included in Premium)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-950">PDF & Image Downloads</td>
                <td className="px-6 py-4 text-emerald-600 font-bold flex items-center gap-1.5"><Check className="h-4.5 w-4.5" /> Yes (Watermarked)</td>
                <td className="px-6 py-4 text-emerald-600 font-bold flex items-center gap-1.5"><Check className="h-4.5 w-4.5" /> Yes (Clean High-Res)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900 text-white py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold">How It Works</h2>
            <p className="text-slate-400 text-sm">Create your biodata in 5 simple steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step) => (
              <div
                key={step.step}
                className="bg-slate-950 border border-slate-800/80 p-6 rounded-2xl relative space-y-4 hover:border-indigo-500/50 transition-colors"
              >
                <span className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </span>
                <h3 className="font-bold text-white text-base">{step.title}</h3>
                <p className="text-2xs text-slate-400 leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto">
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Languages</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/marathi-biodata-maker" className="hover:underline">Marathi Biodata</Link></li>
                <li><Link href="/hindi-biodata-maker" className="hover:underline">Hindi Biodata</Link></li>
                <li><Link href="/english-biodata-maker" className="hover:underline">English Biodata</Link></li>
                <li><Link href="/gujarati-biodata-maker" className="hover:underline">Gujarati Biodata</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Templates</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/marriage-biodata-format-for-boy" className="hover:underline">Biodata for Boy</Link></li>
                <li><Link href="/marriage-biodata-format-for-girl" className="hover:underline">Biodata for Girl</Link></li>
                <li><Link href="/hindu-marriage-biodata-format" className="hover:underline">Hindu Biodata Format</Link></li>
                <li><Link href="/muslim-marriage-biodata-format" className="hover:underline">Muslim Biodata Format</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Features</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/biodata-format-with-photo" className="hover:underline">Format with Photo</Link></li>
                <li><Link href="/biodata-format-without-photo" className="hover:underline">Format without Photo</Link></li>
                <li><Link href="/editable-marriage-biodata-word-format" className="hover:underline">Editable Word format</Link></li>
                <li><Link href="/marriage-biodata-pdf-download" className="hover:underline">PDF download</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Legal & Support</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
                <li><Link href="/refund" className="hover:underline">Refund Policy</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-50 p-4 border border-slate-100 rounded-2xl text-[10px] text-gray-400">
            <strong>Disclaimer:</strong> This website helps users create formatted biodata documents. It is not a matchmaking, matrimonial, or dating service.
          </div>

          <p>© 2026 Free Biodata Maker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
