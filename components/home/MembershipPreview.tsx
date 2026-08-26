'use client';

import React, { useState } from 'react';
import { INITIAL_MEMBERSHIP_PLANS } from '@/services/mockData';
import { MembershipPlan, BillingInterval } from '@/types/membership';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';
import { Check, X, Flame, Sparkles, ShieldCheck } from 'lucide-react';
import { RazorpayModal } from '@/components/payment/RazorpayModal';
import { PaymentSuccessModal } from '@/components/payment/PaymentSuccessModal';
import { PaymentTransaction } from '@/types/payment';
import { motion } from 'framer-motion';

export function MembershipPreview() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [successTx, setSuccessTx] = useState<PaymentTransaction | null>(null);

  const handleSelectPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setCheckoutModalOpen(true);
  };

  return (
    <section className="py-24 bg-forge-900/60 relative overflow-hidden">
      {/* Glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-red/10 blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-2">
            <Flame className="w-4 h-4" />
            <span>Transparent Pricing • Zero Hidden Fees</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight uppercase">
            MEMBERSHIP <span className="text-brand-red">PLANS</span>
          </h2>
          <p className="text-forge-400 text-sm sm:text-base mt-2">
            Invest in your health, strength, and longevity. Upgrade or freeze anytime.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-forge-950 border border-forge-800">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-heading transition-all cursor-pointer ${
                billingInterval === 'monthly'
                  ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md'
                  : 'text-forge-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-heading transition-all relative cursor-pointer ${
                billingInterval === 'yearly'
                  ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md'
                  : 'text-forge-400 hover:text-white'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                Annual Billing
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500 text-black">
                  SAVE 20%
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {INITIAL_MEMBERSHIP_PLANS.map((plan, index) => {
            const isPopular = plan.isPopular;
            const price = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-gradient-to-b from-forge-850 to-forge-950 border-2 border-brand-red shadow-forge-glow-lg lg:-translate-y-3'
                    : 'bg-forge-950/80 border border-forge-800 hover:border-forge-700 shadow-xl'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-red to-brand-orange text-white text-[11px] font-black uppercase tracking-widest font-heading shadow-lg shadow-brand-red/40 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MOST POPULAR</span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-black font-heading text-white uppercase tracking-wide">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-forge-400 mt-1">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8 pb-6 border-b border-forge-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight">
                        {formatINR(price)}
                      </span>
                      <span className="text-sm text-forge-400 font-semibold font-heading">
                        /{billingInterval === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingInterval === 'yearly' && (
                      <p className="text-xs text-emerald-400 font-semibold mt-1">
                        Equivalent to {formatINR(Math.round(price / 12))}/mo (billed annually)
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 mb-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-forge-300 font-heading">
                      Plan Inclusions:
                    </p>
                    {plan.features.map((feature) => (
                      <div key={feature.title} className="flex items-start gap-3 text-xs">
                        {feature.included ? (
                          <div className="w-4 h-4 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-forge-850 text-forge-600 flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-3 h-3" />
                          </div>
                        )}
                        <span className={feature.included ? 'text-forge-200' : 'text-forge-500 line-through'}>
                          {feature.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Action */}
                <div>
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    variant={isPopular ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full text-sm uppercase tracking-wider"
                  >
                    Select {plan.name}
                  </Button>
                  <p className="text-[10px] text-center text-forge-500 mt-2.5 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Instant activation • No lock-in contracts
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Razorpay Modal */}
      <RazorpayModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        plan={selectedPlan}
        initialBillingInterval={billingInterval}
        onPaymentSuccess={(tx) => {
          setSuccessTx(tx);
        }}
      />

      {/* Payment Success Confetti Modal */}
      <PaymentSuccessModal
        isOpen={!!successTx}
        onClose={() => setSuccessTx(null)}
        transaction={successTx}
      />
    </section>
  );
}
