import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Doğrulama token'ı gereklidir." }, { status: 400 });
  }

  // Token ile eşleşen kullanıcıyı bul
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    return NextResponse.json({ error: "Geçersiz veya süresi dolmuş doğrulama bağlantısı." }, { status: 400 });
  }

  // Token süresini kontrol et
  if (user.verificationTokenExpiry && new Date(user.verificationTokenExpiry) < new Date()) {
    return NextResponse.json({ error: "Doğrulama bağlantısının süresi dolmuş." }, { status: 400 });
  }

  // Kullanıcıyı doğrula ve token'ı kaldır
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  return NextResponse.json({ message: "E-posta başarıyla doğrulandı." });
}
