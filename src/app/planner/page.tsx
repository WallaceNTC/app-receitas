'use client';

'use client';

'use client';

'use client';

'use client';

import { useState, useEffect } from 'react';
import { Menu, Search, Calendar, Plus, ChefHat, Utensils, Coffee, Moon, Clock, Sparkles, Database } from 'lucide-react';
import Link from 'next/link';

interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  ingredients: string[];
  instructions: string;
  servings: number;
  prepTime: number;
}

interface DayMeals {
  [key: string]: Meal[];
}

const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const mealTypes = [
  { key: 'breakfast', label: 'Café da Manhã', icon: Coffee },
  { key: 'lunch', label: 'Almoço', icon: Utensils },
  { key: 'dinner', label: 'Jantar', icon: Moon },
  { key: 'snack', label: 'Lanches', icon: ChefHat }
];

export default function PlannerPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [meals, setMeals] = useState<DayMeals>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load meals from localStorage
    const savedMeals = localStorage.getItem('weeklyMeals');
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }
  }, []);

  const saveMeals = (newMeals: DayMeals) => {
    setMeals(newMeals);
    localStorage.setItem('weeklyMeals', JSON.stringify(newMeals));
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const addMeal = (dayIndex: number, mealType: string) => {
    const meal: Meal = {
      id: Date.now().toString(),
      type: mealType as any,
      name: `Nova Refeição ${mealType}`,
      ingredients: [],
      instructions: '',
      servings: 1,
      prepTime: 30
    };

    const dayKey = dayIndex.toString();
    const newMeals = { ...meals };
    if (!newMeals[dayKey]) newMeals[dayKey] = [];
    newMeals[dayKey].push(meal);
    saveMeals(newMeals);
  };

  const removeMeal = (dayIndex: number, mealId: string) => {
    const dayKey = dayIndex.toString();
    const newMeals = { ...meals };
    newMeals[dayKey] = newMeals[dayKey].filter(meal => meal.id !== mealId);
    saveMeals(newMeals);
  };

  const generateWeeklyPlan = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-weekly-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: 'saudável, variado, fácil de preparar'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar plano semanal');
      }

      const data = await response.json();
      
      // Process and save the generated meals
      const newMeals: DayMeals = {};
      data.meals.forEach((meal: any, index: number) => {
        const dayIndex = Math.floor(index / 4); // 4 meals per day
        const dayKey = dayIndex.toString();
        if (!newMeals[dayKey]) newMeals[dayKey] = [];
        newMeals[dayKey].push({
          id: `generated-${Date.now()}-${index}`,
          type: meal.type,
          name: meal.name,
          ingredients: meal.ingredients,
          instructions: meal.instructions,
          servings: meal.servings,
          prepTime: meal.prepTime
        });
      });
      
      saveMeals(newMeals);
      alert('Plano semanal gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      alert('Erro ao gerar plano semanal. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const weekDates = getWeekDates();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl font-bold text-orange-500">Planner Cardápio Semanal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6 text-gray-400" />
            <Calendar className="w-6 h-6 text-gray-400" />
            <Link
              href="/generate-recipes"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center"
            >
              <Database className="w-4 h-4 mr-2" />
              Gerar Receitas
            </Link>
            <button
              onClick={generateWeeklyPlan}
              disabled={isGenerating}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Gerando...' : 'Gerar Plano com IA'}
            </button>
          </div>
        </div>
      </header>

      {/* Date Navigation */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
            className="text-orange-500 hover:text-orange-400"
          >
            ← Semana Anterior
          </button>
          <div className="flex space-x-4">
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={`text-center p-2 rounded cursor-pointer ${
                  selectedDay === index ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedDay(index)}
              >
                <div className="font-semibold">{daysOfWeek[index]}</div>
                <div className="text-sm">{date.getDate()}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
            className="text-orange-500 hover:text-orange-400"
          >
            Semana Próxima →
          </button>
        </div>
      </div>

      {/* Meals Section */}
      <div className="p-6">
        {selectedDay !== null ? (
          <div>
            <h2 className="text-xl font-bold mb-4 text-orange-500">
              {daysOfWeek[selectedDay]} - {weekDates[selectedDay].toLocaleDateString()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mealTypes.map(({ key, label, icon: Icon }) => (
                <div key={key} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-4">
                    <Icon className="w-5 h-5 text-orange-500 mr-2" />
                    <h3 className="font-semibold">{label}</h3>
                  </div>
                  <div className="space-y-2">
                    {meals[selectedDay.toString()]?.filter(meal => meal.type === key).map(meal => (
                      <div key={meal.id} className="border-2 border-dashed border-orange-500 p-3 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{meal.name}</h4>
                            <div className="flex items-center text-sm text-gray-400 mt-1">
                              <Clock className="w-4 h-4 mr-1" />
                              {meal.prepTime}min • {meal.servings} porções
                            </div>
                            {meal.ingredients.length > 0 && (
                              <div className="text-sm text-gray-300 mt-2">
                                <strong>Ingredientes:</strong> {meal.ingredients.join(', ')}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeMeal(selectedDay, meal.id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )) || (
                      <div className="border-2 border-dashed border-gray-600 p-3 rounded text-center text-gray-500">
                        Nenhuma refeição adicionada
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => addMeal(selectedDay, key)}
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar {label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            Selecione um dia da semana para visualizar e editar as refeições
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 border-t border-gray-700 fixed bottom-0 w-full">
        <div className="flex justify-around">
          <Link href="/planner" className="flex flex-col items-center text-orange-500">
            <Utensils className="w-6 h-6" />
            <span className="text-sm">Planejar Refeições</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center text-gray-400">
            <ChefHat className="w-6 h-6" />
            <span className="text-sm">Gerenciar Receitas</span>
          </Link>
          <Link href="/shopping-list" className="flex flex-col items-center text-gray-400">
            <Menu className="w-6 h-6" />
            <span className="text-sm">Lista de Compras</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}