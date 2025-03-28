import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

interface CardWithPrices {
  id: string
  name: string
  number: string
  image_small: string
  variants: {
    reverseHolofoil: {
      exists: boolean
      price: number | null
    }
  }
}

export default function TopReverseHolos({ cards }: { cards: CardWithPrices[] }) {
  // Filter cards with reverse holo prices and sort by price
  const topReverseHolos = cards
    .filter(card => 
      card.variants?.reverseHolofoil?.exists && 
      card.variants.reverseHolofoil.price !== null
    )
    .sort((a, b) => 
      (b.variants.reverseHolofoil.price || 0) - (a.variants.reverseHolofoil.price || 0)
    )
    .slice(0, 10)

  if (topReverseHolos.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Top 10 Most Valuable Reverse Holos</h2>
      <div className="space-y-4">
        {topReverseHolos.map((card, index) => (
          <Link href={`/card/${card.id}`} key={card.id}>
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-20 aspect-[2.5/3.5] relative">
                  <Image
                    src={card.image_small}
                    alt={card.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{card.name}</h3>
                  <p className="text-sm text-gray-500">#{card.number}</p>
                  <p className="text-sm font-bold text-green-600">
                    ${card.variants.reverseHolofoil.price?.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 