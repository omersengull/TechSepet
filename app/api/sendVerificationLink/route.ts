import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "E-posta adresi gereklidir." },
      { status: 400 }
    );
  }

  // 📌 Kullanıcıyı veritabanında ara
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Bu e-posta adresine ait kullanıcı bulunamadı." },
      { status: 404 }
    );
  }

  try {
    // 📌 E-posta doğrulama token'ı oluştur
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 1); // 1 saat geçerli

    // 📌 Token'ı veritabanına kaydet
    await prisma.user.update({
      where: { email },
      data: { verificationToken, verificationTokenExpiry },
    });

    // 📌 Base URL'yi belirle (Lokal ve Production için)
    const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const verificationLink = `${baseUrl}/verify?token=${verificationToken}`;

    // 📌 E-posta servisini yapılandır
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📌 Kullanıcıya doğrulama e-postası gönder
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "E-Posta Doğrulama",
      html: `<p>E-posta adresinizi doğrulamak için <a href="${verificationLink}">buraya tıklayın</a>.</p>`,
    });

    return NextResponse.json({
      message: "Doğrulama bağlantısı gönderildi.",
    });
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return NextResponse.json(
      { error: "E-posta gönderilemedi." },
      { status: 500 }
    );
  }
}
export {}