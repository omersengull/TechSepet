import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    // Tüm koleksiyonları al
    const collections = await db.collections();
    const backupData: Record<string, any[]> = {};

    for (const collection of collections) {
      const name = collection.collectionName;
      const data = await collection.find().toArray();
      backupData[name] = data;
    }

    // Saat ve tarih formatlı dosya adı
    const timestamp = new Date().toISOString()
      .replace(/T/, '_')
      .replace(/:/g, '-')
      .replace(/\..+/, ''); // "2025-04-30_21-47-00"

    const fileName = `backup_${timestamp}.json`;

    const backupDir = path.join('/tmp', 'backups'); // ✨ Sadece bu satırı değiştir
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const filePath = path.join(backupDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    client.close();

    // Geriye dosya adı ve güncel backup listesi dön
    const updatedBackups = fs.readdirSync(backupDir).sort().reverse();
    res.status(200).json({ message: 'Yedek oluşturuldu', backup: fileName, backups: updatedBackups });

  } catch (err) {
    console.error('Yedekleme hatası:', err);
    res.status(500).json({ error: 'Yedekleme işlemi başarısız oldu.' });
  }
}
