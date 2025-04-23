import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

// app/api/admin/coupons/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Gerekli alanlar
    const requiredFields = ['code', 'discountType', 'discountValue', 'validUntil'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Eksik alanlar: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Tip kontrolü
    if (isNaN(parseFloat(body.discountValue))) {
      return NextResponse.json(
        { error: "Geçersiz indirim değeri" },
        { status: 400 }
      );
    }

    // Yeni kupon oluştur
    const coupon = await prisma.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        discountType: body.discountType,
        discountValue: parseFloat(body.discountValue),
        maxDiscount: body.maxDiscount ? parseFloat(body.maxDiscount) : null,
        validFrom: new Date(),
        validUntil: new Date(body.validUntil),
        isSingleUse: Boolean(body.isSingleUse),
      
      }
    });

    return NextResponse.json(coupon, { status: 201 });

  } catch (error: any) {
    console.error('Hata:', error);
    return NextResponse.json(
      { error: error.message || 'Sunucu hatası' },
      { status: 500 }
    );
  }
}