'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TestPage() {
  const [status, setStatus] = useState<string>('Testing connection...')
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('sets')
          .select('id, name')
          .limit(1)

        if (error) throw error

        setStatus(`Connection successful! Found ${data.length} sets.`)
      } catch (err: any) {
        setError(err.message)
        setStatus('Connection failed')
      }
    }

    testConnection()
  }, [])

  const handleFetchSets = async () => {
    try {
      const response = await fetch('/api/test-fetch/sets')
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setData(result)
      setStatus('Sets fetched successfully!')
    } catch (err: any) {
      setError(err.message)
      setStatus('Failed to fetch sets')
    }
  }

  const handleFetchCards = async () => {
    try {
      const response = await fetch('/api/test-fetch/cards')
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setData(result)
      setStatus('Cards fetched successfully!')
    } catch (err: any) {
      setError(err.message)
      setStatus('Failed to fetch cards')
    }
  }

  const handleStoreCard = async () => {
    try {
      const response = await fetch('/api/test-pokemon')
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setData(result)
      setStatus('Card stored successfully!')
    } catch (err: any) {
      setError(err.message)
      setStatus('Failed to store card')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Database Test Dashboard</h1>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleStoreCard}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Store Test Card
        </button>
        
        <button
          onClick={handleFetchSets}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Fetch Sets
        </button>
        
        <button
          onClick={handleFetchCards}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Fetch Cards
        </button>

        <button
          onClick={async () => {
            try {
              const response = await fetch('/api/pokemon/fetch-all/sets')
              const result = await response.json()
              if (!response.ok) throw new Error(result.error)
              setData(result)
              setStatus(`Sets stored and verified! Found ${result.setsInDb} sets in database.`)
            } catch (err: any) {
              setError(err.message)
              setStatus('Failed to fetch and verify sets')
            }
          }}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Fetch & Verify All Sets
        </button>

        <button
          onClick={async () => {
            try {
              const response = await fetch('/api/pokemon/fetch-all/cards')
              const result = await response.json()
              if (!response.ok) throw new Error(result.error)
              setData(result)
              setStatus(`Cards stored successfully! Total cards: ${result.totalCards}`)
            } catch (err: any) {
              setError(err.message)
              setStatus('Failed to fetch and store cards')
            }
          }}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Fetch & Store All Cards
        </button>
      </div>

      <div className="mb-4">
        <p className="font-bold">Status:</p>
        <p className="mb-2">{status}</p>
        {error && (
          <p className="text-red-500">Error: {error}</p>
        )}
      </div>

      {data && (
        <div className="mt-4">
          <p className="font-bold">Response Data:</p>
          <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
