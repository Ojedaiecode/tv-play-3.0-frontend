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
      // Primeiro obtém o IP usando api.ipify.org
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const ip = ipData.ip;

      try {
        // Tenta primeiro com ipwhois.app
        const geoResponse = await fetch(`https://ipwhois.app/json/${ip}`);
        const geoData = await geoResponse.json();
        
        if (geoData.success !== false) {
          return {
            ip: ip,
            city: geoData.city || 'Desconhecida',
            region: geoData.region || 'Desconhecida',
            country: geoData.country || 'Desconhecido'
          };
        }
      } catch (geoError) {
        console.log('Primeiro serviço de geolocalização falhou, tentando alternativa...');
      }

      try {
        // Tenta com ip-api.com como fallback
        const fallbackResponse = await fetch(`http://ip-api.com/json/${ip}`);
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.status === 'success') {
          return {
            ip: ip,
            city: fallbackData.city || 'Desconhecida',
            region: fallbackData.regionName || 'Desconhecida',
            country: fallbackData.country || 'Desconhecido'
          };
        }
      } catch (fallbackError) {
        console.log('Serviço de fallback também falhou');
      }

      // Se chegou aqui, retorna pelo menos o IP que conseguimos
      return {
        ip: ip,
        city: 'Desconhecida',
        region: 'Desconhecida',
        country: 'Desconhecido'
      };
    } catch (error) {
      console.error('Erro ao obter IP:', error);
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
      console.log('Iniciando atualização para:', user.email);
      
      // Primeiro, buscar o usuário pelo email
      const { data: userData, error: fetchError } = await supabase
        .from('usuarios_gratis')
        .select('*')
        .eq('email', user.email)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar usuário:', fetchError);
        return;
      }

      if (!userData) {
        console.error('Usuário não encontrado no banco');
        return;
      }

      console.log('Dados do usuário encontrados:', userData);

      // Preparar dados para atualização
      const updates: any = {
        dispositivo: {
          browser: device.browser || 'Desconhecido',
          os: device.os || 'Desconhecido',
          type: device.type || 'desktop',
          model: device.device || 'Desconhecido'
        }
      };

      // Atualizar IP e localização apenas se tivermos dados válidos
      if (userLocation.ip !== 'Não detectado') {
        updates.ultimo_ip = userLocation.ip;
        
        if (!userData.ip_cadastro) {
          updates.ip_cadastro = userLocation.ip;
        }

        if (userLocation.city !== 'Desconhecida') {
          updates.localizacao = `${userLocation.city}, ${userLocation.region}, ${userLocation.country}`;
        }
      }

      // Atualizar timestamp e incrementar acessos
      updates.ultimo_acesso = new Date().toISOString();
      
      try {
        const { data: countData } = await supabase
          .rpc('increment_access_count', { user_id: userData.id });
        
        if (countData) {
          updates.quantidade_acessos = countData;
        }
      } catch (rpcError) {
        console.error('Erro ao incrementar acessos:', rpcError);
      }

      console.log('Tentando atualizar com:', updates);

      // Fazer a atualização
      const { error: updateError } = await supabase
        .from('usuarios_gratis')
        .update(updates)
        .eq('id', userData.id);

      if (updateError) {
        console.error('Erro na atualização:', updateError);
        return;
      }
      
      console.log('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro geral ao atualizar informações:', error);
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