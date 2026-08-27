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
    // 1. Check database cache first
    const cached = await prisma.dictionary.findUnique({
      where: { word }
    });

    if (cached) {
      return NextResponse.json({ translation: cached.translation });
    }

    // 2. Fetch from Google Translate if not cached
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(word)}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Google Translate API Error: ${res.status}`);
    }

    const data = await res.json();
    
    if (data && Array.isArray(data[0])) {
      const translation = data[0].map((segment: any) => segment[0]).join('');
      
      // 3. Save to database for future users
      await prisma.dictionary.create({
        data: {
          word,
          translation
        }
      }).catch(err => {
        // Ignore unique constraint errors in case of race conditions
        console.error('Failed to cache translation', err);
      });

      return NextResponse.json({ translation });
    } else {
      throw new Error('Invalid Google Translate Response Format');
    }
  } catch (error) {
    console.error('Translation API Error:', error);
    return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
  }
}
