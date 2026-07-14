import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phoneNumber, subject, experience, resumeLink } = body;

    if (!fullName || !email || !phoneNumber || !subject || !experience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const application = await prisma.teacherApplication.create({
      data: {
        fullName,
        email,
        phoneNumber,
        subject,
        experience,
        resumeLink,
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Teacher application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
