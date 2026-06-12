import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// GET draft by token
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    const draft = await prisma.userDraft.findUnique({
      where: { draftToken: token },
    });

    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    // Check expiration
    if (new Date() > draft.expiresAt) {
      // Clean up expired draft
      await prisma.userDraft.delete({ where: { id: draft.id } });
      return NextResponse.json({ error: 'Draft expired' }, { status: 404 });
    }

    return NextResponse.json(draft);
  } catch (error: any) {
    console.error('Error fetching draft:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create or update draft
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { draftToken, selectedLanguage, selectedTemplateId, formData, photoUrl } = body;

    if (!selectedLanguage || !selectedTemplateId) {
      return NextResponse.json({ error: 'Language and Template ID are required' }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours expiry

    let draft;
    if (draftToken) {
      // Try to update existing draft
      draft = await prisma.userDraft.upsert({
        where: { draftToken },
        update: {
          selectedLanguage,
          selectedTemplateId,
          formData: formData || {},
          photoUrl: photoUrl || null,
          expiresAt,
        },
        create: {
          draftToken,
          selectedLanguage,
          selectedTemplateId,
          formData: formData || {},
          photoUrl: photoUrl || null,
          expiresAt,
        },
      });
    } else {
      // Create new draft
      const newToken = uuidv4();
      draft = await prisma.userDraft.create({
        data: {
          draftToken: newToken,
          selectedLanguage,
          selectedTemplateId,
          formData: formData || {},
          photoUrl: photoUrl || null,
          expiresAt,
        },
      });

      // Increment total biodatas generated counter
      try {
        await prisma.siteCounter.upsert({
          where: { key: 'total_biodatas_generated' },
          update: { value: { increment: 1 } },
          create: { key: 'total_biodatas_generated', value: 1 },
        });
      } catch (counterErr) {
        console.error('Error incrementing counter:', counterErr);
      }
    }

    return NextResponse.json({ draftToken: draft.draftToken, success: true });
  } catch (error: any) {
    console.error('Error saving draft:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE delete draft
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    await prisma.userDraft.delete({
      where: { draftToken: token },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting draft:', error);
    return NextResponse.json({ error: 'Draft not found or already deleted' }, { status: 400 });
  }
}
