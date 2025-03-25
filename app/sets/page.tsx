import { createClient } from '@supabase/supabase-js'
import SetCard from '@/app/components/SetCard'

export default async function SetsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  // Fetch sets ordered by release date
  const { data: sets, error } = await supabase
    .from('sets')
    .select('*')
    .order('release_date', { ascending: false })

  if (error) {
    console.error('Error fetching sets:', error)
    return <div>Error loading sets</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pokemon TCG Sets</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sets?.map((set) => (
          <SetCard
            key={set.id}
            id={set.id}
            name={set.name}
            series={set.series}
            symbol_url={set.symbol_url}
            logo_url={set.logo_url}
            release_date={set.release_date}
            total={set.total}
          />
        ))}
      </div>
    </div>
  )
} 