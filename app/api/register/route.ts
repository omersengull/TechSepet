import bcrypt from "bcryptjs"
import prisma from "@/libs/prismadb"
import { NextResponse } from "next/server";
import { testDBConnection } from "@/libs/testDBConnection";

testDBConnection();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Body:", body);  // Gelen body'yi günlüğe kaydet

        const { name,surname, email, password ,birthday,male,phone} = body;

        // Verilerin eksik olup olmadığını kontrol et
        if (!name || !surname || !email || !password) {
            throw new Error("Name, email, and password are required.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Şifre hash tamamlandı:", hashedPassword);  // Hash'lenmiş şifreyi günlüğe kaydet

        const user = await prisma.user.create({
            data: {
                name,
                surname,
                email,
                hashedPassword,
                birthday,
                male,
                phone,

            }
        });

        console.log("Kullanıcı oluşturuldu:", user);  // Oluşturulan kullanıcıyı günlüğe kaydet
        return NextResponse.json(user);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Hata:", error.message);  // Hata mesajını günlüğe kaydet
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            console.error("Bilinmeyen hata:", error); // Bilinmeyen hataları yakala
            return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
        }
    }
}
