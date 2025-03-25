"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  Calendar,
  Edit,
  Save,
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  LinkIcon,
  DollarSign,
  User,
  ArrowRight,
  AlertTriangle,
  BadgeDollarSign,
  Plus,
} from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Licitacao {
  id: string
  titulo: string
  orgao: string
  status: string
  dataAbertura: string
  valorEstimado: number
  modalidade: string
  objeto: string
  edital: string
  responsavel: string
  documentos?: { nome: string; url: string }[]
  prazo?: string
  valor?: string
  data_publicacao?: string
  data_abertura?: string
  url_edital?: string
  descricao?: string
  forma_pagamento?: string
  obs_financeiras?: string
}

export type { Licitacao }

interface DetalhesLicitacaoProps {
  licitacao: Licitacao | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus?: (id: string, status: string) => void
  onOrgaoClick?: (orgaoNome: string) => void
  onLicitacaoUpdate?: (licitacao: Licitacao) => void
  onLicitacaoDelete?: (licitacao: Licitacao) => void
}

const statusColors: Record<string, string> = {
  analise_interna: "bg-blue-100 text-blue-800 border-blue-300",
  aguardando_pregao: "bg-purple-100 text-purple-800 border-purple-300",
  vencida: "bg-green-100 text-green-800 border-green-300",
  nao_vencida: "bg-red-100 text-red-800 border-red-300",
  envio_documentos: "bg-yellow-100 text-yellow-800 border-yellow-300",
  assinaturas: "bg-orange-100 text-orange-800 border-orange-300",
  concluida: "bg-emerald-100 text-emerald-800 border-emerald-300",
}

const statusLabels: Record<string, string> = {
  analise_interna: "Análise Interna",
  aguardando_pregao: "Aguardando Pregão",
  vencida: "Vencida",
  nao_vencida: "Não Vencida",
  envio_documentos: "Envio de Documentos",
  assinaturas: "Assinaturas",
  concluida: "Concluída",
}

const flowSteps = [
  { id: "analise_interna", label: "Análise Interna" },
  { id: "aguardando_pregao", label: "Aguardando Pregão" },
  { id: "envio_documentos", label: "Envio de Documentos" },
  { id: "assinaturas", label: "Assinaturas" },
  { id: "vencida", label: "Vencida" },
  { id: "nao_vencida", label: "Não Vencida" },
  { id: "concluida", label: "Concluída" },
]

