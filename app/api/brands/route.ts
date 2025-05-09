import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb"; 

export async function GET() {
  try {
    const brands = await prisma.product.findMany({
      select: { brand: true }, // Sadece markaları çek
      distinct: ["brand"], // Tekrar edenleri kaldır
    });

    return NextResponse.json(brands.map(b => b.brand));
  } catch (error) {
    return NextResponse.json({ error: "Markalar yüklenemedi" }, { status: 500 });
  }
}
