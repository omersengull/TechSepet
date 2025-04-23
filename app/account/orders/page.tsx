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
  name: string;
  amount: number;
  image: string;
  price: string;
  id: string;
  productId?: string;
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
  // Önce order nesnesinin var olup olmadığını kontrol et
  if (!order) {
    console.error("OrderCard: order nesnesi tanımsız");
    return <div className="p-4 bg-red-100 rounded-lg">Sipariş bilgisi yüklenemedi.</div>;
  }

  console.log("OrderCard'a gelen order:", order);
  
  const [expanded, setExpanded] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{ name: string; surname: string } | null>(null);
  const router = useRouter();

  const handleRate = async (item: any, stars: number | null) => {
    if (stars === null) return;
    
    console.log("Değerlendirilen ürün:", item);
    
    const productId = item.productId || item.id;
    
    if (!productId) {
      console.error("Ürün ID'si bulunamadı! Ürün:", JSON.stringify(item));
      toast.error("Ürün bilgisi eksik!");
      return;
    }
    
    console.log("Yönlendirme yapılıyor:", `/product/${productId}`);
    localStorage.setItem("reviewingProduct", productId);
    toast.success("Ürün sayfasına yönlendiriliyorsunuz!", { duration: 1500 });
    
    try {
      setTimeout(() => {
        try {
          router.push(`/product/${productId}`);
        } catch (routerError) {
          console.error("Router.push hatası:", routerError);
          window.location.href = `/product/${productId}`;
        }
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

  // İyileştirilmiş items ayrıştırma mantığı
  let items: Item[] = [];
  try {
    // order.items varlığını kontrol et
    if (!order.items) {
      console.error("Order items tanımsız veya null");
    } else {
      console.log("Ham order.items:", order.items);
      
      // String veya dizi olma durumunu ele al
      let parsed = order.items;
      
      // Eğer string ise, bir kez parse et
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
          console.log("İlk parse sonrası:", parsed);
        } catch (parseError) {
          console.error("İlk JSON parse hatası:", parseError);
        }
      }
      
      // İlk parse'dan sonra hala string ise, tekrar dene
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
          console.log("İkinci parse sonrası:", parsed);
        } catch (parseError) {
          console.error("İkinci JSON parse hatası:", parseError);
        }
      }
      
      // Eğer bir diziyse items'a dönüştür
      if (Array.isArray(parsed)) {
        items = parsed.map(item => {
          console.log("Ürün yapısı:", item);
          return item;
        });
      } else {
        console.error("Ayrıştırılmış öğeler bir dizi değil:", parsed);
      }
    }
    
    console.log("Son ayrıştırılmış ürün dizisi:", items);
  } catch (error) {
    console.error("Ürünleri ayrıştırırken hata:", error);
    items = [];
  }

  // AddressInfo kontrolü
  const addressInfo = order.addressInfo || {
    title: "Bilinmiyor",
    address: "Bilinmiyor",
    city: "Bilinmiyor",
    postalCode: "Bilinmiyor"
  };

  return (
    <div
      className={`border rounded-2xl border-gray-300 p-4 md:p-6 mb-4 bg-white shadow-lg transition-all duration-300 transform w-full max-w-4xl mx-auto cursor-pointer ${expanded ? "pb-4" : ""
        }`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Üst Satır */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
        {/* Ürün resimleri */}
        <div className="grid grid-cols-5 gap-1 md:gap-4 w-full md:w-auto">
          {items.length > 0 ? (
            items.map((item, index) => (
              <img
                key={index}
                src={item.image || "/placeholder.jpg"}
                alt={item.name || "Ürün"}
                className="w-12 h-12 md:w-16 md:h-16 object-cover border-2 rounded-xl p-1"
                onError={(e) => {
                  // Resim yüklenemezse varsayılan resim
                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                }}
              />
            ))
          ) : (
            <div className="col-span-5 text-center text-gray-500">Ürün bilgisi bulunamadı</div>
          )}
        </div>
        <div className="text-center w-full md:w-auto mt-2 md:mt-0">
          <span className="font-bold text-sm md:text-base">Sipariş Numarası</span>
          <p className="text-gray-700 text-sm md:text-base">{order.id || "Bilinmiyor"}</p>
        </div>
        <span className="text-gray-500 text-xs md:text-sm w-full md:w-auto text-center mt-2 md:mt-0">
          {order.createdAt 
            ? new Date(order.createdAt).toLocaleDateString() 
            : "Tarih bilinmiyor"}
        </span>
        <span className="text-green-600 font-bold text-base md:text-lg w-full md:w-auto flex items-center justify-center mt-2 md:mt-0">
          {priceClip(order.totalPrice || 0)}₺
          <IoIosArrowDown
            className={`ml-2 transition-transform ${expanded ? "rotate-180" : "rotate-0"
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
            {items.length > 0 ? (
              items.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col md:flex-row items-center md:justify-between space-y-2 md:space-y-0 md:space-x-4 border-b border-gray-200 pb-2"
                >
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name || "Ürün"}
                    className="w-24 h-24 object-contain border rounded-lg mx-auto md:mx-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.jpg";
                    }}
                  />
                  <div className="flex flex-col md:flex-row justify-between w-full items-center">
                    <div className="text-center md:text-left w-full md:w-1/2">
                      <p className="font-medium">{item.name || "İsimsiz ürün"}</p>
                      <p className="text-gray-600">Miktar: {item.amount || 0}</p>
                      <p>
                        Fiyat:{" "}
                        <span className="text-green-600">
                          {priceClip(item.price || "0")}₺
                        </span>
                      </p>
                    </div>
                    <div className="ml-auto md:ml-4 flex items-center mt-2 md:mt-0">
                      <span className="mr-1">Ürünü Değerlendir</span>
                      <Rating
                        defaultValue={0}
                        onChange={(_, stars) => handleRate(item, stars)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 py-4">Ürün bilgisi bulunamadı</li>
            )}
          </ul>

          {/* Teslimat ve Ödeme Bilgileri */}
          <div className="flex flex-col md:flex-row md:space-x-4 mt-4">
            <div className="border rounded-xl p-4 bg-gray-100 flex-1">
              <h2 className="font-semibold text-lg">Teslimat Adresi</h2>
              <p>
                ({addressInfo.title}) {addressInfo.address} /{" "}
                {addressInfo.city} {addressInfo.postalCode}
              </p>
              <p>
                {user?.name || "Kullanıcı"} {user?.surname || ""}
              </p>
            </div>
            <div className="border rounded-xl p-4 bg-gray-100 flex-1 mt-4 md:mt-0">
              <h2 className="font-semibold text-lg">Ödeme Bilgileri</h2>
              <p>{priceClip(order.totalPrice || 0)}₺</p>
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Kullanıcı bilgisi alınamadı:", error);
        setError("Kullanıcı bilgisi yüklenemedi");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!currentUser) {
          console.log("Kullanıcı bilgisi henüz yüklenmedi, siparişler çekilemiyor");
          return;
        }
        
        // Eğer geçerli kullanıcı varsa API çağrısına userId parametresini ekliyoruz
        let url = "/api/myOrders";
        if (currentUser && currentUser.id) {
          url = `/api/myOrders?userId=${currentUser.id}`;
        }
        
        console.log("Siparişleri getirmek için API çağrısı yapılıyor:", url);
        const response = await axios.get(url);
        console.log("API'den gelen siparişler:", response.data);
        
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error("API'den gelen veri bir dizi değil:", response.data);
          setError("Sipariş verisi beklenmeyen formatta");
        }
      } catch (error) {
        console.error("Siparişler yüklenirken hata oluştu:", error);
        setError("Siparişler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser !== null) {
      fetchOrders();
    }
  }, [currentUser]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-12">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Siparişlerim
        </h1>
        <div className="text-center p-6 bg-red-100 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

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
            <OrderCard key={order.id || Math.random()} order={order} />
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