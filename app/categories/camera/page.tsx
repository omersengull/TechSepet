"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/app/components/General/Heading";
import ProductsCard from "@/app/components/Home/ProductsCard";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  // Gerekli diğer alanlar varsa ekleyebilirsin
}

const Page = () => {
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Ürünleri çekerken hata oluştu:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleMouseEnter = (product: Product) => {
    setHoveredProduct(product);
    console.log("Ürün üzerine gelindi:", product);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
    console.log("Ürün üzerinden çıkıldı.");
  };

  const filteredProducts = products.filter((prd) => prd.category === "Kamera");

  return (
    <div>
      <Heading text="Kameralar" />
      <div className="flex flex-wrap mx-20 items-center gap-3 md:gap-10">
        {filteredProducts.map((prd) => (
          <ProductsCard
            key={prd.id}
            product={prd}
            onMouseEnter={() => handleMouseEnter(prd)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
