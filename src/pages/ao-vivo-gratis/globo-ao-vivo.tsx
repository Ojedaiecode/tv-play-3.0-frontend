import React from 'react';
import HLSPlayer from '@/components/players/HLSPlayer';
import NavbarGlobal from '@/components/NavbarGlobal';
import FooterGlobal from '@/components/FooterGlobal';

const GloboAoVivo = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <NavbarGlobal />
      
      <main className="flex-1 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Globo Ao Vivo
          </h1>
          
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <HLSPlayer url="https://live-01.edge-vtal-sdu-rj.video.globo.com/j/eyJhbGciOiJSUzUxMiIsImtpZCI6IjEiLCJ0eXAiOiJKV1QifQ.eyJjb3VudHJ5X2NvZGUiOiJCUiIsImRvbWFpbiI6ImxpdmUtMDEuZWRnZS12dGFsLXNkdS1yai52aWRlby5nbG9iby5jb20iLCJleHAiOjE3NTQxNjI3MTAsImlhdCI6MTc1NDA3NjMxMCwiaXNzIjoicGxheWJhY2stYXBpLXByb2QtZ2NwIiwib3duZXIiOiJmYzRkY2QzNi01MjY2LTQzZTMtYjkzZS1jM2VhMTcxNGI1M2QiLCJwYXRoIjoiL2xpdmUvZihpPTIpL2dsb2JvLXJqL3BsYXlsaXN0Lm0zdTgifQ.yS-qviXspD0DCj0KEk7JA7nSZfm2d3HWthg-7OsFh89hsbn6rKN9AJRyifXrZQINzHNDhDLjm4_KfSUPcIWe0jkKAH8KeKDT0cdPtveX4cShqrmJOf33rGK2zU0CvaZa_u4T767gMW1B_piRVDVf5Y1AVpJPJmal4ZXEzgBdOlQZ-MqgJpXud71raqSN-Q6GQ8igV50TpudFcrxaIuhDTsyxA0glXO5iBqiNmBgd9YTDmpxVP2gFXri0E6uFqbEHDx4hQgzLkjyGTZGDL7wu0LTFDrDK74utI1PPna21xjiguf7SAKUInv4N_USEwgbMAvzVkzMwA5A0CC2FDJuBNQ/live/f(i=2)/globo-rj/playlist.m3u8?originpath=/linear/hls/pa/event/wBmfs4-QQVOqpPjYlG0ihw/stream/b6b2d326-a55d-4c42-943c-97ca3dfc5d59:SCL2/variant/105fc581e5c883edc11e2f8adffe9ab2/bandwidth/4385000.m3u8" />
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

export default GloboAoVivo; 