import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "E-posta adresi gereklidir." }, { status: 400 });
  }

  // 📌 Kullanıcıyı veritabanında ara
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Bu e-posta adresine ait kullanıcı bulunamadı." }, { status: 404 });
  }

  try {
    // 📌 Şifre sıfırlama token'ı oluştur
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 saat geçerli

    // 📌 Token'ı veritabanına kaydet
    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    // 📌 Base URL'yi belirle (Lokal ve Production için)
    const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    // 📌 E-posta servisini yapılandır
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📌 Kullanıcıya e-posta gönder
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Şifre Sıfırlama Talebi",
      html: `<p>Şifrenizi sıfırlamak için <a href="${resetLink}">buraya tıklayın</a>.</p>`,
    });

    return NextResponse.json({ message: "Şifre sıfırlama bağlantısı gönderildi." });
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return NextResponse.json({ error: "E-posta gönderilemedi." }, { status: 500 });
  }
}
