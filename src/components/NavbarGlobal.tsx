
import React, { useState } from 'react';
import { Home, Radio, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavbarGlobal = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-3 py-2.5">
        {/* Container principal com altura fixa */}
        <div className="h-12 flex items-center justify-between">
          {/* Logo com tamanho responsivo */}
          <div className="flex items-center space-x-2">
            <div className="text-white font-bold text-base sm:text-lg md:text-xl transition-all">
              TV Play das Torcidas
            </div>
          </div>
          
          {/* Menu desktop - escondido em mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white/90 hover:text-white transition-colors flex items-center gap-2 text-sm">
              <Home size={16} />
              <span>Início</span>
            </a>
            <a href="#" className="text-white/90 hover:text-white transition-colors flex items-center gap-2 text-sm">
              <Radio size={16} />
              <span>Ao Vivo</span>
            </a>
            <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">Séries</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">Esporte</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">Filmes</a>
            <a href="#" className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
              Assine
            </a>
          </div>
          
          {/* Container direito com avatar e botão mobile */}
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors cursor-pointer">
              <User size={16} className="text-white/90" />
            </div>
            
            {/* Botão mobile */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X size={20} className="text-white" />
              ) : (
                <Menu size={20} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile com animação */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-800"
          >
            <div className="px-3 py-2 space-y-1 bg-black/95">
              <a href="#" className="flex items-center gap-2 px-3 py-2 text-white/90 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <Home size={16} />
                <span className="text-sm">Início</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 text-white/90 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <Radio size={16} />
                <span className="text-sm">Ao Vivo</span>
              </a>
              <a href="#" className="block px-3 py-2 text-white/90 hover:text-white hover:bg-gray-800 rounded-lg transition-all text-sm">
                Séries
              </a>
              <a href="#" className="block px-3 py-2 text-white/90 hover:text-white hover:bg-gray-800 rounded-lg transition-all text-sm">
                Esporte
              </a>
              <a href="#" className="block px-3 py-2 text-white/90 hover:text-white hover:bg-gray-800 rounded-lg transition-all text-sm">
                Filmes
              </a>
              <div className="px-3 py-2">
                <a href="#" className="block bg-red-600 hover:bg-red-700 text-white text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Assine Agora
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarGlobal;
