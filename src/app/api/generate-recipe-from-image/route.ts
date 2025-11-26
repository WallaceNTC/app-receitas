import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Imagem não fornecida" },
        { status: 400 }
      );
    }

    // Validar se é uma imagem base64 válida
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: "Formato de imagem inválido" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta imagem de um prato de comida e crie uma receita COMPLETA e DETALHADA para replicar esse prato.

IMPORTANTE: Forneça a receita no seguinte formato LIMPO, SEM usar asteriscos (*) ou hashtags (#):

[Nome do Prato]

Tempo de Preparo: [X] minutos
Porções: [X] porções
Dificuldade: [Fácil/Média/Difícil]
Calorias: [X] kcal por porção

Ingredientes

[ingrediente 1 com quantidade]
[ingrediente 2 com quantidade]
[ingrediente 3 com quantidade]
[continue listando todos os ingredientes necessários]

Modo de Preparo

1. [Passo 1 detalhado]
2. [Passo 2 detalhado]
3. [Passo 3 detalhado]
[continue com todos os passos necessários]

Seja específico nas quantidades e detalhado nos passos. A receita deve ser fácil de seguir e resultar em um prato similar ao da imagem. NÃO use asteriscos, hashtags ou outros caracteres markdown.`
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
    });

    let recipe = completion.choices[0]?.message?.content;

    if (!recipe) {
      return NextResponse.json(
        { error: "Não foi possível gerar a receita" },
        { status: 500 }
      );
    }

    // Limpar caracteres markdown da resposta
    recipe = recipe
      .replace(/\*\*/g, '') // Remove negrito
      .replace(/\*/g, '')   // Remove itálico
      .replace(/#{1,6}\s/g, '') // Remove headers markdown
      .replace(/^[-•]\s/gm, '') // Remove bullets
      .trim();

    return NextResponse.json({ recipe });
  } catch (error: any) {
    console.error("Erro ao gerar receita da imagem:", error);
    
    if (error?.status === 401) {
      return NextResponse.json(
        { error: "Chave da API OpenAI inválida ou não configurada" },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Limite de requisições atingido. Tente novamente em alguns instantes." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Erro ao processar a imagem" },
      { status: 500 }
    );
  }
}
