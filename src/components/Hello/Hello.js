import React from 'react'
import classes from './Hello.scss'
import Note from '../Note'
import teoria from 'teoria'

class Hello extends React.Component {

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
    return (
      <div>
        <h3>Connect to the conductor!</h3>
        <Note note={teoria.note('c4')} midiState={this.props.midiState} />
        <button onClick={this.makeConnection.bind(this)}>Connect</button>
        <button onClick={this.testConnection.bind(this)}>Send</button>
      </div>
    )
  }
}

Hello.propTypes = {
  connectRTC: React.PropTypes.func.isRequired,
  initRTC: React.PropTypes.func.isRequired,
  sendRTC: React.PropTypes.func.isRequired,
  emitRTC: React.PropTypes.func.isRequired,
  midiState: React.PropTypes.func.isRequired,
}

export default Hello
