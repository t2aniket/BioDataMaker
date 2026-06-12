import React from 'react';
import prisma from '@/lib/prisma';
import TemplatesList from './TemplatesList';
import { LanguageCode } from '@/i18n/config';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TemplatesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const lang = (resolvedSearchParams.lang as LanguageCode) || 'en';

  // Fetch templates from DB
  const templates = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { priceInPaise: 'asc' },
  });

  // Convert styleConfig and supportedExports to standard objects if they are JSON
  const serializedTemplates = templates.map((t: any) => ({
    ...t,
    languageSupport: Array.isArray(t.languageSupport) ? t.languageSupport : JSON.parse(t.languageSupport as string),
    styleConfig: typeof t.styleConfig === 'string' ? JSON.parse(t.styleConfig) : t.styleConfig,
    supportedExports: Array.isArray(t.supportedExports) ? t.supportedExports : JSON.parse(t.supportedExports as string),
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50 flex flex-col justify-between">
      <TemplatesList initialTemplates={serializedTemplates} langCode={lang} />
    </div>
  );
}
