import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { productId } = req.query;

  try {
    console.log("API Çalışıyor, Gelen productId:", productId);

    if (!productId) {
      return res.status(400).json({ error: "Geçersiz ürün ID'si" });
    }

    // 📌 **Adım 1: Tüm siparişleri çek**
    const allOrders = await prisma.order.findMany({
      select: {
        items: true, // Sipariş içindeki ürünleri al
      },
    });

    console.log("🔥 Adım 1 - Tüm Siparişler:", allOrders);

    if (allOrders.length === 0) {
      console.log("🚨 Hiç sipariş bulunamadı.");
      return res.status(200).json({ recommendedProducts: [] });
    }

    // 📌 **Adım 2: Ürünlerin kaç kez birlikte satın alındığını hesapla**
    const productCount: Record<string, number> = {};

    allOrders.forEach((order) => {
      try {
        if (!order.items) return;
        const parsedItems = JSON.parse(order.items);
        let products: string[] = []; // Dizinin öğe türünü string olarak tanımladık
        parsedItems.forEach((itemString: string) => {
          const items = JSON.parse(itemString);
          items.forEach((item: any) => {
            if (item.id && item.id !== productId) {
              products.push(item.id);
            }
          });
        });
        products.forEach((id) => {
          productCount[id] = (productCount[id] || 0) + 1;
        });
        console.log("🔥 Adım 2 - Orijinal `items` Verisi:", order.items);
        
        // İlk parse işlemi yapılır
        if (typeof order.items === "string") {
          try {
            // İç içe JSON parse işlemini tek bir defa yapalım
            const firstParse = JSON.parse(order.items);
            console.log("✅ İlk Parse Sonucu:", firstParse);
        
            // 'firstParse' bir dizi olduğu için bu diziye ürün id'sini ekleyelim
            firstParse.forEach((item: { id: string }) => {
              products.push(item.id);  // Her ürünün ID'sini ekliyoruz
            });
        
          } catch (error) {
            console.error("❌ JSON Parse Hatası:", error);
          }
        }
        
        console.log("✅ Adım 2 - Siparişteki Ürünler:", products);
        


      } catch (error) {
        console.error("❌ String Parse Hatası:", error);
      }
    });

    console.log("🔥 Adım 3 - Tüm Siparişlerden Derlenen Ürün Sayacı:", productCount);

    // 📌 **Adım 3: En çok birlikte satın alınan ürünleri sırala**
    const sortedProductIds = Object.entries(productCount)
      .sort(([, countA], [, countB]) => countB - countA) // Büyükten küçüğe sıralama
      .map(([id]) => id) // Sadece ID'leri al
      .slice(0, 10); // **🔴 Güncellendi: 10 ürün getiriyoruz (5 yerine)**

    if (sortedProductIds.length === 0) {
      console.log("🚨 Adım 4 - Hiç önerilecek ürün bulunamadı.");
      return res.status(200).json({ recommendedProducts: [] });
    }

    // 📌 **Adım 4: En çok alınan ürünlerin detaylarını getir**
    const recommendedProducts = await prisma.product.findMany({
      where: {
        id: { in: sortedProductIds },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        inStock: true,
      },
    });

    // **Ürünleri tekrar sıralayarak en çok alınanı en başa koyuyoruz**
    const sortedRecommendedProducts = recommendedProducts.sort(
      (a, b) => (productCount[b.id] || 0) - (productCount[a.id] || 0)
    );

    console.log("🔥 Adım 5 - Sıralanmış Önerilen Ürünler:", sortedRecommendedProducts);

    res.status(200).json({ recommendedProducts: sortedRecommendedProducts });
  } catch (error) {
    console.error("🚨 Öneri API Hatası:", error);
    res.status(500).json({ error: "Öneri alınırken hata oluştu" });
  }
}