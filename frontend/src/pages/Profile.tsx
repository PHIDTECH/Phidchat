import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import { contentApi } from '../api/content'
import ContentCard from '../components/ContentCard'
import { CheckBadgeIcon, UserGroupIcon, FilmIcon } from '@heroicons/react/24/solid'

export default function Profile() {
  const { id } = useParams<{ id: string }>()

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await api.get(`/users/${id}`)
      return response.data
    },
    enabled: !!id
  })

  const { data: contents, isLoading: contentsLoading } = useQuery({
    queryKey: ['user-contents', id],
    queryFn: () => contentApi.getByCreator(id!),
    enabled: !!id
  })

  if (userLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
        <div className="flex items-end -mt-16 ml-6">
          <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Mtumiaji hapatikani</p>
      </div>
    )
  }

  return (
    <div>
      {/* Cover Photo */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary-400 to-accent-400 rounded-xl relative overflow-hidden">
        {user.coverPhoto && (
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gray-100 overflow-hidden">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 md:mb-4 flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {user.name}
              </h1>
              {user.verified && (
                <CheckBadgeIcon className="w-6 h-6 text-primary-500" />
              )}
            </div>
            {user.bio && (
              <p className="text-gray-600 mt-1">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex space-x-6 mt-6 pb-6 border-b">
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="w-5 h-5 text-gray-400" />
            <span className="font-semibold">{user.followers?.length || 0}</span>
            <span className="text-gray-500">Followers</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="w-5 h-5 text-gray-400" />
            <span className="font-semibold">{user.following?.length || 0}</span>
            <span className="text-gray-500">Following</span>
          </div>
          {user.isCreator && contents && (
            <div className="flex items-center space-x-2">
              <FilmIcon className="w-5 h-5 text-gray-400" />
              <span className="font-semibold">{contents.length}</span>
              <span className="text-gray-500">Content</span>
            </div>
          )}
        </div>
      </div>

      {/* User's Content */}
      {user.isCreator && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Content</h2>
          
          {contentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                </div>
              ))}
            </div>
          ) : contents && contents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contents.map((content) => (
                <ContentCard key={content._id} content={content} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Hakuna content kwa sasa
            </div>
          )}
        </div>
      )}
    </div>
  )
}
