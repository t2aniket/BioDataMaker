'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an analytics or error tracking service
    console.error('Unhandled UI boundary error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 sm:p-10 text-center space-y-6 animate-fadeIn">
        <div className="h-20 w-20 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600">
          <AlertCircle className="h-10 w-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800">Something went wrong!</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            An unexpected error occurred while loading this page. Please try refreshing or return to the home page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-pink-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-indigo-200/50 hover:scale-102 active:scale-98 transition-all duration-200 text-sm cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl hover:scale-102 active:scale-98 transition-all duration-200 text-sm"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
        </div>

        <p className="text-2xs text-gray-400 font-medium">
          © 2026 Free Biodata Maker. All rights reserved.
        </p>
      </div>
    </div>
  );
}
