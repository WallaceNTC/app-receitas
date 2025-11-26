import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Gera imagem para um passo da receita usando DALL-E
 */
export async function generateStepImage(
  recipeName: string,
  stepDescription: string,
  stepNumber: number
): Promise<string> {
  try {
    const prompt = `Professional food photography of ${recipeName}, step ${stepNumber}: ${stepDescription}. High quality, well-lit, appetizing, realistic cooking scene, kitchen setting, ingredients visible, professional chef perspective, 4K quality`;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'natural'
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL received from DALL-E');
    }

    return imageUrl;
  } catch (error) {
    console.error('Error generating step image:', error);
    throw error;
  }
}

/**
 * Gera imagem principal da receita finalizada
 */
export async function generateRecipeMainImage(
  recipeName: string,
  description: string
): Promise<string> {
  try {
    const prompt = `Professional food photography of ${recipeName}: ${description}. Beautifully plated, restaurant quality, high resolution, appetizing presentation, natural lighting, garnished, 4K quality, food magazine style`;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'natural'
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL received from DALL-E');
    }

    return imageUrl;
  } catch (error) {
    console.error('Error generating main recipe image:', error);
    throw error;
  }
}

/**
 * Gera imagens para todos os passos de uma receita
 */
export async function generateAllStepImages(
  recipeName: string,
  instructions: string[]
): Promise<string[]> {
  const imageUrls: string[] = [];
  
  for (let i = 0; i < instructions.length; i++) {
    try {
      const imageUrl = await generateStepImage(recipeName, instructions[i], i + 1);
      imageUrls.push(imageUrl);
      
      // Delay entre requisições para respeitar rate limits
      if (i < instructions.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error generating image for step ${i + 1}:`, error);
      // Adiciona URL vazia se falhar
      imageUrls.push('');
    }
  }
  
  return imageUrls;
}
