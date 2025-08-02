import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AccessCheckResult {
  canAccess: boolean;
  message: string;
}

export async function checkUserAccess(email: string, currentIp: string): Promise<AccessCheckResult> {
  try {
    // Buscar usuário
    const { data: user, error } = await supabase
      .from('usuarios_gratis')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return {
        canAccess: false,
        message: 'Usuário não encontrado'
      };
    }

    // Se o usuário está online e o IP é diferente
    if (user.status === 'online' && user.ultimo_ip && user.ultimo_ip !== currentIp) {
      // Verificar se passou mais de 30 minutos desde o último acesso
      const lastAccess = new Date(user.ultimo_acesso);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      if (lastAccess > thirtyMinutesAgo) {
        return {
          canAccess: false,
          message: 'Este usuário já está logado. Se precisa de um novo login, chame no WhatsApp'
        };
      }
    }

    // Se é o primeiro acesso ou se o IP mudou
    if (!user.ip_cadastro) {
      return {
        canAccess: true,
        message: 'Primeiro acesso'
      };
    }

    return {
      canAccess: true,
      message: 'Acesso permitido'
    };
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return {
      canAccess: false,
      message: 'Erro ao verificar acesso'
    };
  }
}