"use client";

import { useState } from "react";
import {
  BarChart3,
  Copy,
  ExternalLink,
  MoreVertical,
  PenLine,
  Trash2,
} from "lucide-react";

interface FormDropdownProps {
  onDelete: () => void;
}

export default function FormDropdown({
  onDelete,
}: FormDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="h-8 w-8 flex items-center justify-center rounded-lg text-violet-300 hover:text-white hover:bg-white/10 transition"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-slate-800 shadow-xl overflow-hidden z-50">
          
          <button className="w-full flex items-center px-4 py-3 text-violet-100 hover:bg-white/10 transition">
            <PenLine className="w-4 h-4 mr-2" />
            Editar
          </button>

          <button className="w-full flex items-center px-4 py-3 text-violet-100 hover:bg-white/10 transition">
            <Copy className="w-4 h-4 mr-2" />
            Duplicar
          </button>

          <button className="w-full flex items-center px-4 py-3 text-violet-100 hover:bg-white/10 transition">
            <ExternalLink className="w-4 h-4 mr-2" />
            Compartilhar
          </button>

          <button className="w-full flex items-center px-4 py-3 text-violet-100 hover:bg-white/10 transition">
            <BarChart3 className="w-4 h-4 mr-2" />
            Ver respostas
          </button>

          <div className="h-px bg-white/10" />

          <button
            onClick={onDelete}
            className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-white/10 transition"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}