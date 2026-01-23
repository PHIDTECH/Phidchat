import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'
import { UserPlusIcon, UserMinusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface User {
  _id: string
  name: string
  email: string
  profilePicture?: string
  verified?: boolean
  isOnline?: boolean
}

interface FriendRequest {
  _id: string
  name: string
  profilePicture?: string
  verified?: boolean
}

export default function Friends() {
  const { user } = useAuthStore()
  const [friends, setFriends] = useState<User[]>([])
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([])
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'suggestions'>('friends')

  useEffect(() => {
    fetchFriends()
    fetchFriendRequests()
    fetchSuggestions()
  }, [])

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/friends', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFriends(response.data.friends || [])
    } catch (error) {
      console.error('Error fetching friends:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/friends/requests', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReceivedRequests(response.data.received || [])
      setSentRequests(response.data.sent || [])
    } catch (error) {
      console.error('Error fetching friend requests:', error)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/friends/suggestions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuggestions(response.data.suggestions || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const sendFriendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/friends/request/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchSuggestions()
      fetchFriendRequests()
    } catch (error: any) {
      console.error('Error sending friend request:', error)
      alert(error.response?.data?.message || 'Failed to send friend request')
    }
  }

  const acceptFriendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/friends/accept/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchFriends()
      fetchFriendRequests()
    } catch (error) {
      console.error('Error accepting friend request:', error)
    }
  }

  const declineFriendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/friends/decline/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchFriendRequests()
    } catch (error) {
      console.error('Error declining friend request:', error)
    }
  }

  const unfriend = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/friends/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchFriends()
    } catch (error) {
      console.error('Error unfriending:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Marafiki</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('friends')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'friends'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600'
            }`}
          >
            Marafiki ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'requests'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600'
            }`}
          >
            Maombi ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'suggestions'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600'
            }`}
          >
            Mapendekezo ({suggestions.length})
          </button>
        </div>

        {/* Friends List */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            {friends.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">Bado huna marafiki. Tuma maombi ya urafiki!</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div key={friend._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={friend.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}`}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{friend.name}</h3>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => unfriend(friend._id)}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <UserMinusIcon className="w-5 h-5" />
                    <span>Ondoa</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Friend Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {receivedRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">Hakuna maombi ya urafiki</p>
              </div>
            ) : (
              receivedRequests.map((request) => (
                <div key={request._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={request.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.name)}`}
                      alt={request.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{request.name}</h3>
                      <p className="text-sm text-gray-500">Ametuma ombi la urafiki</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => acceptFriendRequest(request._id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <CheckIcon className="w-5 h-5" />
                      <span>Kubali</span>
                    </button>
                    <button
                      onClick={() => declineFriendRequest(request._id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <XMarkIcon className="w-5 h-5" />
                      <span>Kataa</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Suggestions */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {suggestions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">Hakuna mapendekezo kwa sasa</p>
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <div key={suggestion._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={suggestion.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(suggestion.name)}`}
                      alt={suggestion.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{suggestion.name}</h3>
                      <p className="text-sm text-gray-500">{suggestion.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => sendFriendRequest(suggestion._id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    <span>Tuma Ombi</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
