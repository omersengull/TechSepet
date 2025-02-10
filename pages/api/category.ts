import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const categories = await prisma.category.findMany({
        distinct: ["name"], // ✅ Sadece benzersiz kategori isimlerini getir
        select: {
          id: true,
          name: true,
        },
      });
      res.status(200).json(categories);
    } catch (error) {
      console.error("Kategori yükleme hatası:", error);
      res.status(500).json({ error: "Kategoriler yüklenemedi." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
