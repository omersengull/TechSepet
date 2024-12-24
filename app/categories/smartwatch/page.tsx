import React from 'react'
import Heading from '@/app/components/General/Heading'
import { ProductsData } from '@/app/utils/ProductsData'
import ProductsCard from '@/app/components/Home/ProductsCard'
const page = () => {
    const filteredProducts = ProductsData.filter(prd => prd.category === "Akıllı Saat")
    return (
        <div>
            <Heading text='Akıllı Saatler' />
            <div className='flex flex-wrap mx-20 items-center gap-3 md:gap-10'>{
                filteredProducts.map(prd =>
                    <ProductsCard key={prd.id} product={prd} />
                )
            }</div>
        </div>
    )
}

export default page