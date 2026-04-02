import Link from 'next/link'
import { Navbar } from '@/components/navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Never Forget a Subscription Renewal
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Track all your subscriptions in one place. Get Telegram reminders 
              2 days and 1 day before renewal so you can decide whether to continue or cancel.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📊"
              title="Track Spending"
              description="See all your subscriptions and total monthly/yearly spending at a glance."
            />
            <FeatureCard
              icon="🔔"
              title="Smart Reminders"
              description="Get Telegram notifications 2 days and 1 day before each renewal."
            />
            <FeatureCard
              icon="💳"
              title="Card Tracking"
              description="Know which card is charged for each subscription."
            />
          </div>
        </div>
      </main>
    </>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
