import { NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

export async function GET() {
  try {
    // Fetch cards with their related set information
    const { data: cards, error } = await supabase
      .from('cards')
      .select(`
        *,
        sets (
          name,
          series
        )
      `)
      .limit(10)

    if (error) throw error

    return NextResponse.json({
      message: 'Cards fetched successfully',
      count: cards.length,
      cards
    })
  } catch (error: unknown) {
    console.error('Error fetching cards:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
}