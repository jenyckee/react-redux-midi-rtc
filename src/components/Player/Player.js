import React from 'react'
import Note from '../Note'
import teoria from 'teoria'

class Player extends React.Component {

  componentDidMount() {
    this.props.initRTC('bnon5rifq5dygb9', 3)
    .then(() => {
      this.props.connectRTC(this.props.routeParams.id)
    })
  }

  render () {
    return (
      <div>
        <Note note={teoria.note('c4')} />
        <Note note={teoria.note('g4')} />
      </div>
    )
  }
}

export default Player
