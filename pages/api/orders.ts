import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Kullanıcı kimliğini doğrulama örneği (opsiyonel)
      const userId = req.query.userId; // userId parametresiyle siparişleri filtreleyebilirsin

      const orders = await prisma.order.findMany({
        where: userId ? { userId: userId } : {}, // userId varsa filtre uygula
        select: {
          id: true,
          userId: true,
          items: true,
          totalPrice: true,
          createdAt: true,
          addressId: true,
          addressInfo: true,
        },
        orderBy: {
          createdAt: 'desc', // En son siparişler önce gösterilir
        },
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error('Siparişler alınırken hata oluştu:', error);
      res.status(500).json({ error: 'Siparişler alınamadı.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}