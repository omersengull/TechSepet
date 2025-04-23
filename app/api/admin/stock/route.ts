// app/api/admin/stock/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role!="ADMIN") {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        category: { select: { name: true } }
      },
      orderBy: { stock: 'asc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ürünler yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role!="ADMIN") {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, newStock } = await req.json();
    
    if (newStock < 0) {
      return NextResponse.json(
        { error: 'Stok miktarı negatif olamaz' },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { stock: newStock 
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Stok güncelleme hatası:", error);
    return NextResponse.json(
      { error: 'Stok güncellenemedi' },
      { status: 500 }
    );
  }
}