import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// PATCH /api/user/telegram - Update user's Telegram chat ID
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { telegramChatId } = await request.json()

    await prisma.user.update({
      where: { id: session.user.id },
      data: { telegramChatId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update Telegram chat ID:', error)
    return NextResponse.json(
      { error: 'Failed to update Telegram chat ID' },
      { status: 500 }
    )
  }
}
