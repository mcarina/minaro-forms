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