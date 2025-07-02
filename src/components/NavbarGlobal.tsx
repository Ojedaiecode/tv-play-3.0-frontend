
import React from 'react';
import { Home, Radio, User } from 'lucide-react';

const NavbarGlobal = () => {
  return (
    <nav className="bg-black bg-opacity-90 backdrop-blur-sm px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-white font-bold text-xl">
          TV Play das Torcidas
        </div>
        
        {/* Menu de navegação */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-white hover:text-gray-300 transition-colors flex items-center gap-2">
            <Home size={18} />
            Início
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors flex items-center gap-2">
            <Radio size={18} />
            Agora na TV
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">
            Séries
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">
            Esporte
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">
            Filmes
          </a>
          <a href="#" className="text-red-500 hover:text-red-400 transition-colors font-semibold">
            Assine
          </a>
        </div>
        
        {/* Avatar */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors cursor-pointer">
            <User size={20} className="text-white" />
          </div>
        </div>
        
        {/* Menu mobile */}
        <div className="md:hidden">
          <button className="text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Menu mobile expandido */}
      <div className="md:hidden mt-4 space-y-2">
        <a href="#" className="block text-white hover:text-gray-300 transition-colors py-2 flex items-center gap-2">
          <Home size={18} />
          Início
        </a>
        <a href="#" className="block text-white hover:text-gray-300 transition-colors py-2 flex items-center gap-2">
          <Radio size={18} />
          Agora na TV
        </a>
        <a href="#" className="block text-white hover:text-gray-300 transition-colors py-2">
          Séries
        </a>
        <a href="#" className="block text-white hover:text-gray-300 transition-colors py-2">
          Esporte
        </a>
        <a href="#" className="block text-white hover:text-gray-300 transition-colors py-2">
          Filmes
        </a>
        <a href="#" className="block text-red-500 hover:text-red-400 transition-colors py-2 font-semibold">
          Assine
        </a>
      </div>
    </nav>
  );
};

export default NavbarGlobal;
