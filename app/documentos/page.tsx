"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, FileText } from "lucide-react"
import { NovoDocumento } from "@/components/documentos/novo-documento"
import { VisualizadorDocumento } from "@/components/documentos/visualizador-documento"
import { FiltroDocumentos, DocumentoFiltros } from "@/components/documentos/filtro-documentos"

interface Documento {
  id: string
  nome: string
  tipo: string
  formato: string
  categoria: string
  categoriaId: string
  licitacao: string
  licitacaoId: string
  dataUpload: string
  tamanho: string
  uploadPor: string
  resumo?: string
  url?: string
}

// Dados de exemplo para documentos
const documentosData: Documento[] = [
  {
    id: "1",
    nome: "Edital_Pregao_123.pdf",
    tipo: "Edital",
    formato: "pdf",
    categoria: "Jurídicos",
    categoriaId: "juridicos",
    licitacao: "Pregão Eletrônico 123/2023",
    licitacaoId: "pregao_123",
    dataUpload: "10/01/2023",
    tamanho: "2.5 MB",
    uploadPor: "Ana Silva",
    resumo: "Edital completo do Pregão Eletrônico 123/2023 para aquisição de software de gestão municipal.",
  },
  {
    id: "2",
    nome: "Proposta_Comercial.docx",
    tipo: "Proposta",
    formato: "docx",
    categoria: "Projetos",
    categoriaId: "projetos",
    licitacao: "Concorrência 45/2023",
    licitacaoId: "concorrencia_45",
    dataUpload: "15/01/2023",
    tamanho: "1.8 MB",
    uploadPor: "Carlos Oliveira",
    resumo: "Proposta comercial detalhada para a Concorrência 45/2023, incluindo valores, prazos e condições.",
  },
  {
    id: "3",
    nome: "Certidao_Negativa.pdf",
    tipo: "Certidão",
    formato: "pdf",
    categoria: "Contábeis",
    categoriaId: "contabeis",
    licitacao: "Tomada de Preços 78/2023",
    licitacaoId: "tomada_78",
    dataUpload: "20/01/2023",
    tamanho: "0.5 MB",
    uploadPor: "Maria Souza",
    resumo: "Certidão negativa de débitos municipais válida até 20/07/2023.",
  },
  {
    id: "4",
    nome: "Contrato_Assinado.pdf",
    tipo: "Contrato",
    formato: "pdf",
    categoria: "Jurídicos",
    categoriaId: "juridicos",
    licitacao: "Pregão Presencial 56/2023",
    licitacaoId: "pregao_56",
    dataUpload: "25/01/2023",
    tamanho: "3.2 MB",
    uploadPor: "Pedro Santos",
    resumo: "Contrato assinado referente ao Pregão Presencial 56/2023 com vigência de 12 meses.",
  },
  {
    id: "5",
    nome: "Planilha_Orcamentaria.xlsx",
    tipo: "Planilha",
    formato: "xlsx",
    categoria: "Contábeis",
    categoriaId: "contabeis",
    licitacao: "Concorrência 92/2023",
    licitacaoId: "concorrencia_92",
    dataUpload: "30/01/2023",
    tamanho: "1.1 MB",
    uploadPor: "Ana Silva",
    resumo: "Planilha orçamentária detalhada com todos os itens e valores para a Concorrência 92/2023.",
  },
  {
    id: "6",
    nome: "Estatuto_Social.pdf",
    tipo: "Documento Legal",
    formato: "pdf",
    categoria: "Jurídicos",
    categoriaId: "juridicos",
    licitacao: "Pregão Eletrônico 123/2023",
    licitacaoId: "pregao_123",
    dataUpload: "05/02/2023",
    tamanho: "1.7 MB",
    uploadPor: "Carlos Oliveira",
    resumo: "Estatuto social da empresa atualizado conforme última assembleia.",
  },
  {
    id: "7",
    nome: "Apresentacao_Projeto.pptx",
    tipo: "Apresentação",
    formato: "pptx",
    categoria: "Projetos",
    categoriaId: "projetos",
    licitacao: "Tomada de Preços 78/2023",
    licitacaoId: "tomada_78",
    dataUpload: "10/02/2023",
    tamanho: "4.3 MB",
    uploadPor: "Maria Souza",
    resumo: "Apresentação detalhada do projeto técnico para a Tomada de Preços 78/2023.",
  },
  {
    id: "8",
    nome: "Relatorio_Tecnico.pdf",
    tipo: "Relatório",
    formato: "pdf",
    categoria: "Técnicos",
    categoriaId: "tecnicos",
    licitacao: "Concorrência 45/2023",
    licitacaoId: "concorrencia_45",
    dataUpload: "15/02/2023",
    tamanho: "2.8 MB",
    uploadPor: "Pedro Santos",
    resumo: "Relatório técnico detalhado sobre a solução proposta para a Concorrência 45/2023.",
  },
]

// Função para obter a classe CSS para o badge de categoria
function getCategoryBadgeClass(categoriaId: string): string {
  const categoryColors: Record<string, string> = {
    juridicos: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    contabeis: "bg-green-100 text-green-800 hover:bg-green-200",
    projetos: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    tecnicos: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    comerciais: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    administrativos: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  }
  return categoryColors[categoriaId] || "bg-gray-100 text-gray-800 hover:bg-gray-200"
}

