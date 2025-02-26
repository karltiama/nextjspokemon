import { NextResponse } from 'next/server'

const EBAY_APP_ID = process.env.EBAY_APP_ID
const EBAY_CERT_ID = process.env.EBAY_CERT_ID
const EBAY_DEV_ID = process.env.EBAY_DEV_ID
const FINDING_API_URL = 'https://svcs.ebay.com/services/search/FindingService/v1'

// Simple in-memory cache and queue
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes
const CALLS = new Map<string, number>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_CALLS_PER_WINDOW = 2 // Reduced to 2 calls per minute
const RETRY_AFTER = 5000 // 5 seconds

let lastCallTimestamp = 0

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cardName = searchParams.get('cardName')
  const setName = searchParams.get('setName')

  if (!cardName || !setName) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  // Check cache first
  const cacheKey = `${cardName}-${setName}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data)
  }

  // Implement rate limiting with delay
  const now = Date.now()
  const timeSinceLastCall = now - lastCallTimestamp
  
  if (timeSinceLastCall < RETRY_AFTER) {
    return NextResponse.json(
      { error: 'Please wait before making another request' },
      { status: 429 }
    )
  }

  // Check rate limit window
  const windowStart = Math.floor(now / RATE_LIMIT_WINDOW) * RATE_LIMIT_WINDOW
  const callCount = CALLS.get(windowStart.toString()) || 0

  if (callCount >= MAX_CALLS_PER_WINDOW) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    lastCallTimestamp = now
    CALLS.set(windowStart.toString(), callCount + 1)

    const queryParams = new URLSearchParams({
      'OPERATION-NAME': 'findCompletedItems',
      'SERVICE-VERSION': '1.13.0',
      'SECURITY-APPNAME': EBAY_APP_ID!,
      'GLOBAL-ID': 'EBAY-US',
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': '',
      'keywords': `${cardName} ${setName} pokemon card`,
      'itemFilter(0).name': 'SoldItemsOnly',
      'itemFilter(0).value': 'true',
      'categoryId': '183454',
      'sortOrder': 'EndTimeSoonest'
    })

    const response = await fetch(`${FINDING_API_URL}?${queryParams}`)
    const data = await response.json()

    // Add error handling for eBay API errors
    if (data.errorMessage) {
      console.error('eBay API Error:', data.errorMessage)
      return NextResponse.json(
        { error: 'eBay API Error: Invalid API credentials or configuration' },
        { status: 500 }
      )
    }

    // Cache the successful response
    cache.set(cacheKey, { data, timestamp: now })

    return NextResponse.json(data)
  } catch (error) {
    console.error('eBay API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from eBay' },
      { status: 500 }
    )
  }
}