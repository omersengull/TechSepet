"use client";
import AdminSideBarItem from "./AdminSideBarItem";
import { MdDashboard } from "react-icons/md";
import { FaFirstOrder } from "react-icons/fa";
import { IoIosCreate, IoIosCloseCircle } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import React from "react";

const AdminSideBar = () => {
  const pathName = usePathname();
  const AdminPanel = [
    { name: "Ürün Oluştur", icon: IoIosCreate, url: "/admin/create" },
    { name: "Siparişlerim", icon: FaFirstOrder, url: "/admin/order" },
    { name: "Ürünleri Yönet", icon: IoIosCreate, url: "/admin/manage" },
  ];
  const [show, setShow] = useState(false);

  const handleToggleMenu = () => {
    setShow((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* Toggle Butonu - Sağ üst köşede */}
      <div className="absolute top-5 right-5 z-50">
        <div
          onClick={handleToggleMenu}
          className="flex cursor-pointer items-center text-3xl text-black"
        >
          {show ? <IoIosCloseCircle /> : <GiHamburgerMenu />}
        </div>
      </div>

      {/* Yukarıdan Aşağı Açılan (Yatay) Menü */}
      <div
        className={`w-full bg-renk2 border-b p-4 transform transition-transform duration-500 ease-in-out ${
          show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex justify-center space-x-8">
          {AdminPanel.map((admin, index) => (
            <AdminSideBarItem
              key={index}
              selected={pathName === admin.url}
              icon={admin.icon}
              name={admin.name}
              url={admin.url}
            />
          ))}
        </div>
      </div>

      {/* İçerik için boşluk: Menü açıldığında alt kısımda içerik görünür */}
      <div className="pt-20">
        {/* Buraya sayfa içeriğinizi ekleyebilirsiniz */}
      </div>
    </div>
  );
};

export default AdminSideBar;
