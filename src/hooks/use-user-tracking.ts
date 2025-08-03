import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

// Tipos
interface UserDevice {
  browser: {
    name: string;
    version: string;
    userAgent: string;
  };
  os: {
    name: string;
    version: string;
    platform: string;
  };
  hardware: {
    type: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'unknown';
    model: string;
    vendor: string;
    memory?: number;
    cores?: number;
    screen: {
      width: number;
      height: number;
      colorDepth: number;
    };
  };
  network: {
    type: string;
    effectiveType: string;
    downlink?: number;
    rtt?: number;
  };
  language: string;
  lastUpdate: string;
}

interface UserLocation {
  ip: {
    address: string;
    source: string;
    type: string;
  };
  geo: {
    city: string;
    region: string;
    country: string;
    timezone: string;
    isp: string;
  };
  lastUpdate: string;
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

    const deviceType = (): UserDevice['hardware']['type'] => {
      if (result.device.type === 'mobile') return 'mobile';
      if (result.device.type === 'tablet') return 'tablet';
      if (/smart-tv|smarttv|tv|television/i.test(navigator.userAgent)) return 'tv';
      return 'desktop';
    };

    // Informações de rede
    const connection = (navigator as any).connection;
    const networkInfo = {
      type: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink,
      rtt: connection?.rtt
    };

    const device: UserDevice = {
      browser: {
        name: result.browser.name || 'Unknown',
        version: result.browser.version || 'Unknown',
        userAgent: navigator.userAgent
      },
      os: {
        name: result.os.name || 'Unknown',
        version: result.os.version || 'Unknown',
        platform: navigator.platform
      },
      hardware: {
        type: deviceType(),
        model: result.device.model || 'Unknown',
        vendor: navigator.vendor || result.device.vendor || 'Unknown',
        memory: (navigator as any).deviceMemory,
        cores: navigator.hardwareConcurrency,
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          colorDepth: window.screen.colorDepth
        }
      },
      network: networkInfo,
      language: navigator.language,
      lastUpdate: new Date().toISOString()
    };

    console.log('Informações detalhadas do dispositivo:', device);

    return device;
  };

  // Obter localização por IP
  const getLocation = async (): Promise<UserLocation> => {
    try {
      // Primeiro obtém o IP usando api.ipify.org
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const ip = ipData.ip;

      let geoData: any = null;
      let source = '';

      try {
        // Tenta primeiro com ipwhois.app
        const geoResponse = await fetch(`https://ipwhois.app/json/${ip}`);
        geoData = await geoResponse.json();
        
        if (geoData.success !== false) {
          source = 'ipwhois';
        } else {
          // Tenta com ip-api.com como fallback
          const fallbackResponse = await fetch(`http://ip-api.com/json/${ip}`);
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData.status === 'success') {
            geoData = fallbackData;
            source = 'ip-api';
          }
        }
      } catch (error) {
        console.error('Erro ao obter geolocalização:', error);
      }

      const location: UserLocation = {
        ip: {
          address: ip,
          source: source || 'ipify',
          type: ip.includes(':') ? 'ipv6' : 'ipv4'
        },
        geo: {
          city: geoData?.city || 'Desconhecida',
          region: geoData?.region || geoData?.regionName || 'Desconhecida',
          country: geoData?.country || geoData?.country_name || 'Desconhecido',
          timezone: geoData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          isp: geoData?.isp || 'Desconhecido'
        },
        lastUpdate: new Date().toISOString()
      };

      console.log('Informações detalhadas de localização:', location);
      
      return location;
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      return {
        ip: {
          address: 'Não detectado',
          source: 'error',
          type: 'unknown'
        },
        geo: {
          city: 'Desconhecida',
          region: 'Desconhecida',
          country: 'Desconhecido',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          isp: 'Desconhecido'
        },
        lastUpdate: new Date().toISOString()
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
        dispositivo: device,
        localizacao: userLocation,
        ultimo_ip: userLocation.ip.address,
        ultimo_acesso: new Date().toISOString()
      };

      // Se é primeiro acesso, registrar IP de cadastro
      if (!userData.ip_cadastro) {
        updates.ip_cadastro = userLocation.ip.address;
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
      console.log('Preparando para atualizar usuário:', userData.id);
      console.log('Dados a serem atualizados:', JSON.stringify(updates, null, 2));

      const { data: updateData, error: updateError } = await supabase
        .from('usuarios_gratis')
        .update(updates)
        .eq('id', userData.id)
        .select()
        .single();

      if (updateError) {
        console.error('Erro na atualização:', {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        });
        return;
      }
      
      console.log('Dados atualizados com sucesso:', updateData);
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