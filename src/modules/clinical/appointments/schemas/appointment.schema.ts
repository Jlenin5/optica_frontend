import { z } from "zod"

export const appointmentSchema = z.object({
  patient_id: z.number(),
  patient_name: z.string(),
  date: z.string(),
  time: z.string(),
  reason: z.string().min(3),
})