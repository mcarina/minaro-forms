"use client";
import { Clock, FolderOpen, Plus, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormFilter } from "../mocks/mockForms";

interface FilterProps {
    filter: FormFilter;
    onFilterChange: (filter: FormFilter) => void;
}

export default function Filter({ filter, onFilterChange }: FilterProps) {
    const router = useRouter();
    return (
        <div className="flex items-center gap-2 mb-6">
            <button
                onClick={() => onFilterChange("all")}
                className={`flex items-center pl-4 pr-4 pt-2 pb-2 rounded-lg ${filter === "all"
                        ? "bg-purple-600 hover:bg-purple-500 text-white"
                        : "text-violet-300 hover:text-white hover:bg-white/10"
                    }`}
            >
                <FolderOpen className="w-4 h-4 mr-2" />
                todos
            </button>

            <button
                onClick={() => onFilterChange("favorites")}
                className={`flex items-center pl-4 pr-4 pt-2 pb-2 rounded-lg ${filter === "favorites"
                        ? "bg-purple-600 hover:bg-purple-500 text-white"
                        : "text-violet-300 hover:text-white hover:bg-white/10"
                    }`}
            >
                <Star className="w-4 h-4 mr-2" />
                Favoritos
            </button>

            <button
                onClick={() => onFilterChange("recent")}
                className={`flex items-center pl-4 pr-4 pt-2 pb-2 rounded-lg ${filter === "recent"
                        ? "bg-purple-600 hover:bg-purple-500 text-white"
                        : "text-violet-300 hover:text-white hover:bg-white/10"
                    }`}
            >
                <Clock className="w-4 h-4 mr-2" />
                Recentes
            </button>

            <div className="ml-auto">
                <button
                onClick={() => router.push("/Novo-Formulario")} 
                className="flex items-center pl-4 pr-4 pt-2 pb-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Plus className="w-5 h-5 mr-2"/>
                    Novo Formulário
                </button>
            </div>
        </div>
    );
}
