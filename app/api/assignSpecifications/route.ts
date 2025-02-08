import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId, specifications } = body;

        if (!productId || !specifications || !Array.isArray(specifications)) {
            return NextResponse.json({ error: "Eksik veya hatalı veri gönderildi." }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
        }

        // Özellikleri ekleyelim
        for (const spec of specifications) {
            const whereCondition: any = { name: spec.name };

            // categoryId varsa sorguya ekliyoruz
            if (product.categoryId) {
                whereCondition.categoryId = product.categoryId;
            }

            const existingSpec = await prisma.specification.findFirst({
                where: whereCondition
            });

            if (existingSpec) {
                await prisma.productSpecification.create({
                    data: {
                        productId: product.id,
                        specificationId: existingSpec.id,
                        value: spec.value
                    }
                });
            }
        }

        return NextResponse.json({ message: "Özellikler başarıyla atandı." });
    } catch (error) {
        console.error("Hata:", error);
        return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
    }
}
