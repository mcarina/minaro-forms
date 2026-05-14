"use client";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ZonaPerigoPage() {
    const [showDeleteFormsDialog, setShowDeleteFormsDialog] = useState(false)

    return (
        <main className="max-w-2xl mx-auto px-4 space-y-6">
            <div className="bg-red-500/15 border-red-500/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="pb-4">
                    <h1 className="text-red-200 text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Zona de Perigo
                    </h1>
                    <p className="text-red-400">
                        Ações irreversíveis que afetam seus dados
                    </p>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="space-y-1">
                        <p className="text-white font-medium">Deletar todos os formulários</p>
                        <p className="text-sm text-white/80">
                            Remove permanentemente todos os seus formulários e respostas
                        </p>
                    </div>
                    <button
                        className="border bg-white rounded-lg px-4 py-1 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500"
                        onClick={() => setShowDeleteFormsDialog(true)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar
                    </button>
                </div>
            </div>


        </main>
    )
}