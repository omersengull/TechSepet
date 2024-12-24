import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { userId, title, city, address, postalCode } = req.body;
    if (!userId || !title || !city || !address || !postalCode) {
      return res.status(400).json({
        success: false,
        error: "Tüm alanlar doldurulmalıdır: userId, title, city, address, postalCode",
      });
    }

    try {
      const newAddress = await prisma.address.create({
        data: {
          userId,
          title,
          city,
          address,
          postalCode,
        },
      });

      return res.status(201).json({ success: true, address: newAddress });
    } catch (error) {
      console.error("Veritabanına eklenirken hata:", error);
      return res.status(500).json({ success: false, error: "Sunucu hatası" });
    }
  } else if (req.method === "GET") {
    res.setHeader("Cache-Control", "no-store");

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Kullanıcı ID'si gerekli.",
      });
    }

    try {
      const addresses = await prisma.address.findMany({
        where: { userId },
      });

      return res.status(200).json({ success: true, addresses });
    } catch (error) {
      console.error("Adresler alınırken hata:", error);
      return res.status(500).json({ success: false, error: "Sunucu hatası" });
    }
  } else if (req.method === "PUT") {
    const { id, title, city, address, postalCode } = req.body;

    if (!id || !title || !city || !address || !postalCode) {
      return res.status(400).json({
        success: false,
        error: "Tüm alanlar doldurulmalıdır: id, title, city, address, postalCode",
      });
    }

    try {
      
      const updatedAddress = await prisma.address.update({
        where: { id }, 
        data: {
          title, 
          city,  
          address, 
          postalCode, 

        },
      });

      return res.status(200).json({ success: true, address: updatedAddress });
    } catch (error) {
      console.error("Adres güncellenirken hata:", error);
      return res.status(500).json({ success: false, error: "Sunucu hatası" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Adres ID'si gerekli.",
      });
    }

    try {
      await prisma.address.delete({
        where: { id },
      });

      return res.status(200).json({ success: true, message: "Adres başarıyla silindi." });
    } catch (error) {
      console.error("Adres silinirken hata:", error);
      return res.status(500).json({ success: false, error: "Sunucu hatası" });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: "Yalnızca GET, POST, PUT ve DELETE istekleri desteklenir.",
    });
  }
}
