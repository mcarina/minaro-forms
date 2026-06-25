"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Info, Save } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getFormById, patchForm } from "../../services/getforms.service"

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

export default function EditarFormularioPage() {
  const params = useParams()
  const formId = params.formid as string

  const [form, setForm] = useState<ApiForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadForm() {
      try {
        setLoading(true)
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

  const updateForm = (updates: Partial<ApiForm>) => {
    setForm((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  const updateQuestion = (
    questionId: string,
    updates: Partial<ApiQuestion>
  ) => {
    setForm((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        questions: prev.questions.map((question) =>
          question.id === questionId
            ? { ...question, ...updates }
            : question
        ),
      }
    })
  }

  const updateOption = (
    questionId: string,
    optionId: string,
    updates: Partial<ApiOption>
  ) => {
    setForm((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        questions: prev.questions.map((question) =>
          question.id === questionId
            ? {
                ...question,
                options: question.options.map((option) =>
                  option.id === optionId
                    ? { ...option, ...updates }
                    : option
                ),
              }
            : question
        ),
      }
    })
  }

  const handleSave = async () => {
    if (!form) return

    try {
      setSaving(true)
      setMessage("")

      await patchForm(form.id, {
        title: form.title,
        description: form.description,
        questions: form.questions.map((question) => ({
          id: question.id,
          title: question.title,
          description: question.description,
          isRequired: question.isRequired,
          settings: parseSettings(question.settingsJson),
          options: question.options.map((option) => ({
            id: option.id,
            label: option.label,
            value: option.value,
          })),
        })),
      })

      setMessage("Formulário salvo com sucesso.")
    } catch (error) {
      console.error(error)
      setMessage("Erro ao salvar formulário.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/70 to-slate-900 p-8 text-white">
        Carregando formulário...
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/70 to-slate-900 p-8 text-white">
        Formulário não encontrado.
      </div>
    )
  }


function parseSettings(settingsJson: string | null) {
  if (!settingsJson) return null

  try {
    return JSON.parse(settingsJson)
  } catch {
    return null
  }
}

function getQuestionTypeLabel(type: number) {
  const labels: Record<number, string> = {
    1: "Texto curto",
    2: "Texto longo",
    3: "Escolha única",
    4: "Múltipla escolha",
    5: "Email",
    6: "Número",
    7: "Data",
  }

  return labels[type] ?? "Pergunta"
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/70 to-slate-900 flex flex-col">
      <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/Home"
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <h1 className="text-lg font-semibold text-white">Editar formulário</h1>
            <p className="text-xs text-slate-500">
              {form.questions.length} perguntas · estrutura bloqueada
            </p>
          </div>
        </div>

        <Button
          disabled={saving}
          onClick={handleSave}
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white min-w-[110px] disabled:opacity-50"
        >
          <span className="flex items-center">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Salvando..." : "Salvar"}
          </span>
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-600 p-4">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">
                Estrutura bloqueada
              </p>
              <p className="text-sm text-white mt-0.5">
                Para preservar os dados, não é possível adicionar, remover ou reordenar
                perguntas. Você ainda pode editar os textos e configurações.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6 border-t-4 border-t-purple-500 space-y-4">
            <input
              value={form.title}
              onChange={(event) => updateForm({ title: event.target.value })}
              className="w-full bg-slate-700/70 border border-slate-600 rounded-lg px-4 py-3 text-xl font-semibold text-white outline-none focus:border-purple-500"
            />

            <textarea
              value={form.description ?? ""}
              onChange={(event) =>
                updateForm({ description: event.target.value || null })
              }
              rows={2}
              placeholder="Descrição do formulário"
              className="w-full bg-transparent border border-slate-700 rounded-lg px-4 py-3 text-slate-300 outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {form.questions
            .sort((a, b) => a.position - b.position)
            .map((question, index) => (
              <section
                key={question.id}
                className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6 space-y-4"
              >
                <div className="flex items-center justify-between text-sm text-white">
                  <span>Pergunta {index + 1}</span>
                  <span>{getQuestionTypeLabel(question.type)}</span>
                </div>

                <input
                  value={question.title}
                  onChange={(event) =>
                    updateQuestion(question.id, { title: event.target.value })
                  }
                  className="w-full bg-slate-700/70 border border-slate-600 rounded-lg px-4 py-3 font-medium text-white outline-none focus:border-purple-500"
                />

                <input
                  value={question.description ?? ""}
                  onChange={(event) =>
                    updateQuestion(question.id, {
                      description: event.target.value || null,
                    })
                  }
                  placeholder="Texto de ajuda (opcional)"
                  className="w-full bg-transparent border border-slate-700 rounded-lg px-4 py-3 text-slate-300 outline-none focus:border-purple-500"
                />

                {question.options.length > 0 && (
                  <div className="space-y-2">
                    {question.options
                      .sort((a, b) => a.position - b.position)
                      .map((option) => (
                        <input
                          key={option.id}
                          value={option.label}
                          onChange={(event) =>
                            updateOption(question.id, option.id, {
                              label: event.target.value,
                              value: event.target.value,
                            })
                          }
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500"
                        />
                      ))}
                  </div>
                )}

                <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-sm text-slate-300">
                    Pergunta obrigatória
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuestion(question.id, {
                        isRequired: !question.isRequired,
                      })
                    }
                    className={`h-6 w-11 rounded-full p-1 transition ${
                      question.isRequired
                        ? "bg-purple-500"
                        : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white transition ${
                        question.isRequired
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </section>
            ))}

          {message && (
            <p className="text-sm text-violet-200 text-center">
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
