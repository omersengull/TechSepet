import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true 
      }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Ürün çekme hatası:', error);
    return NextResponse.json(
      { error: 'Ürünler yüklenemedi' },
      { status: 500 }
    );
  }
}