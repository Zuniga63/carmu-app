import * as z from 'zod';

export const signInFormSchema = z.object({
  email: z.string().email({ message: 'El correo electrónico es necesario' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export type SignInFormSchemaType = z.infer<typeof signInFormSchema>;
