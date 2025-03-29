import { NextRequest, NextResponse } from 'next/server';
import { Cliente } from '@/types/comercial';

// Simulau00e7u00e3o de banco de dados em memu00f3ria
let clientes: Cliente[] = [
  {
    id: "c1",
    nome: "Prefeitura de Su00e3o Paulo",
    cnpj: "12.345.678/0001-01",
    contatoNome: "Jou00e3o Silva",
    contatoTelefone: "(11) 98765-4321",
    contatoEmail: "joao.silva@prefeitura.sp.gov.br",
    endereco: "Av. Paulista, 1000, Su00e3o Paulo - SP",
    segmento: "Governo Municipal",
    dataCadastro: "2023-01-10T10:00:00Z",
    ativo: true,
  },
  {
    id: "c2",
    nome: "Secretaria de Educau00e7u00e3o",
    cnpj: "23.456.789/0001-02",
    contatoNome: "Maria Oliveira",
    contatoTelefone: "(11) 97654-3210",
    contatoEmail: "maria.oliveira@educacao.gov.br",
    endereco: "Rua da Educau00e7u00e3o, 500, Su00e3o Paulo - SP",
    segmento: "Governo Estadual",
    dataCadastro: "2023-01-15T14:30:00Z",
    ativo: true,
  },
  {
    id: "c3",
    nome: "Hospital Municipal",
    cnpj: "34.567.890/0001-03",
    contatoNome: "Roberto Santos",
    contatoTelefone: "(11) 96543-2109",
    contatoEmail: "roberto.santos@hospital.gov.br",
    endereco: "Av. Sau00fade, 200, Su00e3o Paulo - SP",
    segmento: "Sau00fade",
    dataCadastro: "2023-02-05T09:15:00Z",
    ativo: true,
  },
  {
    id: "c4",
    nome: "Departamento de Transportes",
    cnpj: "45.678.901/0001-04",
    contatoNome: "Carlos Ferreira",
    contatoTelefone: "(11) 95432-1098",
    contatoEmail: "carlos.ferreira@transportes.gov.br",
    endereco: "Rua dos Transportes, 300, Su00e3o Paulo - SP",
    segmento: "Transporte",
    dataCadastro: "2023-02-20T11:45:00Z",
    ativo: true,
  },
  {
    id: "c5",
    nome: "Governo do Estado",
    cnpj: "56.789.012/0001-05",
    contatoNome: "Ana Pereira",
    contatoTelefone: "(11) 94321-0987",
    contatoEmail: "ana.pereira@governo.sp.gov.br",
    endereco: "Palau00e7o dos Bandeirantes, Su00e3o Paulo - SP",
    segmento: "Governo Estadual",
    dataCadastro: "2023-03-10T13:30:00Z",
    ativo: true,
  },
  {
    id: "c6",
    nome: "Prefeitura de Campinas",
    cnpj: "67.890.123/0001-06",
    contatoNome: "Pedro Almeida",
    contatoTelefone: "(19) 93210-9876",
    contatoEmail: "pedro.almeida@campinas.sp.gov.br",
    endereco: "Av. Anchieta, 200, Campinas - SP",
    segmento: "Governo Municipal",
    dataCadastro: "2023-03-25T10:00:00Z",
    ativo: true,
  },
  {
    id: "c7",
    nome: "Hospital Regional",
    cnpj: "78.901.234/0001-07",
    contatoNome: "Lu00facia Costa",
    contatoTelefone: "(11) 92109-8765",
    contatoEmail: "lucia.costa@hospitalregional.org.br",
    endereco: "Av. Regional, 500, Su00e3o Paulo - SP",
    segmento: "Sau00fade",
    dataCadastro: "2023-04-05T14:15:00Z",
    ativo: true,
  },
];

// GET - Listar todos os clientes ou filtrar
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Paru00e2metros de filtro
    const termo = searchParams.get('termo');
    const segmento = searchParams.get('segmento');
    const ativo = searchParams.get('ativo');
    
    let resultado = [...clientes];
    
    // Aplicar filtros
    if (termo) {
      const termoBusca = termo.toLowerCase();
      resultado = resultado.filter(
        (item) =>
          item.nome.toLowerCase().includes(termoBusca) ||
          item.cnpj.includes(termoBusca) ||
          item.contatoNome.toLowerCase().includes(termoBusca) ||
          item.contatoEmail.toLowerCase().includes(termoBusca)
      );
    }
    
    if (segmento && segmento !== 'todos') {
      resultado = resultado.filter((item) => item.segmento === segmento);
    }
    
    if (ativo !== null && ativo !== undefined) {
      const ativoBoolean = ativo === 'true';
      resultado = resultado.filter((item) => item.ativo === ativoBoolean);
    }
    
    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar clientes' },
      { status: 500 }
    );
  }
}

// POST - Criar novo cliente
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validau00e7u00e3o bu00e1sica
    if (!data.nome || !data.cnpj || !data.contatoNome || !data.contatoEmail) {
      return NextResponse.json(
        { error: 'Nome, CNPJ, nome de contato e email su00e3o obrigatu00f3rios' },
        { status: 400 }
      );
    }
    
    const novoCliente: Cliente = {
      id: `client-${Date.now()}`,
      nome: data.nome,
      cnpj: data.cnpj,
      contatoNome: data.contatoNome,
      contatoTelefone: data.contatoTelefone || '',
      contatoEmail: data.contatoEmail,
      endereco: data.endereco,
      segmento: data.segmento || 'Outros',
      dataCadastro: new Date().toISOString(),
      ativo: true,
    };
    
    clientes.push(novoCliente);
    
    return NextResponse.json(novoCliente, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao criar cliente' },
      { status: 500 }
    );
  }
}
