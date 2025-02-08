"use client";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Heading from "../General/Heading";
import Input from "../General/Input";
import CheckBox from "../General/CheckBox";
import ChoiceInput from "../General/ChoiceInput";
import { MdComputer } from "react-icons/md";
import { GiSmartphone } from "react-icons/gi";
import { BsSmartwatch } from "react-icons/bs";
import { SlEarphones } from "react-icons/sl";
import { SiFacebookgaming } from "react-icons/si";
import { FaTv, FaCamera } from "react-icons/fa";
import { GiGameConsole } from "react-icons/gi";
import Button from "../General/Button";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreateForm = () => {
    const router = useRouter();
    const [img, setImg] = useState<File | null>(null);
    const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);

    const categoryList = [
        { name: "Telefon", value: "phone", icon: GiSmartphone },
        { name: "Laptop", value: "laptop", icon: MdComputer },
        { name: "Akıllı Saat", value: "smartwatch", icon: BsSmartwatch },
        { name: "Kulaklık", value: "earphone", icon: SlEarphones },
        { name: "Gaming", value: "gaming", icon: SiFacebookgaming },
        { name: "Televizyon", value: "television", icon: FaTv },
        { name: "Kamera", value: "camera", icon: FaCamera },
        { name: "Oyun Konsolu", value: "gameconsole", icon: GiGameConsole },
    ];

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            description: "",
            brand: "",
            category: "",
            price: "",
            img: "",
            inStock: false,
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (!img) {
            toast.error("Lütfen bir görsel seçin");
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const base64 = reader.result as string;
                const fileContent = base64.split(",")[1];
                const response = await axios.post("/api/upload", {
                    fileName: img.name,
                    fileContent,
                    contentType: img.type,
                });

                const imageUrl = response.data.url;
                const newData = {
                    ...data,
                    image: imageUrl,
                    specifications: specifications.filter((spec) => spec.key && spec.value),
                };

                await axios.post("/api/product", newData);
                toast.success("Ürün başarıyla oluşturuldu");
                router.refresh();
            } catch (error) {
                console.error("Hata:", error);
                toast.error("Ürün eklenirken bir hata oluştu.");
            }
        };
        reader.readAsDataURL(img);
    };

    const category = watch("category");

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImg(e.target.files[0]);
        }
    };

    const addSpecificationField = () => {
        setSpecifications([...specifications, { key: "", value: "" }]);
    };

    const handleSpecChange = (index: number, field: string, value: string) => {
        const newSpecifications = [...specifications];
        newSpecifications[index][field as "key" | "value"] = value;
        setSpecifications(newSpecifications);
    };

    return (
        <div className="mb-20">
            <div className="w-[200px] md:w-auto">
                <Heading text="ÜRÜN OLUŞTUR" center />
                <Input
                    placeholder="Ad"
                    type="text"
                    id="name"
                    register={register}
                    errors={errors}
                    required
                />
                <Input
                    placeholder="Açıklama"
                    type="text"
                    id="description"
                    register={register}
                    errors={errors}
                    required
                />
                <Input
                    placeholder="Marka"
                    type="text"
                    id="brand"
                    register={register}
                    errors={errors}
                    required
                />
                <Input
                    placeholder="Fiyat"
                    type="number"
                    id="price"
                    register={register}
                    errors={errors}
                    required
                />
                <CheckBox
                    register={register}
                    id="inStock"
                    label="Ürün stokta mevcut mu?"
                />

                <div className="flex flex-wrap gap-3 my-3">
                    {categoryList.map((cat, i) => (
                        <ChoiceInput
                            key={i}
                            icon={cat.icon}
                            text={cat.name}
                            onClick={() => setCustomValue("category", cat.value)}
                            selected={category === cat.value}
                        />
                    ))}
                </div>

                <input className="mt-3 mb-5" type="file" onChange={onChangeFunc} />

                <h3 className="font-semibold mb-2">Ürün Özellikleri</h3>
                {specifications.map((spec, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                        <input
                            type="text"
                            placeholder="Özellik Adı (örn. RAM)"
                            value={spec.key}
                            onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                            className="border p-2 w-1/2"
                        />
                        <input
                            type="text"
                            placeholder="Değer (örn. 8 GB)"
                            value={spec.value}
                            onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                            className="border p-2 w-1/2"
                        />
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addSpecificationField}
                    className="bg-gray-200 px-4 py-2 rounded-md mb-4"
                >
                    + Özellik Ekle
                </button>

                <Button text="Ürün Oluştur" onClick={handleSubmit(onSubmit)} />
            </div>
        </div>
    );
};

export default CreateForm;
