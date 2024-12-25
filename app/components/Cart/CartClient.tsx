"use client";
import React from "react";
import priceClip from "@/app/utils/priceClip";
import useCart from "@/app/hooks/useCart";
import PageContainer from "../containers/PageContainer";
import { RiDeleteBinFill } from "react-icons/ri";
import Image from "next/image";
import Counter from "../General/Counter";
import { useState } from "react";
import { ProductsData } from "@/app/utils/ProductsData";
import { CardProductProps } from "../detail/DetailClient";
import Button from "../General/Button";
import { useRouter } from "next/navigation";
import { MdInfoOutline } from "react-icons/md";
import toast from "react-hot-toast";
import Head from "next/head";

const CartClient = () => {
    const router = useRouter();
    const handlePayment = () => {
        router.push('/payment');
    }
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => { setIsOpen(!isOpen); };


    const { cartPrdcts, setCartPrdcts, deleteCart, deleteThisPrdct } = useCart();

    const increaseFunc = (productId: string) => {
        setCartPrdcts(prevCart => {
            if (!prevCart) return [];

            const updatedCart = prevCart.map(prd =>
                prd.id === productId && prd.quantity < 10
                    ? { ...prd, quantity: prd.quantity + 1 }
                    : prd
            );

            localStorage.setItem('Cart', JSON.stringify(updatedCart));

            return updatedCart;
        });
    };

    const decreaseFunc = (productId: string) => {
        setCartPrdcts(prevCart => {
            if (!prevCart) return [];

            const updatedCart = prevCart.map(prd =>
                prd.id === productId && prd.quantity > 1
                    ? { ...prd, quantity: prd.quantity - 1 }
                    : prd
            );

            localStorage.setItem('Cart', JSON.stringify(updatedCart));

            return updatedCart;
        });
    };

    if (!cartPrdcts || cartPrdcts.length === 0) {
        return (
            <div className="flex flex-col items-center min-h-screen">
                <div className="mt-24">
                    <img src="https://media.istockphoto.com/id/1353254084/vector/1401-i012-025-p-m001-c20-woman-accessories.jpg?s=612x612&w=0&k=20&c=Fqp5ckKD3HMmcybXsRlsNqD55rQrF1xu0uPdia2MAPQ=" alt="" width={150} />
                </div>
                <div className="font-bold text-2xl mb-5">
                    Sepete Ekle
                </div>
                <div className="mb-8">Alışveriş sepetinizde hiç ürün yok.</div>
                <button className="bg-renk1 text-white px-28 py-4 rounded-xl" onClick={() => { router.push('/') }} >Alışverişe devam et </button>
            </div>
        );
    }

    let totalPrice = 0;
    cartPrdcts.forEach(prd => {
        totalPrice +=Number( prd.price )* prd.quantity;
    });

    return (
        <div className="min-h-screen">
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white border border-gray-300 p-4 shadow-lg rounded-lg w-[300px] md:w-[600px]">
                            <p className="font-bold mb-2">Kargo bilgileri hakkında</p>
                            <p className="text-sm mb-2"><p className="text-sm mb-2">Saat 14:00&apos;e kadar verilen siparişleriniz aynı gün, saat 14:00 sonrası verilen siparişleriniz ertesi gün kargoya verilir.</p>
                            </p>
                            <p className="text-sm mb-2">1000 TL ve üzeri siparişlerinizde kargo ücreti alınmaz.</p>
                            <p className="text-sm">Tahmini teslimat tarihleri için ürün sayfamızdaki tarihleri inceleyebilir veya sepet adımında adres bilgilerinizi girerek kendi bölgenize dair tahmini teslimat tarihlerine de ulaşabilirsiniz.</p>
                            <button onClick={togglePopup} className="mt-4 px-4 py-2 bg-renk1 text-white rounded">Kapat</button>
                        </div>
                    </div>
                </>
            )}
            <Head>
                <title>Sepet</title>
            </Head>
            <PageContainer>
                <div>
                    <button onClick={deleteCart} className="bg-renk1 py-1 px-2 text-white rounded-xl flex flex-row items-center">
                        <RiDeleteBinFill />
                        <span className="ml-1">Sepeti Boşalt</span>
                    </button>
                </div>
                <div className="flex flex-col md:flex-row justify-center mx-8 md:mx-32">
                    <div className="flex-col md:w-2/3 md:mr-16">
                        {cartPrdcts.map(prd => (
                            <div key={prd.id} className="flex flex-row items-center space-x-4 mb-4 border p-8 outline-none rounded-xl">
                                <div className="flex-col">
                                    <Image alt="" src={prd.image} width={150} height={150} />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold">{prd.description}</span>
                                        <RiDeleteBinFill onClick={() => deleteThisPrdct(prd)} className="cursor-pointer text-4xl ml-16" />
                                    </div>
                                    <div className="text-2xl font-bold">₺ {priceClip(Number(prd.price )* prd.quantity)}</div>
                                    <div className="text-sm text-slate-500">Birim fiyatı ₺ {priceClip(prd.price)}</div>
                                    {prd.inStock ? (
                                        <div className="flex items-center">
                                            <span className="w-[10px] h-[10px] mr-2 bg-green-600 rounded-full"></span>
                                            Stokta var
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <span className="w-[10px] h-[10px] mr-2 bg-red-600 rounded-full"></span>
                                            Stokta yok
                                        </div>
                                    )}
                                    <Counter
                                        cardProduct={prd}
                                        increaseFunc={() => increaseFunc(prd.id)}
                                        decreaseFunc={() => decreaseFunc(prd.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex-col md:w-2/3">
                        <div className="rounded-xl border outline-none bg-gray-100 flex flex-col py-4 px-5 text-lg">
                            <div>Özet</div>
                            <div className="text-xs mt-1 mb-4">İndirim kodları ödeme adımında eklenebilir.</div>
                            <hr />
                            <div className="mt-5 flex justify-between">
                                <div>Ara Toplam</div>
                                <div className="font-bold">₺ {priceClip(totalPrice)}</div>
                            </div>
                            <div className="mt-5 mb-5 flex flex-row items-center">
                                <span className="mr-1">Kargo</span>
                                <div onClick={togglePopup} className="cursor-pointer">
                                    <MdInfoOutline />
                                </div>
                                <span className="absolute right-16 md:right-48">
                                    {totalPrice > 1000 ? "Ücretsiz" : "₺ 39"}
                                </span>
                            </div>
                            <hr />
                            <div className="flex flex-col mt-5">
                                <div className="flex flex-row justify-between">
                                    <div className="font-bold">Toplam</div>
                                    <div className="font-bold"> 
                                        {totalPrice > 1000 ? `₺ ${priceClip(totalPrice)}` : `₺ ${(totalPrice) + 39}`}
                                    </div>
                                </div>
                                <div className="text-sm">KDV Dahildir</div>
                            </div>
                            <div className="mt-5 flex justify-center">
                                <button onClick={handlePayment} className="w-[300px] md:w-[500px] bg-renk1 px-5 py-3 rounded-xl text-white">
                                    Ödeme işlemine geçin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </div>
    );
};

export default CartClient;
