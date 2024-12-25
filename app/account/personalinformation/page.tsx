"use client";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import React, { useState, useEffect } from "react";

interface User {
  name?: string;
  surname?: string;
  birthday?: string;
  phone?: string;
  email?: string;
  gender?: string;
  role?: string;
  addresses?: string | null;
}

const Page = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initialUser, setInitialUser] = useState<User | null>(null);
  const [change, setChange] = useState(false);

  // Giriş alanlarının değerini güncellemek için
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [id]: id === "birthday" ? new Date(value).toISOString() : value, // Tarihi ISO formatına çevir
      };
    });
  };

  // Tarihi formatlamak için
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Aylar 0'dan başlar
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Kullanıcı bilgilerini güncellemek için
  const updatePersonalInformation = async () => {
    try {
      const response = await fetch("/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Sunucu Hatası Yanıtı:", errorText);
        alert(`Sunucu hatası: ${response.status}`);
        return;
      }

      alert("Bilgiler başarıyla güncellendi!");
      if (currentUser) setInitialUser(currentUser); // Başarıyla güncellendiğinde initialUser'ı değiştir
      setChange(false); // Değişiklik olmadığını belirt
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Bir hata oluştu.");
    }
  };

  // İlk kullanıcı bilgilerini almak için
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();

        // Kullanıcı verisini User arayüzüne dönüştür
        const mappedUser: User = {
          name: user.name ?? undefined,
          surname: user.surname ?? undefined,
          birthday: user.birthday ? new Date(user.birthday).toISOString() : undefined,
          phone: user.phone ?? undefined,
          email: user.email ?? undefined,
          gender: user.gender ?? undefined,
          role: user.role ?? undefined,
          addresses: user.addresses ?? null,
        };

        setInitialUser(mappedUser);
        setCurrentUser(mappedUser);
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
      }
    };
    fetchUser();
  }, []);

  // Değişiklik durumunu kontrol etmek için
  useEffect(() => {
    if (currentUser && initialUser) {
      const isChanged = JSON.stringify(currentUser) !== JSON.stringify(initialUser);
      setChange(isChanged);
    }
  }, [currentUser, initialUser]);

  if (!currentUser) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="container lg:h-screen text-sm md:text-lg ">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl mb-4 mt-4">Kullanıcı Bilgilerim</h1>
        <h2 className="text-lg text-slate-500 mb-4 mt-4">
          Bilgilerinizi burada düzenleyebilir ve güncelleyebilirsiniz.
        </h2>

        <div className="flex md:gap-8 gap-2">
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="name">
              Ad
            </label>
            <input
              id="name"
              type="text"
              value={currentUser?.name || ""}
              onChange={handleInputChange}
              className="border-2 p-2 w-56 outline-renk1 rounded-lg"
            />
          </div>

          <div className="flex flex-col mb-5">
            <label className="mb-1" htmlFor="surname">
              Soyad
            </label>
            <input
              id="surname"
              type="text"
              value={currentUser?.surname || ""}
              onChange={handleInputChange}
              className="border-2 p-2 w-56 outline-renk1 rounded-lg"
            />
          </div>
        </div>
        <div className="">
          <label className="mb-4" htmlFor="birthday">
            Doğum Günü
          </label>
          <div className="flex border-2 p-2 items-center md:w-120 w-[455px] rounded-lg outline-renk1">
            <input
              id="birthday"
              type="date"
              onChange={handleInputChange}
              value={currentUser?.birthday?.split("T")[0] || ""}
              className="w-full outline-none"
            />
          </div>
          <div className="mt-5">
            <label className="mb-2 mt-4">Cinsiyet</label>
            <div className="items-center block">
              <input
                type="radio"
                name="gender"
                id="male"
                value="male"
                className="mr-2"
                checked={currentUser?.gender === "male"}
                onChange={(e) =>
                  setCurrentUser((prev) => ({ ...prev, gender: e.target.value }))
                }
              />
              <label htmlFor="male">Erkek</label>
            </div>
            <div className="inline items-center">
              <input
                type="radio"
                name="gender"
                id="female"
                value="female"
                className="mr-2"
                checked={currentUser?.gender === "female"}
                onChange={(e) =>
                  setCurrentUser((prev) => ({ ...prev, gender: e.target.value }))
                }
              />
              <label htmlFor="female">Kadın</label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="gap-2">
          <h1 className="text-2xl text-center mb-5">İletişim Bilgileri</h1>
          <div className="ml-2">
            <label htmlFor="phone">Telefon Numarası</label>
            <input
              value={currentUser?.phone || ""}
              className="flex md:w-120 w-[458px] px-2 mb-2 mt-2 text-start items-start border-2 outline-renk1 rounded-lg h-10"
              type="text"
              id="phone"
              onChange={handleInputChange}
            />
            <label htmlFor="email">E-Mail Adresiniz</label>
            <input
              value={currentUser?.email || ""}
              className="flex md:w-120 w-[458px] px-2 mb-2 mt-2 text-start items-start border-2 outline-renk1 rounded-lg h-10"
              type="email"
              id="email"
              onChange={handleInputChange}
            />
            <button
              className={`md:w-120 w-[458px] py-2 rounded-xl text-white mt-2 mb-20 ${
                change ? "bg-renk1" : "bg-slate-400 cursor-not-allowed"
              }`}
              onClick={updatePersonalInformation}
              disabled={!change}
            >
              Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
