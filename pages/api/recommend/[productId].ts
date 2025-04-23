import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // productId query param’ı string veya string[] olabilir.
  const rawProductId = req.query.productId;
  const productId =
    Array.isArray(rawProductId) && rawProductId.length > 0
      ? rawProductId[0]
      : typeof rawProductId === "string"
      ? rawProductId
      : null;

  try {
    if (!productId) {
      return res.status(400).json({ error: "Geçersiz ürün ID'si" });
    }

    // 1️⃣ Tüm siparişlerin items alanını çekiyoruz
    const allOrders = await prisma.order.findMany({
      select: { items: true },
    });

    // 2️⃣ Her siparişi parse edip, içinde productId geçenleri filtreleyelim
    type ParsedOrder = { ids: string[] };
    const parsedOrders: ParsedOrder[] = allOrders.map((order) => {
      const ids: string[] = [];
      try {
        // Birinci seviye parse
        const firstParse = JSON.parse(order.items);
        if (Array.isArray(firstParse)) {
          firstParse.forEach((entry) => {
            // Eğer entry string ise ikinci seviye parse
            if (typeof entry === "string") {
              try {
                const secondParse = JSON.parse(entry);
                if (Array.isArray(secondParse)) {
                  secondParse.forEach((item: any) => {
                    if (item.id) ids.push(item.id);
                  });
                }
              } catch {
                // geçersiz JSON, atla
              }
            }
            // Eğer entry obje ise direkt ID al
            else if (entry && typeof entry === "object" && entry.id) {
              ids.push(entry.id);
            }
          });
        }
      } catch {
        // invalid JSON, hiçbir şey yapma
      }
      return { ids };
    });

    // 3️⃣ productId geçen siparişleri al
    const relevantOrders = parsedOrders.filter((o) =>
      o.ids.includes(productId)
    );
    if (relevantOrders.length === 0) {
      // Bu ürün hiç satın alınmamış
      return res.status(200).json({ recommendedProducts: [] });
    }

    // 4️⃣ Birlikte satın alınan ürünleri say
    const coPurchaseCount: Record<string, number> = {};
    relevantOrders.forEach((order) => {
      order.ids.forEach((id) => {
        if (id !== productId) {
          coPurchaseCount[id] = (coPurchaseCount[id] || 0) + 1;
        }
      });
    });

    // 5️⃣ En çok birlikte satın alınan ilk 10 ürünü seç
    const sortedProductIds = Object.entries(coPurchaseCount)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => id)
      .slice(0, 10);

    if (sortedProductIds.length === 0) {
      return res.status(200).json({ recommendedProducts: [] });
    }

    // 6️⃣ Detayları getir ve sayaç sırasına göre yeniden sırala
    const recommendedProducts = await prisma.product.findMany({
      where: { id: { in: sortedProductIds } },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        stock: true,
      },
    });

    const sortedRecommendedProducts = recommendedProducts.sort(
      (a, b) => (coPurchaseCount[b.id] || 0) - (coPurchaseCount[a.id] || 0)
    );

    return res
      .status(200)
      .json({ recommendedProducts: sortedRecommendedProducts });
  } catch (error) {
    console.error("🚨 Öneri API Hatası:", error);
    return res.status(500).json({ error: "Öneri alınırken hata oluştu" });
  }
}
