import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegramMessage, formatReminderMessage } from '@/lib/telegram'
import { addDays, startOfDay, endOfDay } from 'date-fns'

// Vercel Cron Job - runs daily to send reminder notifications
// Configure in vercel.json: "crons": [{ "path": "/api/cron/reminders", "schedule": "0 9 * * *" }]

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    d2Reminders: 0,
    d1Reminders: 0,
    errors: [] as string[],
  }

  try {
    const now = new Date()
    
    // Send D-2 reminders (2 days before renewal)
    const d2Target = addDays(now, 2)
    const d2Subscriptions = await prisma.subscription.findMany({
      where: {
        renewalDate: {
          gte: startOfDay(d2Target),
          lte: endOfDay(d2Target),
        },
        user: {
          telegramChatId: { not: null },
        },
        notificationLogs: {
          none: {
            reminderDays: 2,
          },
        },
      },
      include: {
        user: true,
      },
    })

    for (const sub of d2Subscriptions) {
      if (!sub.user.telegramChatId) continue

      const message = formatReminderMessage(
        sub.name,
        Number(sub.price),
        sub.currency || 'IDR',
        sub.renewalDate,
        2,
        sub.cardName
      )

      const sent = await sendTelegramMessage(sub.user.telegramChatId, message)
      
      if (sent) {
        await prisma.notificationLog.create({
          data: {
            userId: sub.userId,
            subscriptionId: sub.id,
            reminderDays: 2,
          },
        })
        results.d2Reminders++
      } else {
        results.errors.push(`Failed to send D-2 reminder for ${sub.name} to ${sub.user.email}`)
      }
    }

    // Send D-1 reminders (1 day before renewal)
    const d1Target = addDays(now, 1)
    const d1Subscriptions = await prisma.subscription.findMany({
      where: {
        renewalDate: {
          gte: startOfDay(d1Target),
          lte: endOfDay(d1Target),
        },
        user: {
          telegramChatId: { not: null },
        },
        notificationLogs: {
          none: {
            reminderDays: 1,
          },
        },
      },
      include: {
        user: true,
      },
    })

    for (const sub of d1Subscriptions) {
      if (!sub.user.telegramChatId) continue

      const message = formatReminderMessage(
        sub.name,
        Number(sub.price),
        sub.currency || 'IDR',
        sub.renewalDate,
        1,
        sub.cardName
      )

      const sent = await sendTelegramMessage(sub.user.telegramChatId, message)
      
      if (sent) {
        await prisma.notificationLog.create({
          data: {
            userId: sub.userId,
            subscriptionId: sub.id,
            reminderDays: 1,
          },
        })
        results.d1Reminders++
      } else {
        results.errors.push(`Failed to send D-1 reminder for ${sub.name} to ${sub.user.email}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${results.d2Reminders} D-2 and ${results.d1Reminders} D-1 reminders`,
      results,
    })
  } catch (error) {
    console.error('Cron job failed:', error)
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
