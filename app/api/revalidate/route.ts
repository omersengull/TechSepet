// app/api/revalidate/route.ts
import { NextResponse } from 'next/server';

export async function GET(req,res) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json(
      { error: 'Path parametresi gereklidir' },
      { status: 400 }
    );
  }

  try {
    await res.revalidate(path);
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Revalidation başarısız' },
      { status: 500 }
    );
  }
}