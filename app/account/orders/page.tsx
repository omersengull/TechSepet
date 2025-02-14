"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import priceClip from "@/app/utils/priceClip";
import { IoIosArrowDown } from "react-icons/io";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

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
  const [user, setUser] = useState<{ name: string ,surname:string} | null>(null); 

  let items: Item[] = [];

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser(); // Kullanıcı bilgilerini getir
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
      className={`border rounded-2xl border-gray-300 p-6 mb-4 bg-white shadow-lg transition-all duration-300 transform w-full sm:w-2/3 lg:w-3/5 mx-auto cursor-pointer ${
        expanded ? "pb-4" : ""
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Üst Satır: Resimler, Sipariş No, Tarih ve Fiyat */}
      <div className="flex items-center justify-between">
        {/* Ürün resimleri */}
        <div className="flex items-center space-x-0 mr-1 text-right w-[260px]">
          {items.map((item, index) => (
            <img
              key={index}
              src={item.image}
              alt={item.description}
              className="w-[50px] h-[50px] object-cover border-2 rounded-xl px-1 py-1"
            />
          ))}
        </div>

        {/* Sipariş Bilgileri */}
        <div className="flex flex-col text-center w-[140px]">
          <span className="font-bold">Sipariş Numarası</span>
          <span className="text-gray-700">{order.id}</span>
        </div>

        {/* Sipariş Tarihi */}
        <span className="text-gray-500 text-sm w-[120px] text-center">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>

        {/* Fiyat Bilgisi ve Aşağı Ok */}
        <span className="text-green-600 font-bold text-lg w-[100px] text-center flex items-center justify-center">
          {priceClip(order.totalPrice)}₺
          <span className={`ml-2 transition-transform ${expanded ? "rotate-180" : "rotate-0"}`}>
            <IoIosArrowDown className="text-black" />
          </span>
        </span>
      </div>

      {/* Genişleyebilir İçerik */}
      {expanded && (
        <div className="mt-4 border-t border-gray-300 pt-4">
          <h2 className="text-lg font-semibold mb-2">Ürünler</h2>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-center space-x-4 border-b border-gray-200 pb-2"
              >
                <img
                  src={item.image}
                  alt={item.description}
                  className="w-[120px] h-[120px] object-contain border rounded-lg"
                />
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-gray-600">Miktar: {item.quantity}</p>
                  <p>
                    Fiyat: <span className="text-green-600">{priceClip(item.price)}₺</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          
          {/* Teslimat Adresi */}
          <div className="flex">
          <div className="border rounded-xl px-2 py-2 mt-2 bg-gray-100 mr-2 w-1/2">
            <h2 className="font-semibold text-lg">Teslimat Adresi</h2>
            <p>
              ({order.addressInfo.title}) {order.addressInfo.address} / {order.addressInfo.city} {order.addressInfo.postalCode}
            </p>
            <p>{user?.name} {user?.surname}</p>
          </div>
          <div className="order rounded-xl px-2 py-2 mt-2 bg-gray-100 w-1/2">
              <h2 className="font-semibold text-lg">Ödeme Bilgileri</h2>
              {priceClip(order.totalPrice)}₺
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders"); // API endpointi
        console.log("API'den gelen siparişler:", response.data); // VERİYİ KONTROL ET
        setOrders(response.data);
      } catch (error) {
        console.error("Siparişler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-12">
      <h1 className="text-3xl font-bold text-center mb-8">Siparişlerim</h1>
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
