import React, { useEffect, useRef, useState } from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import toast from 'react-hot-toast';
import { Address } from '@prisma/client';

const AddressesCard = ({
    address,
    addressTitle,
    postalCode,
    city,
    id,
    onDelete,
    setShowModal,
    showModal,
    setAddress,
    selectedCity,
    setAddressTitle,
    setSelectedCity,
    setPostalCode,
    setAddresses,
}: {
    selectedCity: string,
    address: string;
    addressTitle: string;
    postalCode: string;
    city: string,
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    id: string;
    onDelete: (id: string) => void,
    setAddress: React.Dispatch<React.SetStateAction<string>>,
    setAddressTitle: React.Dispatch<React.SetStateAction<string>>,
    setSelectedCity: React.Dispatch<React.SetStateAction<string>>,
    setPostalCode: React.Dispatch<React.SetStateAction<string>>,
    setAddresses: React.Dispatch<React.SetStateAction<Address[]>>

}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setShowModal(false); // Dış tıklama algılandığında modal'ı kapat
            }
        };

        if (showModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModal, setShowModal]);

    const deleteAddress = async () => {
        try {
            const response = await fetch(`/api/addresses/${id}`, {
                method: 'DELETE',
            });
            if (typeof onDelete !== "function") {
                console.error("onDelete fonksiyonu geçilmedi.");
                return;
            }

            if (!response.ok) {
                throw new Error('Adres silinemedi.');
            }

            onDelete(id);
        } catch (error) {
            console.error('Silme işlemi sırasında hata oluştu:', error);
        }
    };
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

    const editAddress = (address: Address) => {
        setEditingAddressId(address.id);
        setAddressTitle(address.title || "");
        setSelectedCity(address.city || "");
        setAddress(address.address || "");
        setPostalCode(address.postalCode);
        setShowModal(true);
    };

    const handleUpdateAddress = async () => {
        if (!editingAddressId || !addressTitle || !selectedCity || !address || !postalCode) {
            toast.error("Lütfen tüm alanları doldurun!");
            return;
        }

        try {
            const response = await fetch("/api/addresses", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingAddressId,
                    title: addressTitle,
                    city: selectedCity,
                    address,
                    postalCode,
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Adres başarıyla güncellendi!");
                setAddresses((prev) =>
                    prev.map((addr) =>
                        addr.id === editingAddressId
                            ? {
                                ...addr,
                                title: addressTitle,
                                city: selectedCity,
                                address,
                                postalCode,
                            }
                            : addr
                    )
                );

                setEditingAddressId(null);
                setAddressTitle("");
                setSelectedCity("");
                setAddress("");
                setPostalCode("");
                setShowModal(false);
            } else {
                toast.error("Adres güncellenirken bir hata oluştu!");
            }
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            toast.error("Sunucu hatası oluştu!");
        }
    };


    return (
        <>
            <div className="border-2 md:py-2 py-3 md:px-6 px-6 flex flex-row border-slate-500 justify-between rounded-xl">
                <div className="md:mx-2 mx-2 flex flex-col">
                    <h1 className="flex items-center">
                        {addressTitle.toLowerCase() === "ev" ? (
                            <IoHomeOutline className="mr-1" />
                        ) : (
                            <HiOutlineOfficeBuilding className="mr-1" />
                        )}
                        {addressTitle}
                    </h1>
                    <div className="text-slate-900">{address}</div>
                    <div className="text-slate-500">
                        {postalCode}, {city}
                    </div>
                </div>
                <div className="flex text-xl mt-2 md:mr-1 mr-2 flex-col">
                    <FaEdit
                        onClick={() => editAddress({
                            id,
                            title: addressTitle,
                            city,
                            address,
                            postalCode,
                            userId: id, 
                            createdAt: new Date(),
                            updatedAt:new Date,
                        })}
                        className="cursor-pointer text-yellow-500"
                    />
                    <AiFillDelete
                        onClick={deleteAddress}
                        className="cursor-pointer mt-4 text-red-500"
                    />
                </div>
            </div>


        </>
    );
};

export default AddressesCard;
