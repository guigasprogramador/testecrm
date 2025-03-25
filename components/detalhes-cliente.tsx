"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Hash, Phone, Mail, User, Users, Pencil, Save, Trash2, Plus, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface Contato {
  id: string
  nome: string
  cargo: string
  email: string
  telefone: string
}

interface Cliente {
  nome: string
  tipo?: string
  cnpj?: string
  endereco?: string
  cidade?: string
  estado?: string
  contatos?: Contato[]
  [key: string]: any
}

interface DetalhesClienteProps {
  cliente: Cliente | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClienteUpdate?: (cliente: Cliente) => void
  onClienteDelete?: (cliente: Cliente) => void
}

// Mock data for tipos de cliente
const tiposCliente = ["Órgão Público", "Empresa Privada", "Autarquia", "Fundação", "Outro"]

// Mock data for estados brasileiros
const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", 
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]

export function DetalhesCliente({ cliente, open, onOpenChange, onClienteUpdate, onClienteDelete }: DetalhesClienteProps) {
  const [activeTab, setActiveTab] = useState("resumo")
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [novoContato, setNovoContato] = useState(false)
  const [editingContato, setEditingContato] = useState<string | null>(null)

  // Cliente data state
  const [clienteData, setClienteData] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState<Cliente | null>(null)

  // Simplified client data
  useEffect(() => {
    if (cliente) {
      // If we have real data, use it
      const clienteInfo = {
        nome: cliente.nome,
        tipo: cliente.tipo || "Órgão Público",
        cnpj: cliente.cnpj || "12.345.678/0001-90",
        endereco: cliente.endereco || "Viaduto do Chá, 15",
        cidade: cliente.cidade || "São Paulo",
        estado: cliente.estado || "SP",
        contatos: cliente.contatos || [
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
      setClienteData(clienteInfo)
      setFormData(clienteInfo)
    }
  }, [cliente])

  // Reset active tab and editing state when opening the sheet
  useEffect(() => {
    if (open) {
      setActiveTab("resumo")
      setIsEditing(false)
      setNovoContato(false)
      setEditingContato(null)
    }
  }, [open])

  if (!clienteData || !formData) return null

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => prev ? { ...prev, [name]: value } : null)
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => prev ? { ...prev, [name]: value } : null)
  }

  // Handle contact form changes
  const handleContatoChange = (id: string, field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null
      const updatedContatos = prev.contatos?.map(contato => 
        contato.id === id ? { ...contato, [field]: value } : contato
      )
      return { ...prev, contatos: updatedContatos }
    })
  }

  // Add new contact
  const addContato = () => {
    setFormData(prev => {
      if (!prev) return null
      const newContato = {
        id: `c${Date.now()}`,
        nome: "",
        cargo: "",
        email: "",
        telefone: ""
      }
      return { 
        ...prev, 
        contatos: [...(prev.contatos || []), newContato] 
      }
    })
    setNovoContato(true)
  }

  // Remove contact
  const removeContato = (id: string) => {
    setFormData(prev => {
      if (!prev) return null
      return { 
        ...prev, 
        contatos: prev.contatos?.filter(contato => contato.id !== id) 
      }
    })
    setEditingContato(null)
  }

  // Save changes
  const saveChanges = () => {
    if (formData) {
      setClienteData(formData)
      setIsEditing(false)
      setNovoContato(false)
      setEditingContato(null)
      if (onClienteUpdate) {
        onClienteUpdate(formData)
      }
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      })
    }
  }

  // Cancel editing
  const cancelEditing = () => {
    setFormData(clienteData)
    setIsEditing(false)
    setNovoContato(false)
    setEditingContato(null)
  }

  // Delete client
  const deleteCliente = () => {
    if (clienteData && onClienteDelete) {
      onClienteDelete(clienteData)
      setDeleteDialogOpen(false)
      onOpenChange(false)
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
        variant: "destructive"
      })
    }
  }

  return (
    <>
      <Sheet
        key={`client-sheet-${cliente?.nome || "empty"}`}
        open={open}
        onOpenChange={(newOpen) => {
          // Only call onOpenChange if it's actually changing
          if (open !== newOpen) {
            onOpenChange(newOpen)
          }
        }}
      >
        <SheetContent className="w-full md:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <div className="flex justify-between items-center">
              <SheetTitle className="text-xl flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-500" />
                {isEditing ? (
                  <Input 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleInputChange} 
                    className="h-7 text-xl font-semibold"
                  />
                ) : (
                  clienteData.nome
                )}
              </SheetTitle>
              {!isEditing ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={cancelEditing}>
                    <X className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={saveChanges}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mt-2">
                {isEditing ? (
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="tipo" className="text-xs">Tipo:</Label>
                      <Select 
                        value={formData.tipo} 
                        onValueChange={(value) => handleSelectChange("tipo", value)}
                      >
                        <SelectTrigger className="h-7 w-40">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposCliente.map(tipo => (
                            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="cnpj" className="text-xs">CNPJ:</Label>
                      <Input 
                        id="cnpj" 
                        name="cnpj" 
                        value={formData.cnpj} 
                        onChange={handleInputChange} 
                        className="h-7 w-40"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Badge variant="outline">{clienteData.tipo}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {clienteData.cnpj}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="contatos">Contatos</TabsTrigger>
              <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
            </TabsList>

            <TabsContent value="resumo">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input 
                          id="nome" 
                          name="nome" 
                          value={formData.nome} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input 
                          id="cnpj" 
                          name="cnpj" 
                          value={formData.cnpj} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipo">Tipo</Label>
                        <Select 
                          value={formData.tipo} 
                          onValueChange={(value) => handleSelectChange("tipo", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposCliente.map(tipo => (
                              <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input 
                          id="endereco" 
                          name="endereco" 
                          value={formData.endereco} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="cidade">Cidade</Label>
                          <Input 
                            id="cidade" 
                            name="cidade" 
                            value={formData.cidade} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estado">Estado</Label>
                          <Select 
                            value={formData.estado} 
                            onValueChange={(value) => handleSelectChange("estado", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="UF" />
                            </SelectTrigger>
                            <SelectContent>
                              {estados.map(estado => (
                                <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Informações Básicas</h3>
                        <p className="text-sm">
                          <strong>Nome:</strong> {clienteData.nome}
                        </p>
                        <p className="text-sm">
                          <strong>CNPJ:</strong> {clienteData.cnpj}
                        </p>
                        <p className="text-sm">
                          <strong>Tipo:</strong> {clienteData.tipo}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Endereço</h3>
                        <p className="text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {clienteData.endereco}, {clienteData.cidade} - {clienteData.estado}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contatos">
              <div className="space-y-3">
                {formData.contatos?.map((contato) => (
                  <Card key={contato.id}>
                    <CardContent className="pt-6">
                      {isEditing || editingContato === contato.id ? (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <Label htmlFor={`nome-${contato.id}`}>Nome</Label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeContato(contato.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                          <Input 
                            id={`nome-${contato.id}`} 
                            value={contato.nome} 
                            onChange={(e) => handleContatoChange(contato.id, "nome", e.target.value)} 
                          />
                          <Label htmlFor={`cargo-${contato.id}`}>Cargo</Label>
                          <Input 
                            id={`cargo-${contato.id}`} 
                            value={contato.cargo} 
                            onChange={(e) => handleContatoChange(contato.id, "cargo", e.target.value)} 
                          />
                          <Label htmlFor={`email-${contato.id}`}>Email</Label>
                          <Input 
                            id={`email-${contato.id}`} 
                            value={contato.email} 
                            onChange={(e) => handleContatoChange(contato.id, "email", e.target.value)} 
                          />
                          <Label htmlFor={`telefone-${contato.id}`}>Telefone</Label>
                          <Input 
                            id={`telefone-${contato.id}`} 
                            value={contato.telefone} 
                            onChange={(e) => handleContatoChange(contato.id, "telefone", e.target.value)} 
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <h4 className="font-medium">{contato.nome}</h4>
                            </div>
                            {!isEditing && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setEditingContato(contato.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          {contato.cargo && <p className="text-sm text-gray-500">{contato.cargo}</p>}
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span>{contato.email}</span>
                            </div>
                            {contato.telefone && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <Phone className="w-3 h-3" />
                                <span>{contato.telefone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {isEditing && (
                  <Button 
                    variant="outline" 
                    className="w-full py-6 border-dashed" 
                    onClick={addContato}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Contato
                  </Button>
                )}

                {!isEditing && formData.contatos?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>Nenhum contato cadastrado</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="oportunidades">
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>Oportunidades relacionadas a este cliente</p>
                <p className="text-sm mt-1">Nenhuma oportunidade encontrada</p>
              </div>
            </TabsContent>
          </Tabs>

          {isEditing && (
            <SheetFooter className="mt-6 flex justify-between">
              <Button 
                variant="destructive" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Cliente
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={cancelEditing}>
                  Cancelar
                </Button>
                <Button onClick={saveChanges}>
                  Salvar Alterações
                </Button>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Cliente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteCliente}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
