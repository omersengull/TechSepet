import useCart from "@/app/hooks/useCart";
import { MdOutlineShoppingCart } from "react-icons/md";
import React from "react"

const ShoppingCart = () => {
  const { cartPrdcts } = useCart();



  return (
    <div className="rounded-full  border border-white p-4 bg-white cursor-pointer relative">
      <MdOutlineShoppingCart className="text-black text-lg" />
      <div className={` ${cartPrdcts?.length === 0 ? "hidden" : "absolute -top-2 -right-5 px-2 py-1 text-xs rounded-full bg-slate-900"}  `}>{cartPrdcts?.length}</div>
    </div>
  );
};

export default ShoppingCart;
