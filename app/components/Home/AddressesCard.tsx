import React, { useEffect, useRef, useState } from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import toast from 'react-hot-toast';
import { Address } from '@prisma/client';
interface AddressesCardProps {
    addressObj: Address;
    onDelete: (id: string) => void;
    onEdit: (address: Address) => void;
  }
const AddressesCard = ({
    addressObj,
    onDelete,
    onEdit,
}:
    AddressesCardProps
) => {
    const { id, title, address, city, postalCode, userId } = addressObj;

    return (
        <>
            <div className="border-2 py-2 px-6 flex flex-row border-slate-500 justify-between rounded-xl mb-4">
                <div className="flex flex-col flex-grow">
                    <div className="flex items-center mb-2">
                    {addressObj.title.toLowerCase() === "ev"? (
                            <IoHomeOutline className="mr-1 text-lg" />
                        ) : (
                            <HiOutlineOfficeBuilding className="mr-1 text-lg" />
                        )}
                        <h3 className="font-semibold">{addressObj.title}</h3>
                    </div>
                    <p className="text-gray-700">{addressObj.address}</p>
                    <p className="text-gray-500 text-sm"> {addressObj.postalCode} {addressObj.city}</p>
                </div>

                <div className="flex flex-col items-center ml-4">
                    <FaEdit
                       onClick={() => onEdit(addressObj)}
                        className="cursor-pointer text-yellow-600 hover:text-yellow-700 mb-2"
                        size={20}
                    />
                    <AiFillDelete
                   onClick={() => onDelete(addressObj.id)}
                        className="cursor-pointer text-red-600 hover:text-red-700"
                        size={20}
                    />
                </div>


               
            </div>

        </>
    );
};

export default AddressesCard;
