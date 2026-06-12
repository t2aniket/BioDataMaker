'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, ArrowLeft, Download, ShieldCheck, CreditCard, Sparkles, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '@/i18n/config';
import { loadDraftLocal, saveDraftLocal, getDraftToken } from '@/lib/draft';
import { BiodataTemplate } from '@/components/BiodataTemplate';

interface Template {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceInPaise: number;
  isFree: boolean;
  previewImage: string;
  styleConfig: any;
  supportedExports: string[];
  languageSupport: string[];
}

export default function PreviewPage() {
  const router = useRouter();

  // State
  const [draftState, setDraftState] = useState<any>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [dict, setDict] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [templatesList, setTemplatesList] = useState<Template[]>([]);

  // Customer Contact for checkout
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // Loaded successfully
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const localState = loadDraftLocal();

      if (!localState || !localState.templateId) {
        router.replace('/languages');
        return;
      }

      setDraftState(localState);

      // Fetch template
      try {
        const tRes = await fetch(`/api/templates/${localState.templateId}`);
        if (tRes.ok) {
          const tData = await tRes.json();
          setTemplate(tData);
        }

        // Fetch all templates to allow template switching directly in preview
        const allRes = await fetch('/api/templates');
        if (allRes.ok) {
          const allData = await allRes.json();
          setTemplatesList(allData);
        }
      } catch (err) {
        console.error('Error fetching template details:', err);
      }

      // Fetch translations
      try {
        const trRes = await fetch(`/api/translations?lang=${localState.language}`);
        if (trRes.ok) {
          const trData = await trRes.json();
          setDict(trData);
        }
      } catch (err) {
        console.error('Error loading translations:', err);
      }

      setIsLoading(false);
    }
    loadData();
  }, []);

  // Handle template selection change in preview
  const handleTemplateChange = async (templateId: string) => {
    if (!draftState) return;
    setIsLoading(true);
    const updatedState = { ...draftState, templateId };
    setDraftState(updatedState);
    saveDraftLocal(updatedState);

    try {
      const tRes = await fetch(`/api/templates/${templateId}`);
      if (tRes.ok) {
        const tData = await tRes.json();
        setTemplate(tData);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  // Handle language selection change in preview
  const handleLangChange = async (lang: LanguageCode) => {
    if (!draftState) return;
    setIsLoading(true);
    const updatedState = { ...draftState, language: lang };
    setDraftState(updatedState);
    saveDraftLocal(updatedState);

    try {
      const trRes = await fetch(`/api/translations?lang=${lang}`);
      if (trRes.ok) {
        const trData = await trRes.json();
        setDict(trData);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  // Helper function to load Razorpay Checkout SDK script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle payment processing
  const handlePayment = async () => {
    if (!template || !draftState) return;

    setIsProcessingPayment(true);

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK. Check your internet connection.');
        setIsProcessingPayment(false);
        return;
      }

      // 2. Get draftToken from local storage
      const token = getDraftToken();
      if (!token) {
        alert('Draft has not been saved. Please return to the form and save your draft first.');
        setIsProcessingPayment(false);
        return;
      }

      // 3. Create payment order on backend
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          draftToken: token,
          customerEmail,
          customerPhone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to create payment order');
        setIsProcessingPayment(false);
        return;
      }

      const orderData = await res.json();

      // 4. Open Razorpay checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Free Biodata Maker',
        description: `Premium Template: ${template.name}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          setIsProcessingPayment(true);
          // 5. Verify signature on backend
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              const verifyData = await verifyRes.json();
              // Redirect to download page
              router.push(`/download/${verifyData.orderId}`);
            } else {
              const verifyData = await verifyRes.json();
              alert(verifyData.error || 'Payment verification failed');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Error verifying payment status');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          email: customerEmail || '',
          contact: customerPhone || '',
        },
        theme: {
          color: '#4F46E5', // Indigo color matching our branding
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Error initiating checkout flow.');
      setIsProcessingPayment(false);
    }
  };

  // Handle direct free download
  const handleFreeDownload = () => {
    const token = getDraftToken();
    if (!token) {
      alert('Draft has not been saved locally. Returning to form...');
      router.push('/create');
      return;
    }
    // Go to download page using draftToken directly
    router.push(`/download/draft-${token}`);
  };

  if (isLoading || !template || !dict.ui) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Rendering biodata preview...</p>
        </div>
      </div>
    );
  }

  const isFree = template.isFree;
  const priceText = isFree ? 'Free' : `₹${template.priceInPaise / 100}`;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/create')}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Edit Fields
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-md hidden md:inline">
              Selected: {template.name}
            </span>

            {/* Language Selection */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-xs">
              <Globe className="h-4 w-4 text-gray-500" />
              <select
                value={draftState?.language || 'en'}
                onChange={(e) => handleLangChange(e.target.value as LanguageCode)}
                className="bg-transparent border-0 outline-hidden font-medium text-gray-700 focus:ring-0 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main split preview section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Left: Design Configurator bar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Change Template
              </h3>
              <p className="text-2xs text-gray-400 mb-4">
                Switch design instantly without losing your entered form data.
              </p>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {templatesList
                  .filter((t) => t.languageSupport.includes(draftState.language))
                  .map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTemplateChange(t.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        template.id === t.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                      }`}
                    >
                      <span className="truncate mr-2">{t.name}</span>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {t.isFree ? 'Free' : `₹${t.priceInPaise / 100}`}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Quick tips panel */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Info className="h-3.5 w-3.5 text-slate-400" /> Quick Tip
              </span>
              <p className="text-[11px] text-slate-600 leading-normal">
                To download without watermark, choose a free template or purchase a premium template from ₹10.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Template Visual rendering */}
        <div className="lg:col-span-5 flex justify-center items-start overflow-x-auto p-4 bg-slate-800 rounded-3xl shadow-inner max-h-[850px] overflow-y-auto">
          {/* We scale the A4 frame down for visual presentation on page */}
          <div className="origin-top scale-75 sm:scale-90 md:scale-95 lg:scale-75 xl:scale-85 shadow-2xl">
            <BiodataTemplate
              formData={draftState.formData || {}}
              templateStyle={template.styleConfig || {}}
              langCode={draftState.language}
              dict={dict}
              photoUrl={draftState.photoUrl}
              watermark={!isFree} // Watermark for previewing paid template
            />
          </div>
        </div>

        {/* Right: Checkout drawer / download locks */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-2xs font-bold text-gray-400 uppercase tracking-widest">
                Template Pricing
              </span>
              <h2 className="text-3xl font-extrabold text-gray-950 mt-1 flex items-baseline justify-between">
                <span>{template.name}</span>
                <span className="text-indigo-600">{priceText}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isFree
                  ? 'Simple, clean designs are free forever.'
                  : `Classic premium layout for one-time charge of just ₹${template.priceInPaise / 100}.`}
              </p>
            </div>

            {/* Pricing details text */}
            <p className="text-xs font-medium text-gray-500">
              “Simple biodata templates are free forever. Premium templates start from just ₹10.”
            </p>

            {/* If paid -> Show customer fields for order */}
            {!isFree && (
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="customer-email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="customer-email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
                  />
                  <p className="text-[10px] text-gray-400">
                    Used to send you the direct download link.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="customer-phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="customer-phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
                  />
                </div>
              </div>
            )}

            {/* Purchase / download CTA */}
            {isFree ? (
              <button
                onClick={handleFreeDownload}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-100 hover:shadow-emerald-200 hover:scale-101 active:scale-99 transition-all duration-300 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="h-5 w-5" />
                Download Free Biodata
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-linear-to-r from-indigo-600 to-pink-600 hover:shadow-indigo-300/40 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:scale-101 active:scale-99 disabled:opacity-50 transition-all duration-300 text-center flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pay {priceText} & Download
                    </>
                  )}
                </button>
                <div className="flex justify-center items-center gap-1.5 text-2xs text-gray-400 font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Secure Payment via Razorpay
                </div>
              </div>
            )}
          </div>
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
