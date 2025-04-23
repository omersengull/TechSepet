"use client"

import { useRouter } from "next/navigation";
import useCart from "../hooks/useCart";
import priceClip from "../utils/priceClip";
import TextClip from "../utils/TextClip";
import { CardProductProps } from "./detail/DetailClient";
import { useState } from "react";
import { Rating } from "@mui/material";
import Image from "next/image";

const ProductRecommendationCard = ({ productId, product }: { productId: any, product: any }) => {
    const { addToBasket } = useCart(); 
    const [cardProduct, setCardProduct] = useState<CardProductProps>({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: 1,
            image: product.image,
            stock:product.stock,
        });
    const productRating =
        product?.reviews?.reduce((acc: number, item: any) => acc + item.rating, 0) /
        product?.reviews?.length;

   
    const router = useRouter();
    const handleCardClick = () => {
        router.push(`/product/${product.id}`);
    };
    return (
        <div
            onClick={handleCardClick}
            className="w-full sm:w-[250px] md:w-[220px] h-[350px] shadow-lg cursor-pointer p-4 sm:p-5 rounded-lg  bg-white flex flex-col justify-between"
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
                        <Rating name="read-only" value={productRating} readOnly size="small" />
                        <span className="ml-1 text-xs sm:text-sm">({product?.reviews?.length})</span>
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
    )
}
export default ProductRecommendationCard;