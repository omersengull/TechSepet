// pages/api/specifications/[categoryId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { categoryId } = req.query;

  try {
    // Specification'ları kategori ID'ye göre çek
    const specifications = await prisma.specification.findMany({
      where: {
        categoryId: categoryId as string
      },
      select: {
        name: true
      },
      orderBy: {
        name: 'asc' // İsteğe bağlı sıralama
      }
    });

    res.status(200).json(specifications.map(spec => spec.name));
    
  } catch (error) {
    res.status(500).json({ error: 'Özellikler çekilemedi' });
  } finally {
    await prisma.$disconnect();
  }
}