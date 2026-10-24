import { z } from "zod"

export const typeOfDocumentSchema = z.object({
  description: z.string()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(100, 'La descripción no puede exceder 100 caracteres'),
  abbreviation: z.string()
    .max(10, 'La abreviatura no puede exceder 10 caracteres')
    .optional()
    .nullable(),
  code: z.string()
    .max(20, 'El código no puede exceder 20 caracteres')
    .optional()
    .nullable(),
  status: z.boolean().default(true)
})

export type TypeOfDocumentFormData = z.infer<typeof typeOfDocumentSchema>