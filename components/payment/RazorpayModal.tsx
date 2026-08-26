'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { MembershipPlan, BillingInterval } from '@/types/membership';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { paymentService } from '@/services/paymentService';
import { PaymentTransaction } from '@/types/payment';
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  Smartphone,
  Building,
  Lock,
} from 'lucide-react';

export interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
  initialBillingInterval?: BillingInterval;
  onPaymentSuccess: (transaction: PaymentTransaction) => void;
}

export function RazorpayModal({
  isOpen,
  onClose,
  plan,
  initialBillingInterval = 'monthly',
  onPaymentSuccess,
}: RazorpayModalProps) {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(initialBillingInterval);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!plan) return null;

  const price = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const gstAmount = Math.round(price * 0.18); // 18% GST standard in India
  const totalAmount = price + gstAmount;

  const handlePay = async () => {
    if (!user) {
      error('Authentication Required', 'Please log in to complete your membership subscription.');
      return;
    }

    setIsProcessing(true);
    try {
      // Step 1: Create Order
      const orderRes = await paymentService.createRazorpayOrder(totalAmount, `rcpt_${Date.now()}`);

      // Step 2: Simulate Razorpay Gateway authorization & Backend Signature Verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const verificationPayload = {
        razorpay_order_id: orderRes.data.id,
        razorpay_payment_id: `pay_ironforge_${Date.now()}`,
        razorpay_signature: `sig_mock_${Math.random().toString(36).substring(2)}`,
        planId: plan.id,
        billingInterval,
        userId: user.id,
      };

      const verifyRes = await paymentService.verifyPayment(verificationPayload, {
        name: user.name,
        email: user.email,
      });

      success('Payment Verified!', `Welcome to the ${plan.name} Tier!`);
      onPaymentSuccess(verifyRes.data);
      onClose();
    } catch (err: unknown) {
      const errMsg = err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Transaction could not be completed.';
      error('Payment Failed', errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Secure Checkout"
      description={`Activate your IRONFORGE ${plan.name} Membership`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Plan summary badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-forge-850 to-forge-900 border border-brand-red/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-heading text-white">{plan.name} Plan</span>
              {plan.isPopular && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-red text-white uppercase">
                  Most Popular
                </span>
              )}
            </div>
            <p className="text-xs text-forge-400 mt-0.5">{plan.tagline}</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold text-brand-orange font-heading">
              {formatINR(price)}
            </span>
            <span className="text-[10px] text-forge-400 block">/{billingInterval === 'yearly' ? 'year' : 'mo'}</span>
          </div>
        </div>

        {/* Billing Interval Switcher */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forge-300 font-heading mb-2">
            Billing Frequency
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setBillingInterval('monthly')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                billingInterval === 'monthly'
                  ? 'border-brand-red bg-brand-red/10 text-white'
                  : 'border-forge-800 bg-forge-950/60 text-forge-400 hover:border-forge-700'
              }`}
            >
              <p className="text-sm font-bold font-heading">Monthly</p>
              <p className="text-xs text-forge-400">{formatINR(plan.monthlyPrice)} / month</p>
            </button>

            <button
              type="button"
              onClick={() => setBillingInterval('yearly')}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                billingInterval === 'yearly'
                  ? 'border-brand-red bg-brand-red/10 text-white'
                  : 'border-forge-800 bg-forge-950/60 text-forge-400 hover:border-forge-700'
              }`}
            >
              <span className="absolute top-1 right-2 px-1.5 py-0.2 text-[9px] font-bold bg-emerald-500 text-black rounded uppercase">
                Save 20%
              </span>
              <p className="text-sm font-bold font-heading">Annual Plan</p>
              <p className="text-xs text-forge-400">{formatINR(plan.yearlyPrice)} / year</p>
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forge-300 font-heading mb-2">
            Payment Mode (Razorpay Powered)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('UPI')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                paymentMethod === 'UPI'
                  ? 'border-brand-orange bg-brand-orange/10 text-white'
                  : 'border-forge-800 bg-forge-950 text-forge-400 hover:border-forge-700'
              }`}
            >
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold font-heading">UPI / GPay</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('Card')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                paymentMethod === 'Card'
                  ? 'border-brand-orange bg-brand-orange/10 text-white'
                  : 'border-forge-800 bg-forge-950 text-forge-400 hover:border-forge-700'
              }`}
            >
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-bold font-heading">Credit / Debit</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('NetBanking')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                paymentMethod === 'NetBanking'
                  ? 'border-brand-orange bg-brand-orange/10 text-white'
                  : 'border-forge-800 bg-forge-950 text-forge-400 hover:border-forge-700'
              }`}
            >
              <Building className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-bold font-heading">NetBanking</span>
            </button>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="p-4 rounded-2xl bg-forge-950 border border-forge-850 space-y-2 text-xs">
          <div className="flex justify-between text-forge-400">
            <span>Base Subscription ({billingInterval})</span>
            <span>{formatINR(price)}</span>
          </div>
          <div className="flex justify-between text-forge-400">
            <span>Govt. Taxes & GST (18%)</span>
            <span>{formatINR(gstAmount)}</span>
          </div>
          <div className="pt-2 border-t border-forge-800 flex justify-between text-sm font-bold text-white font-heading">
            <span>Total Payable</span>
            <span className="text-brand-orange text-base">{formatINR(totalAmount)}</span>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-forge-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit SSL Encrypted • Powered by Razorpay</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={handlePay}
          isLoading={isProcessing}
          size="lg"
          className="w-full"
        >
          Pay {formatINR(totalAmount)} & Activate
        </Button>
      </div>
    </Modal>
  );
}
