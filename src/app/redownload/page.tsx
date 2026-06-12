'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function RedownloadPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/payments/search?query=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.orderId) {
          router.push(`/download/${data.orderId}`);
        } else {
          setErrorMsg('Order not found or unpaid. Please verify your reference number.');
        }
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to search order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to connect to server. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </button>
          
          <div className="flex items-center gap-2">
            <span className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              B
            </span>
            <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Biodata Maker
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white/80 p-8 sm:p-10 rounded-3xl shadow-xl shadow-indigo-100/50 border border-white">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Re-download Paid Templates
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Find Your <span className="bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Order</span>
            </h1>
            <p className="text-sm text-gray-600">
              Enter your Order Number (e.g. <code>ORD-...</code>) or Razorpay Payment ID to retrieve your premium, watermark-free biodata files.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="search-input" className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Order Number or Payment ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search-input"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. ORD-171822..."
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden text-gray-900 text-sm transition-all"
                />
                <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex gap-3 text-rose-800 text-xs">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                <div>{errorMsg}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-indigo-600 to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-300/40 hover:scale-101 active:scale-99 disabled:opacity-50 transition-all duration-300 text-center flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Searching Order...
                </>
              ) : (
                <>
                  <Search className="h-4.5 w-4.5" />
                  Find & Download
                </>
              )}
            </button>
          </form>
        </div>
      </main>

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
