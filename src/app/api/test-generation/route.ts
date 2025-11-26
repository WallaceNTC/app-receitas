import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar variáveis de ambiente
    const checks = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      openaiKey: !!process.env.OPENAI_API_KEY,
    };

    return NextResponse.json({
      success: true,
      message: 'API está funcionando corretamente',
      environment: {
        supabaseConfigured: checks.supabaseUrl && checks.supabaseKey,
        openaiConfigured: checks.openaiKey,
        details: checks
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
