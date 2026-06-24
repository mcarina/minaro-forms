import { api } from "@/app/services/api/Api"

export interface ResponsesSummary {
  formId: string
  totalResponses: number
  lastResponseDate: string | null
}

export async function getResponsesSummary(formId: string) {
  const response = await api.get<ResponsesSummary>(
    `/forms/${formId}/responses/summary`
  )

  return response.data
}

export interface RawResponseColumn {
  questionId: string
  title: string
  type: number
  position: number
}

export interface RawResponseAnswer {
  questionId: string
  value: string | null
  displayValue: string
}

export interface RawResponseRow {
  submissionId: string
  submittedAt: string
  respondentEmail: string | null
  answers: RawResponseAnswer[]
}

export interface RawResponses {
  formId: string
  columns: RawResponseColumn[]
  rows: RawResponseRow[]
}

export async function getRawResponses(formId: string) {
  const response = await api.get<RawResponses>(
    `/forms/${formId}/responses/raw`
  )

  return response.data
}

export type ChartTypeSuggestion = "bar" | "pie" | "donut" | "line"

export interface ResponseChartDataPoint {
  label: string
  value: number
  percentage: number
}

export interface ResponseChartItem {
  questionId: string
  title: string
  type: number
  chartTypeSuggestion: ChartTypeSuggestion
  totalAnswers: number
  data: ResponseChartDataPoint[]
}

export interface ResponseCharts {
  formId: string
  charts: ResponseChartItem[]
}

export async function getResponseCharts(formId: string) {
  const response = await api.get<ResponseCharts>(
    `/forms/${formId}/responses/charts`
  )

  return response.data
}