'use client';
import { ArrowLeft, BarChart3, ChevronDown, ChevronUp, Clock, LayoutDashboard, Plus, TableIcon, Users } from "lucide-react";
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
import { useParams } from "next/navigation";
import {
  getResponsesSummary,
  getRawResponses,
  getResponseCharts,
  type ResponsesSummary,
  type RawResponses,
  type ResponseCharts,
} from "../services/ResponsesSummary.service";

const MAX_WIDGETS = 3
const ANSWER_PREVIEW_LIMIT = 20

export default function RespostasPage() {
  const params = useParams()
  const formId = params.id as string

  const [summary, setSummary] = useState<ResponsesSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [rawResponses, setRawResponses] = useState<RawResponses | null>(null)
  const [rawResponsesLoading, setRawResponsesLoading] = useState(true)
  const [responseCharts, setResponseCharts] = useState<ResponseCharts | null>(null)
  const [chartsLoading, setChartsLoading] = useState(true)
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({})

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

  useEffect(() => {
    async function loadRawResponses() {
      try {
        setRawResponsesLoading(true)
        const data = await getRawResponses(formId)
        setRawResponses(data)
      } catch (error) {
        console.error("Erro ao carregar respostas:", error)
      } finally {
        setRawResponsesLoading(false)
      }
    }

    if (formId) {
      loadRawResponses()
    }
  }, [formId])

  function formatSubmittedAt(value: string) {
    return new Date(value).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    async function loadCharts() {
      try {
        setChartsLoading(true)
        const data = await getResponseCharts(formId)
        setResponseCharts(data)

        setWidgets(
          data.charts.slice(0, MAX_WIDGETS).map((chart) => ({
            id: chart.questionId,
            fieldId: chart.questionId,
            chartType: chart.chartTypeSuggestion,
            full: false,
          }))
        )
      } catch (error) {
        console.error("Erro ao carregar gráficos:", error)
      } finally {
        setChartsLoading(false)
      }
    }

    if (formId) {
      loadCharts()
    }
  }, [formId])

  const addWidget = () => {
    if (widgets.length >= MAX_WIDGETS) return

    const charts = responseCharts?.charts ?? []
    const used = widgets.map((w) => w.fieldId)
    const next = charts.find((chart) => !used.includes(chart.questionId))

    if (!next) return

    setWidgets([
      ...widgets,
      {
        id: next.questionId,
        fieldId: next.questionId,
        chartType: next.chartTypeSuggestion,
        full: false,
      },
    ])
  }

  const updateWidget = (updated: DashboardWidget) => {
    setWidgets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
  }

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }

  const toggleAnswerExpanded = (key: string) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const availableCharts = responseCharts?.charts ?? []
  const hasAvailableCharts = availableCharts.length > 0
  const canAddWidget = hasAvailableCharts && widgets.length < MAX_WIDGETS

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/70 to-slate-900">
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
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Cards de resumo, dois cards de, total de respostas e data da ultima resposta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/15 backdrop-blur-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-2xl font-bold text-white">
                {summaryLoading ? "..." : summary?.totalResponses ?? 0}
              </p>
              <p className="text-sm text-white truncate">
                Total de respostas
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/15 backdrop-blur-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-lg font-bold text-white truncate">
                {summaryLoading
                  ? "..."
                  :formatLastSubmittedAt(summary?.lastResponseDate)}
              </p>
              <p className="text-sm text-white truncate">
                Última resposta
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="respostas">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger
              value="respostas"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-violet-200 gap-2"
            >
              <TableIcon />
              Respostas
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-violet-200 gap-2"
            >
              <LayoutDashboard />
              Dashboard
            </TabsTrigger>
          </TabsList>

          {/* charts */}
          <TabsContent value="dashboard" className="mt-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Meu Dashboard</h2>
                <p className="text-sm text-violet-300">Monte sua visualização com até {MAX_WIDGETS} gráficos</p>
              </div>
              <button
                onClick={addWidget}
                disabled={!canAddWidget}
                className="
                  flex items-center gap-2
                  rounded-xl
                  bg-gradient-to-r from-blue-600 to-purple-600
                  hover:from-blue-500 hover:to-purple-500
                  text-white
                  px-4 py-2
                  disabled:opacity-40
                "
              >
                <Plus className="w-4 h-4" />

                <span>Adicionar gráfico</span>

                <span className="ml-1 rounded-lg bg-white/20 px-1.5 py-0.5 text-xs">
                  {widgets.length}/{Math.min(MAX_WIDGETS, availableCharts.length)}
                </span>
              </button>
            </div>

            {chartsLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 py-12 text-center text-violet-300">
                Carregando gráficos...
              </div>
            ) : widgets.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-white/15 bg-white/5 py-16 flex flex-col items-center text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-white font-medium mb-1">Sem graficos disponiveis</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {widgets.map((w) => {
                  const chart = responseCharts?.charts.find(
                    (item) => item.questionId === w.fieldId
                  )

                  if (!chart) return null

                  return (
                    <div key={w.id} className={w.full ? "md:col-span-2" : ""}>
                      <ChartWidget
                        widget={w}
                        charts={responseCharts?.charts ?? []}
                        chart={chart}
                        onChange={updateWidget}
                        onRemove={removeWidget}
                      />
                    </div>
                  )
                })}
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
                      <TableHead className="text-violet-300">Respondente</TableHead>
                      <TableHead className="text-violet-300">Data</TableHead>

                      {rawResponses?.columns.map((column) => (
                        <TableHead
                          key={column.questionId}
                          className="text-violet-300 min-w-[180px]"
                        >
                          {column.title}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {rawResponsesLoading ? (
                      <TableRow className="border-white/10">
                        <TableCell
                          colSpan={(rawResponses?.columns.length ?? 0) + 2}
                          className="text-center text-violet-300 py-8"
                        >
                          Carregando respostas...
                        </TableCell>
                      </TableRow>
                    ) : rawResponses && rawResponses.rows.length > 0 ? (
                      rawResponses.rows.map((row) => (
                        <TableRow
                          key={row.submissionId}
                          className="border-white/10 hover:bg-white/5"
                        >
                          <TableCell className="text-white font-medium">
                            {row.respondentEmail ?? "Anônimo"}
                          </TableCell>

                          <TableCell className="text-violet-300 whitespace-nowrap">
                            {formatSubmittedAt(row.submittedAt)}
                          </TableCell>

                          {rawResponses.columns.map((column) => {
                            const answer = row.answers.find(
                              (item) => item.questionId === column.questionId
                            )

                            return (
                              <TableCell
                                key={`${row.submissionId}-${column.questionId}`}
                                className="text-violet-200 max-w-[320px] align-top"
                              >
                                {(() => {
                                  const cellKey = `${row.submissionId}-${column.questionId}`
                                  const value = answer?.displayValue ?? "-"
                                  const isLong = value.length > ANSWER_PREVIEW_LIMIT
                                  const isExpanded = expandedAnswers[cellKey]

                                  return (
                                    <div className="space-y-1">
                                      <p className={isExpanded ? "whitespace-pre-wrap break-words" : "truncate"}>
                                        {value}
                                      </p>

                                      {isLong && (
                                        <button
                                          type="button"
                                          onClick={() => toggleAnswerExpanded(cellKey)}
                                          className="inline-flex items-center gap-1 text-xs font-medium text-purple-300 hover:text-white"
                                        >
                                          {isExpanded ? (
                                            <>
                                              <ChevronUp className="w-3.5 h-3.5" />
                                            </>
                                          ) : (
                                            <>
                                              <ChevronDown className="w-3.5 h-3.5" />
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  )
                                })()}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="border-white/10">
                        <TableCell
                          colSpan={(rawResponses?.columns.length ?? 0) + 2}
                          className="text-center text-violet-300 py-8"
                        >
                          Nenhuma resposta encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="px-4 py-3 border-t border-white/10 text-center text-xs text-violet-300">
                Mostrando {rawResponses?.rows.length ?? 0} de {rawResponses?.rows.length ?? 0} respostas
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
