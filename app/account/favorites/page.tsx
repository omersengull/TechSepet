"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  image?: string;
  price: number;
}

interface Favorite {
  id: string;
  product?: Product;
}

function Page() {
  const { data: session, status } = useSession(); // Oturum bilgilerini al
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFavorites = async () => {
      if (status === "loading") return;
      if (!session?.user?.id) return;
  
      try {
        const response = await fetch(`/api/favorites?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error("Favoriler alınamadı");
        }
  
        const data: Favorite[] = await response.json();
        console.log("Favoriler API yanıtı:", data);
        setFavorites(data);
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
  
    getFavorites();
  }, [session, status]);
  
  if (loading) return <p>Favoriler yükleniyor...</p>;

  return (
    <div className="p-4">
      <div className="border rounded-xl p-4 shadow-md">
        <h1 className="text-lg font-bold mb-2">Beğendiklerim</h1>
        {favorites.length > 0 ? (
          <ul>
            {favorites.map((fav) => (
              <li key={fav.id} className="border-b py-2 flex items-center">
                {fav.product ? (
                  <>
                    <Image
                      src={fav.product.image ?? "/placeholder.jpg"}
                      width={70}
                      height={70}
                      sizes="20px 20px"
                      alt="Resim bulunamadı"
                      className="object-contain rounded-md"
                    />
                    <div>
                      <span className="font-medium">{fav.product.name}</span> -{" "}
                      <span className="text-gray-500">{fav.product.price} TL</span>
                    </div>
                  </>
                ) : (
                  <p>Ürün bilgisi yüklenemedi.</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz favori ürününüz yok.</p>
        )}
      </div>
    </div>
  );
}

export default Page;
