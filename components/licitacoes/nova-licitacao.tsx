"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Plus, CalendarIcon, Save, LinkIcon, FileText, Calculator, Mail, Clock } from "lucide-react"

interface NovaLicitacaoProps {
  onLicitacaoAdded?: (licitacao: any) => void
}

export function NovaLicitacao({ onLicitacaoAdded }: NovaLicitacaoProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dados-basicos")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
    nome: "",
    orgao: "",
    descricao: "",
    numeroEdital: "",
    modalidade: "pregao_eletronico",
    valorEstimado: "",
    valorProposta: "",
    margemLucro: "",
    contatoNome: "",
    contatoTelefone: "",
    contatoEmail: "",
    urlLicitacao: "",
    status: "analise_interna",
    tipo: "", // Produto ou Serviço
    tipoFaturamento: "", // Direto ou Distribuidor (apenas para Produto)
  })

  // Estados para datas
  const [dataPublicacao, setDataPublicacao] = useState<Date | undefined>()
  const [prazoEnvio, setPrazoEnvio] = useState<Date | undefined>()
  const [dataJulgamento, setDataJulgamento] = useState<Date | undefined>()

  // Estados para documentos e responsáveis
  const [documentosNecessarios, setDocumentosNecessarios] = useState([
    { id: "doc1", nome: "Certidão Negativa de Débitos", selecionado: false },
    { id: "doc2", nome: "Atestado de Capacidade Técnica", selecionado: false },
    { id: "doc3", nome: "Contrato Social", selecionado: false },
    { id: "doc4", nome: "Balanço Patrimonial", selecionado: false },
    { id: "doc5", nome: "Certidão FGTS", selecionado: false },
    { id: "doc6", nome: "Certidão Municipal", selecionado: false },
    { id: "doc7", nome: "Certidão Estadual", selecionado: false },
    { id: "doc8", nome: "Certidão Federal", selecionado: false },
  ])

  const [responsaveis, setResponsaveis] = useState([
    { id: "resp1", nome: "Ana Silva", selecionado: false },
    { id: "resp2", nome: "Carlos Oliveira", selecionado: false },
    { id: "resp3", nome: "Pedro Santos", selecionado: false },
    { id: "resp4", nome: "Maria Souza", selecionado: false },
  ])

  // Estado para arquivos anexados
  const [arquivosAnexados, setArquivosAnexados] = useState<File[]>([])

  // Estado para simulação de impostos
  const [impostos, setImpostos] = useState({
    iss: "5",
    icms: "18",
    pisCofins: "3.65",
    ir: "1.5",
    csll: "1",
  })

  // Estado para criar evento no calendário
  const [criarEvento, setCriarEvento] = useState(true)
  const [enviarNotificacoes, setEnviarNotificacoes] = useState(true)

  // Funções de manipulação de formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDocumentoChange = (id: string, checked: boolean) => {
    setDocumentosNecessarios(
      documentosNecessarios.map((doc) => (doc.id === id ? { ...doc, selecionado: checked } : doc)),
    )
  }

  const handleResponsavelChange = (id: string, checked: boolean) => {
    setResponsaveis(responsaveis.map((resp) => (resp.id === id ? { ...resp, selecionado: checked } : resp)))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setArquivosAnexados((prev) => [...prev, ...filesArray])
    }
  }

  const handleImpostoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setImpostos((prev) => ({ ...prev, [name]: value }))
  }

  const calcularValorComImpostos = () => {
    const valorProposta = Number.parseFloat(formData.valorProposta.replace(/[^\d,]/g, "").replace(",", ".")) || 0
    const totalImpostos =
      (Number.parseFloat(impostos.iss) +
        Number.parseFloat(impostos.pisCofins) +
        Number.parseFloat(impostos.ir) +
        Number.parseFloat(impostos.csll)) /
      100

    return valorProposta * (1 + totalImpostos)
  }

  const handleSubmit = async () => {
    // Validar campos obrigatórios
    if (!formData.nome || !formData.orgao || !prazoEnvio || !dataJulgamento || !formData.tipo) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    if(formData.tipo === "produto" && !formData.tipoFaturamento) {
      alert("Por favor, selecione o tipo de faturamento.")
      return
    }

    setIsSubmitting(true)

    try {
      // Preparar os dados conforme o tipo Licitacao da nossa API
      const licitacaoData = {
        titulo: formData.nome,
        orgao: formData.orgao,
        orgaoId: formData.orgao.toLowerCase().replace(/\s/g, "_"),
        status: formData.status,
        dataAbertura: prazoEnvio ? format(prazoEnvio, "yyyy-MM-dd") : undefined,
        dataPublicacao: dataPublicacao ? format(dataPublicacao, "yyyy-MM-dd") : undefined,
        valorEstimado: formData.valorEstimado ? Number(formData.valorEstimado.replace(/[^\d,]/g, "").replace(",", ".")) : 0,
        valorProposta: formData.valorProposta ? Number(formData.valorProposta.replace(/[^\d,]/g, "").replace(",", ".")) : undefined,
        modalidade: formData.modalidade,
        objeto: formData.descricao,
        edital: formData.numeroEdital,
        numeroEdital: formData.numeroEdital,
        responsavel: responsaveis.find(r => r.selecionado)?.nome || "Não atribuído",
        responsavelId: responsaveis.find(r => r.selecionado)?.id,
        responsaveisIds: responsaveis.filter(r => r.selecionado).map(r => r.id),
        prazo: prazoEnvio ? format(prazoEnvio, "dd/MM/yyyy") : "",
        urlLicitacao: formData.urlLicitacao,
        descricao: formData.descricao,
        formaPagamento: "",
        obsFinanceiras: "",
        tipo: formData.tipo,
        tipoFaturamento: formData.tipoFaturamento,
        margemLucro: formData.margemLucro ? Number(formData.margemLucro) : undefined,
        contatoNome: formData.contatoNome,
        contatoEmail: formData.contatoEmail,
        contatoTelefone: formData.contatoTelefone,
        dataJulgamento: dataJulgamento ? format(dataJulgamento, "yyyy-MM-dd") : undefined,
        // Informações adicionais que podem ser úteis para o front-end mas não são necessariamente parte da API
        documentosNecessarios: documentosNecessarios.filter(d => d.selecionado).map(doc => ({
          id: doc.id,
          nome: doc.nome,
          tipo: "documento",
          url: "",
          licitacaoId: "",
          dataCriacao: new Date().toISOString(),
          dataAtualizacao: new Date().toISOString(),
        }))
      }

      // Chamada à API
      const response = await fetch('/api/licitacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(licitacaoData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar licitação')
      }

      const novaLicitacao = await response.json()

      // Se tiver arquivos anexados, poderia enviar em outro endpoint
      if (arquivosAnexados.length > 0) {
        console.log(`${arquivosAnexados.length} arquivos seriam enviados para a API de upload`)
        // Aqui implementaríamos o upload de arquivos em uma situação real
      }

      // Criar evento no calendário (simulação ou integração real)
      if (criarEvento && prazoEnvio) {
        console.log(`Evento criado no calendário para ${format(prazoEnvio, "dd/MM/yyyy", { locale: ptBR })}`)
      }

      // Enviar notificações (simulação ou integração real)
      if (enviarNotificacoes) {
        const responsaveisSelecionados = responsaveis.filter(r => r.selecionado)
        console.log(`Notificações enviadas para ${responsaveisSelecionados.length} responsáveis`)
      }

      // Notificar componente pai
      if (onLicitacaoAdded) {
        onLicitacaoAdded(novaLicitacao)
      }

      // Resetar formulário
      setFormData({
        nome: "",
        orgao: "",
        descricao: "",
        numeroEdital: "",
        modalidade: "pregao_eletronico",
        valorEstimado: "",
        valorProposta: "",
        margemLucro: "",
        contatoNome: "",
        contatoTelefone: "",
        contatoEmail: "",
        urlLicitacao: "",
        status: "analise_interna",
        tipo: "",
        tipoFaturamento: "",
      })
      setDataPublicacao(undefined)
      setPrazoEnvio(undefined)
      setDataJulgamento(undefined)
      setDocumentosNecessarios(documentosNecessarios.map(doc => ({ ...doc, selecionado: false })))
      setResponsaveis(responsaveis.map(resp => ({ ...resp, selecionado: false })))
      setArquivosAnexados([])
      setCriarEvento(true)
      setEnviarNotificacoes(true)
      setActiveTab("dados-basicos")

      // Fechar o diálogo
      setOpen(false)
    } catch (error) {
      console.error('Erro ao criar licitação:', error)
      alert(`Erro ao criar licitação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1B3A53] hover:bg-[#2c5a80]">
          <Plus className="w-4 h-4 mr-2" />
          Nova Licitação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Licitação</DialogTitle>
          <DialogDescription>Preencha os dados para cadastrar uma nova licitação no sistema.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="responsaveis">Responsáveis</TabsTrigger>
          </TabsList>

          {/* Aba de Dados Básicos */}
          <TabsContent value="dados-basicos" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome da Licitação <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Nome da licitação"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgao">
                  Órgão Responsável <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orgao"
                  name="orgao"
                  placeholder="Nome do órgão"
                  value={formData.orgao}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição da Licitação</Label>
              <Textarea
                id="descricao"
                name="descricao"
                placeholder="Descreva o objeto da licitação"
                className="min-h-[80px]"
                value={formData.descricao}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroEdital">Número do Edital</Label>
                <Input
                  id="numeroEdital"
                  name="numeroEdital"
                  placeholder="Ex: 123/2023"
                  value={formData.numeroEdital}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modalidade">Modalidade</Label>
                <Select value={formData.modalidade} onValueChange={(value) => handleSelectChange("modalidade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pregao_eletronico">Pregão Eletrônico</SelectItem>
                    <SelectItem value="pregao_presencial">Pregão Presencial</SelectItem>
                    <SelectItem value="concorrencia">Concorrência</SelectItem>
                    <SelectItem value="tomada_precos">Tomada de Preços</SelectItem>
                    <SelectItem value="convite">Convite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataPublicacao">Data de Publicação</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataPublicacao && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataPublicacao ? format(dataPublicacao, "PPP", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dataPublicacao} onSelect={setDataPublicacao} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prazoEnvio">
                  Prazo para Envio <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !prazoEnvio && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {prazoEnvio ? format(prazoEnvio, "PPP", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={prazoEnvio} onSelect={setPrazoEnvio} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataJulgamento">
                  Data do Julgamento/Pregão <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataJulgamento && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataJulgamento ? format(dataJulgamento, "PPP", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dataJulgamento} onSelect={setDataJulgamento} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Inicial</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analise_interna">Análise Interna</SelectItem>
                  <SelectItem value="aguardando_pregao">Aguardando Pregão</SelectItem>
                  <SelectItem value="envio_documentos">Envio de Documentos</SelectItem>
                  <SelectItem value="assinaturas">Assinaturas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urlLicitacao">URL da Licitação</Label>
              <div className="flex items-center space-x-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="urlLicitacao"
                  name="urlLicitacao"
                  placeholder="https://..."
                  value={formData.urlLicitacao}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">
                  Tipo de Licitação <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="produto">Produto</SelectItem>
                    <SelectItem value="servico">Serviço</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.tipo === "produto" && (
                <div className="space-y-2">
                  <Label htmlFor="tipoFaturamento">
                    Tipo de Faturamento <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.tipoFaturamento} 
                    onValueChange={(value) => handleSelectChange("tipoFaturamento", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de faturamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direto">Faturamento Direto</SelectItem>
                      <SelectItem value="distribuidor">Via Distribuidor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Aba de Documentos */}
          <TabsContent value="documentos" className="space-y-4">
            <div className="space-y-2">
              <Label>Documentação Necessária</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                {documentosNecessarios.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={doc.id}
                      checked={doc.selecionado}
                      onCheckedChange={(checked) => handleDocumentoChange(doc.id, checked as boolean)}
                    />
                    <Label htmlFor={doc.id} className="font-normal">
                      {doc.nome}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Anexar Documentos</Label>
              <div className="border rounded-md p-3">
                <Input type="file" multiple className="cursor-pointer" onChange={handleFileChange} />

                {arquivosAnexados.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Arquivos Anexados:</Label>
                    <div className="space-y-2">
                      {arquivosAnexados.map((arquivo, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span>{arquivo.name}</span>
                          <span className="text-muted-foreground">({(arquivo.size / 1024).toFixed(2)} KB)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Aba Financeira */}
          <TabsContent value="financeiro" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorEstimado">Estimativa de Custo (R$)</Label>
                <Input
                  id="valorEstimado"
                  name="valorEstimado"
                  placeholder="Ex: 250000,00"
                  value={formData.valorEstimado}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorProposta">Valor da Proposta (R$)</Label>
                <Input
                  id="valorProposta"
                  name="valorProposta"
                  placeholder="Ex: 230000,00"
                  value={formData.valorProposta}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margemLucro">Margem de Lucro (%)</Label>
                <Input
                  id="margemLucro"
                  name="margemLucro"
                  placeholder="Ex: 15"
                  value={formData.margemLucro}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="border rounded-md p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Simulação de Impostos</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="iss">ISS (%)</Label>
                  <Input id="iss" name="iss" value={impostos.iss} onChange={handleImpostoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icms">ICMS (%)</Label>
                  <Input id="icms" name="icms" value={impostos.icms} onChange={handleImpostoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pisCofins">PIS/COFINS (%)</Label>
                  <Input id="pisCofins" name="pisCofins" value={impostos.pisCofins} onChange={handleImpostoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ir">IR (%)</Label>
                  <Input id="ir" name="ir" value={impostos.ir} onChange={handleImpostoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="csll">CSLL (%)</Label>
                  <Input id="csll" name="csll" value={impostos.csll} onChange={handleImpostoChange} />
                </div>
              </div>

              {formData.valorProposta && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Valor com Impostos:</span>
                    <span className="font-bold text-lg">
                      {calcularValorComImpostos().toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contatoNome">Contato (Nome)</Label>
                <Input
                  id="contatoNome"
                  name="contatoNome"
                  placeholder="Nome do contato"
                  value={formData.contatoNome}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contatoTelefone">Contato (Telefone)</Label>
                <Input
                  id="contatoTelefone"
                  name="contatoTelefone"
                  placeholder="(00) 00000-0000"
                  value={formData.contatoTelefone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contatoEmail">Contato (E-mail)</Label>
                <Input
                  id="contatoEmail"
                  name="contatoEmail"
                  placeholder="email@exemplo.com"
                  value={formData.contatoEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </TabsContent>

          {/* Aba de Responsáveis */}
          <TabsContent value="responsaveis" className="space-y-4">
            <div className="space-y-2">
              <Label>Usuários Responsáveis</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                {responsaveis.map((resp) => (
                  <div key={resp.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={resp.id}
                      checked={resp.selecionado}
                      onCheckedChange={(checked) => handleResponsavelChange(resp.id, checked as boolean)}
                    />
                    <Label htmlFor={resp.id} className="font-normal">
                      {resp.nome}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-md p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Notificações e Calendário</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="criarEvento"
                    checked={criarEvento}
                    onCheckedChange={(checked) => setCriarEvento(checked as boolean)}
                  />
                  <Label htmlFor="criarEvento" className="font-normal">
                    Criar evento no calendário do Outlook e enviar convites
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enviarNotificacoes"
                    checked={enviarNotificacoes}
                    onCheckedChange={(checked) => setEnviarNotificacoes(checked as boolean)}
                  />
                  <Label htmlFor="enviarNotificacoes" className="font-normal">
                    Enviar notificações por e-mail para os responsáveis
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Lembretes automáticos serão enviados 7, 3 e 1 dia antes do prazo
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            <span className="text-red-500">*</span> Campos obrigatórios
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#1B3A53] hover:bg-[#2c5a80]"
            >
              {isSubmitting ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Licitação
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
