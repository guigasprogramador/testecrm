import { NextRequest, NextResponse } from 'next/server';
import { Oportunidade, OportunidadeStatus } from '@/types/comercial';
import * as fs from 'fs';
import * as path from 'path';

// Path para o arquivo de "banco de dados"
const dbPath = path.join(process.cwd(), 'data', 'oportunidades.json');

// Função para carregar os dados do arquivo
async function carregarOportunidades(): Promise<Oportunidade[]> {
  try {
    // Garantir que o diretório existe
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Criar arquivo se não existir
    if (!fs.existsSync(dbPath)) {
      // Dados iniciais para o "banco de dados"
      const oportunidadesIniciais: Oportunidade[] = [
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
          tipo: "produto",
          tipoFaturamento: "direto",
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
          tipo: "servico",
          tipoFaturamento: undefined,
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
          tipo: "produto",
          tipoFaturamento: "distribuidor",
        },
        {
          id: "4",
          titulo: "Sistema de Controle de Frotas",
          cliente: "Departamento de Transportes",
          clienteId: "c4",
          valor: "R$ 180.000,00",
          responsavel: "Pedro Santos",
          responsavelId: "r3",
          prazo: "20/09/2023",
          status: "proposta_enviada",
          dataCriacao: "2023-04-12T08:45:00Z",
          dataAtualizacao: "2023-04-20T14:10:00Z",
          tipo: "produto",
          tipoFaturamento: "direto",
        },
        {
          id: "5",
          titulo: "Portal de Transparência",
          cliente: "Governo do Estado",
          clienteId: "c5",
          valor: "R$ 320.000,00",
          responsavel: "Maria Souza",
          responsavelId: "r4",
          prazo: "05/10/2023",
          status: "negociacao",
          dataCriacao: "2023-05-18T09:30:00Z",
          dataAtualizacao: "2023-05-25T11:20:00Z",
          tipo: "servico",
          tipoFaturamento: undefined,
        },
        {
          id: "6",
          titulo: "Aplicativo de Serviços Públicos",
          cliente: "Prefeitura de Campinas",
          clienteId: "c6",
          valor: "R$ 250.000,00",
          responsavel: "Carlos Oliveira",
          responsavelId: "r2",
          prazo: "15/11/2023",
          status: "fechado_ganho",
          dataCriacao: "2023-06-22T13:45:00Z",
          dataAtualizacao: "2023-07-05T10:15:00Z",
          tipo: "produto",
          tipoFaturamento: "distribuidor",
        },
        {
          id: "7",
          titulo: "Sistema de Gestão Hospitalar",
          cliente: "Hospital Regional",
          clienteId: "c7",
          valor: "R$ 380.000,00",
          responsavel: "Ana Silva",
          responsavelId: "r1",
          prazo: "20/12/2023",
          status: "fechado_perdido",
          dataCriacao: "2023-08-10T15:20:00Z",
          dataAtualizacao: "2023-08-30T09:40:00Z",
          tipo: "servico",
          tipoFaturamento: undefined,
        },
      ];
      
      fs.writeFileSync(dbPath, JSON.stringify(oportunidadesIniciais, null, 2));
      return oportunidadesIniciais;
    }
    
    // Ler do arquivo
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar oportunidades:', error);
    return [];
  }
}

// Função para salvar os dados no arquivo
async function salvarOportunidades(oportunidades: Oportunidade[]): Promise<void> {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(oportunidades, null, 2));
  } catch (error) {
    console.error('Erro ao salvar oportunidades:', error);
  }
}

// GET - Listar todas as oportunidades ou filtrar
export async function GET(request: NextRequest) {
  try {
    const oportunidades = await carregarOportunidades();
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de filtro
    const termo = searchParams.get('termo');
    const status = searchParams.get('status');
    const cliente = searchParams.get('cliente');
    const responsavel = searchParams.get('responsavel');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    
    let resultado = [...oportunidades];
    
    // Aplicar filtros
    if (termo) {
      const termoBusca = termo.toLowerCase();
      resultado = resultado.filter(
        (item) =>
          item.titulo.toLowerCase().includes(termoBusca) ||
          item.cliente.toLowerCase().includes(termoBusca) ||
          item.descricao?.toLowerCase().includes(termoBusca)
      );
    }
    
    if (status && status !== 'todos') {
      resultado = resultado.filter((item) => item.status === status);
    }
    
    if (cliente && cliente !== 'todos') {
      resultado = resultado.filter((item) => item.cliente === cliente);
    }
    
    if (responsavel && responsavel !== 'todos') {
      resultado = resultado.filter((item) => item.responsavel === responsavel);
    }
    
    if (dataInicio) {
      const dataInicioObj = new Date(dataInicio);
      resultado = resultado.filter((item) => {
        const dataPrazo = new Date(item.prazo.split('/').reverse().join('-'));
        return dataPrazo >= dataInicioObj;
      });
    }
    
    if (dataFim) {
      const dataFimObj = new Date(dataFim);
      resultado = resultado.filter((item) => {
        const dataPrazo = new Date(item.prazo.split('/').reverse().join('-'));
        return dataPrazo <= dataFimObj;
      });
    }
    
    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar oportunidades:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar oportunidades' },
      { status: 500 }
    );
  }
}

// POST - Criar nova oportunidade
export async function POST(request: NextRequest) {
  try {
    const oportunidades = await carregarOportunidades();
    const data = await request.json();
    
    // Validação básica
    if (!data.titulo || !data.cliente) {
      return NextResponse.json(
        { error: 'Título e cliente são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Validação adicional para tipo e tipoFaturamento
    if (!data.tipo) {
      return NextResponse.json(
        { error: 'O tipo da oportunidade (produto/serviço) é obrigatório' },
        { status: 400 }
      );
    }
    
    // Se for produto, tipoFaturamento é obrigatório
    if (data.tipo === 'produto' && !data.tipoFaturamento) {
      return NextResponse.json(
        { error: 'Para produtos, o tipo de faturamento é obrigatório' },
        { status: 400 }
      );
    }
    
    const novaOportunidade: Oportunidade = {
      id: `opp-${Date.now()}`,
      titulo: data.titulo,
      cliente: data.cliente,
      clienteId: data.clienteId || `client-${Date.now()}`,
      valor: data.valor || 'A definir',
      responsavel: data.responsavel || 'Não atribuído',
      responsavelId: data.responsavelId || '',
      prazo: data.prazo || 'Não definido',
      status: data.status || 'novo_lead',
      descricao: data.descricao || '',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      // Campos adicionais
      cnpj: data.cnpj,
      contatoNome: data.contatoNome,
      contatoTelefone: data.contatoTelefone,
      contatoEmail: data.contatoEmail,
      endereco: data.endereco,
      segmento: data.segmento,
      dataReuniao: data.dataReuniao,
      horaReuniao: data.horaReuniao,
      responsaveisIds: data.responsaveisIds,
      tipo: data.tipo,
      tipoFaturamento: data.tipoFaturamento,
    };
    
    oportunidades.push(novaOportunidade);
    await salvarOportunidades(oportunidades);
    
    return NextResponse.json(novaOportunidade, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar oportunidade:', error);
    return NextResponse.json(
      { error: 'Erro ao criar oportunidade' },
      { status: 500 }
    );
  }
}
