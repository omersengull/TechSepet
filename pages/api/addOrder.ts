import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, items, totalPrice } = req.body;

      // Prisma ile siparişi ekleyin
      const newOrder = await prisma.order.create({
        data: {
          userId,
          items: JSON.stringify(items), // items bir array ise JSON string yapabilirsiniz
          totalPrice,
        },
      });

      return res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      console.error('Error adding order:', error);
      return res.status(500).json({ success: false, message: 'Order could not be added.' });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}