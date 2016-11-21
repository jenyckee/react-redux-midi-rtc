import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
// import classnames from 'classnames'
import { control, noteDown, noteUp } from '../../modules/midi'
import { sendRTC } from '../../modules/dataChannel'
import _ from 'underscore'
import * as Babel from 'babel-standalone'

import PIXI from 'pixi.js'
// import vm from 'vm'

import Renderer from '../../renderer'

export class Grid extends React.Component {

  componentDidMount() {
    this.renderer = new Renderer(ReactDOM.findDOMNode(this), this.props)
  }

  render () {
    if (this.renderer)
      this.renderer.update(this.props)
    return (
      <canvas/>
    )
  }
}

const mapStateToProps = (state) => ({
  midi: state.midi,
  scenesrc: state.dataChannel.get('scenesrc')
})
export default connect(mapStateToProps, {
  control: control,
  noteUp: noteUp,
  noteDown: noteDown,
  sendRTC: sendRTC
})(Grid)
