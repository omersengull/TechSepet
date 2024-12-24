import { CardProductProps } from "../detail/DetailClient"
interface CounterProps {
    cardProduct: CardProductProps,
    increaseFunc: () => void,
    decreaseFunc: () => void,
}
const Counter: React.FC<CounterProps> = ({ cardProduct, increaseFunc, decreaseFunc }) => {
    return (
        <div className="cursor-pointer flex flex-row items-center">
            Miktar
            <div className="border ml-2 rounded-md px-3 py-1" onClick={decreaseFunc}>-</div>
            <div className="border  rounded-md px-3 py-1">{cardProduct.quantity}</div>
            <div className="border  rounded-md px-3 py-1" onClick={increaseFunc}>+</div>
        </div>
    )
}

export default Counter