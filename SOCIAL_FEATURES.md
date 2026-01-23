# Social Media Features Documentation

## Overview
This platform combines social networking features (like Facebook) with a content marketplace for creators to sell movies, series, comedy, gospel music, and other digital content.

## Core Social Features

### 1. Posts & Newsfeed
- Create text, image, and video posts
- Like/React to posts (like, love, haha, wow, sad, angry)
- Comment on posts with nested replies
- Share posts
- Hashtags support (#trending)
- Mention users (@username)
- Edit/delete own posts
- Privacy settings (public, friends, private)
- View count tracking

### 2. Friends System
- Send/accept/decline friend requests
- Unfriend users
- View friends list
- Friend suggestions based on mutual friends
- Block/unblock users
- Friend request notifications

### 3. Messaging
- Direct one-on-one messaging
- Group chats (coming soon)
- Real-time message delivery
- Read receipts
- Typing indicators
- Message history
- Unread message count
- Delete messages

### 4. Notifications
- Real-time notifications for:
  - Friend requests
  - Friend accepts
  - Post likes/reactions
  - Comments on posts
  - Comment replies
  - Comment likes
  - Post shares
  - Mentions
  - New messages
  - Content purchases
- Mark as read/unread
- Delete notifications
- Unread count badge

### 5. User Profiles
- Profile picture & cover photo
- Bio and personal information
- Location, website, date of birth
- Privacy settings
- Online/offline status
- Last active timestamp
- View user's posts
- Friends list (with privacy controls)

### 6. Real-Time Features (Socket.io)
- Online/offline status
- Typing indicators in chat
- Live notifications
- Real-time message delivery
- Friend online/offline notifications

### 7. Content Marketplace Integration
- Creators can sell digital content
- Categories: Movies, Series, Comedy, Gospel, Music
- Integrated wallet system
- Selcom payment gateway
- 15% platform commission
- Withdrawal system

### 8. Privacy & Security
- Profile visibility (public/friends/private)
- Post visibility controls
- Friend list visibility
- Message privacy settings
- Block users
- Report content (coming soon)
- Account status management

### 9. Search & Discovery
- Search users
- Search posts by hashtags
- Trending content (coming soon)
- Suggested friends
- Explore page (coming soon)

## API Endpoints

### Posts
- `GET /api/posts/feed` - Get newsfeed
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/react to post
- `DELETE /api/posts/:id/like` - Unlike post
- `POST /api/posts/:id/share` - Share post
- `GET /api/posts/user/:userId` - Get user's posts

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like comment
- `DELETE /api/comments/:id/like` - Unlike comment

### Friends
- `POST /api/friends/request/:userId` - Send friend request
- `POST /api/friends/accept/:userId` - Accept friend request
- `POST /api/friends/decline/:userId` - Decline friend request
- `DELETE /api/friends/:userId` - Unfriend
- `GET /api/friends` - Get friends list
- `GET /api/friends/requests` - Get friend requests
- `GET /api/friends/suggestions` - Get friend suggestions
- `POST /api/friends/block/:userId` - Block user
- `DELETE /api/friends/block/:userId` - Unblock user

### Messages
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages/conversations` - Create/get conversation
- `GET /api/messages/conversations/:id/messages` - Get messages
- `POST /api/messages/conversations/:id/messages` - Send message
- `DELETE /api/messages/messages/:id` - Delete message
- `GET /api/messages/unread-count` - Get unread count

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread count

### Content Marketplace
- `GET /api/content` - Browse content
- `GET /api/content/:id` - Get content details
- `POST /api/content` - Upload content (creators)
- `POST /api/payments/buy-content` - Purchase content
- `GET /api/payments/wallet` - Get wallet balance
- `POST /api/payments/withdraw` - Request withdrawal

## Socket.io Events

### Client → Server
- `user:online` - User comes online
- `conversation:join` - Join conversation room
- `conversation:leave` - Leave conversation room
- `typing:start` - Start typing
- `typing:stop` - Stop typing
- `message:send` - Send message
- `message:read` - Mark message as read
- `notification:send` - Send notification

### Server → Client
- `friend:online` - Friend comes online
- `friend:offline` - Friend goes offline
- `typing:start` - User is typing
- `typing:stop` - User stopped typing
- `message:new` - New message received
- `message:read` - Message was read
- `notification:new` - New notification

## Database Models

### User
- Basic info (name, email, phone, password)
- OAuth support (Google, Facebook)
- Profile (picture, cover, bio, location)
- Friends & requests
- Privacy settings
- Notification preferences
- Account status
- Online status
- Creator info & wallet

### Post
- Author, content (text, images, videos)
- Visibility, hashtags, mentions
- Likes/reactions, comments, shares
- Engagement metrics
- Edit history
- Status & reports

### Comment
- Post, author, content
- Parent comment (for replies)
- Likes, mentions
- Edit tracking

### Message
- Conversation, sender, content
- Message type (text, image, video)
- Read/delivered status
- Reply to message

### Conversation
- Participants
- Group info (if group chat)
- Last message
- Unread counts
- Muted/archived status

### Notification
- Recipient, sender, type
- Related content (post, comment, etc.)
- Read status

## Future Enhancements
- Stories (24-hour posts)
- Live streaming
- Video calls
- Advanced feed algorithm
- Trending hashtags
- User verification badges
- Admin moderation panel
- Content reporting system
- Multi-language support
- Mobile app (React Native)

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Socket.io
- **Frontend:** React, TypeScript, Tailwind CSS, Zustand
- **Real-time:** Socket.io
- **Payment:** Selcom Gateway
- **Media:** Cloudinary (for images/videos)
- **Authentication:** JWT + OAuth
