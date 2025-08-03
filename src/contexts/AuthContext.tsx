import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { checkUserAccess } from '@/utils/access-control';

// Tipos
interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// Validação das variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente do Supabase não encontradas:', {
    url: !!supabaseUrl,
    key: !!supabaseKey
  });
  throw new Error('Configuração do Supabase incompleta. Verifique as variáveis de ambiente.');
}

// Criação do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    // Adicionar listener para quando a página for fechada
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (user?.email) {
        event.preventDefault();
        // Forçar logout ao fechar a página
        await supabase.rpc('forcar_logout', { p_email: user.email });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Adicionar listener para quando o usuário ficar inativo
    let inactivityTimer: NodeJS.Timeout;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(async () => {
        if (user?.email) {
          console.log('Usuário inativo por 30 minutos, fazendo logout...');
          await signOut();
        }
      }, 30 * 60 * 1000); // 30 minutos
    };

    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);
    resetInactivityTimer();

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
      clearTimeout(inactivityTimer);
    };
  }, [user?.email]);

  const signIn = async (email: string, password: string) => {
    try {
      // Buscar usuário na tabela usuarios_gratis
      const { data: usuario, error: dbError } = await supabase
        .from('usuarios_gratis')
        .select('*')
        .eq('email', email)
        .single();

      if (dbError || !usuario) {
        console.error('Erro ao buscar usuário:', dbError);
        return { error: { message: 'Usuário não encontrado' } };
      }

      // Verificar senha
      if (usuario.senha !== password) {
        // Incrementar tentativas falhas
        const { error: updateError } = await supabase
          .from('usuarios_gratis')
          .update({ 
            tentativas_falhas: (usuario.tentativas_falhas || 0) + 1 
          })
          .eq('id', usuario.id);

        if (updateError) {
          console.error('Erro ao atualizar tentativas:', updateError);
        }

        return { error: { message: 'Senha incorreta' } };
      }

      // Verificar tentativas falhas
      if (usuario.tentativas_falhas >= 3) {
        return { error: { message: 'Conta bloqueada. Entre em contato via WhatsApp.' } };
      }

      // Verificar status da conta
      if (usuario.status === 'online') {
        return { error: { message: 'Você já está conectado em outro dispositivo. Para usar este dispositivo, faça logout no outro primeiro.' } };
      }
      
      if (usuario.status === 'inativo' || usuario.status === 'bloqueado') {
        return { error: { message: 'Acesso temporariamente suspenso. Entre em contato via WhatsApp para mais informações.' } };
      }

      // Verificar validade
      if (new Date(usuario.validade) < new Date()) {
        return { error: { message: 'Conta expirada. Entre em contato via WhatsApp.' } };
      }

      // Obter IP atual usando múltiplas fontes
      let currentIp = '';
      let ipSource = '';
      
      try {
        // Tentar primeiro com ipify
        const ipifyResponse = await fetch('https://api.ipify.org?format=json');
        const ipifyData = await ipifyResponse.json();
        currentIp = ipifyData.ip;
        ipSource = 'ipify';
        
        // Tentar com outro serviço para confirmar
        const checkipResponse = await fetch('https://checkip.amazonaws.com/');
        const checkipData = await checkipResponse.text();
        const confirmIp = checkipData.trim();
        
        console.log('Debug IPs:', {
          ipify: currentIp,
          checkip: confirmIp,
          navigator: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor
          },
          connection: {
            type: (navigator as any).connection ? (navigator as any).connection.type : 'unknown',
            effectiveType: (navigator as any).connection ? (navigator as any).connection.effectiveType : 'unknown'
          }
        });
        
        if (confirmIp !== currentIp) {
          console.warn('IPs diferentes detectados:', { ipify: currentIp, checkip: confirmIp });
        }
      } catch (error) {
        console.error('Erro ao obter IP:', error);
        throw new Error('Não foi possível determinar seu IP. Por favor, tente novamente.');
      }

      // Iniciar sessão
      console.log('Tentando iniciar sessão com:', { email, currentIp });
      
      const { data, error: erroSessao } = await supabase
        .rpc('iniciar_sessao', {
          p_email: email,
          p_ip: currentIp
        });

      console.log('Resposta do iniciar_sessao:', { data, erroSessao });

      const resultadoSessao = data as { success: boolean; message: string };

      if (erroSessao || !resultadoSessao?.success) {
        const mensagemErro = erroSessao?.message || resultadoSessao?.message || 'Erro ao iniciar sessão';
        console.error('Erro ao iniciar sessão:', { erroSessao, resultadoSessao, mensagemErro });
        return { error: { message: mensagemErro } };
      }

      // Atualizar tentativas falhas
      const { error: updateError } = await supabase
        .from('usuarios_gratis')
        .update({
          tentativas_falhas: 0
        })
        .eq('id', usuario.id);

      if (updateError) {
        console.error('Erro ao atualizar dados do usuário:', updateError);
      }

      setUser(usuario);
      setIsAuthenticated(true);
      return { error: null };
    } catch (error) {
      console.error('Erro no login:', error);
      return { error: { message: 'Erro interno no servidor' } };
    }
  };

  const signOut = async () => {
    try {
      if (user?.email) {
        console.log('Iniciando logout para:', user.email);

        // Primeiro limpar diretamente a sessão
        const { error: erroDelete } = await supabase
          .from('sessoes_ativas')
          .delete()
          .eq('email', user.email);

        if (erroDelete) {
          console.error('Erro ao deletar sessão:', erroDelete);
        }

        // Depois atualizar o usuário
        const { error: erroUpdate } = await supabase
          .from('usuarios_gratis')
          .update({ 
            status: 'ativo',
            ultimo_ip: null,
            ultimo_acesso: new Date().toISOString()
          })
          .eq('email', user.email);

        if (erroUpdate) {
          console.error('Erro ao atualizar usuário:', erroUpdate);
        }

        // Por fim, chamar a função RPC para garantir
        const { error: erroEncerramento } = await supabase
          .rpc('encerrar_sessao', {
            p_email: user.email
          });

        if (erroEncerramento) {
          console.error('Erro ao encerrar sessão:', erroEncerramento);
        }
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Sempre limpa o estado local, independente de erros
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}