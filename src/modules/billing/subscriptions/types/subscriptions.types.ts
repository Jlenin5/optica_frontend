import type { Company } from "@companies/types/companies.types"
import type { Plan } from "../../plans/types/plans.types"

export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'canceled'

export interface Subscription {
  id: number
  company: Company
  company_id?: number | null
  plan: Plan
  plan_id: number
  start_date: string
  end_date: string | null
  trial_end: string | null
  status: SubscriptionStatus
  created_at: string
  updated_at: string | null
}

export interface GetSubscriptionsParams {
  limit?: number
  offset?: number
  search?: string
  status?: SubscriptionStatus
  company_id?: number
  plan_id?: number
}

export interface CreateSubscriptionDTO {
  company_id?: number | null
  plan_id: number
  start_date?: string
  end_date?: string
  trial_end?: string | null
  status?: SubscriptionStatus
}

export interface UpdateSubscriptionDTO {
  plan_id?: number
  end_date?: string
  trial_end?: string | null
  status?: SubscriptionStatus
}

export interface SubscriptionStats {
  total: number
  active: number
  trial: number
  past_due: number
  canceled: number
  expiring_soon: number
}