import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'
import {
  UserGroupIcon,
  UserPlusIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  HomeIcon,
  FilmIcon,
  ShoppingBagIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { HeartIcon, ChatBubbleOvalLeftIcon, ShareIcon } from '@heroicons/react/24/solid'
import axios from 'axios'

interface User {
  _id: string
  name: string
  email: string
  profilePicture?: string
  verified?: boolean
  isOnline?: boolean
}

interface Post {
  _id: string
  author: User
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

export default function Dashboard() {
  const { user } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [postText, setPostText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
    fetchPosts()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/search')
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/posts/feed', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPosts(response.data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const createPost = async () => {
    if (!postText.trim()) return
    
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/posts', {
        content: { text: postText },
        visibility: 'public'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPostText('')
      fetchPosts()
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
      fetchPosts()
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PhidChat</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <BellIcon className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <ChatBubbleLeftIcon className="w-6 h-6 text-gray-600" />
              </button>
              <Link to={`/profile/${user?._id}`}>
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-14 flex">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 h-screen bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 space-y-2">
            <Link to="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              <HomeIcon className="w-6 h-6 text-blue-500" />
              <span className="font-medium">Home</span>
            </Link>
            <Link to="/friends" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              <UserGroupIcon className="w-6 h-6 text-blue-500" />
              <span className="font-medium">Friends</span>
            </Link>
            <Link to="/messages" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              <ChatBubbleLeftIcon className="w-6 h-6 text-blue-500" />
              <span className="font-medium">Messages</span>
            </Link>
            <Link to="/content" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              <FilmIcon className="w-6 h-6 text-blue-500" />
              <span className="font-medium">PNTV</span>
            </Link>
            <Link to="/wallet" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              <ShoppingBagIcon className="w-6 h-6 text-blue-500" />
              <span className="font-medium">Wallet</span>
            </Link>
            <Link to="/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              <Cog6ToothIcon className="w-6 h-6 text-blue-500" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4 px-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">PEOPLE ON PHIDCHAT</h3>
            <div className="space-y-2">
              {users.slice(0, 10).map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u._id}`}
                  className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-100"
                >
                  {u.profilePicture ? (
                    <img src={u.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold text-sm">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                    {u.isOnline && (
                      <span className="text-xs text-green-500">● Online</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 lg:mr-80 max-w-2xl mx-auto px-4 py-6">
          {/* Post Composer */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex items-start space-x-3">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder={`What's on your mind, ${user?.name}?`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={createPost}
                    disabled={loading || !postText.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
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
                <p className="text-gray-500">No posts yet. Be the first to share something!</p>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-80 fixed right-0 h-screen bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Friend Requests</h3>
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-500">No new friend requests</p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">People You May Know</h3>
            <div className="space-y-3">
              {users.slice(0, 5).map((u) => (
                <div key={u._id} className="flex items-center space-x-3">
                  {u.profilePicture ? (
                    <img src={u.profilePicture} alt="" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${u._id}`} className="text-sm font-medium text-gray-900 hover:underline truncate block">
                      {u.name}
                    </Link>
                    <button className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center">
                      <UserPlusIcon className="w-4 h-4 mr-1" />
                      Add Friend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
