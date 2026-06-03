"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createSubmission } from "../services/createSubmission.service"
import { getFormById } from "@/app/(interno)/Formulario/services/getforms.service"

interface ApiOption {
  id: string
  label: string
  value: string
  position: number
}

interface ApiQuestion {
  id: string
  type: number
  title: string
  description: string | null
  isRequired: boolean
  position: number
  settingsJson: string | null
  options: ApiOption[]
}

interface ApiForm {
  id: string
  title: string
  description: string | null
  isPublished: boolean
  questions: ApiQuestion[]
}

type AnswersState = Record<string, string | string[]>

export default function ResponderFormularioPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.formId as string

  const [form, setForm] = useState<ApiForm | null>(null)
  const [answers, setAnswers] = useState<AnswersState>({})
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadForm() {
      try {
        const data = await getFormById(formId)
        setForm(data)
      } catch (error) {
        console.error(error)
        setMessage("Erro ao carregar formulário.")
      } finally {
        setLoading(false)
      }
    }

    if (formId) {
      loadForm()
    }
  }, [formId])

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const toggleMultipleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId])
        ? prev[questionId]
        : []

      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]

      return {
        ...prev,
        [questionId]: next,
      }
    })
  }

  const handleSubmit = async () => {
    if (!form) return

    try {
      setSending(true)
      setMessage("")

      const payload = {
        respondentEmail: null,
        respondentUserId: null,
        answers: form.questions.map((question) => {
          const value = answers[question.id]
          
          if (Array.isArray(value)) {
            return {
              questionId: question.id,
              answerText: null,
              answer: {
                selectedValues: value,
              },
            }
          }

          return {
            questionId: question.id,
            answerText: value || null,
            answer: null,
          }
        }),
      }
      
      console.log(payload)
      const api = await createSubmission(form.id, payload)
      console.log("Resposta enviada:", api)

      setMessage("Resposta enviada com sucesso!")
      router.push(`/respostas/${form.id}/obrigado`)
    } catch (error) {
      console.error(error)
      setMessage("Erro ao enviar resposta.")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <p className="p-8 text-white">Carregando formulário...</p>
  }

  if (!form) {
    return <p className="p-8 text-white">Formulário não encontrado.</p>
  }

  if (!form.isPublished) {
    return <p className="p-8 text-white">Este formulário não está disponível.</p>
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="rounded-lg border border-purple-500/30 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">{form.title}</h1>

          {form.description && (
            <p className="mt-2 text-slate-300">{form.description}</p>
          )}
        </header>

        <div className="space-y-4">
          {form.questions
            .sort((a, b) => a.position - b.position)
            .map((question) => (
              <section
                key={question.id}
                className="rounded-lg border border-slate-700 bg-slate-900 p-5"
              >
                <label className="block font-medium">
                  {question.title}
                  {question.isRequired && (
                    <span className="ml-1 text-red-400">*</span>
                  )}
                </label>

                {question.description && (
                  <p className="mt-1 text-sm text-slate-400">
                    {question.description}
                  </p>
                )}

                <div className="mt-4">
                  {renderQuestion({
                    question,
                    value: answers[question.id],
                    onChange: updateAnswer,
                    onToggle: toggleMultipleAnswer,
                  })}
                </div>
              </section>
            ))}
        </div>

        {message && <p className="text-sm text-violet-300">{message}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={sending}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          {sending ? "Enviando..." : "Enviar resposta"}
        </button>
      </div>
    </main>
  )
}

function renderQuestion({
  question,
  value,
  onChange,
  onToggle,
}: {
  question: ApiQuestion
  value: string | string[] | undefined
  onChange: (questionId: string, value: string) => void
  onToggle: (questionId: string, value: string) => void
}) {
  switch (question.type) {
    case 1:
      return (
        <input
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(question.id, e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
        />
      )

    case 2:
      return (
        <textarea
          rows={4}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(question.id, e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
        />
      )

    case 4:
      return (
        <div className="space-y-2">
          {question.options.map((option) => (
            <label key={option.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={option.value}
                checked={Array.isArray(value) && value.includes(option.value)}
                onChange={() => onToggle(question.id, option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )

    case 5:
      return (
        <input
          type="email"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(question.id, e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
        />
      )

    case 6:
      return (
        <input
          type="number"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(question.id, e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
        />
      )

    case 7:
      return (
        <input
          type="date"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(question.id, e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 [color-scheme:dark]"
        />
      )

    default:
      return <p className="text-sm text-slate-400">Tipo não suportado.</p>
  }
}