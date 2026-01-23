const axios = require('axios');
const crypto = require('crypto');

class SelcomService {
  constructor() {
    this.apiKey = process.env.SELCOM_API_KEY;
    this.apiSecret = process.env.SELCOM_API_SECRET;
    this.vendorId = process.env.SELCOM_VENDOR_ID;
    this.baseURL = process.env.SELCOM_BASE_URL || 'https://apigw.selcommobile.com/v1';
  }

  generateSignature(data) {
    const signedFields = data.signed_fields.split(',');
    const signData = signedFields.map(field => `${field}=${data[field]}`).join(',');
    return crypto.createHmac('sha256', this.apiSecret)
      .update(signData)
      .digest('hex');
  }

  generateTimestamp() {
    return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  generateOrderId(prefix = 'ORD') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async createOrder(orderData) {
    const payload = {
      vendor: this.vendorId,
      order_id: orderData.orderId,
      buyer_email: orderData.email,
      buyer_name: orderData.name,
      buyer_phone: orderData.phone,
      amount: orderData.amount,
      currency: orderData.currency || 'TZS',
      no_of_items: orderData.items || 1,
      billing_address: {
        country_code: 'TZ',
        city: orderData.city || 'Dar es Salaam',
        address: orderData.address || 'N/A',
        postcode: orderData.postcode || '00000'
      },
      webhook: `${process.env.APP_URL}/api/payments/webhook`,
      redirect_url: `${process.env.APP_URL}/payment/success?order_id=${orderData.orderId}`,
      cancel_url: `${process.env.APP_URL}/payment/cancel?order_id=${orderData.orderId}`,
      signed_fields: 'vendor,order_id,buyer_email,buyer_name,buyer_phone,amount,currency'
    };

    payload.signature = this.generateSignature(payload);

    try {
      const response = await axios.post(
        `${this.baseURL}/checkout/create-order`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Digest': `SHA-256=${crypto.createHash('sha256').update(JSON.stringify(payload)).digest('base64')}`,
            'Timestamp': this.generateTimestamp()
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Selcom Create Order Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment order creation failed');
    }
  }

  async checkOrderStatus(orderId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/checkout/order-status`,
        {
          params: { order_id: orderId },
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Timestamp': this.generateTimestamp()
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Selcom Status Check Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async processCardPayment(orderData, cardDetails) {
    const payload = {
      order_id: orderData.orderId,
      buyer_uuid: orderData.buyerUuid,
      card_number: cardDetails.cardNumber,
      exp_year: cardDetails.expYear,
      exp_month: cardDetails.expMonth,
      cvv: cardDetails.cvv,
      signed_fields: 'order_id,buyer_uuid'
    };

    payload.signature = this.generateSignature(payload);

    try {
      const response = await axios.post(
        `${this.baseURL}/checkout/card-payment`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Timestamp': this.generateTimestamp()
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Selcom Card Payment Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async processMobilePayment(orderData) {
    const payload = {
      order_id: orderData.orderId,
      buyer_uuid: orderData.buyerUuid,
      payment_phone: orderData.phone,
      payment_method: orderData.method || 'MobileMoney',
      signed_fields: 'order_id,buyer_uuid,payment_phone'
    };

    payload.signature = this.generateSignature(payload);

    try {
      const response = await axios.post(
        `${this.baseURL}/checkout/wallet-payment`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Timestamp': this.generateTimestamp()
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Selcom Mobile Payment Error:', error.response?.data || error.message);
      throw error;
    }
  }

  verifyWebhook(payload, receivedSignature) {
    if (!payload.signed_fields) return false;
    const calculatedSignature = this.generateSignature(payload);
    return calculatedSignature === receivedSignature;
  }

  async cancelOrder(orderId) {
    try {
      const response = await axios.post(
        `${this.baseURL}/checkout/cancel-order`,
        { order_id: orderId },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Timestamp': this.generateTimestamp()
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Selcom Cancel Order Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new SelcomService();
