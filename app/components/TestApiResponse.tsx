'use client'

import { useState } from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

export default function TestApiResponse() {
  const [response, setResponse] = useState<any>(null)

  const fetchCard = async () => {
    try {
      // Let's search for a specific card, like Charizard VMAX
      const cards = await PokemonTCG.findCardsByQueries({ q: 'name:charizard' })
      setResponse(cards[0]) // Get first card to see full structure
      console.log('Full API Response:', cards[0]) // Also log to console for easier viewing
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="p-4">
      <button 
        onClick={fetchCard}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Fetch Card Data
      </button>
      
      {response && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  )
} 