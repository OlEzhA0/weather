import React, { FC, useState } from 'react'
import { Redirect } from 'react-router'

import { useAuthContext } from 'client/core/context/AuthContext'
import { api } from 'client/core/api'
import { TOKEN } from 'client/core/utils/const'
import Navbar from 'client/features/Navbar'
import { useTabTitle } from 'client/core/hooks/useTabTitle'

const Dashboard: FC = () => {
  const [loading, setLoading] = useState(false)

  const { user, setUser, loading: userLoading } = useAuthContext()

  useTabTitle('Dashboard')

  if (!user && !userLoading) {
    return <Redirect to="/sign-in" />
  }

  const handleLogout = async () => {
    setLoading(true)

    try {
      await api.post('/auth/logout')

      localStorage.removeItem(TOKEN)

      setUser(null)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1>Dashboard</h1>

      <div>
        <Navbar />
        <p>{user?.email}</p>
        <button onClick={handleLogout} disabled={loading}>
          Logout
        </button>
      </div>
    </>
  )
}

export default Dashboard
