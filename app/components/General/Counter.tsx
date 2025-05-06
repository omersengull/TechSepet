import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6"
import { CardProductProps } from "../detail/DetailClient"
import React from "react"

interface CounterProps {
    cardProduct: CardProductProps,
    increaseFunc: (e: React.MouseEvent) => void, // Fonksiyon tipini güncelle
    decreaseFunc: (e: React.MouseEvent) => void,
}

const Counter: React.FC<CounterProps> = ({ cardProduct, increaseFunc, decreaseFunc }) => {
    return (
        <div className="cursor-pointer flex flex-row items-center">
            Miktar
            <FaCircleMinus 
                className="text-xl ml-2 mr-2"
                onClick={(e) => {
                    decreaseFunc(e); // Event'i aktar
                    e.stopPropagation();
                }}
            />
            <div>{cardProduct.quantity}</div>
            <FaCirclePlus 
                className="ml-2 text-xl" 
                onClick={(e) => {
                    increaseFunc(e); // Event'i aktar
                    e.stopPropagation();
                }}
            />
        </div>
    )
}

export default Counter