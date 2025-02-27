import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Token ve yeni şifre gereklidir." }, { status: 400 });
  }

  // 📌 Token geçerli mi kontrol et
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() }, // Token süresi dolmamış olmalı
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Geçersiz veya süresi dolmuş token." }, { status: 400 });
  }

  try {
    // 📌 Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📌 Yeni şifreyi kaydet ve reset token'ı temizle
    await prisma.user.update({
      where: { email: user.email },
      data: {
        hashedPassword: hashedPassword, // ✅ Güvenli şekilde hashlenmiş şifreyi güncelle
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Şifre başarıyla güncellendi." });
  } catch (error) {
    console.error("Şifre güncelleme hatası:", error);
    return NextResponse.json({ error: "Şifre güncellenirken hata oluştu." }, { status: 500 });
  }
}
