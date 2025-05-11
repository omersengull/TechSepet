import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, GridFSBucket } from 'mongodb';

export const config = {
  api: { bodyParser: false, externalResolver: true }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new MongoClient(process.env.MONGODB_URI!, {
    connectTimeoutMS: 30000,
    socketTimeoutMS: 0, // No timeout for operations
    serverSelectionTimeoutMS: 30000,
    maxPoolSize: 1,
    retryWrites: true,
    w: 'majority',
    minPoolSize: 1,
    maxIdleTimeMS: 0 // Keep connection alive indefinitely
  });

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB!);
    const bucket = new GridFSBucket(db, { bucketName: 'backups' });

    // Start a session
    const session = client.startSession({
      defaultTransactionOptions: {
        maxCommitTimeMS: 300000 // 5 minutes
      }
    });

    try {
      // 1) Collect data with session
      const collections = await db.listCollections({}, { session }).toArray();
      const backupData: Record<string, any[]> = {};
      
      for (const { name } of collections) {
        if (name === 'backups.chunks' || name === 'backups.files') continue;
        backupData[name] = await db.collection(name)
          .find({}, { session })
          .limit(1000)
          .toArray();
      }
      
      const jsonString = JSON.stringify(backupData);

      // 2) Create upload stream - GridFS doesn't directly support session in options
      // so we'll use the session for the entire operation context
      const fileName = `backup_${Date.now()}.json`;
      
      // Wrap the upload in the session
      return await session.withTransaction(async () => {
        const uploadStream = bucket.openUploadStream(fileName);

        return new Promise<void>((resolve) => {
          uploadStream.once('error', err => {
            console.error('Backup write error:', err);
            if (!res.headersSent) {
              res.status(500).json({ success: false, error: err.message });
            }
            resolve();
          });

          uploadStream.once('finish', () => {
            console.log('Backup saved:', fileName);
            if (!res.headersSent) {
              res.status(200).json({
                success: true,
                backup: fileName,
                message: 'Backup created successfully'
              });
            }
            resolve();
          });

          uploadStream.end(jsonString);
        });
      });
    } finally {
      await session.endSession();
      await client.close();
    }
  } catch (error) {
    console.error('Backup error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}