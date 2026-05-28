"use client"

import { useState } from "react"
import { Plus, X, GripVertical } from "lucide-react"
import { FIELD_TYPES, FieldOption, FormField } from "../types/util"

interface PropertiesPanelProps {
  field: FormField | null
  onUpdateField: (updates: Partial<FormField>) => void
}

export function PropertiesPanel({ field, onUpdateField }: PropertiesPanelProps) {
  const [newOption, setNewOption] = useState("")

  if (!field) {
    return (
      <aside className="w-72 bg-slate-900/80 backdrop-blur-sm border-l border-slate-700/50 p-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Propriedades
        </h2>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="p-4 rounded-full bg-slate-800/50 mb-4">
            <svg
              className="w-6 h-6 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-500">
            Selecione um campo para editar suas propriedades
          </p>
        </div>
      </aside>
    )
  }

  const fieldType = FIELD_TYPES.find((f) => f.type === field.type)
  const hasOptions = field.type === "multiple_choice"
  const addOption = () => {
    if (!newOption.trim()) return
    const option: FieldOption = {
      id: `option-${Date.now()}`,
      label: newOption.trim(),
      value: newOption.trim().toLowerCase().replace(/\s+/g, "_"),
    }
    onUpdateField({
      options: [...(field.options || []), option],
    })
    setNewOption("")
  }

  const removeOption = (optionId: string) => {
    onUpdateField({
      options: (field.options || []).filter((o) => o.id !== optionId),
    })
  }

  const updateOptionLabel = (optionId: string, label: string) => {
    onUpdateField({
      options: (field.options || []).map((o) =>
        o.id === optionId ? { ...o, label } : o
      ),
    })
  }

  return (
    <aside className="w-72 bg-slate-900/80 backdrop-blur-sm border-l border-slate-700/50 p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Propriedades
      </h2>

      <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
        <span className="text-xs text-purple-400">{fieldType?.label}</span>
      </div>

      <div className="space-y-5">
        {/* Question */}
        <div className="space-y-2">
          <label htmlFor="question" className="text-slate-300">
            Pergunta
          </label>
          <input
            id="question"
            value={field.question}
            onChange={(e) => onUpdateField({ question: e.target.value })}
            placeholder="Digite a pergunta"
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-white placeholder:text-slate-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-slate-300">
            Descrição (opcional)
          </label>
          <textarea
            id="description"
            value={field.description || ""}
            onChange={(e) => onUpdateField({ description: e.target.value })}
            placeholder="Texto de ajuda para o respondente"
            rows={2}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-white placeholder:text-slate-500 resize-none"
          />
        </div>

        {/* Required toggle */}
        <div className="flex items-center justify-between">
          <label htmlFor="required" className="text-slate-300">
            Obrigatório
          </label>
          <input
            id="required"
            type="checkbox"
            checked={field.required}
            onChange={(e) =>
              onUpdateField({
                required: e.target.checked,
              })
            }
            className="w-5 h-5 accent-purple-500"
          />
        </div>

        {/* Options for single and multiple choice */}
        {hasOptions && (
          <div className="space-y-3">
            <label className="text-slate-300">Opções</label>
            <div className="space-y-2">
              {(field.options || []).map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-slate-600 cursor-grab" />
                  <input
                    value={option.label}
                    onChange={(e) => updateOptionLabel(option.id, e.target.value)}
                    className="h-9 flex-1 rounded-lg border border-slate-600 bg-slate-800/50 px-3 text-sm text-white"
                    placeholder={`Opção ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(option.id)}
                    className="p-1.5 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addOption()}
                placeholder="Nova opção"
                className="h-9 flex-1 rounded-lg border border-slate-600 bg-slate-800/50 px-3 text-sm text-white"
              />
              <button
                type="button"
                onClick={addOption}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 text-slate-300 hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
