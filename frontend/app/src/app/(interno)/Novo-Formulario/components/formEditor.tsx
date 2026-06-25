"use client";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable"
import { useCallback, useEffect, useState } from "react";
import { FIELD_TYPES, FieldType, FormField } from "../types/util";
import { ComponentsSidebar } from "./componentsSideBar";
import { FormBody } from "./formBody";
import Header from "./header";
import { PropertiesPanel } from "./PropertiesPanel";
import { getMe } from "../../Meu-Perfil/services/getUserId.service";
import { createForm, replaceFormStructure } from "../services/createform.service";
import { getFormById } from "../../Formulario/services/getforms.service";
import { useRouter } from "next/navigation";

interface FormEditorProps {
  mode?: "create" | "editStructure"
  formId?: string
}

export default function FormEditor({
  mode = "create",
  formId,
}: FormEditorProps) {
    const router = useRouter()
    const [title, setTitle] = useState("Novo Formulário")
    const [description, setDescription] = useState("")
    const [activeId, setActiveId] = useState<string | null>(null)
    const [fields, setFields] = useState<FormField[]>([])
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
    const selectedField = fields.find((f) => f.id === selectedFieldId) || null
    const [ownerUserId, setOwnerUserId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getMe()
                setOwnerUserId(user.id)
            } catch (error) {
                console.error(error)
            }
        }

        loadUser()
    }, [])

    useEffect(() => {
        async function loadFormForEditing() {
            if (mode !== "editStructure" || !formId) return

            try {
                const form = await getFormById(formId)

                if (!form.canEditStructure) {
                    router.push(`/Formulario/editar/${formId}`)
                    return
                }

                setTitle(form.title)
                setDescription(form.description ?? "")

                setFields(
                    form.questions
                        .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
                        .map((question: {
                            id: string
                            type: 1 | 2 | 4 | 5 | 6 | 7
                            title: string
                            description: string | null
                            isRequired: boolean
                            options: {
                                id: string
                                label: string
                                value: string
                                position: number
                            }[]
                        }) => ({
                            id: question.id,
                            type: apiTypeToFieldType[question.type],
                            question: question.title,
                            description: question.description ?? undefined,
                            required: question.isRequired,
                            options:
                                question.options?.length > 0
                                    ? question.options
                                        .sort((a, b) => a.position - b.position)
                                        .map((option) => ({
                                            id: option.id,
                                            label: option.label,
                                            value: option.value,
                                        }))
                                    : undefined,
                        }))
                )
            } catch (error) {
                console.error("Erro ao carregar formulário para edição:", error)
            }
        }

        loadFormForEditing()
    }, [mode, formId, router])

    const createNewField = useCallback((type: FieldType): FormField => {
        const fieldType = FIELD_TYPES.find((f) => f.type === type)
        return {
            id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            type,
            question: fieldType?.label || "Nova pergunta",
            required: false,
            options:
                type === "multiple_choice"
                    ? [
                        { id: `option-${Date.now()}-1`, label: "Opção 1", value: "opcao_1" },
                        { id: `option-${Date.now()}-2`, label: "Opção 2", value: "opcao_2" },
                    ]
                    : undefined,
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
                if (oldIndex === -1 || newIndex === -1) return prev
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

    const questionTypeMap = {
        short_text: 1,
        long_text: 2,
        multiple_choice: 4,
        email: 5,
        number: 6,
        date: 7,
    } as const

    const apiTypeToFieldType = {
        1: "short_text",
        2: "long_text",
        4: "multiple_choice",
        5: "email",
        6: "number",
        7: "date",
    } as const

    const buildPayload = () => {
        if (mode === "create" && !ownerUserId) {
        throw new Error("Usuário não encontrado")
        }

        const questions = fields.map((field) => ({
        type: questionTypeMap[field.type],
        title: field.question,
        description: field.description || null,
        isRequired: field.required,
        settings: null,
        options:
            field.options?.map((option) => ({
            label: option.label,
            value: option.value,
            })) ?? null,
        }))

        if (mode === "editStructure") {
        return {
            title,
            description: description || null,
            questions,
        }
        }

        return {
        ownerUserId: ownerUserId!,
        title,
        description: description || null,
        questions,
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)

            const payload = buildPayload()

            if (mode === "editStructure") {
            if (!formId) {
                throw new Error("Formulário não encontrado")
            }

            await replaceFormStructure(formId, payload)
            router.push("/Home")
            return
            }

            await createForm(payload)
            router.push("/Home")
            
        } catch (error) {
            console.error("Erro ao salvar formulário:", error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <Header
                title={title}
                fieldsCount={fields.length}
                onTitleChange={setTitle}
                onSave={handleSave}
                saving={saving}
            />
            <div className="flex-1 p-8">
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
        </>
    )
}
