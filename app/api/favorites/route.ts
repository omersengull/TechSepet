import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // ✅ DOĞRU YERDEN IMPORT

const prisma = new PrismaClient();

// ⭐ Favorilere ürün ekleme (POST)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }
        const { productId } = await req.json();
        const userId = session.user.id;

        console.log("Favoriye ekleme isteği:", { userId, productId });
        
        // Eğer zaten favoriye eklenmişse tekrar ekleme
        const existingFavorite = await prisma.favorite.findFirst({
            where: { userId, productId }
        });

        if (existingFavorite) {
            return NextResponse.json({ message: "Bu ürün zaten favorilerde" }, { status: 200 });
        }

        await prisma.favorite.create({
            data: { userId, productId }
        });

        return NextResponse.json({ message: "Favorilere eklendi" }, { status: 201 });
    } catch (error: any) {
        console.error("Favoriye eklenirken hata oluştu:", error.message, error.stack);
        return NextResponse.json({ error: "Favori eklenemedi", details: error.message }, { status: 500 });
    }
}

// ⭐ Favori sorgulama (GET)
// Eğer query string içerisinde productId varsa; o ürünün favori olup olmadığı kontrol edilir.
// Aksi halde kullanıcının tüm favorileri listelenir.
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const productId = searchParams.get("productId");

        if (!userId) {
            return NextResponse.json({ error: "Kullanıcı ID bulunamadı" }, { status: 400 });
        }

        if (productId) {
            const favorite = await prisma.favorite.findFirst({
                where: { userId, productId }
            });
            return NextResponse.json({ isFavorite: Boolean(favorite) });
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: { product: true },
        });

        // Eğer duplicate kayıt oluşmuşsa, tekrarlananları kaldır
        const uniqueFavorites = favorites.filter(
            (fav, index, self) =>
                index === self.findIndex(t => t.productId === fav.productId)
        );

        return NextResponse.json(uniqueFavorites);
    } catch (error) {
        console.error("Favori listesi alınırken hata:", error);
        return NextResponse.json({ error: "Favori listesi alınamadı" }, { status: 500 });
    }
}

// ⭐ Favori ürün kaldırma (DELETE)
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }

        const { productId } = await req.json();
        const userId = session.user.id;

        console.log("Favoriden kaldırma isteği:", { userId, productId });

        // Aynı kullanıcı ve ürün için varsa tüm favori kayıtlarını sil
        const deletionResult = await prisma.favorite.deleteMany({
            where: { userId, productId }
        });

        if (deletionResult.count === 0) {
            return NextResponse.json({ error: "Bu ürün favorilerde bulunamadı" }, { status: 404 });
        }

        return NextResponse.json({ message: "Favoriden kaldırıldı" }, { status: 200 });
    } catch (error: any) {
        console.error("Favoriden kaldırma hatası:", error.message, error.stack);
        return NextResponse.json({ error: "Favoriden kaldırma hatası", details: error.message }, { status: 500 });
    }
}
