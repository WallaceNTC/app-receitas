import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { preferences } = await request.json();

    const prompt = `Gere um plano de refeições semanal saudável e variado para 7 dias. Para cada dia, inclua:
- Café da Manhã
- Almoço  
- Jantar
- 1 Lanche

Cada refeição deve ter:
- Nome da receita
- Lista de ingredientes principais
- Instruções básicas de preparo
- Tempo de preparo (em minutos)
- Número de porções

Preferências: ${preferences || 'saudável, balanceado, fácil de preparar'}

Formate a resposta como um array JSON de objetos, onde cada objeto representa uma refeição com as propriedades: type (breakfast/lunch/dinner/snack), name, ingredients (array), instructions, prepTime, servings.

Retorne apenas o JSON válido, sem texto adicional.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Você é um assistente especializado em nutrição e planejamento de refeições.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const meals = JSON.parse(response.trim());

    return NextResponse.json({ meals });
  } catch (error) {
    console.error('Error generating weekly plan:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar plano semanal' },
      { status: 500 }
    );
  }
}