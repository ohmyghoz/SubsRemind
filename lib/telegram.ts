const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function sendTelegramMessage(chatId: string, message: string): Promise<{ success: boolean; error?: string }> {
  if (!BOT_TOKEN) {
    const error = 'TELEGRAM_BOT_TOKEN not set in environment variables'
    console.error(error)
    return { success: false, error }
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
      const error = `Telegram API error: ${data.description} (chat_id: ${chatId})`
      console.error(error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    const errorMsg = `Failed to send Telegram message: ${error instanceof Error ? error.message : String(error)}`
    console.error(errorMsg)
    return { success: false, error: errorMsg }
  }
}

// Format currency for Telegram messages
function formatTelegramCurrency(price: number, currency: string): string {
  if (currency === 'USD') {
    return `$${price.toFixed(2)}`
  }
  // IDR - Indonesian Rupiah
  return `Rp${price.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function formatReminderMessage(
  subscriptionName: string,
  price: number,
  currency: string,
  renewalDate: Date,
  daysLeft: number,
  cardName: string
): string {
  const dateStr = renewalDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const emoji = daysLeft === 1 ? '🔴' : '🟡'
  const dayText = daysLeft === 1 ? 'besok' : `${daysLeft} hari lagi`

  return `
${emoji} <b>Pengingat Pembayaran Langganan</b>

📌 <b>${subscriptionName}</b>
💰 ${formatTelegramCurrency(price, currency || 'IDR')}
📅 Berlangganan ${dayText} (${dateStr})
💳 Kartu: ${cardName}

Balas dengan:
/lanjut_${subscriptionName.toLowerCase().replace(/\s+/g, '_')} - Lanjutkan
/batal_${subscriptionName.toLowerCase().replace(/\s+/g, '_')} - Batalkan
  `.trim()
}
