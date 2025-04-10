import { useState, useEffect, useCallback } from 'react';
import { Oportunidade, OportunidadeFiltros, OportunidadeStatus } from '@/types/comercial';
import { supabase, crmonefactory } from '@/lib/supabase/client';

export function useOportunidades() {
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOportunidades = useCallback(async (filtros?: OportunidadeFiltros) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construir URL com parâmetros de filtro
      let url = '/api/comercial/oportunidades';
      
      if (filtros) {
        const params = new URLSearchParams();
        
        if (filtros.termo) params.append('termo', filtros.termo);
        if (filtros.status && filtros.status !== 'todos') params.append('status', filtros.status);
        if (filtros.cliente && filtros.cliente !== 'todos') params.append('cliente', filtros.cliente);
        if (filtros.responsavel && filtros.responsavel !== 'todos') params.append('responsavel', filtros.responsavel);
        if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio.toISOString().split('T')[0]);
        if (filtros.dataFim) params.append('dataFim', filtros.dataFim.toISOString().split('T')[0]);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      
      console.log("Buscando oportunidades com URL:", url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar oportunidades');
      }
      
      const data = await response.json();
      setOportunidades(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar oportunidades:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOportunidade = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/comercial/oportunidades/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Erro ao buscar oportunidade: ${response.status} ${response.statusText}${errorData ? ' - ' + JSON.stringify(errorData) : ''}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Erro ao buscar oportunidade:', err);
      throw err;
    }
  }, []);

  const createOportunidade = useCallback(async (oportunidade: Partial<Oportunidade>) => {
    try {
      const response = await fetch('/api/comercial/oportunidades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(oportunidade),
      });
      
      // Verificar primeiro se a resposta está ok antes de tentar parsear o JSON
      if (!response.ok) {
        let errorMessage = `Erro ao criar oportunidade: ${response.status} ${response.statusText}`;
        
        try {
          // Tentar obter a mensagem de erro como JSON, se possível
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // Se não conseguir parsear como JSON, usar a mensagem de erro genérica
          console.error('Erro ao parsear resposta de erro:', parseError);
        }
        
        throw new Error(errorMessage);
      }
      
      // Se chegou aqui, a resposta está ok, agora podemos parsear com segurança
      const data = await response.json();
      setOportunidades((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Erro ao criar oportunidade:', err);
      throw err;
    }
  }, []);

  const updateOportunidade = useCallback(async (id: string, data: Partial<Oportunidade>) => {
    try {
      const response = await fetch(`/api/comercial/oportunidades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      // Obter a resposta JSON para acessar mensagens de erro específicas
      const respData = await response.json();
      
      if (!response.ok) {
        // Capturar a mensagem de erro específica da API
        throw new Error(respData.error || 'Erro ao atualizar oportunidade');
      }
      
      setOportunidades((prev) =>
        prev.map((opp) => (opp.id === id ? respData : opp))
      );
      
      return respData;
    } catch (err) {
      console.error('Erro ao atualizar oportunidade:', err);
      throw err;
    }
  }, []);

  const updateOportunidadeStatus = useCallback(async (id: string, status: OportunidadeStatus) => {
    try {
      console.log(`Tentando atualizar oportunidade ${id} para status ${status}`);
      
      // Primeiro atualizar o estado local para feedback imediato
      setOportunidades((prev) =>
        prev.map((opp) => (opp.id === id ? { ...opp, status } : opp))
      );
      
      // Usar o cliente Supabase centralizado com o schema correto
      try {
        console.log('Atualizando status via cliente Supabase...');
        const { data, error } = await crmonefactory
          .from('oportunidades')
          .update({
            status: status,
            data_atualizacao: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
          
        if (error) {
          console.error('Erro ao atualizar no Supabase:', error);
          throw error;
        }
        
        console.log('Atualização via cliente Supabase bem-sucedida:', data);
        return data;
      } catch (supabaseError) {
        console.error('Falha no Supabase, tentando via API:', supabaseError);
        
        // Tentar pela API normal como fallback
        const response = await fetch(`/api/comercial/oportunidades/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao atualizar status da oportunidade');
        }
        
        console.log('Atualização via API bem-sucedida:', data);
        return data;
      }
    } catch (err) {
      console.error('Erro ao atualizar status da oportunidade:', err);
      throw err;
    }
  }, []);

  const deleteOportunidade = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/comercial/oportunidades/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        // Tentar obter uma mensagem de erro detalhada se disponível
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao excluir oportunidade');
        } catch (jsonError) {
          // Se não conseguir obter o JSON, usar o status HTTP
          throw new Error(`Erro ao excluir oportunidade: ${response.status} ${response.statusText}`);
        }
      }
      
      setOportunidades((prev) => prev.filter((opp) => opp.id !== id));
      return true;
    } catch (err) {
      console.error('Erro ao excluir oportunidade:', err);
      throw err;
    }
  }, []);

  // Carregar oportunidades ao montar o componente
  useEffect(() => {
    fetchOportunidades();
  }, [fetchOportunidades]);

  return {
    oportunidades,
    isLoading,
    error,
    fetchOportunidades,
    getOportunidade,
    createOportunidade,
    updateOportunidade,
    updateOportunidadeStatus,
    deleteOportunidade,
  };
}
