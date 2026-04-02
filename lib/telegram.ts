const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function sendTelegramMessage(chatId: string, message: string): Promise<boolean> {
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not set')
    return false
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    const data = await response.json()
    
    if (!data.ok) {
      console.error('Telegram API error:', data.description)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to send Telegram message:', error)
    return false
  }
}

export function formatReminderMessage(
  subscriptionName: string,
  price: number,
  renewalDate: Date,
  daysLeft: number,
  cardName: string
): string {
  const dateStr = renewalDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const emoji = daysLeft === 1 ? '🔴' : '🟡'
  const dayText = daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`

  return `
${emoji} <b>Subscription Renewal Reminder</b>

📌 <b>${subscriptionName}</b>
💰 $${price.toFixed(2)}
📅 Renews ${dayText} (${dateStr})
💳 Card: ${cardName}

Reply with:
/continue_${subscriptionName.toLowerCase().replace(/\s+/g, '_')} - I'll continue
/cancel_${subscriptionName.toLowerCase().replace(/\s+/g, '_')} - I'll cancel
  `.trim()
}
