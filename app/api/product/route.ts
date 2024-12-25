import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

// Harici yardımcı dosyada test fonksiyonu tanımlanmalı, burada dışa aktarmayın
// testDBConnection fonksiyonunu test için içe aktarabilirsiniz.

// POST Metodu
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.error();
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
        image,
      },
    });

    console.log("Ürün oluşturuldu:", product);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Ürün oluşturulurken hata oluştu:", error);
    return NextResponse.error();
  }
}

// GET Metodu
export async function GET() {
  try {
    const products = await prisma.product.findMany();

    return new NextResponse(JSON.stringify(products), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=59", // 1 saatlik önbellekleme
      },
    });
  } catch (error) {
    console.error("Ürünler alınırken hata oluştu:", error);
    return NextResponse.error();
  }
}
