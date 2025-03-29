import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Diretório para armazenar arquivos
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documentos');

// POST - Upload de arquivo
export async function POST(request: NextRequest) {
  try {
    // Verificar se a requisição é do tipo multipart/form-data
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Requisição deve ser multipart/form-data' },
        { status: 400 }
      );
    }

    // Criar diretório de upload se não existir
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Processar o formulário
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Gerar um nome de arquivo único para evitar colisões
    const fileName = file.name;
    const fileExt = path.extname(fileName);
    const uniqueId = uuidv4();
    const uniqueFileName = `${uniqueId}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Obter os bytes do arquivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Salvar o arquivo
    await writeFile(filePath, buffer);

    // Calcular o tamanho do arquivo em bytes
    const fileSize = buffer.length;

    // Construir a URL pública do arquivo
    const fileUrl = `/uploads/documentos/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      file: {
        originalName: fileName,
        name: uniqueFileName,
        size: fileSize,
        url: fileUrl
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao fazer upload de arquivo:', error);
    return NextResponse.json(
      { error: 'Erro ao processar upload de arquivo' },
      { status: 500 }
    );
  }
}
