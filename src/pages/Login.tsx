
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MessageCircle } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirecionar para página inicial
    navigate('/home');
  };

  const handleWhatsApp = () => {
    // Abrir WhatsApp - você pode personalizar o número
    window.open('https://wa.me/5511999999999', '_blank');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://cdn.tvplaydastorcidas.com/tv-play-background-login-00.jpg)'
      }}
    >
      <div className="w-full max-w-md mx-4">
        <div className="bg-transparent border-2 border-white rounded-lg p-8 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            TV Play das Torcidas
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="text"
                name="nome"
                placeholder="NOME"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 hover:bg-white hover:bg-opacity-10"
                required
              />
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                placeholder="EMAIL"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 hover:bg-white hover:bg-opacity-10"
                required
              />
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="senha"
                placeholder="SENHA"
                value={formData.senha}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 bg-transparent border border-white rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 hover:bg-white hover:bg-opacity-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 transform hover:scale-105"
            >
              ENTRAR
            </button>
            
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              CHAMAR NO WHATSAPP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
