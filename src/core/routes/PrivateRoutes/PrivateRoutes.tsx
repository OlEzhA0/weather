import React, { FC } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Dashboard from 'pages/Dashboard'
import Followed from 'pages/Followed'
import Search from 'pages/Search'

export const PrivateRoutes: FC = () => (
  <Switch>
    <Route path="/dashboard" exact component={Dashboard} />
    <Route path="/followed" exact component={Followed} />
    <Route path="/search" exact component={Search} />

    <Redirect to="/dashboard" />
  </Switch>
)
