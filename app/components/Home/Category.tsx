"use client";
import { useState } from 'react';
import useCart from '@/app/hooks/useCart';
import React from "react"
const Category = () => {
    const categoryList = [
        { name: 'Telefon', value: 'phone' },
        { name: 'Laptop', value: 'laptop' },
        { name: 'Akıllı Saat', value: 'smartwatch' },
        { name: 'Kulaklık', value: 'earphone' },
        { name: 'Gaming', value: 'gaming' },
        { name: 'Televizyon', value: 'television' },
        { name: 'Kamera', value: 'camera' },
        { name: 'Oyun Konsolu', value: 'gameconsole' }
    ];
    const { filterCategory } = useCart();
    return (
        <div>
            <div className='flex bg-renk1 flex-row justify-center px-3  md:px-10 items-center pb-1 md:pb-2 gap-3 md:gap-6 overflow-x-auto'>
                {categoryList.map((category, index) => (
                    <div className="flex items-center" key={index}>
                        <div 
                            onClick={() => filterCategory(category.value)}
                            className="z-0 transition-transform transform hover:scale-110 hover:text-blue-400 hover:font-bold duration-200 cursor-pointer text-white flex-shrink-0 text-center py-1 px-2"
                        >
                            {category.name}
                        </div>
                        {index < categoryList.length - 1 && (
                            <span className="text-white pl-11 pr-3">|</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
