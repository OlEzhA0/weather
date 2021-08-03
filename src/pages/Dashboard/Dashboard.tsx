import React, { FC, useState } from 'react'
import { Redirect } from 'react-router'

import PageTitle from 'core/layout/PageTitle'
import { useAuthContext } from 'core/context/AuthContext'
import { api } from 'core/utils/api'
import { TOKEN } from 'core/const'
import Navbar from 'features/Navbar'

const Dashboard: FC = () => {
  const [loading, setLoading] = useState(false)

  const { user, setUser, loading: userLoading } = useAuthContext()

  if (!user && !userLoading) {
    return <Redirect to="/sign-in" />
  }

  const handleLogout = async () => {
    setLoading(true)

    try {
      await api.post('/auth/logout')

      window.localStorage.removeItem(TOKEN)

      setUser(null)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTitle title="Dashboard">
      <h1>Dashboard</h1>

      <div>
        <Navbar />
        <p>{user?.email}</p>
        <button onClick={handleLogout} disabled={loading}>
          Logout
        </button>
      </div>
    </PageTitle>
  )
}

export default Dashboard
