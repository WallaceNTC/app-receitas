"use client";

import { useState } from "react";
import { Heart, ChefHat, Clock, Star, TrendingUp, ArrowLeft, Trash2, Filter, Search } from "lucide-react";
import Link from "next/link";

const mockFavorites = [
  {
    id: 1,
    title: "Bowl de Açaí Fitness",
    category: "fitness",
    time: "10 min",
    difficulty: "Fácil",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
    addedAt: "2024-01-15"
  },
  {
    id: 3,
    title: "Panqueca de Banana Viral",
    category: "viral",
    time: "15 min",
    difficulty: "Médio",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&h=300&fit=crop",
    addedAt: "2024-01-14"
  },
  {
    id: 6,
    title: "Brownie Fit de Chocolate",
    category: "temática",
    time: "30 min",
    difficulty: "Médio",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=300&fit=crop",
    addedAt: "2024-01-13"
  }
];

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [searchQuery, setSearchQuery] = useState("");

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const filteredFavorites = favorites.filter(fav =>
    fav.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <Heart className="w-5 h-5 text-[#0D0D0D]" />
                </div>
                <h1 className="text-xl font-bold">Favoritos</h1>
              </div>
            </div>

            <span className="text-sm text-white/60">{favorites.length} receitas</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#00FF7F] transition-colors" />
            <input
              type="text"
              placeholder="Buscar nos favoritos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF7F] focus:bg-white/10 transition-all"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredFavorites.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery ? "Nenhuma receita encontrada" : "Nenhum favorito ainda"}
            </h3>
            <p className="text-white/60 mb-6">
              {searchQuery ? "Tente buscar por outro termo" : "Comece a adicionar receitas aos seus favoritos"}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00FF7F] text-[#0D0D0D] font-semibold hover:bg-[#00CC66] transition-all hover:scale-105"
            >
              <ChefHat className="w-5 h-5" />
              Explorar Receitas
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((recipe) => (
              <div
                key={recipe.id}
                className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-[#00FF7F]/50 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#00FF7F]/10"
              >
                {/* Image */}
                <Link href={`/receita/${recipe.id}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent" />
                  </div>
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => removeFavorite(recipe.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#0D0D0D]/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-500 hover:text-white transition-all z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Content */}
                <Link href={`/receita/${recipe.id}`} className="block p-5 space-y-3">
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
                    <span className="text-xs text-white/40">
                      Adicionado em {new Date(recipe.addedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
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
          <Link href="/busca" className="flex flex-col items-center gap-1 text-white/60">
            <Search className="w-5 h-5" />
            <span className="text-xs font-medium">Buscar</span>
          </Link>
          <Link href="/favoritos" className="flex flex-col items-center gap-1 text-[#00FF7F]">
            <Heart className="w-5 h-5 fill-current" />
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
