"use client";
import React from 'react';
import Head from 'next/head';
import { FaShippingFast, FaShieldAlt, FaHeadset, FaLeaf } from 'react-icons/fa';
import { IoMdPricetags } from 'react-icons/io';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="header techteam  h-[600px]">
                <div className="overlay">
                <Head>
                    <title>TechSepet - Hakkımızda</title>
                    <meta name="description" content="TechSepet hakkında bilgiler" />
                </Head>

                {/* Hero Section */}
                <div className=" text-white  py-20 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">TechSepet Hakkında</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                            Teknoloji tutkunları için kaliteli ürünler sunan güvenilir alışveriş platformu
                        </p>
                    </div>
                </div>
                </div>
            </div>

            {/* About Content */}
            <div className="mx-10">
                <div className="mx-auto py-16 px-4">
                    <div className="w-full py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-4xl text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900">Biz Kimiz?</h2>
                            </div>

                            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2">
                                {/* Sol Taraf - Hikaye ve Değerler */}
                                <div className="space-y-8">
                                    <div className="bg-gray-50 p-10 rounded-2xl shadow-lg">
                                        <h3 className="text-3xl font-semibold text-gray-800 mb-8">TechSepet'in Hikayesi</h3>
                                        <div className="space-y-6 text-gray-600 text-xl leading-relaxed">
                                            <p>
                                                2024 yılında küçük bir teknoloji meraklısı ekiple kurulan TechSepet, bugün Türkiye'nin önde gelen e-ticaret platformlarından biri haline geldi.
                                            </p>
                                            <p>
                                                Kuruluş amacımız, teknoloji tutkunlarının güvenilir ve uygun fiyatlı ürünlere kolayca ulaşabilmesini sağlamaktı. Bugün bu misyonu genişleterek 1 milyondan fazla mutlu müşteriye hizmet veriyoruz.
                                            </p>
                                            <p>
                                                İstanbul'daki merkez ofisimizde 50'den fazla çalışanla, sizlere en kaliteli ürünleri sunmak için gece gündüz çalışıyoruz.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-10 rounded-2xl shadow-lg">
                                        <h3 className="text-3xl font-semibold text-gray-800 mb-8">Değerlerimiz</h3>
                                        <ul className="space-y-6 text-gray-600 text-xl">
                                            <li className="flex items-start">
                                                <span className="text-green-500 text-2xl mr-3">✓</span>
                                                <span className="leading-relaxed"><strong className="text-gray-800">Şeffaflık:</strong> Tüm ürün bilgilerini eksiksiz paylaşıyoruz, teknik özelliklerde ve fiyatlandırmada netlik bizim için çok önemli</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-500 text-2xl mr-3">✓</span>
                                                <span className="leading-relaxed"><strong className="text-gray-800">Güvenilirlik:</strong> 7/24 destek hattı, kolay iade garantisi ve 2 yıl teknik destek sunuyoruz</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-500 text-2xl mr-3">✓</span>
                                                <span className="leading-relaxed"><strong className="text-gray-800">Kalite:</strong> Sadece sertifikalı ve orijinal ürünleri stoklarımızda bulunduruyoruz</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-500 text-2xl mr-3">✓</span>
                                                <span className="leading-relaxed"><strong className="text-gray-800">Müşteri Odaklılık:</strong> Her adımda sizin ihtiyaçlarınızı ön planda tutuyoruz</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Sağ Taraf - Vizyon ve Başarılar */}
                                <div className="space-y-8">
                                    <div className="bg-gray-50 p-10 rounded-2xl shadow-lg">
                                        <h3 className="text-3xl font-semibold text-gray-800 mb-8">Vizyonumuz</h3>
                                        <div className="space-y-6 text-gray-600 text-xl leading-relaxed">
                                            <p>
                                                Türkiye'nin en güvenilir teknoloji alışveriş platformu olmayı hedefliyoruz. 2026 yılına kadar Avrupa'nın önde gelen teknoloji marketlerinden biri olma yolunda ilerliyoruz.
                                            </p>
                                            <p>
                                                Yenilikçi teknolojileri takip ederek müşterilerimize en son ürünleri en uygun fiyatlarla sunmayı amaçlıyoruz. Önümüzdeki dönemde yapay zeka destekli alışveriş asistanı ve sanal mağaza deneyimi gibi yenilikleri hizmetinize sunacağız.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-10 rounded-2xl shadow-lg">
                                        <h3 className="text-3xl font-semibold text-gray-800 mb-8">Başarılarımız</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                                <p className="text-4xl font-bold text-blue-600 mb-2">1M+</p>
                                                <p className="text-gray-600 text-lg">Mutlu Müşteri</p>
                                            </div>
                                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                                <p className="text-4xl font-bold text-blue-600 mb-2">81</p>
                                                <p className="text-gray-600 text-lg">İle Ulaştık</p>
                                            </div>
                                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                                <p className="text-4xl font-bold text-blue-600 mb-2">10K+</p>
                                                <p className="text-gray-600 text-lg">Ürün Çeşidi</p>
                                            </div>
                                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                                <p className="text-4xl font-bold text-blue-600 mb-2">24/7</p>
                                                <p className="text-gray-600 text-lg">Destek Hattı</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="my-16">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Değerlerimiz</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <ValueCard
                                icon={<FaShippingFast className="text-blue-600" size={40} />}
                                title="Hızlı Teslimat"
                                description="Siparişleriniz 24-48 saat içerisinde kargoda"
                            />
                            <ValueCard
                                icon={<FaShieldAlt className="text-green-600" size={40} />}
                                title="Güvenli Alışveriş"
                                description="256-bit SSL şifreleme ile güvenli ödeme"
                            />
                            <ValueCard
                                icon={<FaHeadset className="text-purple-600" size={40} />}
                                title="7/24 Destek"
                                description="Uzman destek ekibimiz her zaman yanınızda"
                            />
                            <ValueCard
                                icon={<IoMdPricetags className="text-emerald-500" size={40} />}
                                title="Uygun Fiyat"
                                description="Piyasanın en uygun fiyatlarını uyguluyoruz.Hem de sık sık indirimler uyguluyoruz."
                            />
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="my-24">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Ekibimiz</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <TeamMember
                                name="Ömer Şengül"
                                role="Kurucu & CEO"
                                image="/imgs/mypp.jpg"
                            />
                            <TeamMember
                                name="Ömer Şengül"
                                role="Pazarlama Müdürü"
                                image="/imgs/mypp.jpg"
                            />
                            <TeamMember
                                name="Ömer Şengül"
                                role="Teknoloji Lideri"
                                image="/imgs/mypp.jpg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Yardımcı Bileşen: Değer Kartı
const ValueCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="flex justify-center mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

// Yardımcı Bileşen: Takım Üyesi
const TeamMember = ({ name, role, image }: { name: string, role: string, image: string }) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img src={image} alt={name} className="w-full h-64 object-cover" />
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
                <p className="text-blue-600 font-medium">{role}</p>
            </div>
        </div>
    );
};

export default AboutPage;