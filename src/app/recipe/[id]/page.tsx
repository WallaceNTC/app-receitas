'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  Play, 
  Pause, 
  Volume2,
  Share2,
  Heart,
  Plus,
  Minus,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  ingredients: Array<{ item: string; quantity: string; unit: string }>;
  instructions: string[];
  tags: string[];
  audio_url?: string;
  detailed_instructions?: string;
  image_url?: string;
  step_images?: string[];
  nutritional_info?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(4);
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(false);

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings);
    }
  }, [recipe]);

  const loadRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();

      if (error) throw error;
      
      // Garantir que instructions é um array
      if (data) {
        if (!data.instructions || !Array.isArray(data.instructions)) {
          data.instructions = [];
        }
        if (!data.tags || !Array.isArray(data.tags)) {
          data.tags = [];
        }
      }
      
      setRecipe(data);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateImages = async () => {
    if (!recipe) return;
    
    setGeneratingImages(true);
    try {
      const response = await fetch('/api/generate-step-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: recipe.id,
          recipeName: recipe.name,
          instructions: recipe.instructions,
          generateMain: true
        })
      });

      const data = await response.json();
      if (data.success) {
        // Recarregar receita com imagens
        await loadRecipe();
      }
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setGeneratingImages(false);
    }
  };

  const adjustServings = (delta: number) => {
    const newServings = Math.max(1, servings + delta);
    setServings(newServings);
  };

  const getAdjustedQuantity = (originalQuantity: string) => {
    if (!recipe) return originalQuantity;
    const multiplier = servings / recipe.servings;
    const num = parseFloat(originalQuantity);
    if (isNaN(num)) return originalQuantity;
    return (num * multiplier).toFixed(1);
  };

  const handleAudioToggle = () => {
    const audioElement = document.getElementById('recipe-audio') as HTMLAudioElement;
    if (audioElement) {
      if (audioPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  const startCookingMode = () => {
    setCookingMode(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (recipe && currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const exitCookingMode = () => {
    setCookingMode(false);
    setCurrentStep(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Carregando receita...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Receita não encontrada</h2>
          <button
            onClick={() => router.push('/search')}
            className="mt-4 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
          >
            Voltar para Busca
          </button>
        </div>
      </div>
    );
  }

  // Modo Cooking (passo a passo)
  if (cookingMode && recipe.instructions.length > 0) {
    const stepImage = recipe.step_images?.[currentStep];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Header do Modo Cooking */}
        <div className="bg-gradient-to-r from-red-900 to-pink-900 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={exitCookingMode}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <span className="text-lg font-medium">
              {currentStep + 1} de {recipe.instructions.length}
            </span>
          </div>
          <button
            onClick={() => router.push('/search')}
            className="text-pink-300 hover:text-pink-100 transition-colors"
          >
            Ingredientes
          </button>
        </div>

        {/* Imagem do Passo */}
        <div className="relative h-[50vh] bg-gray-800 flex items-center justify-center">
          {stepImage ? (
            <img
              src={stepImage}
              alt={`Passo ${currentStep + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <ChefHat className="w-24 h-24 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Imagem não disponível</p>
            </div>
          )}
          
          {/* Overlay com número do passo */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-xl">
            <span className="text-2xl font-bold">PASSO {currentStep + 1}</span>
          </div>
        </div>

        {/* Instruções do Passo */}
        <div className="p-6 space-y-6">
          <p className="text-lg leading-relaxed">
            {recipe.instructions[currentStep]}
          </p>

          {/* Navegação entre passos */}
          <div className="flex gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-xl font-medium transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === recipe.instructions.length - 1}
              className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 rounded-xl font-medium transition-colors"
            >
              {currentStep === recipe.instructions.length - 1 ? 'Finalizar' : 'Próximo'}
            </button>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-900 to-pink-900" />
      </div>
    );
  }

  // Modo Normal (visualização completa)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Título e Descrição */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.name}</h1>
          <p className="text-gray-300 text-lg">{recipe.description}</p>
        </div>

        {/* Imagem Principal com Play Button */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-800 h-64 md:h-96">
          {recipe.image_url ? (
            <>
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
              {recipe.instructions.length > 0 && (
                <button
                  onClick={startCookingMode}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                    <Play className="w-10 h-10 ml-1" />
                  </div>
                </button>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <ChefHat className="w-24 h-24 text-gray-600 mb-4" />
              <button
                onClick={generateImages}
                disabled={generatingImages}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {generatingImages ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando Imagens...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    Gerar Imagens com IA
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <Clock className="w-6 h-6 mx-auto mb-2 text-orange-400" />
            <div className="text-sm text-gray-400">Tempo Total</div>
            <div className="text-xl font-bold">{recipe.prep_time + recipe.cook_time}min</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <Users className="w-6 h-6 mx-auto mb-2 text-pink-400" />
            <div className="text-sm text-gray-400">Porções</div>
            <div className="text-xl font-bold">{recipe.servings}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <Flame className="w-6 h-6 mx-auto mb-2 text-red-400" />
            <div className="text-sm text-gray-400">Calorias</div>
            <div className="text-xl font-bold">{recipe.calories}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <ChefHat className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <div className="text-sm text-gray-400">Dificuldade</div>
            <div className={`text-lg font-bold capitalize ${getDifficultyColor(recipe.difficulty).split(' ')[0]}`}>
              {recipe.difficulty}
            </div>
          </div>
        </div>

        {/* Audio Player */}
        {recipe.audio_url && (
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-4">
              <button
                onClick={handleAudioToggle}
                className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
              >
                {audioPlaying ? (
                  <Pause className="w-7 h-7" />
                ) : (
                  <Play className="w-7 h-7 ml-1" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-lg font-bold mb-1">
                  <Volume2 className="w-5 h-5" />
                  Áudio Instrucional
                </div>
                <div className="text-sm text-gray-300">
                  Ouça o passo a passo completo enquanto cozinha
                </div>
              </div>
            </div>
            <audio
              id="recipe-audio"
              src={recipe.audio_url}
              onEnded={() => setAudioPlaying(false)}
              className="hidden"
            />
          </div>
        )}

        {/* Ingredientes */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Ingredientes</h2>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2">
              <button
                onClick={() => adjustServings(-1)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="font-bold min-w-[3rem] text-center">
                {servings} {servings === 1 ? 'porção' : 'porções'}
              </span>
              <button
                onClick={() => adjustServings(1)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {recipe.ingredients.map((ingredient, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0" />
                <span className="flex-1">{ingredient.item}</span>
                <span className="text-gray-400 font-medium">
                  {getAdjustedQuantity(ingredient.quantity)} {ingredient.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Instruções - NOVA */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ChefHat className="w-7 h-7 text-pink-500" />
              Modo de Preparo
            </h2>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <p className="flex-1 text-gray-200 leading-relaxed pt-1">
                    {instruction}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão Start Cooking */}
        {recipe.instructions.length > 0 && (
          <button
            onClick={startCookingMode}
            className="w-full py-5 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-pink-500/50 transition-all"
          >
            Começar a Cozinhar
          </button>
        )}

        {/* Informações Adicionais */}
        {recipe.detailed_instructions && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-3">📝 Instruções Detalhadas</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {recipe.detailed_instructions}
            </p>
          </div>
        )}

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
