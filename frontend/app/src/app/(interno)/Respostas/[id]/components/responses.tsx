"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { BarChart3, ChartLine, ChartPie, Donut, Maximize2, Minimize2, X } from "lucide-react"
import type { FormField } from "../../types/types"
import { aggregateField, type ResponseRow } from "../../lib/sample-responses" 
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export type ChartType = "bar" | "pie" | "donut" | "line"

export interface DashboardWidget {
  id: string
  fieldId: string
  chartType: ChartType
  full: boolean
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const CHART_TYPE_OPTIONS: { value: ChartType; label: string; icon: typeof BarChart3 }[] = [
  { value: "bar", label: "Barras", icon: BarChart3 },
  { value: "pie", label: "Pizza", icon: ChartPie },
  { value: "donut", label: "Rosca", icon: Donut },
  { value: "line", label: "Linha", icon: ChartLine },
]

interface ChartWidgetProps {
  widget: DashboardWidget
  fields: FormField[]
  responses: ResponseRow[]
  onChange: (widget: DashboardWidget) => void
  onRemove: (id: string) => void
}

export function ChartWidget({ widget, fields, responses, onChange, onRemove }: ChartWidgetProps) {
  const field = fields.find((f) => f.id === widget.fieldId) ?? fields[0]

  const data = useMemo(() => aggregateField(field, responses), [field, responses])

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {
      value: { label: "Respostas", color: "var(--chart-1)" },
    }
    data.forEach((d, i) => {
      config[d.label] = { label: d.label, color: CHART_COLORS[i % CHART_COLORS.length] }
    })
    return config
  }, [data])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col">
      {/* Controles do widget */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0 space-y-2">
          <Select value={widget.fieldId} onValueChange={(v) => onChange({ ...widget, fieldId: v })}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              {fields.map((f) => (
                <SelectItem key={f.id} value={f.id} className="focus:bg-white/10 focus:text-white">
                  {f.question}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-1">
            {CHART_TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const active = widget.chartType === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => onChange({ ...widget, chartType: opt.value })}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-white/5 text-violet-200 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onChange({ ...widget, full: !widget.full })}
            className="h-8 w-8 text-violet-200 hover:text-white hover:bg-white/10"
            title={widget.full ? "Reduzir para metade" : "Expandir largura total"}
          >
            {widget.full ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onRemove(widget.id)}
            className="h-8 w-8 text-red-300 hover:text-red-200 hover:bg-red-500/10"
            title="Remover gráfico"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Gráfico */}
      <ChartContainer config={chartConfig} className="h-[260px] w-full">
        {widget.chartType === "bar" ? (
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(221,214,254,0.7)", fontSize: 11 }}
              interval={0}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "rgba(221,214,254,0.7)", fontSize: 11 }} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        ) : widget.chartType === "line" ? (
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(221,214,254,0.7)", fontSize: 11 }}
              interval={0}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "rgba(221,214,254,0.7)", fontSize: 11 }} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="value" stroke="var(--chart-2)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--chart-2)" }} />
          </LineChart>
        ) : (
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={widget.chartType === "donut" ? 60 : 0}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
          </PieChart>
        )}
      </ChartContainer>

      {/* Legenda */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-white/10">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-1.5 text-xs text-violet-200">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
            {d.label}
            <span className="text-white font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
