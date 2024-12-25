"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CardProductProps } from "../components/detail/DetailClient";
import { ProductsData } from "../utils/ProductsData";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React from "react"
interface CartContextProps {
    productCartQty: number;
    addToBasket: (product: CardProductProps) => void;
    cartPrdcts: CardProductProps[] | null;
    setCartPrdcts: React.Dispatch<React.SetStateAction<CardProductProps[] | null>>;
    deleteCart: () => void;
    deleteThisPrdct: (product: CardProductProps) => void;
    filterCategory: (category: any) => void;
    filteredProducts: CardProductProps[] | null;
    searchProducts: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CartContext = createContext<CartContextProps | null>(null);

interface Props {
    [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
    const router = useRouter()
    const [filteredProducts, setFilteredProducts] = useState<CardProductProps[]>([]);
    const [productCartQty, setProductCartQty] = useState(0);
    const [cartPrdcts, setCartPrdcts] = useState<CardProductProps[] | null>(null);

    useEffect(() => {
        const getItem = localStorage.getItem("Cart");
        const getItemParse: CardProductProps[] | null = getItem ? JSON.parse(getItem) : null;
        setCartPrdcts(getItemParse);
    }, []);

    const deleteCart = useCallback(() => {
        setCartPrdcts([]);
        localStorage.clear();
    }

        , []);

    const filterCategory = useCallback((category: any) => {
        router.push(`/categories/${category}`);
    }, []);

    const addToBasket = useCallback((product: CardProductProps) => {
        if (product.inStock == true) {
            setCartPrdcts(prev => {
                const updatedCart = prev ? [...prev, product] : [product];
                localStorage.setItem('Cart', JSON.stringify(updatedCart));
                return updatedCart;
            });
            toast.success("Ürün Sepete Eklendi");
        }
        else {
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
    
    const deleteThisPrdct = useCallback((product: CardProductProps) => {
        setCartPrdcts(prev => {
            if (!prev) return [];
            const updatedCart = prev.filter(prd => prd.id !== product.id);
            localStorage.setItem('Cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
        toast.success("Ürün Sepetten Silindi");
    }, []);

    const value = {
        productCartQty,
        addToBasket,
        cartPrdcts,
        setCartPrdcts,
        deleteThisPrdct,
        deleteCart,
        filterCategory,
        filteredProducts,
        searchProducts
    };

    return (
        <CartContext.Provider value={value} {...props} />
    );
};

const useCart = () => {
    const context = useContext(CartContext);
    if (context == null) throw new Error('Bir hata oluştu');
    return context;
}

export default useCart;
