"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, User, PlusCircle, Edit, Save, Trash2, ChevronRight, Landmark, AlertTriangle, Maximize2, Minimize2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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

interface Orgao {
  id?: string
  nome: string
  tipo?: string
  tipoLabel?: string
  cnpj?: string
  endereco?: string
  cidade?: string
  estado?: string
  segmento?: string
  origemLead?: string
  responsavelInterno?: string
  descricao?: string
  observacoes?: string
  faturamento?: string
  contatos?: Array<{
    id: string
    nome: string
    cargo?: string
    email: string
    telefone?: string
  }>
  [key: string]: any
}

export type { Orgao }

interface DetalhesOrgaoProps {
  orgao: Orgao | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onOrgaoUpdate?: (orgao: Orgao) => void
  onOrgaoDelete?: (orgao: Orgao) => void
}

const statusColors = {
  analise_interna: "bg-blue-100 text-blue-800 border-blue-300",
  aguardando_pregao: "bg-purple-100 text-purple-800 border-purple-300",
  vencida: "bg-green-100 text-green-800 border-green-300",
  nao_vencida: "bg-red-100 text-red-800 border-red-300",
  envio_documentos: "bg-yellow-100 text-yellow-800 border-yellow-300",
  assinaturas: "bg-orange-100 text-orange-800 border-orange-300",
  concluida: "bg-emerald-100 text-emerald-800 border-emerald-300",
}

const statusLabels = {
  analise_interna: "Análise Interna",
  aguardando_pregao: "Aguardando Pregão",
  vencida: "Vencida",
  nao_vencida: "Não Vencida",
  envio_documentos: "Envio de Documentos",
  assinaturas: "Assinaturas",
  concluida: "Concluída",
}

