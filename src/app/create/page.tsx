'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Globe, ArrowLeft, ArrowRight, Save, Image as ImageIcon, Sparkles, AlertCircle, Trash2, CheckCircle, Check, Loader2, Link } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode } from '@/i18n/config';
import { BIODATA_FORM_SCHEMA } from '@/i18n/schema';
import { loadDraftLocal, saveDraftLocal, syncDraftToServer, getDraftToken, setDraftToken } from '@/lib/draft';
import { getLabel } from '@/lib/utils';

function FormBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load from query search params
  const draftTokenQuery = searchParams.get('draft');

  // State
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [labelMode, setLabelMode] = useState<string>('both');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('en-simple-clean-free');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [customTemplateUrl, setCustomTemplateUrl] = useState<string>('');
  const [hasPhoto, setHasPhoto] = useState<boolean>(true);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('None');
  const [dict, setDict] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [shareLink, setShareLink] = useState<string>('');

  // Photo offset state for custom positioning/scale
  const [photoScale, setPhotoScale] = useState<number>(1);
  const [photoX, setPhotoX] = useState<number>(0);
  const [photoY, setPhotoY] = useState<number>(0);

  // Hidden optional fields toggle list (we can choose to hide/show fields)
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({});

  // Symbols list
  const symbols = [
    { name: 'None', char: '' },
    { name: 'Ganpati', char: ' Ganesh' },
    { name: 'Om', char: 'ॐ Om' },
    { name: 'Kalash', char: '🏺 Kalash' },
    { name: 'Lotus', char: '🪷 Lotus' },
    { name: 'Crescent', char: '🌙 Crescent' },
    { name: 'Khanda', char: '☬ Khanda' },
    { name: 'Cross', char: '✝ Cross' },
    { name: 'Jain Symbol', char: '✋ Jain' },
    { name: 'Floral only', char: '🌸 Floral' },
  ];

  // 1. Initial Load: Local Draft, Query Draft, or default redirect
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      let localState = loadDraftLocal();

      // Check if we are continuing a draft from a link token
      if (draftTokenQuery) {
        try {
          const res = await fetch(`/api/drafts?token=${draftTokenQuery}`);
          if (res.ok) {
            const serverDraft = await res.json();
            localState = {
              language: serverDraft.selectedLanguage,
              templateId: serverDraft.selectedTemplateSlug || serverDraft.selectedTemplateId,
              formData: serverDraft.formData,
              photoUrl: serverDraft.photoUrl || undefined,
            };
            setDraftToken(draftTokenQuery);
            saveDraftLocal(localState);
          }
        } catch (err) {
          console.error('Failed to load server draft:', err);
        }
      }

      if (localState) {
        setSelectedLang((localState.language as LanguageCode) || 'en');
        setLabelMode(localState.labelMode || 'both');
        setSelectedTemplateId(localState.templateId || `${localState.language}-simple-clean-free`);
        setFormData(localState.formData || {});
        setPhotoUrl(localState.photoUrl || '');
        setCustomTemplateUrl(localState.customTemplateUrl || '');
        if (localState.formData?.hasPhoto) {
          setHasPhoto(localState.formData.hasPhoto === 'true');
        } else {
          setHasPhoto(true);
        }
        if (localState.formData?.selectedSymbol) {
          setSelectedSymbol(localState.formData.selectedSymbol);
        }
        if (localState.formData?.photoScale) {
          setPhotoScale(Number(localState.formData.photoScale) || 1);
        }
        if (localState.formData?.photoX) {
          setPhotoX(Number(localState.formData.photoX) || 0);
        }
        if (localState.formData?.photoY) {
          setPhotoY(Number(localState.formData.photoY) || 0);
        }
      } else {
        // Redirect back to selector if no draft config exists
        router.replace('/languages');
        return;
      }

      // Load dictionary
      const currentLang = localState?.language || 'en';
      await loadTranslations(currentLang);
      setIsLoading(false);
    }
    init();
  }, [draftTokenQuery]);

  // Load translations based on lang code
  const loadTranslations = async (lang: string) => {
    try {
      const res = await fetch(`/api/translations?lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        setDict(data);
      }
    } catch (err) {
      console.error('Failed to fetch translations:', err);
    }
  };

  // 2. Auto-save in localStorage when formData changes
  useEffect(() => {
    if (isLoading) return;
    const state = {
      language: selectedLang,
      templateId: selectedTemplateId,
      labelMode,
      formData: {
        ...formData,
        selectedSymbol,
        hasPhoto: String(hasPhoto),
        photoScale: String(photoScale),
        photoX: String(photoX),
        photoY: String(photoY),
      },
      photoUrl,
      customTemplateUrl,
    };
    saveDraftLocal(state);
  }, [formData, photoUrl, selectedLang, selectedTemplateId, selectedSymbol, photoScale, photoX, photoY, isLoading, labelMode, customTemplateUrl]);

  // Update specific fields
  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Upload photo handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    setSaveStatus('Uploading photo...');

    const fd = new FormData();
    fd.append('photo', file);

    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to upload photo');
        return;
      }

      const data = await res.json();
      setPhotoUrl(data.url);
      setSaveStatus('Photo uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Error uploading photo');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const handleCustomTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    setSaveStatus('Uploading background image...');

    const fd = new FormData();
    fd.append('photo', file);

    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to upload background image');
        return;
      }

      const data = await res.json();
      setCustomTemplateUrl(data.url);
      setSaveStatus('Background uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Error uploading background image');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  // Remote save draft (sync to database)
  const handleSyncDraft = async () => {
    setIsSaving(true);
    setSaveStatus('Saving draft to server...');
    try {
      const token = await syncDraftToServer({
        language: selectedLang,
        templateId: selectedTemplateId,
        labelMode,
        formData: {
          ...formData,
          selectedSymbol,
          hasPhoto: String(hasPhoto),
          photoScale: String(photoScale),
          photoX: String(photoX),
          photoY: String(photoY),
        },
        photoUrl,
        customTemplateUrl,
      });
      const url = `${window.location.origin}/create?draft=${token}`;
      setShareLink(url);
      setSaveStatus('Draft saved successfully!');
    } catch (err) {
      console.error(err);
      setSaveStatus('Failed to save draft.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Navigation handlers
  const handleNext = async () => {
    // Validate required fields on current step before moving
    const currentSection = BIODATA_FORM_SCHEMA[currentStep];
    let hasError = false;

    currentSection.fields.forEach((f) => {
      if (f.required && !formData[f.id]) {
        hasError = true;
      }
    });

    if (hasError) {
      alert('Please fill in all required fields.');
      return;
    }

    // Save draft online on step progression
    try {
      await syncDraftToServer({
        language: selectedLang,
        templateId: selectedTemplateId,
        labelMode,
        formData: {
          ...formData,
          selectedSymbol,
          hasPhoto: String(hasPhoto),
          photoScale: String(photoScale),
          photoX: String(photoX),
          photoY: String(photoY),
        },
        photoUrl,
        customTemplateUrl,
      });
    } catch (err) {
      console.warn('Silent auto-sync failed:', err);
    }

    if (currentStep < BIODATA_FORM_SCHEMA.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Final submission -> Go to preview
      router.push('/preview');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    } else {
      router.push(`/templates?lang=${selectedLang}`);
    }
  };

  if (isLoading || !dict.ui) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Loading form builder...</p>
        </div>
      </div>
    );
  }

  const sectionsCount = BIODATA_FORM_SCHEMA.length;
  const currentSection = BIODATA_FORM_SCHEMA[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / sectionsCount) * 100);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            {dict.ui.back || 'Back'}
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-md hidden md:inline">
              Template: {selectedTemplateId}
            </span>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg text-xs">
              <Globe className="h-3 w-3 text-gray-500" />
              <select
                value={selectedLang}
                onChange={async (e) => {
                  const val = e.target.value as LanguageCode;
                  setSelectedLang(val);
                  await loadTranslations(val);
                }}
                className="bg-transparent border-0 outline-hidden font-medium text-gray-700 focus:ring-0 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSyncDraft}
              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3 py-2 rounded-lg cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save Link
            </button>
          </div>
        </div>
      </header>

      {/* Main Form container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        {/* Progress header */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>Step {currentStep + 1} of {sectionsCount}: {dict[currentSection.titleKey] || currentSection.titleKey}</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-600 to-pink-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Share draft link alert */}
        {shareLink && (
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-3">
              <Link className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-indigo-950 text-sm">Draft link generated!</h4>
                <p className="text-xs text-indigo-700 mt-1">
                  Save this URL. You can use it to resume filling your details anytime or from another device.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="bg-white border border-indigo-200 px-3 py-1.5 rounded-lg text-xs text-gray-600 focus:ring-1 focus:ring-indigo-500 outline-hidden w-full sm:max-w-xs"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert('Draft link copied to clipboard!');
                }}
                className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Main form card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 space-y-8">
          <h2 className="text-2xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">
            {dict[currentSection.titleKey] || currentSection.titleKey}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {currentSection.fields.map((field) => {
              const label = getLabel(field.dictKey, dict, labelMode);
              const isRequired = field.required;

              return (
                <div
                  key={field.id}
                  className={`${field.type === 'textarea' ? 'sm:col-span-2' : 'sm:col-span-1'}`}
                >
                  <label htmlFor={field.id} className="block text-sm font-semibold text-gray-700 mb-1.5 flex justify-between">
                    <span>
                      {label} {isRequired && <span className="text-red-500">*</span>}
                    </span>
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      id={field.id}
                      name={field.id}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={isRequired}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden text-gray-900 transition-all text-sm"
                      placeholder={`Enter ${label}`}
                    />
                  )}

                  {field.type === 'date' && (
                    <input
                      type="date"
                      id={field.id}
                      name={field.id}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={isRequired}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden text-gray-900 transition-all text-sm"
                    />
                  )}

                  {field.type === 'time' && (
                    <input
                      type="time"
                      id={field.id}
                      name={field.id}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={isRequired}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden text-gray-900 transition-all text-sm"
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      id={field.id}
                      name={field.id}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={isRequired}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden text-gray-900 transition-all text-sm bg-white cursor-pointer"
                    >
                      <option value="">-- Select --</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      id={field.id}
                      name={field.id}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      rows={3}
                      required={isRequired}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden text-gray-900 transition-all text-sm"
                      placeholder={`Enter details about ${label}`}
                    />
                  )}
                </div>
              );
            })}

            {/* Custom Background Upload for Custom Template */}
            {selectedTemplateId === 'custom-template-paid' && currentStep === 0 && (
              <div className="sm:col-span-2 border-t border-gray-100 pt-6 mt-2 space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 text-indigo-600">
                  <Sparkles className="h-4 w-4" />
                  Custom Background Template (A4 Portrait)
                </h3>
                <p className="text-xs text-gray-500">
                  Upload an A4 portrait background image (JPG/PNG). Your biodata text will be overlaid on top of this background.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-indigo-50/35 border border-indigo-100 p-6 rounded-2xl">
                  <div className="h-28 w-20 bg-gray-100 border border-gray-200 overflow-hidden relative flex items-center justify-center shrink-0 shadow-inner rounded-md">
                    {customTemplateUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={customTemplateUrl}
                          alt="Custom Background"
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => setCustomTemplateUrl('')}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold text-center p-2">A4 Preview</span>
                    )}
                  </div>
                  <div className="space-y-3 flex-1 w-full text-center sm:text-left">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomTemplateUpload}
                      className="hidden"
                      id="custom-template-upload-input"
                    />
                    <label
                      htmlFor="custom-template-upload-input"
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-md"
                    >
                      Choose Background Image
                    </label>

                    <div className="space-y-2 pt-2 text-left">
                      <label className="block text-[11px] font-semibold text-gray-600">Overlay Layout Style:</label>
                      <select
                        value={formData.customTemplateLayout || 'center'}
                        onChange={(e) => handleInputChange('customTemplateLayout', e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs"
                      >
                        <option value="center">Center Clean (Classic overlay)</option>
                        <option value="two-column">Left details + Right photo</option>
                        <option value="text-only">Full text (No photo)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Field: Photo Layout Toggle & Upload in Step 1 */}
            {currentStep === 0 && (
              <div className="sm:col-span-2 border-t border-gray-100 pt-6 mt-2 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-indigo-600" />
                    Profile Photo Layout
                  </h3>
                  
                  {/* Toggle */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl self-start">
                    <button
                      type="button"
                      onClick={() => {
                        setHasPhoto(true);
                        handleInputChange('hasPhoto', 'true');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        hasPhoto
                          ? 'bg-indigo-600 text-white shadow-xs font-bold'
                          : 'text-gray-500 hover:text-indigo-600'
                      }`}
                    >
                      With Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHasPhoto(false);
                        handleInputChange('hasPhoto', 'false');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        !hasPhoto
                          ? 'bg-indigo-600 text-white shadow-xs font-bold'
                          : 'text-gray-500 hover:text-indigo-600'
                      }`}
                    >
                      No Photo
                    </button>
                  </div>
                </div>

                {hasPhoto && (
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50/50 border border-slate-100 p-6 rounded-2xl animate-fadeIn">
                    {/* Photo Preview with position adjust */}
                    <div className="h-28 w-28 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden relative flex items-center justify-center shrink-0 shadow-inner">
                      {photoUrl ? (
                        <div className="relative w-full h-full">
                          <img
                            src={photoUrl}
                            alt="Uploaded Profile"
                            className="object-cover transition-transform"
                            style={{
                              transform: `scale(${photoScale}) translate(${photoX}px, ${photoY}px)`,
                              width: '100%',
                              height: '100%',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setPhotoUrl('')}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-300" />
                      )}
                    </div>

                    <div className="space-y-3 flex-1 w-full text-center sm:text-left">
                      <p className="text-xs text-gray-500">
                        Upload a JPEG or PNG profile picture. Max size: 5MB.
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload-input"
                      />
                      <label
                        htmlFor="photo-upload-input"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-md shadow-indigo-100 hover:shadow-indigo-200"
                      >
                        Choose Photo
                      </label>

                      {/* Scale and crop sliders */}
                      {photoUrl && (
                        <div className="space-y-2 pt-2 text-left">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600">
                            <span>Scale Photo:</span>
                            <span>{Math.round(photoScale * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.05"
                            value={photoScale}
                            onChange={(e) => setPhotoScale(parseFloat(e.target.value))}
                            className="w-full accent-indigo-600 h-1.5 rounded-full"
                          />

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <span className="text-[10px] text-gray-500 block">Move Horizontal:</span>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                value={photoX}
                                onChange={(e) => setPhotoX(parseInt(e.target.value))}
                                className="w-full accent-indigo-600 h-1 rounded-full"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 block">Move Vertical:</span>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                value={photoY}
                                onChange={(e) => setPhotoY(parseInt(e.target.value))}
                                className="w-full accent-indigo-600 h-1 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Custom Field: Symbol Selector on the final step */}
            {currentStep === sectionsCount - 1 && (
              <div className="sm:col-span-2 border-t border-gray-100 pt-6 mt-2 space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  Select Religious/Cultural Symbol (Optional)
                </h3>
                <p className="text-xs text-gray-500">
                  Select a symbol to display at the top center of your biodata document.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                  {symbols.map((sym) => {
                    const isSelected = selectedSymbol === sym.name;
                    return (
                      <button
                        key={sym.name}
                        type="button"
                        onClick={() => setSelectedSymbol(sym.name)}
                        className={`px-3 py-3 rounded-xl border text-center text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-800'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {sym.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Privacy notice banner for fields (contacts / photo) */}
          {(currentStep === 0 || currentStep === 4) && (
            <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-800 text-xs">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Privacy Notice:</span> Your personal biodata fields, contact details, and photo are processed and stored securely. We do not share your details publicly or with third-parties. Your draft automatically expires and is deleted from our servers after 48 hours.
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 active:scale-98 transition-all duration-200 cursor-pointer text-sm"
            >
              {dict.ui.back || 'Back'}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-600 to-pink-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-indigo-300/40 hover:scale-101 active:scale-98 transition-all duration-200 cursor-pointer text-sm"
            >
              {currentStep === sectionsCount - 1 ? (
                <>
                  Preview Biodata
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  {dict.ui.next || 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Save Status alert */}
        {saveStatus && (
          <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 z-50 animate-bounce">
            <Loader2 className="h-4.5 w-4.5 animate-spin text-indigo-400" />
            <span>{saveStatus}</span>
          </div>
        )}
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

export default function FormBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Loading form builder...</p>
        </div>
      </div>
    }>
      <FormBuilderContent />
    </Suspense>
  );
}
