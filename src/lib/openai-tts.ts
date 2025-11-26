import OpenAI from 'openai';
import { supabaseAdmin } from './supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Gera instruções detalhadas para narração a partir das instruções básicas
 */
export function generateDetailedInstructions(
  recipeName: string,
  ingredients: any[],
  instructions: string[]
): string {
  const ingredientsList = ingredients
    .map(ing => `${ing.quantity} ${ing.unit} de ${ing.item}`)
    .join(', ');

  const detailedSteps = instructions
    .map((step, index) => `Passo ${index + 1}: ${step}`)
    .join('. ');

  return `Bem-vindo ao tutorial de ${recipeName}. 
Você vai precisar dos seguintes ingredientes: ${ingredientsList}. 
Agora vamos começar a preparação. ${detailedSteps}. 
E pronto! Sua receita de ${recipeName} está completa. Bom apetite!`;
}

/**
 * Gera áudio instrucional usando OpenAI TTS
 */
export async function generateInstructionalAudio(
  recipeId: string,
  recipeName: string,
  ingredients: any[],
  instructions: string[]
): Promise<{ audioUrl: string; detailedInstructions: string }> {
  try {
    // Gerar texto detalhado
    const detailedInstructions = generateDetailedInstructions(
      recipeName,
      ingredients,
      instructions
    );

    // Gerar áudio com TTS
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova', // Voz feminina clara e profissional
      input: detailedInstructions,
      speed: 0.95, // Velocidade ligeiramente mais lenta para clareza
    });

    // Converter para buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    // Upload para Supabase Storage
    const fileName = `recipe-audio-${recipeId}-${Date.now()}.mp3`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('recipe-media')
      .upload(fileName, buffer, {
        contentType: 'audio/mpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading audio to Supabase:', uploadError);
      throw uploadError;
    }

    // Obter URL pública
    const { data: urlData } = supabaseAdmin
      .storage
      .from('recipe-media')
      .getPublicUrl(fileName);

    return {
      audioUrl: urlData.publicUrl,
      detailedInstructions
    };
  } catch (error) {
    console.error('Error generating instructional audio:', error);
    throw error;
  }
}

/**
 * Gera áudio para múltiplas receitas em lote
 */
export async function generateAudioForRecipes(
  recipes: Array<{
    id: string;
    name: string;
    ingredients: any[];
    instructions: string[];
  }>,
  onProgress?: (current: number, total: number) => void
): Promise<Array<{ id: string; audioUrl: string; detailedInstructions: string }>> {
  const results = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    
    try {
      console.log(`Generating audio for recipe ${i + 1}/${recipes.length}: ${recipe.name}`);
      
      const { audioUrl, detailedInstructions } = await generateInstructionalAudio(
        recipe.id,
        recipe.name,
        recipe.ingredients,
        recipe.instructions
      );

      results.push({
        id: recipe.id,
        audioUrl,
        detailedInstructions
      });

      if (onProgress) {
        onProgress(i + 1, recipes.length);
      }

      // Delay para respeitar rate limits (TTS tem limite de 50 requests/min)
      if (i < recipes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error(`Failed to generate audio for recipe ${recipe.name}:`, error);
      // Continua com a próxima receita mesmo se uma falhar
    }
  }

  return results;
}
