"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CardProductProps } from "../components/detail/DetailClient";
import { ProductsData } from "../utils/ProductsData";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React from "react";

interface CartContextProps {
    removeItemsFromCart: () => void;
    productCartQty: number;
    addToBasket: (product: CardProductProps) => void;
    cartPrdcts: CardProductProps[] | null;
    setCartPrdcts: React.Dispatch<React.SetStateAction<CardProductProps[] | null>>;
    deleteCart: () => void;
    deleteThisPrdct: (product: CardProductProps) => void;
    filterCategory: (category: any) => void;
    filteredProducts: CardProductProps[] | null;
    searchProducts: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedAddressId: string | null;
    setSelectedAddressId: (addressId: string | null) => void;
}

const CartContext = createContext<CartContextProps | null>(null);

interface Props {
    [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
    const router = useRouter();
    const [filteredProducts, setFilteredProducts] = useState<CardProductProps[]>([]);
    const [productCartQty, setProductCartQty] = useState(0);
    const [cartPrdcts, setCartPrdcts] = useState<CardProductProps[] | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    useEffect(() => {
        // 📌 Sepeti ve seçili adresi localStorage'dan al
        const storedCart = localStorage.getItem("Cart");
        const parsedCart: CardProductProps[] | null = storedCart ? JSON.parse(storedCart) : null;
        setCartPrdcts(parsedCart);

        const storedAddress = localStorage.getItem("selectedAddressId");
        setSelectedAddressId(storedAddress || null);
    }, []);

    useEffect(() => {
        // 📌 Sepet değiştiğinde localStorage'a kaydet
        if (cartPrdcts !== null) {
            localStorage.setItem("Cart", JSON.stringify(cartPrdcts));
        }
    }, [cartPrdcts]);

    const deleteCart = useCallback(() => {
        setCartPrdcts([]);
        localStorage.removeItem("Cart");
    }, []);

    const filterCategory = useCallback((category: any) => {
        router.push(`/categories/${category}`);
    }, []);

    const addToBasket = useCallback((product: CardProductProps) => {
        if (product.inStock) {
            setCartPrdcts(prev => {
                const updatedCart = prev ? [...prev, product] : [product];
                localStorage.setItem("Cart", JSON.stringify(updatedCart));
                return updatedCart;
            });
            toast.success("Ürün Sepete Eklendi");
        } else {
            toast.error("Bu Ürün Stokta Yok");
        }
    }, []);

    const searchProducts = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerms = e.target.value.toLowerCase();
        const searchedProducts = ProductsData.filter(prd => prd.name.toLowerCase().includes(searchTerms))
            .map(product => ({
                ...product,
                quantity: 1, // Varsayılan quantity değeri ekleniyor
            }));
        setFilteredProducts(searchedProducts);
    }, []);

    const removeItemsFromCart = () => {
        setCartPrdcts([]);
        localStorage.removeItem("Cart");
    };

    const deleteThisPrdct = useCallback((product: CardProductProps) => {
        setCartPrdcts(prev => {
            if (!prev) return [];
            const updatedCart = prev.filter(prd => prd.id !== product.id);
            localStorage.setItem("Cart", JSON.stringify(updatedCart));
            return updatedCart;
        });
        toast.success("Ürün Sepetten Silindi");
    }, []);

    // 📌 Seçili adresi güncelleme fonksiyonu
    const updateSelectedAddress = (addressId: string | null) => {
        setSelectedAddressId(addressId);
        if (addressId) {
            localStorage.setItem("selectedAddressId", addressId);
        } else {
            localStorage.removeItem("selectedAddressId");
        }
    };

    const value = {
        productCartQty,
        addToBasket,
        removeItemsFromCart,
        cartPrdcts,
        setCartPrdcts,
        deleteThisPrdct,
        deleteCart,
        filterCategory,
        filteredProducts,
        searchProducts,
        selectedAddressId,
        setSelectedAddressId: updateSelectedAddress,
    };

    return <CartContext.Provider value={value} {...props} />;
};

const useCart = () => {
    const context = useContext(CartContext);
    if (context == null) throw new Error("Bir hata oluştu");
    return context;
};

export default useCart;
