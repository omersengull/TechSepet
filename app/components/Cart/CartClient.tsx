"use client";
import React, { useEffect, useState } from "react";
import priceClip from "@/app/utils/priceClip";
import useCart from "@/app/hooks/useCart";
import PageContainer from "../containers/PageContainer";
import { RiDeleteBinFill } from "react-icons/ri";
import Image from "next/image";
import Counter from "../General/Counter";
import { CardProductProps } from "../detail/DetailClient";
import Button from "../General/Button";
import { useRouter } from "next/navigation";
import { MdInfoOutline } from "react-icons/md";
import toast from "react-hot-toast";
import Head from "next/head";
import axios from "axios";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const CartClient = () => {
    // Hook'tan gelen cartPrdcts her zaman array olarak kullanılsın
    const {
        cartPrdcts: rawCartPrdcts,
        setCartPrdcts,
        deleteCart,
        deleteThisPrdct
    } = useCart();
    // Null veya undefined durumlarında boş dizi
    const cartPrdcts = rawCartPrdcts ?? [];

    const [couponError, setCouponError] = useState('');
    const router = useRouter();
    const handleCardClick = (id: string) => {
        router.push(`/product/${id}`);
    };

    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stocksLoading, setStocksLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentStocks, setCurrentStocks] = useState<{ [key: string]: number }>({});

    // Stok bilgilerini çekme
    useEffect(() => {
        const fetchCurrentStocks = async () => {
            setStocksLoading(true);
            const stockData: { [key: string]: number } = {};
            for (const product of cartPrdcts) {
                try {
                    const response = await axios.get(`/api/product/${product.id}`);
                    stockData[product.id] = response.data.stock;
                } catch (error) {
                    console.error("Stok bilgisi alınamadı:", error);
                    stockData[product.id] = 0;
                }
            }
            setCurrentStocks(stockData);
            setStocksLoading(false);
        };

        if (cartPrdcts.length > 0) {
            fetchCurrentStocks();
        } else {
            setStocksLoading(false);
        }
    }, [cartPrdcts]);

    // Kullanıcı bilgisi
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getCurrentUser();
            setCurrentUser(user);
        };
        fetchUser();
    }, []);

    const [couponCode, setCouponCode] = useState('');
    useEffect(() => {
        if (!currentUser) return;
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`/api/addresses?userId=${currentUser.id}`);
                setAddresses(response.data.addresses);
            } catch (error) {
                console.error("Adresler yüklenirken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, [currentUser]);

    // Ödeme yönlendirme durumu
    const [isRedirecting, setIsRedirecting] = useState(false);
    const handlePayment = () => {
        const storedAddress = localStorage.getItem('selectedAddressId');
        if (!storedAddress || !isFormChecked) {
            toast.error("Lütfen adres seçin ve formu onaylayın");
            return;
        }
        setIsRedirecting(true);
        router.push(`/payment?address=${encodeURIComponent(storedAddress)}&ts=${Date.now()}`);
    };

    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => { setIsOpen(!isOpen); };
    const [selectedAddress, setSelectedAddress] = useState<string | null>(() => {
        return localStorage.getItem('selectedAddressId');
    });
    useEffect(() => {
        const savedAddress = localStorage.getItem('selectedAddressId');
        if (savedAddress) setSelectedAddress(savedAddress);
    }, []);

    const [isFormChecked, setIsFormChecked] = useState(false);

    // Miktar artırma
    const increaseFunc = (productId: string) => {
        setCartPrdcts(prevCart => {
            const updatedCart = (prevCart ?? []).map(prd =>
                prd.id === productId && prd.quantity < 10
                    ? { ...prd, quantity: prd.quantity + 1 }
                    : prd
            );
            localStorage.setItem('Cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    // Miktar azaltma
    const decreaseFunc = (productId: string) => {
        setCartPrdcts(prevCart => {
            const updatedCart = (prevCart ?? []).map(prd =>
                prd.id === productId && prd.quantity > 1
                    ? { ...prd, quantity: prd.quantity - 1 }
                    : prd
            );
            localStorage.setItem('Cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    // Kupon bilgisi
    const [discountInfo, setDiscountInfo] = useState<{ amount: number; type: 'PERCENTAGE' | 'FIXED'; value: number }>({ amount: 0, type: 'FIXED', value: 0 });
    const handleCouponApply = async () => {
        try {
            const response = await fetch('/api/validate-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, totalAmount: totalPrice })
            });
            const data = await response.json();
            if (data.discount <= 0) throw new Error("Geçersiz indirim tutarı");
            if (!response.ok) throw new Error(data.error);
            setDiscountInfo({ amount: data.discount, type: data.discountType, value: data.discountValue });
        } catch (error: any) {
            console.error('Kupon uygulama hatası:', error);
            setDiscountInfo({ amount: 0, type: 'FIXED', value: 0 });
            toast.error(error.message);
        }
    };

    if (cartPrdcts.length === 0) {
        return (
            <div className="flex flex-col items-center min-h-screen">
                <div className="mt-24">
                    <img src="https://media.istockphoto.com/id/1353254084/vector/1401-i012-025-p-m001-c20-woman-accessories.jpg" alt="" width={150} />
                </div>
                <div className="font-bold text-2xl mb-5">Sepete Ekle</div>
                <div className="mb-8">Alışveriş sepetinizde hiç ürün yok.</div>
                <button className="bg-renk1 text-white px-28 py-4 rounded-xl" onClick={() => router.push('/')}>Alışverişe devam et</button>
            </div>
        );
    }

    // Toplam hesaplama
    let totalPrice = 0;
    cartPrdcts.forEach(prd => { totalPrice += Number(prd.price) * prd.quantity; });
    return (
        <div className="min-h-screen">
            {/* Yönlendirme sırasında gösterilecek spinner ve mesaj */}
            
            {isRedirecting && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
                    <div className="animate-spin border-4 border-t-4 border-gray-200 rounded-full w-16 h-16"></div>
                    <p className="mt-4 text-lg font-bold">Ödemeye yönlendiriliyor...</p>
                </div>
            )}
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white border border-gray-300 p-4 shadow-lg rounded-lg w-[300px] md:w-[600px]">
                            <p className="font-bold mb-2">Kargo bilgileri hakkında</p>
                            <p className="text-sm mb-2">Saat 14:00'e kadar verilen siparişleriniz aynı gün, saat 14:00 sonrası verilen siparişleriniz ertesi gün kargoya verilir.</p>
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
                <div className="flex justify-center mb-2 sm:mb-1 md:mb-0 sm:justify-normal">
                    <button onClick={deleteCart} className="bg-renk1 py-2 px-3 mb-2 md:mb-0 text-white rounded-xl flex flex-row items-center">
                        <RiDeleteBinFill />
                        <span className="ml-1">Sepeti Boşalt</span>
                    </button>
                </div>
                <div className="flex flex-col md:flex-row justify-center mx-8 md:mx-32">
                    <div className="flex-col md:w-2/3 md:mr-16">
                        {cartPrdcts.map(prd => (
                            <div onClick={() => { handleCardClick(prd.id) }} key={prd.id} className="flex flex-row items-center space-x-4 mb-4 border p-8 outline-none cursor-pointer rounded-xl">
                                <div className="flex-col md:min-w-40 min-w-24">
                                    <Image alt="" src={prd.image} width={150} height={150} />
                                </div>
                                <div className="flex flex-col md:text-md text-sm space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold">{prd.description}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-bold">₺ {priceClip(Number(prd.price) * prd.quantity)}</div>
                                        <RiDeleteBinFill onClick={() => deleteThisPrdct(prd)} className="cursor-pointer text-2xl ml-16" />
                                    </div>
                                    <div className="text-sm text-slate-500">Birim fiyatı ₺ {priceClip(prd.price)}</div>
                                    {stocksLoading ? (
                                        <div className="animate-pulse h-4 bg-gray-300 rounded w-20 my-1" />
                                    ) : currentStocks[prd.id] > 0 ? (
                                        <div className="flex items-center text-green-600">
                                            <span className="w-2 h-2 mr-2 bg-green-600 rounded-full" />
                                            Stokta var
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-red-600">
                                            <span className="w-2 h-2 mr-2 bg-red-600 rounded-full" />
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
                        <div className="rounded-xl border outline-none bg-gray-100 flex flex-col py-4 px-5 mb-6 text-lg">
                            <h1 className="font-bold">Adres seçimi</h1>
                            <div>
                                {loading ? (
                                    <>
                                        <div className="animate-pulse h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                                        <div className="animate-pulse h-6 bg-gray-300 rounded mb-2 w-2/3"></div>
                                        <div className="animate-pulse h-6 bg-gray-300 rounded mb-2 w-1/2"></div>
                                    </>
                                ) : addresses.length > 0 ? (
                                    addresses.map((address: any) => (
                                        <div key={address.id} className="flex">
                                            <input
                                                className="mr-2"
                                                type="radio"
                                                name="selectedAddress"
                                                checked={selectedAddress === address.id}
                                                onChange={() => {
                                                    setSelectedAddress(address.id);
                                                    localStorage.setItem('selectedAddressId', address.id);
                                                }}
                                            />
                                            <span className="font-bold mr-1">{address.title} </span>
                                            <div>({address.address})</div>
                                        </div>
                                    ))
                                ) : (
                                    <div>Adres bulunamadı.Adres eklemek için <a className="hover:text-blue-500" href="/account/addresses"> buraya</a> tıklayınız</div>
                                )}
                            </div>
                        </div>
                        <div className="rounded-xl border outline-none bg-gray-100 flex flex-col py-4 px-5 text-lg mb-5">
                            <div className="flex justify-between items-center">
                                <label htmlFor="couponCode" className="font-bold mb-2">İndirim Kuponu</label>
                                <button
                                    className="text-sm bg-renk1 text-white px-7 py-3 rounded-lg"
                                    onClick={handleCouponApply}
                                >
                                    Uygula
                                </button>
                            </div>
                            <input
                                type="text"
                                id="couponCode"
                                placeholder="Kupon kodunuzu giriniz"
                                className="bg-transparent border-none focus:ring-0 p-0 text-base placeholder-gray-500"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            />
                        </div>
                        <div className="rounded-xl border outline-none bg-gray-100 flex flex-col py-4 px-5 text-lg">
                            <div className="font-bold">Özet</div>

                            <hr />
                            <div className="mt-5 flex justify-between">
                                <div>Ara Toplam</div>
                                <div className="font-bold">₺ {priceClip(totalPrice)}</div>
                            </div>

                            {discountInfo.amount > 0 && (
                                <div className="mt-2 flex justify-between text-green-600">
                                    <div>
                                        İndirim ({discountInfo.type === 'PERCENTAGE'
                                            ? `${discountInfo.value}%`
                                            : `₺${priceClip(discountInfo.value)}`}
                                        )
                                    </div>
                                    <div className="font-bold">-₺ {priceClip(discountInfo.amount)}</div>
                                </div>
                            )}

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
                            <div className="flex flex-col mt-5 mb-2">
                                <div className="flex flex-row justify-between">
                                    <div className="font-bold">Toplam</div>
                                    <div className="font-bold">
                                        {totalPrice > 1000
                                            ? `₺ ${priceClip(totalPrice - discountInfo.amount)}`
                                            : `₺ ${priceClip((totalPrice + 39) - discountInfo.amount)}`
                                        }
                                    </div>
                                </div>
                                <div className="text-sm">KDV Dahildir</div>
                            </div>
                            <hr />
                            <div className="mt-2">
                                <input onChange={(e) => setIsFormChecked(e.target.checked)} className="mr-1 size-4" type="checkbox" name="" id="" />
                                Ön bilgilendirme formu'nu ve Mesafeli satış sözleşmesi 'ni onaylıyorum.
                            </div>

                            <div className="mt-5 flex justify-center">
                                {selectedAddress && isFormChecked ? (
                                    <button
                                        onClick={handlePayment}
                                        className="w-[300px] md:w-[500px] bg-renk1 px-5 py-3 rounded-xl text-white"
                                    >
                                        Ödeme işlemine geçin
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-[300px] md:w-[500px] cursor-not-allowed bg-slate-500 px-5 py-3 rounded-xl text-white"
                                    >
                                        Ödeme işlemine geçin
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </div>
    );
};

export default CartClient;