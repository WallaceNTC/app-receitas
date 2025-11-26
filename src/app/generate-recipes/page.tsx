'use client';

import { useState } from 'react';
import { ChefHat, Sparkles, Database, CheckCircle, XCircle, Loader2, Download, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface GenerationStats {
  requested: number;
  generated: number;
  validated: number;
  rejected: number;
  saved: number;
}

export default function RecipeGeneratorPage() {
  const [count, setCount] = useState(100);
  const [batchSize, setBatchSize] = useState(10);
  const [theme, setTheme] = useState('');
  const [saveToDb, setSaveToDb] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [stats, setStats] = useState<GenerationStats | null>(null);
  const [sampleRecipes, setSampleRecipes] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [totalRecipesInDb, setTotalRecipesInDb] = useState<number | null>(null);

  const fetchDbStats = async () => {
    try {
      const response = await fetch('/api/generate-recipes');
      const data = await response.json();
      if (data.success) {
        setTotalRecipesInDb(data.totalRecipes);
      }
    } catch (err) {
      console.error('Error fetching DB stats:', err);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress('Iniciando geração de receitas...');
    setError('');
    setStats(null);
    setSampleRecipes([]);

    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count: parseInt(count.toString()),
          batchSize: parseInt(batchSize.toString()),
          theme: theme.trim() || null,
          saveToDatabase: saveToDb
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar receitas');
      }

      if (data.success) {
        setStats(data.stats);
        setSampleRecipes(data.sampleRecipes || []);
        setProgress('✅ Geração concluída com sucesso!');
        
        // Atualizar stats do banco
        if (saveToDb) {
          await fetchDbStats();
        }
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar receitas');
      setProgress('❌ Erro na geração');
    } finally {
      setIsGenerating(false);
    }
  };

  // Carregar stats ao montar
  useState(() => {
    fetchDbStats();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ChefHat className="w-10 h-10 text-orange-500" />
            <div>
              <h1 className="text-3xl font-bold text-orange-500">Gerador de Receitas IA</h1>
              <p className="text-gray-400 text-sm">Gere centenas de receitas automaticamente</p>
            </div>
          </div>
          <Link 
            href="/planner"
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors"
          >
            Voltar ao Planejador
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Card */}
        {totalRecipesInDb !== null && (
          <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Database className="w-12 h-12 text-orange-500" />
                <div>
                  <p className="text-gray-400 text-sm">Total de Receitas no Banco</p>
                  <p className="text-4xl font-bold text-orange-500">{totalRecipesInDb.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={fetchDbStats}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
              >
                Atualizar
              </button>
            </div>
          </div>
        )}

        {/* Configuration Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Sparkles className="w-6 h-6 text-orange-500 mr-2" />
            Configuração da Geração
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quantidade */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantidade de Receitas
              </label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="10000"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isGenerating}
              />
              <p className="text-xs text-gray-400 mt-1">Máximo: 10.000 receitas</p>
            </div>

            {/* Tamanho do Lote */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tamanho do Lote
              </label>
              <input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Math.max(1, Math.min(50, parseInt(e.target.value) || 10)))}
                min="1"
                max="50"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isGenerating}
              />
              <p className="text-xs text-gray-400 mt-1">Receitas por chamada à IA (1-50)</p>
            </div>

            {/* Tema (Opcional) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tema (Opcional)
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ex: receitas veganas, comida italiana, sobremesas de natal..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isGenerating}
              />
              <p className="text-xs text-gray-400 mt-1">Deixe vazio para gerar receitas variadas</p>
            </div>

            {/* Salvar no Banco */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveToDb}
                  onChange={(e) => setSaveToDb(e.target.checked)}
                  className="w-5 h-5 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                  disabled={isGenerating}
                />
                <span className="text-gray-300">Salvar receitas no banco de dados automaticamente</span>
              </label>
            </div>
          </div>

          {/* Botão de Geração */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Gerando Receitas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>Gerar {count} Receitas com IA</span>
              </>
            )}
          </button>
        </div>

        {/* Progress */}
        {progress && (
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-center text-lg">{progress}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-6 h-6 text-red-500" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
              Estatísticas da Geração
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Solicitadas</p>
                <p className="text-3xl font-bold text-blue-400">{stats.requested}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Geradas</p>
                <p className="text-3xl font-bold text-purple-400">{stats.generated}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Validadas</p>
                <p className="text-3xl font-bold text-green-400">{stats.validated}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Rejeitadas</p>
                <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Salvas no DB</p>
                <p className="text-3xl font-bold text-orange-400">{stats.saved}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sample Recipes */}
        {sampleRecipes.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <ChefHat className="w-6 h-6 text-orange-500 mr-2" />
              Exemplos de Receitas Geradas
            </h3>
            <div className="space-y-4">
              {sampleRecipes.map((recipe, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-lg font-bold text-orange-400 mb-2">{recipe.name}</h4>
                  <p className="text-gray-300 text-sm mb-3">{recipe.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs">
                      {recipe.category}
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                      {recipe.cuisine}
                    </span>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                      {recipe.difficulty}
                    </span>
                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs">
                      {recipe.prepTime + recipe.cookTime} min
                    </span>
                    <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-xs">
                      {recipe.servings} porções
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    <strong>Ingredientes:</strong> {recipe.ingredients.length} itens
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
