// pages/api/backup/list.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const backupDir = path.join(process.cwd(), 'backups');
    
    if (!fs.existsSync(backupDir)) {
      return res.status(404).json({ message: 'Yedek dosyası bulunamadı.' });
    }

    // Yedekleme klasöründeki dosyaları listele
    const backupFiles = fs.readdirSync(backupDir).sort().reverse();

    // Yedekleme dosyalarını JSON formatında döndür
    res.status(200).json({ backups: backupFiles });
  } catch (error) {
    console.error('Yedekleme dosyalarını listeleme hatası:', error);
    res.status(500).json({ message: 'Yedekleme dosyalarını listeleme sırasında bir hata oluştu.' });
  }
}
