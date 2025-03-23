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
            title: 'Apple Watch Series 9 GPS',
            description: 'Akıllı yaşamın yeni standardı',
            price: '14.999 TL',
            image: 'https://public.readdy.ai/ai/img_res/c60a2770db1eb126928ef6941a63ec85.jpg'
        },
        
        {
            id: 3,
            title: 'Apple AirPods 4',
            description: 'Aktif Gürültü Engellemeli Premium Kulaklık',
            price: '10.199 TL',
            image: 'https://public.readdy.ai/ai/img_res/2fcf94046ba0342d80a4347e568b6bff.jpg'
        },
        {
            id: 4,
            title: 'Sony PlayStation 5 Digital Edition',
            description: 'Yeni nesil oyun deneyimi',
            price: '19.999 TL',
            image: 'https://public.readdy.ai/ai/img_res/990495a0802a28ab22ed17c1464c739e.jpg'
        },
        {
            id: 5,
            title: 'Huawei Watch Fit 3',
            description: 'Akıllı yaşam asistanınız',
            price: '4.999 TL',
            image: 'https://public.readdy.ai/ai/img_res/06fe4788c905ae3348a8fa0450383df0.jpg'
        },
       
        {
            id: 7,
            title: 'Canon EOS 250D',
            description: '18-55mm IS STM Kit Lens',
            price: '24.999 TL',
            image: 'https://public.readdy.ai/ai/img_res/0546f39c1e2abda3a51aae030bc299de.jpg'
        },
        {
            id: 8,
            title: 'Samsung 55Q60D',
            description: '55" 4K QLED Smart TV',
            price: '39.999 TL',
            image: 'https://public.readdy.ai/ai/img_res/2918dc3462759644a6e45cdbecf5263c.jpg'
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
