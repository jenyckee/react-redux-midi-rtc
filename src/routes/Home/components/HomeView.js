import React from 'react'
import classes from './HomeView.scss'
import { connect } from 'react-redux'
import { initRTC } from '../../../modules/dataChannel'
import { IndexLink, Link } from 'react-router'
import { asyncRequestMIDI } from '../../../modules/midi'

export class HomeView extends React.Component {

  componentDidMount() {
    this.props.initRTC('bnon5rifq5dygb9', 3)
    this.props.initMIDI()
  }

  render() {
    return (
      <div>
        <h3>I am {this.props.connectionId}!</h3>
        <Link to={'/player/'+this.props.connectionId} target="_blank">
          Open new Player
        </Link>
      </div>
    )
  }
}

const mapActionCreators = {
  initRTC: initRTC,
  initMIDI: asyncRequestMIDI
}

const mapStateToProps = (state) => {
  return {
    connectionId: state.dataChannel.get('connectionId'),
    midi: state.midi
  }
}

HomeView.propTypes = {
  connectionId: React.PropTypes.string.isRequired,
  initRTC: React.PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapActionCreators)(HomeView)

// export default HomeView
