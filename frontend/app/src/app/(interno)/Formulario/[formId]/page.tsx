"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getFormById } from "../services/getforms.service"

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
  ownerUserId: string
  title: string
  description: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
  questions: ApiQuestion[]
}

export default function FormularioPage() {
  const params = useParams()
  const formId = params.formId as string

  const [form, setForm] = useState<ApiForm | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadForm() {
      try {
        const data = await getFormById(formId)
        setForm(data)
      } catch (error) {
        console.error("Erro ao buscar formulário:", error)
      } finally {
        setLoading(false)
      }
    }

    if (formId) {
      loadForm()
    }
  }, [formId])

  if (loading) {
    return <p className="text-white p-8">Carregando formulário...</p>
  }

  if (!form) {
    return <p className="text-white p-8">Formulário não encontrado.</p>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-700 p-8 text-white">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="rounded-lg border border-purple-500/30 p-6">
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
                className="rounded-lg bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-violet-600/20 border border-purple-500/30 p-5"
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
                  {renderQuestion(question)}
                </div>
              </section>
            ))}
        </div>
      </div>
    </main>
  )
}

function renderQuestion(question: ApiQuestion) {
  switch (question.type) {
    case 1:
      return (
        <input disabled placeholder="Resposta curta" className="w-full bg-transparent rounded-lg border border-slate-400 bg-slate-800 px-3 py-2" />
      )

    case 2:
      return (
        <textarea
          disabled
          placeholder="Resposta longa"
          rows={4}
          className="w-full rounded-lg border bg-transparent border-slate-400 bg-slate-800 px-3 py-2"
        />
      )

    case 4:
      return (
        <div className="space-y-2">
          {question.options.map((option) => (
            <label key={option.id} className="flex items-center gap-2">
              <input disabled type="checkbox" value={option.value} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )

    case 5:
      return (
        <input
          disabled
          placeholder="email@exemplo.com"
          type="email"
          className="w-full bg-transparent rounded-lg border border-slate-400 bg-slate-800 px-3 py-2"
        />
      )

    case 6:
      return (
        <input
          disabled
          placeholder="Número"
          type="number"
          className="w-full bg-transparent rounded-lg border border-slate-400 bg-slate-00 px-3 py-2"
        />
      )

    case 7:
      return (
        <input
          disabled
          type="date"
          className="bg-transparent rounded-lg border border-slate-400 bg-slate-800 px-3 py-2 [color-scheme:dark]"
        />
      )

    default:
      return <p className="text-sm text-slate-400">Tipo não suportado.</p>
  }
}