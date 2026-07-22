import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN' && !user.isMasterAdmin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { topicText, subject, track, questionCount = 5, difficulty = 'MEDIUM', customApiKey } = await request.json();

    if (!topicText || typeof topicText !== 'string') {
      return NextResponse.json({ error: 'Topic or lesson text is required' }, { status: 400 });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API Key is missing. Please enter your free Gemini API key.' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert Tawjihi Ministry Examination & BTEC Vocational curriculum question creator in Jordan.
Generate ${questionCount} high-quality multiple choice questions (MCQs) based on the following study text/topic:

SUBJECT: "${subject || 'التوجيهي'}"
TRACK: "${track || 'ACADEMIC'}"
DIFFICULTY LEVEL: "${difficulty}"

STUDY TEXT / TOPIC NOTES:
"""
${topicText.slice(0, 4000)}
"""

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid raw JSON object without markdown formatting or extra text.
2. The JSON object must strictly match this exact structure:
{
  "questions": [
    {
      "textAr": "نص السؤال باللغة العربية (واضح ودقيق حسب منهاج التوجيهي الأردني)",
      "textEn": "Question text in English",
      "type": "MCQ",
      "explanationAr": "توضيح الإجابة والتعليل بالعربية",
      "explanationEn": "Explanation in English",
      "choices": [
        { "textAr": "الخيار الأول", "textEn": "Option 1", "isCorrect": true },
        { "textAr": "الخيار الثاني", "textEn": "Option 2", "isCorrect": false },
        { "textAr": "الخيار الثالث", "textEn": "Option 3", "isCorrect": false },
        { "textAr": "الخيار الرابع", "textEn": "Option 4", "isCorrect": false }
      ]
    }
  ]
}
3. Ensure exactly ONE choice per question has "isCorrect": true, and the other 3 choices have "isCorrect": false.`;

    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp',
      'gemini-1.0-pro'
    ];

    let lastError: string = '';
    let parsedData: any = null;

    for (const model of modelsToTry) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

      try {
        const geminiResponse = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        });

        if (geminiResponse.ok) {
          const resData = await geminiResponse.json();
          const candidateText = resData.candidates?.[0]?.content?.parts?.[0]?.text;

          if (candidateText) {
            // Remove code fences like ```json ... ```
            const cleanedText = candidateText
              .replace(/```json/gi, '')
              .replace(/```/g, '')
              .trim();

            try {
              parsedData = JSON.parse(cleanedText);
              if (parsedData && Array.isArray(parsedData.questions)) {
                break; // Found working response!
              }
            } catch (jsonErr) {
              console.error('JSON parse error from Gemini:', jsonErr);
            }
          }
        } else {
          const errBody = await geminiResponse.text();
          lastError = `Model ${model} returned HTTP ${geminiResponse.status}: ${errBody}`;
          console.warn(`Gemini model ${model} response:`, errBody);
        }
      } catch (e: any) {
        lastError = e?.message || 'Network error connecting to Gemini';
      }
    }

    if (!parsedData || !Array.isArray(parsedData.questions)) {
      return NextResponse.json(
        { error: `Gemini API Response: ${lastError || 'Could not parse response from Gemini API.'}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      questions: parsedData.questions || [],
    });
  } catch (error: any) {
    console.error('AI generate route error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
