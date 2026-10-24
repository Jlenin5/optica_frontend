import type { Plan } from "@plans/types/plans.types"
import type { Company } from "@companies/types/companies.types"
import type { User } from "@users/types/users.types"

export interface Profile extends User {
  company?: Company
  plan?: Plan
  features?: string[]
  limits?: Record<string, number>
}

export interface UpdateProfileDTO {
  username?: string
  email?: string
  avatar?: string | null
  current_password?: string
  new_password?: string
  confirm_password?: string
}

export interface ChangePasswordDTO {
  current_password: string
  new_password: string
  confirm_password: string
}