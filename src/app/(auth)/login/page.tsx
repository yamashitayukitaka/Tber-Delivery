'use client'

import { useState } from 'react'
import { loginWithEmail, loginWithGoogle, signUpWithEmail } from './actions'
import { loginSchema, signupSchema } from './schema'
import { ZodError } from 'zod'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)

  async function handleEmailAuth(formData: FormData) {
    setError(null)

    try {
      // FormData → object
      const values = {
        email: String(formData.get('email')),
        password: String(formData.get('password')),
      }

      // 🔐 zod validation
      if (mode === 'login') {
        loginSchema.parse(values)
      } else {
        signupSchema.parse(values)
      }

      let result
      if (mode === 'login') {
        result = await loginWithEmail(formData)
      } else {
        await signUpWithEmail(formData)
        result = await loginWithEmail(formData)
      }

      if (result?.error) {
        setError(result.error)
      }

    } catch (err) {
      // redirect は正常系なので無視
      if ((err as any)?.digest === 'NEXT_REDIRECT') {
        return
      }
      if (err instanceof ZodError) {
        setError(err.issues[0].message)
        return
      }
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8">
        {/* タイトル */}
        <h1 className="text-2xl font-bold text-neutral-900 text-center mb-6">
          {mode === 'login' ? 'ログイン' : '新規登録'}
        </h1>

        {/* Google OAuth */}
        <form action={loginWithGoogle}>
          <button
            type="submit"
            className="w-full h-12 rounded-full border border-neutral-300 flex items-center justify-center gap-2 font-semibold hover:bg-neutral-100 transition"
          >
            <span className="text-sm">Googleでログイン</span>
          </button>
        </form>

        {/* 区切り */}
        <div className="flex items-center my-6 gap-4">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-xs text-neutral-400">または</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        {/* Email / Password */}
        <form action={handleEmailAuth} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="メールアドレス"
            required
            className="w-full h-12 rounded-lg border border-neutral-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            name="password"
            type="password"
            placeholder="パスワード"
            required
            className="w-full h-12 rounded-lg border border-neutral-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full h-12 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            {mode === 'login' ? 'ログイン' : '新規登録'}
          </button>
        </form>

        {/* エラー */}
        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        {/* モード切り替え */}
        <div className="mt-6 text-center">
          <button
            onClick={() =>
              setMode(mode === 'login' ? 'signup' : 'login')
            }
            className="text-sm font-semibold text-green-600 hover:underline"
          >
            {mode === 'login'
              ? '新規登録はこちら'
              : 'ログインはこちら'}
          </button>
        </div>
      </div>
    </div>
  )
}
