"use client"
import DetailClient from '@/app/components/detail/DetailClient'
import axios from 'axios'
import React from 'react'

type DetailProps = {
    productId?: string
}
const Detail = async ({ params }: { params: DetailProps }) => {
    const response = await axios.get("/api/product");
    const { productId } = params;
    const product = response.data.find(product => product.id === productId);
    console.log(product, "product")
    return (
        <div>
            <DetailClient product={product} />
        </div>
    )

}

export default Detail