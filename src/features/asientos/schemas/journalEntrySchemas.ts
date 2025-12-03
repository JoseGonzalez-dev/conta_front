import { z } from 'zod';

/**
 * Esquema de validación para un movimiento contable
 */
const movementSchema = z.object({
    accountId: z.string().min(1, 'Debes seleccionar una cuenta'),
    debit: z
        .union([z.number(), z.string()])
        .transform((val) => (typeof val === 'string' ? parseFloat(val) || 0 : val))
        .pipe(z.number().min(0, 'El débito no puede ser negativo')),
    credit: z
        .union([z.number(), z.string()])
        .transform((val) => (typeof val === 'string' ? parseFloat(val) || 0 : val))
        .pipe(z.number().min(0, 'El crédito no puede ser negativo')),
}).refine(
    (data) => data.debit === 0 || data.credit === 0,
    {
        message: 'Un movimiento no puede tener débito y crédito simultáneamente',
        path: ['debit'],
    }
);

/**
 * Esquema de validación para el formulario de asientos contables
 * Incluye validaciones de balance contable
 */
export const journalEntrySchema = z
    .object({
        date: z.coerce.date(),
        time: z
            .string()
            .min(1, 'La hora es requerida')
            .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'La hora debe tener el formato HH:MM'),
        description: z
            .string()
            .min(1, 'La descripción es requerida')
            .min(10, 'La descripción debe tener al menos 10 caracteres')
            .max(1000, 'La descripción es demasiado larga')
            .trim(),
        movements: z
            .array(movementSchema)
            .min(2, 'Debe haber al menos 2 movimientos'),
    })
    .refine(
        (data) => {
            const totalDebits = data.movements.reduce((sum, mov) => sum + (Number(mov.debit) || 0), 0);
            const totalCredits = data.movements.reduce((sum, mov) => sum + (Number(mov.credit) || 0), 0);
            return Math.abs(totalDebits - totalCredits) < 0.01;
        },
        {
            message: 'La partida debe estar balanceada. Los débitos deben ser iguales a los créditos.',
            path: ['movements'],
        }
    );

export type JournalEntryFormData = z.infer<typeof journalEntrySchema>;
