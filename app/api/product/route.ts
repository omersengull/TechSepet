
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb"
import { NextResponse } from "next/server";
export async function testDBConnection() {
    try {
        await prisma.user.findFirst();  // Örnek bir sorgu
        console.log("Bağlantı başarılı!");
    } catch (error) {
        console.error("Veritabanı bağlantı hatası:", error);
    }
}

testDBConnection();

export async function POST(request: Request) {

    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "ADMIN") {
        return NextResponse.error()
    }
    const body = await request.json();


    const { name, description, brand, category, price, inStock, image } = body;
    const product = await prisma.product.create({
        data: {
            name,
            description,
            brand,
            category,
            price: parseFloat(price),
            inStock,
            image

        }
    });

    console.log("Kullanıcı oluşturuldu:", currentUser);
    return NextResponse.json(currentUser);

}
export async function GET(request) {
    try {
      const products = await prisma.product.findMany();
  
      return new NextResponse(JSON.stringify(products), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=59', // 1 saatlik önbellekleme
        },
      });
    } catch (error) {
      console.error('Ürünler alınırken hata oluştu:', error);
      return NextResponse.error();
    }
  }