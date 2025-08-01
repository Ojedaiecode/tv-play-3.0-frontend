import React from 'react';
import YouTubePlayer from '@/components/players/YouTubePlayer';
import NavbarGlobal from '@/components/NavbarGlobal';
import FooterGlobal from '@/components/FooterGlobal';

const SBTRJAoVivo = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <NavbarGlobal />
      
      <main className="flex-1 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            SBT RJ Ao Vivo
          </h1>
          
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <YouTubePlayer videoId="LMqiRdlRnzg" />
            {/* Aqui vamos implementar o player quando tivermos o link do YouTube */}
          </div>

          {/* Área para informações adicionais */}
          <div className="mt-4">
            <h2 className="text-lg text-white/90">Programação Atual</h2>
            <p className="text-gray-400">Agora</p>
          </div>
        </div>
      </main>
      
      <FooterGlobal />
    </div>
  );
};

export default SBTRJAoVivo; 