export function DetalhesLicitacao({
  licitacao,
  open,
  onOpenChange,
  onUpdateStatus,
  onOrgaoClick,
  onLicitacaoUpdate,
  onLicitacaoDelete,
}: DetalhesLicitacaoProps) {
  const [activeTab, setActiveTab] = useState("resumo")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Licitacao>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const servicosOferecidos = [
    {
      id: 1,
      nome: "Sistema de Gestão Municipal",
      descricao: "Software completo para gestão administrativa municipal",
      valor: "R$ 280.000,00",
    },
    {
      id: 2,
      nome: "Módulo de Recursos Humanos",
      descricao: "Gestão de funcionários, folha de pagamento e benefícios",
      valor: "R$ 85.000,00",
    },
    {
      id: 3,
      nome: "Módulo Financeiro",
      descricao: "Controle financeiro, orçamentário e contábil",
      valor: "R$ 105.000,00",
    },
  ]

  const documentos = [
    {
      id: 1,
      nome: "Edital_Pregao_123.pdf",
      tipo: "Edital",
      data: "10/05/2023",
      tamanho: "2.5 MB",
    },
    {
      id: 2,
      nome: "Proposta_Comercial.pdf",
      tipo: "Proposta",
      data: "15/05/2023",
      tamanho: "1.8 MB",
    },
    {
      id: 3,
      nome: "Documentacao_Tecnica.pdf",
      tipo: "Documentação",
      data: "18/05/2023",
      tamanho: "3.2 MB",
    },
  ]

  // Reset active tab when opening the sheet
  useEffect(() => {
    if (open) {
      setActiveTab("resumo")
      setIsEditing(false)
    }
  }, [open])

  useEffect(() => {
    if (licitacao) {
      setFormData({ ...licitacao })
    }
  }, [licitacao])

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    if (onLicitacaoUpdate && formData) {
      onLicitacaoUpdate(formData as Licitacao)
      toast.success("Licitação atualizada com sucesso")
    } else {
      console.log("Salvando dados:", formData)
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (onLicitacaoDelete && licitacao) {
      onLicitacaoDelete(licitacao)
      setDeleteDialogOpen(false)
      onOpenChange(false)
      toast.success("Licitação excluída com sucesso")
    }
  }

  const atualizarStatus = (novoStatus: string) => {
    if (licitacao && onUpdateStatus) {
      onUpdateStatus(licitacao.id, novoStatus)
    }

    setFormData((prev) => ({
      ...prev,
      status: novoStatus,
    }))
    console.log(`Status atualizado para: ${novoStatus}`)
  }

  if (!licitacao) {
    return (
      <Sheet key="empty-licitacao-sheet" open={false} onOpenChange={() => {}}>
        <SheetContent className="w-full md:max-w-xl lg:max-w-2xl overflow-y-auto">
          <div></div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet key={`licitacao-sheet-${licitacao?.id || "empty"}`} open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:max-w-xl lg:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">{formData.titulo || "Licitação"}</SheetTitle>
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (onOrgaoClick && formData.orgao) {
                    // Adicionar um pequeno atraso para evitar problemas de reconciliação
                    setTimeout(() => {
                      onOrgaoClick(formData.orgao || "")
                    }, 10)
                  }
                }}
              >
                <Building2 className="w-4 h-4 mr-1" />
                {formData.orgao}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className={statusColors[formData.status || "analise_interna"]}>
              {statusLabels[formData.status || "analise_interna"]}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Prazo: {formData.prazo}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {formData.valor}
            </Badge>
          </div>
          <div className="flex justify-end mt-4">
            {isEditing ? (
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            )}
            <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive" className="gap-2">
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="resumo" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="valores">Valores</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Informações Básicas</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Modalidade</Label>
                      {isEditing ? (
                        <Select
                          value={formData.modalidade}
                          onValueChange={(value) => handleFieldChange("modalidade", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a modalidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pregao_eletronico">Pregão Eletrônico</SelectItem>
                            <SelectItem value="pregao_presencial">Pregão Presencial</SelectItem>
                            <SelectItem value="tomada_precos">Tomada de Preços</SelectItem>
                            <SelectItem value="concorrencia">Concorrência</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm mt-1">Pregão Eletrônico</p>
                      )}
                    </div>

                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edital">Número do Edital</Label>
                          <Input
                            id="edital"
                            value={formData.edital || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, edital: e.target.value })
                            }
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dataAbertura">Data de Abertura</Label>
                          <Input
                            id="dataAbertura"
                            type="date"
                            value={formData.dataAbertura || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, dataAbertura: e.target.value })
                            }
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editalUrl">URL do Edital</Label>
                          <Input
                            id="editalUrl"
                            value={formData.edital || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, edital: e.target.value })
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="objeto">Objeto</Label>
                        <Textarea
                          id="objeto"
                          value={formData.objeto || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, objeto: e.target.value })
                          }
                          className="min-h-[100px]"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Datas Importantes</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Data de Publicação</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={formData.data_publicacao}
                          onChange={(e) => handleFieldChange("data_publicacao", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm mt-1">{formData.data_publicacao}</p>
                      )}
                    </div>

                    <div>
                      <Label>Data de Abertura</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={formData.data_abertura}
                          onChange={(e) => handleFieldChange("data_abertura", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm mt-1">{formData.data_abertura}</p>
                      )}
                    </div>

                    <div>
                      <Label>URL do Edital</Label>
                      {isEditing ? (
                        <Input
                          value={formData.url_edital}
                          onChange={(e) => handleFieldChange("url_edital", e.target.value)}
                        />
                      ) : (
                        <a
                          href={formData.url_edital}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm mt-1 text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <LinkIcon className="w-3 h-3" />
                          Acessar Edital
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Descrição da Demanda</h3>
                {isEditing ? (
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => handleFieldChange("descricao", e.target.value)}
                    rows={4}
                  />
                ) : (
                  <p className="text-sm">{formData.descricao}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Responsáveis</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{formData.responsavel || "Ana Silva"}</p>
                      <p className="text-xs text-gray-500">Gerente de Licitações</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="servicos">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Serviços</h3>
                {isEditing && (
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar Serviço
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {servicosOferecidos.map((servico) => (
                  <div key={servico.id} className="border rounded-lg p-4 hover:border-gray-400 transition-colors">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{servico.nome}</h4>
                        <p className="text-sm text-gray-500 mt-1">{servico.descricao}</p>
                      </div>
                      <div className="font-semibold">{servico.valor}</div>
                    </div>
                    {isEditing && (
                      <div className="flex justify-end mt-3 gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remover
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documentos">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Documentos</h3>
                <Button size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>

              <div className="space-y-3">
                {documentos.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.nome}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>{doc.tipo}</span>
                          <span>{doc.data}</span>
                          <span>{doc.tamanho}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                      {isEditing && (
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="valores">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BadgeDollarSign className="w-4 h-4 text-green-500" />
                    Valores da Licitação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorEstimado">Valor Estimado</Label>
                      <Input
                        id="valorEstimado"
                        type="number"
                        value={formData.valorEstimado || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            valorEstimado: parseFloat(e.target.value),
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valorProposta">Valor da Proposta</Label>
                      <Input
                        id="valorProposta"
                        type="number"
                        value={formData.valorEstimado || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            valorEstimado: parseFloat(e.target.value),
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="margem">Margem (%)</Label>
                      <Input
                        id="margem"
                        type="number"
                        value={"10"}
                        onChange={(e) =>
                          console.log("Margem alterada:", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Condições Financeiras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Forma de Pagamento</Label>
                      {isEditing ? (
                        <Select
                          value={formData.forma_pagamento}
                          onValueChange={(value) => handleFieldChange("forma_pagamento", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a forma de pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mensal">Mensal</SelectItem>
                            <SelectItem value="parcela_unica">Parcela Única</SelectItem>
                            <SelectItem value="customizado">Customizado</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm mt-1">Pagamento Mensal</p>
                      )}
                    </div>

                    <div>
                      <Label>Observações Financeiras</Label>
                      {isEditing ? (
                        <Textarea
                          value={formData.obs_financeiras}
                          onChange={(e) => handleFieldChange("obs_financeiras", e.target.value)}
                          placeholder="Adicione observações sobre condições financeiras..."
                        />
                      ) : (
                        <p className="text-sm mt-1">
                          Pagamentos mediante empenho prévio. Notas fiscais devem ser emitidas até o dia 20 de cada mês.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
      {deleteDialogOpen && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Licitação</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir essa licitação? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Sheet>
  )
}
