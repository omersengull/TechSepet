"use client"
import React, { useState } from 'react'
import Heading from '@/app/components/General/Heading'
import { ProductsData } from '@/app/utils/ProductsData'
import ProductsCard from '@/app/components/Home/ProductsCard'
const page = () => {
    const [hoveredProduct, setHoveredProduct] = useState<any>(null);
    
      const handleMouseEnter = (product: any) => {
        setHoveredProduct(product);
        console.log("Ürün üzerine gelindi:", product);
        // İsteğe bağlı: Burada modal açma gibi işlemler yapılabilir.
      };
    
      const handleMouseLeave = () => {
        setHoveredProduct(null);
        console.log("Ürün üzerinden çıkıldı.");
        // İsteğe bağlı: Modal kapatma işlemleri yapılabilir.
      };
    const filteredProducts = ProductsData.filter(prd => prd.category === "Oyun Konsolu")
    return (
        <div>
            <Heading text='Oyun Konsolları' />
            <div className='flex flex-wrap mx-20 items-center gap-3 md:gap-10'>{
                filteredProducts.map(prd =>
                    <ProductsCard
                        key={prd.id}
                        product={prd}
                        onMouseEnter={() => handleMouseEnter(prd)}
                        onMouseLeave={handleMouseLeave}
                    />
                )
            }</div>
        </div>
    )
}

export default page