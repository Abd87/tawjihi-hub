import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wordParam = searchParams.get('word');
  
  if (!wordParam) {
    return NextResponse.json({ error: 'Missing word parameter' }, { status: 400 });
  }

  const word = wordParam.toLowerCase().trim();

  try {
    const cached = await prisma.dictionary.findUnique({
      where: { word }
    });

    if (cached) {
      return NextResponse.json({ translation: cached.translation });
    }

    return NextResponse.json({ error: 'Not found in cache' }, { status: 404 });
  } catch (error) {
    console.error('Translation GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { word, translation } = body;

    if (!word || !translation) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const cleanWord = word.toLowerCase().trim();

    await prisma.dictionary.upsert({
      where: { word: cleanWord },
      update: { translation },
      create: {
        word: cleanWord,
        translation
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Translation POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
