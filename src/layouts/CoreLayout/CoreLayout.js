import React from 'react'
import { connect } from 'react-redux'
import { connectRTC, initRTC, sendRTC, emitRTC } from '../../modules/conductor'
import Header from '../../components/Header'
import classes from './CoreLayout.scss'
import '../../styles/core.scss'


export class CoreLayout extends React.Component {

  componentDidMount() {
    this.props.initRTC('bnon5rifq5dygb9', 3)
  }

  render () {
    return (
      <div className='container text-center'>
        <Header />
        <h3>I am {this.props.connectionId}!</h3>
        <div className={classes.mainContainer}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapActionCreators = {
  initRTC: initRTC,
}

const mapStateToProps = (state) => {
  return {
    connectionId: state.conductor.connectionId
  }
}

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired,
  connectionId: React.PropTypes.string.isRequired,
  initRTC: React.PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapActionCreators)(CoreLayout)
// export default CoreLayout
