import { z } from 'zod';
import { AccountType } from '../types';

/**
 * Esquema de validación para el formulario de creación de cuentas
 * Aplica validaciones de negocio y sanitización
 */
export const accountSchema = z.object({
  code: z
    .string()
    .min(1, 'El código de la cuenta es requerido')
    .max(20, 'El código es demasiado largo')
    .regex(/^[0-9.]+$/, 'El código solo puede contener números y puntos')
    .trim(),
  name: z
    .string()
    .min(1, 'El nombre de la cuenta es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre es demasiado largo')
    .trim(),
  type: z
    .string()
    .refine((val) => Object.values(AccountType).includes(val as any), {
      message: 'Debes seleccionar un tipo de cuenta válido',
    }),
  parentId: z
    .number()
    .positive('El ID de la cuenta padre debe ser un número positivo')
    .optional()
    .nullable(),
  isDetail: z
    .boolean()
    .refine((val) => val !== undefined, {
      message: 'Debes indicar si es cuenta de detalle',
    }),
  isActive: z
    .boolean()
    .default(true),
});

export type AccountFormData = z.infer<typeof accountSchema>;

