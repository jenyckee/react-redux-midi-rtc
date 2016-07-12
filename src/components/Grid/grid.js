import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { control, noteDown, noteUp } from '../redux/modules/midi'

import PIXI from "pixi.js"

export class Grid extends React.Component<void, Props, void> {

  onDown(event) {
    this.props.noteDown({midi: 60})
  }

  onUp (event) {
    this.props.noteUp({midi: 60})
  }

  componentDidMount() {
    this.renderer = PIXI.autoDetectRenderer(800, 600, {antialias: true})
    this.refs.sceneCanvas.appendChild(this.renderer.view)

    this.stage = new PIXI.Container()
    this.stage.width = window.width
    this.stage.height = window.height

    this.graphics = new PIXI.Graphics()

    this.stage.addChild(this.graphics)
    this.graphics.on('mousedown', this.onDown)
    this.graphics.on('mouseup', this.onUp)
    this.graphics.on('touchstart', this.onDown)
    this.graphics.on('touchend', this.onUp)

    this.graphics.on('mouseout', this.onUp)

    this.animate()
  }

  constructor( props ) {
    super(props)
    this.animate = this.animate.bind(this)
    this.onDown = this.onDown.bind(this)
    this.onUp = this.onUp.bind(this)
  }

  animate() {
    this.graphics.clear()
    var color = this.props.midiState.get(60) ? 0xFF0000 : 0xFFFFFF
    this.graphics.lineStyle(0)
    this.graphics.beginFill(color, 0.5)
    this.graphics.drawCircle(200,200, this.props.midiState.get(37) ? this.props.midiState.get(37) /127*50 : 20)
    this.graphics.interactive = true
    this.graphics.endFill()

    this.renderer.render(this.stage)
    this.frame = requestAnimationFrame(this.animate)
  }

  render () {
    return (
      <div className="scene-wrapper" ref="sceneCanvas">
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  control: state.control
})
export default connect(mapStateToProps, {
  control: control,
  noteUp: noteUp,
  noteDown: noteDown
})(Grid)
