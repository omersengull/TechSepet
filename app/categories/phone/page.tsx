import React from 'react'
import Heading from '@/app/components/General/Heading'
import { ProductsData } from '@/app/utils/ProductsData'
import ProductsCard from '@/app/components/Home/ProductsCard'
const page = () => {
    const filteredProducts = ProductsData.filter(prd => prd.category === "Telefon")
    return (
        <div>
            <Heading text='Telefonlar' />
            <div className='flex flex-wrap mx-20 items-center gap-3 md:gap-10'>{
                filteredProducts.map(prd =>
                    <ProductsCard key={prd.id} product={prd} />
                )
            }</div>
        </div>
    )
}

export default page