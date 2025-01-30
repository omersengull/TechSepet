import { Storage } from "@google-cloud/storage";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { fileName, fileContent } = req.body;

        const storage = new Storage();
        const bucketName = "techsepet1"; // GCP bucket adınızı yazın
        const destination = `images/${fileName}`;

        try {
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(destination);
            await file.save(fileContent, {
                resumable: false,
                contentType: "image/jpeg", // Gerekli dosya tipini ayarlayın
            });
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
            res.status(200).json({ url: publicUrl });
        } catch (error) {
            console.error("Hata:", error);
            res.status(500).json({ error: "Dosya yüklenirken bir hata oluştu" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
