import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});
const bucket = storage.bucket("techsepet1");

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();
    
    // URL'den dosya adını çıkar (örnek: "https://storage.googleapis.com/techsepet1/images/Adsız.png")
    const fileName = imageUrl.split("/images/")[1]; // "Adsız.png"

    if (!fileName) {
      return NextResponse.json(
        { error: "Geçersiz dosya adı" },
        { status: 400 }
      );
    }

    const file = bucket.file(`images/${fileName}`);
    await file.delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Resim silme hatası:", error);
    return NextResponse.json(
      { error: error.message || "Dahili sunucu hatası" },
      { status: 500 }
    );
  }
}