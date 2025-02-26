'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Sale {
  title: string
  price: number
  dateSold: string
  link: string
  condition?: string
}

export default function RecentSales({ cardName, setName }: { cardName: string, setName: string }) {
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const fetchSales = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `/api/ebay/sales?cardName=${encodeURIComponent(cardName)}&setName=${encodeURIComponent(setName)}`
      )
      const data = await response.json()
      console.log('eBay API Response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sales')
      }

      if (!data.findCompletedItemsResponse?.[0]?.searchResult?.[0]?.item) {
        setError('No sales data found')
        return
      }

      const items = data.findCompletedItemsResponse[0].searchResult[0].item
      setSales(items.map((item: any) => ({
        title: item.title[0],
        price: parseFloat(item.sellingStatus[0].currentPrice[0].__value__),
        dateSold: new Date(item.listingInfo[0].endTime[0]).toLocaleDateString(),
        link: item.viewItemURL[0],
        condition: item.condition?.[0].conditionDisplayName?.[0] || 'Not Specified'
      })))
      setIsDataLoaded(true)
    } catch (err) {
      console.error('Error fetching sales:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch sales')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isDataLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Button 
              onClick={fetchSales} 
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load Recent Sales'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchSales} disabled={isLoading}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sales.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="mb-4">No recent sales found</p>
            <Button onClick={fetchSales} disabled={isLoading}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.map((sale, index) => (
            <a
              key={index}
              href={sale.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-gray-50 p-3 rounded-lg border transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{sale.title}</div>
                  <div className="text-sm text-gray-500">
                    Sold: {sale.dateSold}
                    {sale.condition && ` • ${sale.condition}`}
                  </div>
                </div>
                <div className="font-bold text-green-600">
                  ${sale.price.toFixed(2)}
                </div>
              </div>
            </a>
          ))}
          <div className="text-center pt-4">
            <Button onClick={fetchSales} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 