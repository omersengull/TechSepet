import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Eğer token yoksa, giriş sayfasına yönlendir
    if (!token) {
        console.log("🚨 Token yok, kullanıcı login değil!");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Eğer token varsa, role bilgisini kontrol et
    if (token.role !== "ADMIN") {
        console.log("🚫 Yetkisiz erişim! Kullanıcı admin değil.");
        return NextResponse.redirect(new URL("/", req.url)); // Yetkisiz kullanıcıyı ana sayfaya yönlendir
    }

    console.log("✅ Admin erişimi verildi:", token);
    return NextResponse.next(); // Erişim izni ver
}

// Middleware'in hangi sayfalarda çalışacağını belirle
export const config = {
    matcher: ["/admin/:path*"], // Sadece /admin ve alt sayfaları koruma altına al
};
