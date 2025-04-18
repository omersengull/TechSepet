import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    // Yetki kontrolü
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, brand, category, price, inStock, image, specifications } = body;

    // Zorunlu alanların kontrolü
    if (!name || !brand || !category || !price || inStock === undefined || !image) {
      return NextResponse.json({ error: "Eksik alanlar var" }, { status: 400 });
    }

    // Kategoriyi bul veya oluştur
    const categoryRecord = await prisma.category.upsert({
      where: { name: category },
      create: { name: category },
      update: {},
    });

    // Ürünü oluştur
    const product = await prisma.product.create({
      data: {
        name,
        description,
        brand,
        category: { connect: { id: categoryRecord.id } },
        price: parseFloat(price),
        inStock,
        image,
        createdAt: new Date(),
      },
    });

    // Özellikleri ekle (transaction ile)
    if (specifications?.length > 0) {
      await prisma.$transaction(
        specifications.map((spec) => 
          prisma.productSpecification.create({
            data: {
              product: { connect: { id: product.id } },
              specification: {
                connectOrCreate: {
                  where: {
                    name_categoryId: {
                      name: spec.specificationName,
                      categoryId: categoryRecord.id
                    }
                  },
                  create: {
                    name: spec.specificationName,
                    category: { connect: { id: categoryRecord.id } }
                  }
                }
              },
              value: spec.value
            }
          }) // Return işlemi otomatik
        )
      );
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Hata:", error);
    return NextResponse.json(
      { error: error.message || "Dahili sunucu hatası" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        reviews: true,
        category: true,
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
