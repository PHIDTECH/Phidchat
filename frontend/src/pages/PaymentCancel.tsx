import { Link } from 'react-router-dom'
import { XCircleIcon } from '@heroicons/react/24/solid'

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="card py-12">
          <XCircleIcon className="w-24 h-24 mx-auto text-red-500 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Malipo Yameghairiwa
          </h1>
          <p className="text-gray-600 mb-6">
            Malipo yako hayakukamilika. Unaweza kujaribu tena au kurudi nyumbani.
          </p>

          <div className="flex flex-col space-y-3">
            <Link to="/content" className="btn-primary">
              Jaribu Tena
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
