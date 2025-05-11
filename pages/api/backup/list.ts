import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
export const config = {
  api: {
    bodyParser: false,     
    externalResolver: true,   
  },
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  

  const client = new MongoClient(process.env.MONGODB_URI!);
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB!);


    const files = await db.collection('backups.files')
      .find()
      .sort({ uploadDate: -1 }) 
      .project({ filename: 1, _id: 0 })
      .toArray();

    const backups = files.map(file => file.filename);
    res.status(200).json({ backups });
  } catch (error) {
     console.error('Listeleme hatası:', error);
    console.error(error.stack);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Listeleme başarısız',
      stack: error instanceof Error ? error.stack : undefined
    });
  } finally {
    await client.close();
  }
}