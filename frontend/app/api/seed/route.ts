import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Check if legacy admin exists and update email
    const existingOldAdmin = await prisma.user.findUnique({
      where: { email: 'admin@tawjihi.jo' },
    });

    if (existingOldAdmin) {
      const updated = await prisma.user.update({
        where: { id: existingOldAdmin.id },
        data: {
          email: 'admin@tawjihihub.com',
          isMasterAdmin: true,
        },
      });
      return NextResponse.json({ success: true, message: 'Super admin email updated to admin@tawjihihub.com', admin: updated });
    }

    // Upsert admin@tawjihihub.com
    const admin = await prisma.user.upsert({
      where: { email: 'admin@tawjihihub.com' },
      update: {
        role: 'ADMIN',
        isMasterAdmin: true,
      },
      create: {
        email: 'admin@tawjihihub.com',
        passwordHash,
        nameAr: 'مدير النظام',
        nameEn: 'System Admin',
        role: 'ADMIN',
        isMasterAdmin: true,
      }
    });

    return NextResponse.json({ success: true, admin });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
