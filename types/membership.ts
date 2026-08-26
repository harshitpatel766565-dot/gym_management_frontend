export type MembershipTier = 'Basic' | 'Pro' | 'Elite';
export type BillingInterval = 'monthly' | 'yearly';
export type MembershipStatus = 'active' | 'expired' | 'pending' | 'cancelled';

export interface MembershipPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number; // in INR e.g. 999
  yearlyPrice: number;  // in INR e.g. 9990 (approx 2 months free)
  isPopular?: boolean;
  features: {
    title: string;
    included: boolean;
    description?: string;
  }[];
  accessHours: string;
  guestPassesPerMonth: number;
  trainerSessionsPerMonth: number;
  dietConsultationsPerQuarter: number;
  saunaAccess: boolean;
  lockerAccess: boolean;
}

export interface UserMembership {
  id: string;
  userId: string;
  planId: string;
  plan: MembershipPlan;
  status: MembershipStatus;
  billingInterval: BillingInterval;
  amountPaid: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  autoRenew: boolean;
  paymentId?: string;
}
