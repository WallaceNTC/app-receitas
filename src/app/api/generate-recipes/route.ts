import { NextRequest, NextResponse } from 'next/server';
import { generateMassRecipes, generateThemedRecipes, generateRecipeWithAudio } from '@/lib/openai-recipe-generator';
import { validateAndStandardizeRecipe } from '@/lib/recipe-validator';
import { supabaseAdmin } from '@/lib/supabase';

export const maxDuration = 300; // 5 minutos de timeout

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      count = 100, 
      batchSize = 10, 
      theme = null,
      saveToDatabase = true,
      generateAudio = true // Novo parâmetro para controlar geração de áudio
    } = body;

    console.log(`Starting recipe generation: ${count} recipes (audio: ${generateAudio})`);

    // Gerar receitas com IA
    let rawRecipes: any[] = [];
    
    if (theme) {
      console.log(`Generating themed recipes: ${theme}`);
      rawRecipes = await generateThemedRecipes(theme, count);
    } else {
      console.log('Generating diverse recipes');
      rawRecipes = await generateMassRecipes(count, batchSize, 2000, (current, total) => {
        console.log(`Progress: ${current}/${total} recipes generated`);
      });
    }

    console.log(`Generated ${rawRecipes.length} raw recipes`);

    // Validar e padronizar receitas
    const validatedRecipes = rawRecipes
      .map(recipe => validateAndStandardizeRecipe(recipe))
      .filter(recipe => recipe !== null);

    console.log(`Validated ${validatedRecipes.length} recipes`);

    const stats = {
      requested: count,
      generated: rawRecipes.length,
      validated: validatedRecipes.length,
      rejected: rawRecipes.length - validatedRecipes.length,
      saved: 0,
      withAudio: 0
    };

    // Salvar no banco de dados se solicitado
    if (saveToDatabase && validatedRecipes.length > 0) {
      try {
        // Preparar dados para inserção
        const recipesToInsert = validatedRecipes.map(recipe => ({
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
          audio_url: null, // Será preenchido depois se generateAudio = true
          detailed_instructions: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        // Inserir em lotes de 100 (limite do Supabase)
        const insertBatchSize = 100;
        let savedCount = 0;
        const insertedRecipes: any[] = [];

        for (let i = 0; i < recipesToInsert.length; i += insertBatchSize) {
          const batch = recipesToInsert.slice(i, i + insertBatchSize);
          
          const { data, error } = await supabaseAdmin
            .from('recipes')
            .insert(batch)
            .select();

          if (error) {
            console.error('Error inserting batch:', error);
            throw error;
          }

          savedCount += data?.length || 0;
          if (data) {
            insertedRecipes.push(...data);
          }
          console.log(`Saved batch: ${savedCount}/${recipesToInsert.length}`);
        }

        stats.saved = savedCount;
        console.log(`Successfully saved ${savedCount} recipes to database`);

        // Gerar áudio para as receitas se solicitado
        if (generateAudio && insertedRecipes.length > 0) {
          console.log('Starting audio generation for recipes...');
          
          // Gerar áudio apenas para as primeiras 50 receitas (para não exceder timeout)
          const recipesForAudio = insertedRecipes.slice(0, Math.min(50, insertedRecipes.length));
          let audioCount = 0;

          for (const recipe of recipesForAudio) {
            try {
              const { audioUrl, detailedInstructions } = await generateRecipeWithAudio(
                recipe,
                recipe.id
              );

              if (audioUrl) {
                // Atualizar receita com áudio
                await supabaseAdmin
                  .from('recipes')
                  .update({
                    audio_url: audioUrl,
                    detailed_instructions: detailedInstructions,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', recipe.id);

                audioCount++;
                console.log(`Audio generated for: ${recipe.name} (${audioCount}/${recipesForAudio.length})`);
              }

              // Delay para respeitar rate limits do TTS
              await new Promise(resolve => setTimeout(resolve, 1500));
            } catch (audioError) {
              console.error(`Failed to generate audio for ${recipe.name}:`, audioError);
              // Continua mesmo se falhar
            }
          }

          stats.withAudio = audioCount;
          console.log(`Generated audio for ${audioCount} recipes`);
        }

      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json({
          success: false,
          error: 'Failed to save recipes to database',
          details: dbError,
          stats,
          recipes: validatedRecipes
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully generated and validated ${validatedRecipes.length} recipes`,
      stats,
      recipes: saveToDatabase ? [] : validatedRecipes, // Retorna receitas apenas se não salvou no DB
      sampleRecipes: validatedRecipes.slice(0, 3) // Sempre retorna 3 exemplos
    });

  } catch (error: any) {
    console.error('Error in recipe generation:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate recipes',
      details: error
    }, { status: 500 });
  }
}

// Endpoint GET para verificar status
export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('recipes')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    // Contar receitas com áudio
    const { count: audioCount } = await supabaseAdmin
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);

    return NextResponse.json({
      success: true,
      totalRecipes: count || 0,
      recipesWithAudio: audioCount || 0,
      message: 'Recipe generation API is ready'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
