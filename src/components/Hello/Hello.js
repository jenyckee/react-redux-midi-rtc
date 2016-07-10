import React from 'react'
import classes from './Hello.scss'

class Hello extends React.Component {

  testConnection() {
    this.props.emitRTC(this.props.routeParams.id)
  }

  render () {
    return (
      <div>
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
