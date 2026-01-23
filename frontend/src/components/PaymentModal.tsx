import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'
import { Content } from '../types'
import { paymentsApi } from '../api/payments'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  content: Content
}

export default function PaymentModal({ isOpen, onClose, content }: PaymentModalProps) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePurchase = async () => {
    if (!phone || phone.length < 10) {
      setError('Tafadhali ingiza namba sahihi ya simu')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await paymentsApi.buyContent({
        contentId: content._id,
        creatorId: content.creatorId,
        amount: content.price,
        phone: phone
      })

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hitilafu imetokea. Jaribu tena.')
    }
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-2xl shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-semibold">
              Nunua Content
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Content Info */}
            <div className="flex space-x-4 mb-6">
              <img
                src={content.thumbnailUrl || '/placeholder.jpg'}
                alt={content.title}
                className="w-24 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-medium text-gray-900">{content.title}</h3>
                <p className="text-sm text-gray-500">{content.category}</p>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bei:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {content.price.toLocaleString()} TZS
                </span>
              </div>
            </div>

            {/* Phone Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Namba ya Simu (M-Pesa/Tigo Pesa/Airtel Money)
              </label>
              <div className="relative">
                <DevicePhoneMobileIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="0712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <button onClick={onClose} className="btn-secondary flex-1">
                Ghairi
              </button>
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Inaendelea...' : 'Lipa Sasa'}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
