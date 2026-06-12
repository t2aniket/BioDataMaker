import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsAndConditionsPage() {
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

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <FileText className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-extrabold text-gray-950">Terms and Conditions</h1>
          </div>

          <p className="text-sm text-gray-400">Last updated: June 13, 2026</p>

          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <h3 className="text-base font-bold text-gray-950 pt-2">1. Usage Agreement</h3>
            <p>
              By accessing and using Free Biodata Maker, you agree to these Terms and Conditions. This website is a tool to help users compile personal information into a document template.
            </p>

            <h3 className="text-base font-bold text-gray-950 pt-2">2. Matchmaking Disclaimer</h3>
            <p className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-500 italic">
              "This website helps users create biodata documents. It is not a matchmaking or dating service." We do not provide marriage verification, matchmaking, or partner recommendations.
            </p>

            <h3 className="text-base font-bold text-gray-950 pt-2">3. User Responsibility</h3>
            <p>
              You are responsible for the accuracy of all information entered. We do not verify credentials, height, age, income, or family backgrounds. Do not upload copyrighted photos.
            </p>

            <h3 className="text-base font-bold text-gray-950 pt-2">4. Payment & License</h3>
            <p>
              Premium templates require a one-time payment of ₹10, ₹20, or ₹30. This payment grants you a license to download, print, and share your generated biodata document. Unauthorised reproduction of template graphics is prohibited.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-gray-100 text-center text-xs text-gray-500 bg-white">
        <p>© 2026 Free Biodata Maker. All rights reserved.</p>
      </footer>
    </div>
  );
}
