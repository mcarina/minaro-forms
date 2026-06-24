import { api } from "@/app/services/api/Api"

export interface ResponsesSummary {
  formId: string
  totalResponses: number
  lastSubmittedAt: string | null
}

export async function getResponsesSummary(formId: string) {
  const response = await api.get<ResponsesSummary>(
    `/forms/${formId}/responses/summary`
  )

  return response.data
}