'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export function TelegramSetup() {
  const { data: session, update } = useSession()
  const [chatId, setChatId] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function saveChatId() {
    if (!chatId.trim()) return
    
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/user/telegram', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramChatId: chatId.trim() }),
      })

      if (response.ok) {
        await update()
        setMessage('✅ Telegram configured successfully!')
        setChatId('')
      } else {
        setMessage('❌ Failed to save. Please try again.')
      }
    } catch {
      setMessage('❌ Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  // If already configured, show status
  if (session?.user?.telegramChatId) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-xl">✅</span>
          <div>
            <p className="font-medium text-green-800">Telegram Notifications Active</p>
            <p className="text-sm text-green-700">
              You will receive reminders 2 days and 1 day before each renewal.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-blue-900 mb-2">
        📱 Enable Telegram Notifications
      </h3>
      <p className="text-sm text-blue-800 mb-4">
        Get instant reminders on your phone before subscriptions renew.
      </p>
      
      <ol className="text-sm text-blue-800 mb-4 list-decimal list-inside space-y-1">
        <li>Open Telegram and search for <strong>@userinfobot</strong></li>
        <li>Click Start, it will send you your Chat ID</li>
        <li>Copy the Chat ID and paste it below</li>
      </ol>

      <div className="flex gap-2">
        <input
          type="text"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="Your Telegram Chat ID (e.g., 123456789)"
          className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={saveChatId}
          disabled={saving || !chatId.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {message && (
        <p className={`mt-2 text-sm ${message.startsWith('✅') ? 'text-green-700' : 'text-red-700'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
