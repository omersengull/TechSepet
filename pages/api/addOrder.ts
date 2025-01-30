import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { userId, addressId, items, totalPrice } = req.body;

    // Eksik alanları kontrol et
    if (!userId || !addressId || !items || !totalPrice) {
      return res.status(400).json({ success: false, message: "Eksik alanlar var." });
    }

    // Siparişi oluştur
    const newOrder = await prisma.order.create({
      data: {
        userId,
        addressId,
        items: JSON.stringify(items),
        totalPrice: parseFloat(totalPrice),
      } as any, // **TypeScript tipi bypass etmek için**
    });

    // Kullanıcı ve adres bilgilerini ayrıca çekiyoruz
    const orderWithDetails = await prisma.order.findUnique({
      where: { id: newOrder.id },
      include: {
        user: true, // Kullanıcı bilgilerini getir
      },
    });

    // Adres bilgilerini ayrıca çekiyoruz (Çünkü Prisma `address` için doğrudan include desteklemiyor)
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    return res.status(201).json({
      success: true,
      order: {
        ...orderWithDetails,
        address, // Adres bilgisi manuel olarak ekleniyor
      },
    });

  } catch (error) {
    console.error('Sipariş eklenirken hata oluştu:', error);
    return res.status(500).json({ success: false, message: 'Sipariş eklenemedi.', error: error.message });
  }
}
