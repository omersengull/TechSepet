import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET() {
    try {
        const categories = [
            { name: "Telefon" },
            { name: "Akıllı Saat" },
            { name: "Laptop" },
            { name: "Kulaklık" },
            { name: "Monitör" },
            { name: "Klavye" },
            { name: "Mouse" },
            { name: "Televizyon" },
            { name: "Oyun Konsolu" },
            { name: "Kamera" }
        ];

        await prisma.category.createMany({
            data: categories
        });

        console.log("Kategoriler başarıyla eklendi.");
        return NextResponse.json({ message: "Kategoriler başarıyla eklendi." });
    } catch (error) {
        console.error("Hata:", error);
        return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
    }
}
