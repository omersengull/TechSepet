import Link from "next/link"
import { IconType } from "react-icons"
import React from "react"
interface AdminSideBarItem {
    selected?: boolean,
    name: string,
    icon: IconType,
    url: string
    mobile:boolean
}
const AdminSideBarItem: React.FC<AdminSideBarItem> = ({ selected, name, icon: Icon, url ,mobile=false}) => {
    return (
        <Link className={` flex items-center cursor-pointer gap-2 ${
            mobile 
              ? "p-2 text-sm gap-1" 
              : "px-4 py-2 gap-2"
          } ${selected ? "text-black font-bold" : "text-black font-medium"}`} href={url}>
            <Icon className={mobile ? "w-5 h-5" : "w-6 h-6"}  size={25} />
            <div>{name}</div>
        </Link>
    )
}

export default AdminSideBarItem