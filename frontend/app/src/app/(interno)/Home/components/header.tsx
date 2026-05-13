"use client";
import { FileText, Search } from "lucide-react";
import { useState } from "react";
import UserMenu from "./userMenu";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-white" />
        </div>

        <div className="mx-8 max-w-xl flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-300" />
            <input
              type="text"
              placeholder="Buscar por nome"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 text-white outline-none placeholder:text-violet-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        <div className="relative">
            <UserMenu />    
        </div>
      </div>
    </header>
  );
}
