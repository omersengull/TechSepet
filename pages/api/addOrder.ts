import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/libs/prismadb";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  amount: number;
  image: string;
}

interface ProcessedItem extends OrderItem {
  originalStock: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { userId, addressId, items: rawItems } = req.body;

    if (!userId || !addressId || !rawItems) {
      return res.status(400).json({
        success: false,
        message: "Eksik alanlar: userId, addressId, items"
      });
    }

    let processedItems: ProcessedItem[] = [];
    let calculatedTotal = 0;

    try {
      const initialItems = typeof rawItems === 'string' ? JSON.parse(rawItems) : rawItems;
      
      if (!Array.isArray(initialItems)) {
        throw new Error("Ürün listesi dizi formatında olmalı");
      }

      // 1. Aşama: Stok Kontrolü ve Veri İşleme
      processedItems = await Promise.all(
        initialItems.map(async (item: any) => {
          if (!item?.productId || !item?.amount) {
            throw new Error("Geçersiz ürün formatı");
          }

          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { 
              id: true, 
              name: true, 
              price: true, 
              stock: true, 
              image: true
            }
          });

          if (!product) {
            throw new Error(`Ürün bulunamadı: ${item.productId}`);
          }

          if (product.stock < item.amount) {
            throw new Error(`Yetersiz stok: ${product.name}`);
          }

          return {
            productId: product.id,
            name: product.name,
            price: product.price,
            amount: item.amount,
            image: product.image,
            originalStock: product.stock
          };
        })
      );

      calculatedTotal = processedItems.reduce((sum, item) => sum + (item.price * item.amount), 0);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz veri",
        error: error.message
      });
    }

    const address = await prisma.address.findUnique({
      where: { id: addressId }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Adres bulunamadı"
      });
    }

    const transaction = await prisma.$transaction(async (prisma) => {
      // Stok Güncellemeleri
      await Promise.all(
        processedItems.map(async (item) => {
          const updated = await prisma.product.update({
            where: { 
              id: item.productId
            },
            data: {
              stock: { decrement: item.amount },
             
            }
          });

          if (updated.stock < 0) {
            throw new Error(`Yetersiz stok: ${item.name}`);
          }
        })
      );

      // Sipariş Oluşturma
      return prisma.order.create({
        data: {
          userId,
          addressId,
          items: JSON.stringify(processedItems.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            amount: item.amount,
            image: item.image
          }))),
          totalPrice: calculatedTotal,
          addressInfo: {
            title: address.title,
            address: address.address,
            city: address.city,
            postalCode: address.postalCode
          }
        },
        include: {
          user: true,
          address: true
        }
      });
    }, { timeout: 10000 });

    return res.status(201).json({
      success: true,
      order: {
        ...transaction,
        items: processedItems,
        address: transaction.address
      }
    });

  } catch (error: any) {
    console.error('Hata:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Beklenmeyen hata'
    });
  }
}