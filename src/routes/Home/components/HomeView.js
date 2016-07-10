import React from 'react'
import classes from './HomeView.scss'
import { connect } from 'react-redux'
import { initRTC } from '../../../modules/conductor'
import { IndexLink, Link } from 'react-router'


export class HomeView extends React.Component {

  componentDidMount() {
    this.props.initRTC('bnon5rifq5dygb9', 3)
  }

  render() {
    return (
        <div>
          <h4>Welcome!</h4>
          <Link to={'/player/'+this.props.connectionId} target="_blank">
            Player
          </Link>
          <h3>I am {this.props.connectionId}!</h3>
        </div>
      )
  }
}

const mapActionCreators = {
  initRTC: initRTC,
}

const mapStateToProps = (state) => {
  return {
    connectionId: state.conductor.get('connectionId')
  }
}

HomeView.propTypes = {
  connectionId: React.PropTypes.string.isRequired,
  initRTC: React.PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapActionCreators)(HomeView)

// export default HomeView
