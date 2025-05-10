import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST isteği desteklenir.' });
  }

  const { backup } = req.body;
  if (!backup) {
    return res.status(400).json({ message: 'Yedek adı belirtilmedi.' });
  }

  const filePath = path.join(process.cwd(), 'backups', `${backup}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Yedek dosyası bulunamadı.' });
  }

  let client; // client'ı try dışında tanımladık ki finally'de erişilebilsin

  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // Bu satırı ekledik
    } as any); // TypeScript için 'as any' ekledik çünkü MongoDriver tipleri Next.js ile çakışabilir

    const db = client.db(dbName);
    const backupData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Tüm koleksiyon işlemlerini bir transaction içinde yapmak daha güvenli olur
    const session = client.startSession();
    
    try {
      await session.withTransaction(async () => {
        for (const [collectionName, documents] of Object.entries(backupData)) {
          if (!Array.isArray(documents)) continue;

          const collection = db.collection(collectionName);

          // Toplu işlem için bulkWrite kullanımı (daha performanslı)
          const operations = documents.map(doc => ({
            updateOne: {
              filter: { _id: doc._id },
              update: { $set: doc },
              upsert: true
            }
          }));

          if (operations.length > 0) {
            await collection.bulkWrite(operations, { session });
          }
        }
      });
      
      res.status(200).json({ message: 'Yedek veriler başarıyla geri yüklendi (güncellendi).' });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('Geri yükleme hatası:', error);
    res.status(500).json({ 
      message: 'Geri yükleme sırasında bir hata oluştu.',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}