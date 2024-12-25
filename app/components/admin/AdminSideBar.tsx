"use client";
import AdminSideBarItem from "./AdminSideBarItem";
import { MdDashboard } from "react-icons/md";
import { FaFirstOrder } from "react-icons/fa";
import { IoIosCreate, IoIosCloseCircle } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import React from "react"
const AdminSideBar = () => {
  const pathName = usePathname();
  const AdminPanel = [
    { name: "Özetler", icon: MdDashboard, url: "/admin" },
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
 
      <div
        className={`absolute top-5 left-5 z-50 transition-transform duration-500 ease-in-out ${
          show ? "translate-x-[-250px] opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div
          onClick={handleToggleMenu}
          className="flex cursor-pointer items-center text-3xl text-black"
        >
          <GiHamburgerMenu />
        </div>
      </div>

      <div
        className={` h-screen sticky w-64 bg-renk2 border-r p-4 transform transition-transform duration-500 ease-in-out ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-4">
 
          <div
            onClick={handleToggleMenu}
            className="flex items-center cursor-pointer"
          >
            <IoIosCloseCircle className="text-xl" />
            <span className="ml-1 font-bold">Menüyü kapat</span>
          </div>
        
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
    </div>
  );
};

export default AdminSideBar;
