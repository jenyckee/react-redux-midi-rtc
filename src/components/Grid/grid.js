import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
// import classnames from 'classnames'
import { control, noteDown, noteUp } from '../../modules/midi'
import { sendRTC } from '../../modules/dataChannel'
import _ from 'underscore'

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

  point(n,i) {
    var marginx = 10,
        marginy = 10

    return {
      x: n+(i*marginx),
      y: marginy
    }
  }

  componentDidMount() {
    var width = 800,
        height = 600

    this.blocks = _.range(1,80).map((n,i) => this.point(n,i))
    this.t = 0

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

  animate(t) {
    this.graphics.clear()
    var color = 0xFFFFFF
    this.t += 1
    var freq = 1

    this.blocks.forEach((block,i) => {
      this.graphics.beginFill(color, 1)
      this.graphics.drawRect(block.x,
        50*Math.sin(freq*this.props.midi.get(1)/127*(this.t/4+i))+300, 5, 5)
    })

    this.graphics.interactive = true
    this.graphics.endFill()

    this.renderer.render(this.stage)
    this.renderer.backgroundColor = 0x00000
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
  midi: state.midi
})
export default connect(mapStateToProps, {
  control: control,
  noteUp: noteUp,
  noteDown: noteDown,
  sendRTC: sendRTC
})(Grid)
