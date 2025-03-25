import { NextResponse } from 'next/server'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { supabase } from '@/app/lib/supabase'

export async function GET() {
  try {
    // 1. Fetch all sets directly
    const sets = await PokemonTCG.getAllSets()
    console.log(`Fetched ${sets.length} sets from API`)

    // 2. Transform and store sets
    const formattedSets = sets.map(set => ({
      id: set.id,
      name: set.name,
      series: set.series,
      printed_total: set.printedTotal,
      total: set.total,
      release_date: set.releaseDate,
      ptcgo_code: set.ptcgoCode,
      symbol_url: set.images?.symbol,
      logo_url: set.images?.logo,
    }))

    // 3. Store sets in batches
    const batchSize = 50
    for (let i = 0; i < formattedSets.length; i += batchSize) {
      const batch = formattedSets.slice(i, i + batchSize)
      const { error } = await supabase
        .from('sets')
        .upsert(batch)

      if (error) throw new Error(`Error inserting sets batch ${i}: ${error.message}`)
      console.log(`Inserted batch ${i / batchSize + 1} of sets`)
    }

    // 4. Verify sets in database
    const { data: dbSets, error: dbError } = await supabase
      .from('sets')
      .select('*')
      .order('release_date', { ascending: false })

    if (dbError) throw dbError

    return NextResponse.json({
      message: 'All sets fetched and stored successfully',
      totalSets: sets.length,
      setsInDb: dbSets.length,
      sets: dbSets
    })

  } catch (error: unknown) {
    console.error('Error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
}