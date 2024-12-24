"use client";
import Image from "next/image";
import { Rating } from "@mui/material";
import TextClip from "@/app/utils/TextClip";
import { useRouter } from "next/navigation";
import priceClip from "@/app/utils/priceClip";
import useCart from "@/app/hooks/useCart";
import Button from "../General/Button";

const ProductsCard = ({ product }: { product: any }) => {
    if (!product) {
        return <div>Ürün bilgisi yüklenemedi</div>

    }
    const router = useRouter();
    const { addToBasket } = useCart();
    let productRating = product?.reviews?.reduce((acc: number, item: any) => acc + item.rating, 0) / product?.reviews?.length;

    const handleClick = () => {


        router.push(`/product/${product.id}`);

    };

    return (
        <div
            onClick={handleClick}
            className="md:w-[220px] w-[400px] z-0 shadow-lg cursor-pointer p-10 md:p-2 rounded-lg"
        >
            <div className="relative h-[160px]">
                <Image
                    src={product.image}
                    fill
                    alt="Resim bulunamadı"
                    className="object-contain"
                />
            </div>
            <div className="font-bold text-center mt-2">
                <div className="my-3">{TextClip(product.name)}</div>
                <div className="flex flex-row justify-center my-3">
                    <Rating name="read-only" value={productRating} readOnly />{" "}
                    <span className="items-center">{product?.reviews?.length}</span>
                </div>
                <div className="text-renk1 text-lg md:text-xl my-3">
                    {priceClip(product.price)} TL
                </div>
            </div>
        </div>
    );
};

export default ProductsCard;
