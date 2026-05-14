"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react"

export default function FormPerfil() {
    const [nome, setNome] = useState("Márcia Carina")
    const [email, setEmail] = useState("marciacarina931@gmail.com")
    const [alterandoSenha, setAlterandoSenha] = useState(false)
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [senhaAtual, setSenhaAtual] = useState("")
    const [novaSenha, setNovaSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <label htmlFor="nome" className="text-violet-200">
                    Nome
                </label>
                <input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="border rounded-lg py-2 px-4 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500 focus:ring-purple-500/20"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-violet-200">
                    Email
                </label>
                <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-lg py-2 px-4 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500 focus:ring-purple-500/20"
                />
            </div>

            {!alterandoSenha ? (
                <button
                    onClick={() => setAlterandoSenha(true)}
                    className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                    Alterar senha
                </button>
            ) : (
                <div className="space-y-4 pt-2 border-t border-white/10">
                    <p className="text-sm text-violet-200 pt-4">Alterar senha</p>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="senhaAtual" className="text-violet-200">
                            Senha Atual
                        </label>

                        <div className="relative">
                            <input
                                id="senhaAtual"
                                value={mostrarSenha ? "123456" : "**********"}
                                // value={senhaAtual}
                                onChange={(e) => setSenhaAtual(e.target.value)}
                                className="w-full border rounded-lg py-2 px-4 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500 focus:ring-purple-500/20 outline-none"
                            />

                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                            >
                                {mostrarSenha ? (<EyeOff className="w-4 h-4" />) : (<Eye className="w-4 h-4" />)}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="novaSenha" className="text-violet-200">
                            Nova Senha
                        </label>

                        <div className="relative">
                            <input
                                id="novaSenha"
                                // value={mostrarSenha ? "123456" : "**********"}
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                className="w-full border rounded-lg py-2 px-4 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500 focus:ring-purple-500/20 outline-none"
                            />

                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                            >
                                {mostrarSenha ? (<EyeOff className="w-4 h-4" />) : (<Eye className="w-4 h-4" />)}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="confirmarSenha" className="text-violet-200">
                            Confirmar Senha
                        </label>

                        <div className="relative">
                            <input
                                id="confirmarSenha"
                                // value={mostrarSenha ? "123456" : "**********"}
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                className="w-full border rounded-lg py-2 px-4 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500 focus:ring-purple-500/20 outline-none"
                            />

                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                            >
                                {mostrarSenha ? (<EyeOff className="w-4 h-4" />) : (<Eye className="w-4 h-4" />)}
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                setAlterandoSenha(false)
                                setSenhaAtual("")
                                setNovaSenha("")
                                setConfirmarSenha("")
                            }}
                            className="text-sm text-white/70">
                            Cancelar
                        </button>
                    </div>

                </div>
            )}

            <div>
                <button className="rounded-lg py-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/25 disabled:opacity-50">
                    salvar
                </button>
            </div>
            
        </div>

    )
}