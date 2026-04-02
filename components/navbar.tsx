'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-600">
              📅 SubsRemind
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-600 text-sm">
                  {session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
