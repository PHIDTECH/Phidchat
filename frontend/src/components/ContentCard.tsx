import { Link } from 'react-router-dom'
import { PlayIcon, EyeIcon, CheckBadgeIcon } from '@heroicons/react/24/solid'
import { Content } from '../types'

interface ContentCardProps {
  content: Content
}

export default function ContentCard({ content }: ContentCardProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <Link to={`/content/${content._id}`} className="group">
      <div className="card overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-md">
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
          <img
            src={content.thumbnailUrl || '/placeholder.jpg'}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <PlayIcon className="w-6 h-6 text-primary-600 ml-1" />
            </div>
          </div>
          
          {/* Duration */}
          {content.duration && (
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {formatDuration(content.duration)}
            </span>
          )}
          
          {/* Category Badge */}
          <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
            {content.category}
          </span>
        </div>

        {/* Content Info */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {content.title}
          </h3>
          
          {content.creator && (
            <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
              <span>{content.creator.name}</span>
              {content.creator.verified && (
                <CheckBadgeIcon className="w-4 h-4 text-primary-500" />
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <EyeIcon className="w-4 h-4" />
              <span>{content.views.toLocaleString()}</span>
            </div>
            <span className="text-primary-600 font-semibold">
              {content.price.toLocaleString()} TZS
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
