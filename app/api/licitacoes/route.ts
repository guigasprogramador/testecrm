import { NextRequest, NextResponse } from 'next/server';
import { Licitacao, LicitacaoStatus, LicitacaoFiltros } from '@/types/licitacoes';
import * as fs from 'fs';
import * as path from 'path';

// Path to our "database" JSON file
const dbPath = path.join(process.cwd(), 'data', 'licitacoes.json');

// Dados iniciais para o "banco de dados"
const dadosLicitacoesIniciais: Licitacao[] = [
  {
    id: "1",
    titulo: "Aquisição de Equipamentos de Informática",
    orgao: "Prefeitura Municipal",
    orgaoId: "org1",
    status: "analise_interna",
    dataAbertura: "2023-07-15",
    dataPublicacao: "2023-06-30",
    valorEstimado: 250000,
    valorProposta: 248000,
    modalidade: "pregao_eletronico",
    objeto: "Aquisição de computadores e periféricos para modernização do parque tecnológico",
    edital: "PE-001/2023",
    numeroEdital: "001/2023",
    responsavel: "Ana Silva",
    responsavelId: "resp1",
    prazo: "15/07/2023",
    urlLicitacao: "https://transparencia.prefeitura.gov.br/licitacoes/001-2023",
    urlEdital: "https://transparencia.prefeitura.gov.br/editais/001-2023.pdf",
    descricao: "Aquisição de computadores, monitores, impressoras e outros equipamentos para renovação do parque tecnológico municipal",
    formaPagamento: "30 dias após entrega",
    obsFinanceiras: "Pagamento mediante empenho",
    tipo: "produto",
    tipoFaturamento: "direto",
    margemLucro: 15,
    contatoNome: "Roberto Almeida",
    contatoEmail: "roberto.almeida@prefeitura.gov.br",
    contatoTelefone: "(11) 3333-4444",
    dataJulgamento: "2023-07-20",
    dataCriacao: "2023-06-15T10:30:00Z",
    dataAtualizacao: "2023-06-15T10:30:00Z",
    documentos: [
      { id: "doc1", nome: "Edital", url: "/docs/edital-001-2023.pdf", tipo: "edital", dataCriacao: "2023-06-15T10:30:00Z", dataAtualizacao: "2023-06-15T10:30:00Z", licitacaoId: "1" },
      { id: "doc2", nome: "Termo de Referência", url: "/docs/tr-001-2023.pdf", tipo: "termo_referencia", dataCriacao: "2023-06-15T10:30:00Z", dataAtualizacao: "2023-06-15T10:30:00Z", licitacaoId: "1" }
    ]
  },
  {
    id: "2",
    titulo: "Contratação de Serviços de Desenvolvimento de Software",
    orgao: "Secretaria de Tecnologia",
    orgaoId: "org2",
    status: "aguardando_pregao",
    dataAbertura: "2023-08-20",
    dataPublicacao: "2023-07-25",
    valorEstimado: 450000,
    valorProposta: 430000,
    modalidade: "pregao_eletronico",
    objeto: "Desenvolvimento de sistema integrado de gestão pública",
    edital: "PE-002/2023",
    numeroEdital: "002/2023",
    responsavel: "Carlos Oliveira",
    responsavelId: "resp2",
    prazo: "20/08/2023",
    urlLicitacao: "https://transparencia.secretaria.gov.br/licitacoes/002-2023",
    urlEdital: "https://transparencia.secretaria.gov.br/editais/002-2023.pdf",
    descricao: "Contratação de empresa especializada em desenvolvimento de software para criação de sistema integrado de gestão pública",
    formaPagamento: "Mensal conforme cronograma de entrega",
    obsFinanceiras: "Pagamento mediante aceite de entrega das fases",
    tipo: "servico",
    margemLucro: 22,
    contatoNome: "Mariana Santos",
    contatoEmail: "mariana.santos@secretaria.gov.br",
    contatoTelefone: "(11) 4444-5555",
    dataJulgamento: "2023-08-25",
    dataCriacao: "2023-07-10T14:30:00Z",
    dataAtualizacao: "2023-07-20T09:45:00Z",
    documentos: [
      { id: "doc3", nome: "Edital", url: "/docs/edital-002-2023.pdf", tipo: "edital", dataCriacao: "2023-07-10T14:30:00Z", dataAtualizacao: "2023-07-10T14:30:00Z", licitacaoId: "2" },
      { id: "doc4", nome: "Termo de Referência", url: "/docs/tr-002-2023.pdf", tipo: "termo_referencia", dataCriacao: "2023-07-10T14:30:00Z", dataAtualizacao: "2023-07-10T14:30:00Z", licitacaoId: "2" }
    ]
  },
  {
    id: "3",
    titulo: "Fornecimento de Licenças de Software",
    orgao: "Ministério da Educação",
    orgaoId: "org3",
    status: "vencida",
    dataAbertura: "2023-06-10",
    dataPublicacao: "2023-05-20",
    valorEstimado: 320000,
    valorProposta: 305000,
    modalidade: "pregao_eletronico",
    objeto: "Licenças de software para instituições de ensino",
    edital: "PE-015/2023",
    numeroEdital: "015/2023",
    responsavel: "Pedro Santos",
    responsavelId: "resp3",
    prazo: "10/06/2023",
    urlLicitacao: "https://transparencia.mec.gov.br/licitacoes/015-2023",
    urlEdital: "https://transparencia.mec.gov.br/editais/015-2023.pdf",
    descricao: "Aquisição de licenças de software para uso em laboratórios de instituições de ensino público",
    formaPagamento: "30 dias após entrega das licenças",
    obsFinanceiras: "Pagamento único após entrega e ativação das licenças",
    tipo: "produto",
    tipoFaturamento: "distribuidor",
    margemLucro: 8,
    contatoNome: "Carla Menezes",
    contatoEmail: "carla.menezes@mec.gov.br",
    contatoTelefone: "(61) 3333-2222",
    dataJulgamento: "2023-06-15",
    dataCriacao: "2023-05-05T11:20:00Z",
    dataAtualizacao: "2023-06-20T16:15:00Z",
    documentos: [
      { id: "doc5", nome: "Edital", url: "/docs/edital-015-2023.pdf", tipo: "edital", dataCriacao: "2023-05-05T11:20:00Z", dataAtualizacao: "2023-05-05T11:20:00Z", licitacaoId: "3" }
    ]
  },
  {
    id: "4",
    titulo: "Implementação de Sistema de Gestão Hospitalar",
    orgao: "Secretaria de Saúde",
    orgaoId: "org4",
    status: "envio_documentos",
    dataAbertura: "2023-09-05",
    dataPublicacao: "2023-08-15",
    valorEstimado: 780000,
    valorProposta: 760000,
    modalidade: "pregao_eletronico",
    objeto: "Sistema completo para gestão hospitalar e prontuário eletrônico",
    edital: "PE-023/2023",
    numeroEdital: "023/2023",
    responsavel: "Maria Souza",
    responsavelId: "resp4",
    prazo: "05/09/2023",
    urlLicitacao: "https://transparencia.saude.gov.br/licitacoes/023-2023",
    urlEdital: "https://transparencia.saude.gov.br/editais/023-2023.pdf",
    descricao: "Contratação de empresa especializada para implementação de sistema de gestão hospitalar e prontuário eletrônico nos hospitais da rede pública",
    formaPagamento: "Conforme cronograma de implementação",
    obsFinanceiras: "Pagamento em parcelas conforme entregas",
    tipo: "servico",
    margemLucro: 18,
    contatoNome: "Juliana Freitas",
    contatoEmail: "juliana.freitas@saude.gov.br",
    contatoTelefone: "(11) 5555-6666",
    dataJulgamento: "2023-09-10",
    dataCriacao: "2023-08-01T09:10:00Z",
    dataAtualizacao: "2023-09-06T15:30:00Z",
    documentos: [
      { id: "doc6", nome: "Edital", url: "/docs/edital-023-2023.pdf", tipo: "edital", dataCriacao: "2023-08-01T09:10:00Z", dataAtualizacao: "2023-08-01T09:10:00Z", licitacaoId: "4" },
      { id: "doc7", nome: "Termo de Referência", url: "/docs/tr-023-2023.pdf", tipo: "termo_referencia", dataCriacao: "2023-08-01T09:10:00Z", dataAtualizacao: "2023-08-01T09:10:00Z", licitacaoId: "4" },
      { id: "doc8", nome: "Modelo de Proposta", url: "/docs/modelo-proposta-023-2023.docx", tipo: "modelo_proposta", dataCriacao: "2023-08-01T09:10:00Z", dataAtualizacao: "2023-08-01T09:10:00Z", licitacaoId: "4" }
    ]
  },
  {
    id: "5",
    titulo: "Aquisição de Servidores e Storage",
    orgao: "Tribunal de Justiça",
    orgaoId: "org5",
    status: "nao_vencida",
    dataAbertura: "2023-05-22",
    dataPublicacao: "2023-04-30",
    valorEstimado: 950000,
    valorProposta: 930000,
    modalidade: "pregao_eletronico",
    objeto: "Equipamentos para datacenter principal e contingência",
    edital: "PE-008/2023",
    numeroEdital: "008/2023",
    responsavel: "Ana Silva",
    responsavelId: "resp1",
    prazo: "22/05/2023",
    urlLicitacao: "https://transparencia.tj.gov.br/licitacoes/008-2023",
    urlEdital: "https://transparencia.tj.gov.br/editais/008-2023.pdf",
    descricao: "Aquisição de servidores, storage e equipamentos de rede para atualização do datacenter principal e implantação de site de contingência",
    formaPagamento: "30 dias após instalação e aceite",
    obsFinanceiras: "Pagamento em duas parcelas: 70% na entrega e 30% após instalação",
    tipo: "produto",
    tipoFaturamento: "direto",
    margemLucro: 10,
    contatoNome: "Ricardo Mendes",
    contatoEmail: "ricardo.mendes@tj.gov.br",
    contatoTelefone: "(11) 4444-7777",
    dataJulgamento: "2023-05-27",
    dataCriacao: "2023-04-15T13:45:00Z",
    dataAtualizacao: "2023-05-28T10:20:00Z",
    documentos: [
      { id: "doc9", nome: "Edital", url: "/docs/edital-008-2023.pdf", tipo: "edital", dataCriacao: "2023-04-15T13:45:00Z", dataAtualizacao: "2023-04-15T13:45:00Z", licitacaoId: "5" },
      { id: "doc10", nome: "Termo de Referência", url: "/docs/tr-008-2023.pdf", tipo: "termo_referencia", dataCriacao: "2023-04-15T13:45:00Z", dataAtualizacao: "2023-04-15T13:45:00Z", licitacaoId: "5" }
    ]
  }
];

