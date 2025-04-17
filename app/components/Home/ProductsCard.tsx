"use client";
import Image from "next/image";
import { Rating } from "@mui/material";
import TextClip from "@/app/utils/TextClip";
import { useRouter } from "next/navigation";
import priceClip from "@/app/utils/priceClip";
import useCart from "@/app/hooks/useCart";
import React, { useEffect, useRef, useState } from "react";
import { PiHeartStraightLight, PiHeartStraightFill } from "react-icons/pi";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { BsCartFill } from "react-icons/bs";
import { MdLaptopChromebook } from "react-icons/md";
import { BsCartCheckFill } from "react-icons/bs";
export type CardProductProps = {
    id: string;
    name: string;
    description: string;
    price: string;
    quantity: number;
    image: string;
    inStock: boolean;
};

const ProductsCard = ({ product, onMouseEnter,
    onMouseLeave }: {
        product: any, onMouseEnter: () => void;
        onMouseLeave: () => void;
    }) => {
    const [reviews, setReviews] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [productRating, setProductRating] = useState(0);
    const [productRatingLength, setProductRatingLength] = useState(0);
    const { data: session } = useSession();
    const { addToBasket } = useCart();
    const router = useRouter();
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/reviews?productId=${product.id}`);
                const data = await response.json();

                setReviews(data);

                if (data.length > 0) {
                    // Her review.rating değerini sayıya çeviriyoruz
                    const rating = data.reduce((acc, review) => acc + Number(review.rating), 0) / data.length;
                    setProductRating(rating);
                    setProductRatingLength(data.length);
                } else {
                    setProductRating(0);
                    setProductRatingLength(0);
                }
            } catch (error) {
                console.error("Yorumları çekerken hata oluştu:", error);
            }
        };

        fetchReviews();
    }, [product.id]);

   

    useEffect(() => {
        let isMounted = true;

        const checkFavoriteStatus = async () => {
            try {
                if (session?.user?.id) {
                    const response = await fetch(`/api/favorites?userId=${session.user.id}&productId=${product.id}`);
                    const data = await response.json();

                    if (response.ok && data.isFavorite && isMounted) {
                        setClicked(true);
                    }
                }
            } catch (error) {
                console.error("Favori durumu kontrol edilirken hata oluştu:", error);
            }
        };

        checkFavoriteStatus();

        return () => { isMounted = false; };
    }, [product.id, session]);

    // Favori toggle fonksiyonu
    const toggleFavorite = async () => {
        // Eğer kullanıcı giriş yapmamışsa favori işlemini yapma
        if (!session?.user?.id) {
            toast.error("Favori işlemi yapmak için giriş yapmalısınız!");
            return;
        }

        const newClicked = !clicked;
        setClicked(newClicked);
        const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "{}");

        try {
            if (newClicked) {
                // Favoriye ekleme
                const response = await fetch("/api/favorites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: product.id })
                });
                if (!response.ok) {
                    throw new Error("Favoriye eklenirken hata oluştu");
                }
                toast.success("Başarıyla favorilere eklendi!");
                storedFavorites[product.id] = true;
                localStorage.setItem("favorites", JSON.stringify(storedFavorites));
            } else {
                // Favoriden kaldırma
                const response = await fetch("/api/favorites", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: product.id })
                });
                if (!response.ok) {
                    throw new Error("Favoriden kaldırılırken hata oluştu");
                }
                toast.success("Başarıyla favorilerden kaldırıldı!");
                delete storedFavorites[product.id];
                localStorage.setItem("favorites", JSON.stringify(storedFavorites));
            }
        } catch (error) {
            console.error(error);
            // Hata durumunda state eski haline dönsün
            setClicked(!newClicked);
            toast.error(newClicked ? "Favoriye eklenirken hata oluştu!" : "Favoriden kaldırılırken hata oluştu!");
        }
    };
    const [isPopped, setIsPopped] = useState(false);

    const handleClick = () => {
      setIsPopped(true);
  
      setTimeout(() => {
        setIsPopped(false);
      }, 1000); // 1 saniye sonra ikonu geri sıfırla
    };
    return (
        <div onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave} className="bg-white w-full sm:w-[250px] xl:w-[220px] min-h-[420px] shadow-lg p-4 sm:px-5 sm:py-5 rounded-lg transition-transform transform hover:scale-105 flex flex-col justify-between h-full">

            {/* Favori İkonu */}
            <div className="flex justify-end mb-2">
                {clicked ? (
                    <PiHeartStraightFill
                        onClick={toggleFavorite}
                        className="text-xl text-red-500 transition-transform transform hover:scale-125 cursor-pointer"
                    />
                ) : (
                    <PiHeartStraightLight
                        onClick={toggleFavorite}
                        className="text-xl hover:text-red-500 transition-transform transform hover:scale-125 cursor-pointer"
                    />
                )}
            </div>

            {/* Ürün Kartı */}
            <a href={`/product/${product.id}`} className="cursor-pointer flex flex-col items-center flex-grow">
                <div className="relative w-full h-[160px] flex items-center justify-center">
                    <Image
                        src={product.image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt="Resim bulunamadı"
                        className="object-contain rounded-md"
                    />
                </div>

                <div className="text-center mt-3 flex flex-col flex-grow">
                    <div className="font-semibold text-sm sm:text-base">{TextClip(product.name)}</div>
                </div>
            </a>

            {/* Rating, Fiyat ve Sepete Ekle Butonu */}
            <div className="flex flex-col justify-end mt-auto">
                <div className="flex flex-row justify-center items-center mt-2">
                    <Rating
                        name="read-only"
                        value={productRating}
                        precision={0.5}
                        className="dark:text-white"
                        readOnly
                        size="small"
                    />
                    <span className="ml-1 text-xs sm:text-sm text-gray-500">({productRatingLength})</span>
                </div>

                <div className="text-renk1 text-lg flex justify-center sm:text-xl font-semibold my-2">
                    {priceClip(product.price)} TL
                </div>

                <button
                    onClick={(e) => {
                        handleClick();
                        e.stopPropagation();
                        addToBasket({
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            quantity: 1,
                            image: product.image,
                            inStock: product.inStock
                        });

                    }}
                    className="w-full addToCartBtn py-2 text-sm sm:text-base bg-renk1 text-white rounded-md relative overflow-hidden"
                >
                    <BsCartFill className="cart absolute"/>
                   
                    <span>Sepete Ekle</span>
                </button>



            </div>
        </div>
    );
};

export default ProductsCard;
