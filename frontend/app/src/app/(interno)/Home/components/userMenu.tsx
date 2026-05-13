"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-violet-200 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-purple-600 flex items-center justify-center">
          <span className="text-sm font-medium text-white">MC</span>
        </div>

        <span className="hidden sm:inline">
          Márcia Carina
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-slate-800 shadow-xl overflow-hidden z-50">
          <button
          onClick={() => router.push("/Meu-Perfil")} 
          className="w-full flex items-center px-4 py-3 text-violet-100 hover:bg-white/10 transition">
            <User className="w-4 h-4 mr-2" />
            Meu Perfil
          </button>

          <button 
          onClick={() => router.push("/Configuracoes")}
          className="w-full flex items-center px-4 py-3 text-violet-100 hover:bg-white/10 transition">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </button>

          <div className="h-px bg-white/10" />

          <Link
            href="/"
            className="flex items-center px-4 py-3 text-red-400 hover:bg-white/10 transition"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Link>
        </div>
      )}
    </div>
  );
}