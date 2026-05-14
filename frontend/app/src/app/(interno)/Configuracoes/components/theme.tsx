"use client";
import { Moon, Sun, Monitor, Check} from "lucide-react"
import { useState } from "react"

type Theme = "light" | "dark" | "system"

export default function ThemePage() {
  const [theme, setTheme] = useState<Theme>("dark")
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    //logica
  }
  const themeOptions = [
    { value: "light" as Theme, label: "Claro", icon: Sun },
    { value: "dark" as Theme, label: "Escuro", icon: Moon },
    { value: "system" as Theme, label: "Sistema", icon: Monitor },
  ]

    return (
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6">

                <div className="mb-4">
                    <h2 className="text-white text-lg font-semibold">
                        Aparência
                    </h2>

                    <p className="text-violet-300/70 text-sm mt-1">
                        Escolha o tema da interface
                    </p>
                </div>

                <div className="flex gap-3">
                {themeOptions.map((option) => {
                    const Icon = option.icon
                    const isSelected = theme === option.value
                    return (
                    <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        className={`
                        flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                        ${isSelected 
                            ? "border-purple-500 bg-purple-500/20 text-white" 
                            : "border-white/10 bg-white/5 text-violet-300 hover:border-white/20 hover:bg-white/10"
                        }
                        `}
                    >
                        <Icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{option.label}</span>
                        {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                        )}
                    </button>
                    )
                })}
                </div>
            </div>

        </main>
    );
}