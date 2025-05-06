import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // MongoDB'den Order verilerini çekiyoruz
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        userId: true,
        items: true,
        totalPrice: true,
        createdAt: true,
        addressInfo: true,
      },
      orderBy:{
        createdAt:'desc'
      }
    });

    // JSON olarak veriyi geri döndürüyoruz
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Veri alınırken bir hata oluştu' });
  }
}