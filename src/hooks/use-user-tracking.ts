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
    try {
      // Primeiro obtém o IP
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const ip = ipData.ip;

      // Depois obtém a localização usando o IP
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoResponse.json();
      
      return {
        ip: ip,
        city: geoData.city || 'Desconhecida',
        region: geoData.region || 'Desconhecida',
        country: geoData.country_name || 'Desconhecido'
      };
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      // Retorna dados padrão em caso de erro
      return {
        ip: 'Não detectado',
        city: 'Desconhecida',
        region: 'Desconhecida',
        country: 'Desconhecido'
      };
    }
  };

  // Atualizar informações no Supabase
  const updateUserInfo = async (device: UserDevice, userLocation: UserLocation) => {
    if (!user?.email) {
      console.error('Email do usuário não encontrado');
      return;
    }

    try {
      setIsUpdating(true);
      
      // Primeiro, buscar o usuário pelo email
      const { data: userData, error: fetchError } = await supabase
        .from('usuarios_gratis')
        .select('id, ip_cadastro')
        .eq('email', user.email)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!userData) {
        throw new Error('Usuário não encontrado');
      }

      console.log('Dados do usuário encontrados:', userData);

      // Se é o primeiro acesso, atualizar ip_cadastro
      const updates = {
        dispositivo: device,
        ultimo_ip: userLocation.ip,
        localizacao: `${userLocation.city}, ${userLocation.region}, ${userLocation.country}`,
        ultimo_acesso: new Date().toISOString(),
        quantidade_acessos: supabase.rpc('increment_access_count', { user_id: userData.id })
      };

      if (!userData.ip_cadastro) {
        updates['ip_cadastro'] = userLocation.ip;
      }

      const { error: updateError } = await supabase
        .from('usuarios_gratis')
        .update(updates)
        .eq('id', userData.id);

      if (updateError) throw updateError;
      
      console.log('Dados atualizados com sucesso:', updates);
    } catch (error) {
      console.error('Erro ao atualizar informações:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Efeito principal
  useEffect(() => {
    if (!user?.email) {
      console.log('Aguardando dados do usuário...');
      return;
    }

    const initializeTracking = async () => {
      try {
        console.log('Iniciando tracking para usuário:', user.email);
        
        // Detectar dispositivo
        const device = detectDevice();
        console.log('Informações do dispositivo:', device);
        setDeviceInfo(device);

        // Obter localização
        const userLocation = await getLocation();
        console.log('Informações de localização:', userLocation);
        setLocation(userLocation);

        // Atualizar informações no Supabase
        console.log('Atualizando informações no Supabase...');
        await updateUserInfo(device, userLocation);
        console.log('Informações atualizadas com sucesso!');
      } catch (error) {
        console.error('Erro ao inicializar tracking:', error);
      }
    };

    // Pequeno delay para garantir que tudo está carregado
    setTimeout(initializeTracking, 1000);
  }, [user?.email]); // Dependência mais específica

  return {
    deviceInfo,
    location,
    isUpdating
  };
};