// Função para carregar os dados do arquivo JSON
async function carregarLicitacoes(): Promise<Licitacao[]> {
  try {
    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create file if it doesn't exist
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(dadosLicitacoesIniciais, null, 2));
      return dadosLicitacoesIniciais;
    }
    
    // Read from file
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar licitações:', error);
    return dadosLicitacoesIniciais;
  }
}

// Função para salvar os dados no arquivo JSON
async function salvarLicitacoes(licitacoes: Licitacao[]): Promise<void> {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(licitacoes, null, 2));
  } catch (error) {
    console.error('Erro ao salvar licitações:', error);
  }
}

// Função para calcular estatísticas das licitações
function calcularEstatisticas(licitacoes: Licitacao[]) {
  const total = licitacoes.length;
  const ativas = licitacoes.filter(l => 
    ["analise_interna", "aguardando_pregao", "envio_documentos", "assinaturas"].includes(l.status as string)
  ).length;
  const vencidas = licitacoes.filter(l => l.status === "vencida").length;
  const naoVencidas = licitacoes.filter(l => l.status === "nao_vencida").length;
  
  // Calcular o valor total das propostas
  const valorTotal = licitacoes.reduce((total, licitacao) => {
    return total + (licitacao.valorProposta || 0);
  }, 0);
  
  // Calcular a taxa de sucesso (licitações vencidas / total de licitações finalizadas)
  const licitacoesFinalizadas = vencidas + naoVencidas;
  const taxaSucesso = licitacoesFinalizadas > 0 
    ? Math.round((vencidas / licitacoesFinalizadas) * 100) 
    : 0;
  
  return {
    total,
    ativas,
    vencidas,
    naoVencidas,
    valorTotal,
    taxaSucesso
  };
}

