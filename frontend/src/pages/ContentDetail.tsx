import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { contentApi } from '../api/content'
import { useAuthStore } from '../store/authStore'
import PaymentModal from '../components/PaymentModal'
import { PlayIcon, ClockIcon, EyeIcon, CheckBadgeIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'

export default function ContentDetail() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuthStore()
  const [showPayment, setShowPayment] = useState(false)

  const { data: content, isLoading } = useQuery({
    queryKey: ['content', id],
    queryFn: () => contentApi.getById(id!),
    enabled: !!id
  })

  const { data: accessData } = useQuery({
    queryKey: ['content-access', id],
    queryFn: () => contentApi.checkAccess(id!),
    enabled: !!id && isAuthenticated
  })

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes} dakika`
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-video bg-gray-200 rounded-xl mb-6"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Content haipatikani</p>
      </div>
    )
  }

  const hasAccess = accessData?.hasAccess

  return (
    <div>
      {/* Video Preview */}
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-6">
        <img
          src={content.thumbnailUrl || '/placeholder.jpg'}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        
        {!hasAccess && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <ShoppingCartIcon className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <p className="text-lg mb-4">Nunua ili utazame</p>
              <button
                onClick={() => setShowPayment(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2"
              >
                <span>Nunua - {content.price.toLocaleString()} TZS</span>
              </button>
            </div>
          </div>
        )}
        
        {hasAccess && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <PlayIcon className="w-10 h-10 text-primary-600 ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-block bg-primary-100 text-primary-600 text-sm px-3 py-1 rounded-full mb-2">
                {content.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {content.title}
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 text-gray-500 mb-6">
            {content.duration && (
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-5 h-5" />
                <span>{formatDuration(content.duration)}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <EyeIcon className="w-5 h-5" />
              <span>{content.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-2">Maelezo</h3>
            <p className="text-gray-600">{content.description || 'Hakuna maelezo'}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Creator Info */}
          {content.creator && (
            <div className="card mb-4">
              <h3 className="font-semibold mb-3">Mtengenezaji</h3>
              <div className="flex items-center space-x-3">
                <img
                  src={content.creator.profilePicture || '/default-avatar.png'}
                  alt={content.creator.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{content.creator.name}</span>
                    {content.creator.verified && (
                      <CheckBadgeIcon className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">Creator</span>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Card */}
          {!hasAccess && (
            <div className="card bg-gradient-to-br from-primary-50 to-accent-50">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Bei</p>
                <p className="text-3xl font-bold text-primary-600 mb-4">
                  {content.price.toLocaleString()} TZS
                </p>
                <button
                  onClick={() => setShowPayment(true)}
                  className="btn-primary w-full"
                >
                  Nunua Sasa
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          content={content}
        />
      )}
    </div>
  )
}
