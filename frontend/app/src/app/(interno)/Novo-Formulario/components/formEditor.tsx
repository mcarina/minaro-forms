"use client";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable"
import { useCallback, useState } from "react";
import { FIELD_TYPES, FieldType, FormField } from "../types/util";
import { ComponentsSidebar } from "./componentsSideBar";
import { FormBody } from "./formBody";
import { PropertiesPanel } from "./PropertiesPanel";

export default function FormEditor() {
    const [title, setTitle] = useState("Novo Formulário")
    const [description, setDescription] = useState("")
    const [activeId, setActiveId] = useState<string | null>(null)
    const [fields, setFields] = useState<FormField[]>([])
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
    const selectedField = fields.find((f) => f.id === selectedFieldId) || null

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    const createNewField = useCallback((type: FieldType): FormField => {
        const fieldType = FIELD_TYPES.find((f) => f.type === type)
        return {
            id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            question: fieldType?.label || "Nova pergunta",
            required: false,
            options:
                type === "multiple_choice" || type === "checkbox" || type === "dropdown"
                    ? [
                        { id: `option-${Date.now()}-1`, label: "Opção 1" },
                        { id: `option-${Date.now()}-2`, label: "Opção 2" },
                    ]
                    : undefined,
            minRating: type === "rating" ? 1 : undefined,
            maxRating: type === "rating" ? 5 : undefined,
        }
    }, [])

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        // New field being dragged from sidebar
        if (active.data.current?.isNew) {
            const type = active.data.current.type as FieldType
            const newField = createNewField(type)
            setFields((prev) => [...prev, newField])
            setSelectedFieldId(newField.id)
            return
        }

        // Reordering existing fields
        if (active.id !== over.id) {
            setFields((prev) => {
                const oldIndex = prev.findIndex((f) => f.id === active.id)
                const newIndex = prev.findIndex((f) => f.id === over.id)
                return arrayMove(prev, oldIndex, newIndex)
            })
        }
    }

    const addField = useCallback(
        (type: FieldType) => {
            const newField = createNewField(type)
            setFields((prev) => [...prev, newField])
            setSelectedFieldId(newField.id)
        },
        [createNewField]
    )

    const deleteField = useCallback(
        (id: string) => {
            setFields((prev) => prev.filter((f) => f.id !== id))
            if (selectedFieldId === id) {
                setSelectedFieldId(null)
            }
        },
        [selectedFieldId]
    )

  const updateField = useCallback(
    (updates: Partial<FormField>) => {
      if (!selectedFieldId) return
      setFields((prev) =>
        prev.map((f) => (f.id === selectedFieldId ? { ...f, ...updates } : f))
      )
    },
    [selectedFieldId]
  )
  
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-700 flex flex-col">
            <div className="p-8">
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex-1 flex overflow-hidden">
                        <ComponentsSidebar onAddField={addField} />
                        <FormBody
                            title={title}
                            description={description}
                            fields={fields}
                            selectedFieldId={selectedFieldId}
                            onTitleChange={setTitle}
                            onDescriptionChange={setDescription}
                            onSelectField={setSelectedFieldId}
                            onDeleteField={deleteField}
                        />
                        <PropertiesPanel field={selectedField} onUpdateField={updateField} />
                    </div>

                    <DragOverlay>
                        {activeId && activeId.startsWith("new-") && (
                            <div className="p-3 rounded-lg bg-purple-600/90 text-white text-sm font-medium shadow-lg">
                                Solte para adicionar
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    )
}