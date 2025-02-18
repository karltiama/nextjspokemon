"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import debounce from 'lodash/debounce'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

// Simple cache interface
interface Cache {
  [key: string]: {
    data: any[];
    timestamp: number;
  };
}

const searchCache: Cache = {};
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export default function SearchBar() {
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Check cache first, then make API call if needed
  const fetchResults = async (query: string) => {
    if (!query) return;

    // Check cache
    const cached = searchCache[query];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setSearchResults(cached.data);
      return;
    }

    setIsLoading(true);
    try {
      const cards = await PokemonTCG.findCardsByQueries({ q: `name:${query}*` })
      
      // Update cache
      searchCache[query] = {
        data: cards,
        timestamp: Date.now()
      };
      
      setSearchResults(cards.slice(0, 10))
    } catch (error) {
      console.error("Error searching cards:", error)
    }
    setIsLoading(false)
  }

  // Debounce the API call
  const debouncedFetch = useCallback(
    debounce((query: string) => fetchResults(query), 500),
    []
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length >= 2) { // Only search if 2 or more characters
      debouncedFetch(value);
    } else {
      setSearchResults([]);
    }
  };

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <form onSubmit={(e) => e.preventDefault()} className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search for a Pokemon card..."
          value={search}
          onChange={handleInputChange}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {searchResults.map((card) => (
            <div key={card.id} className="p-2 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center">
                <img src={card.images.small} alt={card.name} className="h-8 w-8 object-cover rounded" />
                <span className="ml-2">{card.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

