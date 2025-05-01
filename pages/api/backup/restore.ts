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

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    const backupData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const [collectionName, documents] of Object.entries(backupData)) {
      if (!Array.isArray(documents)) continue;

      const collection = db.collection(collectionName);

      for (const doc of documents) {
        const filter = { _id: doc._id };
        const update = { $set: doc };
        const options = { upsert: true }; // yoksa ekle, varsa güncelle

        await collection.updateOne(filter, update, options);
      }
    }

    await client.close();
    res.status(200).json({ message: 'Yedek veriler başarıyla geri yüklendi (güncellendi).' });
  } catch (error) {
    console.error('Geri yükleme hatası:', error);
    res.status(500).json({ message: 'Geri yükleme sırasında bir hata oluştu.' });
  }
}
