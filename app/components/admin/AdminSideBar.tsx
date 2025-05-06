"use client";
import AdminSideBarItem from "./AdminSideBarItem";
import { FaFirstOrder } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDeleteForever, MdManageHistory } from "react-icons/md";
import { BiSolidDiscount } from "react-icons/bi";
import { AiOutlineStock } from "react-icons/ai";
import { MdBackup } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
const AdminSideBar = () => {
  const pathName = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const AdminPanel = [
    { name: "Ürün Oluştur", icon: IoIosCreate, url: "/admin/create" },
    { name: "Siparişlerim", icon: FaFirstOrder, url: "/admin/order" },
    { name: "Stok Yönetimi", icon: AiOutlineStock, url: "/admin/stock" },
    { name: "İndirim Kuponları", icon: BiSolidDiscount, url: "/admin/coupons" },
    { name: "Ürünleri Düzenle", icon: MdManageHistory, url: "/admin/organize" },
    { name: "Yedek", icon: MdBackup, url: "/admin/backup" },
    { name: "Satış Rapor", icon: HiDocumentReport, url: "/admin/salesReport" },
  ];

  return (
    <div className="relative">
      {/* Masaüstü Menü */}
      <div className="hidden md:block w-full bg-renk2 border-b p-4">
        <div className="flex justify-center space-x-8">
          {AdminPanel.map((admin, index) => (
            <AdminSideBarItem
            mobile
              key={index}
              selected={pathName === admin.url}
              icon={admin.icon}
              name={admin.name}
              url={admin.url}
            />
          ))}
        </div>
      </div>

      {/* Mobil Menü */}
      <div className="md:hidden w-full bg-renk2 border-b p-2">
        {/* Hamburger Menü */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="flex items-center p-2 text-gray-600 hover:text-renk1"
        >
          <GiHamburgerMenu className="w-6 h-6" />
        </button>

        {/* Açılır Menü İçeriği */}
        <div
          className={`absolute top-full left-0 right-0 bg-white shadow-lg z-50 ${
            showMobileMenu ? "block" : "hidden"
          }`}
        >
          {AdminPanel.map((admin, index) => (
            <AdminSideBarItem
              key={index}
              selected={pathName === admin.url}
              icon={admin.icon}
              name={admin.name}
              url={admin.url}
              mobile
            />
          ))}
        </div>

       
       
      </div>
    </div>
  );
};

export default AdminSideBar;