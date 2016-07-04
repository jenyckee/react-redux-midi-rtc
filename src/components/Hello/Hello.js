import React from 'react'
import classes from './Hello.scss'

class Hello extends React.Component {

  componentDidMount() {
    this.props.initRTC('bnon5rifq5dygb9', 3)
  }

  testConnection() {
    this.props.emitRTC('yo')
  }

  render () {
    return (
      <div>
        <h3>I am {this.props.connectionId}!</h3>
        <button onClick={this.testConnection.bind(this)}>Connect</button>
      </div>
    )
  }
}

Hello.propTypes = {
  connectionId: React.PropTypes.string.isRequired,
  connectRTC: React.PropTypes.func.isRequired,
  initRTC: React.PropTypes.func.isRequired,
  sendRTC: React.PropTypes.func.isRequired,
  emitRTC: React.PropTypes.func.isRequired
}

export default Hello
