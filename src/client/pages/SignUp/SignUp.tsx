import React, { ChangeEvent, FC, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuthContext } from 'client/core/context/AuthContext'
import { api } from 'client/core/api'
import { TOKEN } from 'client/core/utils/const'
import { useTabTitle } from 'client/core/hooks/useTabTitle'

const FIELDS_CONFIG = {
  email: 'Email',
  password: 'Password',
  confirmPass: 'Confirm Password',
}

type FieldsKeys = keyof typeof FIELDS_CONFIG

const emptyFields = Object.keys(FIELDS_CONFIG).reduce((accum, key) => {
  accum[key as FieldsKeys] = ''

  return accum
}, {} as { [key in FieldsKeys]: string })

const SignUp: FC = () => {
  const [fields, setFields] = useState(emptyFields)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { setUser } = useAuthContext()

  useTabTitle('Sign Up')

  const handleChangeField = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (error) {
      setError(null)
    }

    setFields((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)

    const { email, password, confirmPass } = fields

    if (!email || !password || !confirmPass) {
      setError('Please, fill all fields')

      return
    }

    if (password !== confirmPass) {
      setError('Passwords are different')

      return
    }

    try {
      const { data } = await api.post<UserResponse>('/auth/registration', {
        email,
        password,
      })

      localStorage.setItem(TOKEN, data.accessToken)

      setUser(data.user)
    } catch (err) {
      setError(err.response.data.message || err.message || err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <div>
          <h1>Sign up</h1>
        </div>
        <form onSubmit={handleSignUp}>
          {Object.keys(fields).map((field) => {
            const key = field as FieldsKeys

            return (
              <input
                type={key === 'email' ? 'text' : 'password'}
                key={key}
                name={key}
                value={fields[key]}
                onChange={handleChangeField}
                placeholder={FIELDS_CONFIG[key]}
              />
            )
          })}
          <div>
            <button type="submit" disabled={loading || !!error}>
              Sign Up
            </button>

            <Link to="/sign-in">Already have account?</Link>
          </div>
        </form>
      </div>
    </>
  )
}

export default SignUp
