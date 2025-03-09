// app/api/seedSpecifications/route.ts (Next.js App Router için)
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET() {
    try {
        const categories = await prisma.category.findMany();

        if (!categories || categories.length === 0) {
            return NextResponse.json({ message: "Hiçbir kategori bulunamadı!" }, { status: 404 });
        }

        const specifications = {
            Telefon: ["Marka ve Model", "İşletim Sistemi", "İşlemci", "RAM", "Depolama Alanı"],
            "Akıllı Saat": ["Marka ve Model", "Uyumluluk", "Kasa Malzemesi", "Kasa Boyutu"],
            Laptop: ["Marka ve Model", "İşletim Sistemi", "İşlemci", "RAM", "Depolama"],
            Kulaklık: ["Marka ve Model", "Kulaklık Tipi", "Bağlantı Türü", "Kullanım Amacı"],
            Monitör: ["Marka ve Model", "Ekran Boyutu", "Ekran Çözünürlüğü", "Panel Tipi"],
            Klavye: ["Marka ve Model", "Klavye Türü", "Bağlantı Türü", "Tuş Dizilimi"],
            Mouse: ["Marka ve Model", "Mouse Türü", "Bağlantı Türü", "Sensör Türü"],
            Televizyon: ["Marka ve Model", "Ekran Boyutu", "Ekran Teknolojisi", "Çözünürlük"],
            "Oyun Konsolu": ["Marka ve Model", "Konsol Türü", "İşlemci", "Grafik İşlemci"],
            Kamera: ["Marka ve Model", "Kamera Türü", "Sensör Boyutu", "Sensör Çözünürlüğü"]
        };

        // Tüm kategoriler için verileri paralel olarak ekleyelim
        const createPromises = categories.map(async (category) => {
            const specs = specifications[category.name];

            if (specs) {
                const specData = specs.map((name) => ({
                    name,
                    categoryId: category.id
                }));

                // Prisma ile toplu ekleme işlemi
                return prisma.specification.createMany({ data: specData });
            }
            return null;
        });

        // Paralel işlemleri bekle
        await Promise.all(createPromises);

        console.log("✅ Tüm özellikler başarıyla eklendi.");
        return NextResponse.json({ message: "Tüm özellikler başarıyla eklendi." }, { status: 200 });

    } catch (error) {
        console.error("❌ Hata:", error);
        return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
    }
}
