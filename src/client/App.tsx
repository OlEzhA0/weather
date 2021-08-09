import React, { FC } from 'react'
import { hot } from 'react-hot-loader'

import { useAuthContext } from 'client/core/context/AuthContext'
import { PrivateRoutes, PublicRoutes } from 'client/core/routes'

const App: FC = () => {
  const { user, loading } = useAuthContext()

  if (loading && !user) {
    return <p>Loading...</p>
  }

  return user && user.id ? <PrivateRoutes /> : <PublicRoutes />
}

export default hot(module)(App)
