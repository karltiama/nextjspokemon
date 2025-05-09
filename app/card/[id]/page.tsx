import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import Image from 'next/image'
import RecentSales from '../../components/RecentSales'
import { Button } from "@/components/ui/button"

async function getCard(id: string) {
  try {
    const card = await PokemonTCG.findCardByID(id)
    return card
  } catch (error) {
    console.error('Error fetching card:', error)
    throw new Error('Failed to fetch card')
  }
}

export default async function CardPage({ params }: { params: { id: string } }) {
  try {
    const card = await getCard(params.id)
    
    if (!card) {
      throw new Error('Card not found')
    }

    // Add delay between Pokemon TCG API call and eBay API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const ebaySearchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
      `${card.name} ${card.set.name} pokemon card`
    )}&_sacat=0`

    return (
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Image */}
            <div className="relative aspect-[2.5/3.5] w-full max-w-md mx-auto">
              <Image
                src={card.images.large}
                alt={card.name}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Card Details */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{card.name}</h1>
              
              {/* Add eBay Button */}
              <a href={ebaySearchUrl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  View on eBay
                </Button>
              </a>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-lg font-semibold">HP</h2>
                  <p>{card.hp || 'N/A'}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Types</h2>
                  <p>{card.types?.join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Rarity</h2>
                  <p>{card.rarity || 'N/A'}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Set</h2>
                  <p>{card.set.name}</p>
                </div>
              </div>

              {/* Attacks */}
              {card.attacks && card.attacks.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Attacks</h2>
                  <div className="space-y-2">
                    {card.attacks.map((attack, index) => (
                      <div key={index} className="border p-2 rounded">
                        <div className="font-semibold">{attack.name}</div>
                        <div className="text-sm">{attack.text}</div>
                        <div className="text-sm">Damage: {attack.damage || 'N/A'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Market Prices if available */}
              {card.tcgplayer && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Market Prices</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(card.tcgplayer.prices).map(([variant, prices]) => (
                      <div key={variant} className="border p-2 rounded">
                        <div className="font-semibold capitalize mb-2">{variant}</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Market: ${prices.market?.toFixed(2) || 'N/A'}</div>
                          <div>Low: ${prices.low?.toFixed(2) || 'N/A'}</div>
                          <div>Mid: ${prices.mid?.toFixed(2) || 'N/A'}</div>
                          <div>High: ${prices.high?.toFixed(2) || 'N/A'}</div>
                          {prices.directLow && (
                            <div>Direct Low: ${prices.directLow.toFixed(2)}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <RecentSales cardName={card.name} setName={card.set.name} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in CardPage:', error)
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Error</h1>
          <p>{error instanceof Error ? error.message : 'An error occurred'}</p>
        </div>
      </div>
    )
  }
} 