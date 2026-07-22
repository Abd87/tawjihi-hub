import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendTeacherApplicationNotification } from '@/lib/email';

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

    // Notify admin via email
    sendTeacherApplicationNotification({ fullName, email, phoneNumber, subject }).catch(err => console.error('Teacher notification email error:', err));

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Teacher application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
