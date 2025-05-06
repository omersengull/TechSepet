"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CardProductProps } from "../components/detail/DetailClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React from "react";

interface CartProduct extends CardProductProps {
  quantity: number;
}

interface CartContextProps {
    removeItemsFromCart: () => void;
    productCartQty: number;
    addToBasket: (product: CardProductProps) => Promise<void>;
    cartPrdcts: CartProduct[] | null;
    setCartPrdcts: React.Dispatch<React.SetStateAction<CartProduct[] | null>>;
    deleteCart: () => void;
    deleteThisPrdct: (product: CartProduct) => void;
    filterCategory: (category: any) => void;
    filteredProducts: CardProductProps[] | null;
    searchProducts: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedAddressId: string | null;
    setSelectedAddressId: (addressId: string | null) => void;
    increaseQuantity: (productId: string) => Promise<void>;
    decreaseQuantity: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextProps | null>(null);

interface Props {
    [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
    const router = useRouter();
    const [filteredProducts, setFilteredProducts] = useState<CardProductProps[]>([]);
    const [productCartQty, setProductCartQty] = useState(0);
    const [cartPrdcts, setCartPrdcts] = useState<CartProduct[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);


   

    // Sepet miktarını hesapla
    useEffect(() => {
        const calculateTotalQty = () => cartPrdcts?.reduce((total, p) => total + p.quantity, 0) || 0;
        setProductCartQty(calculateTotalQty());
    }, [cartPrdcts]);

    // LocalStorage'dan sepeti yükle
    useEffect(() => {
        // loadCart fonksiyonunu güncelleyin
// loadCart fonksiyonunu güncelleyin
const loadCart = async () => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("Cart");
      if (!storedCart) return;
  
      try {
        const parsed = JSON.parse(storedCart);
        const validatedCart = await validateCartItems(parsed); // 👈 Stok kontrolü ekle
        setCartPrdcts(validatedCart);
      } catch {
        console.warn("Sepet verisi geçersiz");
        setCartPrdcts([]);
      }
    }
  };
        loadCart();
    }, []);
    useEffect(() => { localStorage.setItem("Cart", JSON.stringify(cartPrdcts)); }, [cartPrdcts]);
    // Sepet değişikliklerini LocalStorage'a kaydet
    useEffect(() => {
        const timer = setTimeout(() => {
          if (typeof window !== "undefined" && cartPrdcts) {
            localStorage.setItem("Cart", JSON.stringify(cartPrdcts));
          }
        }, 500); // 500ms gecikmeli kaydetme
        return () => clearTimeout(timer);
      }, [cartPrdcts]);

      const validateCartItems = async (cartItems: CartProduct[]) => {
        const validatedItems = await Promise.all(
          cartItems.map(async (item) => {
            const cachedStock = localStorage.getItem(`stock_${item.id}`);
            if (cachedStock) {
              return parseInt(cachedStock) >= item.quantity ? item : null;
            }
            try {
              const res = await fetch(`/api/product/${item.id}`);
              const { stock } = await res.json();
              localStorage.setItem(`stock_${item.id}`, stock.toString()); // Önbelleğe al
              return stock >= item.quantity ? item : null;
            } catch {
              return null;
            }
          })
        );
        return validatedItems.filter(Boolean) as CartProduct[];
      };

      const addToBasket = useCallback(async (product: CardProductProps) => {
        try {
          const res = await fetch(`/api/product/${product.id}`);
          if (!res.ok) throw new Error("Ürün bilgisi alınamadı");
          
          const { stock } = await res.json();
          const quantityToAdd = product.quantity || 1;
      
          // Önce stok kontrolü yapalım (hata durumunda erken çıkış)
          if (stock <= 0) {
            toast.error("Bu ürün stokta yok");
            return;
          }
      
          // Sepet güncelleme işlemi
          setCartPrdcts(prev => {
            const prevCart = prev || [];
            const existingItem = prevCart.find(p => p.id === product.id);
      
            if (existingItem) {
              const newQuantity = existingItem.quantity + quantityToAdd;
              if (newQuantity > stock) {
                toast.error(`Maksimum ${stock} adet ekleyebilirsiniz`);
                return prevCart;
              }
              return prevCart.map(p => 
                p.id === product.id ? { ...p, quantity: newQuantity } : p
              );
            } else {
              if (quantityToAdd > stock) {
                toast.error(`Maksimum ${stock} adet ekleyebilirsiniz`);
                return prevCart;
              }
              return [...prevCart, { ...product, quantity: quantityToAdd }];
            }
          });
      
          // Başarı mesajını SADECE burada göster
          toast.success("Ürün sepete eklendi", { 
            id: "unique-add-to-cart" // Aynı mesajın tekrarını önler
          });
      
        } catch (error) {
          console.error("Hata:", error);
          toast.error("Ürün eklenemedi");
        }
      }, []);

    const updateQuantity = async (productId: string, operation: 'increase' | 'decrease') => {
        try {
            const res = await fetch(`/api/product/${productId}`);
            if (!res.ok) throw new Error("Ürün bilgisi alınamadı");
            const { stock } = await res.json();

            setCartPrdcts(prev => 
                prev.map(item => {
                  if (item.id !== productId) return item;
              
                  const newQuantity = operation === 'increase'
                    ? Math.min(item.quantity + 1, stock)
                    : Math.max(item.quantity - 1, 1);
              
                  if (operation === 'increase' && newQuantity === item.quantity) {
                    toast.error(`Maksimum ${stock} adet ekleyebilirsiniz`);
                  }
              
                  return { ...item, quantity: newQuantity };
                })
              );
        } catch (error) {
            toast.error("Stok durumu güncellenemedi");
        }
    };

    const increaseQuantity = useCallback(async (productId: string) => {
        await updateQuantity(productId, 'increase');
    }, []);

    const decreaseQuantity = useCallback(async (productId: string) => {
        await updateQuantity(productId, 'decrease');
    }, []);

    // Diğer fonksiyonlar aynı kalacak...

    const value = {
        productCartQty,
        addToBasket,
        removeItemsFromCart: () => setCartPrdcts([]),
        cartPrdcts,
        setCartPrdcts,
        deleteCart: () => {
            localStorage.removeItem("Cart");
            setCartPrdcts([]);
            toast.success("Sepet boşaltıldı");
        },
        deleteThisPrdct: (product: CartProduct) => {
            setCartPrdcts(prev => prev?.filter(p => p.id !== product.id) || null);
            toast.success("Ürün sepetten çıkarıldı");
        },
        filterCategory: useCallback((category: string) => router.push(`/categories/${category}`), [router]),
        filteredProducts,
        searchProducts: useCallback(async (e) => {
            // Arama mantığı aynı kalacak...
        }, []),
        selectedAddressId,
        setSelectedAddressId: useCallback((id) => {
            setSelectedAddressId(id);
            id ? localStorage.setItem("selectedAddressId", id) 
               : localStorage.removeItem("selectedAddressId");
        }, []),
        increaseQuantity,
        decreaseQuantity
    };

    return <CartContext.Provider value={value} {...props} />;
};

const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart bir CartContextProvider içinde kullanılmalıdır");
    return context;
};

export default useCart;