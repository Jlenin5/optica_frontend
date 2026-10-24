import { z } from "zod"

export const patientSchema = z.object({
  first_name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  last_name: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  // document_type_id: z.number({
  //   required_error: 'El tipo de documento es requerido',
  // }),
  document_number: z.string()
    .min(6, 'El número de documento debe tener al menos 6 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres'),
  phone: z.string()
    .min(6, 'El teléfono debe tener al menos 6 caracteres')
    .max(15, 'El teléfono no puede exceder 15 caracteres')
    .regex(/^[0-9]+$/, 'El teléfono solo debe contener números'),
  email: z.string()
    .email('Email inválido')
    .max(100, 'El email no puede exceder 100 caracteres'),
  birth_date: z.string().optional(),
  address: z.string().max(200, 'La dirección no puede exceder 200 caracteres').optional(),
})

export type PatientFormData = z.infer<typeof patientSchema>