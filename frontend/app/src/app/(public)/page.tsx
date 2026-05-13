"use client"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-violet-300">
      <div className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <header >
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <p>icon</p>
          </div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo</h1>
          <p className="text-violet-200">Entre com suas credenciais para acessar sua conta</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-violet-100 font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/70"
                placeholder="Digite seu email"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-violet-100 font-medium">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/70"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="submit"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-300 hover:text-white transition-colors"
              >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
