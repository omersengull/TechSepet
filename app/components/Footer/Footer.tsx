import React from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

const Footer = () => {
    return (
        <div className="bg-slate-300 p-6 md:p-10 text-black">
            <div className="flex flex-col md:flex-row  max-width">

                <div className="flex flex-wrap flex-col md:flex-row md:ml-14 justify-center md:justify-around mb-6 md:mb-0 mt-5 space-y-8 md:space-y-0">
                    <ul className="md:ml-20 text-center">
                        <li className="mb-4">
                            <h1 className='text-2xl  text-blue-600'>Bilgi</h1>
                        </li>
                        <li className="mb-3  py-1 rounded-xl hover:bg-gray-200">
                            <a href="#">Hakkımızda</a>
                        </li>
                        <li className="mb-3 mt-2 py-1 rounded-xl hover:bg-gray-200">
                            <a href="#">Hesap Ayarları</a>
                        </li>
                        <li className="mb-3   py-1 rounded-xl hover:bg-gray-200" >
                            <a href="#">Sipariş Takibi</a>
                        </li>
                        <li className="mb-3   py-1 rounded-xl hover:bg-gray-200">
                            <a href="#">İade Ve Değişim</a>
                        </li>
                        <li className="mb-3  py-1 rounded-xl hover:bg-gray-200">
                            <a href="#">Sıkça Sorulan Sorular</a>
                        </li>

                    </ul>
                    <ul className="md:ml-28 md:mr-28 text-center">
                        <li className="mb-4">
                            <h1 className='text-2xl text-blue-600'>Politikalar</h1>
                        </li>

                        <li className="mb-3 mt-2  py-1 rounded-xl hover:bg-gray-200">
                            <a href="#">Gizlilik Politikası</a>
                        </li>
                        <li className="mb-3  py-1 rounded-xl hover:bg-gray-200">
                            <a href="#">Kullanım Şartları</a>
                        </li>
                        <li className="mb-3  py-1 rounded-xl hover:bg-gray-200">
                            <a href="#">Çerez Politikası</a>
                        </li>
                        <li className="mb-3  py-1 rounded-xl hover:bg-gray-200">
                            <a href="#">İade Politikası</a>
                        </li>
                    </ul>
                    <ul className="text-center">
                        <li className="mb-4">
                            <h1 className='text-2xl  text-blue-600'>Kategoriler</h1>
                        </li>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <li className="mb-3 mt-2  py-1 rounded-xl hover:bg-gray-200">
                                    <a href="#">Telefonlar</a>
                                </li>
                                <li className="mb-3  py-1 rounded-xl hover:bg-gray-200">
                                    <a href="#">Laptoplar</a>
                                </li>
                                <li className="mb-3  py-1 rounded-xl hover:bg-gray-200">
                                    <a href="#">Akıllı Saatler</a>
                                </li>
                                <li className="mb-3  py-1 rounded-xl hover:bg-gray-200">
                                    <a href="#">Kulaklıklar</a>
                                </li>
                            </div>
                            <div>
                                <li className="mb-3 mt-2  py-1 rounded-xl hover:bg-gray-200">
                                    <a href="#">Gaming Ürünler</a>
                                </li>
                                <li className="mb-3  py-1 rounded-xl hover:bg-gray-200">
                                    <a href="#">Televizyonlar</a>
                                </li>
                                <li className="mb-3  py-1 rounded-xl hover:bg-gray-200">
                                    <a href="#">Kameralar</a>
                                </li>
                                <li className="mb-3  py-1 rounded-xl hover:bg-gray-200">
                                    <a href="#">Oyun Konsolları</a>
                                </li>
                            </div>
                        </div>
                    </ul>
                    <div className="text-center md:ml-28">
                        <div className="mb-4">
                            <h1 className='text-2xl  text-blue-600'>İletişim</h1>
                        </div>

                        <div className='mt-4 flex flex-col items-center'>
                            <div className='flex items-center mb-4 px-3  py-1 rounded-xl hover:bg-gray-200' >
                                <FaLocationDot className="mr-2" />
                                <span>Kordonboyu Mahallesi, İstiklal Caddesi <br /> No: 123, 34750 Kadıköy, İstanbul, Türkiye</span>
                            </div>
                            <div className='flex items-center mb-4  py-1 px-3 rounded-xl hover:bg-gray-200'>
                                <FaPhoneAlt className="mr-2" />
                                <a href='tel:+905438334030' className=''>+90 543 833 40 30</a>
                            </div>
                            <div className='flex items-center px-3  py-1 rounded-xl hover:bg-gray-200'>
                                <IoMail className="mr-2" />
                                <a href='mailto:omersengul061@hotmail.com' className=''>omersengul061@hotmail.com</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="app-download-section  p-6 text-center">
                <h2 className="text-xl font-bold mb-4">TechSepet uygulamasını indirin</h2>
                <div className="app-buttons flex justify-center gap-4">
                    <a href="https://www.apple.com/app-store/" target="_blank">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/203px-Download_on_the_App_Store_Badge.svg.png"
                            alt="App Store"
                            className="w-40"
                        />
                    </a>
                    <a href="https://play.google.com/store" target="_blank">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                            alt="Google Play"
                            className="w-40"
                        />
                    </a>
                    <a href="https://appgallery.huawei.com/" target="_blank">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Huawei_AppGallery_white_badge_EN.png"
                            alt="App Gallery"
                            className="w-40"
                        />
                    </a>
                </div>
            </div>

            <div className="mt-10 text-center text-sm">
                © 2024 TechSepet.com. Her hakkı saklıdır. Bu web sitesinde yer alan tüm içerikler, metinler, resimler, videolar ve diğer materyaller TechSepet.com’a aittir ve ilgili telif hakkı kanunları kapsamında korunmaktadır.
                <br />
                Kullanıcıların gizliliğine büyük önem veriyoruz. Kişisel verilerin korunması ve gizlilik politikamızla ilgili daha fazla bilgi almak için lütfen Gizlilik Politikası sayfamızı ziyaret ediniz.
                <br />
                TechSepet, en iyi hizmeti sunmak için sürekli olarak altyapısını ve hizmetlerini geliştirmeye devam eder. Müşteri memnuniyeti ve güvenli alışveriş deneyimi en büyük önceliğimizdir.
            </div>
        </div>
    );
};

export default Footer;
