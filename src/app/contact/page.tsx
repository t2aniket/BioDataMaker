import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
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
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-xl space-y-8">
          <div className="border-b border-gray-100 pb-4">
            <h1 className="text-3xl font-extrabold text-gray-950">Contact & Support</h1>
            <p className="text-sm text-gray-500 mt-1">Have a question or payment issue? Reach out to us.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700">
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-3">
              <Mail className="h-6 w-6 text-indigo-600" />
              <h4 className="font-bold text-gray-950 text-sm">Email Support</h4>
              <p className="text-xs text-gray-500 break-words">support@freebiodatamaker.com</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-3">
              <Phone className="h-6 w-6 text-indigo-600" />
              <h4 className="font-bold text-gray-950 text-sm">Call/WhatsApp</h4>
              <p className="text-xs text-gray-500">+91 98765 43210</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-3">
              <MapPin className="h-6 w-6 text-indigo-600" />
              <h4 className="font-bold text-gray-950 text-sm">Headquarters</h4>
              <p className="text-xs text-gray-500">Mumbai, Maharashtra, India</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-xs text-gray-500 italic">
            <strong>Disclaimer Note:</strong> This website helps users create beautiful biodata documents. It is not a matchmaking, matrimonial, or dating service.
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-gray-100 text-center text-xs text-gray-500 bg-white">
        <p>© 2026 Free Biodata Maker. All rights reserved.</p>
      </footer>
    </div>
  );
}
