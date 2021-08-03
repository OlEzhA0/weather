import React, { FC } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import SignIn from 'pages/SignIn'
import SignUp from 'pages/SignUp'

export const PublicRoutes: FC = () => (
  <Switch>
    <Route path="/sign-up" exact component={SignUp} />
    <Route path="/sign-in" exact component={SignIn} />

    <Redirect to="sign-in" />
  </Switch>
)
