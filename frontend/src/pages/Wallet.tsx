import { useQuery } from '@tanstack/react-query'
import { paymentsApi } from '../api/payments'
import WalletCard from '../components/WalletCard'
import { ArrowUpIcon, ArrowDownIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid'

export default function Wallet() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: paymentsApi.getTransactions
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'FAILED':
      case 'CANCELLED':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    if (type === 'WITHDRAWAL' || type === 'CONTENT_PURCHASE') {
      return <ArrowUpIcon className="w-4 h-4 text-red-500" />
    }
    return <ArrowDownIcon className="w-4 h-4 text-green-500" />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Wallet</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <WalletCard />
        
        <div className="card">
          <h3 className="font-semibold mb-4">Muhtasari</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Mapato ya Mwezi</span>
              <span className="font-medium text-green-600">+0 TZS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Matumizi ya Mwezi</span>
              <span className="font-medium text-red-600">-0 TZS</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-500">Transactions</span>
              <span className="font-medium">{transactions?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <h3 className="font-semibold mb-4">Historia ya Malipo</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {getTypeIcon(tx.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {tx.type === 'VERIFICATION' && 'Uthibitisho wa Akaunti'}
                      {tx.type === 'CONTENT_PURCHASE' && 'Ununuzi wa Content'}
                      {tx.type === 'WITHDRAWAL' && 'Kutoa Pesa'}
                      {tx.type === 'DEPOSIT' && 'Kuweka Pesa'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString('sw-TZ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`font-semibold ${
                    tx.type === 'WITHDRAWAL' || tx.type === 'CONTENT_PURCHASE' 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {tx.type === 'WITHDRAWAL' || tx.type === 'CONTENT_PURCHASE' ? '-' : '+'}
                    {tx.amount.toLocaleString()} TZS
                  </span>
                  {getStatusIcon(tx.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Hakuna historia ya malipo
          </div>
        )}
      </div>
    </div>
  )
}
