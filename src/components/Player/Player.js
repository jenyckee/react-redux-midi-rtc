import React from 'react'
import Note from '../Note'
import teoria from 'teoria'

class Player extends React.Component {

  componentDidMount() {
    this.props.initRTC('bnon5rifq5dygb9', 3)
    .then(() => {
      this.props.onConnectRTC(this.props.routeParams.id)
    })
  }

  render () {
    console.log(this.props.midi)
    return (
      <div>
        <Note note={teoria.note('c4')} midi={this.props.midi} />
      </div>
    )
  }
}

export default Player
