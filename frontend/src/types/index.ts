export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  coverPhoto?: string;
  bio?: string;
  verified: boolean;
  verifiedAt?: string;
  wallet: {
    balance: number;
    currency: string;
  };
  isCreator: boolean;
  creatorType?: string[];
  totalEarnings: number;
  followers: string[];
  following: string[];
  createdAt: string;
}

export interface Content {
  _id: string;
  title: string;
  description: string;
  category: 'MOVIE' | 'SERIES' | 'COMEDY' | 'GOSPEL' | 'MUSIC';
  creatorId: string;
  creator?: User;
  thumbnailUrl: string;
  videoUrl?: string;
  audioUrl?: string;
  duration: number;
  price: number;
  currency: string;
  views: number;
  purchases: number;
  totalEarnings: number;
  seasonNumber?: number;
  episodeNumber?: number;
  seriesId?: string;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  orderId: string;
  type: 'VERIFICATION' | 'CONTENT_PURCHASE' | 'WITHDRAWAL' | 'DEPOSIT';
  amount: number;
  currency: string;
  contentId?: string;
  creatorId?: string;
  commission?: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl: string;
  orderId: string;
}
