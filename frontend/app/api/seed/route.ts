import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@tawjihi.jo' },
      update: {},
      create: {
        email: 'admin@tawjihi.jo',
        passwordHash,
        nameAr: 'مدير النظام',
        nameEn: 'System Admin',
        role: 'ADMIN',
      }
    });

    return NextResponse.json({ success: true, admin });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
