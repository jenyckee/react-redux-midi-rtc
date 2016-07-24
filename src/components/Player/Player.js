import React from 'react'
import Note from '../Note'
import teoria from 'teoria'
class Player extends React.Component {

  componentDidMount() {
    this.props.initRTC('bnon5rifq5dygb9', 3)
  }

  makeConnection() {
    this.props.onConnectRTC(this.props.routeParams.id)
  }

  testConnection() {
    console.log('sending')
    this.props.emitRTC([0x90, 60, 0x7f])
  }

  render () {
    console.log(this.props.midi)
    return (
      <div>
        <h3>Connect to the conductor!</h3>
        <Note note={teoria.note('c4')} midi={this.props.midi} />
        <button onClick={this.makeConnection.bind(this)}>Connect</button>
        <button onClick={this.testConnection.bind(this)}>Send</button>
      </div>
    )
  }
}

export default Player
