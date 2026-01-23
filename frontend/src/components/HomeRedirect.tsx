import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Home from '../pages/Home'

export default function HomeRedirect() {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <Home />
}
