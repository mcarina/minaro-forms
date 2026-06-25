import { api } from "@/app/services/api/Api"

export interface CreateFormOption {
  label: string
  value: string
}

export interface CreateFormQuestion {
  type: number
  title: string
  description: string | null
  isRequired: boolean
  settings: object | null
  options: CreateFormOption[] | null
}

export interface CreateFormPayload {
  ownerUserId: string
  title: string
  description: string | null
  questions: CreateFormQuestion[]
}

export async function createForm(payload: CreateFormPayload) {
  const response = await api.post("/forms", payload)
  return response.data
}

export interface ReplaceFormStructureOption {
  label: string
  value: string
}

export interface ReplaceFormStructureQuestion {
  type: number
  title: string
  description: string | null
  isRequired: boolean
  settings: object | null
  options: ReplaceFormStructureOption[] | null
}

export interface ReplaceFormStructurePayload {
  title: string
  description: string | null
  questions: ReplaceFormStructureQuestion[]
}

export async function replaceFormStructure(
  formId: string,
  payload: ReplaceFormStructurePayload
) {
  const response = await api.put(`/forms/${formId}/structure`, payload)
  return response.data
}