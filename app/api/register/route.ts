// app/api/register/route.ts

import bcrypt from "bcryptjs";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { testDBConnection } from "@/libs/testDBConnection";

testDBConnection();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Body:", body); // Kayıt API'sine gelen veriyi logluyor

    const { name, surname, email, password, birthday, gender, phone, createdAt, updatedAt } = body;

    // Temel kontroller
    if (!name || !surname || !email || !password) {
      return NextResponse.json(
        { message: "İsim, soyad, e-posta ve şifre gereklidir." },
        { status: 400 }
      );
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Geçerli bir e-posta adresi giriniz." },
        { status: 400 }
      );
    }

    // Aynı e-posta var mı?
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Bu e-posta adresi zaten kullanımda." },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Şifre hash tamamlandı:", hashedPassword);

    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        surname,
        email: email.toLowerCase(),
        hashedPassword,
        birthday: birthday || null,
        gender: gender || null,
        phone: phone || null,
        createdAt: createdAt || new Date(),
        updatedAt: updatedAt || new Date(),
      },
    });

    console.log("Kullanıcı oluşturuldu:", user);
    return NextResponse.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Hata:", error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      console.error("Bilinmeyen hata:", error);
      return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
    }
  }
}
