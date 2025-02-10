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

const categorySpecifications = {
  phone: ["RAM", "Depolama", "Ekran Boyutu", "Pil Kapasitesi", "Kamera Çözünürlüğü", "İşlemci", "Renk", "Ağırlık", "Bağlantı Tipi", "Hızlı Şarj Desteği"],
  laptop: ["RAM", "Depolama", "İşlemci", "Ekran Boyutu", "Batarya Kapasitesi", "Grafik Kartı", "Ağırlık", "Bağlantı Tipi", "Soğutma Sistemi", "İşletim Sistemi"],
  smartwatch: ["Ekran Boyutu", "Batarya Süresi", "Su Geçirmezlik", "Bağlantı Tipi", "Ağırlık", "GPS", "Adım Sayar", "Kalp Atış Hızı İzleme"],
  earphone: ["Bluetooth Sürümü", "Pil Ömrü", "Frekans Aralığı", "Bağlantı Tipi", "Gürültü Engelleme", "Mikrofon", "Suya Dayanıklılık", "Kablo Uzunluğu"],
  monitor: ["Ekran Boyutu", "Çözünürlük", "Yenileme Hızı", "Tepki Süresi", "Bağlantı Tipi", "Panel Türü", "Kontrast Oranı", "Görüntüleme Açısı"],
  keyboard: ["Bağlantı Tipi", "Tuş Türü", "Aydınlatma", "Mekanik", "Tuş Düzeni", "Makro Desteği", "Multimedya Tuşları", "Ergonomi"],
  mouse: ["Bağlantı Tipi", "DPI", "Aydınlatma", "Ergonomi", "Tuş Sayısı", "Pil Ömrü", "Sensör Tipi", "Kaydırma Tekerleği"],
  television: ["Ekran Boyutu", "Çözünürlük", "HDR Desteği", "Bağlantı Tipi", "Ses Çıkış Gücü", "Smart TV Özelliği", "Yenileme Hızı", "Görüntü Teknolojisi"],
  gameconsole: ["Depolama", "Desteklenen Oyunlar", "Bağlantı Tipi", "Grafik Gücü", "RAM", "Kontrol Cihazı Desteği", "İnternet Bağlantısı", "Multimedya Desteği"],
  camera: ["Megapiksel", "Lens Tipi", "ISO Aralığı", "Video Çözünürlüğü", "Ağırlık", "Pil Ömrü", "Odak Uzaklığı", "Dijital Zoom", "Optik Zoom", "Görüntü Sabitleme"]
};

const CreateForm = () => {
  const router = useRouter();
  const [img, setImg] = useState<File | null>(null);
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);

  const categoryList = [
    { name: "Telefon", value: "phone", icon: GiSmartphone },
    { name: "Akıllı Saat", value: "smartwatch", icon: BsSmartwatch },
    { name: "Laptop", value: "laptop", icon: MdComputer },
    { name: "Kulaklık", value: "earphone", icon: SlEarphones },
    { name: "Monitör", value: "monitor", icon: FaDesktop },
    { name: "Klavye", value: "keyboard", icon: GiKeyboard },
    { name: "Mouse", value: "mouse", icon: GiMouse },
    { name: "Televizyon", value: "television", icon: FaTv },
    { name: "Oyun Konsolu", value: "gameconsole", icon: GiGameConsole },
    { name: "Kamera", value: "camera", icon: FaCamera },
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
    if (category && categorySpecifications[category]) {
      setSpecifications(
        categorySpecifications[category].map((key) => ({ key, value: "" }))
      );
    } else {
      setSpecifications([]);
    }
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
              placeholder={spec.key}
              value={spec.value}
              onChange={(e) => handleSpecChange(index, e.target.value)}
              className="border p-2 w-full"
            />
          </div>
        ))}

        <Button text="Ürün Oluştur" onClick={handleSubmit(onSubmit)} />
      </div>
    </div>
  );
};

export default CreateForm;
