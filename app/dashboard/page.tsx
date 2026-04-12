'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { TelegramSetup } from '@/components/telegram-setup'

interface Subscription {
  id: string
  name: string
  price: number
  currency: string
  cardName: string
  renewalDate: string
  billingCycle: string
}

// Format currency display
function formatCurrency(amount: number, currency: string): string {
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`
  }
  // IDR - Indonesian Rupiah
  return `Rp${amount.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// Convert any billing cycle to monthly equivalent
function getMonthlyEquivalent(price: number, billingCycle: string): number {
  switch (billingCycle) {
    case 'weekly':
      return price * 4.33 // Average weeks per month
    case 'monthly':
      return price
    case 'yearly':
      return price / 12
    default:
      return price
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchSubscriptions()
    }
  }, [status, router])

  async function fetchSubscriptions() {
    try {
      const response = await fetch('/api/subscriptions')
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data)
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteSubscription(id: string) {
    if (!confirm('Are you sure you want to delete this subscription?')) return

    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSubscriptions(subscriptions.filter((s) => s.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete subscription:', error)
    }
  }

  // Group subscriptions by currency
  const idrSubs = subscriptions.filter((s) => s.currency === 'IDR' || !s.currency)
  const usdSubs = subscriptions.filter((s) => s.currency === 'USD')

  // Calculate IDR totals
  const idrWeeklyTotal = idrSubs
    .filter((s) => s.billingCycle === 'weekly')
    .reduce((sum, s) => sum + Number(s.price), 0)
  const idrMonthlyTotal = idrSubs
    .filter((s) => s.billingCycle === 'monthly')
    .reduce((sum, s) => sum + Number(s.price), 0)
  const idrYearlyTotal = idrSubs
    .filter((s) => s.billingCycle === 'yearly')
    .reduce((sum, s) => sum + Number(s.price), 0)
  const idrMonthlyEquivalent = 
    getMonthlyEquivalent(idrWeeklyTotal, 'weekly') + 
    idrMonthlyTotal + 
    getMonthlyEquivalent(idrYearlyTotal, 'yearly')

  // Calculate USD totals
  const usdWeeklyTotal = usdSubs
    .filter((s) => s.billingCycle === 'weekly')
    .reduce((sum, s) => sum + Number(s.price), 0)
  const usdMonthlyTotal = usdSubs
    .filter((s) => s.billingCycle === 'monthly')
    .reduce((sum, s) => sum + Number(s.price), 0)
  const usdYearlyTotal = usdSubs
    .filter((s) => s.billingCycle === 'yearly')
    .reduce((sum, s) => sum + Number(s.price), 0)
  const usdMonthlyEquivalent = 
    getMonthlyEquivalent(usdWeeklyTotal, 'weekly') + 
    usdMonthlyTotal + 
    getMonthlyEquivalent(usdYearlyTotal, 'yearly')

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Subscriptions</h1>
              <p className="text-gray-600">Manage and track all your subscriptions</p>
            </div>
            <Link
              href="/dashboard/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700"
            >
              + Add Subscription
            </Link>
          </div>

          {/* Telegram Setup */}
          <TelegramSetup />

          {/* IDR Stats */}
          {(idrSubs.length > 0 || subscriptions.length === 0) && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🇮🇩 IDR (Rupiah)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <StatCard
                  title="Weekly"
                  amount={idrWeeklyTotal}
                  currency="IDR"
                  subtitle="Billed weekly"
                />
                <StatCard
                  title="Monthly"
                  amount={idrMonthlyTotal}
                  currency="IDR"
                  subtitle="Billed monthly"
                />
                <StatCard
                  title="Yearly"
                  amount={idrYearlyTotal}
                  currency="IDR"
                  subtitle="Billed yearly"
                />
                <StatCard
                  title="Monthly Equivalent"
                  amount={idrMonthlyEquivalent}
                  currency="IDR"
                  subtitle="Total monthly spending"
                  highlight
                />
              </div>
            </div>
          )}

          {/* USD Stats */}
          {usdSubs.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🇺🇸 USD (Dollar)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <StatCard
                  title="Weekly"
                  amount={usdWeeklyTotal}
                  currency="USD"
                  subtitle="Billed weekly"
                />
                <StatCard
                  title="Monthly"
                  amount={usdMonthlyTotal}
                  currency="USD"
                  subtitle="Billed monthly"
                />
                <StatCard
                  title="Yearly"
                  amount={usdYearlyTotal}
                  currency="USD"
                  subtitle="Billed yearly"
                />
                <StatCard
                  title="Monthly Equivalent"
                  amount={usdMonthlyEquivalent}
                  currency="USD"
                  subtitle="Total monthly spending"
                  highlight
                />
              </div>
            </div>
          )}

          {/* Subscriptions List */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                All Subscriptions ({subscriptions.length})
              </h2>
            </div>

            {subscriptions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No subscriptions yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Add your first subscription to start tracking
                </p>
                <Link
                  href="/dashboard/new"
                  className="text-primary-600 font-medium hover:text-primary-700"
                >
                  Add Subscription →
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {subscriptions.map((sub) => (
                  <SubscriptionItem
                    key={sub.id}
                    subscription={sub}
                    onDelete={() => deleteSubscription(sub.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

function StatCard({
  title,
  amount,
  currency,
  subtitle,
  highlight = false,
}: {
  title: string
  amount: number
  currency: string
  subtitle: string
  highlight?: boolean
}) {
  return (
    <div className={`p-6 rounded-xl border ${highlight ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200'}`}>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className={`text-2xl font-bold mt-2 ${highlight ? 'text-primary-700' : 'text-gray-900'}`}>
        {formatCurrency(amount, currency)}
      </p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  )
}

function SubscriptionItem({
  subscription,
  onDelete,
}: {
  subscription: Subscription
  onDelete: () => void
}) {
  const renewalDate = new Date(subscription.renewalDate)
  const daysUntil = Math.ceil((renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  let statusColor = 'text-green-600 bg-green-50'
  if (daysUntil <= 1) statusColor = 'text-red-600 bg-red-50'
  else if (daysUntil <= 3) statusColor = 'text-yellow-600 bg-yellow-50'

  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-gray-900">{subscription.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {daysUntil <= 0
                ? 'Due today'
                : daysUntil === 1
                ? '1 day left'
                : `${daysUntil} days left`}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {formatCurrency(Number(subscription.price), subscription.currency || 'IDR')}
            </span>
            <span>/ {subscription.billingCycle}</span>
            <span>•</span>
            <span>💳 {subscription.cardName}</span>
            <span>•</span>
            <span>Renews: {renewalDate.toLocaleDateString()}</span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
