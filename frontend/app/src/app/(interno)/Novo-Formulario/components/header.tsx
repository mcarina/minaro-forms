"use client";
import Link from "next/link"
import { ArrowLeft, Eye, Save } from "lucide-react";
import { useState } from "react";
import { FormField } from "../types/util";

export default function Header() {
    const [title, setTitle] = useState("Novo Formulário")
    const [fields, setFields] = useState<FormField[]>([])

    return (
        <div>
            <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/Home"
                        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nome do Formulário"
                            className="bg-transparent text-lg font-semibold text-white border-none outline-none focus:ring-0"
                        />
                        <p className="text-xs text-slate-500">
                            {fields.length} {fields.length === 1 ? "campo" : "campos"}
                            adicionados
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center px-4 py-2 rounded-lg rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <Eye className="w-4 h-4 mr-2" />
                        visualizar
                    </button>

                    <button className="flex items-center px-4 py-2 rounded-lg rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <Save className="w-4 h-4 mr-2"/>
                        Salvar
                    </button>
                </div>
            </header>
        </div>
    )
}