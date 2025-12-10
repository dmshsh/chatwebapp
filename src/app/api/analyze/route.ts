import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  return NextResponse.json({
    status: 'ok',
    message: 'Анализ выполнен',
    received: body,
  });
}
