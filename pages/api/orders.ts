import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Tüm siparişleri veritabanından alıyoruz
      const orders = await prisma.order.findMany({
        orderBy: {
          createdAt: 'desc', // Siparişleri oluşturulma tarihine göre sıralıyoruz
        },
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ success: false, message: 'Orders could not be fetched.' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
