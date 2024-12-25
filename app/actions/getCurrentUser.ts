"use server"
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import prisma from "@/libs/prismadb";

// `getSession` fonksiyonu oturum bilgisini alır
export async function getSession() {
    try {
        const session = await getServerSession(authOptions);
        console.log("Oturum Bilgisi:", session); // Oturum bilgisini logla
        return session;
    } catch (error) {
        console.error("getSession hatası:", error);
        return null;
    }
}

// `getCurrentUser` fonksiyonu oturum bilgisine göre geçerli kullanıcıyı getirir
export async function getCurrentUser() {
    try {
        const session = await getServerSession(authOptions);

        // Oturum kontrolü
        if (!session?.user?.email) {
            return null;
        }

        // Kullanıcıyı veritabanından çek
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                surname: true,
                birthday: true,
                email: true,
                image: true,
                role: true,
                phone: true,
                gender: true,
                addresses: true, // Adres bilgisi dahil edildi
                createdAt: true,
                updatedAt: true,
                emailVerified: true,
            },
        });

        // Eğer kullanıcı bulunamazsa
        if (!currentUser) {
            return null;
        }

        // Kullanıcı verisini dönüştür ve döndür
        return {
            ...currentUser,
            addresses: currentUser.addresses || null, // Adres null olabiliyorsa kontrol et
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null,
        };
    } catch (error) {
        console.error("Kullanıcı alınamadı:", error);
        return null;
    }
}
