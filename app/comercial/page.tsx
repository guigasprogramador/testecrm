"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Edit, Trash, Mail, Phone, Calendar, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { DetalhesOportunidade } from "@/components/detalhes-oportunidade"
import { DetalhesCliente } from "@/components/detalhes-cliente"
import { FiltroOportunidadesOtimizado, OportunidadeFiltros } from "@/components/comercial/filtro-oportunidades-otimizado"
// Primeiro, vamos importar o componente NovaOportunidade
import { NovaOportunidade } from "@/components/nova-oportunidade"
// Importe o novo componente KanbanBoard:
import { KanbanBoard } from "@/components/comercial/kanban-board"
// Importar componentes para o menu de ações
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface Oportunidade {
  id: string
  titulo: string
  cliente: string
  valor: string
  responsavel: string
  prazo: string
  status: string
  descricao?: string
}

interface Cliente {
  nome: string
  [key: string]: any
}

export default function ComercialPage() {
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([
    {
      id: "1",
      titulo: "Sistema de Gestão Municipal",
      cliente: "Prefeitura de São Paulo",
      valor: "R$ 450.000,00",
      responsavel: "Ana Silva",
      prazo: "30/06/2023",
      status: "novo_lead",
    },
    {
      id: "2",
      titulo: "Plataforma de Educação Online",
      cliente: "Secretaria de Educação",
      valor: "R$ 280.000,00",
      responsavel: "Carlos Oliveira",
      prazo: "15/07/2023",
      status: "agendamento_reuniao",
    },
    {
      id: "3",
      titulo: "Modernização de Infraestrutura",
      cliente: "Hospital Municipal",
      valor: "R$ 620.000,00",
      responsavel: "Ana Silva",
      prazo: "10/08/2023",
      status: "levantamento_oportunidades",
    },
    {
      id: "4",
      titulo: "Sistema de Controle de Frotas",
      cliente: "Departamento de Transportes",
      valor: "R$ 180.000,00",
      responsavel: "Pedro Santos",
      prazo: "05/06/2023",
      status: "proposta_enviada",
    },
    {
      id: "5",
      titulo: "Portal de Transparência",
      cliente: "Governo do Estado",
      valor: "R$ 320.000,00",
      responsavel: "Carlos Oliveira",
      prazo: "20/07/2023",
      status: "negociacao",
    },
    {
      id: "6",
      titulo: "Aplicativo de Serviços Públicos",
      cliente: "Prefeitura de Campinas",
      valor: "R$ 250.000,00",
      responsavel: "Pedro Santos",
      prazo: "15/06/2023",
      status: "fechado_ganho",
    },
    {
      id: "7",
      titulo: "Sistema de Gestão Hospitalar",
      cliente: "Hospital Regional",
      valor: "R$ 380.000,00",
      responsavel: "Maria Souza",
      prazo: "22/07/2023",
      status: "fechado_perdido",
    },
  ])

  const [filteredOportunidades, setFilteredOportunidades] = useState<Oportunidade[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [responsavelFilter, setResponsavelFilter] = useState("todos")
  const [activeTab, setActiveTab] = useState("lista")
  const [selectedOportunidade, setSelectedOportunidade] = useState<Oportunidade | null>(null)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [clienteDetailsOpen, setClienteDetailsOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)
  const [showNovaOportunidade, setShowNovaOportunidade] = useState(false)
  const [showEditarOportunidade, setShowEditarOportunidade] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [oportunidadeToDelete, setOportunidadeToDelete] = useState<string | null>(null)

  // Extrair listas de valores únicos para os filtros
  const clientes = Array.from(new Set(oportunidades.map(item => item.cliente)))
  const responsaveis = Array.from(new Set(oportunidades.map(item => item.responsavel)))

  useEffect(() => {
    applyFilters()
  }, [searchTerm, statusFilter, responsavelFilter, oportunidades])

  const applyFilters = () => {
    let filtered = [...oportunidades]
    let activeFilterCount = 0

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.cliente.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      activeFilterCount++
    }

    if (statusFilter !== "todos") {
      filtered = filtered.filter((item) => item.status === statusFilter)
      activeFilterCount++
    }

    if (responsavelFilter !== "todos") {
      filtered = filtered.filter((item) => item.responsavel === responsavelFilter)
      activeFilterCount++
    }

    setFilteredOportunidades(filtered)
    setActiveFilters(activeFilterCount)
  }

  // Nova função para aplicar filtros otimizados
  const handleFilterChange = (filtros: OportunidadeFiltros) => {
    let filtered = [...oportunidades]

    // Filtro por termo
    if (filtros.termo) {
      filtered = filtered.filter(
        (item) =>
          item.titulo.toLowerCase().includes(filtros.termo.toLowerCase()) ||
          item.cliente.toLowerCase().includes(filtros.termo.toLowerCase()),
      )
    }

    // Filtro por status
    if (filtros.status !== "todos") {
      filtered = filtered.filter((item) => item.status === filtros.status)
    }

    // Filtro por cliente
    if (filtros.cliente !== "todos") {
      filtered = filtered.filter((item) => item.cliente === filtros.cliente)
    }

    // Filtro por responsável
    if (filtros.responsavel !== "todos") {
      filtered = filtered.filter((item) => item.responsavel === filtros.responsavel)
    }

    // Filtro por data de prazo - início
    if (filtros.dataInicio) {
      filtered = filtered.filter((item) => {
        const dataPrazo = new Date(item.prazo.split('/').reverse().join('-'))
        return dataPrazo >= filtros.dataInicio!
      })
    }

    // Filtro por data de prazo - fim
    if (filtros.dataFim) {
      filtered = filtered.filter((item) => {
        const dataPrazo = new Date(item.prazo.split('/').reverse().join('-'))
        return dataPrazo <= filtros.dataFim!
      })
    }

    // Filtro por valor mínimo
    if (filtros.valorMinimo) {
      const valorMinimoNumerico = parseFloat(filtros.valorMinimo.replace(/[^0-9,]/g, '').replace(',', '.'))
      filtered = filtered.filter((item) => {
        const valorNumerico = parseFloat(item.valor.replace(/[^0-9,]/g, '').replace(',', '.'))
        return !isNaN(valorNumerico) && !isNaN(valorMinimoNumerico) && valorNumerico >= valorMinimoNumerico
      })
    }

    // Filtro por valor máximo
    if (filtros.valorMaximo) {
      const valorMaximoNumerico = parseFloat(filtros.valorMaximo.replace(/[^0-9,]/g, '').replace(',', '.'))
      filtered = filtered.filter((item) => {
        const valorNumerico = parseFloat(item.valor.replace(/[^0-9,]/g, '').replace(',', '.'))
        return !isNaN(valorNumerico) && !isNaN(valorMaximoNumerico) && valorNumerico <= valorMaximoNumerico
      })
    }

    setFilteredOportunidades(filtered)
    
    // Atualizar os filtros antigos para manter compatibilidade
    setSearchTerm(filtros.termo)
    setStatusFilter(filtros.status)
    setResponsavelFilter(filtros.responsavel)
  }

  // Função para excluir uma oportunidade
  const handleDeleteOportunidade = (id: string) => {
    setOportunidadeToDelete(id)
    setShowConfirmDelete(true)
  }

  // Função para confirmar a exclusão
  const confirmDeleteOportunidade = () => {
    if (oportunidadeToDelete) {
      setOportunidades(oportunidades.filter(item => item.id !== oportunidadeToDelete))
      setFilteredOportunidades(filteredOportunidades.filter(item => item.id !== oportunidadeToDelete))
      setShowConfirmDelete(false)
      setOportunidadeToDelete(null)
      toast({
        title: "Oportunidade excluída",
        description: "A oportunidade foi excluída com sucesso.",
      })
    }
  }

  // Função para editar uma oportunidade
  const handleEditOportunidade = (oportunidade: Oportunidade) => {
    setSelectedOportunidade(oportunidade)
    setShowEditarOportunidade(true)
  }

  // Função para enviar email relacionado à oportunidade
  const handleSendEmail = (oportunidade: Oportunidade) => {
    // Simulação de envio de email
    toast({
      title: "Email agendado",
      description: `Um email será enviado para o cliente ${oportunidade.cliente}.`,
    })
  }

  // Função para agendar ligação
  const handleScheduleCall = (oportunidade: Oportunidade) => {
    // Simulação de agendamento de ligação
    toast({
      title: "Ligação agendada",
      description: `Uma ligação foi agendada para o cliente ${oportunidade.cliente}.`,
    })
  }

  // Função para agendar reunião
  const handleScheduleMeeting = (oportunidade: Oportunidade) => {
    // Simulação de agendamento de reunião
    toast({
      title: "Reunião agendada",
      description: `Uma reunião foi agendada com o cliente ${oportunidade.cliente}.`,
    })
  }

  // Função para marcar como ganho
  const handleMarkAsWon = (oportunidade: Oportunidade) => {
    const updatedOportunidades = oportunidades.map(item => {
      if (item.id === oportunidade.id) {
        return { ...item, status: "fechado_ganho" }
      }
      return item
    })
    setOportunidades(updatedOportunidades)
    applyFilters()
    toast({
      title: "Oportunidade atualizada",
      description: "A oportunidade foi marcada como ganha.",
    })
  }

  // Função para marcar como perdido
  const handleMarkAsLost = (oportunidade: Oportunidade) => {
    const updatedOportunidades = oportunidades.map(item => {
      if (item.id === oportunidade.id) {
        return { ...item, status: "fechado_perdido" }
      }
      return item
    })
    setOportunidades(updatedOportunidades)
    applyFilters()
    toast({
      title: "Oportunidade atualizada",
      description: "A oportunidade foi marcada como perdida.",
      variant: "destructive"
    })
  }

  const handleClienteClick = (clienteNome: string) => {
    if (!clienteDetailsOpen) {
      setSelectedCliente({ nome: clienteNome })
      setTimeout(() => {
        setClienteDetailsOpen(true)
      }, 0)
    }
  }

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOportunidades((prevOportunidades) =>
      prevOportunidades.map((op) => (op.id === id ? { ...op, status: newStatus } : op)),
    )
  }

  const handleClienteUpdate = (clienteAtualizado: Cliente) => {
    // In a real app, this would update the client in the database
    console.log("Cliente atualizado:", clienteAtualizado)
    
    // Update the oportunidades list with the new client name if it changed
    if (clienteAtualizado.nome !== selectedCliente?.nome) {
      setOportunidades(prev => 
        prev.map(op => 
          op.cliente === selectedCliente?.nome 
            ? { ...op, cliente: clienteAtualizado.nome } 
            : op
        )
      )
    }
    
    // Update the selected client
    setSelectedCliente(clienteAtualizado)
  }

  const handleClienteDelete = (cliente: Cliente) => {
    // In a real app, this would delete the client from the database
    console.log("Cliente excluído:", cliente)
    
    // Remove opportunities related to this client
    setOportunidades(prev => 
      prev.filter(op => op.cliente !== cliente.nome)
    )
  }

  return (
    <div className="p-4 md:p-6 overflow-hidden">
      <h1 className="text-2xl font-bold mb-6">Comercial</h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">38</div>
            <div className="text-sm text-muted-foreground">Leads em aberto</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">83</div>
            <div className="text-sm text-muted-foreground">Propostas aceitas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">
              12.000,00
            </div>
            <div className="text-sm text-muted-foreground">Total em negociação</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">86%</div>
            <div className="text-sm text-muted-foreground">Taxa de conversão</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">46</div>
            <div className="text-sm text-muted-foreground">Tempo de fechamento</div>
          </CardContent>
        </Card>
      </div>

      {/* Abas e Filtros */}
      <div className="flex flex-col gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => setActiveTab("kanban")}
                variant={activeTab === "kanban" ? "default" : "outline"}
              >
                Kanban
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveTab("lista")}
                variant={activeTab === "lista" ? "default" : "outline"}
              >
                Lista
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <FiltroOportunidadesOtimizado
                onFilterChange={handleFilterChange}
                clientes={clientes}
                responsaveis={responsaveis}
              />
              <NovaOportunidade
                onOportunidadeAdded={(novaOportunidade) => {
                  setOportunidades((prev) => [novaOportunidade, ...prev])
                }}
              />
            </div>
          </div>

          {/* Conteúdo das abas */}
          <TabsContent value="lista">
            <div className="bg-white rounded-md border shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Lista de Oportunidades</h2>
                <p className="text-sm text-muted-foreground">Gerenciamento de todas as oportunidades comerciais</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Oportunidade</th>
                      <th className="text-left p-4 font-medium">Cliente</th>
                      <th className="text-left p-4 font-medium">Valor</th>
                      <th className="text-left p-4 font-medium">Responsável</th>
                      <th className="text-left p-4 font-medium">Prazo</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOportunidades.map((oportunidade) => (
                      <tr
                        key={oportunidade.id}
                        className="border-b cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setSelectedOportunidade(oportunidade)
                          setDetailsOpen(true)
                        }}
                      >
                        <td className="p-4">{oportunidade.titulo}</td>
                        <td className="p-4">
                          <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleClienteClick(oportunidade.cliente)
                            }}
                          >
                            {oportunidade.cliente}
                          </Button>
                        </td>
                        <td className="p-4">{oportunidade.valor}</td>
                        <td className="p-4">{oportunidade.responsavel}</td>
                        <td className="p-4">{oportunidade.prazo}</td>
                        <td className="p-4">
                          <StatusBadge status={oportunidade.status} />
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditOportunidade(oportunidade)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteOportunidade(oportunidade.id)
                                }}
                                className="text-destructive"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSendEmail(oportunidade)
                                }}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleScheduleCall(oportunidade)
                                }}
                              >
                                <Phone className="mr-2 h-4 w-4" />
                                Agendar Ligação
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleScheduleMeeting(oportunidade)
                                }}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Agendar Reunião
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsWon(oportunidade)
                                }}
                                disabled={oportunidade.status === "fechado_ganho"}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Marcar como Ganho
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsLost(oportunidade)
                                }}
                                disabled={oportunidade.status === "fechado_perdido"}
                              >
                                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                Marcar como Perdido
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kanban">
            <div className="bg-white rounded-md border shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">Kanban de Oportunidades</h2>
              <KanbanBoard oportunidades={filteredOportunidades} onUpdateStatus={handleUpdateStatus} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals/Drawers */}
      {selectedOportunidade && detailsOpen ? (
        <DetalhesOportunidade
          key={`opp-${selectedOportunidade.id}`}
          oportunidade={selectedOportunidade}
          open={detailsOpen}
          onOpenChange={(open) => {
            setDetailsOpen(open)
            if (!open) {
              setTimeout(() => {
                setSelectedOportunidade(null)
              }, 300)
            }
          }}
          onClienteClick={handleClienteClick}
        />
      ) : null}

      {selectedCliente && clienteDetailsOpen ? (
        <DetalhesCliente
          key={`client-${selectedCliente.nome}`}
          cliente={selectedCliente}
          open={clienteDetailsOpen}
          onOpenChange={(open) => {
            setClienteDetailsOpen(open)
            if (!open) {
              setTimeout(() => {
                setSelectedCliente(null)
              }, 300)
            }
          }}
          onClienteUpdate={handleClienteUpdate}
          onClienteDelete={handleClienteDelete}
        />
      ) : null}

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta oportunidade? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteOportunidade}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; class: string }> = {
    novo_lead: { label: "Novo Lead", class: "bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs" },
    agendamento_reuniao: {
      label: "Agendamento de Reunião",
      class: "bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs",
    },
    levantamento_oportunidades: {
      label: "Levantamento de Oportunidades",
      class: "bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-xs",
    },
    proposta_enviada: {
      label: "Proposta Enviada",
      class: "bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-xs",
    },
    negociacao: { label: "Negociação", class: "bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-xs" },
    fechado_ganho: { label: "Fechado (Ganho)", class: "bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs" },
    fechado_perdido: { label: "Fechado (Perdido)", class: "bg-red-100 text-red-800 rounded-full px-3 py-1 text-xs" },
  }

  const config = statusConfig[status] || {
    label: status,
    class: "bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs",
  }

  return <span className={config.class}>{config.label}</span>
}

function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    novo_lead: "Novo Lead",
    agendamento_reuniao: "Agendamento de Reunião",
    levantamento_oportunidades: "Levantamento de Oportunidades",
    proposta_enviada: "Proposta Enviada",
    negociacao: "Negociação",
    fechado_ganho: "Fechado (Ganho)",
    fechado_perdido: "Fechado (Perdido)",
  }

  return statusLabels[status] || status
}
