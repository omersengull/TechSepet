"use client";
import { useRef } from "react";
import Image from "next/image";
import { Rating } from "@mui/material";
import PageContainer from "../containers/PageContainer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useEffect, useState } from "react";
import Counter from "../General/Counter";
import Button from "../General/Button";
import priceClip from "@/app/utils/priceClip";
import Comment from "../General/Comment";
import { useRouter } from "next/navigation";
import useCart from "@/app/hooks/useCart";
import { MdShoppingCart } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // İkonlar için
import ProductRecommendations from "../ProductRecommendationCard"; // Öneri bileşeni eklendi
import ProductRecommendationCard from "../ProductRecommendationCard";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const detailsRef = useRef<HTMLDivElement>(null); 


  useEffect(() => {
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 500); // Yarım saniye sonra aşağı kaydır
  }, []); // Sayfa yüklendiğinde çalıştır
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/recommendations?productId=${product.id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendedProducts(data.recommendedProducts);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [product.id]);
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`/api/recommend/${product.id}`);

        const data = await response.json();
        console.log("api yanıtı:", data);
        if (response.ok) {
          setRecommendedProducts(data.recommendedProducts);
        } else {
          console.error("Hata:", data.error);
        }
      } catch (error) {
        console.error("API isteği başarısız:", error);
      }
    };

    if (product.id) {
      fetchRecommendations();
    }
  }, [product.id]);
  console.log("Recommendeds", recommendedProducts);

  const router = useRouter();
  const { addToBasket } = useCart();
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false); // Özelliklerin açılıp kapanması için state

  if (!product || !product.id) {
    return <p>Ürün yükleniyor veya bulunamadı...</p>;
  }

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
    if (product.specifications && product.specifications.length > 0) {
      const uniqueSpecifications = product.specifications.filter(
        (spec: any, index: number, self: any[]) =>
          index ===
          self.findIndex((s) => s.specification.name === spec.specification.name)
      );

      return (
        <div className="mt-5 border border-gray-300 dark:border-white rounded-md">
          <div
            className="flex justify-between items-center bg-gray-100 px-4 py-3 cursor-pointer"
            onClick={() => setIsFeaturesVisible(!isFeaturesVisible)}
          >
            <h2 className="font-bold text-lg dark:text-black">Teknik Özellikler</h2>
            {isFeaturesVisible ? <FaChevronUp className="dark:text-black" /> : <FaChevronDown className="dark:text-black" />}
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
            <div className="flex flex-wrap md:flex-row flex-col justify-start text-sm md:text-base">
              <div className="flex items-center">
                <Rating name="read-only" className="dark:text-white" value={productRating} readOnly />
              </div>
              <span className="mx-2 text-slate-500 hidden md:inline">|</span>
              <div className="flex items-center mt-1 md:mt-0">Ürün no: {product.id}</div>
              <span className="mx-2 text-slate-500 hidden md:inline">|</span>
              <div className="flex items-center mt-1 md:mt-0">{product.brand}</div>
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




        <div className="mt-10 w-[94%] mx-auto flex flex-col items-center">
  {isLoading ? (
    // 🟢 Veri yüklenirken Skeleton göstermek için
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="w-[180px] h-[280px] bg-gray-200 rounded-md p-3">
          <Skeleton height={120} />
          <Skeleton count={1} className="mt-2" />
          <Skeleton height={20} width={80} className="mt-2 mx-auto" />
          <Skeleton height={20} className="mt-2" />
        </div>
      ))}
    </div>
  ) : recommendedProducts.length > 0 ? (
    // 🟢 Eğer önerilen ürün varsa, bunları Swiper.js ile göster
    <>
      <h3 className="text-lg mb-4 font-bold text-center">Bu ürünü alanlar şunları da aldı:</h3>

      {/* Swiper.js Bileşeni */}
      <div className="w-full flex justify-center">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={15}
          slidesPerView={2} // Küçük ekranlarda 2 ürün
          breakpoints={{
            640: { slidesPerView: 2 }, // Orta ekranlarda 2 ürün
            768: { slidesPerView: 3 }, // Büyük ekranlarda 3 ürün
            1024: { slidesPerView: 5 }, // Büyük ekranlarda 5 ürün
          }}
          navigation
          pagination={{ clickable: true }}
          className="mySwiper mb-5"
        >
          {recommendedProducts.map((rp, index) => (
            <SwiperSlide key={index}>
              <ProductRecommendationCard productId={product.id} product={rp} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  ) : null}
</div>



        <h1 className="font-bold text-2xl flex justify-center mt-2">Yorumlar</h1>
        <div  ref={detailsRef}>
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
