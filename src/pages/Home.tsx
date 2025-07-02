
import React from 'react';
import NavbarGlobal from '../components/NavbarGlobal';
import BannerGlobal from '../components/BannerGlobal';
import FooterGlobal from '../components/FooterGlobal';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavbarGlobal />
      <BannerGlobal />
      
      {/* Main content area - vazio por enquanto conforme solicitado */}
      <main className="min-h-[50vh] bg-gray-900">
        {/* Área principal vazia por enquanto */}
      </main>
      
      <FooterGlobal />
    </div>
  );
};

export default Home;
