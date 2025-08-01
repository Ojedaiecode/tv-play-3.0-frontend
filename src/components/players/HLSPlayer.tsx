import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  url: string;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((error) => {
          console.log("Erro ao iniciar reprodução automática:", error);
        });
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Para Safari que tem suporte nativo a HLS
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((error) => {
          console.log("Erro ao iniciar reprodução automática:", error);
        });
      });
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full"
      playsInline
      autoPlay
    />
  );
};

export default HLSPlayer; 