import React from 'react'
import Header from '../../components/Header'
import classes from './CoreLayout.scss'
import '../../styles/core.scss'


export class CoreLayout extends React.Component {

  render () {
    return (
      <div className='text-center'>
        <Header />
        <div className={classes.mainContainer}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired,
}

export default CoreLayout
