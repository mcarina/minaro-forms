"use client";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ZonaPerigoPage() {
    const [showDeleteFormsDialog, setShowDeleteFormsDialog] = useState(false)
    const [deleteFormsPassword, setDeleteFormsPassword] = useState("")
    const [showDeleteFormsPassword, setShowDeleteFormsPassword] = useState(false)
    const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false)
    const [showDeleteAccountPassword, setShowDeleteAccountPassword] = useState(false)
    const [deleteAccountPassword, setDeleteAccountPassword] = useState("")
    
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
                        className="mr-2 flex flex-row items-center border bg-white rounded-lg px-4 py-1 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500"
                        onClick={() => setShowDeleteFormsDialog(true)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar
                    </button>

                </div>

                <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="space-y-1">
                        <p className="text-white font-medium">Excluir Conta</p>
                        <p className="text-sm text-white/80">
                            Apaga permanentemente sua conta e todos os dados associados a ela, incluindo formulários,
                            respostas e configurações. Esta ação é irreversível.
                        </p>
                    </div>
                    <button
                        className="mr-2 flex flex-row items-center border bg-white rounded-lg px-4 py-1 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500"
                        onClick={() => setShowDeleteAccountDialog(true)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar
                    </button>

                </div>
            </div>

            {showDeleteFormsDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl">
                        <div className="mb-4">
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertTriangle className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">Deletar todos os Formulários</h2>
                            </div>
                            <p className="mt-2 text-sm text-violet-300/70">Esta ação é irreversível</p>
                        </div>

                        <div>
                            <div className="space-y-2">
                                <label htmlFor="delete-form-password" className="text-sm text-violet-200">
                                    Digite sua senha para confirmar:
                                </label>
                                <div className="relative">
                                    <input
                                        id="delete-form-password"
                                        type={
                                            showDeleteFormsPassword ? "text" : "password"
                                        }
                                        value={deleteFormsPassword}
                                        onChange={(e) => setDeleteFormsPassword(e.target.value)}
                                        placeholder="Digite sua senha"
                                        className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 pr-10 text-white placeholder:text-violet-300/40 outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <footer className="mt-6 flex justify-end gap-2">
                                <button 
                                onClick={()=> setShowDeleteFormsDialog(false)}
                                className="rounded-lg border border-white/10 px-4 py-2 text-violet-200 hover:bg-white/10 transition"
                                >
                                    Cancelar
                                </button>

                                <button className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition">
                                    Deletar
                                </button>
                            </footer>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteAccountDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl">
                        <div className="mb-4">
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertTriangle className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">Deletar Conta</h2>
                            </div>
                            <p className="mt-2 text-sm text-violet-300/70">
                                Esta ação é irreversível. Sua conta, formulários e todos os dados serão permanentemente excluídos.
                            </p>
                        </div>

                        <div>
                            <div className="space-y-2">
                                <label htmlFor="delete-form-password" className="text-sm text-violet-200">
                                    Digite sua senha para confirmar:
                                </label>
                                <div className="relative">
                                    <input
                                        id="delete-form-password"
                                        type={
                                            showDeleteAccountPassword ? "text" : "password"
                                        }
                                        value={deleteAccountPassword}
                                        onChange={(e) => setDeleteAccountPassword(e.target.value)}
                                        placeholder="Digite sua senha"
                                        className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 pr-10 text-white placeholder:text-violet-300/40 outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <footer className="mt-6 flex justify-end gap-2">
                                <button 
                                onClick={()=> setShowDeleteAccountDialog(false)}
                                className="rounded-lg border border-white/10 px-4 py-2 text-violet-200 hover:bg-white/10 transition"
                                >
                                    Cancelar
                                </button>

                                <button className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition">
                                    Deletar
                                </button>
                            </footer>
                        </div>
                    </div>
                </div>
            )}

        </main>
    )
}