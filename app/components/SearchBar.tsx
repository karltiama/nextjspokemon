"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`)
    }
  }

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search for a Pokemon card..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

