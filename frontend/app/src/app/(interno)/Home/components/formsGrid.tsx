"use client";
import { Clock, Star, Users } from "lucide-react";
import { FormItem, mockForms } from "../mocks/mockForms";
import { useState } from "react";
import FormDropdown from "./FormDropdown";

export default function FormsGrid() {
    const [forms, setForms] = useState<FormItem[]>(mockForms)

    const toggleFavorite = (id: string) => {
        setForms(forms.map((form) => (form.id === id ? { ...form, isFavorite: !form.isFavorite } : form)))
    }

    const deleteForm = (id: string) => {
        setForms(forms.filter((form) => form.id !== id))
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {forms.map((form) => (
                <div
                    key={form.id}
                    className="rounded-xl border border-white/10 bg-slate-900 p-6 shadow-lg group bg-white/5 border-white/10 transition-all duration-300 overflow-visible"
                >
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                    <header className="mt-4 flex items-start justify-between pb-8">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white truncate group-hover:text-purple-200 transition-colors">{form.title}</h3>
                            <p className="text-sm text-white group-hover:text-purple-200 truncate mt-1">{form.description}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                            <button
                                onClick={() => toggleFavorite(form.id)}
                                className="h-8 w-8 text-violet-300 hover:text-yellow-400 hover:bg-white/10"
                            >
                                <Star className={`w-4 h-4 ${form.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                            </button>

                            <FormDropdown onDelete={() => deleteForm(form.id)} />
                        </div>
                    </header>

                    <div className="pb-8">
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-violet-300">
                                <Users className="w-4 h-4" />
                                <span>{form.responses} respostas</span>
                            </div>
                        </div>
                    </div>

                    <footer className="pt-3 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-xs text-violet-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Editado {form.lastEdited}</span>
                        </div>
                    </footer>
                </div>
            ))}
        </div>
    )
}
