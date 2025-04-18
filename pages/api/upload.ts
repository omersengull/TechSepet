import { Storage } from "@google-cloud/storage";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { fileName, fileContent } = req.body;

        try {
            const storage = new Storage({
                projectId: process.env.GCP_PROJECT_ID,
                credentials: {
                    client_email: process.env.GCP_CLIENT_EMAIL,
                    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                },
            });
            const bucket = storage.bucket("techsepet1");
            const file = bucket.file(`images/${fileName}`);

            const buffer = Buffer.from(fileContent, "base64");
            const contentType = req.headers["content-type"] || "image/jpeg";

            await file.save(buffer, {
                metadata: { contentType },
                resumable: false,
            });

            const publicUrl = `https://storage.googleapis.com/techsepet1/images/${fileName}`;
            res.status(200).json({ url: publicUrl });

        } catch (error) {
            console.error("Kritik Hata Detayı:", error);
            res.status(500).json({
                error: "Yükleme başarısız",
                technicalDetails: error.message
            });
        }
    } else {
        res.status(405).json({ error: "Sadece POST metoduna izin verilir" });
    }
}