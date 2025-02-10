import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    // Kullanıcı doğrulama
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, brand, category, price, inStock, image, specifications } = body;

    // Zorunlu alanlar kontrolü
    if (!name || !brand || !category || !price || inStock === undefined || !image) {
      return NextResponse.json({ error: "Eksik alanlar var" }, { status: 400 });
    }

    // Ürün oluştur
    const product = await prisma.product.create({
      data: {
        name,
        description,
        brand,
        category,
        price: parseFloat(price),
        inStock,
        image,
        createdAt: new Date(),
      },
    });

    // Ürüne özellikler ekleme
    if (specifications && specifications.length > 0) {
      await prisma.productSpecification.createMany({
        data: specifications.map((spec: { specificationId: string; value: string }) => ({
          productId: product.id,
          specificationId: spec.specificationId,
          value: spec.value,
        })),
      });
    }

    console.log("Ürün ve özellikler oluşturuldu:", product);
    return NextResponse.json(product, { status: 201 }); // 201: Created
  } catch (error: any) {
    console.error("Ürün oluşturulurken hata oluştu:", error);
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category:true,
        specifications: {
          include: {
            specification: true, // Özellik isimlerini de döndür
          },
        },
      },
    });

    return NextResponse.json(products, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=59", // Önbellekleme
      },
    });
  } catch (error: any) {
    console.error("Ürünler alınırken hata oluştu:", error);
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 500 });
  }
}
