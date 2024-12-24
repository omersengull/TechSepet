import { PrismaClient } from '@prisma/client';
import toast from 'react-hot-toast';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // URL'deki id parametresini al

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Geçerli bir ID sağlanmalıdır.' });
  }

  if (req.method === 'DELETE') {
    try {
      // Veritabanından adresi silme
      const deletedAddress = await prisma.address.delete({
        where: { id },
      });
      toast.success("Adres başarıyla silindi.")
      return res.status(200).json({
        success: true,
        message: 'Adres başarıyla silindi.',
        address: deletedAddress,
      });
      
    } catch (error) {
      console.error('Adres silme hatası:', error);

      // Hata tipine göre farklı bir yanıt döndürme
      if (error.code === 'P2025') {
        // Prisma'da kayıt bulunamadığında dönen hata kodu
        return res.status(404).json({ success: false, error: 'Adres bulunamadı.' });
      }

      return res.status(500).json({ success: false, error: 'Sunucu hatası.' });
    }
  } else {
    // DELETE dışında bir HTTP metodu gönderilirse
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ success: false, error: 'Yalnızca DELETE metodu destekleniyor.' });
  }
}
