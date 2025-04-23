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
            specification: true, 
          },
        },
        reviews: true,
        category:true
      },
    });
    console.log("Product Data:", product);
    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }
    const headers = new Headers();
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
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
  if (!params?.id) {
    return new NextResponse("Geçersiz parametre.", { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Ürünü bul
      const product = await tx.product.findUnique({
        where: { id: params.id },
      });

      if (!product) {
        throw new Error("Ürün bulunamadı");
      }

      // 2. Resmi sil (varsa)
      if (product.image) {
        const baseUrl=process.env.NEXTAUTH_URL || "http://localhost:3000";
        await axios.post(`${baseUrl}/api/delete-image`, { imageUrl: product.image });
      }

      // 3. İlişkili özellikleri sil
      await tx.productSpecification.deleteMany({
        where: { productId: params.id },
      });

      // 4. Ürünü sil
      await tx.product.delete({
        where: { id: params.id },
      });
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Hatası:", error);
  
    let errorMessage = "Ürün silinemedi";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    
    return new NextResponse(errorMessage, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } // JSON response için
    });
  }
}
