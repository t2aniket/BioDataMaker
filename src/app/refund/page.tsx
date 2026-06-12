import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function RefundPolicyPage() {
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
            <RefreshCw className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-extrabold text-gray-950">Refund Policy</h1>
          </div>

          <p className="text-sm text-gray-400">Last updated: June 13, 2026</p>

          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <h3 className="text-base font-bold text-gray-950 pt-2">1. Digital Purchases</h3>
            <p>
              Due to the digital nature of premium templates, downloads are generally non-refundable once the file export has been successfully generated or accessed by the customer.
            </p>

            <h3 className="text-base font-bold text-gray-950 pt-2">2. Exception for Technical Failures</h3>
            <p>
              We provide full support and refund/cancellation options in cases of duplicate payments, technical server errors, or if you encounter a failed download.
            </p>

            <h3 className="text-base font-bold text-gray-950 pt-2">3. How to Request Support</h3>
            <p>
              Please contact our support team at <strong>support@freebiodatamaker.com</strong> with your Order Reference Number (e.g. <code>ORD-...</code>) or payment ID. We resolve all legitimate refund queries within 24-48 business hours.
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
