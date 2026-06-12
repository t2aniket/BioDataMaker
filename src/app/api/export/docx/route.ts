import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { BIODATA_FORM_SCHEMA } from '@/i18n/schema';
import { getTranslations } from '@/i18n/config';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, BorderStyle, WidthType, HeightRule } from 'docx';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const orderId = searchParams.get('orderId');

  let draftToken = '';
  let templateId = '';
  let isAuthorized = false;

  try {
    // 1. Authorization checks
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { template: true },
      });

      if (order && order.status === 'PAID') {
        draftToken = order.draftToken;
        templateId = order.templateId;
        isAuthorized = true;
      }
    } else if (token) {
      const draft = await prisma.userDraft.findUnique({
        where: { draftToken: token },
      });

      if (draft) {
        const template = await prisma.template.findUnique({
          where: { id: draft.selectedTemplateId },
        });

        if (template && template.isFree) {
          draftToken = token;
          templateId = template.id;
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized || !draftToken) {
      return new Response('Unauthorized: Unpaid premium export or invalid token', { status: 403 });
    }

    // 2. Load draft data
    const draft = await prisma.userDraft.findUnique({
      where: { draftToken },
    });

    if (!draft) {
      return new Response('Draft not found', { status: 404 });
    }

    const formData = draft.formData as Record<string, any>;
    const lang = draft.selectedLanguage;
    const dict = await getTranslations(lang);

    // 3. Construct DOCX programmatically
    const docChildren: any[] = [];

    // Title
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: dict.ui?.submit || 'BIODATA',
            bold: true,
            size: 36, // 18 pt
            color: '1A365D', // Dark Blue
            font: 'Georgia',
          }),
        ],
      })
    );

    // Divider line
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: '---------------------------------------------------',
            color: 'D97706', // Gold / Amber
            bold: true,
          }),
        ],
      })
    );

    // Main Details Table or Sections
    for (const section of BIODATA_FORM_SCHEMA) {
      // Check if section has populated fields
      const hasFields = section.fields.some((f) => !!formData[f.id]);
      if (!hasFields) continue;

      // Section title
      docChildren.push(
        new Paragraph({
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: (dict[section.titleKey] || section.titleKey).toUpperCase(),
              bold: true,
              size: 24, // 12 pt
              color: '1A365D', // Dark Blue
              font: 'Arial',
            }),
          ],
        })
      );

      // Section fields list as a table for neat alignment
      const tableRows: TableRow[] = [];

      for (const field of section.fields) {
        const val = formData[field.id];
        if (!val) continue;

        const label = dict[field.dictKey] || field.dictKey;

        tableRows.push(
          new TableRow({
            height: { value: 300, rule: HeightRule.AUTO },
            children: [
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                  left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                  right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${label}:`,
                        bold: true,
                        size: 20, // 10 pt
                        color: '4A5568', // Slate gray
                        font: 'Arial',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                  left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                  right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: val,
                        size: 20, // 10 pt
                        color: '1A202C', // Dark gray/black
                        font: 'Arial',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        );
      }

      docChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
          },
          rows: tableRows,
        })
      );
    }

    // Footer
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 800 },
        children: [
          new TextRun({
            text: 'Created with Free Biodata Maker (freebiodatamaker.com)',
            size: 16, // 8 pt
            color: 'A0AEC0', // Light Gray
            italics: true,
          }),
        ],
      })
    );

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docChildren,
        },
      ],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    // Return response as file download attachment
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${formData.fullName || 'biodata'}_marriage.docx"`);
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Error exporting Word document:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
