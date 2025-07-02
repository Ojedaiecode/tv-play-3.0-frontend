
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerGlobal = () => {
  const banners = [
    'https://cdn.tvplaydastorcidas.com/banner-dona-de-mim-01.jpg',
    'https://cdn.tvplaydastorcidas.com/banner-conmenbol-libertadores-01.jpg',
    'https://cdn.tvplaydastorcidas.com/banner-lady-gaga-01.jpg',
    'https://cdn.tvplaydastorcidas.com/banner-tv-torcida-01.png',
    'https://cdn.tvplaydastorcidas.com/play-telecine-001.jpg',
    'https://cdn.tvplaydastorcidas.com/tv-play-01.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getPrevIndex = () => (currentIndex - 1 + banners.length) % banners.length;
  const getNextIndex = () => (currentIndex + 1) % banners.length;

  return (
    <div className="relative w-full mx-auto my-8 px-4">
      <div className="relative overflow-hidden">
        {/* Container do carrossel */}
        <div className="flex items-center justify-center relative gap-8">
          {/* Banner anterior (parcial) */}
          <div className="hidden lg:block w-1/5 h-64 opacity-60 z-10 relative group">
            <img
              src={banners[getPrevIndex()]}
              alt="Banner anterior"
              className="w-full h-full object-cover rounded-lg cursor-pointer transition-all duration-300"
              onClick={prevSlide}
            />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white rounded-lg transition-all duration-300"></div>
          </div>

          {/* Banner central (principal) */}
          <div className="w-full lg:w-3/5 h-96 lg:h-[600px] relative z-20 mx-auto group">
            <img
              src={banners[currentIndex]}
              alt={`Banner ${currentIndex + 1}`}
              className="w-full h-full object-cover rounded-lg cursor-pointer transition-all duration-300"
            />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white rounded-lg transition-all duration-300"></div>
          </div>

          {/* Banner seguinte (parcial) */}
          <div className="hidden lg:block w-1/5 h-64 opacity-60 z-10 relative group">
            <img
              src={banners[getNextIndex()]}
              alt="Próximo banner"
              className="w-full h-full object-cover rounded-lg cursor-pointer transition-all duration-300"
              onClick={nextSlide}
            />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white rounded-lg transition-all duration-300"></div>
          </div>
        </div>

        {/* Setas de navegação */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-30 transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full z-30 transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicadores de posição */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerGlobal;
