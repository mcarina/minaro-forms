import { api } from "@/app/services/api/Api"

export async function getFormById(formId: string) {
  const response = await api.get(`/forms/${formId}`)
  return response.data
}

export interface PatchFormOption {
  id: string
  label: string
  value: string
}

export interface PatchFormQuestion {
  id: string
  title: string
  description: string | null
  isRequired: boolean
  settings: unknown | null
  options: PatchFormOption[]
}

export interface PatchFormPayload {
  title: string
  description: string | null
  questions: PatchFormQuestion[]
}

export async function patchForm(formId: string, payload: PatchFormPayload) {
  const response = await api.patch(`/forms/${formId}`, payload)
  return response.data
}