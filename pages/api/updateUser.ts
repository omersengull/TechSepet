import prisma from "@/libs/prismadb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id, birthday, ...data } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Kullanıcı ID'si eksik." });
    }

    // Eğer birthday alanı varsa, formatını kontrol edin ve dönüştürün
    if (birthday) {
      const parsedDate = new Date(birthday);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Geçersiz doğum tarihi formatı." });
      }
      data.birthday = parsedDate; // ISO formatında veritabanına kaydedilecek
    }

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    // Güncellenmiş kullanıcıyı formatlanmış şekilde döndür
    if (updatedUser.birthday) {
      const date = new Date(updatedUser.birthday);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      updatedUser.birthday = `${year}-${month}-${day}`; // YYYY-MM-DD formatında döndür
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
}
