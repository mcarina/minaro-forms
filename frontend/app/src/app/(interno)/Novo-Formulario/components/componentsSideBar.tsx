"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import {
  Type,
  AlignLeft,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Calendar,
  Star,
} from "lucide-react"
import { FIELD_TYPES, FieldType } from "../types/util"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type,
  AlignLeft,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Calendar,
  Star,
}

interface DraggableFieldProps {
  type: FieldType
  label: string
  icon: string
  onAddField: (type: FieldType) => void
}

// representa um item idividual
// permitir arrastar esse item para o editor ou clicar, como onAddField
function DraggableField({ type, label, icon, onAddField }: DraggableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `new-${type}`,
    data: { type, isNew: true },
  })

  const Icon = iconMap[icon]

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onAddField(type)}
      className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-all group"
    >
      {Icon && (
        <div className="p-2 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-purple-400 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </div>
  )
}

interface ComponentsSidebarProps {
  onAddField: (type: FieldType) => void
}

// representa a sidebar inteira
export function ComponentsSidebar({ onAddField }: ComponentsSidebarProps) {
  return (
    <aside className="w-64 bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/50 p-4 flex flex-col">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Componentes
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Arraste ou clique para adicionar
      </p>
      <div className="flex flex-col gap-2">
        {FIELD_TYPES.map((field) => (
          <DraggableField
            key={field.type}
            type={field.type}
            label={field.label}
            icon={field.icon}
            onAddField={onAddField}
          />
        ))}
      </div>
    </aside>
  )
}
