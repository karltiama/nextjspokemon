import { NextResponse } from 'next/server'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { supabase } from '@/app/lib/supabase'

export async function GET() {
  try {
    // Test with a specific set (Scarlet & Violet base)
    const cards = await PokemonTCG.findCardsByQueries({ 
      q: 'set.id:sv1' 
    })

    // Transform cards with variant information
    const formattedCards = cards.map(card => ({
      id: card.id,
      name: card.name,
      number: card.number,
      set_id: card.set.id,
      image_small: card.images.small,
      image_large: card.images.large,
      rarity: card.rarity,
      // Variant information
      variants: {
        normal: {
          exists: Boolean(card.tcgplayer?.prices?.normal),
          price: card.tcgplayer?.prices?.normal?.market || null
        },
        holofoil: {
          exists: Boolean(card.tcgplayer?.prices?.holofoil),
          price: card.tcgplayer?.prices?.holofoil?.market || null
        },
        reverseHolofoil: {
          exists: Boolean(card.tcgplayer?.prices?.reverseHolofoil),
          price: card.tcgplayer?.prices?.reverseHolofoil?.market || null
        }
      }
    }))

    // Store in database
    const { data, error } = await supabase
      .from('cards')
      .upsert(formattedCards)
      .select()

    if (error) throw error

    return NextResponse.json({
      message: 'Cards with variants stored successfully',
      sampleCards: formattedCards.slice(0, 5), // Show first 5 cards as sample
      totalCards: formattedCards.length,
      storedCards: data.length
    })

  } catch (error: unknown) {
    console.error('Error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
} 