import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'

// DELETE /api/subscriptions/[id] - Delete a subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    await prisma.subscription.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete subscription:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    )
  }
}

// PATCH /api/subscriptions/[id] - Update a subscription
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { name, price, cardName, renewalDate, billingCycle } = body

    const updated = await prisma.subscription.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(price && { price: parseFloat(price) }),
        ...(cardName && { cardName }),
        ...(renewalDate && { renewalDate: new Date(renewalDate) }),
        ...(billingCycle && { billingCycle }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}
