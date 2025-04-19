import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import axios from "axios";
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {

        specifications: {
          include: {
            specification: true,  // ✅ Özellik adını da alıyoruz
          },
        },
        reviews: true,
      },
    });
    console.log("Product Data:", product);
    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // Kullanıcı doğrulama
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return new NextResponse("Kullanıcı oturum açmamış.", { status: 401 });
  }
  if (currentUser.role !== "ADMIN") {
    return new NextResponse("Yetkisiz erişim.", { status: 403 });
  }

  // Parametre kontrolü
  if (!params || !params.id) {
    return new NextResponse("Geçersiz parametre.", { status: 400 });
  }

  try {
    const product = await prisma.$transaction(async (tx) => {
      // 1. Resmi Google Cloud'dan sil
      if (product.image) {
        await axios.post("/api/delete-image", { imageUrl: product.image });
      }

      // 2. Ürün özelliklerini sil
      await tx.productSpecification.deleteMany({
        where: { productId: params.id },
      });

      // 3. Ürünü sil
      return await tx.product.delete({
        where: { id: params.id },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    // Veritabanı hatası
    return new NextResponse("Ürün silinemedi", { status: 500 });
  }
}
