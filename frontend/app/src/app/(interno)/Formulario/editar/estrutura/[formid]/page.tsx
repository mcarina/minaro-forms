"use client"

import { useParams } from "next/navigation"
import FormEditor from "@/app/(interno)/Novo-Formulario/components/formEditor"

export default function EditarEstruturaFormularioPage() {
  const params = useParams()
  const formId = params.formid as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/70 to-slate-900 flex flex-col">
      <FormEditor mode="editStructure" formId={formId} />
    </div>
  )
}