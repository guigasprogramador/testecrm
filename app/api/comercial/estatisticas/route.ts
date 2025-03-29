import { NextRequest, NextResponse } from 'next/server';
import { Oportunidade } from '@/types/comercial';

// Simulação de banco de dados em memória (mesma do arquivo anterior)
let oportunidades: Oportunidade[] = [
  {
    id: "1",
    titulo: "Sistema de Gestão Municipal",
    cliente: "Prefeitura de São Paulo",
    clienteId: "c1",
    valor: "R$ 450.000,00",
    responsavel: "Ana Silva",
    responsavelId: "r1",
    prazo: "30/06/2023",
    status: "novo_lead",
    dataCriacao: "2023-01-15T10:30:00Z",
    dataAtualizacao: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    titulo: "Plataforma de Educação Online",
    cliente: "Secretaria de Educação",
    clienteId: "c2",
    valor: "R$ 280.000,00",
    responsavel: "Carlos Oliveira",
    responsavelId: "r2",
    prazo: "15/07/2023",
    status: "agendamento_reuniao",
    dataCriacao: "2023-02-10T14:20:00Z",
    dataAtualizacao: "2023-02-15T09:45:00Z",
  },
  {
    id: "3",
    titulo: "Modernização de Infraestrutura",
    cliente: "Hospital Municipal",
    clienteId: "c3",
    valor: "R$ 620.000,00",
    responsavel: "Ana Silva",
    responsavelId: "r1",
    prazo: "10/08/2023",
    status: "levantamento_oportunidades",
    dataCriacao: "2023-03-05T11:15:00Z",
    dataAtualizacao: "2023-03-10T16:30:00Z",
  },
  {
    id: "4",
    titulo: "Sistema de Controle de Frotas",
    cliente: "Departamento de Transportes",
    clienteId: "c4",
    valor: "R$ 180.000,00",
    responsavel: "Pedro Santos",
    responsavelId: "r3",
    prazo: "05/06/2023",
    status: "proposta_enviada",
    dataCriacao: "2023-04-12T09:00:00Z",
    dataAtualizacao: "2023-04-20T14:45:00Z",
  },
  {
    id: "5",
    titulo: "Portal de Transparência",
    cliente: "Governo do Estado",
    clienteId: "c5",
    valor: "R$ 320.000,00",
    responsavel: "Carlos Oliveira",
    responsavelId: "r2",
    prazo: "20/07/2023",
    status: "negociacao",
    dataCriacao: "2023-05-08T10:30:00Z",
    dataAtualizacao: "2023-05-15T11:20:00Z",
  },
  {
    id: "6",
    titulo: "Aplicativo de Serviços Públicos",
    cliente: "Prefeitura de Campinas",
    clienteId: "c6",
    valor: "R$ 250.000,00",
    responsavel: "Pedro Santos",
    responsavelId: "r3",
    prazo: "15/06/2023",
    status: "fechado_ganho",
    dataCriacao: "2023-01-20T13:45:00Z",
    dataAtualizacao: "2023-02-28T16:30:00Z",
  },
  {
    id: "7",
    titulo: "Sistema de Gestão Hospitalar",
    cliente: "Hospital Regional",
    clienteId: "c7",
    valor: "R$ 380.000,00",
    responsavel: "Maria Souza",
    responsavelId: "r4",
    prazo: "22/07/2023",
    status: "fechado_perdido",
    dataCriacao: "2023-03-15T09:30:00Z",
    dataAtualizacao: "2023-04-10T14:20:00Z",
  },
];

// GET - Obter estatísticas das oportunidades
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de filtro
    const periodo = searchParams.get('periodo') || 'mes'; // 'semana', 'mes', 'trimestre', 'ano'
    
    // Calcular data de início com base no período
    const hoje = new Date();
    let dataInicio = new Date();
    
    switch (periodo) {
      case 'semana':
        dataInicio.setDate(hoje.getDate() - 7);
        break;
      case 'mes':
        dataInicio.setMonth(hoje.getMonth() - 1);
        break;
      case 'trimestre':
        dataInicio.setMonth(hoje.getMonth() - 3);
        break;
      case 'ano':
        dataInicio.setFullYear(hoje.getFullYear() - 1);
        break;
      default:
        dataInicio.setMonth(hoje.getMonth() - 1); // Padrão: último mês
    }
    
    // Filtrar oportunidades pelo período
    const oportunidadesPeriodo = oportunidades.filter((opp) => {
      const dataCriacao = new Date(opp.dataCriacao);
      return dataCriacao >= dataInicio;
    });
    
    // Estatísticas por status
    const estatisticasPorStatus = {
      novo_lead: 0,
      agendamento_reuniao: 0,
      levantamento_oportunidades: 0,
      proposta_enviada: 0,
      negociacao: 0,
      fechado_ganho: 0,
      fechado_perdido: 0,
    };
    
    oportunidadesPeriodo.forEach((opp) => {
      if (estatisticasPorStatus.hasOwnProperty(opp.status)) {
        estatisticasPorStatus[opp.status as keyof typeof estatisticasPorStatus]++;
      }
    });
    
    // Calcular valor total de oportunidades ganhas
    const valorTotalGanhas = oportunidadesPeriodo
      .filter((opp) => opp.status === 'fechado_ganho')
      .reduce((total, opp) => {
        const valorNumerico = parseFloat(opp.valor.replace(/[^\d,]/g, '').replace(',', '.'));
        return isNaN(valorNumerico) ? total : total + valorNumerico;
      }, 0);
    
    // Calcular valor total de oportunidades em negociação
    const valorTotalNegociacao = oportunidadesPeriodo
      .filter((opp) => opp.status === 'negociacao')
      .reduce((total, opp) => {
        const valorNumerico = parseFloat(opp.valor.replace(/[^\d,]/g, '').replace(',', '.'));
        return isNaN(valorNumerico) ? total : total + valorNumerico;
      }, 0);
    
    // Estatísticas por responsável
    const oportunidadesPorResponsavel: Record<string, number> = {};
    
    oportunidadesPeriodo.forEach((opp) => {
      if (!oportunidadesPorResponsavel[opp.responsavel]) {
        oportunidadesPorResponsavel[opp.responsavel] = 0;
      }
      oportunidadesPorResponsavel[opp.responsavel]++;
    });
    
    // Estatísticas por cliente
    const oportunidadesPorCliente: Record<string, number> = {};
    
    oportunidadesPeriodo.forEach((opp) => {
      if (!oportunidadesPorCliente[opp.cliente]) {
        oportunidadesPorCliente[opp.cliente] = 0;
      }
      oportunidadesPorCliente[opp.cliente]++;
    });
    
    // Taxa de conversão (oportunidades ganhas / total de oportunidades fechadas)
    const oportunidadesFechadas = oportunidadesPeriodo.filter(
      (opp) => opp.status === 'fechado_ganho' || opp.status === 'fechado_perdido'
    ).length;
    
    const oportunidadesGanhas = oportunidadesPeriodo.filter(
      (opp) => opp.status === 'fechado_ganho'
    ).length;
    
    const taxaConversao = oportunidadesFechadas > 0 
      ? (oportunidadesGanhas / oportunidadesFechadas) * 100 
      : 0;
    
    return NextResponse.json({
      periodo,
      totalOportunidades: oportunidadesPeriodo.length,
      estatisticasPorStatus,
      valorTotalGanhas,
      valorTotalNegociacao,
      oportunidadesPorResponsavel,
      oportunidadesPorCliente,
      taxaConversao: taxaConversao.toFixed(2) + '%',
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao obter estatísticas' },
      { status: 500 }
    );
  }
}
