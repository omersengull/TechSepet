import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(req: Request) {
  try {
    const { productId, rating, comment, userId } = await req.json();

    // ✅ Eksik veya yanlış veri kontrolü
    if (!productId || !userId || !rating || !comment.trim()) {
      return NextResponse.json({ error: "Eksik veya geçersiz veri!" }, { status: 400 });
    }

    // ✅ Yorum veritabanına ekleniyor (Prisma ile ilişkileri bağladık)
    const newReview = await prisma.review.create({
      data: {
        rating,
        content: comment,
        createdAt: new Date(), // ✅ Hata burada düzeltildi
        product: { connect: { id: productId } }, // ✅ Ürünü ilişkilendir
        user: { connect: { id: userId } }, // ✅ Kullanıcıyı ilişkilendir
      },
    });

    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    console.error("⚠️ Yorum eklenirken hata oluştu:", error);
    return NextResponse.json({ error: "Sunucu hatası!" }, { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Ürün ID eksik!" }, { status: 400 });
    }

    // ✅ Veritabanından ürüne ait yorumları çek
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            name: true,
            image: true, // Kullanıcının profil resmini çekmek için
          },
        },
      },
      orderBy: { createdAt: "desc" }, // En yeni yorumlar önce gösterilsin
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("⚠️ Yorumları çekerken hata oluştu:", error);
    return NextResponse.json({ error: "Sunucu hatası!" }, { status: 500 });
  }
}
