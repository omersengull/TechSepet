import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    // Kullanıcı doğrulama
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return new NextResponse("Kullanıcı oturum açmamış.", { status: 401 });
    }
    if (currentUser.role !== "ADMIN") {
        return new NextResponse("Yetkisiz erişim.", { status: 403 });
    }

    // Parametre kontrolü
    if (!params || !params.id) {
        return new NextResponse("Geçersiz parametre.", { status: 400 });
    }

    try {
        // Ürün silme işlemi
        const product = await prisma.product.delete({
            where: {
                id: params.id,
            },
        });
        return NextResponse.json(product);
    } catch (error) {
        // Veritabanı hatası
        return new NextResponse(`Veritabanı hatası: ${error.message}`, { status: 500 });
    }
}
