
import React, { useState } from 'react';
import { Home, Radio, User, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NavbarGlobal = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aqui futuramente podemos adicionar lógica de logout
    navigate('/');
  };

  return (
    <nav className="bg-black/95 backdrop-blur-md shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-3 py-2.5">
        {/* Container principal com altura fixa */}
        <div className="h-12 flex items-center justify-between">
          {/* Logo com tamanho responsivo */}
          <div className="flex items-center space-x-2">
            <img 
              src="https://cdn.tvplaydastorcidas.com/nome-navbar.png"
              alt="TV Play das Torcidas"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-all cursor-pointer"
              onClick={() => navigate('/home')}
            />
          </div>
          
          {/* Menu desktop - escondido em mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => navigate('/home')} className="text-white/90 hover:text-white transition-colors flex items-center gap-2 text-sm">
              <Home size={16} />
              <span>Início</span>
            </button>
            <button onClick={() => navigate('/ao-vivo-gratis')} className="text-white/90 hover:text-white transition-colors flex items-center gap-2 text-sm">
              <Radio size={16} />
              <span>Ao Vivo</span>
            </button>
            <button className="text-white/90 hover:text-white transition-colors text-sm">Séries</button>
            <button className="text-white/90 hover:text-white transition-colors text-sm">Esporte</button>
            <button className="text-white/90 hover:text-white transition-colors text-sm">Filmes</button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
              Assine
            </button>
          </div>
          
          {/* Container direito com avatar e botão mobile */}
          <div className="flex items-center space-x-3">
            {/* Avatar com Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <User size={16} className="text-white/90" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl z-[60]"
                  >
                    {/* Futuramente adicionar mais opções aqui */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-gray-700 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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
            className="md:hidden border-t border-gray-800 relative z-[60]"
          >
            <div className="px-3 py-2 space-y-1 bg-black/95">
              <button onClick={() => navigate('/home')} className="w-full flex items-center gap-2 px-3 py-2 text-white/90 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <Home size={16} />
                <span className="text-sm">Início</span>
              </button>
              <button onClick={() => navigate('/ao-vivo-gratis')} className="w-full flex items-center gap-2 px-3 py-2 text-white/90 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <Radio size={16} />
                <span className="text-sm">Ao Vivo</span>
              </button>
              <button className="w-full text-left px-3 py-2 text-white/90 hover:text-white hover:bg-gray-800 rounded-lg transition-all text-sm">
                Séries
              </button>
              <button className="w-full text-left px-3 py-2 text-white/90 hover:text-white hover:bg-gray-800 rounded-lg transition-all text-sm">
                Esporte
              </button>
              <button className="w-full text-left px-3 py-2 text-white/90 hover:text-white hover:bg-gray-800 rounded-lg transition-all text-sm">
                Filmes
              </button>
              <div className="px-3 py-2">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Assine Agora
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarGlobal; 
