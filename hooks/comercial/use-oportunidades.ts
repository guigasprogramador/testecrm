import { useState, useEffect, useCallback } from 'react';
import { Oportunidade, OportunidadeFiltros, OportunidadeStatus } from '@/types/comercial';

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
      
      if (!response.ok) {
        throw new Error('Erro ao criar oportunidade');
      }
      
      const novaOportunidade = await response.json();
      setOportunidades((prev) => [...prev, novaOportunidade]);
      
      return novaOportunidade;
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
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar oportunidade');
      }
      
      const oportunidadeAtualizada = await response.json();
      
      setOportunidades((prev) =>
        prev.map((opp) => (opp.id === id ? oportunidadeAtualizada : opp))
      );
      
      return oportunidadeAtualizada;
    } catch (err) {
      console.error('Erro ao atualizar oportunidade:', err);
      throw err;
    }
  }, []);

  const updateOportunidadeStatus = useCallback(async (id: string, status: OportunidadeStatus) => {
    try {
      const response = await fetch(`/api/comercial/oportunidades/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar status da oportunidade');
      }
      
      const oportunidadeAtualizada = await response.json();
      
      setOportunidades((prev) =>
        prev.map((opp) => (opp.id === id ? oportunidadeAtualizada : opp))
      );
      
      return oportunidadeAtualizada;
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
        throw new Error('Erro ao excluir oportunidade');
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
