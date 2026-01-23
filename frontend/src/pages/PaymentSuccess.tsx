import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')

  useEffect(() => {
    // You could verify the payment here if needed
  }, [orderId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="card py-12">
          <CheckCircleIcon className="w-24 h-24 mx-auto text-green-500 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Malipo Yamefanikiwa!
          </h1>
          <p className="text-gray-600 mb-6">
            Asante kwa ununuzi wako. Content sasa inapatikana kwako.
          </p>
          
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Order ID: {orderId}
            </p>
          )}

          <div className="flex flex-col space-y-3">
            <Link to="/content" className="btn-primary">
              Tazama Content
            </Link>
            <Link to="/" className="btn-secondary">
              Rudi Nyumbani
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
