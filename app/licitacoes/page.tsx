"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Edit, Trash, Mail, Phone, Calendar, CheckCircle, XCircle, AlertTriangle, FileText, Download, Share2 } from "lucide-react"
import { DetalhesLicitacao, Licitacao } from "@/components/licitacoes/detalhes-licitacao"
import { DetalhesOrgao } from "@/components/licitacoes/detalhes-orgao"
import { FiltroLicitacoesOtimizado, LicitacaoFiltros } from "@/components/licitacoes/filtro-licitacoes-otimizado"
import { NovaLicitacao } from "@/components/licitacoes/nova-licitacao"
import { LicitacaoKanbanBoard } from "@/components/licitacoes/licitacao-kanban-board"
import type { Orgao } from "@/components/licitacoes/detalhes-orgao"

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

export default function LicitacoesPage() {
  const [licitacoes, setLicitacoes] = useState<Licitacao[]>([
    {
      id: "1",
      titulo: "Aquisição de Equipamentos de Informática",
      orgao: "Prefeitura de São Paulo",
      status: "Em andamento",
      dataAbertura: "2023-05-15",
      valorEstimado: 1500000,
      modalidade: "Pregão Eletrônico",
      objeto: "Aquisição de computadores e periféricos",
      edital: "EDITAL-2023-001",
      responsavel: "Carlos Silva",
      documentos: [
        { nome: "Edital", url: "#" },
        { nome: "Anexo I", url: "#" },
      ]
    },
    {
      id: "2",
      titulo: "Contratação de Serviços de Limpeza",
      orgao: "Secretaria de Educação",
      status: "Encerrado",
      dataAbertura: "2023-04-10",
      valorEstimado: 800000,
      modalidade: "Concorrência",
      objeto: "Serviços de limpeza para escolas municipais",
      edital: "EDITAL-2023-002",
      responsavel: "Ana Oliveira",
      documentos: [
        { nome: "Edital", url: "#" },
        { nome: "Anexo I", url: "#" },
      ]
    },
    {
      id: "3",
      titulo: "Construção de Ponte",
      orgao: "Departamento de Infraestrutura",
      status: "Aguardando documentação",
      dataAbertura: "2023-06-20",
      valorEstimado: 5000000,
      modalidade: "Concorrência",
      objeto: "Construção de ponte sobre o Rio Tietê",
      edital: "EDITAL-2023-003",
      responsavel: "Roberto Almeida",
      documentos: [
        { nome: "Edital", url: "#" },
        { nome: "Anexo I", url: "#" },
      ]
    },
    {
      id: "4",
      titulo: "Fornecimento de Merenda Escolar",
      orgao: "Secretaria de Educação",
      status: "Em análise",
      dataAbertura: "2023-05-25",
      valorEstimado: 1200000,
      modalidade: "Pregão Eletrônico",
      objeto: "Fornecimento de merenda para escolas municipais",
      edital: "EDITAL-2023-004",
      responsavel: "Fernanda Costa",
      documentos: [
        { nome: "Edital", url: "#" },
        { nome: "Anexo I", url: "#" },
      ]
    },
    {
      id: "5",
      titulo: "Manutenção de Frota",
      orgao: "Secretaria de Transportes",
      status: "Publicado",
      dataAbertura: "2023-07-05",
      valorEstimado: 900000,
      modalidade: "Pregão Presencial",
      objeto: "Manutenção preventiva e corretiva da frota municipal",
      edital: "EDITAL-2023-005",
      responsavel: "Ricardo Santos",
      documentos: [
        { nome: "Edital", url: "#" },
        { nome: "Anexo I", url: "#" },
      ]
    },
    {
      id: "6",
      titulo: "Reforma de Escola",
      orgao: "Secretaria de Educação",
      status: "Em andamento",
      dataAbertura: "2023-06-10",
      valorEstimado: 2000000,
      modalidade: "Tomada de Preços",
      objeto: "Reforma da Escola Municipal João da Silva",
      edital: "EDITAL-2023-006",
      responsavel: "Mariana Souza",
      documentos: [
        { nome: "Edital", url: "#" },
        { nome: "Anexo I", url: "#" },
      ]
    },
    {
      id: "7",
      titulo: "Aquisição de Medicamentos",
      orgao: "Secretaria de Saúde",
      status: "Aguardando documentação",
      dataAbertura: "2023-07-15",
      valorEstimado: 3000000,
      modalidade: "Pregão Eletrônico",
      objeto: "Aquisição de medicamentos para rede municipal",
      edital: "EDITAL-2023-007",
      responsavel: "Paulo Mendes",
      documentos: [
        { nome: "Edital", url: "#" },
        { nome: "Anexo I", url: "#" },
      ]
    },
  ])

  const [filteredLicitacoes, setFilteredLicitacoes] = useState<Licitacao[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [responsavelFilter, setResponsavelFilter] = useState("todos")
  const [activeTab, setActiveTab] = useState("lista")
  const [selectedLicitacao, setSelectedLicitacao] = useState<Licitacao | null>(null)
  const [selectedOrgao, setSelectedOrgao] = useState<Orgao | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [orgaoDetailsOpen, setOrgaoDetailsOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)
  const [showEditarLicitacao, setShowEditarLicitacao] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [licitacaoToDelete, setLicitacaoToDelete] = useState<string | null>(null)

  // Extrair listas de valores únicos para os filtros
  const orgaos = Array.from(new Set(licitacoes.map(item => item.orgao)))
  const responsaveis = Array.from(new Set(licitacoes.map(item => item.responsavel)))
  const modalidades = Array.from(new Set(licitacoes.map(item => item.modalidade)))

  // Estatísticas
  const licitacoesAtivas = 38 // Valor fixo para corresponder à imagem
  const licitacoesVencidas = 46 // Valor fixo para corresponder à imagem
  const totalEmLicitacoes = 12000.0 // Valor fixo para corresponder à imagem
  const taxaSucesso = 86 // Valor fixo para corresponder à imagem
  const pregoesEssaSemana = 3 // Valor fixo para corresponder à imagem

  useEffect(() => {
    applyFilters()
  }, [searchTerm, statusFilter, responsavelFilter, licitacoes])

  const applyFilters = () => {
    let filtered = [...licitacoes]
    let activeFilterCount = 0

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.orgao.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      activeFilterCount++
    }

    if (statusFilter !== "todos") {
      // Verificar se o status é um status comercial ou de licitação
      filtered = filtered.filter((item) => {
        if (statusMapping[item.status] === statusFilter) return true
        return item.status === statusFilter
      })
      activeFilterCount++
    }

    if (responsavelFilter !== "todos") {
      filtered = filtered.filter((item) => item.responsavel === responsavelFilter)
      activeFilterCount++
    }

    setFilteredLicitacoes(filtered)
    setActiveFilters(activeFilterCount)
  }

  // Nova função para aplicar filtros otimizados
  const handleFilterChange = (filtros: LicitacaoFiltros) => {
    let filtered = [...licitacoes]

    // Filtro por termo
    if (filtros.termo) {
      filtered = filtered.filter(
        (item) =>
          item.titulo.toLowerCase().includes(filtros.termo.toLowerCase()) ||
          item.orgao.toLowerCase().includes(filtros.termo.toLowerCase()),
      )
    }

    // Filtro por status
    if (filtros.status !== "todos") {
      filtered = filtered.filter((item) => item.status === filtros.status)
    }

    // Filtro por órgão
    if (filtros.orgao !== "todos") {
      filtered = filtered.filter((item) => item.orgao === filtros.orgao)
    }

    // Filtro por responsável
    if (filtros.responsavel !== "todos") {
      filtered = filtered.filter((item) => item.responsavel === filtros.responsavel)
    }

    // Filtro por modalidade
    if (filtros.modalidade !== "todos") {
      filtered = filtered.filter((item) => item.modalidade === filtros.modalidade)
    }

    // Filtro por data de abertura - início
    if (filtros.dataInicio) {
      filtered = filtered.filter((item) => {
        const dataAbertura = new Date(item.dataAbertura)
        return dataAbertura >= filtros.dataInicio!
      })
    }

    // Filtro por data de abertura - fim
    if (filtros.dataFim) {
      filtered = filtered.filter((item) => {
        const dataAbertura = new Date(item.dataAbertura)
        return dataAbertura <= filtros.dataFim!
      })
    }

    // Filtro por valor estimado - mínimo
    if (filtros.valorMinimo !== undefined) {
      filtered = filtered.filter((item) => item.valorEstimado >= filtros.valorMinimo!)
    }

    // Filtro por valor estimado - máximo
    if (filtros.valorMaximo !== undefined) {
      filtered = filtered.filter((item) => item.valorEstimado <= filtros.valorMaximo!)
    }

    setFilteredLicitacoes(filtered)
    
    // Atualizar os filtros antigos para manter compatibilidade
    setSearchTerm(filtros.termo)
    setStatusFilter(filtros.status)
    setResponsavelFilter(filtros.responsavel)
  }

  const handleOrgaoClick = (orgaoNome: string) => {
    if (detailsOpen) {
      setDetailsOpen(false)
      setTimeout(() => {
        const orgao: Orgao = { id: `org-${Date.now()}`, nome: orgaoNome }
        setSelectedOrgao(orgao)
        setOrgaoDetailsOpen(true)
      }, 300)
    } else {
      const orgao: Orgao = { id: `org-${Date.now()}`, nome: orgaoNome }
      setSelectedOrgao(orgao)
      setOrgaoDetailsOpen(true)
    }
  }

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setLicitacoes((prevLicitacoes) =>
      prevLicitacoes.map((lic) => (lic.id === id ? { ...lic, status: newStatus } : lic)),
    )

    if (selectedLicitacao && selectedLicitacao.id === id) {
      setSelectedLicitacao((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const handleOrgaoUpdate = (orgaoAtualizado: Orgao) => {
    // In a real app, this would update the orgao in the database
    console.log("Órgão atualizado:", orgaoAtualizado)
    
    // Update the licitacoes list with the new orgao name if it changed
    if (orgaoAtualizado.nome !== selectedOrgao?.nome) {
      setLicitacoes(prev => 
        prev.map(lic => 
          lic.orgao === selectedOrgao?.nome 
            ? { ...lic, orgao: orgaoAtualizado.nome } 
            : lic
        )
      )
    }
    
    // Update the selected orgao
    setSelectedOrgao(orgaoAtualizado)
  }

  const handleOrgaoDelete = (orgao: Orgao) => {
    // In a real app, this would delete the orgao from the database
    console.log("Órgão excluído:", orgao)
    
    // Remove licitacoes related to this orgao
    setLicitacoes(prev => 
      prev.filter(lic => lic.orgao !== orgao.nome)
    )
    
    // Update the filtered licitacoes
    applyFilters()
  }

  const handleLicitacaoUpdate = (licitacaoAtualizada: Licitacao) => {
    // In a real app, this would update the licitacao in the database
    console.log("Licitau00e7u00e3o atualizada:", licitacaoAtualizada)
    
    // Update the licitacoes list
    setLicitacoes(prev => 
      prev.map(lic => 
        lic.id === licitacaoAtualizada.id 
          ? { ...licitacaoAtualizada } 
          : lic
      )
    )
    
    // Apply filters to update the filtered list
    applyFilters()
  }

  const handleLicitacaoDelete = (licitacao: Licitacao) => {
    // In a real app, this would delete the licitacao from the database
    console.log("Licitau00e7u00e3o excluu00edda:", licitacao)
    
    // Remove the licitacao from the list
    setLicitacoes(prev => 
      prev.filter(lic => lic.id !== licitacao.id)
    )
    
    // Apply filters to update the filtered list
    applyFilters()
  }

  const handleLicitacaoClick = (licitacao: Licitacao) => {
    setSelectedLicitacao(licitacao)
    setDetailsOpen(true)
  }

  // Funu00e7u00e3o para excluir uma licitau00e7u00e3o
  const handleDeleteLicitacao = (id: string) => {
    setLicitacaoToDelete(id)
    setShowConfirmDelete(true)
  }

  // Funu00e7u00e3o para confirmar a exclusu00e3o
  const confirmDeleteLicitacao = () => {
    if (licitacaoToDelete) {
      setLicitacoes(licitacoes.filter(item => item.id !== licitacaoToDelete))
      setFilteredLicitacoes(filteredLicitacoes.filter(item => item.id !== licitacaoToDelete))
      setShowConfirmDelete(false)
      setLicitacaoToDelete(null)
      toast({
        title: "Licitau00e7u00e3o excluu00edda",
        description: "A licitau00e7u00e3o foi excluu00edda com sucesso.",
      })
    }
  }

  // Funu00e7u00e3o para editar uma licitau00e7u00e3o
  const handleEditLicitacao = (licitacao: Licitacao) => {
    setSelectedLicitacao(licitacao)
    setShowEditarLicitacao(true)
    setDetailsOpen(true)
  }

  // Funu00e7u00e3o para baixar o edital
  const handleDownloadEdital = (licitacao: Licitacao) => {
    // Simulau00e7u00e3o de download do edital
    toast({
      title: "Download iniciado",
      description: `O edital da licitau00e7u00e3o ${licitacao.titulo} estu00e1 sendo baixado.`,
    })
  }

  // Funu00e7u00e3o para compartilhar licitau00e7u00e3o
  const handleShareLicitacao = (licitacao: Licitacao) => {
    // Simulau00e7u00e3o de compartilhamento
    toast({
      title: "Licitau00e7u00e3o compartilhada",
      description: `Um link para compartilhar a licitau00e7u00e3o foi copiado para a u00e1rea de transferu00eancia.`,
    })
  }

  // Funu00e7u00e3o para enviar email relacionado u00e0 licitau00e7u00e3o
  const handleSendEmail = (licitacao: Licitacao) => {
    // Simulau00e7u00e3o de envio de email
    toast({
      title: "Email agendado",
      description: `Um email seru00e1 enviado para o u00f3rgu00e3o ${licitacao.orgao}.`,
    })
  }

  // Funu00e7u00e3o para agendar ligau00e7u00e3o
  const handleScheduleCall = (licitacao: Licitacao) => {
    // Simulau00e7u00e3o de agendamento de ligau00e7u00e3o
    toast({
      title: "Ligau00e7u00e3o agendada",
      description: `Uma ligau00e7u00e3o foi agendada para o u00f3rgu00e3o ${licitacao.orgao}.`,
    })
  }

  // Funu00e7u00e3o para marcar como ganho
  const handleMarkAsWon = (licitacao: Licitacao) => {
    const updatedLicitacoes = licitacoes.map(item => {
      if (item.id === licitacao.id) {
        return { ...item, status: "Ganho" }
      }
      return item
    })
    setLicitacoes(updatedLicitacoes)
    applyFilters()
    toast({
      title: "Licitau00e7u00e3o atualizada",
      description: "A licitau00e7u00e3o foi marcada como ganha.",
    })
  }

  // Funu00e7u00e3o para marcar como perdido
  const handleMarkAsLost = (licitacao: Licitacao) => {
    const updatedLicitacoes = licitacoes.map(item => {
      if (item.id === licitacao.id) {
        return { ...item, status: "Perdido" }
      }
      return item
    })
    setLicitacoes(updatedLicitacoes)
    applyFilters()
    toast({
      title: "Licitau00e7u00e3o atualizada",
      description: "A licitau00e7u00e3o foi marcada como perdida.",
      variant: "destructive"
    })
  }

  // Mapeamento de status para garantir compatibilidade
  const statusMapping: Record<string, string> = {
    // Mapeamento de status de licitações para status comerciais
    analise_interna: "novo_lead",
    aguardando_pregao: "levantamento_oportunidades",
    envio_documentos: "proposta_enviada",
    assinaturas: "negociacao",
    vencida: "fechado_ganho",
    nao_vencida: "fechado_perdido",
    concluida: "fechado_ganho",
  }

  return (
    <div className="p-4 md:p-6 overflow-hidden">
      <h1 className="text-2xl font-bold mb-6">Licitações</h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">{licitacoesAtivas}</div>
            <div className="text-sm text-muted-foreground">Licitações ativas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">{licitacoesVencidas}</div>
            <div className="text-sm text-muted-foreground">Licitações vencidas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">
              {totalEmLicitacoes.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-sm text-muted-foreground">R$ total em licitações</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">{taxaSucesso}%</div>
            <div className="text-sm text-muted-foreground">Taxa de sucesso</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">{pregoesEssaSemana}</div>
            <div className="text-sm text-muted-foreground">Pregões essa semana</div>
          </CardContent>
        </Card>
      </div>

      {/* Abas e Filtros */}
      <div className="flex flex-col gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
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
              <FiltroLicitacoesOtimizado 
                onFilterChange={handleFilterChange}
                orgaos={orgaos}
                responsaveis={responsaveis}
                modalidades={modalidades}
              />
              <NovaLicitacao
                onLicitacaoAdded={(novaLicitacao: Licitacao) => {
                  setLicitacoes((prev) => [novaLicitacao, ...prev])
                }}
              />
            </div>
          </div>

          {/* Conteúdo das abas */}
          <TabsContent value="lista">
            <div className="bg-white rounded-md border shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Lista de Licitações</h2>
                <p className="text-sm text-muted-foreground">Gerenciamento de todas as licitações cadastradas</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Título</th>
                      <th className="text-left p-4 font-medium">Órgão</th>
                      <th className="text-left p-4 font-medium">Valor</th>
                      <th className="text-left p-4 font-medium">Responsável</th>
                      <th className="text-left p-4 font-medium">Data de Abertura</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLicitacoes.map((licitacao) => (
                      <tr
                        key={licitacao.id}
                        className="border-b cursor-pointer hover:bg-gray-50"
                        onClick={() => handleLicitacaoClick(licitacao)}
                      >
                        <td className="p-4">{licitacao.titulo}</td>
                        <td className="p-4">
                          <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOrgaoClick(licitacao.orgao)
                            }}
                          >
                            {licitacao.orgao}
                          </Button>
                        </td>
                        <td className="p-4">{licitacao.valorEstimado.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</td>
                        <td className="p-4">{licitacao.responsavel}</td>
                        <td className="p-4">
                          <span
                            className={
                              licitacao.status === "Em andamento"
                                ? "text-blue-500"
                                : licitacao.status === "Encerrado"
                                  ? "text-red-500"
                                  : "text-green-500"
                            }
                          >
                            {licitacao.dataAbertura}
                          </span>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={licitacao.status} />
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
                              <DropdownMenuLabel>Au00e7u00f5es</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditLicitacao(licitacao)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteLicitacao(licitacao.id)
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
                                  handleDownloadEdital(licitacao)
                                }}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Baixar Edital
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleShareLicitacao(licitacao)
                                }}
                              >
                                <Share2 className="mr-2 h-4 w-4" />
                                Compartilhar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSendEmail(licitacao)
                                }}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleScheduleCall(licitacao)
                                }}
                              >
                                <Phone className="mr-2 h-4 w-4" />
                                Agendar Ligau00e7u00e3o
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsWon(licitacao)
                                }}
                                disabled={licitacao.status === "Ganho"}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Marcar como Ganho
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsLost(licitacao)
                                }}
                                disabled={licitacao.status === "Perdido"}
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
              <h2 className="text-lg font-semibold mb-4">Kanban de Licitações</h2>
              <LicitacaoKanbanBoard
                licitacoes={filteredLicitacoes}
                onUpdateStatus={handleUpdateStatus}
                onLicitacaoClick={(licitacao) => handleLicitacaoClick(licitacao)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals/Drawers */}
      {selectedLicitacao && detailsOpen ? (
        <DetalhesLicitacao
          key={`licitacao-${selectedLicitacao.id}`}
          licitacao={selectedLicitacao}
          open={detailsOpen}
          onOpenChange={(open) => {
            setDetailsOpen(open)
            if (!open) {
              setTimeout(() => {
                setSelectedLicitacao(null)
              }, 300)
            }
          }}
          onUpdateStatus={handleUpdateStatus}
          onOrgaoClick={handleOrgaoClick}
          onLicitacaoUpdate={handleLicitacaoUpdate}
          onLicitacaoDelete={handleLicitacaoDelete}
        />
      ) : null}

      {selectedOrgao && orgaoDetailsOpen ? (
        <DetalhesOrgao
          key={`orgao-${selectedOrgao.id}`}
          orgao={selectedOrgao}
          open={orgaoDetailsOpen}
          onOpenChange={(open) => {
            setOrgaoDetailsOpen(open)
            if (!open) {
              setTimeout(() => {
                setSelectedOrgao(null)
              }, 300)
            }
          }}
          onOrgaoUpdate={handleOrgaoUpdate}
          onOrgaoDelete={handleOrgaoDelete}
        />
      ) : null}
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta licitação? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteLicitacao}>
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
    "Em andamento": { label: "Em andamento", class: "bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs" },
    "Encerrado": { label: "Encerrado", class: "bg-red-100 text-red-800 rounded-full px-3 py-1 text-xs" },
    "Aguardando documentação": { label: "Aguardando documentação", class: "bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-xs" },
    "Em análise": { label: "Em análise", class: "bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-xs" },
    "Publicado": { label: "Publicado", class: "bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs" },
  }

  const config = statusConfig[status] || {
    label: status,
    class: "bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs",
  }

  return <span className={config.class}>{config.label}</span>
}
