import { NextResponse } from 'next/server';
import { getTranslations } from '@/i18n/config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';

  try {
    const dict = await getTranslations(lang);
    return NextResponse.json(dict);
  } catch (error: any) {
    console.error('Error loading translations:', error);
    return NextResponse.json({ error: 'Failed to load translations' }, { status: 500 });
  }
}
