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
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import firebaseApp from "@/libs/firebase";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreateForm = () => {
    const router = useRouter();
    const [img, setImg] = useState<File | null>(null);
    const [uploadedImg, setUploadedImg] = useState<string | null>(null);

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
        console.log(data);

        // Görsel yükleme kontrolü
        if (!img) {
            toast.error("Lütfen bir görsel seçin");
            return;
        }

        const handleChange = async () => {
            toast.success("Yükleme işlemi başladı...");
            try {
                const storage = getStorage(firebaseApp);
                const storageRef = ref(storage, `images/${img.name}`);
                const uploadTask = uploadBytesResumable(storageRef, img);
                await new Promise<void>((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress =
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Upload is ${progress}% done`);
                        },
                        (error) => reject(error),
                        async () => {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log("File available at", downloadURL);
                            setUploadedImg(downloadURL);
                            resolve();
                        }
                    );
                });
            } catch (error) {
                console.error("Yükleme sırasında hata oluştu:", error);
                toast.error("Yükleme başarısız oldu.");
            }
        };

        await handleChange();

        // uploadedImg kontrolü
        if (!uploadedImg) {
            toast.error("Görsel yüklenirken hata oluştu. Lütfen tekrar deneyin.");
            return;
        }

        const newData = { ...data, image: uploadedImg };

        axios
            .post("/api/product", newData)
            .then(() => {
                toast.success("Ürün ekleme işlemi başarılı");
                router.refresh();
            })
            .catch((error) => {
                console.error(error);
                toast.error("Ürün eklenirken bir hata oluştu.");
            });

        console.log(newData);
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
            <Button text="Ürün Oluştur" onClick={handleSubmit(onSubmit)} />
            </div>
            
        </div>
    );
};

export default CreateForm;
