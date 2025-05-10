import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, GridFSBucket } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new MongoClient(process.env.MONGODB_URI!, {
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    maxPoolSize: 1 // Vercel'de bağlantı sorunlarını önlemek için
  });

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB!);
    const bucket = new GridFSBucket(db, { bucketName: 'backups' });

    // 1. Tüm koleksiyonları al (daha hızlı için sadece gerekli koleksiyonları seçin)
    const collections = await db.listCollections().toArray();
    const backupData: Record<string, any[]> = {};

    // 2. Paralel veri çekme
    await Promise.all(collections.map(async (colInfo) => {
      const col = db.collection(colInfo.name);
      backupData[colInfo.name] = await col.find().limit(1000).toArray(); // Limit ekleyin
    }));

    // 3. Stream ile yazma işlemi
    const fileName = `backup_${Date.now()}.json`;
    const uploadStream = bucket.openUploadStream(fileName);
    
    // Yedek veriyi küçük parçalarla yaz
    const jsonString = JSON.stringify(backupData);
    const chunkSize = 1024 * 1024; // 1MB chunk'lar
    
    for (let i = 0; i < jsonString.length; i += chunkSize) {
      const chunk = jsonString.slice(i, i + chunkSize);
      uploadStream.write(chunk);
    }

    uploadStream.end();

    // 4. Yazma işleminin tamamlanmasını bekle
    await new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });

    return res.status(200).json({
      success: true,
      backup: fileName,
      message: 'Yedek başarıyla oluşturuldu'
    });

  } catch (error) {
    console.error('Yedekleme hatası:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  } finally {
    setTimeout(() => client.close().catch(console.error), 2000);
  }
}