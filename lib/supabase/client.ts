import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente Supabase com as credenciais fornecidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://supabase.guigasautomacao.uk';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.aSkpG5e1oxLQU5tHQS_oBAie8gbMhUEwMzr8ziECxpc';

// Cria e exporta uma única instância do cliente Supabase para ser reutilizada em toda a aplicação
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Cria um cliente específico para o schema crmonefactory
export const crmonefactory = supabase.schema('crmonefactory');

// Função para usar o token do usuário atual, se disponível
export const getUserClient = async () => {
  // Se estamos no servidor, não podemos acessar os cookies diretamente
  if (typeof window === 'undefined') {
    return crmonefactory;
  }
  
  // No cliente, criamos um cliente que usa o token de autenticação armazenado
  const { data } = await supabase.auth.getSession();
  if (data?.session?.access_token) {
    // Se houver um token de acesso, criamos um cliente que o utiliza
    return supabase.schema('crmonefactory');
  }
  
  // Caso contrário, retornamos o cliente normal
  return crmonefactory;
};
