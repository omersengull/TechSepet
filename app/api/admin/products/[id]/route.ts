import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';

// app/api/products/[productId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { 
        category: true,
        specifications: { // Eksik ilişkiyi ekledik
          include: {
            specification: true
          }
        }
      }
    });

    if (!product) {
      return new NextResponse("Ürün bulunamadı", { status: 404 });
    }

    const response = new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: new Headers({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      })
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Ürün bulunamadı' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    
    const body = await request.json();
    const {id, categoryId, ...otherData } = body;
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...otherData,
        category: {
          connect: { id: categoryId }
        }}
      
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return NextResponse.json(
      { error: 'Güncelleme başarısız' },
      { status: 500 }
    );
  }
}