// Expor as licitações para outros módulos
let licitacoesCache: Licitacao[] = [];

// Inicializar o cache no primeiro acesso
export async function initLicitacoesCache() {
  if (licitacoesCache.length === 0) {
    licitacoesCache = await carregarLicitacoes();
  }
  return licitacoesCache;
}

// Atualizar o cache
export async function updateLicitacoesCache(licitacoes: Licitacao[]) {
  licitacoesCache = [...licitacoes];
}

// GET - Listar todas as licitações ou filtrar
export async function GET(request: NextRequest) {
  try {
    const licitacoes = await initLicitacoesCache();
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de filtro
    const status = searchParams.get('status');
    const orgao = searchParams.get('orgao');
    const responsavel = searchParams.get('responsavel');
    const modalidade = searchParams.get('modalidade');
    const termo = searchParams.get('termo')?.toLowerCase();
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const valorMin = searchParams.get('valorMin') ? parseFloat(searchParams.get('valorMin')!) : null;
    const valorMax = searchParams.get('valorMax') ? parseFloat(searchParams.get('valorMax')!) : null;
    
    // Parâmetro para estatísticas
    const estatisticas = searchParams.get('estatisticas') === 'true';
    
    // Se solicitado estatísticas, retornar apenas as estatísticas
    if (estatisticas) {
      return NextResponse.json(calcularEstatisticas(licitacoes));
    }
    
    // Aplicar filtros se houver
    let licitacoesFiltradas = [...licitacoes];
    
    if (status) {
      licitacoesFiltradas = licitacoesFiltradas.filter(l => l.status === status);
    }
    
    if (orgao) {
      licitacoesFiltradas = licitacoesFiltradas.filter(l => l.orgao === orgao);
    }
    
    if (responsavel) {
      licitacoesFiltradas = licitacoesFiltradas.filter(l => l.responsavel === responsavel);
    }
    
    if (modalidade) {
      licitacoesFiltradas = licitacoesFiltradas.filter(l => l.modalidade === modalidade);
    }
    
    if (termo) {
      licitacoesFiltradas = licitacoesFiltradas.filter(l => 
        l.titulo.toLowerCase().includes(termo) || 
        l.objeto?.toLowerCase().includes(termo) || 
        l.descricao?.toLowerCase().includes(termo)
      );
    }
    
    if (dataInicio) {
      const dataInicioObj = new Date(dataInicio);
      licitacoesFiltradas = licitacoesFiltradas.filter(l => 
        l.dataPublicacao ? new Date(l.dataPublicacao) >= dataInicioObj : false
      );
    }
    
    if (dataFim) {
      const dataFimObj = new Date(dataFim);
      licitacoesFiltradas = licitacoesFiltradas.filter(l => 
        l.dataPublicacao ? new Date(l.dataPublicacao) <= dataFimObj : false
      );
    }
    
    if (valorMin !== null) {
      licitacoesFiltradas = licitacoesFiltradas.filter(l => 
        (l.valorEstimado || 0) >= valorMin
      );
    }
    
    if (valorMax !== null) {
      licitacoesFiltradas = licitacoesFiltradas.filter(l => 
        (l.valorEstimado || 0) <= valorMax
      );
    }
    
    return NextResponse.json(licitacoesFiltradas);
  } catch (error) {
    console.error('Erro ao listar licitações:', error);
    return NextResponse.json(
      { error: 'Erro ao listar licitações' },
      { status: 500 }
    );
  }
}

// POST - Criar nova licitação
export async function POST(request: NextRequest) {
  try {
    const licitacoes = await initLicitacoesCache();
    const data = await request.json();
    
    // Validar dados básicos
    if (!data.titulo || !data.orgao) {
      return NextResponse.json(
        { error: 'Título e órgão são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Gerar ID único (em um caso real, isso seria feito pelo banco de dados)
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Timestamp para campos de auditoria
    const agora = new Date().toISOString();
    
    // Criar nova licitação
    const novaLicitacao: Licitacao = {
      ...data,
      id,
      documentos: data.documentos || [],
      dataCriacao: agora,
      dataAtualizacao: agora,
      // Definir status padrão se não fornecido
      status: data.status || 'analise_interna'
    };
    
    // Adicionar ao "banco de dados"
    licitacoes.push(novaLicitacao);
    
    // Salvar alterações
    await salvarLicitacoes(licitacoes);
    await updateLicitacoesCache(licitacoes); // Atualizar o cache
    
    return NextResponse.json(novaLicitacao, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar licitação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar licitação' },
      { status: 500 }
    );
  }
}
