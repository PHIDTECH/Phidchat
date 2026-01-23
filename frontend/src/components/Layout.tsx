import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  HomeIcon,
  FilmIcon,
  WalletIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  CheckBadgeIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isPNTVOpen, setIsPNTVOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MyPlatform</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
                <HomeIcon className="w-5 h-5" />
                <span>Nyumbani</span>
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
                  <UserCircleIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              )}
              
              {/* PNTV Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsPNTVOpen(!isPNTVOpen)}
                  onBlur={() => setTimeout(() => setIsPNTVOpen(false), 200)}
                  className="text-gray-600 hover:text-primary-600 flex items-center space-x-1"
                >
                  <FilmIcon className="w-5 h-5" />
                  <span>PNTV</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                {isPNTVOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/content?category=MOVIES"
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      onClick={() => setIsPNTVOpen(false)}
                    >
                      🎬 Movies
                    </Link>
                    <Link
                      to="/content?category=SERIES"
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      onClick={() => setIsPNTVOpen(false)}
                    >
                      📺 Series
                    </Link>
                    <Link
                      to="/content?category=COMEDY"
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      onClick={() => setIsPNTVOpen(false)}
                    >
                      😂 Comedy
                    </Link>
                    <Link
                      to="/content?category=GOSPEL"
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      onClick={() => setIsPNTVOpen(false)}
                    >
                      ✨ Gospel
                    </Link>
                    <Link
                      to="/content?category=MUSIC"
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      onClick={() => setIsPNTVOpen(false)}
                    >
                      🎵 Music
                    </Link>
                  </div>
                )}
              </div>
              
              {isAuthenticated ? (
                <>
                  <Link to="/upload" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Upload</span>
                  </Link>
                  <Link to="/wallet" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
                    <WalletIcon className="w-5 h-5" />
                    <span>Wallet</span>
                  </Link>
                  <Link to={`/profile/${user?._id}`} className="flex items-center space-x-2">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    )}
                    <span className="text-gray-700">{user?.name}</span>
                    {user?.verified && <CheckBadgeIcon className="w-5 h-5 text-primary-500" />}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 flex items-center space-x-1"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Toka</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primary">
                  Ingia
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            &copy; 2024 MyPlatform. Haki zote zimehifadhiwa.
          </div>
        </div>
      </footer>
    </div>
  )
}
