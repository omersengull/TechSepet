"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { HashLoader } from "react-spinners";
import { BsCartFill } from "react-icons/bs";
import priceClip from "@/app/utils/priceClip";
import { PiHeartStraightFill, PiHeartStraightLight } from "react-icons/pi";
import toast from "react-hot-toast";
import useCart from "@/app/hooks/useCart";
import TextClip from "@/app/utils/TextClip";
import { Rating } from "@mui/material";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  image?: string;
  price: string;
  description?: string;
  stock?: number;
  rating?: number;
  reviewCount?: number;
}

interface Favorite {
  id: string;
  product?: Product;
}

function Page() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickedStates, setClickedStates] = useState<{ [key: string]: boolean }>({});
  const { addToBasket } = useCart();
  const [productRatings, setProductRatings] = useState<{ [key: string]: number }>({});
  const [reviewCounts, setReviewCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const getFavorites = async () => {
      if (status === "loading" || !session?.user?.id) return;

      try {
        const response = await fetch(`/api/myFavorites?userId=${session.user.id}`);
        if (!response.ok) throw new Error("Favoriler alınamadı");
        const data: Favorite[] = await response.json();
        setFavorites(data);
        
 
        const initialStates = data.reduce((acc, fav) => ({
          ...acc,
          [fav.id]: true
        }), {});
        setClickedStates(initialStates);

        data.forEach(async (fav) => {
          if (fav.product?.id) {
            try {
              const response = await fetch(`/api/reviews?productId=${fav.product.id}`);
              const reviews = await response.json();
              
              if (reviews.length > 0) {
                const rating = reviews.reduce((acc: number, review: any) => 
                  acc + Number(review.rating), 0) / reviews.length;
                setProductRatings(prev => ({
                  ...prev,
                  [fav.product!.id]: rating
                }));
                setReviewCounts(prev => ({
                  ...prev,
                  [fav.product!.id]: reviews.length
                }));
              }
            } catch (error) {
              console.error("Yorumları çekerken hata oluştu:", error);
            }
          }
        });

      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };

    getFavorites();
  }, [session, status]);

  const toggleFavorite = useCallback(async (productId: string) => {
    if (!session?.user?.id) {
      toast.error("Favori işlemi için giriş yapmalısınız!");
      return;
    }

    try {
      
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });
  

      if (!response.ok) throw new Error("İşlem başarısız");
    
      toast.success("Favorilerden kaldırıldı!");
      window.location.reload(); // Sayfayı yenile

    } catch (error) {
      console.error(error);
      setClickedStates(prev => ({ ...prev, [productId]: !prev[productId] }));
      toast.error("İşlem sırasında hata oluştu");
    }
  }, [session]);

  const handleAddToCart = useCallback((product: Product) => {
    toast.promise(
      addToBasket({
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        quantity: 1,
        image: product.image || "",
        stock: product.stock || 0
      }),
      {
        loading: "Sepete ekleniyor...",
        success: "Ürün sepete eklendi!",
        error: "Hata oluştu!"
      }
    );
  }, [addToBasket]);

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <HashLoader color="#2563eb" size={50} />
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Beğendiklerim</h1>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((fav) => {
              if (!fav.product) return null;
              
              return (
                <div 
                  key={fav.id}
                  className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-end mb-2">
                    <button 
                      onClick={() => toggleFavorite(fav.product!.id)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                        <PiHeartStraightFill className="text-red-500 text-xl" /> 
                    </button>
                  </div>

                  <Link 
                    href={`/product/${fav.product.id}`}
                    className="block cursor-pointer"
                  >
                    <div className="relative h-48 w-full mb-4">
                      <Image
                        src={fav.product.image || '/placeholder-product.png'}
                        alt={fav.product.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    <div className="text-center mb-4">
                      <h3 className="font-semibold">
                        {TextClip(fav.product.name) || "Ürün adı yok"}
                      </h3>
                    </div>
                  </Link>

                  <div className="mt-auto">
                    <div className="flex justify-center items-center mb-2">
                      <Rating
                        value={productRatings[fav.product.id] || 0}
                        readOnly
                        precision={0.5}
                        size="small"
                      />
                      <span className="text-sm text-gray-500 ml-1">
                        ({reviewCounts[fav.product.id] || 0})
                      </span>
                    </div>

                    <div className="text-center text-lg font-bold text-black mb-4">
                      {priceClip(fav.product.price)} TL
                    </div>

                    <button
                      onClick={() => handleAddToCart(fav.product!)}
                      className="w-full bg-renk1 hover:bg-renk1-dark text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <BsCartFill className="inline-block" />
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 text-gray-300">❤️</div>
            <p className="text-xl text-gray-600 mb-6">Henüz favori ürününüz yok</p>
            <Link
              href="/"
              className="inline-block bg-renk1 hover:bg-renk1-dark text-white px-6 py-3 rounded-lg transition-colors"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;