export function DetalhesOrgao({ orgao, open, onOpenChange, onOrgaoUpdate, onOrgaoDelete }: DetalhesOrgaoProps) {
  const [activeTab, setActiveTab] = useState("resumo")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Orgao>>({})
  const [novoContato, setNovoContato] = useState({
    nome: "",
    cargo: "",
    email: "",
    telefone: "",
  })
  const [mostrarFormContato, setMostrarFormContato] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingContato, setEditingContato] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Reset active tab when opening the sheet
  useEffect(() => {
    if (open) {
      setActiveTab("resumo")
      setIsEditing(false)
    }
  }, [open])

  // Dados fictícios para demonstração
  const orgaoDemo: Orgao = {
    id: "1",
    nome: "Prefeitura de São Paulo",
    tipo: "prefeitura",
    tipoLabel: "Prefeitura Municipal",
    cnpj: "12.345.678/0001-90",
    endereco: "Viaduto do Chá, 15",
    cidade: "São Paulo",
    estado: "SP",
    segmento: "Administração Pública Municipal",
    origemLead: "Edital publicado - ComprasNet",
    responsavelInterno: "Ana Silva",
    descricao: "Prefeitura do município de São Paulo, maior cidade do Brasil.",
    observacoes: "Cliente exige documentação completa para licitações. Pagamentos em até 30 dias após empenho.",
    faturamento:
      "Empenho prévio necessário. Nota fiscal com ISS (5%). Contatos devem ser sempre formalizados por e-mail com cópia para departamento jurídico.",
    contatos: [
      {
        id: "c1",
        nome: "João Oliveira",
        cargo: "Secretário de Tecnologia",
        email: "joao.oliveira@prefeiturasp.gov.br",
        telefone: "(11) 3333-4444",
      },
      {
        id: "c2",
        nome: "Maria Santos",
        cargo: "Diretora de Compras",
        email: "maria.santos@prefeiturasp.gov.br",
        telefone: "(11) 3333-5555",
      },
    ],
  }

  // Licitações relacionadas a este órgão
  const licitacoesRelacionadas = [
    {
      id: "1",
      nome: "Pregão Eletrônico 123/2023",
      valor: "R$ 450.000,00",
      status: "analise_interna",
      prazo: "30/06/2023",
      responsavel: "Ana Silva",
      dataJulgamento: "15/07/2023",
    },
    {
      id: "2",
      nome: "Tomada de Preços 45/2022",
      valor: "R$ 320.000,00",
      status: "vencida",
      prazo: "Concluído",
      responsavel: "Carlos Oliveira",
      dataJulgamento: "10/11/2022",
    },
    {
      id: "3",
      nome: "Concorrência 78/2022",
      valor: "R$ 780.000,00",
      status: "nao_vencida",
      prazo: "Concluído",
      responsavel: "Pedro Santos",
      dataJulgamento: "22/08/2022",
    },
  ]

  useEffect(() => {
    // Initialize form with orgao data or demo data if orgao is null
    setFormData(orgao || orgaoDemo)
  }, [orgao])

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNovoContatoChange = (field: string, value: string) => {
    setNovoContato((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleContatoChange = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contatos: prev.contatos?.map((contato) => 
        contato.id === id ? { ...contato, [field]: value } : contato
      ),
    }))
  }

  const adicionarContato = () => {
    if (novoContato.nome.trim() && novoContato.email.trim()) {
      const novoId = `c${Date.now()}`
      const contatoCompleto = {
        ...novoContato,
        id: novoId,
      }

      setFormData((prev) => ({
        ...prev,
        contatos: [...(prev.contatos || []), contatoCompleto],
      }))

      // Reset form
      setNovoContato({
        nome: "",
        cargo: "",
        email: "",
        telefone: "",
      })

      setMostrarFormContato(false)
      toast.success("Contato adicionado com sucesso")
    }
  }

  const removerContato = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      contatos: prev.contatos?.filter((contato) => contato.id !== id),
    }))
    toast.success("Contato removido com sucesso")
  }

  const handleSave = () => {
    if (onOrgaoUpdate && formData) {
      onOrgaoUpdate(formData as Orgao)
      toast.success("Dados do órgão atualizados com sucesso")
    } else {
      console.log("Salvando dados do órgão:", formData)
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (onOrgaoDelete && formData) {
      onOrgaoDelete(formData as Orgao)
      setDeleteDialogOpen(false)
      onOpenChange(false)
      toast.success("Órgão excluído com sucesso")
    }
  }

  const toggleEditContato = (id: string | null) => {
    setEditingContato(id)
  }

  if (!orgao) {
    return (
      <Sheet key="empty-orgao-sheet" open={false} onOpenChange={() => {}}>
        <SheetContent className="w-full md:max-w-xl lg:max-w-2xl overflow-y-auto">
          <div></div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o órgão <strong>{formData.nome}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet key={`orgao-sheet-${orgao?.id || "empty"}`} open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          className={`overflow-y-auto transition-all duration-300 ${
            isExpanded ? "w-[95vw] max-w-[95vw]" : "w-full md:max-w-3xl lg:max-w-4xl"
          }`}
        >
          <SheetHeader className="mb-6">
            <div className="flex justify-between items-center">
              <SheetTitle className="text-xl flex items-center gap-2">
                <Landmark className="h-5 w-5 text-primary" />
                {isEditing ? (
                  <Input 
                    value={formData.nome || ""} 
                    onChange={(e) => handleFieldChange("nome", e.target.value)}
                    className="h-7 text-xl font-semibold"
                  />
                ) : (
                  formData.nome || "Órgão"
                )}
              </SheetTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 rounded-full"
                  title={isExpanded ? "Recolher painel" : "Expandir painel"}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                ) : (
                  <Button onClick={handleSave} variant="outline" size="sm" className="gap-2">
                    <Save className="w-4 h-4" />
                    Salvar
                  </Button>
                )}
              </div>
            </div>
          </SheetHeader>

          <Tabs defaultValue="resumo" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="contatos">Contatos</TabsTrigger>
              <TabsTrigger value="licitacoes">Licitações</TabsTrigger>
            </TabsList>

            <TabsContent value="resumo">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>CNPJ</Label>
                        {isEditing ? (
                          <Input value={formData.cnpj} onChange={(e) => handleFieldChange("cnpj", e.target.value)} />
                        ) : (
                          <p className="text-sm mt-1">{formData.cnpj}</p>
                        )}
                      </div>

                      <div>
                        <Label>Endereço</Label>
                        {isEditing ? (
                          <Input
                            value={formData.endereco}
                            onChange={(e) => handleFieldChange("endereco", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm mt-1">{formData.endereco}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Cidade</Label>
                          {isEditing ? (
                            <Input
                              value={formData.cidade}
                              onChange={(e) => handleFieldChange("cidade", e.target.value)}
                            />
                          ) : (
                            <p className="text-sm mt-1">{formData.cidade}</p>
                          )}
                        </div>
                        <div>
                          <Label>Estado</Label>
                          {isEditing ? (
                            <Input
                              value={formData.estado}
                              onChange={(e) => handleFieldChange("estado", e.target.value)}
                            />
                          ) : (
                            <p className="text-sm mt-1">{formData.estado}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Segmento</Label>
                        {isEditing ? (
                          <Input
                            value={formData.segmento}
                            onChange={(e) => handleFieldChange("segmento", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm mt-1">{formData.segmento}</p>
                        )}
                      </div>

                      <div>
                        <Label>Origem da Lead</Label>
                        {isEditing ? (
                          <Input
                            value={formData.origemLead}
                            onChange={(e) => handleFieldChange("origemLead", e.target.value)}
                          />
                        ) : (
                          <p className="text-sm mt-1">{formData.origemLead}</p>
                        )}
                      </div>

                      <div>
                        <Label>Responsável Interno</Label>
                        {isEditing ? (
                          <Input
                            value={formData.responsavelInterno}
                            onChange={(e) => handleFieldChange("responsavelInterno", e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{formData.responsavelInterno}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Descrição</Label>
                  {isEditing ? (
                    <Textarea
                      className="mt-2"
                      value={formData.descricao}
                      onChange={(e) => handleFieldChange("descricao", e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm mt-1">{formData.descricao}</p>
                  )}
                </div>

                <div>
                  <Label>Observações</Label>
                  {isEditing ? (
                    <Textarea
                      className="mt-2"
                      value={formData.observacoes}
                      onChange={(e) => handleFieldChange("observacoes", e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm mt-1">{formData.observacoes}</p>
                  )}
                </div>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-base font-medium mb-2">Informações para Faturamento</h3>
                    {isEditing ? (
                      <Textarea
                        value={formData.faturamento}
                        onChange={(e) => handleFieldChange("faturamento", e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm">{formData.faturamento}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contatos">
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Contatos</h3>
                  {!mostrarFormContato && (
                    <Button size="sm" onClick={() => setMostrarFormContato(true)} className="gap-2">
                      <PlusCircle className="w-4 h-4" />
                      Adicionar Contato
                    </Button>
                  )}
                </div>

                {mostrarFormContato && (
                  <Card className="mb-6">
                    <CardContent className="p-4">
                      <h3 className="text-base font-medium mb-4">Novo Contato</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="nome-contato">Nome</Label>
                          <Input
                            id="nome-contato"
                            value={novoContato.nome}
                            onChange={(e) => handleNovoContatoChange("nome", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cargo-contato">Cargo</Label>
                          <Input
                            id="cargo-contato"
                            value={novoContato.cargo}
                            onChange={(e) => handleNovoContatoChange("cargo", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email-contato">Email</Label>
                          <Input
                            id="email-contato"
                            type="email"
                            value={novoContato.email}
                            onChange={(e) => handleNovoContatoChange("email", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefone-contato">Telefone</Label>
                          <Input
                            id="telefone-contato"
                            value={novoContato.telefone}
                            onChange={(e) => handleNovoContatoChange("telefone", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setMostrarFormContato(false)}>
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={adicionarContato}>
                          Adicionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {formData.contatos &&
                    formData.contatos.map((contato) => (
                      <Card key={contato.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="w-full">
                              {editingContato === contato.id ? (
                                <div className="space-y-3 w-full">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <Label>Nome</Label>
                                      <Input 
                                        value={contato.nome} 
                                        onChange={(e) => handleContatoChange(contato.id, "nome", e.target.value)} 
                                      />
                                    </div>
                                    <div>
                                      <Label>Cargo</Label>
                                      <Input 
                                        value={contato.cargo || ""} 
                                        onChange={(e) => handleContatoChange(contato.id, "cargo", e.target.value)} 
                                      />
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <Input 
                                        value={contato.email} 
                                        onChange={(e) => handleContatoChange(contato.id, "email", e.target.value)} 
                                      />
                                    </div>
                                    <div>
                                      <Label>Telefone</Label>
                                      <Input 
                                        value={contato.telefone || ""} 
                                        onChange={(e) => handleContatoChange(contato.id, "telefone", e.target.value)} 
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => toggleEditContato(null)}>
                                      Cancelar
                                    </Button>
                                    <Button size="sm" onClick={() => toggleEditContato(null)}>
                                      Salvar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <h4 className="font-medium text-base">{contato.nome}</h4>
                                  <p className="text-sm text-gray-500">{contato.cargo}</p>

                                  <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-1 text-sm">
                                      <Mail className="w-4 h-4 text-gray-500" />
                                      <a href={`mailto:${contato.email}`} className="text-blue-600 hover:underline">
                                        {contato.email}
                                      </a>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                      <Phone className="w-4 h-4 text-gray-500" />
                                      <a
                                        href={`tel:${contato.telefone?.replace(/\D/g, "")}`}
                                        className="text-blue-600 hover:underline"
                                      >
                                        {contato.telefone}
                                      </a>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="flex gap-1">
                              {!editingContato && isEditing && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => toggleEditContato(contato.id)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 h-8 w-8"
                                    onClick={() => removerContato(contato.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  {(!formData.contatos || formData.contatos.length === 0) && (
                    <div className="text-center py-8 text-gray-500">Nenhum contato cadastrado</div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="licitacoes">
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Licitações</h3>

                <div className="space-y-4">
                  {licitacoesRelacionadas.map((licitacao) => (
                    <Card key={licitacao.id} className="overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b">
                        <div>
                          <h4 className="font-medium">{licitacao.nome}</h4>
                          <p className="text-sm text-gray-500">
                            Responsável: {licitacao.responsavel} • Julgamento: {licitacao.dataJulgamento}
                          </p>
                        </div>
                        <Badge className={statusColors[licitacao.status]}>{statusLabels[licitacao.status]}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="font-semibold">{licitacao.valor}</div>
                          <Button size="sm" variant="outline" className="gap-1">
                            Ver detalhes
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {licitacoesRelacionadas.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Nenhuma licitação encontrada para este órgão</div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  )
}
