'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText, Image as ImageIcon, Printer, CheckCircle, HelpCircle, Loader2 } from 'lucide-react';
import { LanguageCode } from '@/i18n/config';
import { BiodataTemplate } from '@/components/BiodataTemplate';
import html2canvas from 'html2canvas';

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
}

interface DownloadClientProps {
  draftToken: string;
  formData: Record<string, any>;
  photoUrl?: string;
  customTemplateUrl?: string;
  template: Template;
  langCode: LanguageCode;
  labelMode?: string;
  orderId: string | null;
  orderNumber: string | null;
  isPaid: boolean;
}

export default function DownloadClient({
  draftToken,
  formData,
  photoUrl,
  customTemplateUrl,
  template,
  langCode,
  labelMode = 'both',
  orderId,
  orderNumber,
  isPaid,
}: DownloadClientProps) {
  const router = useRouter();
  const [dict, setDict] = useState<any>({});
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);
  const [downloadCount, setDownloadCount] = useState<number>(0);
  const [isWordGenerating, setIsWordGenerating] = useState<boolean>(false);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const res = await fetch(`/api/translations?lang=${langCode}`);
        if (res.ok) {
          const data = await res.json();
          setDict(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadTranslations();
  }, [langCode]);

  // Log download helper
  const logDownload = async (exportType: 'PDF' | 'IMAGE' | 'DOCX') => {
    try {
      const res = await fetch('/api/export/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftToken,
          templateId: template.slug,
          orderId,
          exportType,
        }),
      });
      if (res.ok) {
        setDownloadCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Error logging download:', err);
    }
  };

  // PDF print trigger
  const handleDownloadPDF = async () => {
    await logDownload('PDF');
    window.print();
  };

  // Image PNG download using html2canvas
  const handleDownloadImage = async () => {
    setIsExportingImage(true);
    await logDownload('IMAGE');

    try {
      const element = document.getElementById('biodata-print-layout');
      if (!element) {
        alert('Layout element not found');
        setIsExportingImage(false);
        return;
      }

      // Render canvas at 2x scale for high resolution print quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${formData.fullName || 'biodata'}_marriage.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting image:', err);
      alert('Failed to generate image. Please try downloading PDF instead.');
    } finally {
      setIsExportingImage(false);
    }
  };

  // DOCX download handler
  const handleDownloadDOCX = async () => {
    setIsWordGenerating(true);
    await logDownload('DOCX');

    try {
      const queryParam = orderId ? `orderId=${orderId}` : `token=${draftToken}`;
      const url = `/api/export/docx?${queryParam}`;

      // Open download in a new tab or trigger directly
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.fullName || 'biodata'}_marriage.docx`;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Error generating Word Document');
    } finally {
      setIsWordGenerating(false);
    }
  };

  if (!dict.ui) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Preparing download options...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/create')}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Edit
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

      {/* Main Download View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Left: Downloader instructions / CTA */}
        <div className="lg:col-span-5 space-y-6 no-print">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
            {/* Status Header */}
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                {isPaid ? 'Payment Success' : 'Ready to Download'}
              </div>
              <h2 className="text-2xl font-black text-gray-950">
                {isPaid ? 'Thank you for your order!' : 'Your Biodata is Ready'}
              </h2>
              {orderNumber && (
                <p className="text-xs font-bold text-gray-400">
                  Order Reference: <span className="text-indigo-600">{orderNumber}</span>
                </p>
              )}
            </div>

            {/* Downloader Buttons */}
            <div className="space-y-4 pt-2">
              <button
                onClick={handleDownloadPDF}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:scale-101 active:scale-99 transition-all duration-300 text-center flex items-center justify-center gap-3 cursor-pointer text-sm"
              >
                <Printer className="h-5 w-5" />
                Download PDF (A4 Print-Ready)
              </button>

              <button
                onClick={handleDownloadImage}
                disabled={isExportingImage}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:scale-101 active:scale-99 transition-all duration-300 text-center flex items-center justify-center gap-3 cursor-pointer text-sm disabled:opacity-50"
              >
                {isExportingImage ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5" />
                    Download Image (For WhatsApp sharing)
                  </>
                )}
              </button>

              {isPaid && (template.supportedExports.includes('DOCX') || template.supportedExports.includes('docx')) && (
                <button
                  onClick={handleDownloadDOCX}
                  disabled={isWordGenerating}
                  className="w-full border-2 border-indigo-600 hover:bg-indigo-50 text-indigo-700 font-bold py-4 px-6 rounded-xl hover:scale-101 active:scale-99 transition-all duration-300 text-center flex items-center justify-center gap-3 cursor-pointer text-sm disabled:opacity-50"
                >
                  {isWordGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating Document...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      Download Word (Editable DOCX)
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Note */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2 text-xs text-gray-500">
              <span className="font-bold flex items-center gap-1 text-slate-700">
                <HelpCircle className="h-4 w-4 text-slate-400" /> Printing Tips
              </span>
              <ul className="list-disc pl-4 space-y-1.5 leading-normal">
                <li>
                  When printing the PDF, set <strong>Margins: None</strong> and enable <strong>Background graphics</strong> in your browser print window.
                </li>
                <li>
                  Select A4 paper size for the best fit.
                </li>
                <li>
                  The Image export is perfect for sharing on WhatsApp or Telegram directly.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Actual Render layout */}
        <div className="lg:col-span-7 flex justify-center items-start p-4 bg-slate-800 rounded-3xl shadow-inner max-h-[850px] overflow-y-auto">
          {/* Print container rendering. In browser print, everything else gets hidden, and this container is forced full A4 size */}
          <div className="origin-top scale-65 sm:scale-75 md:scale-85 lg:scale-75 xl:scale-80 shadow-2xl">
            <BiodataTemplate
              formData={formData}
              templateStyle={template.styleConfig || {}}
              langCode={langCode}
              dict={dict}
              photoUrl={photoUrl}
              customTemplateUrl={customTemplateUrl}
              watermark={!isPaid} // Watermark if unpaid (e.g. free templates have watermark)
              labelMode={labelMode}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100 text-center text-xs text-gray-500 bg-white no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4">
          <p>© 2026 Free Biodata Maker. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
            <a href="/refund" className="hover:underline">Refund Policy</a>
          </div>
        </div>
      </footer>
    </>
  );
}
