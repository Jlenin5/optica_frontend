export interface Plan {
  id: number
  name: string
  code: string
  description?: string
  price: string
  billing_cycle: 'monthly' | 'quarterly' | 'semiannual' | 'annual'
  status: boolean
  is_public: boolean
  created_at: string
  updated_at?: string
}

export interface GetPlansParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
}

export interface PlanStats {
  total_plans: number
  active_plans: number
  inactive_plans: number
  public_plans: number
  private_plans: number
}