import { ApiClient } from './api';
import { ApiResponse } from '@/types/api';
import { MembershipPlan, UserMembership, BillingInterval } from '@/types/membership';
import { INITIAL_MEMBERSHIP_PLANS, INITIAL_USER_MEMBERSHIP } from './mockData';

const PLANS_STORAGE_KEY = 'ironforge_plans_db';
const USER_MEMBERSHIP_KEY = 'ironforge_user_membership';

function getStoredPlans(): MembershipPlan[] {
  if (typeof window === 'undefined') return INITIAL_MEMBERSHIP_PLANS;
  const stored = localStorage.getItem(PLANS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(INITIAL_MEMBERSHIP_PLANS));
    return INITIAL_MEMBERSHIP_PLANS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MEMBERSHIP_PLANS;
  }
}

export const membershipService = {
  async getPlans(): Promise<ApiResponse<MembershipPlan[]>> {
    try {
      return await ApiClient.get<MembershipPlan[]>('/memberships/plans/');
    } catch {
      // Fallback
    }

    return {
      success: true,
      message: 'Plans retrieved.',
      data: getStoredPlans(),
    };
  },

  async getUserMembership(userId: string): Promise<ApiResponse<UserMembership | null>> {
    try {
      return await ApiClient.get<UserMembership | null>(`/memberships/user/${userId}/`);
    } catch {
      // Fallback
    }

    if (typeof window === 'undefined') {
      return { success: true, message: 'Membership status', data: INITIAL_USER_MEMBERSHIP };
    }

    const stored = localStorage.getItem(USER_MEMBERSHIP_KEY);
    if (!stored) {
      localStorage.setItem(USER_MEMBERSHIP_KEY, JSON.stringify(INITIAL_USER_MEMBERSHIP));
      return { success: true, message: 'Membership status', data: INITIAL_USER_MEMBERSHIP };
    }

    try {
      const mem: UserMembership = JSON.parse(stored);
      // Calculate real remaining days
      const end = new Date(mem.endDate).getTime();
      const now = new Date().getTime();
      mem.daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
      return { success: true, message: 'Membership status', data: mem };
    } catch {
      return { success: true, message: 'Membership status', data: INITIAL_USER_MEMBERSHIP };
    }
  },

  async activateMembership(
    userId: string,
    planId: string,
    billingInterval: BillingInterval,
    paymentId: string
  ): Promise<ApiResponse<UserMembership>> {
    try {
      return await ApiClient.post<UserMembership>('/memberships/activate/', {
        userId,
        planId,
        billingInterval,
        paymentId,
      });
    } catch {
      // Fallback
    }

    const plans = getStoredPlans();
    const plan = plans.find((p) => p.id === planId) || plans[1];
    const startDate = new Date().toISOString();
    const durationDays = billingInterval === 'yearly' ? 365 : 30;
    const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    const amountPaid = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

    const newMembership: UserMembership = {
      id: `mem-${Date.now()}`,
      userId,
      planId: plan.id,
      plan,
      status: 'active',
      billingInterval,
      amountPaid,
      startDate,
      endDate,
      daysRemaining: durationDays,
      autoRenew: true,
      paymentId,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_MEMBERSHIP_KEY, JSON.stringify(newMembership));
    }

    return {
      success: true,
      message: `Congratulations! Your ${plan.name} Membership is now active.`,
      data: newMembership,
    };
  },

  async createPlan(planData: Omit<MembershipPlan, 'id'>): Promise<ApiResponse<MembershipPlan>> {
    try {
      return await ApiClient.post<MembershipPlan>('/memberships/plans', planData);
    } catch {
      // Fallback
    }

    const plans = getStoredPlans();
    const newPlan: MembershipPlan = {
      ...planData,
      id: `plan-${Date.now()}`,
    } as MembershipPlan;

    if (typeof window !== 'undefined') {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify([...plans, newPlan]));
    }

    return {
      success: true,
      message: 'Plan created successfully.',
      data: newPlan,
    };
  },

  async updatePlan(id: string, planData: Partial<MembershipPlan>): Promise<ApiResponse<MembershipPlan>> {
    try {
      return await ApiClient.put<MembershipPlan>(`/memberships/plans/${id}`, planData);
    } catch {
      // Fallback
    }

    const plans = getStoredPlans();
    const updatedPlans = plans.map((p) => (p.id === id ? { ...p, ...planData } : p)) as MembershipPlan[];

    if (typeof window !== 'undefined') {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
    }

    const updated = updatedPlans.find((p) => p.id === id);
    if (!updated) {
      throw new Error('Plan not found.');
    }

    return {
      success: true,
      message: 'Plan updated successfully.',
      data: updated,
    };
  },

  async deletePlan(id: string): Promise<ApiResponse<null>> {
    try {
      return await ApiClient.delete<null>(`/memberships/plans/${id}`);
    } catch {
      // Fallback
    }

    const plans = getStoredPlans();
    const filtered = plans.filter((p) => p.id !== id);

    if (typeof window !== 'undefined') {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(filtered));
    }

    return {
      success: true,
      message: 'Plan deleted successfully.',
      data: null,
    };
  },
};
