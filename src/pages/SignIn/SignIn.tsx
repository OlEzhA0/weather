import React, { ChangeEvent, FC, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuthContext } from 'core/context/AuthContext'
import { api } from 'core/utils/api'
import { TOKEN } from 'core/const'
import PageTitle from 'core/layout/PageTitle'

const SignIn: FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { setUser } = useAuthContext()

  const handler =
    (setValue: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (error) {
        setError(null)
      }

      setValue(e.target.value)
    }

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setLoading(true)

    if (!email || !password) {
      setError('Please add valid email and password')

      return
    }

    try {
      const { data } = await api.post<UserResponse>('/auth/login', {
        email,
        password,
      })

      window.localStorage.setItem(TOKEN, data.accessToken)

      setUser(data.user)
    } catch (err) {
      setError(err.response.data.message || err.message || err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTitle title="Sign In">
      <div>
        <h1>Sign In</h1>
      </div>
      <form onSubmit={handleSignIn}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={handler(setEmail)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handler(setPassword)}
        />
        <div>
          <button type="submit" disabled={loading || !!error}>
            Sign In
          </button>
          <Link to="/sign-up">No account yet? Registration</Link>
          {error && <p>{error}</p>}
        </div>
      </form>
    </PageTitle>
  )
}

export default SignIn
