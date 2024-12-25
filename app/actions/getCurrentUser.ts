"use server"
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import prisma from "@/libs/prismadb";

// `getSession` fonksiyonu, request ve response parametrelerini alacak şekilde değiştirilmiş.
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
export async function getCurrentUser() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return null
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                surname:true,
                birthday:true,
                email: true,
                image: true,
                role: true,
                phone:true,
                gender:true,
                addresses:true,
                createdAt: true,
                updatedAt: true,
                emailVerified: true
            }
        })

        if (!currentUser) { return null; }

        return {
            ...currentUser,
            addresses:currentUser.addresses,
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null,
        }
    } catch (error) {
        console.error("Kullanıcı alınamadı:", error)
        return null
    }
}