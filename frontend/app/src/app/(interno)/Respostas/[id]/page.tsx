'use client';
import { ArrowLeft, BarChart3, Clock, LayoutDashboard, Plus, TableIcon, Users } from "lucide-react";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartWidget, type DashboardWidget } from "./components/responses";
import { getChartableFields, sampleFields, sampleResponses } from "../lib/sample-responses";
import { useParams } from "next/navigation";
import { getResponsesSummary, type ResponsesSummary } from "../services/ResponsesSummary.service";

const MAX_WIDGETS = 3

export default function RespostasPage() {
  const params = useParams()
  const formId = params.id as string

  const [summary, setSummary] = useState<ResponsesSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)

  useEffect(() => {
  async function loadSummary() {
    try {
      setSummaryLoading(true)
      const data = await getResponsesSummary(formId)
      setSummary(data)
    } catch (error) {
      console.error("Erro ao carregar resumo das respostas:", error)
    } finally {
      setSummaryLoading(false)
    }
  }

  if (formId) {
    loadSummary()
  }
}, [formId])

function formatLastSubmittedAt(value: string | null | undefined) {
  if (!value) {
    return "Nenhuma resposta"
  }

  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
  // =================
  const chartableFields = getChartableFields(sampleFields)

  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    { id: "w1", fieldId: "f_satisfaction", chartType: "bar", full: false },
    { id: "w2", fieldId: "f_plan", chartType: "donut", full: false },
  ])

  const addWidget = () => {
    if (widgets.length >= MAX_WIDGETS) return
    const used = widgets.map((w) => w.fieldId)
    const next = chartableFields.find((f) => !used.includes(f.id)) ?? chartableFields[0]
    setWidgets([
      ...widgets,
      { id: `w${Date.now()}`, fieldId: next.id, chartType: "bar", full: false },
    ])
  }

  const updateWidget = (updated: DashboardWidget) => {
    setWidgets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
  }

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-700">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button className="text-violet-200 hover:text-white hover:bg-white/10">
            <Link href="/Home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </button>
          <div className="min-w-0">
            <h1 className="text-white font-semibold truncate">Pesquisa de Satisfação</h1>
            <p className="text-xs text-white"> - respostas recebidas</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Cards de resumo, dois cards de, total de respostas e data da ultima resposta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-2xl font-bold text-white">
                {summaryLoading ? "..." : summary?.totalResponses ?? 0}
              </p>
              <p className="text-sm text-violet-300 truncate">
                Total de respostas
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-lg font-bold text-white truncate">
                {summaryLoading
                  ? "..."
                  : formatLastSubmittedAt(summary?.lastSubmittedAt)}
              </p>
              <p className="text-sm text-violet-300 truncate">
                Última resposta
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-violet-200 gap-2"
            >
              <LayoutDashboard />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="respostas"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-violet-200 gap-2"
            >
              <TableIcon />
              Respostas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Meu Dashboard</h2>
                <p className="text-sm text-violet-300">Monte sua visualização com até {MAX_WIDGETS} gráficos</p>
              </div>
              <button
                onClick={addWidget}
                disabled={widgets.length >= MAX_WIDGETS}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white gap-2 disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
                Adicionar gráfico
                <span className="ml-1 rounded-md bg-white/20 px-1.5 py-0.5 text-xs">
                  {widgets.length}/{MAX_WIDGETS}
                </span>
              </button>
            </div>

            {widgets.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-white/15 bg-white/5 py-16 flex flex-col items-center text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-white font-medium mb-1">Nenhum gráfico ainda</h3>
                <p className="text-sm text-violet-300 mb-5 max-w-sm">
                  Adicione gráficos para visualizar as respostas do seu formulário do jeito que preferir.
                </p>
                <button
                  onClick={addWidget}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar primeiro gráfico
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {widgets.map((w) => (
                  <div key={w.id} className={w.full ? "md:col-span-2" : ""}>
                    <ChartWidget
                      widget={w}
                      fields={chartableFields}
                      responses={sampleResponses}
                      onChange={updateWidget}
                      onRemove={removeWidget}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Respostas individuais */}
          <TabsContent value="respostas" className="mt-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-violet-300">Nome</TableHead>
                      <TableHead className="text-violet-300">Avaliação</TableHead>
                      <TableHead className="text-violet-300">Plano</TableHead>
                      <TableHead className="text-violet-300">Origem</TableHead>
                      <TableHead className="text-violet-300">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleResponses.slice(0, 15).map((r) => (
                      <TableRow key={r.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{r.answers.f_name as string}</TableCell>
                        <TableCell className="text-violet-200">{r.answers.f_satisfaction as string} / 5</TableCell>
                        <TableCell className="text-violet-200">{r.answers.f_plan as string}</TableCell>
                        <TableCell className="text-violet-200">{r.answers.f_source as string}</TableCell>
                        <TableCell className="text-violet-300">
                          {r.submittedAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="px-4 py-3 border-t border-white/10 text-center text-xs text-violet-300">
                Mostrando 0 de 0 respostas
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}