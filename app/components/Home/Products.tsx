"use client";
import React from "react"
import { useEffect, useState } from "react";
import Heading from "../General/Heading";
import ProductsCard from "./ProductsCard";
import axios from "axios";
import { SkeletonCard } from "@/app/skeleton/skeletonCard";
import SkeletonCardProducts from "@/app/skeleton/skeletonCardProducts";
import { MdInfoOutline } from "react-icons/md";

const Category = () => {
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => { setIsOpen(!isOpen); };
    const [products, setProducts] = useState([]);

    // Ürünleri yükleme
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // API'den ürünleri çek
                const response = await axios.get("/api/product"); // `/api/product` endpoint'ini kullanıyoruz
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
                           
                           <p className="text-sm mb-2">Belirli ürünleri aramak için lütfen üst menüden detaylı arama seçeneğini kullanın.
                            </p>
                            
                            <button onClick={togglePopup} className="mt-4 px-4 py-2 bg-renk1 text-white rounded">Kapat</button>
                        </div>
                    </div>
                </>
            )}
            <div className="flex items-center md:justify-start justify-center"><h1 className="font-bold md:ml-20 md:my-7 my-4  text-xl">Tüm Ürünler</h1>
            <div onClick={togglePopup} className="ml-1 cursor-pointer">
                <MdInfoOutline />
            </div></div>
            <div className="flex flex-wrap mx-28 items-center gap-3 md:gap-10">
                {
                    products.length === 0 ? Array.from({ length: 20 }).map((_, index) => (
                        <div className="" key={index}>
                            <SkeletonCardProducts />
                        </div>
                    )) : (products.map((prd, index) => (
                        <ProductsCard key={index} product={prd} />
                    )))
                }
            </div>
        </div>
    );
};

export default Category;
