import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import TopReverseHolos from '@/app/components/TopReverseHolos'

export default async function SetPage({ params }: { params: { id: string } }) {
  // Await the ID first
  const setId = await Promise.resolve(params.id)
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Use setId instead of params.id
  const { data: set } = await supabase
    .from('sets')
    .select('*')
    .eq('id', setId)
    .single()

  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('set_id', setId)  // Use setId here too
    .order('number')

  return (
    <div className="container mx-auto p-4">
      {/* Set Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{set?.name}</h1>
        <p className="text-gray-600">{set?.series}</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards?.map((card) => (
          <Link href={`/card/${card.id}`} key={card.id}>
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-[2.5/3.5] relative mb-2">
                <Image
                  src={card.image_small}
                  alt={card.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="font-medium text-sm truncate">{card.name}</h3>
              <p className="text-sm text-gray-500">#{card.number}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Add TopReverseHolos component */}
      <TopReverseHolos cards={cards || []} />
    </div>
  )
} 