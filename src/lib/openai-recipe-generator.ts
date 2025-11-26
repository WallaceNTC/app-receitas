import OpenAI from 'openai';
import { Recipe } from './recipe-validator';
import { generateInstructionalAudio } from './openai-tts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Categorias e cozinhas para gerar variedade
const CATEGORIES = [
  'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage',
  'appetizer', 'salad', 'soup', 'pasta', 'meat', 'fish', 'vegetarian', 'vegan'
];

const CUISINES = [
  'brazilian', 'italian', 'mexican', 'japanese', 'chinese', 'indian',
  'french', 'american', 'mediterranean', 'thai', 'korean', 'greek',
  'spanish', 'middle-eastern', 'fusion'
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];

// Função para gerar um lote de receitas
export async function generateRecipeBatch(
  batchSize: number = 10,
  category?: string,
  cuisine?: string
): Promise<any[]> {
  const selectedCategory = category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const selectedCuisine = cuisine || CUISINES[Math.floor(Math.random() * CUISINES.length)];
  const selectedDifficulty = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];

  const prompt = `Generate ${batchSize} unique and creative ${selectedCuisine} ${selectedCategory} recipes with ${selectedDifficulty} difficulty level.

For each recipe, provide:
1. A creative and appetizing name
2. A detailed description (2-3 sentences)
3. Preparation time in minutes
4. Cooking time in minutes
5. Number of servings
6. Estimated calories per serving
7. A list of ingredients with quantities and units
8. Step-by-step instructions (at least 3 steps)
9. Relevant tags (e.g., "quick", "healthy", "comfort-food")
10. Basic nutritional information (protein, carbs, fat, fiber in grams)

Return ONLY a JSON object with a "recipes" array. No additional text or explanation.

{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Detailed description",
      "category": "${selectedCategory}",
      "cuisine": "${selectedCuisine}",
      "difficulty": "${selectedDifficulty}",
      "prepTime": 15,
      "cookTime": 30,
      "servings": 4,
      "calories": 350,
      "ingredients": [
        {"item": "ingredient name", "quantity": "2", "unit": "cups"}
      ],
      "instructions": [
        "Step 1 description",
        "Step 2 description"
      ],
      "tags": ["tag1", "tag2"],
      "nutritionalInfo": {
        "protein": 25,
        "carbs": 40,
        "fat": 15,
        "fiber": 5
      }
    }
  ]
}

Make sure each recipe is unique, realistic, and follows proper cooking logic.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef and recipe creator. Generate detailed, realistic, and delicious recipes in JSON format. Always return valid JSON with a "recipes" array. Never include explanatory text outside the JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.9,
      max_tokens: 4000
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse do JSON
    const parsed = JSON.parse(content);
    
    // A resposta deve vir como { recipes: [...] }
    const recipes = parsed.recipes || [];
    
    if (!Array.isArray(recipes) || recipes.length === 0) {
      throw new Error('Invalid response format from OpenAI - no recipes array found');
    }
    
    return recipes;
  } catch (error) {
    console.error('Error generating recipes with OpenAI:', error);
    throw error;
  }
}

// Função para gerar receitas em massa com controle de rate limit
export async function generateMassRecipes(
  totalCount: number,
  batchSize: number = 10,
  delayBetweenBatches: number = 2000,
  onProgress?: (current: number, total: number) => void
): Promise<any[]> {
  const allRecipes: any[] = [];
  const numberOfBatches = Math.ceil(totalCount / batchSize);

  for (let i = 0; i < numberOfBatches; i++) {
    const currentBatchSize = Math.min(batchSize, totalCount - allRecipes.length);
    
    try {
      console.log(`Generating batch ${i + 1}/${numberOfBatches} (${currentBatchSize} recipes)...`);
      
      // Variar categorias e cozinhas para diversidade
      const category = CATEGORIES[i % CATEGORIES.length];
      const cuisine = CUISINES[i % CUISINES.length];
      
      const batch = await generateRecipeBatch(currentBatchSize, category, cuisine);
      allRecipes.push(...batch);
      
      if (onProgress) {
        onProgress(allRecipes.length, totalCount);
      }
      
      // Delay entre lotes para respeitar rate limits
      if (i < numberOfBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    } catch (error) {
      console.error(`Error in batch ${i + 1}:`, error);
      // Continua com o próximo lote mesmo se um falhar
    }
  }

  return allRecipes;
}

// Função para gerar receitas com temas específicos
export async function generateThemedRecipes(
  theme: string,
  count: number = 20
): Promise<any[]> {
  const prompt = `Generate ${count} unique recipes based on the theme: "${theme}".

Each recipe should be creative, delicious, and fit the theme perfectly.

Return ONLY a JSON object with a "recipes" array:

{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Detailed description",
      "category": "category",
      "cuisine": "cuisine",
      "difficulty": "easy|medium|hard",
      "prepTime": 15,
      "cookTime": 30,
      "servings": 4,
      "calories": 350,
      "ingredients": [
        {"item": "ingredient", "quantity": "2", "unit": "cups"}
      ],
      "instructions": ["Step 1", "Step 2"],
      "tags": ["tag1", "tag2"],
      "nutritionalInfo": {
        "protein": 25,
        "carbs": 40,
        "fat": 15,
        "fiber": 5
      }
    }
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a creative chef specializing in themed recipes. Generate unique and exciting recipes in JSON format. Always return valid JSON with a "recipes" array.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 1.0,
      max_tokens: 4000
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const parsed = JSON.parse(content);
    const recipes = parsed.recipes || [];
    
    if (!Array.isArray(recipes)) {
      throw new Error('Invalid response format - recipes is not an array');
    }
    
    return recipes;
  } catch (error) {
    console.error('Error generating themed recipes:', error);
    throw error;
  }
}

/**
 * Gera receita completa com áudio instrucional
 */
export async function generateRecipeWithAudio(
  recipeData: any,
  recipeId: string
): Promise<{ audioUrl: string; detailedInstructions: string }> {
  try {
    const { audioUrl, detailedInstructions } = await generateInstructionalAudio(
      recipeId,
      recipeData.name,
      recipeData.ingredients,
      recipeData.instructions
    );

    return { audioUrl, detailedInstructions };
  } catch (error) {
    console.error('Error generating audio for recipe:', error);
    // Retorna valores vazios se falhar, não bloqueia a criação da receita
    return { audioUrl: '', detailedInstructions: '' };
  }
}
