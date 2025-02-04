"use client"
import Image from "next/image"
import { Rating } from "@mui/material"
import PageContainer from "../containers/PageContainer"
import { useContext, useState } from "react"
import Counter from "../General/Counter"
import Button from "../General/Button"
import priceClip from "@/app/utils/priceClip"
import Heading from "../General/Heading"
import Comment from "../General/Comment"
import useCart from "@/app/hooks/useCart"
import { MdShoppingCart } from "react-icons/md"
import React from "react"
export type CardProductProps = {
  id: string,
  name: string,
  description: string,
  price: string,
  quantity: number,
  image: string,
  inStock: boolean
}

const DetailClient = ({ product }: { product: any }) => {
  const { productCartQty, addToBasket, cartPrdcts } = useCart();
  const [cardProduct, setCardProduct] = useState<CardProductProps>({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: 1,
    image: product.image,
    inStock: product.inStock
  })

  const increaseFunc = () => {
    if (cardProduct.quantity === 10) return
    setCardProduct(prev => ({ ...prev, quantity: prev.quantity + 1 }))
  }

  const decreaseFunc = () => {
    if (cardProduct.quantity === 1) return
    setCardProduct(prev => ({ ...prev, quantity: prev.quantity - 1 }))
  }
  const productRating = product?.reviews?.reduce((acc: number, item: any) => acc + item.rating, 0) / product?.reviews?.length
  return (
    <div>
      <PageContainer>
        <div className="flex md:flex-row flex-col">
          <div className="relative flex flex-col w-full md:w-1/2">
            <div className="flex flex-row justify-start">
              <Rating name="read-only" value={productRating} readOnly />
              <span className="mx-2 text-slate-500">|</span>
              <div>Ürün no: {product.id}</div>
              <span className="mx-2 text-slate-500">|</span>
              <div>{product.brand}</div>
            </div>
            <div className="mt-3 text-xl font-bold w-[450px]">{product.description}</div>
            <div className="mt-10">
              <Image src={product.image} alt={product.name || "Ürün Görseli"} width={430} height={400} />
            </div>
          </div>
          <div className="flex mr-10 mt-10 flex-col md:w-2/6 w-full ">
            <div className="font-bold text-5xl">₺ {priceClip(product.price)}</div>
            <div className="mt-6 mb-6 text-xl">
              Stok Durumu :
              {product.inStock ? <span className="text-green-500 ml-1">Ürün Stokta Mevcut</span> : <span className="text-red-500">Ürün Stokta Yok</span>}
            </div>
            <div className="mb-7">
              <Counter
                cardProduct={cardProduct}
                increaseFunc={increaseFunc}
                decreaseFunc={decreaseFunc}
              />
            </div>
            <div>
              <Button icon={MdShoppingCart} text="Sepete Ekle" outline={false} small={false} onClick={() => { addToBasket(cardProduct) }} />
            </div>
          </div>

        </div>
        <Heading text='Yorumlar' />
        <div>
          {
            product?.reviews?.map((prd: any) => (
              <Comment key={prd.id} prd={prd} />
            ))
          }
          {
            product?.reviews?.length == 0 ? <div>Bu ürüne yorum yapılmamış</div> : <div></div>
          }
        </div>


      </PageContainer>
    </div>
  )
}

export default DetailClient
