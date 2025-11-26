"use client";

import { useState } from "react";
import { Search, ChefHat, Clock, Star, Heart, ArrowLeft, TrendingUp, Flame, Filter, X } from "lucide-react";
import Link from "next/link";

const mockRecipes = [
  {
    id: 1,
    title: "Bowl de Açaí Fitness",
    category: "fitness",
    time: "10 min",
    difficulty: "Fácil",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
    likes: 1240
  },
  {
    id: 2,
    title: "Smoothie Proteico Verde",
    category: "fitness",
    time: "5 min",
    difficulty: "Fácil",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop",
    likes: 980
  },
  {
    id: 3,
    title: "Panqueca de Banana Viral",
    category: "viral",
    time: "15 min",
    difficulty: "Médio",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&h=300&fit=crop",
    likes: 2100
  },
  {
    id: 4,
    title: "Salada Caesar Premium",
    category: "fitness",
    time: "20 min",
    difficulty: "Fácil",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    likes: 750
  }
];

const recentSearches = [
  "Bowl de açaí",
  "Receitas fitness",
  "Panqueca proteica",
  "Smoothie verde"
];

const trendingSearches = [
  { term: "Brownie fit", icon: Flame },
  { term: "Wrap de frango", icon: TrendingUp },
  { term: "Salada caesar", icon: Star }
];

export default function BuscaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const filteredRecipes = mockRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-24">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-[#0D0D0D]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#00FF7F] transition-colors" />
              <input
                type="text"
                placeholder="Buscar receitas..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF7F] focus:bg-white/10 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <Link
              href="/filtros"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results */}
        {isSearching && searchQuery && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Resultados para "{searchQuery}"
              </h2>
              <span className="text-sm text-white/60">{filteredRecipes.length} receitas</span>
            </div>

            {filteredRecipes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nenhuma receita encontrada</h3>
                <p className="text-white/60">Tente buscar por outro termo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/receita/${recipe.id}`}
                    className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-[#00FF7F]/50 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#00FF7F]/10"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent" />
                    </div>

                    <div className="p-5 space-y-3">
                      <h4 className="text-lg font-bold text-white group-hover:text-[#00FF7F] transition-colors line-clamp-1">
                        {recipe.title}
                      </h4>

                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {recipe.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#00FF7F] fill-[#00FF7F]" />
                          {recipe.rating}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                          {recipe.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-white/60">
                          <Heart className="w-4 h-4" />
                          {recipe.likes}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Default State (No Search) */}
        {!isSearching && (
          <div className="space-y-8">
            {/* Recent Searches */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Buscas Recentes</h2>
              <div className="flex flex-wrap gap-3">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-[#00FF7F]/50 hover:text-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Buscas em Alta</h2>
              <div className="space-y-3">
                {trendingSearches.map((item) => (
                  <button
                    key={item.term}
                    onClick={() => handleSearch(item.term)}
                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00FF7F]/50 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00FF7F]/10 flex items-center justify-center group-hover:bg-[#00FF7F]/20 transition-colors">
                        <item.icon className="w-5 h-5 text-[#00FF7F]" />
                      </div>
                      <span className="text-white font-medium group-hover:text-[#00FF7F] transition-colors">
                        {item.term}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Categorias Populares</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Link
                  href="/?category=fitness"
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#00FF7F]/10 to-transparent border border-[#00FF7F]/20 hover:border-[#00FF7F]/50 transition-all group"
                >
                  <Flame className="w-8 h-8 text-[#00FF7F] mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold text-white">Fitness</h3>
                  <p className="text-sm text-white/60 mt-1">120 receitas</p>
                </Link>

                <Link
                  href="/?category=viral"
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#00FF7F]/10 to-transparent border border-[#00FF7F]/20 hover:border-[#00FF7F]/50 transition-all group"
                >
                  <TrendingUp className="w-8 h-8 text-[#00FF7F] mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold text-white">Virais</h3>
                  <p className="text-sm text-white/60 mt-1">85 receitas</p>
                </Link>

                <Link
                  href="/?category=tematica"
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#00FF7F]/10 to-transparent border border-[#00FF7F]/20 hover:border-[#00FF7F]/50 transition-all group"
                >
                  <Star className="w-8 h-8 text-[#00FF7F] mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold text-white">Temáticas</h3>
                  <p className="text-sm text-white/60 mt-1">95 receitas</p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="flex items-center justify-around px-4 py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-white/60">
            <ChefHat className="w-5 h-5" />
            <span className="text-xs font-medium">Início</span>
          </Link>
          <Link href="/busca" className="flex flex-col items-center gap-1 text-[#00FF7F]">
            <Search className="w-5 h-5" />
            <span className="text-xs font-medium">Buscar</span>
          </Link>
          <Link href="/favoritos" className="flex flex-col items-center gap-1 text-white/60">
            <Heart className="w-5 h-5" />
            <span className="text-xs font-medium">Favoritos</span>
          </Link>
          <Link href="/perfil" className="flex flex-col items-center gap-1 text-white/60">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-medium">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
