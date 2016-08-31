import React from 'react'
import Note from '../Note'
import Knob from '../Knob'
import Grid from '../Grid'
import Scene from '../Scene'
import teoria from 'teoria'

class Player extends React.Component {

  componentDidMount() {
    this.props.initRTC('bnon5rifq5dygb9', 3)
    .then(() => {
      this.props.connectRTC(this.props.routeParams.id)
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  render () {
    return (
      <div>
        <Scene />
      </div>
    )
  }
}

export default Player
