"use client";
import DetailClient from '@/app/components/detail/DetailClient';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

type DetailProps = {
    productId?: string;
};

const Detail = ({ params }: { params: DetailProps }) => {
    const [product, setProduct] = useState(null);
    const { productId } = params;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get("/api/product");
                const foundProduct = response.data.find(product => product.id === productId);
                setProduct(foundProduct);
            } catch (error) {
                console.error("Veri çekme hatası:", error);
            }
        };

        fetchProduct();
    }, [productId]);

    if (!product) return <div>Loading...</div>;

    return (
        <div>
            <DetailClient product={product} />
        </div>
    );
};

export default Detail;
