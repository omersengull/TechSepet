import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🔍 Prisma LIKE Search (Insensitive Search)
 * - Büyük-küçük harf duyarsız arama yapar.
 */
export const fuzzySearchProducts = async (query: string) => {
  if (!query) return [];

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } }
        ]
      },
      take: 10 // İlk 10 sonucu getir
    });

    console.log("🔍 Prisma'dan Gelen Ürünler:", products);
    return products;
  } catch (error) {
    console.error("Prisma arama hatası:", error);
    return [];
  }
};


/**
 * 🔍 Autocomplete (Kelimeye Göre Öneriler)
 * - Kullanıcının yazdığı ilk harflerle başlayan ürünleri döndürür.
 */
export const getAutocompleteSuggestions = async (query: string) => {
  if (!query) return [];

  try {
    const suggestions = await prisma.product.findMany({
      where: {
        name: { startsWith: query, mode: "insensitive" }
      },
      select: { name: true },
      take: 5
    });

    return suggestions.map(s => s.name);
  } catch (error) {
    console.error("Autocomplete hatası:", error);
    return [];
  }
};


/**
 * 🔍 Filtreleme Özellikli Arama
 * - Kullanıcının seçtiği filtrelere göre arama yapar (Kategori, Marka, Fiyat)
 */
export const searchWithFilters = async (query: string, filters: { category?: string, brand?: string, minPrice?: number, maxPrice?: number }) => {
  try {
    const whereConditions: any = {};

    if (query) {
      whereConditions.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } }
      ];
    }
    if (filters.category) {
      whereConditions.category = { equals: filters.category }; // Tam eşleşme yapıyoruz
    }
    if (filters.brand) {
      whereConditions.brand = { equals: filters.brand }; // Tam eşleşme yapıyoruz
    }
    if (filters.minPrice || filters.maxPrice) {
      whereConditions.price = {};
      if (filters.minPrice) {
        whereConditions.price.gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        whereConditions.price.lte = filters.maxPrice;
      }
    }

    const products = await prisma.product.findMany({
      where: whereConditions
    });

    return products;
  } catch (error) {
    console.error("Filtreli arama hatası:", error);
    return [];
  }
};
export const searchProducts = async (query: string) => {
  if (!query) return [];

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } }
        ]
      },
      take: 10
    });

    console.log("🔍 Prisma'dan Gelen Ürünler:", products);
    return products;
  } catch (error) {
    console.error("❌ Prisma Arama Hatası:", error);
    return [];
  }
};