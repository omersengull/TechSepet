import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(req: Request) {
  try {
    const { productId, rating, comment, userId } = await req.json();

    // Eksik veri kontrolü
    if (!productId || !userId || !rating || !comment.trim()) {
      return NextResponse.json({ error: "Eksik veya geçersiz veri!" }, { status: 400 });
    }

    // Kullanıcının varlığını kontrol et
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı!" }, { status: 404 });
    }

    // Ürünün varlığını kontrol et (opsiyonel ama önerilir)
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      return NextResponse.json({ error: "Ürün bulunamadı!" }, { status: 404 });
    }

    // Yorum veritabanına ekleniyor ve user bilgileri de dahil ediliyor
    const newReview = await prisma.review.create({
      data: {
        rating,
        content: comment.trim(),
        createdAt: new Date(),
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
      include: {
        user: { select: { name: true, image: true } },
      },
    });

    // API'nin döndürdüğü yoruma, top-level userName ve userImage alanları ekliyoruz
    const transformedReview = {
      ...newReview,
      userName: newReview.user?.name || "Anonim",
      userImage: newReview.user?.image || "/default-avatar.png",
    };

    return NextResponse.json(transformedReview, { status: 201 });
  } catch (error: any) {
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

    // Ürüne ait yorumları çek
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Her yoruma top-level userName ve userImage alanlarını ekliyoruz
    const transformedReviews = reviews.map((review) => ({
      ...review,
      userName: review.user?.name || "Anonim",
      userImage: review.user?.image || "/default-avatar.png",
    }));

    return NextResponse.json(transformedReviews);
  } catch (error) {
    console.error("⚠️ Yorumları çekerken hata oluştu:", error);
    return NextResponse.json({ error: "Sunucu hatası!" }, { status: 500 });
  }
}
