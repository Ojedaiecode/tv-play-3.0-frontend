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

      // Obter IP atual
      const currentIp = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip);

      // Verificar acesso por IP
      const { canAccess, message } = await checkUserAccess(email, currentIp);
      
      if (!canAccess) {
        return { error: { message } };
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
      if (user?.id) {
        // Atualizar status e último acesso
        await supabase
          .from('usuarios_gratis')
          .update({
            status: 'offline',
            ultimo_acesso: new Date().toISOString()
          })
          .eq('id', user.id);
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