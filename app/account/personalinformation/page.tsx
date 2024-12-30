"use client";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { useSpinner } from "@/app/spinner/SpinnerContext";
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
  const {setIsLoading}=useSpinner();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initialUser, setInitialUser] = useState<User | null>(null);
  const [change, setChange] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [id]: id === "birthday" ? new Date(value).toISOString() : value,
      };
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

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
      if (currentUser) setInitialUser(currentUser);
      setChange(false);
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Bir hata oluştu.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();

        if (user) {
          const mappedUser: User = {
            name: user.name ?? undefined,
            surname: user.surname ?? undefined,
            birthday: user.birthday ? new Date(user.birthday).toISOString() : undefined,
            phone: user.phone ?? undefined,
            email: user.email ?? undefined,
            gender: user.gender ?? undefined,
            role: user.role ?? undefined,
            addresses: user.addresses?.toString() ?? null,
          };

          setInitialUser(mappedUser);
          setCurrentUser(mappedUser);
        } else {
          console.error("Kullanıcı bilgisi null döndü.");
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser && initialUser) {
      const isChanged = JSON.stringify(currentUser) !== JSON.stringify(initialUser);
      setChange(isChanged);
    }
  }, [currentUser, initialUser]);

  if (!currentUser) {
    setIsLoading(true);
    return <div className="min-h-screen"></div>;
  }

  return (
    <div className="container lg:h-screen text-sm md:text-lg ">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl mb-4 mt-4">Kullanıcı Bilgilerim</h1>
        <h2 className="text-lg text-center text-slate-500 mb-4 mt-4">
          Bilgilerinizi burada düzenleyebilir ve güncelleyebilirsiniz.
        </h2>

        <div className="flex flex-wrap md:gap-8 gap-4 w-full">
          <div className="flex flex-col w-full md:w-[48%]">
            <label className="mb-1" htmlFor="name">
              Ad
            </label>
            <input
              id="name"
              type="text"
              value={currentUser?.name || ""}
              onChange={handleInputChange}
              className="border-2 p-2 w-full outline-renk1 rounded-lg"
            />
          </div>

          <div className="flex flex-col w-full md:w-[48%]">
            <label className="mb-1" htmlFor="surname">
              Soyad
            </label>
            <input
              id="surname"
              type="text"
              value={currentUser?.surname || ""}
              onChange={handleInputChange}
              className="border-2 p-2 w-full outline-renk1 rounded-lg"
            />
          </div>
        </div>
        <div className="w-full">
          <label className="mb-4" htmlFor="birthday">
            Doğum Günü
          </label>
          <div className="flex border-2 p-2 items-center w-full rounded-lg outline-renk1">
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
            <div className="flex gap-4">
              <div className="flex items-center">
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
              <div className="flex items-center">
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
      </div>
      <div className="flex flex-col items-center">
        <div className="gap-2 w-full">
          <h1 className="text-2xl text-center mb-5">İletişim Bilgileri</h1>
          <div className="w-full">
            <label htmlFor="phone">Telefon Numarası</label>
            <input
              value={currentUser?.phone || ""}
              className="flex w-full px-2 mb-2 mt-2 text-start items-start border-2 outline-renk1 rounded-lg h-10"
              type="text"
              id="phone"
              onChange={handleInputChange}
            />
            <label htmlFor="email">E-Mail Adresiniz</label>
            <input
              value={currentUser?.email || ""}
              className="flex w-full px-2 mb-2 mt-2 text-start items-start border-2 outline-renk1 rounded-lg h-10"
              type="email"
              id="email"
              onChange={handleInputChange}
            />
            <button
              className={`w-full py-2 rounded-xl text-white mt-2 mb-20 ${
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