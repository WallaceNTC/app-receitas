"use client";

import { useState } from "react";
import { Sparkles, ChefHat, Camera, Loader2, Heart, Clock, Users, TrendingUp, Award, Search } from "lucide-react";
import Link from "next/link";

type TabType = "text" | "photo";

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  servings?: string;
  difficulty?: string;
  nutrition?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  tips?: string[];
}

// Função para fazer parsing da receita gerada pela IA
function parseRecipe(text: string): Recipe {
  // Remove todos os asteriscos e hashtags
  const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s?/g, '');
  
  const lines = cleanText.split('\n').filter(line => line.trim());
  
  const recipe: Recipe = {
    title: '',
    ingredients: [],
    instructions: [],
    tips: []
  };

  let currentSection = '';
  let ingredientSubsection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;

    // Detectar título (primeira linha não vazia)
    if (!recipe.title && !line.includes(':') && !line.match(/^\d+\./)) {
      recipe.title = line;
      continue;
    }

    // Detectar seções principais
    if (line.toLowerCase().includes('ingrediente')) {
      currentSection = 'ingredients';
      ingredientSubsection = '';
      continue;
    }
    if (line.toLowerCase().includes('modo de preparo') || line.toLowerCase().includes('instruções')) {
      currentSection = 'instructions';
      continue;
    }
    if (line.toLowerCase().includes('dicas') || line.toLowerCase().includes('sugestões')) {
      currentSection = 'tips';
      continue;
    }
    if (line.toLowerCase().includes('informações nutricionais') || line.toLowerCase().includes('valores nutricionais')) {
      currentSection = 'nutrition';
      continue;
    }

    // Detectar subseções de ingredientes (ex: "Para o Bowl:", "Para o Molho:")
    if (currentSection === 'ingredients' && line.includes(':') && !line.match(/^\d+/)) {
      ingredientSubsection = line;
      recipe.ingredients.push(`\n${line}`);
      continue;
    }

    // Processar conteúdo de cada seção
    if (currentSection === 'ingredients') {
      // Limpar marcadores de lista e números
      const ingredient = line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
      if (ingredient) {
        recipe.ingredients.push(ingredient);
      }
    } else if (currentSection === 'instructions') {
      const instruction = line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
      if (instruction) {
        recipe.instructions.push(instruction);
      }
    } else if (currentSection === 'tips') {
      const tip = line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
      if (tip) {
        recipe.tips?.push(tip);
      }
    } else if (currentSection === 'nutrition') {
      if (line.toLowerCase().includes('proteína') || line.toLowerCase().includes('protein')) {
        recipe.nutrition = recipe.nutrition || {};
        recipe.nutrition.protein = line.split(':')[1]?.trim() || line;
      } else if (line.toLowerCase().includes('carboidrato') || line.toLowerCase().includes('carb')) {
        recipe.nutrition = recipe.nutrition || {};
        recipe.nutrition.carbs = line.split(':')[1]?.trim() || line;
      } else if (line.toLowerCase().includes('gordura') || line.toLowerCase().includes('fat')) {
        recipe.nutrition = recipe.nutrition || {};
        recipe.nutrition.fat = line.split(':')[1]?.trim() || line;
      } else if (line.toLowerCase().includes('caloria') || line.toLowerCase().includes('kcal')) {
        recipe.nutrition = recipe.nutrition || {};
        recipe.nutrition.calories = line.split(':')[1]?.trim() || line;
      }
    }

    // Detectar metadados
    if (line.toLowerCase().includes('tempo de preparo') || line.toLowerCase().includes('prep time')) {
      recipe.prepTime = line.split(':')[1]?.trim() || line;
    }
    if (line.toLowerCase().includes('porções') || line.toLowerCase().includes('servings')) {
      recipe.servings = line.split(':')[1]?.trim() || line;
    }
    if (line.toLowerCase().includes('dificuldade') || line.toLowerCase().includes('difficulty')) {
      recipe.difficulty = line.split(':')[1]?.trim() || line;
    }
  }

  return recipe;
}

