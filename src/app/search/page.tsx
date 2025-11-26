'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Clock, Users, Flame, ChefHat, X, Loader2, Play, Pause, Volume2 } from 'lucide-react';
import Link from 'next/link';

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  cuisine: string;
  difficulty: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  calories: number;
  tags: string[];
  audio_url?: string;
  detailed_instructions?: string;
  image_url?: string;
}

interface SearchFilters {
  category?: string;
  cuisine?: string;
  difficulty?: string;
  maxPrepTime?: number;
  maxCalories?: number;
  tags?: string[];
}

export default function SearchRecipesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [stats, setStats] = useState<any>(null);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    offset: 0,
    limit: 50,
    hasMore: false
  });

  // Carregar estatísticas ao montar
  useEffect(() => {
    loadStats();
  }, []);

  // Buscar receitas quando query ou filtros mudarem
  useEffect(() => {
    const debounce = setTimeout(() => {
      searchRecipes();
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery, filters]);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/search-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stats' })
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const searchRecipes = async (loadMore = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: pagination.limit.toString(),
        offset: loadMore ? (pagination.offset + pagination.limit).toString() : '0'
      });

      if (filters.category) params.append('category', filters.category);
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.maxPrepTime) params.append('maxPrepTime', filters.maxPrepTime.toString());
      if (filters.maxCalories) params.append('maxCalories', filters.maxCalories.toString());
      if (filters.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));

      const response = await fetch(`/api/search-recipes?${params}`);
      const data = await response.json();

      if (data.success) {
        setRecipes(loadMore ? [...recipes, ...data.recipes] : data.recipes);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleAudioToggle = (recipeId: string, audioUrl: string) => {
    if (audioPlaying === recipeId) {
      // Pausar áudio
      const audioElement = document.getElementById(`audio-${recipeId}`) as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
      }
      setAudioPlaying(null);
    } else {
      // Pausar qualquer áudio tocando
      if (audioPlaying) {
        const prevAudio = document.getElementById(`audio-${audioPlaying}`) as HTMLAudioElement;
        if (prevAudio) {
          prevAudio.pause();
        }
      }
      // Tocar novo áudio
      const audioElement = document.getElementById(`audio-${recipeId}`) as HTMLAudioElement;
      if (audioElement) {
        audioElement.play();
        setAudioPlaying(recipeId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                RecipeHub
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Banner */}
        {stats && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Estatísticas do Banco de Receitas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">{stats.total}</div>
                <div className="text-sm text-gray-600">Total de Receitas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">
                  {Object.keys(stats.byCategory || {}).length}
                </div>
                <div className="text-sm text-gray-600">Categorias</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">
                  {Object.keys(stats.byCuisine || {}).length}
                </div>
                <div className="text-sm text-gray-600">Cozinhas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {Object.keys(stats.byDifficulty || {}).length}
                </div>
                <div className="text-sm text-gray-600">Níveis</div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar receitas por nome, ingrediente ou tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Todas</option>
                    <option value="breakfast">Café da Manhã</option>
                    <option value="lunch">Almoço</option>
                    <option value="dinner">Jantar</option>
                    <option value="snack">Lanche</option>
                    <option value="dessert">Sobremesa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dificuldade</label>
                  <select
                    value={filters.difficulty || ''}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value || undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Todas</option>
                    <option value="easy">Fácil</option>
                    <option value="medium">Médio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tempo Máximo (min)</label>
                  <input
                    type="number"
                    value={filters.maxPrepTime || ''}
                    onChange={(e) => setFilters({ ...filters, maxPrepTime: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Ex: 30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 text-gray-600">
          {loading ? 'Buscando...' : `${pagination.total} receitas encontradas`}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link 
              key={recipe.id} 
              href={`/recipe/${recipe.id}`}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow block"
            >
              <div className="h-48 bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center relative overflow-hidden">
                {recipe.image_url ? (
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ChefHat className="w-20 h-20 text-white opacity-50" />
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800 flex-1">{recipe.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recipe.prep_time + recipe.cook_time}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {recipe.servings}
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    {recipe.calories}cal
                  </div>
                </div>

                {/* Audio Player */}
                {recipe.audio_url && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAudioToggle(recipe.id, recipe.audio_url!);
                        }}
                        className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
                      >
                        {audioPlaying === recipe.id ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
                          <Volume2 className="w-4 h-4" />
                          Áudio Instrucional
                        </div>
                        <div className="text-xs text-purple-600">
                          Ouça o passo a passo
                        </div>
                      </div>
                    </div>
                    <audio
                      id={`audio-${recipe.id}`}
                      src={recipe.audio_url}
                      onEnded={() => setAudioPlaying(null)}
                      className="hidden"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags && Array.isArray(recipe.tags) && recipe.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="w-full text-center px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-shadow">
                  Ver Receita Completa
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        {pagination.hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={() => searchRecipes(true)}
              disabled={loading}
              className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando...
                </>
              ) : (
                'Carregar Mais'
              )}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhuma receita encontrada</h3>
            <p className="text-gray-600">Tente ajustar seus filtros ou buscar por outros termos</p>
          </div>
        )}
      </div>
    </div>
  );
}
