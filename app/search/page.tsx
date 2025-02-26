'use client'

import { useSearchParams } from 'next/navigation'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import { useEffect, useState } from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import type { Card } from 'pokemon-tcg-sdk-typescript/dist/sdk'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<Card[]>([])

  useEffect(() => {
    if (query) {
      PokemonTCG.findCardsByQueries({ q: `name:*${query}*` })
        .then(cards => setResults(cards))
        .catch(console.error)
    }
  }, [query])

  return (
    <div className="container mx-auto p-4">
      <SearchBar />
      <div className="mt-6">
        <SearchResults results={results} />
      </div>
    </div>
  )
}