export default function ReceitasIA() {
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [recipeType, setRecipeType] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateFromText = async () => {
    if (!recipeType.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          recipeType,
          additionalInfo: additionalInfo.trim() || undefined
        }),
      });

      const data = await response.json();
      if (data.recipe) {
        const parsedRecipe = parseRecipe(data.recipe);
        setGeneratedRecipe(parsedRecipe);
      }
    } catch (error) {
      console.error("Erro ao gerar receita:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      if (additionalInfo.trim()) {
        formData.append("additionalInfo", additionalInfo.trim());
      }

      const response = await fetch("/api/generate-recipe-from-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.recipe) {
        const parsedRecipe = parseRecipe(data.recipe);
        setGeneratedRecipe(parsedRecipe);
      }
    } catch (error) {
      console.error("Erro ao gerar receita:", error);
    } finally {
      setLoading(false);
    }
  };

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
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                Início
              </Link>
              <Link href="/receitas-ia" className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors flex items-center gap-2">
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

            <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold text-sm hover:from-gray-900 hover:to-black transition-all hover:scale-105 shadow-lg">
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-orange-200/50">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-100/50 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-6">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">Powered by AI</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Crie Receitas com
            <span className="block mt-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Inteligência Artificial
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gere receitas personalizadas instantaneamente usando texto ou foto. Nossa IA cria receitas deliciosas adaptadas às suas preferências.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-3 p-1.5 bg-orange-100/50 rounded-xl border border-orange-200">
              <button
                onClick={() => setActiveTab("text")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "text"
                    ? "bg-white text-orange-600 shadow-md"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Gerar por Texto
              </button>
              <button
                onClick={() => setActiveTab("photo")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "photo"
                    ? "bg-white text-orange-600 shadow-md"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                <Camera className="w-4 h-4" />
                Gerar por Foto
              </button>
            </div>

            {/* Input Card */}
            <div className="bg-white rounded-2xl border border-orange-200 p-6 shadow-lg">
              {activeTab === "text" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Que tipo de receita você quer?
                    </label>
                    <input
                      type="text"
                      value={recipeType}
                      onChange={(e) => setRecipeType(e.target.value)}
                      placeholder="Ex: Bowl fitness de quinoa e frango"
                      className="w-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Informações Adicionais (Opcional)
                    </label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Ex: Sem glúten, vegano, low carb..."
                      rows={3}
                      className="w-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerateFromText}
                    disabled={loading || !recipeType.trim()}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:from-gray-900 hover:to-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Gerar Receita com IA
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Envie uma foto dos ingredientes
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer bg-orange-50 hover:bg-orange-100 transition-all"
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="text-center">
                            <Camera className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-gray-700">
                              Clique para enviar uma foto
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG até 10MB
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Informações Adicionais (Opcional)
                    </label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Ex: Sem glúten, vegano, low carb..."
                      rows={3}
                      className="w-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerateFromImage}
                    disabled={loading || !selectedImage}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:from-gray-900 hover:to-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        Gerar Receita da Foto
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {generatedRecipe ? (
              <div className="bg-white rounded-2xl border border-orange-200 overflow-hidden shadow-lg">
                {/* Recipe Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-3">{generatedRecipe.title}</h2>
                  <div className="flex flex-wrap gap-3">
                    {generatedRecipe.prepTime && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{generatedRecipe.prepTime}</span>
                      </div>
                    )}
                    {generatedRecipe.servings && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{generatedRecipe.servings}</span>
                      </div>
                    )}
                    {generatedRecipe.difficulty && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">{generatedRecipe.difficulty}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                  {/* Ingredients */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-orange-500" />
                      Ingredientes
                    </h3>
                    <ul className="space-y-2">
                      {generatedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className={`text-gray-700 ${ingredient.startsWith('\n') ? 'font-semibold text-orange-600 mt-3' : 'pl-4'}`}>
                          {ingredient.startsWith('\n') ? ingredient.trim() : `• ${ingredient}`}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-500" />
                      Modo de Preparo
                    </h3>
                    <ol className="space-y-3">
                      {generatedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 flex-1">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Nutrition */}
                  {generatedRecipe.nutrition && (
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Informações Nutricionais</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {generatedRecipe.nutrition.calories && (
                          <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                            <div className="text-2xl font-bold text-orange-600">{generatedRecipe.nutrition.calories}</div>
                            <div className="text-xs text-gray-600 mt-1">Calorias</div>
                          </div>
                        )}
                        {generatedRecipe.nutrition.protein && (
                          <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                            <div className="text-2xl font-bold text-orange-600">{generatedRecipe.nutrition.protein}</div>
                            <div className="text-xs text-gray-600 mt-1">Proteínas</div>
                          </div>
                        )}
                        {generatedRecipe.nutrition.carbs && (
                          <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                            <div className="text-2xl font-bold text-orange-600">{generatedRecipe.nutrition.carbs}</div>
                            <div className="text-xs text-gray-600 mt-1">Carboidratos</div>
                          </div>
                        )}
                        {generatedRecipe.nutrition.fat && (
                          <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                            <div className="text-2xl font-bold text-orange-600">{generatedRecipe.nutrition.fat}</div>
                            <div className="text-xs text-gray-600 mt-1">Gorduras</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-500" />
                        Dicas Extras
                      </h3>
                      <ul className="space-y-2">
                        {generatedRecipe.tips.map((tip, index) => (
                          <li key={index} className="flex gap-2 text-gray-700">
                            <span className="text-orange-500 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-orange-200 p-12 text-center shadow-lg">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Sua receita aparecerá aqui
                </h3>
                <p className="text-gray-600">
                  Preencha os campos ao lado e clique em gerar para criar sua receita personalizada com IA
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-orange-200 z-50 shadow-lg">
        <div className="flex items-center justify-around px-4 py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-gray-600">
            <ChefHat className="w-5 h-5" />
            <span className="text-xs font-medium">Início</span>
          </Link>
          <Link href="/receitas-ia" className="flex flex-col items-center gap-1 text-orange-600">
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
