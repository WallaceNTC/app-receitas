import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    // Verificar se a API Key está configurada
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API OpenAI não configurada. Configure a variável OPENAI_API_KEY nas configurações do projeto." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const { recipeType } = await request.json();

    if (!recipeType) {
      return NextResponse.json(
        { error: "Tipo de receita não fornecido" },
        { status: 400 }
      );
    }

    const prompts: Record<string, string> = {
      fitness: "Crie uma receita fitness saudável e nutritiva, rica em proteínas e baixa em calorias. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título criativo, tempo de preparo, dificuldade, ingredientes detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha), informações nutricionais (calorias, proteínas, carboidratos, gorduras) e dicas extras.",
      viral: "Crie uma receita viral do TikTok/Instagram, moderna e visualmente atraente. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título chamativo, tempo de preparo, dificuldade, ingredientes detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha), dicas de apresentação para fotos/vídeos.",
      vegetariana: "Crie uma receita vegetariana deliciosa e nutritiva, sem carne. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título criativo, tempo de preparo, dificuldade, ingredientes detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha), informações nutricionais e dicas de substituições.",
      sobremesa: "Crie uma receita de sobremesa irresistível e especial. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título criativo, tempo de preparo, dificuldade, ingredientes detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha), dicas de decoração e sugestões de acompanhamento.",
      rapida: "Crie uma receita rápida para o dia a dia, pronta em até 20 minutos. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título criativo, tempo de preparo, dificuldade, ingredientes detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha) e dicas para agilizar ainda mais.",
      gourmet: "Crie uma receita gourmet sofisticada e elegante, digna de restaurante. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título refinado, tempo de preparo, dificuldade, ingredientes premium detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha), técnicas culinárias e sugestões de harmonização.",
      almoco: "Crie uma receita perfeita para o almoço, nutritiva e saborosa. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título criativo, tempo de preparo, dificuldade, ingredientes detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha) e dicas de acompanhamento.",
      jantar: "Crie uma receita ideal para o jantar, reconfortante e deliciosa. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título criativo, tempo de preparo, dificuldade, ingredientes detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha) e dicas de harmonização.",
      brunch: "Crie uma receita perfeita para brunch, combinando café da manhã e almoço. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título criativo, tempo de preparo, dificuldade, ingredientes detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha) e dicas de apresentação.",
      "pequeno-almoco": "Crie uma receita nutritiva para o pequeno almoço, energizante e saudável. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título criativo, tempo de preparo, dificuldade, ingredientes detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha) e dicas nutricionais.",
      lanche: "Crie uma receita de lanche prático e saboroso. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título criativo, tempo de preparo, dificuldade, ingredientes detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha) e dicas de armazenamento.",
      "cafe-da-manha": "Crie uma receita energizante para o café da manhã. Formate a receita de forma limpa e organizada, SEM usar asteriscos (*) ou hashtags (#). Use apenas texto simples. Inclua: título criativo, tempo de preparo, dificuldade, ingredientes detalhados com quantidades (cada um em uma linha), modo de preparo passo a passo numerado (cada passo em uma linha) e benefícios nutricionais."
    };

    const prompt = prompts[recipeType] || prompts.fitness;

    // Tentar com retry automático
    let lastError: any = null;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Você é um chef especialista em criar receitas incríveis. IMPORTANTE: Formate as receitas de forma limpa e organizada, SEM usar asteriscos (*), hashtags (#) ou outros caracteres markdown. Use apenas texto simples com seções bem definidas. Cada ingrediente deve estar em uma linha separada. Cada passo do modo de preparo deve estar em uma linha separada e numerado."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1500,
        });

        let recipeContent = completion.choices[0]?.message?.content;

        if (!recipeContent) {
          return NextResponse.json(
            { error: "Não foi possível gerar a receita" },
            { status: 500 }
          );
        }

        // Limpar caracteres markdown da resposta
        recipeContent = recipeContent
          .replace(/\*\*/g, '') // Remove negrito
          .replace(/\*/g, '')   // Remove itálico
          .replace(/#{1,6}\s/g, '') // Remove headers markdown
          .replace(/^[-•]\s/gm, '') // Remove bullets
          .trim();

        return NextResponse.json({
          recipe: recipeContent,
          type: recipeType
        });
        
      } catch (retryError: any) {
        lastError = retryError;
        
        // Se for rate limit (429) e não for a última tentativa, aguardar e tentar novamente
        if (retryError.status === 429 && attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          continue;
        }
        
        throw retryError;
      }
    }
    
    throw lastError;

  } catch (error: any) {
    console.error("Erro detalhado ao gerar receita:", error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { 
          error: "Chave da API OpenAI inválida ou expirada. Por favor, verifique se a chave está correta e ativa em https://platform.openai.com/api-keys" 
        },
        { status: 401 }
      );
    }
    
    if (error.status === 429) {
      return NextResponse.json(
        { 
          error: "A API OpenAI está temporariamente indisponível devido ao limite de requisições. Aguarde alguns minutos e tente novamente." 
        },
        { status: 429 }
      );
    }

    if (error.status === 403) {
      return NextResponse.json(
        { 
          error: "Acesso negado pela OpenAI. Verifique se sua conta tem permissões adequadas e saldo disponível." 
        },
        { status: 403 }
      );
    }

    if (error.status === 500 || error.status === 503) {
      return NextResponse.json(
        { 
          error: "Serviço da OpenAI temporariamente indisponível. Tente novamente em alguns instantes." 
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Erro ao gerar receita. Tente novamente." },
      { status: 500 }
    );
  }
}
