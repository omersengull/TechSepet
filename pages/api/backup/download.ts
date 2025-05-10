import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, GridFSBucket } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD');
        return res.status(200).end();
    }

    if (req.method === 'HEAD') {
        // HEAD isteği için basit bir yanıt
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET', 'HEAD']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
 
 
    try {
        const { file } = req.query;
        if (!file || typeof file !== 'string') {
            return res.status(400).json({ error: 'Dosya adı gereklidir' });
        }

        const client = new MongoClient(process.env.MONGODB_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000,
            serverSelectionTimeoutMS: 30000,
            retryWrites: true,
            w: 'majority'
        });

        await client.connect();
        const db = client.db(process.env.MONGODB_DB!);
        const bucket = new GridFSBucket(db, { bucketName: 'backups' });

        // Dosya varlığını kontrol et
        const fileExists = await db.collection('backups.files').countDocuments({ filename: file });
        if (fileExists === 0) {
            return res.status(404).json({ error: 'Dosya bulunamadı' });
        }

        // Stream ayarları
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${file}"`);
        res.setHeader('Access-Control-Allow-Origin', '*');

        const downloadStream = bucket.openDownloadStreamByName(file);
        downloadStream.pipe(res);

        // Bağlantıyı kapatmayı stream bitimine bırak
        downloadStream.on('end', () => client.close());
        downloadStream.on('error', () => client.close());

    } catch (error) {
        console.error('İndirme hatası:', error);
        return res.status(500).json({ error: 'Dosya indirilemedi' });
    }
}