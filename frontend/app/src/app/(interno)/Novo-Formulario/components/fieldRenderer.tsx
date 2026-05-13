"use client"

import { Star } from "lucide-react"
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
            className="w-full rounded-lg bg-slate-800/50 border border-slate-600 px-3 py-2 text-white placeholder:text-slate-500"
          />
        )

      case "long_text":
        return (
            <textarea
            rows={3}
            className="w-full rounded-lg bg-slate-800/50 border border-slate-600 px-3 py-2 text-white placeholder:text-slate-500 resize-none"
            />
        )

      case "multiple_choice":
        return (
          <div className="space-y-2">
            {field.options && field.options.length > 0 ? (
              field.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={option.id}
                    id={option.id}
                    className="border-slate-500 text-purple-500"
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

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options && field.options.length > 0 ? (
              field.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={option.id}
                    disabled={!isPreview}
                    className="border-slate-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
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

      case "dropdown":
        return (
            <select
            disabled={!isPreview}
            className="w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 text-white"
            >
            {field.options && field.options.length > 0 ? (
                field.options.map((option) => (
                <option
                    key={option.id}
                    value={option.id}
                >
                    {option.label}
                </option>
                ))
            ) : (
                <option disabled>
                Adicione opções no painel
                </option>
            )}
            </select>
        )

      case "date":
        return (
          <input
            type="date"
            disabled={!isPreview}
            className="bg-slate-800/50 border-slate-600 text-white [color-scheme:dark]"
          />
        )

      case "rating":
        const min = field.minRating || 1
        const max = field.maxRating || 5
        return (
          <div className="flex items-center gap-1">
            {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
              <button
                key={num}
                type="button"
                disabled={!isPreview}
                className="p-1 text-slate-500 hover:text-yellow-400 transition-colors disabled:hover:text-slate-500"
              >
                <Star className="w-6 h-6" />
              </button>
            ))}
            <span className="ml-2 text-xs text-slate-500">
              {min} - {max}
            </span>
          </div>
        )

      default:
        return null
    }
  }

  return <div className="mt-3">{renderField()}</div>
}
