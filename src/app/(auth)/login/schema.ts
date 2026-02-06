// schema.ts
import { z } from 'zod'


export const baseAuthSchema = z.object({
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string()
    .min(6, '6文字以上で入力してください')
    .regex(/[a-zA-Z]/, '英字を1文字以上含めてください')
    .regex(/[0-9]/, '数字を1文字以上含めてください'),

})

export const loginSchema = baseAuthSchema
export const signupSchema = baseAuthSchema
