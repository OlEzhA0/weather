import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react'

import { api } from 'core/utils/api'
import { TOKEN } from 'core/const'

interface Context {
  user: User | null
  loading: boolean
  setUser: (data: User | null) => void
  updateUserInfo: (data: Partial<User>) => void
}

const noop = () => {
  //
}

const AuthContext = createContext<Context>({
  user: null,
  loading: false,
  setUser: noop,
  updateUserInfo: noop,
})

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const updateUserInfo = (userInfo: Partial<User> | null) => {
    if (!userInfo) {
      setUser(null)
    } else if (user) {
      setUser({ ...user, ...userInfo })
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)

      if (window.localStorage.getItem('token')) {
        try {
          const { data } = await api.get<UserResponse>('/auth/refresh')

          window.localStorage.setItem(TOKEN, data.accessToken)

          setUser(data.user)
        } catch (err) {
          console.log(err)

          setUser(null)
        }
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): Context => useContext(AuthContext)
