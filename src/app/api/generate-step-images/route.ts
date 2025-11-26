import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Validar variáveis de ambiente
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

    const body = await request.json();
    const { recipeId, recipeName, instructions, generateMain = true } = body;

    if (!recipeId || !recipeName || !instructions || !Array.isArray(instructions)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`Generating images for recipe: ${recipeName}`);

    const imageUrls: string[] = [];
    let mainImageUrl: string | null = null;

    // Gerar imagem principal da receita finalizada
    if (generateMain) {
      try {
        console.log('Generating main recipe image...');
        const mainPrompt = `A professional, appetizing photo of ${recipeName}, beautifully plated and ready to serve. High quality food photography, natural lighting, restaurant quality presentation.`;
        
        const mainImageResponse = await openai.images.generate({
          model: 'dall-e-3',
          prompt: mainPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        });

        mainImageUrl = mainImageResponse.data[0].url || null;
        console.log('Main image generated successfully');
      } catch (error) {
        console.error('Error generating main image:', error);
      }
    }

    // Gerar imagens para cada passo
    for (let i = 0; i < instructions.length; i++) {
      try {
        const instruction = instructions[i];
        console.log(`Generating image for step ${i + 1}/${instructions.length}...`);

        // Criar prompt descritivo para o passo
        const stepPrompt = `Professional food photography showing step ${i + 1} of cooking ${recipeName}: ${instruction}. Clear, well-lit, kitchen setting, showing the cooking process in detail.`;

        const imageResponse = await openai.images.generate({
          model: 'dall-e-3',
          prompt: stepPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        });

        const imageUrl = imageResponse.data[0].url;
        if (imageUrl) {
          imageUrls.push(imageUrl);
          console.log(`✓ Step ${i + 1} image generated`);
        }

        // Delay entre requisições para evitar rate limit
        if (i < instructions.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error generating image for step ${i + 1}:`, error);
        // Adiciona URL vazia para manter índices corretos
        imageUrls.push('');
      }
    }

    // Atualizar receita no banco de dados
    const updateData: any = {
      step_images: imageUrls
    };

    if (mainImageUrl) {
      updateData.image_url = mainImageUrl;
    }

    const { error: updateError } = await supabase
      .from('recipes')
      .update(updateData)
      .eq('id', recipeId);

    if (updateError) {
      console.error('Error updating recipe:', updateError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save images to database',
          message: updateError.message
        },
        { status: 500 }
      );
    }

    console.log(`Successfully generated ${imageUrls.length} step images${mainImageUrl ? ' + main image' : ''}`);

    return NextResponse.json({
      success: true,
      message: `Generated ${imageUrls.length} step images${mainImageUrl ? ' and main image' : ''}`,
      data: {
        mainImageUrl,
        stepImages: imageUrls,
        totalGenerated: imageUrls.filter(url => url).length
      }
    });

  } catch (error) {
    console.error('Error generating images:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate images',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
