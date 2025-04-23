import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentDate = new Date();
    
    const activeCoupons = await prisma.coupon.findMany({
      where: {
        validUntil: {
          gt: currentDate // Geçerli tarihten sonra bitenler
        }
      },
      select: {
        id: true,
        code: true,
        discountType: true,
        discountValue: true,
        validUntil: true,
        isSingleUse: true
      },
      orderBy: {
        validUntil: 'asc' // Tarihe göre sırala
      }
    });

    return NextResponse.json(activeCoupons);
    
  } catch (error) {
    console.error('Aktif kuponlar yüklenirken hata:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}