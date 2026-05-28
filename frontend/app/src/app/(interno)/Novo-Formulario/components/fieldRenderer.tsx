"use client"

import { FormField } from "../types/util"

interface FieldRendererProps {
  field: FormField
  isPreview?: boolean
}

export function FieldRenderer({ field, isPreview = false }: FieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case "short_text":
        return (
          <input
            disabled={!isPreview}
            className="w-full rounded-lg bg-slate-800/50 border border-slate-600 px-3 py-2 text-white placeholder:text-slate-500"
          />
        )

      case "long_text":
        return (
            <textarea
            disabled={!isPreview}
            rows={3}
            className="w-full rounded-lg bg-slate-800/50 border border-slate-600 px-3 py-2 text-white placeholder:text-slate-500 resize-none"
            />
        )

      case "email":
        return (
          <input
            type="email"
            disabled={!isPreview}
            className="w-full rounded-lg bg-slate-800/50 border border-slate-600 px-3 py-2 text-white placeholder:text-slate-500"
          />
        )

      case "number":
        return (
          <input
            type="number"
            disabled={!isPreview}
            className="w-full rounded-lg bg-slate-800/50 border border-slate-600 px-3 py-2 text-white placeholder:text-slate-500"
          />
        )

    case "multiple_choice":
      return (
        <div className="space-y-2">
          {field.options && field.options.length > 0 ? (
            field.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option.value}
                  id={option.id}
                  disabled={!isPreview}
                  className="accent-purple-500"
                />
                <label htmlFor={option.id} className="text-slate-300 cursor-pointer">
                  {option.label}
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic">
              Adicione opções no painel de propriedades
            </p>
          )}
        </div>
      )

      case "date":
        return (
          <input
            type="date"
            disabled={!isPreview}
            className="rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-white [color-scheme:dark]"
          />
        )

      default:
        return null
    }
  }

  return <div className="mt-3">{renderField()}</div>
}
