import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; 
// NOT: authOptions yolunu kendi projenize göre güncelleyin

const prisma = new PrismaClient();

/**
 * Tüm favori kayıtlarını döndürür (yalnızca giriş yapmış kullanıcıya ait).
 * Her favoride, ilişkili 'product' nesnesi de bulunur.
 */
export async function GET() {
  try {
    // Kullanıcı oturumunu doğrula
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    // Bu kullanıcıya ait favorileri çek
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: true, // İlgili ürün bilgilerini de getir
      },
    });

    // [{ userId, productId, product: {...} }, ...] şeklinde döner
    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.error("Favoriler alınamadı:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
