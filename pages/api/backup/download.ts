import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, GridFSBucket } from 'mongodb';

export const config = {
  api: { bodyParser: false, externalResolver: true }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD');
    return res.status(200).end();
  }
  if (req.method === 'HEAD') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end();
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'HEAD']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { file } = req.query;
  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'Dosya adı gereklidir' });
  }

  const client = new MongoClient(process.env.MONGODB_URI!, {
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    maxPoolSize: 1,
    retryWrites: true,
    w: 'majority'
  });

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB!);
    const bucket = new GridFSBucket(db, { bucketName: 'backups' });

    const count = await db.collection('backups.files').countDocuments({ filename: file });
    if (count === 0) {
      return res.status(404).json({ error: 'Dosya bulunamadı' });
    }

    // Indirme headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${file}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');

    const downloadStream = bucket.openDownloadStreamByName(file);
    downloadStream.pipe(res);

    // Bağlantıyı, response kapanınca kapat
    res.on('close', () => {
      downloadStream.destroy();
      client.close();
    });
  } catch (error) {
    console.error('İndirme hatası:', error);
    res.status(500).json({ error: 'Dosya indirilemedi' });
  }
}
