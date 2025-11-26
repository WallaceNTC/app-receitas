import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { preferences, currentCalories } = await request.json();

    const prompt = `
Crie um plano de refeições semanal personalizado baseado nas seguintes informações:

Tipo de dieta: ${preferences.diet || 'Não especificado'}
Restrições alimentares: ${preferences.restrictions || 'Nenhuma'}
Calorias diárias objetivo: ${preferences.dailyCalories}
Refeições por dia: ${preferences.mealsPerDay}
Calorias atuais consumidas hoje: ${currentCalories}

O plano deve incluir:
- 7 dias da semana
- ${preferences.mealsPerDay} refeições por dia (café da manhã, almoço, jantar, e lanches se aplicável)
- Estimativa de calorias por refeição
- Receitas simples e práticas
- Considere as restrições e mantenha próximo ao objetivo calórico

Formate de forma clara e organizada.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
    });

    const plan = response.choices[0]?.message?.content || 'Plano não disponível';

    return NextResponse.json({
      plan,
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}