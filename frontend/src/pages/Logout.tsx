import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Logout() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  useEffect(() => {
    // Clear all storage
    logout()
    localStorage.clear()
    sessionStorage.clear()
    
    // Redirect to login after a brief moment
    setTimeout(() => {
      navigate('/login')
    }, 500)
  }, [logout, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  )
}
