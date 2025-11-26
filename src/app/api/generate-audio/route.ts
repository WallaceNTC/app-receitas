import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateInstructionalAudio } from '@/lib/openai-tts';

export const maxDuration = 300;

/**
 * API para gerar áudio instrucional para uma receita específica
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeId } = body;

    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    // Buscar receita no banco
    const { data: recipe, error: fetchError } = await supabaseAdmin
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();

    if (fetchError || !recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Verificar se já tem áudio
    if (recipe.audio_url) {
      return NextResponse.json({
        success: true,
        message: 'Recipe already has audio',
        audioUrl: recipe.audio_url,
        detailedInstructions: recipe.detailed_instructions
      });
    }

    console.log(`Generating audio for recipe: ${recipe.name}`);

    // Gerar áudio
    const { audioUrl, detailedInstructions } = await generateInstructionalAudio(
      recipe.id,
      recipe.name,
      recipe.ingredients,
      recipe.instructions
    );

    // Atualizar receita no banco
    const { error: updateError } = await supabaseAdmin
      .from('recipes')
      .update({
        audio_url: audioUrl,
        detailed_instructions: detailedInstructions,
        updated_at: new Date().toISOString()
      })
      .eq('id', recipeId);

    if (updateError) {
      console.error('Error updating recipe with audio:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: 'Audio generated successfully',
      audioUrl,
      detailedInstructions
    });

  } catch (error: any) {
    console.error('Error in generate-audio API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate audio',
        details: error
      },
      { status: 500 }
    );
  }
}

/**
 * API para gerar áudio para múltiplas receitas em lote
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { limit = 100 } = body;

    console.log(`Generating audio for up to ${limit} recipes without audio...`);

    // Buscar receitas sem áudio
    const { data: recipes, error: fetchError } = await supabaseAdmin
      .from('recipes')
      .select('id, name, ingredients, instructions')
      .is('audio_url', null)
      .limit(limit);

    if (fetchError) {
      throw fetchError;
    }

    if (!recipes || recipes.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No recipes without audio found',
        processed: 0
      });
    }

    console.log(`Found ${recipes.length} recipes without audio`);

    let successCount = 0;
    let errorCount = 0;

    // Processar em lotes pequenos para evitar timeout
    for (const recipe of recipes) {
      try {
        const { audioUrl, detailedInstructions } = await generateInstructionalAudio(
          recipe.id,
          recipe.name,
          recipe.ingredients,
          recipe.instructions
        );

        // Atualizar no banco
        await supabaseAdmin
          .from('recipes')
          .update({
            audio_url: audioUrl,
            detailed_instructions: detailedInstructions,
            updated_at: new Date().toISOString()
          })
          .eq('id', recipe.id);

        successCount++;
        console.log(`✓ Audio generated for: ${recipe.name} (${successCount}/${recipes.length})`);

        // Delay para respeitar rate limits
        await new Promise(resolve => setTimeout(resolve, 1500));

      } catch (error) {
        errorCount++;
        console.error(`✗ Failed to generate audio for: ${recipe.name}`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Audio generation completed`,
      stats: {
        total: recipes.length,
        success: successCount,
        errors: errorCount
      }
    });

  } catch (error: any) {
    console.error('Error in batch audio generation:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate audio in batch',
        details: error
      },
      { status: 500 }
    );
  }
}
