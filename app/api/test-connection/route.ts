import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Simple query to test connection
    const { data, error } = await supabase
      .from('sets')
      .select('id, name')
      .limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json({ 
      message: 'Connection successful', 
      data 
    })
  } catch (error) {
    console.error('Connection test failed:', error)
    return NextResponse.json({ 
      message: 'Connection test failed', 
      error 
    }, { status: 500 })
  }
} 