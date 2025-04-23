import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code, totalAmount } = await request.json();
    console.log('Gelen istek:', { code, totalAmount }); // Log ekle
    // 1. Kupon kodunu kontrol et
    const coupon = await prisma.coupon.findUnique({
      where: {
        code: code.toUpperCase()
      },
      select: {
        discountValue: true, // Bu alanı explicit seç
        discountType: true,
        maxDiscount: true,
        validUntil: true,
        isSingleUse: true,
        usedCount: true
      }
    });
    console.log('Veritabanından kupon:', coupon); 
    
    // 2. Kupon geçerlilik kontrolleri
    if (!coupon) throw new Error("Geçersiz kupon kodu");
    if (new Date() > coupon.validUntil) throw new Error("Kuponun süresi dolmuş");
    if (coupon.isSingleUse && coupon.usedCount >= 1) throw new Error("Kupon zaten kullanılmış");

    // 3. İndirim hesapla
    let discount = 0;

    if (coupon.discountType === 'PERCENTAGE') {
      // Yüzdelik indirim
      discount = totalAmount * (coupon.discountValue / 100);
      if (coupon.discountType === 'PERCENTAGE') {
        discount = totalAmount * (coupon.discountValue / 100);
        
        // Maksimum indirim kontrolü
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      }
      // Maksimum indirim kontrolü
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      // Sabit tutarlı indirim
      discount = coupon.discountValue;
    }
    console.log('Hesaplanan indirim:', discount);
    // 4. Negatif indirimi önle
    if (discount > totalAmount) discount = totalAmount;

    return NextResponse.json({
      discount: Number(discount.toFixed(2)),
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}