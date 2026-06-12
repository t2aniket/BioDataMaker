import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    { name: 'Simple templates', price: 'Free', desc: 'Free forever simple layouts.' },
    { name: 'Classic / Elegant', price: '₹10', desc: 'Professional gold & floral borders.' },
    { name: 'Traditional / Regional', price: '₹20', desc: 'Regional design packs (Marathi Paithani, Patola, etc.).' },
    { name: 'Royal / Premium', price: '₹30', desc: 'Ornate gold frame with photos and Word export.' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50 flex flex-col justify-between">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              B
            </span>
            <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Biodata Maker
            </span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Transparent Pricing
          </span>
          <h1 className="text-4xl font-extrabold text-gray-950">Simple Templates are Free Forever</h1>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            “Simple biodata templates are free forever. Premium templates start from just ₹10.”
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          {tiers.map((t) => (
            <div key={t.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl flex flex-col justify-between gap-4 hover:scale-102 transition-transform">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">{t.name}</h3>
                <p className="text-4xl font-black text-indigo-600">{t.price}</p>
                <p className="text-xs text-gray-500 leading-normal">{t.desc}</p>
              </div>

              <ul className="space-y-2 text-2xs text-gray-600">
                <li className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-600" /> High-res PDF</li>
                <li className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-600" /> High-res Image</li>
                <li className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-600" /> {t.price !== 'Free' ? 'Editable DOCX' : 'PDF & Image Only'}</li>
              </ul>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-6 border-t border-gray-100 text-center text-xs text-gray-500 bg-white">
        <p>© 2026 Free Biodata Maker. All rights reserved.</p>
      </footer>
    </div>
  );
}
