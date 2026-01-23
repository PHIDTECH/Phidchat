import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Content from './pages/Content'
import ContentDetail from './pages/ContentDetail'
import Wallet from './pages/Wallet'
import Upload from './pages/Upload'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/content" element={<Content />} />
        <Route path="/content/:id" element={<ContentDetail />} />
        <Route path="/profile/:id" element={<Profile />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
