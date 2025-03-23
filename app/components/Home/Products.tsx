"use client";
import React, { useEffect, useState, useRef } from "react";
import ProductsCard from "./ProductsCard";
import axios from "axios";
import SkeletonCardProducts from "@/app/skeleton/skeletonCardProducts";
import { MdInfoOutline } from "react-icons/md";
import Modal from "../Modal";

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

const ITEMS_PER_SLIDE = 5; // Her slaytta gösterilecek ürün sayısı

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

  // Hover için zamanlayıcı referansları
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleModalMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleModalMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsModalOpen(false);
      setSelectedProduct(null);
    }, 500);
  };

  // API'den en çok satılan ürünleri çek
  // FeaturedProductsDualSlider bileşeninde
 // Frontend: components/FeaturedProductsDualSlider.tsx
useEffect(() => {
  const fetchBestSelling = async () => {
    try {
      const response = await axios.get("/api/order");
      setBestSellingProducts(response.data);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
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
  const groupedBestSellers: Product[][] = groupProducts(bestSellingProducts, ITEMS_PER_SLIDE);
  const groupedFavourites: Product[][] = groupProducts(favouriteProducts, ITEMS_PER_SLIDE);

  // Slider otomatik geçiş (en çok satılanlar)
  useEffect(() => {
    if (groupedBestSellers.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrentBestSellerSlide(prev => (prev + 1) % groupedBestSellers.length);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, [groupedBestSellers]);

  // Slider otomatik geçiş (favoriler)
  useEffect(() => {
    if (groupedFavourites.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrentFavouriteSlide(prev => (prev + 1) % groupedFavourites.length);
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

        <div className="relative overflow-hidden w-full pb-12">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentBestSellerSlide * 100}%)` }}
          >
            {groupedBestSellers.length === 0
              ? Array.from({ length: 3 }).map((_, groupIndex) => (
                <div key={groupIndex} className="min-w-full flex gap-4">
                  {Array.from({ length: ITEMS_PER_SLIDE }).map((__, subIndex) => (
                    <div key={subIndex} className="w-full">
                      <SkeletonCardProducts />
                    </div>
                  ))}
                </div>
              ))
              : groupedBestSellers.map((group, groupIndex) => (
                <div key={groupIndex} className="min-w-full flex gap-4">
                  {group.map((prd, index) => (
                    <div key={prd.id || index} className="w-1/5">
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
                className={`w-3 h-3 rounded-full cursor-pointer ${index === currentBestSellerSlide ? "bg-white" : "bg-gray-400"
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

        <div className="relative overflow-hidden w-full pb-12">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentFavouriteSlide * 100}%)` }}
          >
            {groupedFavourites.length === 0
              ? Array.from({ length: 3 }).map((_, groupIndex) => (
                <div key={groupIndex} className="min-w-full flex gap-4">
                  {Array.from({ length: ITEMS_PER_SLIDE }).map((__, subIndex) => (
                    <div key={subIndex} className="w-full">
                      <SkeletonCardProducts />
                    </div>
                  ))}
                </div>
              ))
              : groupedFavourites.map((group, groupIndex) => (
                <div key={groupIndex} className="min-w-full flex gap-4">
                  {group.map((prd, index) => (
                    <div key={`${prd.id}-${index}`} className="w-1/5">
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
                className={`w-3 h-3 rounded-full cursor-pointer ${index === currentFavouriteSlide ? "bg-white" : "bg-gray-400"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Ortak Modal */}
      {isModalOpen && selectedProduct && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onMouseEnter={handleModalMouseEnter}
          onMouseLeave={handleModalMouseLeave}
          productImage={selectedProduct.image}
          productName={selectedProduct.name}
          productDescription={selectedProduct.description}
          price={selectedProduct.price}
          reviews={selectedProduct.reviews || []}
        />
      )}
    </div>
  );
};

export default FeaturedProductsDualSlider;
