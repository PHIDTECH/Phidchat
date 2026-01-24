import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'
import { contentApi } from '../api/content'
import ContentCard from '../components/ContentCard'
import { CheckBadgeIcon, UserGroupIcon, FilmIcon } from '@heroicons/react/24/solid'
import { HeartIcon, ChatBubbleOvalLeftIcon, ShareIcon } from '@heroicons/react/24/solid'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, GlobeAltIcon, PencilIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { Link } from 'react-router-dom'

interface Post {
  _id: string
  author: {
    _id: string
    name: string
    profilePicture?: string
  }
  content: {
    text: string
    images?: Array<{ url: string }>
  }
  likes: Array<{ user: string; reaction: string }>
  comments: any[]
  shares: any[]
  engagement: {
    likeCount: number
    commentCount: number
    shareCount: number
  }
  createdAt: string
}

export default function Profile() {
  const { id } = useParams<{ id: string }>()
  const { user: currentUser } = useAuthStore()
  const [postText, setPostText] = useState('')
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const isOwnProfile = currentUser?._id === id

  const { data: user, isLoading: userLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      console.log('Fetching user with ID:', id)
      const response = await api.get(`/users/${id}`)
      console.log('User data received:', response.data)
      return response.data
    },
    enabled: !!id,
    retry: 1
  })

  useEffect(() => {
    console.log('Profile component - User ID:', id)
    console.log('Profile component - Current User:', currentUser)
    console.log('Profile component - Fetched User:', user)
    console.log('Profile component - Error:', error)
  }, [id, currentUser, user, error])

  const { data: contents, isLoading: contentsLoading } = useQuery({
    queryKey: ['user-contents', id],
    queryFn: () => contentApi.getByCreator(id!),
    enabled: !!id
  })

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`/api/posts/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPosts(response.data.posts || [])
    } catch (error) {
      console.error('Error fetching user posts:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
    
    const urls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setPreviewUrls(newUrls)
  }

  const createPost = async () => {
    if (!postText.trim() && selectedFiles.length === 0) return
    
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('text', postText)
      formData.append('visibility', 'public')
      
      selectedFiles.forEach((file) => {
        formData.append('media', file)
      })

      await axios.post('/api/posts', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setPostText('')
      setSelectedFiles([])
      setPreviewUrls([])
      fetchUserPosts()
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  const likePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/posts/${postId}/like`, {
        reaction: 'like'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchUserPosts()
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchUserPosts()
    }
  }, [id])

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

  if (!user && !userLoading) {
    const { logout } = useAuthStore()
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">Mtumiaji hapatikani</p>
        <p className="text-sm text-gray-400 mb-4">User ID: {id}</p>
        {isOwnProfile && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Kuna tatizo na akaunti yako. Tafadhali ingia tena.</p>
            <button
              onClick={() => {
                logout()
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = '/login'
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Ingia Tena
            </button>
          </div>
        )}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {user.name}
                </h1>
                {user.verified && (
                  <CheckBadgeIcon className="w-6 h-6 text-primary-500" />
                )}
              </div>
              {isOwnProfile && (
                <Link to="/edit-profile" className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Link>
              )}
            </div>
            {user.bio && (
              <p className="text-gray-600 mt-2">{user.bio}</p>
            )}
            
            {/* Contact Details */}
            <div className="mt-3 space-y-2">
              {user.email && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <PhoneIcon className="w-4 h-4" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}
              {user.location && (user.location.city || user.location.country) && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-sm">
                    {[user.location.city, user.location.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <GlobeAltIcon className="w-4 h-4" />
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                    {user.website}
                  </a>
                </div>
              )}
            </div>
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

      {/* Post Composer - Only show on own profile */}
      {isOwnProfile && user && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex items-start space-x-3">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder={`What's on your mind, ${user.name}?`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                
                {/* Image/Video Previews */}
                {previewUrls.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        {selectedFiles[index].type.startsWith('video/') ? (
                          <video src={url} className="w-full h-32 object-cover rounded-lg" controls />
                        ) : (
                          <img src={url} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Photo/Video</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button
                    onClick={createPost}
                    disabled={loading || (!postText.trim() && selectedFiles.length === 0)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User's Posts */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Posts</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow">
              {/* Post Header */}
              <div className="p-4 flex items-center space-x-3">
                {post.author?.profilePicture ? (
                  <img src={post.author.profilePicture} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                    {post.author?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <Link to={`/profile/${post.author?._id}`} className="font-semibold text-gray-900 hover:underline">
                    {post.author?.name}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-gray-800 whitespace-pre-wrap">{post.content?.text}</p>
                {post.content?.images && post.content.images.length > 0 && (
                  <div className="mt-3">
                    <img src={post.content.images[0].url} alt="" className="w-full rounded-lg" />
                  </div>
                )}
              </div>

              {/* Post Stats */}
              <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                <span>{post.engagement?.likeCount || 0} likes</span>
                <div className="flex space-x-4">
                  <span>{post.engagement?.commentCount || 0} comments</span>
                  <span>{post.engagement?.shareCount || 0} shares</span>
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-around">
                <button
                  onClick={() => likePost(post._id)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <HeartIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Like</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                  <ChatBubbleOvalLeftIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Comment</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                  <ShareIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Share</span>
                </button>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No posts yet.</p>
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
