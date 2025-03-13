"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import priceClip from "@/app/utils/priceClip";
import { IoIosArrowDown } from "react-icons/io";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Item {
  description: string;
  quantity: number;
  image: string;
  price: string;
}

interface AddresInfo {
  title: string;
  address: string;
  city: string;
  postalCode: string;
}

interface Order {
  image: string;
  id: string;
  createdAt: string;
  totalPrice: number;
  addressInfo: AddresInfo;
  items: Item[] | string;
}

const OrderCard = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{ name: string; surname: string } | null>(null);
  let items: Item[] = [];
  const router = useRouter();

  const handleRate = async (item: any, stars: number | null) => {
    if (stars === null) return;
    console.log(`Kullanıcı ${stars} yıldız verdi.`);
    try {
      if (!item.id) {
        console.error("Ürün ID'si bulunamadı!");
        return;
      }
      console.log("Yönlendirme yapılıyor:", `/product/${item.id}`);
      localStorage.setItem("reviewingProduct", item.id);
      toast.success("Ürün sayfasına yönlendiriliyorsunuz!", { duration: 1500 });
      setTimeout(() => {
        router.push(`/product/${item.id}`);
      }, 1500);
    } catch (error) {
      console.error("Yönlendirme hatası:", error);
    }
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("scrollToReview") === "true"
    ) {
      localStorage.removeItem("scrollToReview");
      setTimeout(() => {
        if (detailsRef.current) {
          console.log("Sayfa aşağı kaydırılıyor...");
          detailsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        } else {
          console.error("detailsRef bulunamadı!");
        }
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  try {
    let parsedItems =
      typeof order.items === "string" ? JSON.parse(order.items) : order.items;
    if (typeof parsedItems === "string") {
      parsedItems = JSON.parse(parsedItems);
    }
    items = Array.isArray(parsedItems) ? parsedItems : [];
  } catch (error) {
    console.error("Ürünleri işlerken hata oluştu:", error);
    items = [];
  }

  return (
    <div
      className={`border rounded-2xl border-gray-300 p-4 md:p-6 mb-4 bg-white shadow-lg transition-all duration-300 transform w-full max-w-4xl mx-auto cursor-pointer ${
        expanded ? "pb-4" : ""
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Üst Satır */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
        {/* Ürün resimleri için; masaüstünde eski haline döndürdüm (grid-cols-5, md:gap-4) 
            Mobilde boşluğu azaltmak için gap-1 kullanıldı */}
        <div className="grid grid-cols-5 gap-1 md:gap-4 w-full md:w-auto">
          {items.map((item, index) => (
            <img
              key={index}
              src={item.image}
              alt={item.description}
              className="w-12 h-12 md:w-16 md:h-16 object-cover border-2 rounded-xl p-1"
            />
          ))}
        </div>
        <div className="text-center w-full md:w-auto mt-2 md:mt-0">
          <span className="font-bold text-sm md:text-base">Sipariş Numarası</span>
          <p className="text-gray-700 text-sm md:text-base">{order.id}</p>
        </div>
        <span className="text-gray-500 text-xs md:text-sm w-full md:w-auto text-center mt-2 md:mt-0">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
        <span className="text-green-600 font-bold text-base md:text-lg w-full md:w-auto flex items-center justify-center mt-2 md:mt-0">
          {priceClip(order.totalPrice)}₺
          <IoIosArrowDown
            className={`ml-2 transition-transform ${
              expanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </span>
      </div>

      {/* Genişletilmiş İçerik */}
      {expanded && (
        <div className="mt-4 border-t border-gray-300 pt-4">
          <h2 className="text-lg font-semibold mb-2 text-center md:text-left">
            Ürünler
          </h2>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex flex-col md:flex-row items-center md:justify-between space-y-2 md:space-y-0 md:space-x-4 border-b border-gray-200 pb-2"
              >
                <img
                  src={item.image}
                  alt={item.description}
                  className="w-24 h-24 object-contain border rounded-lg mx-auto md:mx-0"
                />
                <div className="flex flex-col md:flex-row justify-between w-full items-center">
                  <div className="text-center md:text-left w-full md:w-1/2">
                    <p className="font-medium">{item.description}</p>
                    <p className="text-gray-600">Miktar: {item.quantity}</p>
                    <p>
                      Fiyat:{" "}
                      <span className="text-green-600">
                        {priceClip(item.price)}₺
                      </span>
                    </p>
                  </div>
                  <div className="ml-auto md:ml-4 flex items-center mt-2 md:mt-0">
                    <span className="mr-1">Ürünü Değerlendir</span>
                    <Rating
                      value={null}
                      onChange={(_, stars) => handleRate(item, stars)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Teslimat ve Ödeme Bilgileri */}
          <div className="flex flex-col md:flex-row md:space-x-4 mt-4">
            <div className="border rounded-xl p-4 bg-gray-100 flex-1">
              <h2 className="font-semibold text-lg">Teslimat Adresi</h2>
              <p>
                ({order.addressInfo.title}) {order.addressInfo.address} /{" "}
                {order.addressInfo.city} {order.addressInfo.postalCode}
              </p>
              <p>
                {user?.name} {user?.surname}
              </p>
            </div>
            <div className="border rounded-xl p-4 bg-gray-100 flex-1 mt-4 md:mt-0">
              <h2 className="font-semibold text-lg">Ödeme Bilgileri</h2>
              <p>{priceClip(order.totalPrice)}₺</p>
            </div>
          </div>
        </div>
      )}
      <div ref={detailsRef}></div>
    </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Eğer geçerli kullanıcı varsa API çağrısına userId parametresini ekliyoruz
        let url = "/api/orders";
        if (currentUser && currentUser.id) {
          url = `/api/orders?userId=${currentUser.id}`;
        }
        const response = await axios.get(url);
        console.log("API'den gelen siparişler:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Siparişler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser !== null) {
      fetchOrders();
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Siparişlerim
      </h1>
      {loading ? (
        <div className="text-center text-lg">Yükleniyor...</div>
      ) : orders.length > 0 ? (
        <div className="flex flex-col items-center gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">
          Henüz siparişiniz bulunmamaktadır.
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
