"use client";
import React from "react"
import { useEffect, useState } from "react";
import Heading from "../General/Heading";
import ProductsCard from "./ProductsCard";
import axios from "axios";
import { SkeletonCard } from "@/app/skeleton/skeletonCard";
import SkeletonCardProducts from "@/app/skeleton/skeletonCardProducts";

const Category = () => {
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
        <div className="min-h-[65vh] mb-20">
            <Heading text="Tüm Ürünler" />
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
