"use client";
import Image from "next/image";
import { Rating } from "@mui/material";
import TextClip from "@/app/utils/TextClip";
import { useRouter } from "next/navigation";
import priceClip from "@/app/utils/priceClip";
import useCart from "@/app/hooks/useCart";
import React, { useEffect, useState } from "react";

export type CardProductProps = {
    id: string,
    name: string,
    description: string,
    price: string,
    quantity: number,
    image: string,
    inStock: boolean
}

const ProductsCard = ({ product }: { product: any }) => {
    const [reviews, setReviews] = useState([]);
    const [productRating, setProductRating] = useState(0);
    const [productRatingLength, setProductRatingLength] = useState(0);
    const [cardProduct, setCardProduct] = useState<CardProductProps>({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: 1,
        image: product.image,
        inStock: product.inStock
    });

    if (!product) {
        return <div>Ürün bilgisi yüklenemedi</div>;
    }

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/reviews?productId=${product.id}`);
                const data = await response.json();
                
                setReviews(data);
                
                // Ortalama puanı hesapla ve yorum sayısını ayarla
                if (data.length > 0) {
                    const rating =
                        data.reduce((acc, review) => acc + review.rating, 0) / data.length;
                    
                    setProductRating(rating);
                    setProductRatingLength(data.length); // 🔹 Yorum sayısını kaydet
                } else {
                    setProductRating(0);
                    setProductRatingLength(0);
                }
            } catch (error) {
                console.error("Yorumları çekerken hata oluştu:", error);
            }
        };

        fetchReviews();
    }, [product.id]); // 🔹 Yalnızca `product.id` değiştiğinde çalışır

    const router = useRouter();
    const { addToBasket } = useCart();

    const handleCardClick = () => {
        router.push(`/product/${product.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="w-full dark:bg-gray-800 dark:text-white sm:w-[250px] md:w-[220px] h-[390px] shadow-lg p-4 sm:p-5 rounded-lg transition-transform transform hover:scale-105 bg-white flex flex-col justify-between"
        >
            {/* Ürün Resmi */}
            <div className="relative h-[160px] flex items-center justify-center">
                <Image
                    src={product.image}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="Resim bulunamadı"
                    className="object-contain"
                />
            </div>

            {/* Ürün Bilgileri */}
            <div className="font-bold text-center mt-3 flex-grow flex flex-col justify-between">
                <div>
                    <div className="my-2 text-sm sm:text-base">{TextClip(product.name)}</div>
                </div>

                <div className="flex flex-col justify-between items-center mt-auto">
                    <div className="flex flex-row justify-center items-center my-2">
                        <Rating
                            name="read-only"
                            value={productRating}
                            className="dark:text-white"
                            readOnly
                            size="small"
                        />
                        <span className="ml-1 text-xs sm:text-sm">({productRatingLength})</span> {/* 🔹 Yorum sayısını göster */}
                    </div>
                    <div className="text-renk1 text-base sm:text-lg font-semibold my-2">
                        {priceClip(product.price)} TL
                    </div>
                </div>

                {/* Sepete Ekle Butonu */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Kart tıklanmasını engeller
                        addToBasket(cardProduct);
                    }}
                    className="w-full py-2 mt-3 text-sm sm:text-base bg-renk1 text-white rounded-md"
                >
                    Sepete Ekle
                </button>
            </div>
        </div>
    );
};

export default ProductsCard;
