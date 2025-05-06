import { NextResponse } from "next/server";
import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany();
    console.log("Veritabanından Order'lar:", orders);

    const productSales: Record<string, number> = {};

    // 1. Items parse etme
    const parsedItems = orders.flatMap(order => {
      try {
        return JSON.parse(order.items);
      } catch (error) {
        console.error(`Order ${order.id} parse hatası:`, error);
        return [];
      }
    });
    console.log("Parsed Items:", parsedItems);

    // 2. Satış istatistiklerini hesapla (DEĞİŞEN KISIM)
    parsedItems.forEach((item: { 
      productId: string; 
      amount?: number; // 'quantity' yerine 'amount' kullanılıyor
      quantity?: number // Eski adı da kontrol edelim
    }) => {
      const productId = item.productId;
      const quantity = item.amount || item.quantity || 0; // Her iki alanı da kontrol et
      
      if (productId && quantity > 0) {
        productSales[productId] = (productSales[productId] || 0) + quantity;
      }
    });
    console.log("Satış İstatistikleri:", productSales);

    // 3. Ürünleri veritabanından çek
    const productIds = Object.keys(productSales);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    console.log("Veritabanından Ürünler:", products);

    // 4. Satış adedine göre sırala
    const sortedProducts = products
      .sort((a, b) => (productSales[b.id] || 0) - (productSales[a.id] || 0))
      .map(product => ({
        ...product,
        totalSales: productSales[product.id] || 0 // Satış adedini de ekleyelim
      }));
    
    return NextResponse.json(sortedProducts);
  } catch (error) {
    console.error("API Hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}