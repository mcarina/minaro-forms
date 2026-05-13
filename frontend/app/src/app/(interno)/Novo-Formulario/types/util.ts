export type FieldType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkbox"
  | "dropdown"
  | "date"
  | "rating"

export interface FieldOption {
  id: string
  label: string
}

export interface FormField {
  id: string
  type: FieldType
  question: string
  description?: string
  required: boolean
  options?: FieldOption[]
  minRating?: number
  maxRating?: number
}

export const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: "short_text", label: "Texto Curto", icon: "Type" },
  { type: "long_text", label: "Texto Longo", icon: "AlignLeft" },
  { type: "multiple_choice", label: "Múltipla Escolha", icon: "CircleDot" },
  { type: "checkbox", label: "Caixas de Seleção", icon: "CheckSquare" },
  { type: "dropdown", label: "Lista Suspensa", icon: "ChevronDown" },
  { type: "date", label: "Data", icon: "Calendar" },
  { type: "rating", label: "Escala/Rating", icon: "Star" },
]
