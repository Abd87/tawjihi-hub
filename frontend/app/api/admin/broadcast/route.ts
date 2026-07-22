import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendBroadcastEmail } from '@/lib/email';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is missing');

    const decoded: any = jwt.verify(token, secret);
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { subject, content, targetGroup } = await request.json();

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 });
    }

    // Filter users based on targetGroup
    let whereClause: any = {};
    if (targetGroup === 'ACADEMIC') {
      whereClause = { role: 'STUDENT', trackType: 'ACADEMIC' };
    } else if (targetGroup === 'BTEC') {
      whereClause = { role: 'STUDENT', trackType: 'BTEC' };
    } else if (targetGroup === 'TEACHER') {
      whereClause = { role: 'TEACHER' };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: { email: true },
    });

    const emails = Array.from(new Set(users.map((u) => u.email).filter(Boolean)));

    if (emails.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: 'No users found matching target group' });
    }

    // Send emails in background
    const result = await sendBroadcastEmail({ emails, subject, content });

    return NextResponse.json({ success: true, count: emails.length, result });
  } catch (error) {
    console.error('Broadcast email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
