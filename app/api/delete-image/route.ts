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
    const fileNamePart = imageUrl.split("/images/")[1]?.split("?")[0]; // "Adsız.png"

    if (!fileNamePart) {
      return NextResponse.json(
        { error: "Geçersiz dosya adı" },
        { status: 400 }
      );
    }
    const fileName = decodeURIComponent(fileNamePart);
    const file = bucket.file(`images/${fileName}`);
    await file.delete().catch(error => {
      if (error.code === 404) {
        console.log("Dosya zaten silinmiş, devam ediliyor");
        return; // 404 hatasını görmezden gel
      }
      throw error;
    });;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Resim silme hatası:", error);
    return NextResponse.json(
      { error: error.message || "Dahili sunucu hatası" },
      { status: 500 }
    );
  }
}