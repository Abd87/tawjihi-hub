import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || (!user.isMasterAdmin && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nameAr: true,
        nameEn: true,
        role: true,
        isMasterAdmin: true,
        revenueSharePercent: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const currentUser = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!currentUser || (!currentUser.isMasterAdmin && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden - Only Master Admin or Admin can modify users' }, { status: 403 });
    }

    const { targetUserId, newRole, revenueSharePercent } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: 'Missing targetUserId' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (targetUser?.isMasterAdmin && newRole && newRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Cannot modify Master Admin role' }, { status: 400 });
    }

    const updateData: any = {};
    if (newRole) updateData.role = newRole;
    if (typeof revenueSharePercent === 'number' && !isNaN(revenueSharePercent)) {
      updateData.revenueSharePercent = revenueSharePercent;
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
      select: {
        id: true,
        email: true,
        nameAr: true,
        nameEn: true,
        role: true,
        isMasterAdmin: true,
        revenueSharePercent: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const currentUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { nameAr, nameEn, email, password, role } = await request.json();

    if (!email || !password || !nameAr || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nameAr,
        nameEn,
        role,
        isMasterAdmin: false,
      },
      select: {
        id: true,
        email: true,
        nameAr: true,
        nameEn: true,
        role: true,
        isMasterAdmin: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const currentUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (targetUser?.isMasterAdmin) {
      return NextResponse.json({ error: 'Cannot delete Master Admin account' }, { status: 400 });
    }

    // Transfer any blog posts created by this user to the Master Admin (or delete them) to prevent foreign key errors
    const masterAdmin = await prisma.user.findFirst({ where: { isMasterAdmin: true } });
    if (masterAdmin && masterAdmin.id !== id) {
      await prisma.blogPost.updateMany({
        where: { authorId: id },
        data: { authorId: masterAdmin.id },
      });
    } else {
      await prisma.blogPost.deleteMany({
        where: { authorId: id },
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
