import { NextRequest, NextResponse } from 'next/server';
import { Cliente } from '@/types/comercial';

// Simulau00e7u00e3o de banco de dados em memu00f3ria (mesma do arquivo anterior)
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
  // Mesmos dados do arquivo anterior
];

// GET - Obter um cliente especu00edfico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const cliente = clientes.find((c) => c.id === id);
    
    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente nu00e3o encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cliente' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    const index = clientes.findIndex((c) => c.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Cliente nu00e3o encontrado' },
        { status: 404 }
      );
    }
    
    // Atualizar cliente
    const clienteAtualizado = {
      ...clientes[index],
      ...data,
    };
    
    clientes[index] = clienteAtualizado;
    
    return NextResponse.json(clienteAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar cliente' },
      { status: 500 }
    );
  }
}

// DELETE - Desativar um cliente (nu00e3o excluir permanentemente)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const index = clientes.findIndex((c) => c.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Cliente nu00e3o encontrado' },
        { status: 404 }
      );
    }
    
    // Desativar cliente em vez de excluir
    clientes[index] = {
      ...clientes[index],
      ativo: false,
    };
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao desativar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao desativar cliente' },
      { status: 500 }
    );
  }
}
