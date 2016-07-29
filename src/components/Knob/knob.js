import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { control } from '../../modules/midi'
import { sendRTC, emitRTC } from '../../modules/dataChannel'
import cx from 'classnames'
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'

export class Knob extends React.Component<void, Props, void> {
  classList () {
    return cx({
      knob: true
    })
  }

  handleSliderChange = (value) => {
    this.props.control(37, value)
    this.props.sendRTC([176, 1, value], this.props.connectionId)
  }

  value = () => {
    return this.props.midi.get(37) || 0
  }

  render () {
    const wrapperStyle = {width: 400, margin: 50}

    return (
      <div className={this.classList()} style={wrapperStyle}>
        <Slider min={0} max={127} defaultValue={this.value()} onChange={this.handleSliderChange} value={this.value()} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    midi: state.midi,
    connectionId: state.dataChannel.get('connectionId')
  })
}
export default connect(mapStateToProps, {
  sendRTC: sendRTC,
  emitRTC: emitRTC,
  control: control,
})(Knob)
