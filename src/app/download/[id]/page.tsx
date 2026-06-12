import React from 'react';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import DownloadClient from './DownloadClient';
import { getLanguageConfig, LanguageCode } from '@/i18n/config';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DownloadPage({ params }: PageProps) {
  const { id } = await params;

  let draftToken = '';
  let templateId = '';
  let orderId: string | null = null;
  let orderNumber: string | null = null;
  let isPaid = false;

  try {
    if (id.startsWith('draft-')) {
      // Free template route
      draftToken = id.replace('draft-', '');
      const draft = await prisma.userDraft.findUnique({
        where: { draftToken },
      });

      if (!draft) {
        notFound();
      }

      const template = await prisma.template.findUnique({
        where: { slug: draft.selectedTemplateSlug },
      });

      if (!template || !template.isFree) {
        // Prevent unpaid premium downloads!
        redirect('/preview');
      }

      templateId = template.id;
    } else {
      // Paid order route
      const order = await prisma.order.findUnique({
        where: { id },
        include: { template: true },
      });

      if (!order) {
        notFound();
      }

      if (order.status !== 'PAID') {
        // Unpaid premium download prevention
        redirect('/preview');
      }

      const draft = await prisma.userDraft.findUnique({
        where: { draftToken: order.draftToken },
      });

      if (!draft) {
        notFound();
      }

      draftToken = order.draftToken;
      templateId = order.templateSlug;
      orderId = order.id;
      orderNumber = order.orderNumber;
      isPaid = true;
    }

    // Load templates & draft
    const draft = await prisma.userDraft.findUnique({
      where: { draftToken },
    });

    const template = await prisma.template.findUnique({
      where: { slug: templateId },
    });

    if (!draft || !template) {
      notFound();
    }

    const serializedTemplate = {
      ...template,
      languageSupport: template.languageCode === 'all' ? ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'bn', 'pa', 'ur'] : [template.languageCode],
      styleConfig: typeof template.styleConfig === 'string' ? JSON.parse(template.styleConfig) : template.styleConfig,
      supportedExports: Array.isArray(template.supportedExports) ? template.supportedExports : JSON.parse(template.supportedExports as string),
    };

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <DownloadClient
          draftToken={draftToken}
          formData={draft.formData as Record<string, any>}
          photoUrl={draft.photoUrl || undefined}
          customTemplateUrl={draft.customTemplateUrl || undefined}
          template={serializedTemplate}
          langCode={draft.selectedLanguage as LanguageCode}
          labelMode={draft.labelMode}
          orderId={orderId}
          orderNumber={orderNumber}
          isPaid={isPaid}
        />
      </div>
    );
  } catch (error: any) {
    console.error('Error loading download page:', error);
    notFound();
  }
}
