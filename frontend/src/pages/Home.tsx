import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { contentApi } from '../api/content'
import ContentCard from '../components/ContentCard'
import { FilmIcon, MusicalNoteIcon, FaceSmileIcon, SparklesIcon } from '@heroicons/react/24/outline'

const categories = [
  { name: 'Movies', value: 'MOVIE', icon: FilmIcon, color: 'bg-blue-500' },
  { name: 'Series', value: 'SERIES', icon: FilmIcon, color: 'bg-purple-500' },
  { name: 'Comedy', value: 'COMEDY', icon: FaceSmileIcon, color: 'bg-yellow-500' },
  { name: 'Gospel', value: 'GOSPEL', icon: SparklesIcon, color: 'bg-pink-500' },
  { name: 'Music', value: 'MUSIC', icon: MusicalNoteIcon, color: 'bg-green-500' },
]

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['content', 'home'],
    queryFn: () => contentApi.getAll({ limit: 12 })
  })

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Karibu MyPlatform
        </h1>
        <p className="text-lg text-white/80 mb-6 max-w-2xl">
          Gundua na ununue content bora za Kitanzania - Movies, Series, Comedy, Gospel na Music.
          Wasanii wetu wanapata malipo yao moja kwa moja!
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/content" className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Tazama Content
          </Link>
          <Link to="/register" className="bg-white/20 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
            Jiunge Sasa
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/content?category=${cat.value}`}
              className="card flex flex-col items-center py-6 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${cat.color} rounded-full flex items-center justify-center mb-3`}>
                <cat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Content Mpya</h2>
          <Link to="/content" className="text-primary-600 hover:text-primary-700 font-medium">
            Tazama Zote →
          </Link>
        </div>

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.contents.map((content) => (
              <ContentCard key={content._id} content={content} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
