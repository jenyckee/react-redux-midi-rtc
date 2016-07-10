import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { control } from '../redux/modules/midi'
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'

export class Knob extends React.Component<void, Props, void> {
  classList () {
    return classnames({
      knob: true
    })
  }

  handleSliderChange = (value) => {
    this.props.control(37, value)
  }

  value = () => {
    return this.props.midiState.get(37) || 0
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

const mapStateToProps = (state) => ({
  control: state.control
})
export default connect(mapStateToProps, {
  control: control
})(Knob)
