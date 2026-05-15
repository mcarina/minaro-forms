"use client"

import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { login } from "../services/auth.service"

export default function LoginPage() {
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            setError("")

            const data = await login({
                email,
                password,
            })

            localStorage.setItem("token", data.token)

            console.log("Login successful:", data)

            router.push("/Home")
        } catch (error) {
            console.error(error)

            setError("Email ou senha inválidos")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full p-8 max-w-md relative z-10 bg-white/10 backdrop-blur-xl border-white/20 rounded-3xl shadow-2xl">

            <header className="space-y-4 text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Lock className="w-8 h-8 text-white" />
                </div>

                <h1 className="text-2xl font-bold text-white">
                    Bem-vindo
                </h1>

                <p className="text-violet-200">
                    Entre com suas credenciais para acessar sua conta
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="text-violet-100 font-medium"
                    >
                        Email
                    </label>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-300" />

                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 text-white h-12 w-full bg-white/10 rounded-lg"
                            placeholder="Digite seu email"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="text-violet-100 font-medium"
                    >
                        Senha
                    </label>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-300" />

                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 text-white h-12 w-full bg-white/10 rounded-lg"
                            placeholder="Digite sua senha"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-300 hover:text-white transition-colors"
                        >
                            {showPassword
                                ? <EyeOff className="w-5 h-5" />
                                : <Eye className="w-5 h-5" />
                            }
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="text-red-400 text-sm">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 shadow-lg shadow-purple-500/30 transition-all duration-300 disabled:opacity-50"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>

            </form>

            <footer className="mt-6">
                <p className="text-center text-sm text-violet-200">
                    Não tem uma conta?{" "}
                    <a
                        href="#"
                        className="text-purple-300 hover:text-purple-200 font-medium transition-colors"
                    >
                        Cadastre-se
                    </a>
                </p>
            </footer>

        </div>
    )
}