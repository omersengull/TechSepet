import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Doğru import

const prisma = new PrismaClient();

// ⭐ Favoriye ürün ekleme (POST)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }
    const { productId } = await req.json();
    const userId = session.user.id;

    console.log("Favoriye ekleme isteği:", { userId, productId });

    // Prisma'nın benzersiz kısıtlaması sayesinde, eğer aynı kullanıcı–ürün çifti zaten varsa,
    // duplicate hatası (P2002) fırlatılacaktır.
    const newFavorite = await prisma.favorite.create({
      data: { userId, productId },
    });

    return NextResponse.json(
      { message: "Favorilere eklendi", favorite: newFavorite },
      { status: 201 }
    );
  } catch (error: any) {
    // Eğer duplicate giriş hatası alınırsa:
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Bu ürün zaten favorilerde" },
        { status: 200 }
      );
    }
    console.error(
      "Favoriye eklenirken hata oluştu:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { error: "Favori eklenemedi", details: error.message },
      { status: 500 }
    );
  }
}

// ⭐ Favori sorgulama (GET)
// Tüm favori kayıtlarını çekip, ilgili ürün bilgilerini döndürür.
export async function GET() {
  try {
    // Tüm favori kayıtlarını çekiyoruz
    const favorites = await prisma.favorite.findMany({
      select: { product: true },
    });
    // Aynı ürünleri tekilleştirmek için bir Map kullanıyoruz
    const uniqueProductsMap = new Map<string, typeof favorites[0]["product"]>();
    favorites.forEach((fav) => {
      if (fav.product && !uniqueProductsMap.has(fav.product.id)) {
        uniqueProductsMap.set(fav.product.id, fav.product);
      }
    });
    const uniqueProducts = Array.from(uniqueProductsMap.values());
    return NextResponse.json(uniqueProducts);
  } catch (error) {
    console.error("Favori ürünler alınamadı:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}


// ⭐ Favori ürün kaldırma (DELETE)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }
    const { productId } = await req.json();
    const userId = session.user.id;

    console.log("Favoriden kaldırma isteği:", { userId, productId });

    // Prisma şemasında, Favorite modeli için [userId, productId] kombinasyonuna benzersiz constraint tanımlandıysa,
    // bu alanı kullanarak doğrudan silme yapabiliriz.
    const deletionResult = await prisma.favorite.delete({
      where: { userId_productId: { userId, productId } },
    });

    return NextResponse.json(
      { message: "Favoriden kaldırıldı", deleted: deletionResult },
      { status: 200 }
    );
  } catch (error: any) {
    // Eğer silme sırasında kayıt bulunamazsa Prisma P2025 hata kodunu döner
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Bu ürün favorilerde bulunamadı" },
        { status: 404 }
      );
    }
    console.error(
      "Favoriden kaldırma hatası:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { error: "Favoriden kaldırma hatası", details: error.message },
      { status: 500 }
    );
  }
}
