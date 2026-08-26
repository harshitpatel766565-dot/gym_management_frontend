'use client';

import React, { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { PaymentTransaction } from '@/types/payment';
import { Button } from '@/components/ui/Button';
import { formatINR, formatDate } from '@/lib/utils';
import { CheckCircle2, Flame, ArrowRight, Download, Calendar, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  transaction,
}: PaymentSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger canvas confetti if available
      try {
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#E11D48', '#FF4500', '#F97316', '#F59E0B'],
          });
        });
      } catch {
        // Confetti optional
      }
    }
  }, [isOpen]);

  if (!transaction) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      showCloseButton={true}
    >
      <div className="text-center space-y-6 pt-2">
        {/* Animated Success Badge */}
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/50 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-heading">
            Payment Completed Successfully
          </span>
          <h3 className="text-2xl font-extrabold text-white font-heading mt-1">
            WELCOME TO IRONFORGE!
          </h3>
          <p className="text-xs text-forge-400 mt-1">
            Your {transaction.planName} has been activated. A copy of your tax invoice has been sent to {transaction.userEmail}.
          </p>
        </div>

        {/* Receipt Card */}
        <div className="p-4 rounded-2xl bg-forge-950 border border-forge-800 text-left space-y-3 text-xs">
          <div className="flex justify-between border-b border-forge-850 pb-2">
            <span className="text-forge-400">Invoice Number</span>
            <span className="font-mono font-bold text-white">{transaction.invoiceNumber}</span>
          </div>

          <div className="flex justify-between border-b border-forge-850 pb-2">
            <span className="text-forge-400">Razorpay Payment ID</span>
            <span className="font-mono text-forge-300 truncate max-w-[180px]">
              {transaction.razorpayPaymentId}
            </span>
          </div>

          <div className="flex justify-between border-b border-forge-850 pb-2">
            <span className="text-forge-400">Membership Tier</span>
            <span className="font-bold text-brand-orange">{transaction.planName} ({transaction.billingInterval})</span>
          </div>

          <div className="flex justify-between pt-1">
            <span className="text-forge-400 font-bold uppercase font-heading">Amount Paid</span>
            <span className="font-extrabold text-white text-sm font-heading">{formatINR(transaction.amount)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link href="/dashboard" onClick={onClose} className="block w-full">
            <Button size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Go to Member Dashboard
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-forge-400 hover:text-white"
            onClick={() => window.print()}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download Invoice Receipt
          </Button>
        </div>
      </div>
    </Modal>
  );
}
