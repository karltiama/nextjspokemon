import { NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

export async function GET() {
  try {
    // Fetch all sets with a limit
    const { data: sets, error } = await supabase
      .from('sets')
      .select('*')
      .limit(10)

    if (error) throw error

    return NextResponse.json({
      message: 'Sets fetched successfully',
      count: sets.length,
      sets
    })
  } catch (error: unknown) {
    console.error('Error fetching sets:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
}