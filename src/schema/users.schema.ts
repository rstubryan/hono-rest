import { z } from 'zod'

export class UserValidation {
  static readonly REGISTER = z
    .object({
      name: z.string().min(4).max(100),
      email: z.email(),
      password: z.string().min(8),
      password_confirmation: z.string().min(8),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Password confirmation doesn't match",
      path: ['password_confirmation'],
    })

  static readonly LOGIN = z.object({
    email: z.email(),
    password: z.string().min(1),
  })
}
