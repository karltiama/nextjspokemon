'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

interface SetCardProps {
  id: string
  name: string
  series: string
  symbol_url?: string
  logo_url?: string
  release_date: string
  total: number
}

export default function SetCard({
  id,
  name,
  series,
  symbol_url,
  logo_url,
  release_date,
  total
}: SetCardProps) {
  return (
    <Link href={`/sets/${id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square relative mb-2">
          <Image
            src={logo_url || symbol_url || '/placeholder.png'}
            alt={name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
        <h3 className="font-medium text-lg truncate">{name}</h3>
        <p className="text-sm text-gray-500">{series}</p>
        <div className="mt-2 text-sm text-gray-600">
          <p>Released: {new Date(release_date).toLocaleDateString()}</p>
          <p>{total} cards</p>
        </div>
      </Card>
    </Link>
  )
} 