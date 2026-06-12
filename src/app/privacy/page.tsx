import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <Shield className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-extrabold text-gray-950">Privacy Policy</h1>
          </div>

          <p className="text-sm text-gray-400">Last updated: June 13, 2026</p>

          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p className="font-semibold text-gray-800">
              At Free Biodata Maker, we value your privacy and handle your sensitive marriage biodata details with extreme care.
            </p>

            <h3 className="text-base font-bold text-gray-950 pt-2">1. No Mandatory Login</h3>
            <p>
              We do not force you to sign up, log in, or create an account to use our marriage biodata maker. We use secure localStorage and temporary draft link tokens so that you can fill in details at your own convenience.
            </p>

            <h3 className="text-base font-bold text-gray-950 pt-2">2. Data Security & Expiry</h3>
            <p>
              Your uploaded profile pictures and filled form details are used solely to compile your document. We do not sell, share, or lease your personal details to third parties. All drafts automatically expire and are permanently deleted from our servers after 48 hours.
            </p>

            <h3 className="text-base font-bold text-gray-950 pt-2">3. Uploaded Photos</h3>
            <p>
              Uploaded profile photos are stored in private storage directories and are only accessed when generating your final PDF or image. Photos cannot be searched or indexed by search engines.
            </p>

            <h3 className="text-base font-bold text-gray-950 pt-2">4. Payment Information</h3>
            <p>
              All payments are processed securely through Razorpay. We do not store your credit card, net banking, or UPI credentials on our servers.
            </p>

            <h3 className="text-base font-bold text-gray-950 pt-2">5. Disclaimer</h3>
            <p className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-500 italic">
              "This website helps users create biodata documents. It is not a matchmaking or dating service."
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
