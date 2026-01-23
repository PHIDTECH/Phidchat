import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { contentApi } from '../api/content'
import ContentCard from '../components/ContentCard'
import { FunnelIcon } from '@heroicons/react/24/outline'

const categories = ['ALL', 'MOVIE', 'SERIES', 'COMEDY', 'GOSPEL', 'MUSIC']

export default function Content() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'ALL')

  const { data, isLoading } = useQuery({
    queryKey: ['content', selectedCategory],
    queryFn: () => contentApi.getAll({ 
      category: selectedCategory === 'ALL' ? undefined : selectedCategory,
      limit: 20
    })
  })

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === 'ALL') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', category)
    }
    setSearchParams(searchParams)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content</h1>
        <div className="flex items-center space-x-2 text-gray-500">
          <FunnelIcon className="w-5 h-5" />
          <span>Filter</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'ALL' ? 'Zote' : cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : data?.contents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Hakuna content kwa sasa</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.contents.map((content) => (
            <ContentCard key={content._id} content={content} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {[...Array(data.pages)].map((_, i) => (
            <button
              key={i}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 font-medium"
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
