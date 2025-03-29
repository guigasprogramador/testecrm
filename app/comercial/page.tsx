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
// Importações para os componentes de formulário
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// Importar os hooks do backend
import { useOportunidades, useClientes, useResponsaveis } from "@/hooks/comercial"
import { Oportunidade as OportunidadeTipo, Cliente as ClienteTipo, OportunidadeStatus } from "@/types/comercial"
import { NovoCliente } from "@/components/comercial/novo-cliente"
import { AgendarReuniao } from "@/components/comercial/agendar-reuniao"
import { EditarOportunidade } from "@/components/comercial/editar-oportunidade"

export default function ComercialPage() {
  // Usar os hooks do backend
  const {
    oportunidades,
    isLoading: isLoadingOportunidades,
    error: errorOportunidades,
    fetchOportunidades,
    getOportunidade,
    createOportunidade,
    updateOportunidade,
    updateOportunidadeStatus,
    deleteOportunidade,
  } = useOportunidades();

  const {
    clientes,
    isLoading: isLoadingClientes,
    error: errorClientes,
    getCliente,
    createCliente,
    fetchClientes,
    setClientes, // Adicione essa linha
  } = useClientes();

  const {
    responsaveis,
    isLoading: isLoadingResponsaveis,
  } = useResponsaveis();

  const [filteredOportunidades, setFilteredOportunidades] = useState<OportunidadeTipo[]>([])
  const [activeTab, setActiveTab] = useState("lista")
  const [selectedOportunidade, setSelectedOportunidade] = useState<OportunidadeTipo | null>(null)
  const [selectedCliente, setSelectedCliente] = useState<ClienteTipo | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [clienteDetailsOpen, setClienteDetailsOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)
  const [showNovaOportunidade, setShowNovaOportunidade] = useState(false)
  const [showEditarOportunidade, setShowEditarOportunidade] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [oportunidadeToDelete, setOportunidadeToDelete] = useState<string | null>(null)
  
  // Estados para controlar modais das ações
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [showEditarModal, setShowEditarModal] = useState(false)
  const [tempOportunidade, setTempOportunidade] = useState<OportunidadeTipo | null>(null)

  // Atualizar oportunidades filtradas quando as oportunidades mudarem
  useEffect(() => {
    setFilteredOportunidades(oportunidades);
  }, [oportunidades]);

  // Carregar oportunidades e clientes na inicialização
  useEffect(() => {
    console.log("Carregando dados iniciais...");
    fetchOportunidades();
    fetchClientes();
  }, []);

  // Função para aplicar filtros otimizados
  const handleFilterChange = (filtros: OportunidadeFiltros) => {
    // Converter para o formato esperado pelo hook
    const backendFiltros = {
      termo: filtros.termo,
      status: filtros.status,
      cliente: filtros.cliente,
      responsavel: filtros.responsavel,
      dataInicio: filtros.dataInicio,
      dataFim: filtros.dataFim,
    };
    
    // Usar a API para buscar com filtros
    fetchOportunidades(backendFiltros);
    
    // Contar filtros ativos para exibição visual
    let activeFilterCount = 0;
    if (filtros.termo) activeFilterCount++;
    if (filtros.status !== "todos") activeFilterCount++;
    if (filtros.cliente !== "todos") activeFilterCount++;
    if (filtros.responsavel !== "todos") activeFilterCount++;
    if (filtros.dataInicio) activeFilterCount++;
    if (filtros.dataFim) activeFilterCount++;
    
    setActiveFilters(activeFilterCount);
  };

  // Função para lidar com a adição de uma nova oportunidade
  const handleOportunidadeAdded = async (oportunidade: any) => {
    try {
      await createOportunidade(oportunidade);
      setShowNovaOportunidade(false);
      toast({
        title: "Oportunidade criada",
        description: "A oportunidade foi criada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar oportunidade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para lidar com a adição de um novo cliente
  const handleClienteAdded = async (cliente: Partial<ClienteTipo>) => {
    try {
      await createCliente(cliente);
      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso.",
      });
      // Recarregar a lista de clientes após adicionar um novo
      fetchClientes();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para lidar com a atualização de uma oportunidade
  const handleOportunidadeUpdated = async (id: string, data: Partial<OportunidadeTipo>) => {
    try {
      const updated = await updateOportunidade(id, data);
      setSelectedOportunidade(updated);
      toast({
        title: "Oportunidade atualizada",
        description: "A oportunidade foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar oportunidade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para lidar com a exclusão de uma oportunidade
  const handleDeleteOportunidade = async () => {
    if (!oportunidadeToDelete) return;

    try {
      await deleteOportunidade(oportunidadeToDelete);
      setShowConfirmDelete(false);
      setOportunidadeToDelete(null);
      
      if (selectedOportunidade?.id === oportunidadeToDelete) {
        setSelectedOportunidade(null);
        setDetailsOpen(false);
      }
      
      toast({
        title: "Oportunidade excluída",
        description: "A oportunidade foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir oportunidade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para atualizar o status de uma oportunidade (usado no Kanban)
  const handleUpdateStatus = async (id: string, newStatus: OportunidadeStatus) => {
    try {
      await updateOportunidadeStatus(id, newStatus);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da oportunidade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para abrir os detalhes de uma oportunidade
  const handleOportunidadeClick = async (oportunidadeId: string) => {
    try {
      // Verificar primeiro se a oportunidade está no estado atual
      let oportunidadeEncontrada = oportunidades.find((o) => o.id === oportunidadeId);

      // Se não encontrada no estado, tentar buscar na API
      if (!oportunidadeEncontrada) {
        try {
          const fetchedOportunidade = await getOportunidade(oportunidadeId);
          if (fetchedOportunidade) {
            oportunidadeEncontrada = fetchedOportunidade;
          }
        } catch (error) {
          console.error("Erro ao buscar oportunidade:", error);
        }
      }

      if (oportunidadeEncontrada) {
        // Se algum outro detalhe já está aberto, fechar primeiro
        if (clienteDetailsOpen) {
          setClienteDetailsOpen(false);
          
          // Agendar a abertura dos detalhes da oportunidade após um curto delay
          setTimeout(() => {
            setSelectedOportunidade(oportunidadeEncontrada);
            setDetailsOpen(true);
          }, 300);
        } else {
          // Abrir diretamente os detalhes
          setSelectedOportunidade(oportunidadeEncontrada);
          setDetailsOpen(true);
        }
      } else {
        console.error("Oportunidade não encontrada");
        toast({
          title: "Oportunidade não encontrada",
          description: "Não foi possível encontrar os detalhes desta oportunidade.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao buscar oportunidade:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar os detalhes da oportunidade.",
        variant: "destructive"
      });
    }
  };

  // Função para visualizar detalhes do cliente
  const handleClienteClick = async (clienteId: string) => {
    try {
      // Verificar primeiro se o cliente está no estado atual
      let clienteEncontrado = clientes.find((c) => c.id === clienteId);
      
      // Se não encontrado no estado, tentar buscar na API
      if (!clienteEncontrado) {
        try {
          const response = await fetch(`/api/comercial/clientes/${clienteId}`);
          if (response.ok) {
            clienteEncontrado = await response.json();
          }
        } catch (error) {
          console.error("Erro ao buscar cliente por ID:", error);
        }
        
        // Se ainda não encontrado, buscar na lista completa de clientes
        if (!clienteEncontrado) {
          try {
            const response = await fetch("/api/comercial/clientes");
            if (response.ok) {
              const todosClientes = await response.json();
              
              // Tentar encontrar por ID ou nome
              clienteEncontrado = todosClientes.find(
                (c: ClienteTipo) => c.id === clienteId || c.nome === clienteId
              );
              
              if (clienteEncontrado) {
                // Atualizar o estado dos clientes com todos os clientes
                setClientes(todosClientes);
              }
            }
          } catch (error) {
            console.error("Erro ao buscar lista completa de clientes:", error);
          }
        }
      }
      
      // Se encontrou o cliente
      if (clienteEncontrado) {
        // Se algum modal de detalhes já está aberto, fechar antes de abrir o de cliente
        if (detailsOpen || clienteDetailsOpen) {
          // Fechar todos os detalhes abertos
          setDetailsOpen(false);
          setClienteDetailsOpen(false);
          
          // Agendar a abertura dos detalhes do cliente após um curto delay
          setTimeout(() => {
            setSelectedCliente(clienteEncontrado);
            setClienteDetailsOpen(true);
          }, 300);
        } else {
          // Abrir diretamente se nenhum detalhe estiver aberto
          setSelectedCliente(clienteEncontrado);
          setClienteDetailsOpen(true);
        }
      } else {
        console.error("Cliente não encontrado");
        toast({
          title: "Cliente não encontrado",
          description: "Não foi possível encontrar os detalhes deste cliente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar os detalhes do cliente.",
        variant: "destructive"
      });
    }
  };

  // Função para editar uma oportunidade (ainda não implementada corretamente)
  const handleOportunidadeEditar = (oportunidade: OportunidadeTipo) => {
    console.log("Editando oportunidade:", oportunidade);
    
    // Armazenar a oportunidade temporariamente e abrir o modal
    setTempOportunidade(oportunidade);
    setShowEditarModal(true);
  };

  // Função para enviar e-mail relacionado a uma oportunidade
  const handleSendEmail = (oportunidade: OportunidadeTipo) => {
    console.log("Enviando email para oportunidade:", oportunidade);
    
    // Armazenar a oportunidade temporariamente e abrir o modal
    setTempOportunidade(oportunidade);
    setShowEmailModal(true);
    
    // O toast será exibido após a ação no modal
  };

  // Função para agendar uma ligação
  const handleScheduleCall = (oportunidade: OportunidadeTipo) => {
    console.log("Agendando ligação para oportunidade:", oportunidade);
    
    // Armazenar a oportunidade temporariamente e abrir o modal
    setTempOportunidade(oportunidade);
    setShowCallModal(true);
    
    // O toast será exibido após a ação no modal
  };

  // Função para agendar uma reunião
  const handleScheduleMeeting = (oportunidade: OportunidadeTipo) => {
    console.log("Agendando reunião para oportunidade:", oportunidade);
    
    // Armazenar a oportunidade temporariamente e abrir o modal
    setTempOportunidade(oportunidade);
    setShowMeetingModal(true);
  };

  // Função para atualizar cliente
  const handleClienteUpdate = (cliente: ClienteTipo) => {
    console.log("Atualizando cliente:", cliente);
    // Implementar atualização do cliente
    toast({
      title: "Cliente atualizado",
      description: "O cliente foi atualizado com sucesso."
    });
  };

  // Função para excluir cliente
  const handleClienteDelete = (cliente: ClienteTipo) => {
    console.log("Excluindo cliente:", cliente);
    // Implementar exclusão do cliente
    toast({
      title: "Cliente excluído",
      description: "O cliente foi excluído com sucesso."
    });
  };

  // Renderização condicional para estado de carregamento
  if (isLoadingOportunidades && oportunidades.length === 0) {
    return <div className="flex justify-center items-center h-[calc(100vh-200px)]">Carregando oportunidades...</div>;
  }

  // Renderização condicional para erros
  if (errorOportunidades) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium">Erro ao carregar oportunidades</h3>
          <p className="text-sm text-gray-500 mt-2">{errorOportunidades}</p>
          <Button onClick={() => fetchOportunidades()} className="mt-4">Tentar novamente</Button>
        </div>
      </div>
    );
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
                clientes={clientes.map(c => c.nome)}
                responsaveis={responsaveis.map(r => r.nome)}
              />
              <NovoCliente 
                onClienteAdded={(novoCliente) => {
                  handleClienteAdded(novoCliente)
                }}
              />
              <NovaOportunidade
                onOportunidadeAdded={(novaOportunidade) => {
                  handleOportunidadeAdded(novaOportunidade)
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
                          handleOportunidadeClick(oportunidade.id)
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
                                  handleOportunidadeEditar(oportunidade)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
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
                                  setOportunidadeToDelete(oportunidade.id)
                                  setShowConfirmDelete(true)
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
                                  handleUpdateStatus(oportunidade.id, "fechado_ganho")
                                }}
                                disabled={oportunidade.status === "fechado_ganho"}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Marcar como Ganho
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpdateStatus(oportunidade.id, "fechado_perdido")
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
              <KanbanBoard 
                oportunidades={filteredOportunidades} 
                onUpdateStatus={(id: string, newStatus: string) => {
                  // Convert string to OportunidadeStatus
                  handleUpdateStatus(id, newStatus as OportunidadeStatus);
                }} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modais/Drawers */}
      {selectedOportunidade && (
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
          onClienteClick={(clienteNome) => {
            setDetailsOpen(false);
            setTimeout(() => {
              handleClienteClick(clienteNome);
            }, 300);
          }}
        />
      )}

      {selectedCliente && (
        <DetalhesCliente
          cliente={selectedCliente}
          open={clienteDetailsOpen}
          onOpenChange={setClienteDetailsOpen}
          onClienteUpdate={handleClienteUpdate}
          onClienteDelete={handleClienteDelete}
          onOportunidadeClick={(oportunidade) => handleOportunidadeClick(oportunidade.id)}
        />
      )}

      {/* Modal de Envio de Email */}
      {tempOportunidade && showEmailModal && (
        <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Enviar Email</DialogTitle>
              <DialogDescription>
                Envie um email para o cliente relacionado a esta oportunidade.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="emailTo" className="text-right sm:text-left col-span-4 sm:col-span-1">
                  Para
                </Label>
                <Input
                  id="emailTo"
                  defaultValue={tempOportunidade.cliente}
                  className="col-span-4 sm:col-span-3"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="emailSubject" className="text-right sm:text-left col-span-4 sm:col-span-1">
                  Assunto
                </Label>
                <Input
                  id="emailSubject"
                  defaultValue={`Proposta: ${tempOportunidade.titulo}`}
                  className="col-span-4 sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="emailBody" className="text-right sm:text-left col-span-4 sm:col-span-1">
                  Mensagem
                </Label>
                <Textarea
                  id="emailBody"
                  placeholder="Digite sua mensagem aqui..."
                  className="col-span-4 sm:col-span-3"
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEmailModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Email enviado",
                  description: `Email enviado para ${tempOportunidade.cliente}`,
                });
                setShowEmailModal(false);
              }}>
                Enviar Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Agendamento de Ligação */}
      {tempOportunidade && showCallModal && (
        <Dialog open={showCallModal} onOpenChange={setShowCallModal}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Agendar Ligação</DialogTitle>
              <DialogDescription>
                Agende uma ligação para o cliente relacionado a esta oportunidade.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="callContact" className="text-right sm:text-left col-span-4 sm:col-span-1">
                  Contato
                </Label>
                <Input
                  id="callContact"
                  defaultValue={tempOportunidade.cliente}
                  className="col-span-4 sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="callDate" className="text-right sm:text-left col-span-4 sm:col-span-1">
                  Data
                </Label>
                <Input
                  id="callDate"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="col-span-4 sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="callTime" className="text-right sm:text-left col-span-4 sm:col-span-1">
                  Hora
                </Label>
                <Input
                  id="callTime"
                  type="time"
                  defaultValue="10:00"
                  className="col-span-4 sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="callNotes" className="text-right sm:text-left col-span-4 sm:col-span-1">
                  Anotações
                </Label>
                <Textarea
                  id="callNotes"
                  placeholder="Tópicos a serem discutidos..."
                  className="col-span-4 sm:col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCallModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Ligação agendada",
                  description: `Ligação agendada para ${tempOportunidade.cliente}`,
                });
                setShowCallModal(false);
              }}>
                Agendar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Agendamento de Reunião usando o componente AgendarReuniao */}
      {tempOportunidade && showMeetingModal && (
        <AgendarReuniao
          open={showMeetingModal}
          onOpenChange={setShowMeetingModal}
          oportunidade={tempOportunidade}
          onReuniaoAgendada={(reuniao) => {
            console.log("Reunião agendada:", reuniao);
            // Aqui você pode atualizar o estado da aplicação se necessário
            // Por exemplo, adicionar a reunião a uma lista de reuniões
          }}
        />
      )}

      {/* Modal de Edição de Oportunidade */}
      {tempOportunidade && showEditarModal && (
        <EditarOportunidade
          open={showEditarModal}
          onOpenChange={setShowEditarModal}
          oportunidade={tempOportunidade}
          onOportunidadeUpdated={handleOportunidadeUpdated}
          clientes={clientes.map(c => c.nome)}
          responsaveis={responsaveis.map(r => r.nome)}
        />
      )}

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
            <Button variant="destructive" onClick={handleDeleteOportunidade}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatusBadge({ status }: { status: OportunidadeStatus }) {
  const statusConfig: Record<OportunidadeStatus, { label: string; class: string }> = {
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

function getStatusLabel(status: OportunidadeStatus): string {
  const statusLabels: Record<OportunidadeStatus, string> = {
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
