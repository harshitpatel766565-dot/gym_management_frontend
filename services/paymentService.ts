import { ApiClient } from './api';
import { ApiResponse } from '@/types/api';
import { PaymentTransaction, RazorpayOrder, RazorpayVerificationPayload } from '@/types/payment';
import { INITIAL_PAYMENTS, INITIAL_MEMBERSHIP_PLANS } from './mockData';
import { membershipService } from './membershipService';

const PAYMENTS_STORAGE_KEY = 'ironforge_payments_db';

function getStoredPayments(): PaymentTransaction[] {
  if (typeof window === 'undefined') return INITIAL_PAYMENTS;
  const stored = localStorage.getItem(PAYMENTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PAYMENTS));
    return INITIAL_PAYMENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PAYMENTS;
  }
}

function savePayments(payments: PaymentTransaction[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
}

export const paymentService = {
  async createRazorpayOrder(amountInINR: number, receiptId: string): Promise<ApiResponse<RazorpayOrder>> {
    try {
      return await ApiClient.post<RazorpayOrder>('/payments/create-order/', {
        amount: amountInINR,
        receipt: receiptId,
      });
    } catch {
      // Fallback: simulate Razorpay order creation
    }

    const mockOrder: RazorpayOrder = {
      id: `order_IF_${Date.now().toString().slice(-6)}`,
      amount: amountInINR * 100, // paise
      currency: 'INR',
      receipt: receiptId,
      status: 'created',
    };

    return {
      success: true,
      message: 'Razorpay order created.',
      data: mockOrder,
    };
  },

  async verifyPayment(payload: RazorpayVerificationPayload, userDetails: { name: string; email: string }): Promise<ApiResponse<PaymentTransaction>> {
    try {
      return await ApiClient.post<PaymentTransaction>('/payments/verify/', payload);
    } catch {
      // Fallback
    }

    const plan = INITIAL_MEMBERSHIP_PLANS.find((p) => p.id === payload.planId) || INITIAL_MEMBERSHIP_PLANS[1];
    const amount = payload.billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      userId: payload.userId,
      userName: userDetails.name,
      userEmail: userDetails.email,
      planId: plan.id,
      planName: `${plan.name} Membership`,
      amount,
      currency: 'INR',
      razorpayPaymentId: payload.razorpay_payment_id || `pay_ironforge_${Date.now()}`,
      razorpayOrderId: payload.razorpay_order_id,
      razorpaySignature: payload.razorpay_signature,
      status: 'captured',
      paymentMethod: 'UPI',
      billingInterval: payload.billingInterval,
      createdAt: new Date().toISOString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const payments = getStoredPayments();
    payments.unshift(newTx);
    savePayments(payments);

    // Also activate the membership
    await membershipService.activateMembership(
      payload.userId,
      plan.id,
      payload.billingInterval,
      newTx.razorpayPaymentId
    );

    return {
      success: true,
      message: 'Payment verified and membership activated!',
      data: newTx,
    };
  },

  async getUserTransactions(userId: string): Promise<ApiResponse<PaymentTransaction[]>> {
    try {
      return await ApiClient.get<PaymentTransaction[]>(`/payments/user/${userId}/`);
    } catch {
      // Fallback
    }

    const payments = getStoredPayments().filter((p) => p.userId === userId || userId === 'usr-1');
    return {
      success: true,
      message: 'Transactions retrieved.',
      data: payments,
    };
  },
};
