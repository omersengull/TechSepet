import { Storage } from "@google-cloud/storage";
import { NextApiRequest, NextApiResponse } from "next";

const storage = new Storage(); // JSON dosyasını otomatik olarak kullanır
const bucketName = "techsepet1"; // Bucket adınızı yazın

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { fileName, fileContent, contentType } = req.body;

    // Loglama: Gelen verileri kontrol edin
    console.log("Gelen fileName:", fileName);
    console.log("Gelen contentType:", contentType);
    console.log("Gelen fileContent uzunluğu:", fileContent ? fileContent.length : "Eksik");

    if (!fileName || !fileContent || !contentType) {
        return res.status(400).json({ error: "Eksik veri gönderildi." });
    }

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(`images/${fileName}`);
    const buffer = Buffer.from(fileContent, "base64");

    console.log("Dosya kaydediliyor...");
    await file.save(buffer, {
        resumable: false,
        contentType,
        public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/images/${fileName}`;
    console.log("Dosya başarıyla yüklendi:", publicUrl);

    return res.status(200).json({ url: publicUrl });
} catch (error) {
    console.error("Yükleme sırasında bir hata oluştu:", error.message, error.stack);
    return res.status(500).json({ error: "Dosya yüklenirken bir hata oluştu." });
}

};

export default handler;
