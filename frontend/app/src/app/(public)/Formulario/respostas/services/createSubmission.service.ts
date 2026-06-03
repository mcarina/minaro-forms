import { api } from "@/app/services/api/Api"

interface SubmissionAnswer {
  questionId: string
  answerText: string | null
  answer: unknown | null
}

interface CreateSubmissionPayload {
  respondentEmail: string | null
  respondentUserId: string | null
  answers: SubmissionAnswer[]
}

export async function createSubmission(
  formId: string,
  payload: CreateSubmissionPayload
) {
  const response = await api.post(`/forms/${formId}/submissions`, payload)
  console.log("Resposta enviada:", response.data)
  return response.data
}