"use client";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import React, { useState, useEffect, useRef } from "react";
import { LuInfo } from "react-icons/lu";
import { IoIosAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import AddressesCard from "@/app/components/Home/AddressesCard";
import { Address } from "@prisma/client";
import { SkeletonCard } from "@/app/skeleton/skeletonCard";
import EditAddressModal from "@/app/components/EditAddressModal";
import AddAddressModal from "@/app/components/Home/AddAddressModal";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Silme işlemi başarısız");
      }
      // Sunucuda da silindikten sonra state’i güncelle
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Adres başarıyla silindi");
    } catch (error: any) {
      console.error("Silme hatası:", error);
      toast.error(error.message || "Adres silinirken hata oluştu");
    }
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
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


  const handleAddAddress = async (data: {
    title: string;
    city: string;
    address: string;
    postalCode: string;
  }): Promise<void> => {
    const { title, city, address, postalCode } = data;
    if (!title || !city || !address || !postalCode) {
      toast.error("Lütfen tüm alanları doldurun!");
      return;
    }
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id ?? "", title, city, address, postalCode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Hata");
      setAddresses((prev) => [
        ...prev,
        { id: json.id, userId: user!.id, title, city, address, postalCode, createdAt: new Date(), updatedAt: new Date() },
      ]);
      toast.success("Adres eklendi");
      setShowAddModal(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Adres eklenirken hata");
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal]);
  const handleUpdateAddress = async (updated: Address): Promise<void> => {
    try {
      const res = await fetch(`/api/addresses/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updated.title,
          city: updated.city,
          address: updated.address,
          postalCode: updated.postalCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Güncelleme başarısız");
      }
      // Başarılıysa local state’i güncelle
      setAddresses((prev) =>
        prev.map((a) => (a.id === updated.id ? { ...a, ...data } : a))
      );
      toast.success("Adres başarıyla güncellendi");
      setEditingAddress(null);
    } catch (error: any) {
      console.error("Güncelleme hatası:", error);
      toast.error(error.message || "Adres güncellenirken hata oluştu");
    }
  };


  return (
    <div className="mx-auto p-4 min-h-screen">
      {showAddModal && (
        <AddAddressModal
          cities={cities}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddAddress}
        />
      )}
      {editingAddress && (
        <EditAddressModal
          address={editingAddress}
          cities={cities}
          onClose={() => setEditingAddress(null)}
          onSave={handleUpdateAddress}
        />
      )}
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
            setShowAddModal(true)
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
            <div className="md:w-1/3 mb-5 mt-5 mx-auto " key={index}>
              <SkeletonCard />
            </div>
          ))
          : addresses.map((addrss) => (
            <div className="md:w-1/3 mx-auto mb-5 mt-5" key={addrss.id}>
              <AddressesCard
                key={addrss.id}
                addressObj={addrss}        
                onDelete={handleDelete}
                onEdit={openEditModal}

              />

            </div>
          ))}
      </div>


    </div>
  );
};

export default Page;
