import React from 'react'

const banner = () => {

    const promotionList = [
        { title: "1000 TL ve üzeri ücretsiz kargo!", content: "Detaylı bilgi için tıklayın." },
        { title: "USB kablolarında 3. ürün 1 TL!", content: "Detaylı bilgi için tıklayın." },
        { title: "Laptoplarda %5 indirim!", content: "Detaylı bilgi için tıklayın." }
    ];
    return (
        <div className='flex flex-row justify-around h-[50px] sm:h-[36px] bg-black text-white items-center  '>
            {promotionList.map((promotion, index) =>
                <div className='w-full sm:w-[250px]' key={index}>{promotion.title}</div>
            )}

        </div>
    )
}

export default banner