import type { FormField } from "../types/types"

export interface ResponseRow {
  id: string
  submittedAt: Date
  answers: Record<string, string | string[]>
}

// Campos do formulário de exemplo
export const sampleFields: FormField[] = [
  {
    id: "f_name",
    type: "short_text",
    question: "Qual o seu nome?",
    required: true,
  },
  {
    id: "f_satisfaction",
    type: "rating",
    question: "Como você avalia nosso atendimento?",
    required: true,
    minRating: 1,
    maxRating: 5,
  },
  {
    id: "f_plan",
    type: "multiple_choice",
    question: "Qual plano você utiliza?",
    required: true,
    options: [
      { id: "o1", label: "Gratuito" },
      { id: "o2", label: "Pro" },
      { id: "o3", label: "Business" },
      { id: "o4", label: "Enterprise" },
    ],
  },
  {
    id: "f_features",
    type: "checkbox",
    question: "Quais recursos você mais usa?",
    required: false,
    options: [
      { id: "c1", label: "Relatórios" },
      { id: "c2", label: "Integrações" },
      { id: "c3", label: "Compartilhamento" },
      { id: "c4", label: "Análises" },
    ],
  },
  {
    id: "f_source",
    type: "dropdown",
    question: "Como conheceu a gente?",
    required: false,
    options: [
      { id: "d1", label: "Indicação" },
      { id: "d2", label: "Redes sociais" },
      { id: "d3", label: "Busca no Google" },
      { id: "d4", label: "Anúncio" },
    ],
  },
  {
    id: "f_comment",
    type: "long_text",
    question: "Deixe um comentário (opcional)",
    required: false,
  },
]

const names = [
  "Ana Souza",
  "Bruno Lima",
  "Carla Dias",
  "Diego Alves",
  "Eduarda Reis",
  "Felipe Castro",
  "Gabriela Nunes",
  "Henrique Melo",
  "Isabela Rocha",
  "João Pedro",
  "Karen Lopes",
  "Lucas Martins",
]

const comments = [
  "Ótimo serviço, recomendo!",
  "Poderia ter mais integrações.",
  "Atendimento rápido e eficiente.",
  "Gostei bastante da interface.",
  "Senti falta de um app mobile.",
  "",
  "",
  "Excelente custo-benefício.",
]

const plans = ["Gratuito", "Pro", "Business", "Enterprise"]
const sources = ["Indicação", "Redes sociais", "Busca no Google", "Anúncio"]
const featureOptions = ["Relatórios", "Integrações", "Compartilhamento", "Análises"]

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]
}

function pickWeighted(i: number): string {
  // distribui de forma variada porém determinística
  const weights = [3, 5, 2, 1] // Gratuito, Pro, Business, Enterprise
  const pool: string[] = []
  weights.forEach((w, idx) => {
    for (let k = 0; k < w; k++) pool.push(plans[idx])
  })
  return pool[i % pool.length]
}

// Gera 48 respostas determinísticas
export const sampleResponses: ResponseRow[] = Array.from({ length: 48 }).map((_, i) => {
  const rating = ((i * 7) % 5) + 1
  const features = featureOptions.filter((_, idx) => (i + idx) % 2 === 0)
  const daysAgo = Math.floor(i / 2)
  const submittedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

  return {
    id: `r_${i + 1}`,
    submittedAt,
    answers: {
      f_name: pick(names, i),
      f_satisfaction: String(rating),
      f_plan: pickWeighted(i),
      f_features: features.length ? features : [pick(featureOptions, i)],
      f_source: pick(sources, i),
      f_comment: pick(comments, i),
    },
  }
})

// Tipos de campo que podem virar gráfico
export const CHARTABLE_TYPES = ["multiple_choice", "checkbox", "dropdown", "rating"] as const

export function getChartableFields(fields: FormField[]): FormField[] {
  return fields.filter((f) => (CHARTABLE_TYPES as readonly string[]).includes(f.type))
}

// Agrega as respostas de um campo em { label, value }
export function aggregateField(field: FormField, responses: ResponseRow[]): { label: string; value: number }[] {
  const counts = new Map<string, number>()

  if (field.type === "rating") {
    const min = field.minRating ?? 1
    const max = field.maxRating ?? 5
    for (let r = min; r <= max; r++) counts.set(`${r}`, 0)
    responses.forEach((res) => {
      const val = res.answers[field.id]
      if (typeof val === "string" && counts.has(val)) {
        counts.set(val, (counts.get(val) ?? 0) + 1)
      }
    })
    return Array.from(counts.entries()).map(([label, value]) => ({ label: `${label} estrela${label === "1" ? "" : "s"}`, value }))
  }

  field.options?.forEach((o) => counts.set(o.label, 0))
  responses.forEach((res) => {
    const val = res.answers[field.id]
    const values = Array.isArray(val) ? val : [val]
    values.forEach((v) => {
      if (typeof v === "string" && v) {
        counts.set(v, (counts.get(v) ?? 0) + 1)
      }
    })
  })
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }))
}
