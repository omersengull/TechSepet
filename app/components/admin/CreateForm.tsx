"use client";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Heading from "../General/Heading";
import Input from "../General/Input";
import CheckBox from "../General/CheckBox";
import ChoiceInput from "../General/ChoiceInput";
import { MdComputer } from "react-icons/md";
import { GiSmartphone, GiGameConsole, GiKeyboard, GiMouse } from "react-icons/gi";
import { BsSmartwatch } from "react-icons/bs";
import { SlEarphones } from "react-icons/sl";
import { FaTv, FaCamera, FaDesktop } from "react-icons/fa";
import Button from "../General/Button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getCategorySpecifications } from "@/app/services/specifications";


const CreateForm = () => {
  const router = useRouter();
  const [img, setImg] = useState<File | null>(null);
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);

  const categoryList = [
    { name: "Telefon", value: "phone", icon: GiSmartphone, id: "67aa2abfcd8fcdc1f5411288" },
    { name: "Akıllı Saat", value: "smartwatch", icon: BsSmartwatch, id: "67aa2abfcd8fcdc1f5411289" },
    { name: "Laptop", value: "laptop", icon: MdComputer, id: "67c453eda03bf12d7bb8e66b" },
    { name: "Kulaklık", value: "earphone", icon: SlEarphones, id: "67aa2abfcd8fcdc1f541128b" },
    { name: "Monitör", value: "monitor", icon: FaDesktop, id: "67a48e71b1ab64bb402dcc80" },
    { name: "Klavye", value: "keyboard", icon: GiKeyboard, id: "67cd7a8bbc0b76b4442462fd" },
    { name: "Mouse", value: "mouse", icon: GiMouse, id: "67cd7a8bbc0b76b4442462fe" },
    { name: "Televizyon", value: "television", icon: FaTv, id: "67aa2abfcd8fcdc1f541128f" },
    { name: "Oyun Konsolu", value: "gameconsole", icon: GiGameConsole, id: "67d2a6c9d8a049cb46d4291e" },
    { name: "Kamera", value: "camera", icon: FaCamera, id: "67aa2abfcd8fcdc1f5411291" },
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

  const category = watch("category");

  useEffect(() => {
    const loadSpecifications = async () => {
      if (!category) return;

      // Kategoriyi ID'ye göre bul
      const selectedCategory = categoryList.find(cat => cat.id === category);

      if (selectedCategory?.id) {
        try {
          const specs = await getCategorySpecifications(selectedCategory.id) as string[];
          setSpecifications(specs.map(key => ({ key, value: "" })));
        } catch (error) {
          toast.error("Özellikler yüklenemedi");
        }
      }
    };

    loadSpecifications();
  }, [category]);


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
          specifications: specifications
            .filter(spec => spec.key && spec.value)
            .map(spec => ({
              specificationName: spec.key, // Backend'in beklediği alan
              value: spec.value
            }))
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

  const handleSpecChange = (index: number, value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index].value = value;
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
              onClick={() => setCustomValue("category", cat.id)} // ID gönderiliyor
              selected={category === cat.id} // ID'ye göre kontrol
            />
          ))}
        </div>

        <input className="mt-3 mb-5" type="file" onChange={onChangeFunc} />

        <h3 className="font-semibold mb-2">Ürün Özellikleri</h3>
        {specifications.map((spec, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              className="border p-2 flex-1 rounded"
              placeholder="Özellik adı (Örn: RAM)"
              value={spec.key}
              onChange={e => {
                const newSpecs = [...specifications];
                newSpecs[index].key = e.target.value;
                setSpecifications(newSpecs);
              }}
            />
            <input
              type="text"
              className="border p-2 flex-1 rounded"
              placeholder="Değer"
              value={spec.value}
              onChange={e => handleSpecChange(index, e.target.value)}
            />
          </div>
        ))}

        <Button text="Ürün Oluştur" onClick={handleSubmit(onSubmit)} />
      </div>
    </div>
  );
};

export default CreateForm;
