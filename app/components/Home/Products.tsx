"use client";
import React, { useEffect, useState, useRef } from "react";
import ProductsCard from "./ProductsCard";
import axios from "axios";
import SkeletonCardProducts from "@/app/skeleton/skeletonCardProducts";
import { MdInfoOutline } from "react-icons/md";


// Ürün tipi tanımı
export interface Product {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  reviews?: any[];
  totalSales?: number;
  averageRating?: number;
  reviewCount?: number;
  totalViews?: number;
  addedAt?: string;
  discountActive?: boolean;
}

// Ürünleri gruplara ayırmak için yardımcı fonksiyon
const groupProducts = (products: Product[], itemsPerSlide: number): Product[][] => {
  const groups: Product[][] = [];
  for (let i = 0; i < products.length; i += itemsPerSlide) {
    groups.push(products.slice(i, i + itemsPerSlide));
  }
  return groups;
};

const FeaturedProductsDualSlider: React.FC = () => {
  // Popup için state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const togglePopup = () => setIsOpen(!isOpen);

  // En çok satılan ve favori ürünler
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [favouriteProducts, setFavouriteProducts] = useState<Product[]>([]);

  // Modal için ortak state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Slider state'leri
  const [currentBestSellerSlide, setCurrentBestSellerSlide] = useState<number>(0);
  const [currentFavouriteSlide, setCurrentFavouriteSlide] = useState<number>(0);

  // Responsive: her slaytta gösterilecek ürün sayısı
  const [itemsPerSlide, setItemsPerSlide] = useState<number>(5);
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 768) {
        setItemsPerSlide(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(3);
      } else if (window.innerWidth < 1280) {
        setItemsPerSlide(4);
      } else {
        setItemsPerSlide(5);
      }
    };
    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  // Hover için zamanlayıcı referansları
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobil kaydırma (swipe) için referanslar
  const bestSellerTouchStartXRef = useRef<number | null>(null);
  const favouriteTouchStartXRef = useRef<number | null>(null);

  // Modal açma/kapama işlemleri
  const handleMouseEnter = (product: Product) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setSelectedProduct(product);
      setIsModalOpen(true);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsModalOpen(false);
      setSelectedProduct(null);
    }, 500);
  };



  // Best seller slider için touch event handler’ları
  const handleBestSellerTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    bestSellerTouchStartXRef.current = e.touches[0].clientX;
  };

  const handleBestSellerTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (bestSellerTouchStartXRef.current !== null) {
      const diff = e.changedTouches[0].clientX - bestSellerTouchStartXRef.current;
      if (Math.abs(diff) > 50) {
        if (diff < 0) {
          setCurrentBestSellerSlide((prev) =>
            (prev + 1) % groupedBestSellers.length
          );
        } else {
          setCurrentBestSellerSlide((prev) =>
            (prev - 1 + groupedBestSellers.length) % groupedBestSellers.length
          );
        }
      }
      bestSellerTouchStartXRef.current = null;
    }
  };

  // Favori slider için touch event handler’ları
  const handleFavouriteTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    favouriteTouchStartXRef.current = e.touches[0].clientX;
  };

  const handleFavouriteTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (favouriteTouchStartXRef.current !== null) {
      const diff = e.changedTouches[0].clientX - favouriteTouchStartXRef.current;
      if (Math.abs(diff) > 50) {
        if (diff < 0) {
          setCurrentFavouriteSlide((prev) =>
            (prev + 1) % groupedFavourites.length
          );
        } else {
          setCurrentFavouriteSlide((prev) =>
            (prev - 1 + groupedFavourites.length) % groupedFavourites.length
          );
        }
      }
      favouriteTouchStartXRef.current = null;
    }
  };

  // API'den en çok satılan ürünleri çek
  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const response = await axios.get("/api/order");
        if (response.data && response.data.length > 0) {
          setBestSellingProducts(response.data);
        } else {
          console.log("Çok satan ürün bulunamadı.");
        }
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        // Kullanıcıya hata mesajı göster
      }
    };
    fetchBestSelling();
  }, []);

  // API'den en çok favorilenen ürünleri çek
  useEffect(() => {
    const fetchFavourite = async () => {
      try {
        const response = await axios.get<Product[]>("/api/favorites");
        // Dönen verinin favorilere eklenme sayısına göre sıralı olduğunu varsayıyoruz.
        setFavouriteProducts(response.data);
      } catch (error) {
        console.error("Favori ürünler çekilirken hata oluştu:", error);
      }
    };
    fetchFavourite();
  }, []);

  // Slider için ürünleri gruplara ayır
  const groupedBestSellers: Product[][] = groupProducts(bestSellingProducts, itemsPerSlide);
  const groupedFavourites: Product[][] = groupProducts(favouriteProducts, itemsPerSlide);

  // Slider otomatik geçiş (en çok satılanlar)
  useEffect(() => {
    if (groupedBestSellers.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrentBestSellerSlide((prev) => (prev + 1) % groupedBestSellers.length);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, [groupedBestSellers]);

  // Slider otomatik geçiş (favoriler)
  useEffect(() => {
    if (groupedFavourites.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrentFavouriteSlide((prev) => (prev + 1) % groupedFavourites.length);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, [groupedFavourites]);

  return (
    <div className="min-h-screen mb-20">
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-300 p-4 shadow-lg rounded-lg w-[300px] md:w-[600px]">
              <p className="text-sm mb-2">
                Belirli ürünleri aramak için lütfen üst menüden detaylı arama seçeneğini kullanın.
              </p>
              <button onClick={togglePopup} className="mt-4 px-4 py-2 bg-renk1 text-white rounded">
                Kapat
              </button>
            </div>
          </div>
        </>
      )}

      {/* En Çok Satılanlar Bölümü */}
      <div className="mb-16 mx-16">
        <div className="flex items-center md:justify-start justify-center">
          <h1 className="font-bold md:ml-20 md:my-7 my-4 text-xl">Çok Satılanlar</h1>
          <div onClick={togglePopup} className="ml-1 cursor-pointer">
            <MdInfoOutline />
          </div>
        </div>

        <div
          className="relative overflow-hidden w-full pb-12"
          onTouchStart={handleBestSellerTouchStart}
          onTouchEnd={handleBestSellerTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentBestSellerSlide * 100}%)` }}
          >
            {groupedBestSellers.length === 0
              ? Array.from({ length: 3 }).map((_, groupIndex) => (
                  <div key={groupIndex} className="min-w-full flex gap-4">
                    {Array.from({ length: itemsPerSlide }).map((__, subIndex) => (
                      <div key={subIndex} style={{ flex: `0 0 ${100 / itemsPerSlide}%` }}>
                        <SkeletonCardProducts />
                      </div>
                    ))}
                  </div>
                ))
              : groupedBestSellers.map((group, groupIndex) => (
                  <div key={groupIndex} className="min-w-full flex gap-4">
                    {group.map((prd, index) => (
                      <div
                        key={`${prd.id}-${index}`}
                        style={{ flex: `0 0 ${100 / itemsPerSlide}%` }}
                      >
                        <ProductsCard
                          onMouseEnter={() => handleMouseEnter(prd)}
                          onMouseLeave={handleMouseLeave}
                          product={prd}
                        />
                      </div>
                    ))}
                  </div>
                ))}
          </div>
          {/* Dot Navigasyonu */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {groupedBestSellers.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentBestSellerSlide(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  index === currentBestSellerSlide ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* En Çok Favorilenenler Bölümü */}
      <div className="mb-16 mx-16">
        <div className="flex items-center md:justify-start justify-center">
          <h1 className="font-bold md:ml-20 md:my-7 my-4 text-xl">Çok Beğenilenler</h1>
          <div onClick={togglePopup} className="ml-1 cursor-pointer">
            <MdInfoOutline />
          </div>
        </div>

        <div
          className="relative overflow-hidden w-full pb-12"
          onTouchStart={handleFavouriteTouchStart}
          onTouchEnd={handleFavouriteTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentFavouriteSlide * 100}%)` }}
          >
            {groupedFavourites.length === 0
              ? Array.from({ length: 3 }).map((_, groupIndex) => (
                  <div key={groupIndex} className="min-w-full flex gap-4">
                    {Array.from({ length: itemsPerSlide }).map((__, subIndex) => (
                      <div key={subIndex} style={{ flex: `0 0 ${100 / itemsPerSlide}%` }}>
                        <SkeletonCardProducts />
                      </div>
                    ))}
                  </div>
                ))
              : groupedFavourites.map((group, groupIndex) => (
                  <div key={groupIndex} className="min-w-full flex gap-4">
                    {group.map((prd, index) => (
                      <div
                        key={`${prd.id}-${index}`}
                        style={{ flex: `0 0 ${100 / itemsPerSlide}%` }}
                      >
                        <ProductsCard
                          onMouseEnter={() => handleMouseEnter(prd)}
                          onMouseLeave={handleMouseLeave}
                          product={prd}
                        />
                      </div>
                    ))}
                  </div>
                ))}
          </div>
          {/* Dot Navigasyonu */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {groupedFavourites.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentFavouriteSlide(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  index === currentFavouriteSlide ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default FeaturedProductsDualSlider;