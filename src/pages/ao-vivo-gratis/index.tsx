import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarGlobal from '../../components/NavbarGlobal';
import FooterGlobal from '../../components/FooterGlobal';

// Interface para canais ao vivo
interface LiveChannel {
  title: string;
  imageUrl: string;
  currentShow: string;
  isLive: boolean;
}

const CanaisGratisPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dados dos canais ao vivo
  const liveChannels: LiveChannel[] = [
    {
      title: "Agora na Globo",
      imageUrl: "https://s2-redeglobo.glbimg.com/DjOT-jgM3o8O-XXXJEfozb_2ZKg=/0x0:2274x1234/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_b58693ed41d04a39826739159bf600a0/internal_photos/bs/2025/V/U/S58chbRvWBCmU2M5TF1g/captura-de-tela-2025-04-25-as-21.10.49.png",
      currentShow: "Agora",
      isLive: true
    },
    {
      title: "SBT",
      imageUrl: "https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2025/04/07/1431165982-sbt.jpg",
      currentShow: "Agora",
      isLive: true
    },
    {
      title: "Record Tv",
      imageUrl: "https://portal.comunique-se.com.br/wp-content/uploads/2022/01/Surto-de-Covid-19-faz-sindicato-cobrar-medidas-por-parte-da-Record-TV-740x387.jpg",
      currentShow: "Agora",
      isLive: true
    },
    {
      title: "Band",
      imageUrl: "https://braziljournal.com/wp-content/uploads/2022/06/164bcbd7-9e1a-b098-6489-da08bb218aac-857x482.jpg?x73457",
      currentShow: "Agora",
      isLive: true
    }
  ];

  const banners = [
    "https://cdn.tvplaydastorcidas.com/teste-banner-01.jpg",
    "https://cdn.tvplaydastorcidas.com/teste-banner-01.jpg",
    "https://cdn.tvplaydastorcidas.com/teste-banner-01.jpg"
  ];

  // Função para avançar o slide automaticamente
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <NavbarGlobal />
      
      <main className="flex-1 bg-gray-900">
        {/* Banner Carousel */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="relative w-full aspect-[21/6] overflow-hidden rounded-lg">
            {/* Slides */}
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Dots navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Grid de canais */}
        <div className="px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {liveChannels.map((channel, index) => (
                <div 
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => {
                    if (index === 0) navigate('/ao-vivo-gratis/globo-ao-vivo');
                    if (index === 1) navigate('/ao-vivo-gratis/sbt-rj-ao-vivo');
                  }}
                >
                  <img
                    src={channel.imageUrl}
                    alt={channel.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Overlay com gradiente e informações */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <div className="absolute bottom-0 left-0 p-2 sm:p-3 w-full">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-300">{channel.currentShow}</p>
                          <h3 className="text-sm sm:text-base font-medium text-white">{channel.title}</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2">
                          <span className="px-1.5 py-0.5 text-[10px] sm:text-xs bg-blue-500/90 text-white rounded">Gratuito</span>
                          <span className="px-1.5 py-0.5 text-[10px] sm:text-xs bg-red-500/90 text-white rounded">Ao vivo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors duration-300 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <FooterGlobal />
    </div>
  );
};

export default CanaisGratisPage; 