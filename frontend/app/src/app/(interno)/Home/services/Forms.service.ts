import { api } from "@/app/services/api/Api"

export async function getForms() {
    const response = await api.get("/forms/me")
    return response.data
}

interface PublishFormPayload {
  isPublished: boolean
}

interface PublishFormResponse {
  message: string
  shareUrl: string | null
}

export async function publishForm(formId: string, payload: PublishFormPayload) {
  const response = await api.post<PublishFormResponse>(
    `/forms/${formId}/publish`,
    payload
  )

  return response.data
}

interface DuplicateFormPayload {
  title?: string | null
}

export async function duplicateForm(
  formId: string,
  payload: DuplicateFormPayload = {}
) {
  const response = await api.post(`/forms/${formId}/duplicate`, payload)
  return response.data
}