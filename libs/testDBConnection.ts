import prisma from "@/libs/prismadb";

export async function testDBConnection() {
  try {
    await prisma.user.findFirst(); // Örnek bir sorgu
    console.log("Bağlantı başarılı!");
  } catch (error) {
    console.error("Veritabanı bağlantı hatası:", error);
  }
}
