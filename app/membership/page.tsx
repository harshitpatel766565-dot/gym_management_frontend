'use client';

import React, { useState } from 'react';
import { INITIAL_MEMBERSHIP_PLANS } from '@/services/mockData';
import { MembershipPlan, BillingInterval } from '@/types/membership';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';
import { Check, X, Flame, Sparkles, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { RazorpayModal } from '@/components/payment/RazorpayModal';
import { PaymentSuccessModal } from '@/components/payment/PaymentSuccessModal';
import { PaymentTransaction } from '@/types/payment';
import { motion } from 'framer-motion';

export default function MembershipPage() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [successTx, setSuccessTx] = useState<PaymentTransaction | null>(null);

  const handleSelectPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="pt-28 pb-20 bg-forge-950 text-forge-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forge-900 border border-brand-red/40 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-4">
            <Flame className="w-4 h-4" />
            <span>Investment in Your Peak Potential</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight uppercase">
            MEMBERSHIP <span className="text-brand-red">TIERS</span>
          </h1>
          <p className="text-forge-300 text-sm sm:text-base mt-2">
            No initiation fees. No hidden cancellation penalties. Select the tier that matches your commitment level.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-forge-900 border border-forge-800 shadow-xl">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-heading transition-all cursor-pointer ${
                billingInterval === 'monthly'
                  ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md shadow-brand-red/30'
                  : 'text-forge-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-heading transition-all relative cursor-pointer ${
                billingInterval === 'yearly'
                  ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md shadow-brand-red/30'
                  : 'text-forge-400 hover:text-white'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                Annual Billing
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-black">
                  SAVE 20%
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
          {INITIAL_MEMBERSHIP_PLANS.map((plan, index) => {
            const isPopular = plan.isPopular;
            const price = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-gradient-to-b from-forge-850 via-forge-900 to-forge-950 border-2 border-brand-red shadow-forge-glow-lg lg:-translate-y-4'
                    : 'bg-forge-900/80 border border-forge-800 hover:border-forge-700 shadow-xl'
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
                  <div className="mb-6">
                    <h3 className="text-3xl font-black font-heading text-white uppercase tracking-wide">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-forge-400 mt-1">{plan.tagline}</p>
                  </div>

                  {/* Price Block */}
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
                        Billed annually (Save {formatINR(plan.monthlyPrice * 12 - plan.yearlyPrice)})
                      </p>
                    )}
                  </div>

                  {/* Feature Checkpoints */}
                  <div className="space-y-3.5 mb-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-forge-300 font-heading">
                      Tier Amenities &amp; Privileges:
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
                    Instant activation • Cancel or freeze anytime
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="p-8 rounded-3xl bg-forge-900/60 border border-forge-800 shadow-2xl">
          <h3 className="text-2xl font-bold font-heading text-white uppercase mb-6 text-center">
            Detailed Comparison Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-forge-800 text-forge-400 font-heading uppercase">
                  <th className="py-4 px-4 font-bold">Feature</th>
                  <th className="py-4 px-4 font-bold text-center">Basic (₹999)</th>
                  <th className="py-4 px-4 font-bold text-center text-brand-orange">Pro (₹1,999)</th>
                  <th className="py-4 px-4 font-bold text-center text-amber-400">Elite (₹3,499)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forge-850">
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">Access Hours</td>
                  <td className="py-4 px-4 text-center text-forge-300">06:00 AM – 10:00 PM</td>
                  <td className="py-4 px-4 text-center text-forge-300">05:00 AM – 11:00 PM</td>
                  <td className="py-4 px-4 text-center text-forge-300 font-bold text-amber-400">24/7 VIP Access</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">Personal Training Sessions</td>
                  <td className="py-4 px-4 text-center text-forge-500">—</td>
                  <td className="py-4 px-4 text-center text-forge-300">2 Sessions / mo</td>
                  <td className="py-4 px-4 text-center text-forge-300 font-bold text-amber-400">8 Sessions / mo</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">CrossFit &amp; Group HIIT Classes</td>
                  <td className="py-4 px-4 text-center text-forge-500">—</td>
                  <td className="py-4 px-4 text-center text-emerald-400 font-bold">Unlimited</td>
                  <td className="py-4 px-4 text-center text-emerald-400 font-bold">Unlimited VIP</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">Infrared Sauna &amp; Ice Bath</td>
                  <td className="py-4 px-4 text-center text-forge-500">—</td>
                  <td className="py-4 px-4 text-center text-emerald-400 font-bold">Included</td>
                  <td className="py-4 px-4 text-center text-emerald-400 font-bold">Unlimited VIP</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">Monthly Guest Passes</td>
                  <td className="py-4 px-4 text-center text-forge-300">1 Pass</td>
                  <td className="py-4 px-4 text-center text-forge-300">4 Passes</td>
                  <td className="py-4 px-4 text-center text-forge-300 font-bold text-amber-400">10 Passes</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">Protein Shake Bar Access</td>
                  <td className="py-4 px-4 text-center text-forge-500">—</td>
                  <td className="py-4 px-4 text-center text-forge-500">Discounted</td>
                  <td className="py-4 px-4 text-center text-emerald-400 font-bold">Complimentary</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Razorpay Checkout Modal */}
      <RazorpayModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        plan={selectedPlan}
        initialBillingInterval={billingInterval}
        onPaymentSuccess={(tx) => setSuccessTx(tx)}
      />

      {/* Payment Success Confetti Modal */}
      <PaymentSuccessModal
        isOpen={!!successTx}
        onClose={() => setSuccessTx(null)}
        transaction={successTx}
      />
    </div>
  );
}
