"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  Building,
  Clock,
  DollarSign,
  User,
  CalendarIcon,
  PlusCircle,
  MessageSquare,
  Edit,
  Save,
} from "lucide-react"
import Link from "next/link"

interface Oportunidade {
  id: string
  titulo: string
  cliente: string
  valor: string
  responsavel: string
  prazo: string
  status: string
  descricao?: string
  dataAgenda?: string
}

interface DetalhesOportunidadeProps {
  oportunidade: Oportunidade | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClienteClick?: (clienteNome: string) => void
}

const statusColors: Record<string, string> = {
  novo_lead: "bg-blue-100 text-blue-800 border-blue-300",
  agendamento_reuniao: "bg-indigo-100 text-indigo-800 border-indigo-300",
  levantamento_oportunidades: "bg-purple-100 text-purple-800 border-purple-300",
  proposta_enviada: "bg-amber-100 text-amber-800 border-amber-300",
  negociacao: "bg-orange-100 text-orange-800 border-orange-300",
  fechado_ganho: "bg-green-100 text-green-800 border-green-300",
  fechado_perdido: "bg-red-100 text-red-800 border-red-300",
}

const statusLabels: Record<string, string> = {
  novo_lead: "Novo Lead",
  agendamento_reuniao: "Agendamento de Reunião",
  levantamento_oportunidades: "Levantamento de Oportunidades",
  proposta_enviada: "Proposta Enviada",
  negociacao: "Negociação",
  fechado_ganho: "Fechado (Ganho)",
  fechado_perdido: "Fechado (Perdido)",
}

const flowSteps = [
  { id: "novo_lead", label: "Novo Lead" },
  { id: "agendamento_reuniao", label: "Agendamento de Reunião" },
  { id: "levantamento_oportunidades", label: "Levantamento de Oportunidades" },
  { id: "proposta_enviada", label: "Proposta Enviada" },
  { id: "negociacao", label: "Negociação" },
  { id: "fechado_ganho", label: "Fechado (Ganho)" },
  { id: "fechado_perdido", label: "Fechado (Perdido)" },
]

