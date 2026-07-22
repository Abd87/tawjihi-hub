import { NextResponse } from 'next/server';

export async function GET() {
  // Seeding endpoint is disabled in production for security
  return NextResponse.json(
    { error: 'Seeding is disabled for security reasons.' },
    { status: 403 }
  );
}
