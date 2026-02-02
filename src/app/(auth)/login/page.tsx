// import { login } from './actions'
// import { Button } from "@/components/ui/button"


// export default function LoginPage() {
//   return (
//     <form>
//       <Button formAction={login} size={"lg"}>login</Button>
//     </form>
//   )
// }

'use client'

import { useState } from 'react'
import { loginWithEmail, loginWithGoogle, signUpWithEmail } from './actions'


export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)

  async function handleEmailAuth(formData: FormData) {
    setError(null)

    const result =
      mode === 'login'
        ? await loginWithEmail(formData)
        : await signUpWithEmail(formData)

    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h1>ログイン</h1>

      {/* -----------------
          Google OAuth
      ----------------- */}
      <form action={loginWithGoogle}>
        <button type="submit">
          Googleでログイン
        </button>
      </form>

      <hr />

      {/* -----------------
          Email + Password
      ----------------- */}
      <form action={handleEmailAuth}>
        <div>
          <input
            name="email"
            type="email"
            placeholder="メールアドレス"
            required
          />
        </div>

        <div>
          <input
            name="password"
            type="password"
            placeholder="パスワード"
            required
          />
        </div>

        <button type="submit">
          {mode === 'login' ? 'ログイン' : '新規登録'}
        </button>
      </form>

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {/* -----------------
          モード切り替え
      ----------------- */}
      <button
        onClick={() =>
          setMode(mode === 'login' ? 'signup' : 'login')
        }
        style={{ marginTop: 16 }}
      >
        {mode === 'login'
          ? '新規登録はこちら'
          : 'ログインはこちら'}
      </button>
    </div>
  )
}
