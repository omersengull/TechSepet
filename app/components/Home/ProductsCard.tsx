"use client";
import Image from "next/image";
import { Rating } from "@mui/material";
import TextClip from "@/app/utils/TextClip";
import { useRouter } from "next/navigation";
import priceClip from "@/app/utils/priceClip";
import useCart from "@/app/hooks/useCart";
import React, { useState } from "react";

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

    const router = useRouter();
    const { addToBasket } = useCart();
    const productRating =
        product?.reviews?.reduce((acc: number, item: any) => acc + item.rating, 0) /
        product?.reviews?.length;

    const handleCardClick = () => {
        router.push(`/product/${product.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="w-full sm:w-[250px] md:w-[220px] h-[390px] shadow-lg cursor-pointer p-4 sm:p-5 rounded-lg transition-transform transform hover:scale-105 bg-white flex flex-col justify-between"
        >
            {/* Ürün Resmi */}
            <div className="relative h-[160px] flex items-center justify-center">
                <Image
                    src={product.image}
                    fill
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
    );
};

export default ProductsCard;