export default function DocumentosPage() {
  // Estatísticas - valores fixos para corresponder à imagem
  const totalDocumentos = 38
  const vencemEm30Dias = 46

  const [filteredDocumentos, setFilteredDocumentos] = useState<Documento[]>(documentosData)

  // Estado para o visualizador de documento
  const [selectedDocumento, setSelectedDocumento] = useState<Documento | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  // Extrair tipos de documentos únicos
  const tiposDocumentos = Array.from(new Set(documentosData.map(doc => doc.tipo)))

  // Extrair categorias únicas
  const categorias = Array.from(
    new Set(documentosData.map(doc => ({ id: doc.categoriaId, nome: doc.categoria })))
  ).reduce((acc: { id: string; nome: string }[], current) => {
    if (!acc.some(item => item.id === current.id)) {
      acc.push(current)
    }
    return acc
  }, [])

  // Extrair licitações únicas
  const licitacoes = Array.from(
    new Set(documentosData.map(doc => ({ id: doc.licitacaoId, nome: doc.licitacao })))
  ).reduce((acc: { id: string; nome: string }[], current) => {
    if (!acc.some(item => item.id === current.id)) {
      acc.push(current)
    }
    return acc
  }, [])

  // Função para filtrar documentos
  const filtrarDocumentos = (filtros: DocumentoFiltros) => {
    const documentosFiltrados = documentosData.filter(doc => {
      // Filtro por termo de busca
      if (filtros.termo && !doc.nome.toLowerCase().includes(filtros.termo.toLowerCase()) && 
          !(doc.resumo?.toLowerCase().includes(filtros.termo.toLowerCase()))) {
        return false
      }

      // Filtro por tipo
      if (filtros.tipo !== "todos" && doc.tipo !== filtros.tipo) {
        return false
      }

      // Filtro por categoria
      if (filtros.categoria !== "todos" && doc.categoriaId !== filtros.categoria) {
        return false
      }

      // Filtro por licitação
      if (filtros.licitacao !== "todos" && doc.licitacaoId !== filtros.licitacao) {
        return false
      }

      // Filtro por formato
      if (filtros.formato !== "todos" && doc.formato !== filtros.formato) {
        return false
      }

      // Filtro por data de início
      if (filtros.dataInicio) {
        const dataDoc = new Date(doc.dataUpload.split('/').reverse().join('-'))
        if (dataDoc < filtros.dataInicio) {
          return false
        }
      }

      // Filtro por data de fim
      if (filtros.dataFim) {
        const dataDoc = new Date(doc.dataUpload.split('/').reverse().join('-'))
        if (dataDoc > filtros.dataFim) {
          return false
        }
      }

      return true
    })

    setFilteredDocumentos(documentosFiltrados)
  }

  // Função para abrir o visualizador de documento
  const handleViewDocument = (documento: Documento) => {
    setSelectedDocumento(documento)
    setIsViewerOpen(true)
  }

  return (
    <div className="p-4 md:p-6 overflow-hidden">
      <h1 className="text-2xl font-bold mb-6">Documentos</h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">{totalDocumentos}</div>
            <div className="text-sm text-muted-foreground">Documentos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">{vencemEm30Dias}</div>
            <div className="text-sm text-muted-foreground">Vencem em 30dias</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e botão de novo documento */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Lista de Documentos</h2>
        <div className="flex items-center gap-2">
          <FiltroDocumentos 
            onFilterChange={filtrarDocumentos}
            tiposDocumentos={tiposDocumentos}
            categorias={categorias}
            licitacoes={licitacoes}
          />
          <NovoDocumento
            onDocumentoAdded={(novoDocumento) => {
              // Aqui você pode implementar a lógica para adicionar o documento à lista
              console.log("Novo documento adicionado:", novoDocumento)
            }}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Gerenciamento de todos os documentos cadastrados</p>

      {/* Lista de documentos */}
      <div className="bg-white rounded-md border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30 text-sm">
                <th className="text-left p-3 font-medium">Nome</th>
                <th className="text-left p-3 font-medium">Tipo</th>
                <th className="text-left p-3 font-medium">Categoria</th>
                <th className="text-left p-3 font-medium">Licitação</th>
                <th className="text-left p-3 font-medium">Data de Upload</th>
                <th className="text-left p-3 font-medium">Tamanho</th>
                <th className="text-left p-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocumentos.length > 0 ? (
                filteredDocumentos.map((documento) => (
                  <tr
                    key={documento.id}
                    className="border-b hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => handleViewDocument(documento)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        {documento.nome}
                      </div>
                    </td>
                    <td className="p-3">{documento.tipo}</td>
                    <td className="p-3">
                      <Badge variant="outline" className={`text-xs py-0.5 px-2 ${getCategoryBadgeClass(documento.categoriaId)}`}>
                        {documento.categoria}
                      </Badge>
                    </td>
                    <td className="p-3">{documento.licitacao}</td>
                    <td className="p-3">{documento.dataUpload}</td>
                    <td className="p-3">{documento.tamanho}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewDocument(documento)
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground">
                    Nenhum documento encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualizador de documento */}
      <VisualizadorDocumento documento={selectedDocumento} open={isViewerOpen} onOpenChange={setIsViewerOpen} />
    </div>
  )
}
