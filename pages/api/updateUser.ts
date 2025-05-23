import prisma from "@/libs/prismadb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id, birthday, addresses, ...data } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Kullanıcı ID'si eksik." });
    }

    // Eğer birthday varsa, formatını kontrol edin ve Date nesnesine dönüştürün
    if (birthday) {
      const parsedDate = new Date(birthday);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Geçersiz doğum tarihi formatı." });
      }
      data.birthday = parsedDate;
    }

    // Eğer addresses boş stringse, güncelleme verisine eklemiyoruz
    if (addresses && addresses !== "") {
      // Eğer addresses güncellenecekse, uygun nested update formatını burada belirleyin.
      // Örneğin, adresler bir dizi ise:
      data.addresses = { set: addresses }; // Veya uygun nested yapı
    }

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    // Doğum tarihini formatla (YYYY-MM-DD)
    const formattedUser = {
      ...updatedUser,
      birthday: updatedUser.birthday
        ? updatedUser.birthday.toISOString().split("T")[0]
        : null,
    };

    return res.status(200).json(formattedUser);
  } catch (error) {
    console.error("Update user error:", error);
    return res
      .status(500)
      .json({ message: "Sunucu hatası", error: error.message });
  }
}
