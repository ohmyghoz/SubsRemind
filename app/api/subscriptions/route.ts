import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'

// GET /api/subscriptions - List all subscriptions for logged in user
export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      orderBy: { renewalDate: 'asc' },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

// POST /api/subscriptions - Create new subscription
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, price, currency, cardName, renewalDate, billingCycle } = body

    // Validate required fields
    if (!name || !price || !cardName || !renewalDate || !billingCycle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate billing cycle
    if (!['weekly', 'monthly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Invalid billing cycle' },
        { status: 400 }
      )
    }

    // Validate currency
    const subCurrency = currency === 'USD' ? 'USD' : 'IDR'

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        name,
        price: parseFloat(price),
        currency: subCurrency,
        cardName,
        renewalDate: new Date(renewalDate),
        billingCycle,
      },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Failed to create subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
