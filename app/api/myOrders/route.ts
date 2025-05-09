export const dynamic = "force-dynamic";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const orders = await prisma.order.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
    });

    // Siparişlerdeki items alanını gerçek dizi haline getirip,
    // tekrar sipariş objesine yerleştiriyoruz
    const fixedOrders = orders.map((order) => {
      let parsedItems: any[] = [];
      try {
        const firstParse = JSON.parse(order.items);
        // firstParse tipik olarak ["[{...}]"] gibi bir DİZİ ve içinde string
        if (Array.isArray(firstParse) && typeof firstParse[0] === "string") {
          parsedItems = JSON.parse(firstParse[0]);
        } else {
          parsedItems = firstParse;
        }
      } catch (error) {
        console.warn("items parse hatası:", error);
      }
      return {
        ...order,
        items: parsedItems, // Artık gerçek dizi
      };
    });

    return NextResponse.json(fixedOrders, { status: 200 });
  } catch (error) {
    console.error("Siparişler alınırken hata oluştu:", error);
    return NextResponse.json({ error: "Siparişler alınamadı." }, { status: 500 });
  }
}