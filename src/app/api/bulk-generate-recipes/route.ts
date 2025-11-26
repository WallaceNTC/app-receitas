import { NextRequest, NextResponse } from 'next/server';
import { generateMassRecipes } from '@/lib/openai-recipe-generator';
import { validateRecipe } from '@/lib/recipe-validator';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Validar variáveis de ambiente
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Supabase credentials not configured',
          message: 'Configure as variáveis de ambiente do Supabase'
        },
        { status: 500 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key not configured',
          message: 'Configure a chave da API OpenAI'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { count = 100, batchSize = 10 } = body;

    console.log(`Starting bulk generation of ${count} recipes...`);

    const recipes: any[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Gerar receitas em lotes
    const generatedRecipes = await generateMassRecipes(
      count,
      batchSize,
      2000, // 2 segundos entre lotes
      (current, total) => {
        console.log(`Progress: ${current}/${total} recipes generated`);
      }
    );

    console.log(`Generated ${generatedRecipes.length} recipes, now validating and saving...`);

    // Validar e salvar cada receita
    for (const recipe of generatedRecipes) {
      try {
        // Validar receita
        const validation = validateRecipe(recipe);
        
        if (!validation.isValid) {
          console.warn(`Recipe "${recipe.name}" validation failed:`, validation.errors);
          errorCount++;
          continue;
        }

        // Preparar dados para inserção
        const recipeData = {
          name: recipe.name,
          description: recipe.description,
          category: recipe.category,
          cuisine: recipe.cuisine,
          difficulty: recipe.difficulty,
          prep_time: recipe.prepTime,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          calories: recipe.calories,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          tags: recipe.tags || [],
          nutritional_info: recipe.nutritionalInfo || {},
          image_url: null,
          created_at: new Date().toISOString()
        };

        // Inserir no banco de dados
        const { data, error } = await supabase
          .from('recipes')
          .insert(recipeData)
          .select()
          .single();

        if (error) {
          console.error(`Error saving recipe "${recipe.name}":`, error);
          errorCount++;
        } else {
          recipes.push(data);
          successCount++;
          console.log(`✓ Saved: ${recipe.name}`);
        }

      } catch (error) {
        console.error(`Error processing recipe:`, error);
        errorCount++;
      }
    }

    console.log(`Bulk generation complete: ${successCount} saved, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      message: `Successfully generated and saved ${successCount} recipes`,
      stats: {
        requested: count,
        generated: generatedRecipes.length,
        saved: successCount,
        errors: errorCount
      },
      recipes: recipes.slice(0, 10) // Retorna apenas as primeiras 10 como amostra
    });

  } catch (error) {
    console.error('Bulk generation error:', error);
    
    // Garantir que sempre retorna JSON válido
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate recipes in bulk',
        message: error instanceof Error ? error.message : 'Erro desconhecido ao gerar receitas',
        details: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
