"use client";

import { useState } from "react";
import { ChefHat, Flame, TrendingUp, Star, Clock, Users, Heart, ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";

const filterCategories = [
  {
    id: "type",
    name: "Tipo de Receita",
    options: [
      { id: "fitness", name: "Fitness", icon: Flame, count: 120 },
      { id: "viral", name: "Virais", icon: TrendingUp, count: 85 },
      { id: "tematica", name: "Temáticas", icon: Star, count: 95 }
    ]
  },
  {
    id: "time",
    name: "Tempo de Preparo",
    options: [
      { id: "quick", name: "Rápido (< 15 min)", icon: Clock, count: 150 },
      { id: "medium", name: "Médio (15-30 min)", icon: Clock, count: 180 },
      { id: "long", name: "Elaborado (> 30 min)", icon: Clock, count: 70 }
    ]
  },
  {
    id: "difficulty",
    name: "Dificuldade",
    options: [
      { id: "easy", name: "Fácil", icon: ChefHat, count: 200 },
      { id: "medium", name: "Médio", icon: ChefHat, count: 150 },
      { id: "hard", name: "Difícil", icon: ChefHat, count: 50 }
    ]
  },
  {
    id: "popularity",
    name: "Popularidade",
    options: [
      { id: "trending", name: "Em Alta", icon: TrendingUp, count: 45 },
      { id: "popular", name: "Mais Curtidas", icon: Heart, count: 60 },
      { id: "community", name: "Favoritos da Comunidade", icon: Users, count: 55 }
    ]
  }
];

export default function FiltrosPage() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const toggleFilter = (categoryId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const current = prev[categoryId] || [];
      const isSelected = current.includes(optionId);
      
      return {
        ...prev,
        [categoryId]: isSelected
          ? current.filter(id => id !== optionId)
          : [...current, optionId]
      };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  const activeFiltersCount = Object.values(selectedFilters).flat().length;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-24">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-[#0D0D0D]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-white/60 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF7F] to-[#00CC66] flex items-center justify-center">
                  <Filter className="w-5 h-5 text-[#0D0D0D]" />
                </div>
                <h1 className="text-xl font-bold">Filtros</h1>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-[#00FF7F] hover:text-[#00CC66] transition-colors"
              >
                Limpar ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-[#00FF7F]/10 border border-[#00FF7F]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#00FF7F]" />
                <span className="text-sm font-medium text-[#00FF7F]">
                  {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
                </span>
              </div>
              <Link
                href="/busca"
                className="px-4 py-2 rounded-lg bg-[#00FF7F] text-[#0D0D0D] font-semibold text-sm hover:bg-[#00CC66] transition-all hover:scale-105"
              >
                Ver Resultados
              </Link>
            </div>
          </div>
        )}

        {/* Filter Categories */}
        <div className="space-y-8">
          {filterCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              <h2 className="text-xl font-bold text-white">{category.name}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.options.map((option) => {
                  const isSelected = selectedFilters[category.id]?.includes(option.id);
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleFilter(category.id, option.id)}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? "bg-[#00FF7F]/10 border-[#00FF7F] shadow-lg shadow-[#00FF7F]/20"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <option.icon className={`w-5 h-5 ${isSelected ? "text-[#00FF7F]" : "text-white/60"}`} />
                        <span className={`text-xs font-medium ${isSelected ? "text-[#00FF7F]" : "text-white/40"}`}>
                          {option.count} receitas
                        </span>
                      </div>
                      
                      <h3 className={`text-sm font-semibold ${isSelected ? "text-white" : "text-white/80"}`}>
                        {option.name}
                      </h3>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Apply Button (Mobile) */}
        <div className="md:hidden fixed bottom-20 left-0 right-0 px-4">
          <Link
            href="/busca"
            className="block w-full py-4 rounded-2xl bg-[#00FF7F] text-[#0D0D0D] font-bold text-center hover:bg-[#00CC66] transition-all shadow-2xl shadow-[#00FF7F]/20"
          >
            Aplicar Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Link>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="flex items-center justify-around px-4 py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-white/60">
            <ChefHat className="w-5 h-5" />
            <span className="text-xs font-medium">Início</span>
          </Link>
          <Link href="/busca" className="flex flex-col items-center gap-1 text-white/60">
            <Filter className="w-5 h-5" />
            <span className="text-xs font-medium">Buscar</span>
          </Link>
          <Link href="/favoritos" className="flex flex-col items-center gap-1 text-white/60">
            <Heart className="w-5 h-5" />
            <span className="text-xs font-medium">Favoritos</span>
          </Link>
          <Link href="/perfil" className="flex flex-col items-center gap-1 text-white/60">
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
