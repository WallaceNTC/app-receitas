import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Criar bucket para mídia de receitas
    const { data: bucketData, error: bucketError } = await supabaseAdmin
      .storage
      .createBucket('recipe-media', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'image/jpeg', 'image/png', 'image/webp']
      });

    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('Error creating bucket:', bucketError);
      return NextResponse.json({
        success: false,
        error: 'Failed to create storage bucket',
        details: bucketError
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Storage bucket configured successfully',
      bucket: 'recipe-media'
    });

  } catch (error: any) {
    console.error('Error in setup-storage:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to setup storage',
      details: error
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Verificar se bucket existe
    const { data: buckets, error } = await supabaseAdmin
      .storage
      .listBuckets();

    if (error) throw error;

    const recipeMediaBucket = buckets?.find(b => b.name === 'recipe-media');

    return NextResponse.json({
      success: true,
      bucketExists: !!recipeMediaBucket,
      bucket: recipeMediaBucket || null
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
