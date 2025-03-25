import { NextResponse } from 'next/server'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { supabase } from '@/app/lib/supabase'

export async function GET() {
  try {
    // 1. Fetch all cards including reverse holos
    const cards = await PokemonTCG.getAllCards()
    console.log(`Fetched ${cards.length} cards from API`)

    // 2. Transform and store cards
    const formattedCards = cards.map(card => ({
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
    }))

    // 3. Store cards in batches
    const batchSize = 50
    let storedCards = 0
    for (let i = 0; i < formattedCards.length; i += batchSize) {
      const batch = formattedCards.slice(i, i + batchSize)
      const { error } = await supabase
        .from('cards')
        .upsert(batch)

      if (error) throw new Error(`Error inserting cards batch ${i}: ${error.message}`)
      storedCards += batch.length
      console.log(`Inserted batch ${i / batchSize + 1} of cards (${storedCards}/${formattedCards.length})`)
    }

    // 4. Verify cards in database
    const { count: dbCount, error: countError } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    return NextResponse.json({
      message: 'All cards fetched and stored successfully',
      totalCardsFromAPI: cards.length,
      totalCardsStored: storedCards,
      cardsInDatabase: dbCount
    })

  } catch (error: unknown) {
    console.error('Error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
} 