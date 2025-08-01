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
            <HLSPlayer url="https://live-vm-ce-10.video.globo.com/j/eyJhbGciOiJSUzUxMiIsImtpZCI6IjEiLCJ0eXAiOiJKV1QifQ.eyJjb3VudHJ5X2NvZGUiOiJCUiIsImRvbWFpbiI6ImxpdmUtdm0tY2UtMTAudmlkZW8uZ2xvYm8uY29tIiwiZXhwIjoxNzU0MDkwNzE5LCJpYXQiOjE3NTQwMDQzMTksImlzcyI6InBsYXliYWNrLWFwaS1wcm9kLWdjcCIsIm93bmVyIjoiZmM0ZGNkMzYtNTI2Ni00M2UzLWI5M2UtYzNlYTE3MTRiNTNkIiwicGF0aCI6Ii9saXZlL2YoaT0yKS9nbG9iby1yai9wbGF5bGlzdC5tM3U4In0.hB6rqeJEiSj6SKCqVPWEjLpaM8fHdg_V0V4v4o3LQs-eax28lLzN4CNHA4lI9I02RVBPoKWgJhiFFDqE1rPdUxoyyKjhrW-LwnjlRRZ4n_5R7n9JRAJzUwsLFoTew6BZyKWSVYKfpukWqvHe5gh8PUBH4zG67J5Zmr-lrngq0xeaGrG9VUmyhVUW9gaHPSxnl2o58lskrMSfHFUDkYLJyRNdFeCWmGs9v5VzwQbRV6FOvGcoBVB8HJGNJoZWdYln6IGu633JrCcPvdcGIQsQOtE6NBtwkY7XGPG2K5pNnEignILpdOYyHGJ78JQOMbS9bilIE8dauyWZj35ERhB9xw/live/f(i=2)/globo-rj/playlist.m3u8?originpath=/linear/hls/pa/event/wBmfs4-QQVOqpPjYlG0ihw/stream/bc0cd4eb-fd06-4db0-8e1b-bfa4164ab9c8:SCL2/variant/105fc581e5c883edc11e2f8adffe9ab2/bandwidth/4385000.m3u8" />
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