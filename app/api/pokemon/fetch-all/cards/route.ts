import { NextResponse } from 'next/server'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { supabase } from '@/app/lib/supabase'

export async function GET() {
  try {
    // Test with a specific set to see variants
    const cards = await PokemonTCG.findCardsByQueries({ 
      q: 'set.id:sv1' // Using Scarlet & Violet base set as example
    })

    // Log card variants to see what's available
    cards.slice(0, 5).forEach(card => {
      console.log({
        name: card.name,
        number: card.number,
        id: card.id,
        rarity: card.rarity,
        variants: {
          holofoil: card.tcgplayer?.prices?.holofoil || null,
          reverseHolofoil: card.tcgplayer?.prices?.reverseHolofoil || null,
          normal: card.tcgplayer?.prices?.normal || null,
        }
      })
    })

    return NextResponse.json({
      message: 'Card variants checked',
      sampleCards: cards.slice(0, 5).map(card => ({
        name: card.name,
        number: card.number,
        id: card.id,
        rarity: card.rarity,
        variants: {
          holofoil: card.tcgplayer?.prices?.holofoil || null,
          reverseHolofoil: card.tcgplayer?.prices?.reverseHolofoil || null,
          normal: card.tcgplayer?.prices?.normal || null,
        }
      }))
    })

  } catch (error: unknown) {
    console.error('Error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
} 