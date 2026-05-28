import { api } from "@/app/services/api/Api"

export async function getFormById(formId: string) {
  const response = await api.get(`/forms/${formId}`)
  return response.data
}