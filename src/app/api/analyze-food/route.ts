import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analise esta imagem de comida e estime as calorias totais. Forneça uma descrição detalhada dos alimentos visíveis e uma estimativa aproximada de calorias.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${image.type};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const analysis = response.choices[0]?.message?.content || 'Análise não disponível';

    // Extract calories from the response (simple parsing)
    const caloriesMatch = analysis.match(/(\d+)\s*calorias?/i);
    const calories = caloriesMatch ? parseInt(caloriesMatch[1]) : 0;

    return NextResponse.json({
      analysis,
      calories,
    });
  } catch (error) {
    console.error('Error analyzing food:', error);
    return NextResponse.json({ error: 'Failed to analyze food' }, { status: 500 });
  }
}