"use client";
import Image from "next/image";
import { Rating } from "@mui/material";
import PageContainer from "../containers/PageContainer";
import { useState } from "react";
import Counter from "../General/Counter";
import Button from "../General/Button";
import priceClip from "@/app/utils/priceClip";
import Heading from "../General/Heading";
import Comment from "../General/Comment";
import useCart from "@/app/hooks/useCart";
import { MdShoppingCart } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // İkonlar için

export type CardProductProps = {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  image: string;
  inStock: boolean;
};

const DetailClient = ({ product }: { product: any }) => {
  const { addToBasket } = useCart();
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false); // Özelliklerin açılıp kapanması için state

  const [cardProduct, setCardProduct] = useState<CardProductProps>({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: 1,
    image: product.image,
    inStock: product.inStock,
  });

  const increaseFunc = () => {
    if (cardProduct.quantity === 10) return;
    setCardProduct((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
  };

  const decreaseFunc = () => {
    if (cardProduct.quantity === 1) return;
    setCardProduct((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
  };

  const productRating =
    product?.reviews?.reduce((acc: number, item: any) => acc + item.rating, 0) /
    product?.reviews?.length;

  // Özellikleri listelemek için yeni fonksiyon
  const renderProductFeatures = () => {
    if (product.specifications.length > 0) {
      const uniqueSpecifications = product.specifications.filter(
        (spec: any, index: number, self: any[]) =>
          index ===
          self.findIndex((s) => s.specification.name === spec.specification.name)
      );

      return (
        <div className="mt-5 border border-gray-300 rounded-md">
          <div
            className="flex justify-between items-center bg-gray-100 px-4 py-3 cursor-pointer"
            onClick={() => setIsFeaturesVisible(!isFeaturesVisible)}
          >
            <h2 className="font-bold text-lg">Teknik Özellikler</h2>
            {isFeaturesVisible ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {isFeaturesVisible && (
            <div className="px-4 py-2 bg-white">
              <table className="w-full text-sm border-t border-gray-200">
                <tbody>
                  {uniqueSpecifications.map((spec: any) => (
                    <tr
                      key={spec.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="font-semibold py-2 px-2 text-gray-700 w-1/2">
                        {spec.specification.name}
                      </td>
                      <td className="py-2 px-2 text-gray-900">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }
    return <div>Bu ürüne ait özellik bulunmamaktadır.</div>;
  };

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
            <div className="mt-3 text-xl font-bold w-[450px]">
              {product.description}
            </div>
            <div className="mt-10">
              <Image
                src={product.image}
                alt={product.name || "Ürün Görseli"}
                width={430}
                height={400}
              />
            </div>
          </div>
          <div className="flex mr-10 mt-10 flex-col md:w-2/6 w-full ">
            <div className="font-bold text-5xl">₺ {priceClip(product.price)}</div>
            <div className="mt-6 mb-6 text-xl">
              Stok Durumu :
              {product.inStock ? (
                <span className="text-green-500 ml-1">Ürün Stokta Mevcut</span>
              ) : (
                <span className="text-red-500">Ürün Stokta Yok</span>
              )}
            </div>
            <div className="mb-7">
              <Counter
                cardProduct={cardProduct}
                increaseFunc={increaseFunc}
                decreaseFunc={decreaseFunc}
              />
            </div>
            <div>
              <Button
                icon={MdShoppingCart}
                text="Sepete Ekle"
                outline={false}
                small={false}
                onClick={() => {
                  addToBasket(cardProduct);
                }}
              />
            </div>
          </div>
        </div>

        {renderProductFeatures()}

        <h1 className="font-bold text-2xl flex justify-center mt-2">Yorumlar</h1>
        <div>
          {product?.reviews?.map((prd: any) => (
            <Comment key={prd.id} prd={prd} />
          ))}
          {product?.reviews?.length === 0 ? (
            <div>Bu ürüne yorum yapılmamış</div>
          ) : (
            <div></div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default DetailClient;
