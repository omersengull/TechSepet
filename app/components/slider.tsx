// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
const Slider: React.FC = () => {
    
  const heroSlides = [
    {
        id: 1,
        title: 'VIVO X200 PRO',
        description: 'Yüksek performanslı ve akıllı yaşam teknolojileriyle donatılmış bir telefon.',
        price: '45.000 TL',
        image: 'https://n.sinaimg.cn/spider20241024/120/w1440h1080/20241024/29e8-d770d143b869d0eb82063adb525c3c85.jpg'
    },
    {
        id: 2,
        title: 'Apple AirPods 4',
        description: 'Aktif gürültü engelleme özelliğiyle mükemmel ses deneyimi sunan premium kulaklık.',
        price: '10.199 TL',
        image: 'https://images.macrumors.com/article-new/2023/08/AirPods-Fourth-Generation-Feature-Red.jpg'
    },
    {
        id: 3,
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Gelişmiş kamera teknolojileri ve premium özelliklerle donatılmış üst seviye akıllı telefon.',
        price: '40.000 TL',
        image: 'https://www.inside-digital.de/img/samsung-galaxy-s24-ultra-alle-farben.webp?class=1200x900'
    },
    {
        id: 4,
        title: 'Sony PlayStation 5 Digital Edition',
        description: 'Yeni nesil oyun deneyimi ve yüksek performansla oyun tutkunlarına özel.',
        price: '30.000 TL',
        image: 'https://gizmeek.com/content/images/ps5.jpg'
    },
    {
        id: 5,
        title: 'Apple Watch Series 9',
        description: 'Akıllı yaşam asistanı, sağlıklı yaşam takibi ve şıklığı bir arada sunan saat.',
        price: '14.999 TL',
        image: 'https://www.dignited.com/wp-content/uploads/2023/09/Apple-Watch-Series-9-Colors-2048x1280.png'
    },
    {
        id: 6,
        title: 'Apple iPhone 15',
        description: 'Yeni iPhone deneyimiyle üstün performans ve gelişmiş özellikler.',
        price: '46.110 TL',
        image: 'https://media.techietech.tech/2023/09/iPhone-15-and-iPhone-15-Plus-launched.jpg'
    },
    {
        id: 7,
        title: 'Samsung Galaxy S25+',
        description: 'Süper AMOLED ekran ve güçlü kamera özellikleriyle ileri düzey akıllı telefon.',
        price: '40.000 TL',
        image: 'https://img.odcdn.com.br/wp-content/uploads/2025/01/008-family-galaxy-s25ultra-titaniumsilverblue-s25plus-navy-s25-icyblue-1920x1080.jpg'
    }
];

    return (
        <div className="w-screen bg-gray-50">
        <div className="w-full px-16 py-8">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="w-full rounded-xl overflow-hidden"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative h-[500px] w-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
                    <div className="h-full flex flex-col justify-center px-12 text-white w-full md:max-w-2xl">
                      <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                      <p className="text-xl mb-6">{slide.description}</p>
                      <p className="text-2xl font-semibold mb-8">{slide.price}</p>
                      
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      
    );
};
export default Slider;
