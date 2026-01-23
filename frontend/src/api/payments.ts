import api from './axios'
import { PaymentResponse, Transaction } from '../types'

export const paymentsApi = {
  buyContent: async (data: {
    contentId: string;
    creatorId: string;
    amount: number;
    phone: string;
  }): Promise<PaymentResponse> => {
    const response = await api.post('/payments/buy-content', data)
    return response.data
  },

  verifyAccount: async (phone: string): Promise<PaymentResponse> => {
    const response = await api.post('/payments/verification-payment', { phone })
    return response.data
  },

  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get('/payments/transactions')
    return response.data
  },

  requestWithdrawal: async (data: {
    amount: number;
    phone: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/payments/withdraw', data)
    return response.data
  },

  getWalletBalance: async (): Promise<{
    balance: number;
    currency: string;
    pendingWithdrawals: number;
  }> => {
    const response = await api.get('/payments/wallet')
    return response.data
  }
}
