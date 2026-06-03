"use client";

import { useState } from "react";
import Filter from "./components/filter";
import FormsGrid, { FormFilter } from "./components/formsGrid";
import Header from "./components/header";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FormFilter>("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-700">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="p-8">
        <Filter filter={filter} onFilterChange={setFilter} />
        <FormsGrid searchQuery={searchQuery} filter={filter} />
      </div>
    </div>
  );
}