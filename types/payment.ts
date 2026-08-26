export type PaymentStatus = 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';

export interface RazorpayOrder {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId?: string;
  planName: string;
  amount: number; // in INR
  currency: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature?: string;
  status: PaymentStatus;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet';
  billingInterval: 'monthly' | 'yearly';
  createdAt: string;
  invoiceNumber: string;
}

export interface RazorpayVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  planId: string;
  billingInterval: 'monthly' | 'yearly';
  userId: string;
}
