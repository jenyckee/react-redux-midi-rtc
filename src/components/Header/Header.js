import React from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './Header.scss'

export const Header = (props) => (
  <div>
    <IndexLink to='/' activeClassName={classes.activeRoute}>
      Home
    </IndexLink>
  </div>
)

export default Header
