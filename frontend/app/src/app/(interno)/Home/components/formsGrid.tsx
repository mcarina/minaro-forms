"use client";
import { Clock, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import FormDropdown from "./FormDropdown";
import { getForms } from "../services/getForms.service";
import { useRouter } from "next/navigation"

export type FormFilter = "all" | "favorites" | "recent"

interface FormsGridProps {
    searchQuery: string;
    filter: FormFilter;
}

interface Form {
    id: string
    title: string
    description: string
    answersCount: number
    lastUpdate: string
    isFavorite: boolean
}

export default function FormsGrid({ searchQuery, filter }: FormsGridProps) {
    const router = useRouter()
    const [forms, setForms] = useState<Form[]>([])
    const normalizedSearch = searchQuery.trim().toLowerCase()
    const visibleForms = forms.filter((form, index) => {
        const matchesSearch =
            form.title.toLowerCase().includes(normalizedSearch) ||
            (form.description ?? "").toLowerCase().includes(normalizedSearch)
        const matchesFilter =
            filter === "all" ||
            (filter === "favorites" && form.isFavorite) ||
            (filter === "recent" && index < 3)

        return matchesSearch && matchesFilter
    })

    const toggleFavorite = (id: string) => {
        setForms((prev) => prev.map((form) => (form.id === id ? { ...form, isFavorite: !form.isFavorite } : form)))
    }

    const deleteForm = (id: string) => {
        setForms((prev) => prev.filter((form) => form.id !== id))
    }

    useEffect(() => {
        async function loadForms() {
            try {
                const data = await getForms()
                setForms(data)
            } catch (error) {
                console.error(error)
            }
        } loadForms()
    }, [])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleForms.map((form) => (
                <div
                    key={form.id}
                    onClick={() => router.push(`/Formulario/${form.id}`)}
                    className="rounded-xl border border-white/10 bg-slate-900/70 p-6 shadow-lg group transition-all duration-300 overflow-visible"
                >
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                    <header className="mt-4 flex items-start justify-between pb-8">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white truncate group-hover:text-purple-200 transition-colors">{form.title}</h3>
                            <p className="text-sm text-white group-hover:text-purple-200 truncate mt-1">{form.description}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite(form.id)
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-300 hover:text-yellow-400 hover:bg-white/10"
                            >
                                <Star className={`w-4 h-4 ${form.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                            </button>
                            <div onClick={(e) => e.stopPropagation()}>
                                <FormDropdown onDelete={() => deleteForm(form.id)} />
                            </div>
                        </div>
                    </header>

                    <div className="pb-8">
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-violet-300">
                                <Users className="w-4 h-4" />
                                <span>{form.answersCount} respostas</span>
                            </div>
                        </div>
                    </div>

                    <footer className="pt-3 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-xs text-violet-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Editado {form.lastUpdate}</span>
                        </div>
                    </footer>
                </div>
            ))}
            {visibleForms.length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-violet-200">
                    Nenhum formulário encontrado.
                </div>
            )}
        </div>
    )
}
