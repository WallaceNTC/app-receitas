import { z } from 'zod';

// Schema de validação para receitas
export const RecipeSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  category: z.enum([
    'breakfast',
    'lunch',
    'dinner',
    'snack',
    'dessert',
    'beverage',
    'appetizer',
    'salad',
    'soup',
    'pasta',
    'meat',
    'fish',
    'vegetarian',
    'vegan'
  ]),
  cuisine: z.enum([
    'brazilian',
    'italian',
    'mexican',
    'japanese',
    'chinese',
    'indian',
    'french',
    'american',
    'mediterranean',
    'thai',
    'korean',
    'greek',
    'spanish',
    'middle-eastern',
    'fusion'
  ]),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  prepTime: z.number().min(1).max(480), // em minutos
  cookTime: z.number().min(0).max(480),
  servings: z.number().min(1).max(50),
  calories: z.number().min(0).max(5000).optional(),
  ingredients: z.array(z.object({
    item: z.string().min(2).max(200),
    quantity: z.string().min(1).max(50),
    unit: z.string().max(50).optional()
  })).min(2).max(50),
  instructions: z.array(z.string().min(10).max(1000)).min(2).max(30),
  tags: z.array(z.string().max(50)).max(20).optional(),
  nutritionalInfo: z.object({
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional(),
    fiber: z.number().optional()
  }).optional()
});

export type Recipe = z.infer<typeof RecipeSchema>;

// Função para validar e padronizar receita
export function validateAndStandardizeRecipe(rawRecipe: any): Recipe | null {
  try {
    // Padronizar campos antes da validação
    const standardized = {
      name: rawRecipe.name?.trim(),
      description: rawRecipe.description?.trim(),
      category: rawRecipe.category?.toLowerCase(),
      cuisine: rawRecipe.cuisine?.toLowerCase(),
      difficulty: rawRecipe.difficulty?.toLowerCase(),
      prepTime: parseInt(rawRecipe.prepTime) || 0,
      cookTime: parseInt(rawRecipe.cookTime) || 0,
      servings: parseInt(rawRecipe.servings) || 1,
      calories: rawRecipe.calories ? parseInt(rawRecipe.calories) : undefined,
      ingredients: Array.isArray(rawRecipe.ingredients) 
        ? rawRecipe.ingredients.map((ing: any) => ({
            item: ing.item?.trim() || ing.name?.trim() || '',
            quantity: ing.quantity?.toString().trim() || '',
            unit: ing.unit?.trim()
          }))
        : [],
      instructions: Array.isArray(rawRecipe.instructions)
        ? rawRecipe.instructions.map((step: any) => 
            typeof step === 'string' ? step.trim() : step.description?.trim() || ''
          ).filter((step: string) => step.length > 0)
        : [],
      tags: Array.isArray(rawRecipe.tags) 
        ? rawRecipe.tags.map((tag: string) => tag.toLowerCase().trim())
        : [],
      nutritionalInfo: rawRecipe.nutritionalInfo || undefined
    };

    // Validar com Zod
    const validated = RecipeSchema.parse(standardized);
    return validated;
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
}

// Função para gerar variações de receitas
export function generateRecipeVariations(baseRecipe: Recipe, count: number = 3): Partial<Recipe>[] {
  const variations: Partial<Recipe>[] = [];
  
  const difficultyVariations = ['easy', 'medium', 'hard'] as const;
  const servingsVariations = [2, 4, 6, 8];
  
  for (let i = 0; i < count; i++) {
    variations.push({
      ...baseRecipe,
      name: `${baseRecipe.name} - Variação ${i + 1}`,
      difficulty: difficultyVariations[i % difficultyVariations.length],
      servings: servingsVariations[i % servingsVariations.length]
    });
  }
  
  return variations;
}
