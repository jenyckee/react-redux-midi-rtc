import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
// import classnames from 'classnames'
import { control, noteDown, noteUp } from '../../modules/midi'
import { sendRTC } from '../../modules/dataChannel'
import _ from 'underscore'

import PIXI from "pixi.js"

export class Grid extends React.Component<void, Props, void> {

  noteDown(note) {
    this.props.noteDown(60)// note)
    this.props.sendRTC([0x90, 60, 0x7f])
  }

  noteUp(note) {
    this.props.noteUp(60)// note)
    this.props.sendRTC([0x80, 60, 0x7f])
  }

  resize () {
    this.w = window.innerWidth
    this.h = window.innerHeight
    // this.renderer.resize(this.w, this.h)
    this.canvas.style.width = this.w + "px"
    this.canvas.style.height = this.h + "px"
  }

  componentDidMount() {
    this.w = window.innerWidth
    this.h = window.innerHeight

    this.canvas = window.document.createElement("canvas")

    this.renderer = new PIXI.CanvasRenderer(this.w, this.h, {
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
    this.graphics.on('mousedown', this.noteDown)
    this.graphics.on('mouseup', this.noteUp)
    this.graphics.on('touchstart', this.noteDown)
    this.graphics.on('touchend', this.noteUp)
    this.graphics.on('mouseout', this.noteUp)

    window.addEventListener('resize', _.debounce(this.resize.bind(this), 300))
    this.resize()
    this.animate()
  }

  constructor( props ) {
    super(props)
    this.animate = this.animate.bind(this)
    this.noteDown = this.noteDown.bind(this)
    this.noteUp = this.noteUp.bind(this)
  }

  draw(t, graphics, renderer) {
    let white = 0xFFFFFF,
        black = 0x000000,
        red = 0xFF0000,
        color = this.props.midi.get(60) ? red : white


    this.graphics.beginFill(color, 1)
    this.graphics.drawRect(0,0, 50, 50)

    graphics.interactive = true
    graphics.endFill()

    renderer.render(this.stage)
    renderer.backgroundColor = black
  }

  animate(t) {
    this.graphics.clear()
    this.draw(t, this.graphics, this.renderer)
    this.frame = requestAnimationFrame(this.animate)
  }

  shouldComponentUpdate() {
    return false
  }

  render () {
    return (
      <div className="scene-wrapper" ref="sceneCanvas">
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  midi: state.midi,
  scenesrc: eval(state.dataChannel.get('scenesrc'))
})
export default connect(mapStateToProps, {
  control: control,
  noteUp: noteUp,
  noteDown: noteDown,
  sendRTC: sendRTC
})(Grid)
