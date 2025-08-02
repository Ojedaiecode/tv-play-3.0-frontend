import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AccessCheckResult {
  canAccess: boolean;
  message?: string;
  currentIp?: string;
  lastIp?: string;
}

export const checkUserAccess = async (email: string, currentIp: string): Promise<AccessCheckResult> => {
  try {
    // Buscar usuário
    const { data: user, error } = await supabase
      .from('usuarios_gratis')
      .select('id, status, ultimo_ip, ultimo_acesso')
      .eq('email', email)
      .single();

    if (error) throw error;
    if (!user) return { 
      canAccess: false, 
      message: 'Usuário não encontrado' 
    };

    // Verificar se usuário está ativo
    if (user.status !== 'ativo') return {
      canAccess: false,
      message: 'Conta inativa. Entre em contato via WhatsApp.'
    };

    // Se não tem último acesso, permitir acesso
    if (!user.ultimo_acesso) return {
      canAccess: true,
      currentIp
    };

    // Se IP atual é diferente do último IP e tem acesso recente
    const lastAccessTime = new Date(user.ultimo_acesso).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastAccessTime;
    const TIMEOUT_PERIOD = 30 * 60 * 1000; // 30 minutos em milissegundos

    if (user.ultimo_ip && 
        user.ultimo_ip !== currentIp && 
        timeDifference < TIMEOUT_PERIOD) {
      return {
        canAccess: false,
        message: 'Este usuário está logado. Se precisa de um novo login, chame no WhatsApp',
        currentIp,
        lastIp: user.ultimo_ip
      };
    }

    // Permitir acesso
    return {
      canAccess: true,
      currentIp
    };
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return {
      canAccess: false,
      message: 'Erro ao verificar acesso. Tente novamente.'
    };
  }
};