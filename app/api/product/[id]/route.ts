import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
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
        // Ürün silme işlemi
        
        const product = await prisma.product.delete({
            where: {
                id: params.id,
            },
        });
        return NextResponse.json(product);
    } catch (error) {
        // Veritabanı hatası
        return new NextResponse(`Veritabanı hatası: ${error.message}`, { status: 500 });
    }
}
