import prisma from "@/libs/prismadb";

// pages/api/cron/expired-coupons.ts
export default async function handler() {
    try {
      const expiredCoupons = await prisma.coupon.deleteMany({
        where: {
          validUntil: { lt: new Date() },
          isActive: true
        }
      });
      
      console.log(`Silinen kupon sayısı: ${expiredCoupons.count}`);
      return { success: true };
    } catch (error) {
      console.error('Kupon silme hatası:', error);
      return { success: false };
    }
  }