import { useState } from 'react'
import { WalletIcon, ArrowDownTrayIcon, ClockIcon } from '@heroicons/react/24/outline'
import { paymentsApi } from '../api/payments'
import { useAuthStore } from '../store/authStore'

export default function WalletCard() {
  const { user } = useAuthStore()
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawPhone, setWithdrawPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount)
    if (!amount || amount < 5000) {
      setMessage('Kiasi cha chini ni TZS 5,000')
      return
    }

    if (user && amount > user.wallet.balance) {
      setMessage('Salio haitoshi')
      return
    }

    setLoading(true)
    try {
      const response = await paymentsApi.requestWithdrawal({
        amount,
        phone: withdrawPhone
      })
      setMessage(response.message)
      setShowWithdraw(false)
      setWithdrawAmount('')
      setWithdrawPhone('')
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Hitilafu imetokea')
    }
    setLoading(false)
  }

  return (
    <div className="card bg-gradient-to-r from-primary-600 to-accent-600 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <WalletIcon className="w-8 h-8" />
          <span className="text-lg font-medium">Akaunti Yangu</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-white/70 text-sm mb-1">Salio Lako</p>
        <p className="text-4xl font-bold">
          {user?.wallet.balance.toLocaleString() || 0} <span className="text-xl">TZS</span>
        </p>
      </div>

      {!showWithdraw ? (
        <div className="flex space-x-3">
          <button
            onClick={() => setShowWithdraw(true)}
            className="flex-1 bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>Toa Pesa</span>
          </button>
          <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <ClockIcon className="w-5 h-5" />
            <span>Historia</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Kiasi (TZS)"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 rounded-lg placeholder-white/60 outline-none"
          />
          <input
            type="tel"
            placeholder="Namba ya simu"
            value={withdrawPhone}
            onChange={(e) => setWithdrawPhone(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 rounded-lg placeholder-white/60 outline-none"
          />
          <div className="flex space-x-3">
            <button
              onClick={() => setShowWithdraw(false)}
              className="flex-1 bg-white/20 py-2 px-4 rounded-lg"
            >
              Ghairi
            </button>
            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="flex-1 bg-white text-primary-600 py-2 px-4 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? 'Inaendelea...' : 'Toa'}
            </button>
          </div>
        </div>
      )}

      {message && (
        <p className="mt-3 text-sm bg-white/20 p-2 rounded">{message}</p>
      )}
    </div>
  )
}
