"use client"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-700">
      <div className="w-full p-8 max-w-md relative z-10 bg-white/10 backdrop-blur-xl border-white/20 rounded-3xl shadow-2xl">
        <header >
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo</h1>
          <p className="text-violet-200">Entre com suas credenciais para acessar sua conta</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-violet-100 font-medium">Email</label>
              <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-300" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 text-white h-12 w-full  bg-white/10 rounded-lg"
                placeholder="Digite seu email"
                required
              />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-violet-100 font-medium">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 text-white h-12 w-full bg-white/10 rounded-lg"
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

          </div>
        </form>

        <footer className="flex flex-col space-y-4 mt-6">
          <button
            type="submit"
            onClick={() => router.push("/Home")}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-5 shadow-lg shadow-purple-500/30 transition-all duration-300"
          >
            Entrar
          </button>

          <p className="text-center text-sm text-violet-200">
            Não tem uma conta?{" "}
            <a href="#" className="text-purple-300 hover:text-purple-200 font-medium transition-colors">
              Cadastre-se
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
