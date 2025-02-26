import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'

interface SearchResult {
  id: string
  name: string
  images: {
    small: string
  }
  set: {
    name: string
  }
}

interface SearchResultsProps {
  results: SearchResult[]
}

export default function SearchResults({ results }: SearchResultsProps) {
  // Take only the first 12 results
  const limitedResults = results.slice(0, 12)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {limitedResults.map((card) => (
        <Link href={`/card/${card.id}`} key={card.id}>
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-[2.5/3.5] relative mb-2">
              <Image
                src={card.images.small}
                alt={card.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h3 className="font-medium text-sm truncate">{card.name}</h3>
            <p className="text-sm text-gray-500 truncate">{card.set.name}</p>
          </Card>
        </Link>
      ))}
    </div>
  )
} 