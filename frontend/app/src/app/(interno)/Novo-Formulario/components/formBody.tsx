"use client"

import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, FileText } from "lucide-react"
import { FIELD_TYPES, FormField } from "../types/util"
import { FieldRenderer } from "./fieldRenderer"

interface SortableFieldProps {
  field: FormField
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

// representa um campo individual
function SortableField({ field, isSelected, onSelect, onDelete }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const fieldType = FIELD_TYPES.find((f) => f.type === field.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative p-4 rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? "border-purple-500 bg-purple-500/10"
          : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-700 transition-all cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-slate-500" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
              {fieldType?.label}
            </span>
            {field.required && (
              <span className="text-xs text-red-400">*Obrigatório</span>
            )}
          </div>

          <h3 className="text-white font-medium">
            {field.question || "Pergunta sem título"}
          </h3>

          {field.description && (
            <p className="text-sm text-slate-400 mt-1">{field.description}</p>
          )}

          {/* Exibe o campo no formulário */}
          <FieldRenderer field={field} />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

interface FormBodyProps {
  title: string
  description: string
  fields: FormField[]
  selectedFieldId: string | null
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onSelectField: (id: string | null) => void
  onDeleteField: (id: string) => void
}

export function FormBody({
  title,
  description,
  fields,
  selectedFieldId,
  onTitleChange,
  onDescriptionChange,
  onSelectField,
  onDeleteField,
}: FormBodyProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "form-body",
  })

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        {/* Form Header */}
        <div className="p-6 mb-4 rounded-lg border-slate-700/50 bg-slate-800/40 p-6 border-t-4 border-t-purple-500 flex flex-col gap-2">
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Título do formulário"
            className="w-full text-2xl font-bold bg-transparent border-none text-white placeholder:text-slate-400 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Descrição do formulário (opcional)"
            rows={2}
            className="w-full bg-transparent border-none text-slate-300 placeholder:text-slate-500 px-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Fields List */}
        <div
          ref={setNodeRef}
          className={`space-y-4 min-h-[200px] rounded-lg transition-colors ${
            isOver ? "bg-purple-500/10 border-2 border-dashed border-purple-500" : ""
          }`}
        >
          {fields.length > 0 ? (
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onSelect={() => onSelectField(field.id)}
                  onDelete={() => onDeleteField(field.id)}
                />
              ))}
            </SortableContext>
          ) : (
            <div
              className={`flex flex-col items-center justify-center py-16 rounded-lg border-2 border-dashed transition-colors ${
                isOver
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-slate-700 bg-slate-800/20"
              }`}
            >
              <div className="p-4 rounded-full bg-slate-800/50 mb-4">
                <FileText className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 text-center">
                Arraste componentes aqui ou clique na sidebar
                <br />
                <span className="text-sm text-slate-500">
                  para começar a construir seu formulário
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
