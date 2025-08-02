import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

// Tipos
interface UserDevice {
  browser: string;
  os: string;
  device: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'unknown';
}

interface UserLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
}

// Inicialização do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const useUserTracking = () => {
  const { user } = useAuth();
  const [deviceInfo, setDeviceInfo] = useState<UserDevice | null>(null);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Detectar informações do dispositivo
  const detectDevice = () => {
    const parser = new UAParser();
    const result = parser.getResult();

    const deviceType = (): UserDevice['type'] => {
      if (result.device.type === 'mobile') return 'mobile';
      if (result.device.type === 'tablet') return 'tablet';
      if (/smart-tv|smarttv|tv|television/i.test(navigator.userAgent)) return 'tv';
      return 'desktop';
    };

    return {
      browser: `${result.browser.name} ${result.browser.version}`,
      os: `${result.os.name} ${result.os.version}`,
      device: result.device.model || 'Unknown',
      type: deviceType()
    };
  };

  // Obter localização por IP
  const getLocation = async (): Promise<UserLocation> => {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name
    };
  };

  // Atualizar informações no Supabase
  const updateUserInfo = async (device: UserDevice, userLocation: UserLocation) => {
    if (!user?.id) return;

    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('usuarios_gratis')
        .update({
          dispositivo: device,
          ultimo_ip: userLocation.ip,
          localizacao: `${userLocation.city}, ${userLocation.region}, ${userLocation.country}`,
          ultimo_acesso: new Date().toISOString(),
          quantidade_acessos: supabase.rpc('increment_access_count', { user_id: user.id })
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar informações:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Efeito principal
  useEffect(() => {
    if (!user) return;

    const initializeTracking = async () => {
      // Detectar dispositivo
      const device = detectDevice();
      setDeviceInfo(device);

      // Obter localização
      try {
        const userLocation = await getLocation();
        setLocation(userLocation);

        // Atualizar informações no Supabase
        await updateUserInfo(device, userLocation);
      } catch (error) {
        console.error('Erro ao inicializar tracking:', error);
      }
    };

    initializeTracking();
  }, [user]);

  return {
    deviceInfo,
    location,
    isUpdating
  };
};