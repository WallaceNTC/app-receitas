"use client";

import { useState } from "react";
import { Search, Heart, TrendingUp, Flame, Award, Users, ChefHat, Clock, Star, Sparkles } from "lucide-react";
import Link from "next/link";

// Mock data de receitas
const mockRecipes = [
  {
    id: 1,
    title: "Bowl de Açaí Fitness",
    category: "fitness",
    time: "10 min",
    difficulty: "Fácil",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
    trending: true,
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
    trending: true,
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
    trending: true,
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
    trending: false,
    likes: 750
  },
  {
    id: 5,
    title: "Wrap de Frango Grelhado",
    category: "fitness",
    time: "25 min",
    difficulty: "Médio",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
    trending: false,
    likes: 890
  },
  {
    id: 6,
    title: "Brownie Fit de Chocolate",
    category: "temática",
    time: "30 min",
    difficulty: "Médio",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=300&fit=crop",
    trending: true,
    likes: 1560
  }
];

const categories = [
  { id: "all", name: "Todas", icon: ChefHat },
  { id: "fitness", name: "Fitness", icon: Flame },
  { id: "viral", name: "Virais", icon: TrendingUp },
  { id: "temática", name: "Temáticas", icon: Star }
];

const stats = [
  { label: "Receitas", value: "500+", icon: ChefHat },
  { label: "Usuários", value: "10k+", icon: Users },
  { label: "Avaliações", value: "4.8", icon: Star }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b border-orange-200/50 backdrop-blur-xl bg-white/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Receitas Flex
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors">
                Início
              </Link>
              <Link href="/receitas-ia" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Receitas IA
              </Link>
              <Link href="/filtros" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                Filtros
              </Link>
              <Link href="/favoritos" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favoritos
              </Link>
              <Link href="/busca" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                Buscar
              </Link>
            </nav>

            <Link href="/login" className="px-5 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold text-sm hover:from-gray-900 hover:to-black transition-all hover:scale-105 shadow-lg">
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-100/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-4">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Receitas em Alta</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-bold leading-tight text-gray-900">
              Descubra Receitas
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Incríveis
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore milhares de receitas fitness, virais e temáticas com design premium e tecnologia de ponta
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar receitas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-orange-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
              {stats.map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-white border border-orange-200 backdrop-blur-sm hover:border-orange-300 hover:shadow-lg transition-all group">
                  <stat.icon className="w-6 h-6 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-orange-200"
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">
            {selectedCategory === "all" ? "Todas as Receitas" : categories.find(c => c.id === selectedCategory)?.name}
          </h3>
          <span className="text-sm text-gray-600">{filteredRecipes.length} receitas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/receita/${recipe.id}`}
              className="group relative bg-white rounded-2xl overflow-hidden border border-orange-200 hover:border-orange-400 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {recipe.trending && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                )}

                <button className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all group/heart">
                  <Heart className="w-4 h-4 group-hover/heart:fill-current" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {recipe.title}
                </h4>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recipe.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                    {recipe.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-orange-100">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {recipe.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Heart className="w-4 h-4" />
                    {recipe.likes}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-orange-200 z-50 shadow-lg">
        <div className="flex items-center justify-around px-4 py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-orange-600">
            <ChefHat className="w-5 h-5" />
            <span className="text-xs font-medium">Início</span>
          </Link>
          <Link href="/receitas-ia" className="flex flex-col items-center gap-1 text-gray-600">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-medium">IA</span>
          </Link>
          <Link href="/busca" className="flex flex-col items-center gap-1 text-gray-600">
            <Search className="w-5 h-5" />
            <span className="text-xs font-medium">Buscar</span>
          </Link>
          <Link href="/favoritos" className="flex flex-col items-center gap-1 text-gray-600">
            <Heart className="w-5 h-5" />
            <span className="text-xs font-medium">Favoritos</span>
          </Link>
          <Link href="/perfil" className="flex flex-col items-center gap-1 text-gray-600">
            <Award className="w-5 h-5" />
            <span className="text-xs font-medium">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
