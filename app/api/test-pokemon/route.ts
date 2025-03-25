import { NextResponse } from 'next/server'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { supabase } from '@/app/lib/supabase'

export async function GET() {
  try {
    // 1. Fetch a specific card (Base Set Charizard as an example)
    const cards = await PokemonTCG.findCardsByQueries({ q: 'id:base1-4' })
    const card = cards[0]
    
    console.log('Fetched card:', card) // Log the raw API response

    // 2. First, ensure the set exists
    const { data: setData, error: setError } = await supabase
      .from('sets')
      .upsert({
        id: card.set.id,
        name: card.set.name,
        series: card.set.series,
        printed_total: card.set.printedTotal,
        total: card.set.total,
        release_date: card.set.releaseDate,
        ptcgo_code: card.set.ptcgoCode,
        symbol_url: card.set.images?.symbol,
        logo_url: card.set.images?.logo,
      })
      .select()

    if (setError) throw new Error(`Set insertion failed: ${setError.message}`)

    // 3. Then insert the card
    const { data: cardData, error: cardError } = await supabase
      .from('cards')
      .upsert({
        id: card.id,
        name: card.name,
        supertype: card.supertype,
        subtypes: card.subtypes,
        hp: card.hp,
        types: card.types,
        evolves_from: card.evolvesFrom,
        number: card.number,
        artist: card.artist,
        rarity: card.rarity,
        flavor_text: card.flavorText,
        national_pokedex_numbers: card.nationalPokedexNumbers,
        image_small: card.images.small,
        image_large: card.images.large,
        set_id: card.set.id,
        abilities: card.abilities,
        attacks: card.attacks,
        weaknesses: card.weaknesses,
        retreat_cost: card.retreatCost,
        converted_retreat_cost: card.convertedRetreatCost,
        legalities: card.legalities,
      })
      .select()

    if (cardError) throw new Error(`Card insertion failed: ${cardError.message}`)

    return NextResponse.json({
      message: 'Card stored successfully',
      card: cardData,
      set: setData
    })

  } catch (error: unknown) {
    console.error('Error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
}