"use client";

import { useState } from 'react';
import { ArrowLeft, ChefHat, Check } from 'lucide-react';
import Link from 'next/link';

const commonFoods = [
  'Arroz', 'Feijão', 'Macarrão', 'Batata', 'Cebola', 'Alho', 'Tomate', 'Cenoura',
  'Brócolis', 'Espinafre', 'Alface', 'Banana', 'Maçã', 'Laranja', 'Leite', 'Ovos',
  'Frango', 'Carne bovina', 'Peixe', 'Queijo', 'Iogurte', 'Pão', 'Manteiga', 'Azeite',
  'Sal', 'Pimenta', 'Açúcar', 'Farinha', 'Canela', 'Chocolate', 'Café', 'Chá'
];

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  time: string;
  servings: number;
}

export default function ZeroWastePage() {
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFood = (food: string) => {
    setSelectedFoods(prev =>
      prev.includes(food)
        ? prev.filter(f => f !== food)
        : [...prev, food]
    );
  };

  const generateRecipes = async () => {
    if (selectedFoods.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: selectedFoods }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar receitas');
      }

      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar receitas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-[#00FF00] hover:scale-110 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl font-poppins font-bold text-[#00FF00] mb-2">
              Modo Zero Desperdício
            </h1>
            <p className="text-lg font-inter text-gray-300">
              Selecione os alimentos que você tem em casa e gere receitas incríveis!
            </p>
          </div>
        </div>

        {/* Food Selection */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-poppins font-semibold mb-4 text-[#00FF00]">
            Selecione seus alimentos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {commonFoods.map((food) => (
              <button
                key={food}
                onClick={() => toggleFood(food)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedFoods.includes(food)
                    ? 'bg-[#00FF00] text-black border-[#00FF00]'
                    : 'bg-gray-700 text-white border-gray-600 hover:border-[#00FF00]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-inter">{food}</span>
                  {selectedFoods.includes(food) && (
                    <Check className="w-4 h-4" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={generateRecipes}
            disabled={selectedFoods.length === 0 || loading}
            className="w-full bg-[#00FF00] text-black py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Gerando Receitas...' : `Gerar Receitas (${selectedFoods.length} ingredientes)`}
          </button>
        </div>

        {/* Recipes Display */}
        {recipes.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-poppins font-bold text-[#00FF00]">
              Receitas Sugeridas
            </h2>
            {recipes.map((recipe, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center mb-4">
                  <ChefHat className="w-6 h-6 text-[#00FF00] mr-2" />
                  <h3 className="text-xl font-poppins font-semibold">{recipe.title}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-[#00FF00]">Ingredientes:</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-[#00FF00]">Instruções:</h4>
                    <ol className="list-decimal list-inside text-gray-300 space-y-1">
                      {recipe.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-4 flex justify-between text-sm text-gray-400">
                  <span>Tempo: {recipe.time}</span>
                  <span>Porções: {recipe.servings}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}