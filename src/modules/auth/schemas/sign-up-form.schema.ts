import * as z from 'zod';

/**
 * Schema for the registration form of a user.
 */
export const signUpFormSchema = z
  .object({
    username: z
      .string({ required_error: 'Nombre de usuario es requerido' })
      .min(3, { message: 'El nombre de usuario debe tener minimo tres caracteres.' })
      .max(90, { message: 'El nombre de usuario debe ser menor a 90 caracteres' }),
    email: z.string().email({ message: 'Escribe un correo válido' }),
    password: z.string().min(3, { message: 'La contraseña debe tener minimo tres caracteres.' }),
    passwordConfirmation: z.string().min(3, { message: 'La contraseña debe tener minimo tres caracteres.' }),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    path: ['password_confirmation'],
    message: 'Las contraseñas no coinciden',
  });

export type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>;
