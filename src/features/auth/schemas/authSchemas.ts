import { z } from 'zod';

/**
 * Esquema de validación para el formulario de login
 * Aplica validaciones de seguridad y sanitización
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'El nombre de usuario es requerido')
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario es demasiado largo')
    .regex(/^[a-zA-Z0-9_-]+$/, 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(128, 'La contraseña es demasiado larga'),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Esquema de validación para el formulario de registro
 * Incluye validaciones robustas de seguridad
 */
export const registerSchema = z
  .object({
    fullname: z
      .string()
      .min(1, 'El nombre completo es requerido')
      .min(2, 'El nombre completo debe tener al menos 2 caracteres')
      .max(100, 'El nombre completo es demasiado largo')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
      .trim(),
    username: z
      .string()
      .min(1, 'El nombre de usuario es requerido')
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
      .max(50, 'El nombre de usuario es demasiado largo')
      .regex(/^[a-zA-Z0-9_-]+$/, 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos')
      .toLowerCase()
      .trim(),
    email: z
      .string()
      .min(1, 'El correo electrónico es requerido')
      .email('Debe ser un correo electrónico válido')
      .max(100, 'El correo electrónico es demasiado largo')
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(128, 'La contraseña es demasiado larga')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      ),
    confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

