import React, { FC } from 'react'
import { NavLink } from 'react-router-dom'

import './Navbar.scss'

const LINKS_CONFIG = ['Dashboard', 'Search', 'Followed']

const Navbar: FC = () => (
  <div className="Navbar">
    {LINKS_CONFIG.map((link) => (
      <NavLink
        key={link}
        to={`/${link.toLocaleLowerCase()}`}
        activeStyle={{ color: 'green' }}
      >
        {link}
      </NavLink>
    ))}
  </div>
)

export default Navbar
