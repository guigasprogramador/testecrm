"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, Calendar, User, Tag, Building, Search, FileType } from "lucide-react"
import { Input } from "@/components/ui/input"

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

interface VisualizadorDocumentoProps {
  documento: Documento | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VisualizadorDocumento({ documento, open, onOpenChange }: VisualizadorDocumentoProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Reset loading state when a new document is opened
    if (open) {
      setIsLoading(true)
    }
  }, [open, documento])

  if (!documento) return null

  // Determinar a URL de visualização com base no tipo de arquivo
  const getPreviewUrl = () => {
    // Simulação de URL para visualização - em um ambiente real, estas seriam URLs válidas para seus documentos
    if (documento.formato === "pdf") {
      return `https://docs.google.com/viewer?url=${encodeURIComponent("https://example.com/docs/" + documento.nome)}&embedded=true`
    } else if (
      documento.formato === "docx" ||
      documento.formato === "doc" ||
      documento.formato === "xlsx" ||
      documento.formato === "xls"
    ) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent("https://example.com/docs/" + documento.nome)}`
    }
    return null
  }

  const previewUrl = getPreviewUrl()

  // Função para obter a classe CSS para o badge de categoria
  const getCategoryBadgeClass = (categoriaId: string) => {
    switch (categoriaId) {
      case "projetos":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "contabeis":
        return "bg-green-100 text-green-800 border-green-300"
      case "societarios":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "juridicos":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "atestado_capacidade":
        return "bg-indigo-100 text-indigo-800 border-indigo-300"
      default:
        return ""
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[80vw] max-h-[95vh] p-5">
        <div className="overflow-auto h-full">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              <span className="truncate">{documento.nome}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Visualização</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
              </TabsList>

              <div className="mt-4">
                {activeTab === "preview" && (
                  <div className="border rounded-md h-[75vh] flex flex-col relative">
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                        <div className="text-center">
                          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Carregando documento...</p>
                        </div>
                      </div>
                    )}
                    
                    {previewUrl ? (
                      <iframe 
                        src={previewUrl} 
                        className="w-full h-full border-0 rounded-md" 
                        title={documento.nome}
                        onLoad={handleIframeLoad}
                        sandbox="allow-scripts allow-same-origin allow-forms"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted/20 p-4">
                        <div className="text-center">
                          <FileText className="h-12 md:h-16 w-12 md:w-16 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">Visualização não disponível para este tipo de arquivo</p>
                          <Button variant="outline" className="mt-4">
                            <Download className="h-4 w-4 mr-2" />
                            Baixar para visualizar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "details" && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium flex items-center">
                            <FileType className="h-4 w-4 mr-2 text-muted-foreground" />
                            Formato
                          </p>
                          <p>{documento.formato.toUpperCase()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            Tipo de Documento
                          </p>
                          <p>{documento.tipo}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium flex items-center">
                            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                            Categoria
                          </p>
                          <Badge variant="outline" className={getCategoryBadgeClass(documento.categoriaId)}>
                            {documento.categoria}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium flex items-center">
                            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                            Licitação
                          </p>
                          <p className="truncate">{documento.licitacao}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            Data de Upload
                          </p>
                          <p>{documento.dataUpload}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            Enviado por
                          </p>
                          <p>{documento.uploadPor}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Tamanho</p>
                          <p>{documento.tamanho}</p>
                        </div>
                      </div>

                      {documento.resumo && (
                        <div className="mt-4">
                          <p className="text-sm font-medium">Resumo</p>
                          <p className="text-sm mt-1">{documento.resumo}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {activeTab === "content" && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar no conteúdo..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Aqui você pode implementar a pesquisa no conteúdo e exibir os resultados */}
                    <p className="text-center text-muted-foreground py-8">
                      A busca no conteúdo não está disponível para este documento
                    </p>
                  </div>
                )}
              </div>
            </Tabs>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
