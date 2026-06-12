import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import TemplateDetailClient from './TemplateDetailClient';
import { getLanguageConfig, LanguageCode } from '@/i18n/config';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TemplateDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const lang = (resolvedSearchParams.lang as LanguageCode) || 'en';

  // Fetch template details
  const template = await prisma.template.findUnique({
    where: { id },
  });

  if (!template || !template.isActive) {
    notFound();
  }

  // Serialize the template JSON fields
  const serializedTemplate = {
    ...template,
    languageSupport: Array.isArray(template.languageSupport) ? template.languageSupport : JSON.parse(template.languageSupport as string),
    styleConfig: typeof template.styleConfig === 'string' ? JSON.parse(template.styleConfig) : template.styleConfig,
    supportedExports: Array.isArray(template.supportedExports) ? template.supportedExports : JSON.parse(template.supportedExports as string),
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50 flex flex-col justify-between">
      <TemplateDetailClient template={serializedTemplate} initialLang={lang} />
    </div>
  );
}
