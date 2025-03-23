// scripts/fixOrders.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixOrders() {
  const orders = await prisma.order.findMany();
  for (const order of orders) {
    try {
      const items = JSON.parse(order.items);
      if (!Array.isArray(items)) {
        const fixedItems = [items];
        await prisma.order.update({
          where: { id: order.id },
          data: { items: JSON.stringify(fixedItems) },
        });
        console.log(`Order ${order.id} fixed.`);
      }
    } catch (error) {
      console.error(`Error fixing order ${order.id}:`, error);
    }
  }
  await prisma.$disconnect();
}

fixOrders();
