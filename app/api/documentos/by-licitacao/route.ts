import { NextRequest, NextResponse } from 'next/server';
import { supabase, crmonefactory } from '@/lib/supabase/client';

// GET - Buscar documentos por ID da licitação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const licitacaoId = searchParams.get('licitacaoId');
    
    if (!licitacaoId) {
      return NextResponse.json(
        { error: 'ID da licitação é obrigatório' },
        { status: 400 }
      );
    }
    
    // Buscar documentos da tabela documentos no schema crmonefactory
    const { data, error } = await crmonefactory
      .from('documentos')
      .select('*')
      .eq('licitacao_id', licitacaoId);
    
    if (error) {
      console.error('Erro ao buscar documentos:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar documentos no banco de dados' },
        { status: 500 }
      );
    }
    
    // Formatar os dados para o formato esperado pelo front-end
    const documentosFormatados = data.map((doc: any) => ({
      id: doc.id,
      nome: doc.nome,
      tipo: doc.categoria || 'Documento',
      url: doc.url,
      data: new Date(doc.data_criacao).toLocaleDateString('pt-BR'),
      tamanho: formatarTamanho(doc.tamanho || 0),
      licitacaoId: doc.licitacao_id,
      formato: doc.formato,
      arquivo: doc.arquivo
    }));
    
    return NextResponse.json(documentosFormatados);
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar documentos' },
      { status: 500 }
    );
  }
}

// Função para formatar o tamanho do arquivo de bytes para KB, MB, etc.
function formatarTamanho(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
