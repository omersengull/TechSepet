import { NextResponse } from "next/server";
import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany();
    let bestSellingProducts: Product[] = [];
    
    orders.forEach(order => {
      try {
        let items = JSON.parse(order.items);
        // Handle nested arrays and stringified JSON arrays
        const flattenItems = (arr: any[]): any[] => {
          return arr.flatMap(item => {
            if (Array.isArray(item)) return flattenItems(item);
            if (typeof item === 'string') {
              try {
                const parsed = JSON.parse(item);
                return Array.isArray(parsed) ? flattenItems(parsed) : parsed;
              } catch {
                return item;
              }
            }
            return item;
          });
        };

        if (Array.isArray(items)) {
          const flattened = flattenItems(items);
          // Filter valid products
          const validProducts = flattened.filter(product => 
            product.id && product.name && product.price
          );
          bestSellingProducts.push(...validProducts);
        }
      } catch (error) {
        console.warn("Sipariş items ayrıştırma hatası:", error);
      }
    });

    // Remove duplicates
    const uniqueProducts = Array.from(new Map(
      bestSellingProducts.map(product => [product.id, product])
    ).values());
    
    return NextResponse.json(Array.from(uniqueProducts), { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}