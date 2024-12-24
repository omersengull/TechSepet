"use client"
import { getCurrentUser } from "@/app/actions/getCurrentUser"
import React, { useState, useEffect } from "react"

const Page = () => {
  const [currentUser, setCurrentUser] = useState();
  const [initialUser, setInitialUser] = useState(null);
  const [change, setChange] = useState(false);
  const handleInputChange = (event) => {
    const { id, value } = event.target;

    setCurrentUser((prev) => ({
      ...prev,
      [id]: id === "birthday" ? new Date(value).toISOString() : value, // Tarihi ISO formatına çevir
    }));
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const updatePersonalInformation = async () => {
    try {
      const response = await fetch("/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Sunucu Hatası Yanıtı:", errorText);
        alert(`Sunucu hatası: ${response.status}`);
        return;
      }

      alert("Bilgiler başarıyla güncellendi!");
      setInitialUser(currentUser);
      setChange(false);
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Bir hata oluştu.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setInitialUser(user);
      setCurrentUser(user);
    }
    fetchUser();
  }, []);
  useEffect(() => {
    const isChanged = JSON.stringify(currentUser) !== JSON.stringify(initialUser);
    setChange(isChanged);
  }, [currentUser]);

  return (
    <div className="container lg:h-screen text-sm md:text-lg ">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl mb-4 mt-4">Kullanıcı Bilgilerim</h1>
        <h2 className="text-lg text-slate-500 mb-4 mt-4">Bilgilerinizi burada düzenleyebilir ve güncelleyebilirsiniz.</h2>

        <div className="flex md:gap-8 gap-2">

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="input1">Ad</label>
            <input
              id="name"
              type="text"
              value={currentUser?.name || ""}
              onChange={handleInputChange}
              className="border-2 p-2 w-56 outline-renk1 rounded-lg"
            />
          </div>


          <div className="flex flex-col mb-5">
            <label className="mb-1" htmlFor="input2">Soyad</label>
            <input
              id="surname"
              type="text"
              onChange={handleInputChange}
              value={currentUser?.surname || ""}

              className="border-2 p-2 w-56 outline-renk1 rounded-lg"
            />
          </div>

        </div>
        <div className="">
          <label className="mb-4" htmlFor="input3">Doğum Günü</label>
          <div className="flex border-2 p-2  items-center md:w-120 w-[455px] rounded-lg outline-renk1"><input
            id="birthday"
            type="date"
            onChange={handleInputChange}
            value={
              currentUser?.birthday
                ? typeof currentUser.birthday === "string"
                  ? currentUser.birthday.split("T")[0] // ISO formatındaki stringi işler
                  : new Date(currentUser.birthday).toISOString().split("T")[0] // Date nesnesini işler
                : ""
            }
            className="w-full outline-none"

          />
          </div>
          <div className="mt-5">
            <label className="mb-2 mt-4">Cinsiyet</label>
            <div className=" items-center block">
              <input type="radio" name="gender" id="male" value="male" className="mr-2" checked={currentUser?.gender === "male"} onChange={(e) =>
                setCurrentUser((prev) => ({ ...prev, gender: e.target.value }))
              } />
              <label htmlFor="male">Erkek</label>
            </div>
            <div className="inline items-center">
              <input type="radio" name="gender" id="female" value="female" className="mr-2" checked={currentUser?.gender === "female"} onChange={(e) =>
                setCurrentUser((prev) => ({ ...prev, gender: e.target.value }))
              } />
              <label htmlFor="female">Kadın</label>
            </div>
          </div>
        </div>



      </div>
      <div className="flex flex-col items-center">
        <div className="gap-2">
          <h1 className="text-2xl text-center mb-5">İletişim Bilgileri</h1>
          <div className="ml-2">

            <label htmlFor="phone">Telefon Numarası</label>
            <input value={currentUser?.phone || ""} className="flex md:w-120 w-[458px] px-2 mb-2 mt-2 text-start items-start border-2 outline-renk1 rounded-lg  h-10" type="text" name="phone" id="phone" onChange={handleInputChange} />
            <label htmlFor="email">E-Mail Adresiniz</label>
            <input value={currentUser?.email || ""} type="email" className="flex md:w-120 w-[458px] px-2 mb-2 mt-2 text-start items-start border-2 outline-renk1 rounded-lg h-10" name="email" id="email" onChange={handleInputChange} />
            <button className={`md:w-120 w-[458px] py-2 rounded-xl text-white mt-2 mb-20 ${change ? 'bg-renk1' : 'bg-slate-400 cursor-not-allowed'}`} onClick={updatePersonalInformation} disabled={!change}>Güncelle</button>
          </div>
        </div>
      </div>
    </div>


  )
}

export default Page
