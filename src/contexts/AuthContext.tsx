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

    return () => subscription.unsubscribe();
  }, []);

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
      if (usuario.status !== 'ativo') {
        return { error: { message: 'Conta inativa. Entre em contato via WhatsApp.' } };
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
            type: navigator.connection ? navigator.connection.type : 'unknown',
            effectiveType: navigator.connection ? navigator.connection.effectiveType : 'unknown'
          }
        });
        
        if (confirmIp !== currentIp) {
          console.warn('IPs diferentes detectados:', { ipify: currentIp, checkip: confirmIp });
        }
      } catch (error) {
        console.error('Erro ao obter IP:', error);
        throw new Error('Não foi possível determinar seu IP. Por favor, tente novamente.');
      }

      // Verificar se já existe uma sessão ativa
      const { data: activeSession } = await supabase
        .from('usuarios_gratis')
        .select('status, ultimo_acesso, ultimo_ip')
        .eq('email', email)
        .single();

      if (activeSession?.status === 'online' && 
          activeSession?.ultimo_ip !== currentIp) {
        const lastAccess = new Date(activeSession.ultimo_acesso);
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        if (lastAccess > thirtyMinutesAgo) {
          return { 
            error: { 
              message: 'Este usuário já está logado em outro dispositivo. Se precisa de um novo login, chame no WhatsApp' 
            } 
          };
        }
      }

      // Verificar acesso por IP
      const { canAccess, message } = await checkUserAccess(email, currentIp);
      
      if (!canAccess) {
        return { error: { message } };
      }

      // Verificar se o usuário já está logado em outro dispositivo
      const { data: statusAtual } = await supabase
        .from('usuarios_gratis')
        .select('status, ultimo_ip, ultimo_acesso')
        .eq('email', email)
        .single();

      if (statusAtual?.status === 'online' && statusAtual.ultimo_ip !== currentIp) {
        const ultimoAcesso = new Date(statusAtual.ultimo_acesso);
        const trintaMinutosAtras = new Date(Date.now() - 30 * 60 * 1000);

        if (ultimoAcesso > trintaMinutosAtras) {
          return { error: { message: `Este usuário já está logado em outro dispositivo (IP: ${statusAtual.ultimo_ip}). Aguarde 30 minutos ou contate o suporte.` } };
        }
      }

      // Verificar se o IP já está sendo usado por outro usuário
      const { data: outroUsuario } = await supabase
        .from('usuarios_gratis')
        .select('email')
        .eq('ultimo_ip', currentIp)
        .eq('status', 'online')
        .neq('email', email)
        .single();

      if (outroUsuario) {
        return { error: { message: 'Este IP já está sendo usado por outro usuário.' } };
      }

      // Atualizar último acesso e resetar tentativas
      const { error: updateError } = await supabase
        .from('usuarios_gratis')
        .update({
          tentativas_falhas: 0,
          ultimo_acesso: new Date().toISOString(),
          ultimo_ip: currentIp,
          status: 'online'
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
        
        // Buscar usuário atual
        const { data: userData } = await supabase
          .from('usuarios_gratis')
          .select('id, status')
          .eq('email', user.email)
          .single();

        if (userData) {
          console.log('Atualizando status para offline...');
          
          // Atualizar status e último acesso
          const { error: updateError } = await supabase
            .from('usuarios_gratis')
            .update({
              status: 'offline',
              ultimo_acesso: new Date().toISOString()
            })
            .eq('id', userData.id);

          if (updateError) {
            console.error('Erro ao atualizar status:', updateError);
          } else {
            console.log('Status atualizado com sucesso');
          }

          // Encerrar sessão
          const { data: resultadoEncerramento, error: erroEncerramento } = await supabase
            .rpc('encerrar_sessao', {
              p_email: user.email
            });

          if (erroEncerramento) {
            console.error('Erro ao encerrar sessão:', erroEncerramento);
          } else {
            console.log('Sessão encerrada com sucesso:', resultadoEncerramento);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
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