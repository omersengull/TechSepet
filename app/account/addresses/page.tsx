"use client";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import React, { useState, useEffect, useRef } from "react";
import { LuInfo } from "react-icons/lu";
import { IoIosAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import AddressesCard from "@/app/components/Home/AddressesCard";
import { Address } from "@prisma/client";
import { SkeletonCard } from "@/app/skeleton/skeletonCard";

interface User {
  id: string;
  name: string | null;
  createdAt?: string;
  updatedAt?: string;
  emailVerified: string | null;
  addresses: Address[];
  email: string;
  image: string | number | null;
  gender: string | null;
  surname: string | null;
  phone: string | null;
  birthday: Date | null;
  role: string | null;
}

const Page = () => {
  const [error, setError] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showModal, setShowModal] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [addressTitle, setAddressTitle] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleDelete = (id: string) => {
    setAddresses((prevAddresses) =>
      prevAddresses.filter((address) => address.id !== id)
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser({
            ...currentUser,
            createdAt: currentUser.createdAt,
            updatedAt: currentUser.updatedAt,
            emailVerified: currentUser.emailVerified
              ? currentUser.emailVerified.toString()
              : null,
            addresses: currentUser.addresses || [],
            image: null,
          });
        }
      } catch (err) {
        console.error("Kullanıcı alınamadı:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchAddresses(user.id);
    }
  }, [user]);

  const fetchAddresses = async (userId: string) => {
    try {
      const response = await fetch(`/api/addresses?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Adresler alınamadı");
      }
      const data = await response.json();
      console.log("API'den dönen adresler:", data.addresses);  // ✅ Burada kontrol et
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error("Adresleri alırken hata oluştu:", err);
    }
  };
  


  useEffect(() => {
    setCities([
      "Adana",
      "Adıyaman",
      "Afyonkarahisar",
      "Ağrı",
      "Aksaray",
      "Amasya",
      "Ankara",
      "Antalya",
      "Ardahan",
      "Artvin",
      "Aydın",
      "Balıkesir",
      "Bartın",
      "Batman",
      "Bayburt",
      "Bilecik",
      "Bingöl",
      "Bitlis",
      "Bolu",
      "Burdur",
      "Bursa",
      "Çanakkale",
      "Çankırı",
      "Çorum",
      "Denizli",
      "Diyarbakır",
      "Düzce",
      "Edirne",
      "Elazığ",
      "Erzincan",
      "Erzurum",
      "Eskişehir",
      "Gaziantep",
      "Giresun",
      "Gümüşhane",
      "Hakkâri",
      "Hatay",
      "Iğdır",
      "Isparta",
      "İstanbul",
      "İzmir",
      "Kahramanmaraş",
      "Karabük",
      "Karaman",
      "Kars",
      "Kastamonu",
      "Kayseri",
      "Kırıkkale",
      "Kırklareli",
      "Kırşehir",
      "Kilis",
      "Kocaeli",
      "Konya",
      "Kütahya",
      "Malatya",
      "Manisa",
      "Mardin",
      "Mersin",
      "Muğla",
      "Muş",
      "Nevşehir",
      "Niğde",
      "Ordu",
      "Osmaniye",
      "Rize",
      "Sakarya",
      "Samsun",
      "Şanlıurfa",
      "Siirt",
      "Sinop",
      "Sivas",
      "Şırnak",
      "Tekirdağ",
      "Tokat",
      "Trabzon",
      "Tunceli",
      "Uşak",
      "Van",
      "Yalova",
      "Yozgat",
      "Zonguldak",
    ]);
  }, []);

  const handleAddAddress = async () => {
    if (!addressTitle || !selectedCity || !address || !postalCode) {
      toast.error("Lütfen tüm alanları doldurun!");
      return;
    }

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "", // Varsayılan değer ekle
          title: addressTitle,
          city: selectedCity,
          address: address,
          postalCode: postalCode,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Adres başarıyla eklendi!");
        setAddresses((prev) => [
          ...prev,
          {
            id: data.id ?? "", 
            userId: user?.id ?? "",
            title: addressTitle || "Başlık Yok",
            city: selectedCity || "Şehir Yok",
            address: address || "Adres Yok",
            postalCode: postalCode.toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
        

        setAddressTitle("");
        setSelectedCity("");
        setAddress("");
        setPostalCode("");
        setShowModal(false);
      } else {
        toast.error(data.message || "Adres eklenirken bir hata oluştu!");
      }
    } catch (err) {
      console.error("Sunucu hatası:", err);
      toast.error("Sunucu hatası oluştu!");
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setShowModal(false);
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  };

  return (
    <div className="mx-auto p-4 min-h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl mb-4 text-center">
          Hoş geldiniz, {user?.name || "Misafir"}!
        </h1>
        <h2 className="flex items-center mb-2">
          <LuInfo className="mr-1" />
          Bu sayfada adres ekleme, silme ve düzenleme işlemleri yapabilirsiniz.
        </h2>
      </div>

      <div className="flex flex-col items-center mt-6">
        <button
          onClick={() => {
            setShowModal(true);
            document.addEventListener("mousedown", handleOutsideClick);
          }}
          className="border-2 border-renk1 text-renk1 rounded-xl flex items-center px-3 py-2"
        >
          <IoIosAddCircleOutline className="mr-1" />
          Yeni Adres Ekle
        </button>
      </div>

      <div>
        {addresses.length === 0
          ? Array.from({ length: 3 }).map((_, index) => (
            <div className="md:w-1/3 mb-5 mt-5 mx-auto" key={index}>
              <SkeletonCard />
            </div>
          ))
          : addresses.map((addrss) => (
            <div className="md:w-1/3 mx-auto mb-5 mt-5" key={addrss.id}>
              <AddressesCard
                 id={addrss.id}
                address={addrss.address || ""}
                setAddresses={setAddresses}
                onDelete={handleDelete}
                selectedCity={selectedCity}
                addressTitle={addrss.title}
                postalCode={addrss.postalCode || ""}
                city={addrss.city || ""}
                showModal={showModal}
                setShowModal={setShowModal}
                setAddress={setAddress}
                setAddressTitle={setAddressTitle}
                setSelectedCity={setSelectedCity}
                setPostalCode={setPostalCode}
              />

            </div>
          ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div ref={popupRef} className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl mb-4 text-center font-bold">Yeni Adres Ekle</h2>
            <input
              type="text"
              placeholder="Adres Başlığı"
              value={addressTitle}
              onChange={(e) => setAddressTitle(e.target.value)}
              className="border rounded-lg px-3 py-2 mb-2 w-full"
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border rounded-lg px-3 py-2 mb-2 w-full"
            >
              <option value="">Şehir Seçin</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Adres"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border rounded-lg px-3 py-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Posta Kodu"
              maxLength={5}
              value={postalCode}
              onChange={(e) => {
                if (/^[0-9]*$/.test(e.target.value)) {
                  setPostalCode(e.target.value);
                  setError("");
                } else {
                  setError("Posta koduna sadece sayı girebilirsiniz");
                }
              }}
              className="border rounded-lg px-3 py-2 mb-2 w-full"
            />
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="flex justify-between gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  document.removeEventListener("mousedown", handleOutsideClick);
                }}
                className="bg-red-500 text-white rounded-lg px-4 py-2"
              >
                Vazgeç
              </button>
              <button
                onClick={handleAddAddress}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
