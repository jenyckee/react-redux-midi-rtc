import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
// import classnames from 'classnames'
import { control, noteDown, noteUp } from '../../modules/midi'
import { sendRTC } from '../../modules/dataChannel'


import PIXI from "pixi.js"

export class Grid extends React.Component<void, Props, void> {

  onDown(event) {
    this.props.noteDown(60)
    this.props.sendRTC([0x90, 60, 0x7f])
  }

  onUp (event) {
    this.props.noteUp(60)
    this.props.sendRTC([0x80, 60, 0x7f])
  }

  componentDidMount() {
    var width = 800,
        height = 600

    this.canvas = window.document.createElement("canvas")
    this.canvas.style.width = width + "px"
    this.canvas.style.height = height + "px"

    this.renderer = new PIXI.CanvasRenderer(width, height, {
      view: this.canvas,
      antialias: true,
      resolution: 2
    })
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
    var color = this.props.midi.get(60) ? 0xFA8080 : 0xFFFFFF
    this.graphics.lineStyle(0)
    this.graphics.beginFill(color, 0.5)
    this.graphics.drawCircle(200,200, this.props.midi.get(37) ? this.props.midi.get(37) /127*50 : 20)
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
  midi: state.midi
})
export default connect(mapStateToProps, {
  control: control,
  noteUp: noteUp,
  noteDown: noteDown,
  sendRTC: sendRTC
})(Grid)
