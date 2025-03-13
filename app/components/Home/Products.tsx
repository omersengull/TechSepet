"use client";
import React, { useEffect, useState, useRef } from "react";
import Heading from "../General/Heading";
import ProductsCard from "./ProductsCard";
import axios from "axios";
import { SkeletonCard } from "@/app/skeleton/skeletonCard";
import SkeletonCardProducts from "@/app/skeleton/skeletonCardProducts";
import { MdInfoOutline } from "react-icons/md";
import priceClip from "@/app/utils/priceClip";
import Modal from "../Modal";

const Category = () => {
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => { setIsOpen(!isOpen); };

  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Açma ve kapatma time-out referansları
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ürün kartı üzerine gelindiğinde 1.5 saniye sonra modalı aç
  const handleMouseEnter = (product: any) => {
    // Eğer modal kapanma için zamanlanmışsa, iptal edelim
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setSelectedProduct(product);
      setIsModalOpen(true);
    }, 2000);
  };

  // Ürün kartından çıkıldığında modalı kapatmak için gecikmeli işlem başlat
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

  // Modal üzerine gelindiğinde kapanma zamanlamasını iptal et
  const handleModalMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Modal’dan çıkıldığında yeniden kapanmayı zamanla
  const handleModalMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsModalOpen(false);
      setSelectedProduct(null);
    }, 500);
  };

  // Ürünleri API'den çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product");
        setProducts(response.data);
      } catch (error) {
        console.error("Ürünler yüklenirken hata oluştu:", error);
      }
    };
    fetchProducts();
  }, []);

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

      <div className="flex items-center md:justify-start justify-center">
        <h1 className="font-bold md:ml-20 md:my-7 my-4 text-xl">Tüm Ürünler</h1>
        <div onClick={togglePopup} className="ml-1 cursor-pointer">
          <MdInfoOutline />
        </div>
      </div>

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

      <div className="flex flex-wrap sm:mx-28 mx-7 items-center gap-3 md:gap-10">
        {products.length === 0
          ? Array.from({ length: 20 }).map((_, index) => (
              <div key={index}>
                <SkeletonCardProducts />
              </div>
            ))
          : products.map((prd, index) => (
              <ProductsCard
                onMouseEnter={() => handleMouseEnter(prd)}
                onMouseLeave={handleMouseLeave}
                key={index}
                product={prd}
              />
            ))}
      </div>
    </div>
  );
};

export default Category;
