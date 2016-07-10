import React from 'react'
// import { connect } from 'react-redux'
// import { initRTC } from '../../modules/conductor'
import Header from '../../components/Header'
import classes from './CoreLayout.scss'
import '../../styles/core.scss'


export class CoreLayout extends React.Component {

  render () {
    return (
      <div className='container text-center'>
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
