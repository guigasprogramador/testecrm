import { NextRequest, NextResponse } from 'next/server';
import { Licitacao, Documento } from '@/types/licitacoes';
import * as fs from 'fs';
import * as path from 'path';

// Path to our "database" JSON file
const dbPath = path.join(process.cwd(), 'data', 'licitacoes.json');

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
      // Import default data from the route module
      const routeModule = await import('../route');
      // @ts-ignore - We know this property exists
      const initLicitacoesCache = routeModule.initLicitacoesCache;
      if (typeof initLicitacoesCache === 'function') {
        const licitacoes = await initLicitacoesCache();
        return licitacoes;
      }
      return [];
    }
    
    // Read from file
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar licitações:', error);
    return [];
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
    
    // Atualizar o cache na rota principal, se possível
    try {
      const routeModule = await import('../route');
      // @ts-ignore - We know this property exists
      if (routeModule.updateLicitacoesCache && typeof routeModule.updateLicitacoesCache === 'function') {
        await routeModule.updateLicitacoesCache(licitacoes);
      }
    } catch (e) {
      console.error('Erro ao atualizar cache:', e);
    }
  } catch (error) {
    console.error('Erro ao salvar licitações:', error);
  }
}

// GET - Obter uma licitação específica pelo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const licitacoes = await carregarLicitacoes();
    
    const id = params.id;
    const licitacao = licitacoes.find(l => l.id === id);
    
    if (!licitacao) {
      return NextResponse.json(
        { error: 'Licitação não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(licitacao);
  } catch (error) {
    console.error('Erro ao buscar licitação:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar licitação' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar uma licitação completa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const licitacoes = await carregarLicitacoes();
    
    const id = params.id;
    const index = licitacoes.findIndex(l => l.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Licitação não encontrada' },
        { status: 404 }
      );
    }
    
    const data = await request.json();
    
    // Validação básica
    if (!data.titulo || !data.orgao) {
      return NextResponse.json(
        { error: 'Título e órgão são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Data atual para campo de auditoria
    const agora = new Date().toISOString();
    
    // Manter o ID original e a data de criação
    const licitacaoAtualizada: Licitacao = {
      ...data,
      id: id,
      dataCriacao: licitacoes[index].dataCriacao,
      dataAtualizacao: agora
    };
    
    // Atualizar a licitação no array
    licitacoes[index] = licitacaoAtualizada;
    
    // Salvar as alterações
    await salvarLicitacoes(licitacoes);
    
    return NextResponse.json(licitacaoAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar licitação:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar licitação' },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar parcialmente uma licitação
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const licitacoes = await carregarLicitacoes();
    
    const id = params.id;
    const index = licitacoes.findIndex(l => l.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Licitação não encontrada' },
        { status: 404 }
      );
    }
    
    const data = await request.json();
    const agora = new Date().toISOString();
    
    // Atualizar apenas os campos fornecidos
    const licitacaoAtualizada = {
      ...licitacoes[index],
      ...data,
      id, // Garantir que o ID não seja alterado
      dataCriacao: licitacoes[index].dataCriacao, // Manter a data de criação original
      dataAtualizacao: agora
    };
    
    licitacoes[index] = licitacaoAtualizada;
    
    // Salvar as alterações
    await salvarLicitacoes(licitacoes);
    
    return NextResponse.json(licitacaoAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar licitação:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar licitação' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir uma licitação
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const licitacoes = await carregarLicitacoes();
    
    const id = params.id;
    const index = licitacoes.findIndex(l => l.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Licitação não encontrada' },
        { status: 404 }
      );
    }
    
    // Remover a licitação do array
    licitacoes.splice(index, 1);
    
    // Salvar as alterações
    await salvarLicitacoes(licitacoes);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir licitação:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir licitação' },
      { status: 500 }
    );
  }
}
