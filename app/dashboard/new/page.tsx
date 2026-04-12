'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'

export default function NewSubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      price: formData.get('price') as string,
      currency: formData.get('currency') as string,
      cardName: formData.get('cardName') as string,
      renewalDate: formData.get('renewalDate') as string,
      billingCycle: formData.get('billingCycle') as string,
    }

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create subscription')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  if (status === 'loading') {
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Add New Subscription
            </h1>
            <p className="text-gray-600 mb-6">
              Track a new subscription and get notified before it renews.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subscription Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="e.g., Netflix, Spotify, Adobe"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price *
                  </label>
                  <div className="relative mt-1">
                    <select
                      name="currency"
                      className="absolute left-1 top-1 bottom-1 border-r border-gray-300 bg-gray-50 text-gray-700 text-sm rounded-l px-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="IDR">Rp</option>
                      <option value="USD">$</option>
                    </select>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      step="0.01"
                      min="0"
                      required
                      placeholder="150000"
                      className="block w-full pl-20 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="billingCycle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Billing Cycle *
                  </label>
                  <select
                    id="billingCycle"
                    name="billingCycle"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="cardName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Card Name *
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  required
                  placeholder="e.g., Chase Freedom, BCA Blue"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Just the card name for your reference (no card numbers needed)
                </p>
              </div>

              <div>
                <label
                  htmlFor="renewalDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Next Renewal Date *
                </label>
                <input
                  type="date"
                  id="renewalDate"
                  name="renewalDate"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-center font-medium hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