export function DetalhesOportunidade({ oportunidade, open, onOpenChange, onClienteClick }: DetalhesOportunidadeProps) {
  const [activeTab, setActiveTab] = useState("resumo")
  const [novaNota, setNovaNota] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Oportunidade>>({})

  // Dados fictícios para demonstração
  const notas = [
    {
      id: 1,
      autor: "Ana Silva",
      data: "23/05/2023",
      texto: "Cliente possui urgência na implementação do sistema devido ao prazo legal que se encerra em agosto.",
    },
    {
      id: 2,
      autor: oportunidade?.responsavel || "Responsável",
      data: "27/05/2023",
      texto: "Cliente solicitou detalhamento do módulo de relatórios e exportação de dados.",
    },
  ]

  useEffect(() => {
    if (oportunidade) {
      setFormData({
        ...oportunidade,
        descricao:
          oportunidade.descricao ||
          "Implementação de solução tecnológica para atender às necessidades específicas do cliente, incluindo módulos de gestão, relatórios e integrações com sistemas existentes.",
      })
    }
  }, [oportunidade])

  const adicionarNota = () => {
    if (novaNota.trim()) {
      console.log("Nova nota adicionada:", novaNota)
      setNovaNota("")
      // Aqui você implementaria a lógica para adicionar a nota ao estado
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    console.log("Salvando dados:", formData)
    setIsEditing(false)
    // Aqui você implementaria a lógica para salvar os dados no servidor
  }

  const atualizarStatus = (novoStatus: string) => {
    setFormData((prev) => ({
      ...prev,
      status: novoStatus,
    }))
    console.log(`Status atualizado para: ${novoStatus}`)
    // Aqui você implementaria a lógica para salvar o novo status
  }

  if (!oportunidade) return null

  return (
    <Sheet
      key={`opp-sheet-${oportunidade.id}`}
      open={open}
      onOpenChange={(newOpen) => {
        // Only call onOpenChange if it's actually changing
        if (open !== newOpen) {
          onOpenChange(newOpen)
        }
      }}
    >
      <SheetContent className="w-full md:max-w-xl lg:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">{oportunidade.titulo}</SheetTitle>
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2 mt-2">
              <Button 
                variant="link" 
                className="flex items-center gap-2 hover:underline p-0 h-auto" 
                onClick={() => onClienteClick && onClienteClick(oportunidade.cliente)}
              >
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{oportunidade.cliente}</span>
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className={statusColors[oportunidade.status]}>{statusLabels[oportunidade.status]}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {oportunidade.valor}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Prazo: {oportunidade.prazo}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {oportunidade.responsavel}
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
          </div>
        </SheetHeader>

        <Tabs defaultValue="resumo" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="notas">Notas</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
          </TabsList>

          {activeTab === "resumo" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Descrição da Demanda</h3>
                    {isEditing ? (
                      <Textarea
                        value={formData.descricao}
                        onChange={(e) => handleFieldChange("descricao", e.target.value)}
                        rows={4}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{formData.descricao}</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Detalhes do Cliente</h3>
                    <div className="mt-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <Link href="#" className="hover:underline">
                          {oportunidade.cliente}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>contato@{oportunidade.cliente.toLowerCase().replace(/\s/g, "")}.gov.br</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>(11) 3333-4444</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status da Oportunidade</h3>
                    {isEditing ? (
                      <div className="mt-1">
                        <Select value={formData.status} onValueChange={(value) => handleFieldChange("status", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            {flowSteps.map((step) => (
                              <SelectItem key={step.id} value={step.id}>
                                {step.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={statusColors[formData.status || ""]}>
                              {statusLabels[formData.status || ""]}
                            </Badge>
                          </div>

                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Alterar para:</h4>
                            <div className="flex flex-wrap gap-2">
                              {flowSteps.map((step, index) => {
                                const currentStepIndex = flowSteps.findIndex((s) => s.id === formData.status)
                                // Só mostrar próximos passos válidos
                                if (
                                  index !== currentStepIndex &&
                                  (index === currentStepIndex + 1 || step.id === "fechado_perdido")
                                ) {
                                  return (
                                    <Button
                                      key={step.id}
                                      size="sm"
                                      variant="outline"
                                      onClick={() => atualizarStatus(step.id)}
                                    >
                                      {step.label}
                                    </Button>
                                  )
                                }
                                return null
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Usuário Responsável</h3>
                    {isEditing ? (
                      <div className="mt-1">
                        <Select
                          value={formData.responsavel}
                          onValueChange={(value) => handleFieldChange("responsavel", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o responsável" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ana Silva">Ana Silva</SelectItem>
                            <SelectItem value="Carlos Oliveira">Carlos Oliveira</SelectItem>
                            <SelectItem value="Pedro Santos">Pedro Santos</SelectItem>
                            <SelectItem value="Maria Souza">Maria Souza</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-800">
                          {formData.responsavel?.charAt(0) || "?"}
                        </div>
                        <span>{formData.responsavel}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data da Agenda</h3>
                    {isEditing ? (
                      <div className="mt-1">
                        <Input
                          type="date"
                          value={formData.dataAgenda || "2023-06-15"}
                          onChange={(e) => handleFieldChange("dataAgenda", e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span>{formData.dataAgenda || "15/06/2023"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notas" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nova-nota">Adicionar nota</Label>
                <Textarea
                  id="nova-nota"
                  placeholder="Digite uma nova nota..."
                  value={novaNota}
                  onChange={(e) => setNovaNota(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={adicionarNota} disabled={!novaNota.trim()}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                {notas.map((nota) => (
                  <div key={nota.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {nota.autor.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{nota.autor}</p>
                          <p className="text-sm text-gray-500">{nota.data}</p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3">{nota.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "servicos" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Serviços Oferecidos</h3>
                {isEditing && (
                  <Button size="sm" className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Adicionar Serviço
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div className="border rounded-lg p-4 hover:border-gray-400 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Sistema de Gestão Municipal</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Software completo para gestão administrativa municipal
                      </p>
                    </div>
                    <div className="font-semibold">R$ 280.000,00</div>
                  </div>
                </div>
                <div className="border rounded-lg p-4 hover:border-gray-400 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Módulo de Recursos Humanos</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Gestão de funcionários, folha de pagamento e benefícios
                      </p>
                    </div>
                    <div className="font-semibold">R$ 85.000,00</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <span className="font-medium">Valor Total:</span>
                <span className="font-bold text-lg">R$ 365.000,00</span>
              </div>
            </div>
          )}
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
