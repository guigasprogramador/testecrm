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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Save, Upload, FileText, LinkIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface NovoDocumentoProps {
  onDocumentoAdded?: (documento: any) => void
}

export function NovoDocumento({ onDocumentoAdded }: NovoDocumentoProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    categoria: "",
    licitacao: "",
    descricao: "",
    numeroDocumento: "",
    urlDocumento: "",
  })

  // Estado para data de validade
  const [dataValidade, setDataValidade] = useState<Date | undefined>()

  // Estado para arquivos anexados
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null)

  // Funções de manipulação de formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivoSelecionado(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    // Validar campos obrigatórios
    if (!formData.nome || !formData.tipo || !formData.categoria) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setIsSubmitting(true)

    // Criar objeto de documento
    const novoDocumento = {
      id: `doc-${Date.now()}`,
      nome: formData.nome,
      tipo: formData.tipo,
      categoria: getCategoriaLabel(formData.categoria),
      categoriaId: formData.categoria,
      licitacao: formData.licitacao || "Não vinculado",
      licitacaoId: formData.licitacao ? formData.licitacao.toLowerCase().replace(/\s/g, "_") : "",
      dataUpload: format(new Date(), "dd/MM/yyyy", { locale: ptBR }),
      tamanho: arquivoSelecionado ? `${(arquivoSelecionado.size / 1024).toFixed(1)} KB` : "0 KB",
      dataValidade: dataValidade ? format(dataValidade, "dd/MM/yyyy", { locale: ptBR }) : "",
      descricao: formData.descricao,
      numeroDocumento: formData.numeroDocumento,
      urlDocumento: formData.urlDocumento,
    }

    // Simular envio para API
    setTimeout(() => {
      setIsSubmitting(false)

      // Notificar componente pai
      if (onDocumentoAdded) {
        onDocumentoAdded(novoDocumento)
      }

      // Resetar formulário
      setFormData({
        nome: "",
        tipo: "",
        categoria: "",
        licitacao: "",
        descricao: "",
        numeroDocumento: "",
        urlDocumento: "",
      })
      setDataValidade(undefined)
      setArquivoSelecionado(null)

      // Fechar o diálogo
      setOpen(false)
    }, 1500)
  }

  // Função para obter o label da categoria
  const getCategoriaLabel = (categoriaId: string): string => {
    const categorias: Record<string, string> = {
      projetos: "Projetos",
      contabeis: "Contábeis",
      societarios: "Societários",
      juridicos: "Jurídicos",
      atestado_capacidade: "Atestado de Capacidade",
    }
    return categorias[categoriaId] || categoriaId
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1B3A53] hover:bg-[#2c5a80]">
          <Plus className="w-4 h-4 mr-2" />
          Novo Documento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Documento</DialogTitle>
          <DialogDescription>Preencha os dados para cadastrar um novo documento no sistema.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome do Documento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Nome do documento"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">
                Tipo <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Edital">Edital</SelectItem>
                  <SelectItem value="Proposta">Proposta</SelectItem>
                  <SelectItem value="Certidão">Certidão</SelectItem>
                  <SelectItem value="Contrato">Contrato</SelectItem>
                  <SelectItem value="Planilha">Planilha</SelectItem>
                  <SelectItem value="Atestado">Atestado</SelectItem>
                  <SelectItem value="Documento">Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">
                Categoria <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="projetos">Projetos</SelectItem>
                  <SelectItem value="contabeis">Contábeis</SelectItem>
                  <SelectItem value="societarios">Societários</SelectItem>
                  <SelectItem value="juridicos">Jurídicos</SelectItem>
                  <SelectItem value="atestado_capacidade">Atestado de Capacidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="licitacao">Licitação</Label>
              <Select value={formData.licitacao} onValueChange={(value) => handleSelectChange("licitacao", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a licitação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pregão Eletrônico 123/2023">Pregão Eletrônico 123/2023</SelectItem>
                  <SelectItem value="Concorrência 45/2023">Concorrência 45/2023</SelectItem>
                  <SelectItem value="Tomada de Preços 78/2023">Tomada de Preços 78/2023</SelectItem>
                  <SelectItem value="Pregão Presencial 56/2023">Pregão Presencial 56/2023</SelectItem>
                  <SelectItem value="Concorrência 92/2023">Concorrência 92/2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              placeholder="Descreva o documento"
              className="min-h-[80px]"
              value={formData.descricao}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroDocumento">Número do Documento</Label>
              <Input
                id="numeroDocumento"
                name="numeroDocumento"
                placeholder="Ex: 123/2023"
                value={formData.numeroDocumento}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataValidade">Data de Validade</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataValidade && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataValidade ? format(dataValidade, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataValidade} onSelect={setDataValidade} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urlDocumento">URL do Documento (opcional)</Label>
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                id="urlDocumento"
                name="urlDocumento"
                placeholder="https://..."
                value={formData.urlDocumento}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload do Documento</Label>
            <div className="border rounded-md p-4">
              <Input type="file" onChange={handleFileChange} className="cursor-pointer" />
              {arquivoSelecionado && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>{arquivoSelecionado.name}</span>
                  <span className="text-muted-foreground">({(arquivoSelecionado.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <span className="text-red-500">*</span> Campos obrigatórios
          </div>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#1B3A53] hover:bg-[#2c5a80]"
          >
            {isSubmitting ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Documento
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

