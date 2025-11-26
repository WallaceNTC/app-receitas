import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const cuisine = searchParams.get('cuisine');
    const difficulty = searchParams.get('difficulty');
    const maxPrepTime = searchParams.get('maxPrepTime');
    const maxCalories = searchParams.get('maxCalories');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Construir query base
    let dbQuery = supabase
      .from('recipes')
      .select('*', { count: 'exact' });

    // Busca por texto (nome, descrição, ingredientes)
    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);
    }

    // Filtros específicos
    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    if (cuisine) {
      dbQuery = dbQuery.eq('cuisine', cuisine);
    }

    if (difficulty) {
      dbQuery = dbQuery.eq('difficulty', difficulty);
    }

    if (maxPrepTime) {
      dbQuery = dbQuery.lte('prep_time', parseInt(maxPrepTime));
    }

    if (maxCalories) {
      dbQuery = dbQuery.lte('calories', parseInt(maxCalories));
    }

    if (tags && tags.length > 0) {
      dbQuery = dbQuery.contains('tags', tags);
    }

    // Ordenação e paginação
    dbQuery = dbQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      recipes: data || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search recipes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Endpoint para obter estatísticas das receitas
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'stats') {
      // Buscar estatísticas gerais
      const { count: totalRecipes } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true });

      // Contar por categoria
      const { data: categories } = await supabase
        .from('recipes')
        .select('category');

      // Contar por cozinha
      const { data: cuisines } = await supabase
        .from('recipes')
        .select('cuisine');

      // Contar por dificuldade
      const { data: difficulties } = await supabase
        .from('recipes')
        .select('difficulty');

      const categoryCounts = categories?.reduce((acc: any, r: any) => {
        acc[r.category] = (acc[r.category] || 0) + 1;
        return acc;
      }, {});

      const cuisineCounts = cuisines?.reduce((acc: any, r: any) => {
        acc[r.cuisine] = (acc[r.cuisine] || 0) + 1;
        return acc;
      }, {});

      const difficultyCounts = difficulties?.reduce((acc: any, r: any) => {
        acc[r.difficulty] = (acc[r.difficulty] || 0) + 1;
        return acc;
      }, {});

      return NextResponse.json({
        success: true,
        stats: {
          total: totalRecipes || 0,
          byCategory: categoryCounts || {},
          byCuisine: cuisineCounts || {},
          byDifficulty: difficultyCounts || {}
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
