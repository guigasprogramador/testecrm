import { useState, useEffect, useCallback } from 'react';

interface EstatisticasComercial {
  periodo: string;
  totalOportunidades: number;
  estatisticasPorStatus: {
    novo_lead: number;
    agendamento_reuniao: number;
    levantamento_oportunidades: number;
    proposta_enviada: number;
    negociacao: number;
    fechado_ganho: number;
    fechado_perdido: number;
  };
  valorTotalGanhas: number;
  valorTotalNegociacao: number;
  oportunidadesPorResponsavel: Record<string, number>;
  oportunidadesPorCliente: Record<string, number>;
  taxaConversao: string;
}

export function useEstatisticas() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasComercial | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstatisticas = useCallback(async (periodo?: 'semana' | 'mes' | 'trimestre' | 'ano') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construir URL com parâmetros de filtro
      let url = '/api/comercial/estatisticas';
      
      if (periodo) {
        url += `?periodo=${periodo}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas');
      }
      
      const data = await response.json();
      setEstatisticas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar estatísticas ao montar o componente
  useEffect(() => {
    fetchEstatisticas();
  }, [fetchEstatisticas]);

  return {
    estatisticas,
    isLoading,
    error,
    fetchEstatisticas,
  };
}
