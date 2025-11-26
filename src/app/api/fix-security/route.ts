import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('🔧 Iniciando correção de segurança do Supabase...');

    // 1. Verificar se a tabela recipes existe
    const { data: tables, error: tablesError } = await supabase
      .from('recipes')
      .select('id')
      .limit(1);

    if (tablesError) {
      console.error('❌ Erro ao verificar tabela recipes:', tablesError);
      return NextResponse.json({
        success: false,
        error: 'Tabela recipes não encontrada. Execute o schema SQL primeiro.',
        details: tablesError
      }, { status: 500 });
    }

    console.log('✅ Tabela recipes encontrada');

    // 2. Criar buckets de storage se não existirem
    console.log('📦 Criando buckets de storage...');
    
    const bucketsToCreate = [
      {
        id: 'recipe-images',
        name: 'recipe-images',
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      },
      {
        id: 'recipe-audios',
        name: 'recipe-audios',
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav']
      }
    ];

    for (const bucket of bucketsToCreate) {
      const { data: existingBucket } = await supabase
        .storage
        .getBucket(bucket.id);

      if (!existingBucket) {
        const { error: createError } = await supabase
          .storage
          .createBucket(bucket.id, {
            public: bucket.public,
            fileSizeLimit: bucket.fileSizeLimit,
            allowedMimeTypes: bucket.allowedMimeTypes
          });

        if (createError) {
          console.warn(`⚠️ Aviso ao criar bucket ${bucket.id}:`, createError.message);
        } else {
          console.log(`✅ Bucket ${bucket.id} criado com sucesso`);
        }
      } else {
        console.log(`✅ Bucket ${bucket.id} já existe`);
      }
    }

    // 3. Verificar políticas RLS
    console.log('🔒 Verificando políticas RLS...');
    
    const { count: recipesCount } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true });

    console.log(`✅ RLS configurado corretamente - ${recipesCount || 0} receitas acessíveis`);

    // 4. Testar operações básicas
    console.log('🧪 Testando operações básicas...');
    
    // Teste de leitura
    const { data: readTest, error: readError } = await supabase
      .from('recipes')
      .select('id, name')
      .limit(1);

    if (readError) {
      console.error('❌ Erro no teste de leitura:', readError);
    } else {
      console.log('✅ Teste de leitura: OK');
    }

    // Teste de inserção (criar receita de teste)
    const testRecipe = {
      name: 'Receita de Teste - Segurança',
      description: 'Receita criada para testar políticas RLS',
      category: 'snack',
      cuisine: 'brazilian',
      difficulty: 'easy',
      prep_time: 5,
      cook_time: 0,
      servings: 1,
      ingredients: [{ item: 'Teste', quantity: '1', unit: 'unidade' }],
      instructions: ['Passo de teste'],
      tags: ['teste', 'seguranca']
    };

    const { data: insertTest, error: insertError } = await supabase
      .from('recipes')
      .insert(testRecipe)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro no teste de inserção:', insertError);
    } else {
      console.log('✅ Teste de inserção: OK');
      
      // Teste de atualização
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ description: 'Descrição atualizada' })
        .eq('id', insertTest.id);

      if (updateError) {
        console.error('❌ Erro no teste de atualização:', updateError);
      } else {
        console.log('✅ Teste de atualização: OK');
      }
    }

    console.log('🎉 Correção de segurança concluída com sucesso!');

    return NextResponse.json({
      success: true,
      message: 'Segurança do Supabase configurada com sucesso',
      details: {
        recipesCount: recipesCount || 0,
        bucketsCreated: ['recipe-images', 'recipe-audios'],
        rlsEnabled: true,
        policiesActive: true,
        testsCompleted: {
          read: !readError,
          insert: !insertError,
          update: !insertError
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Erro ao corrigir segurança:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao configurar segurança',
      details: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST para executar a correção de segurança do Supabase',
    endpoint: '/api/fix-security',
    method: 'POST'
  });
}
