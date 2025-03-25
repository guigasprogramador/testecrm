import { Card, CardContent } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">Olá, guilherme1!</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">Licitações em aberto</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">Propostas em aberto</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">R$ 0</div>
              <p className="text-sm text-muted-foreground">Em total em propostas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">0%</div>
              <p className="text-sm text-muted-foreground">Taxa de conversão</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

