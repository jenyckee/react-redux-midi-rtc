import PIXI from 'pixi.js'
import _ from 'underscore'
import Slider from './Slider.js'

export default class renderer {
  constructor(canvas, state) {
    let w = window.innerWidth,
        h = window.innerHeight

    this.canvas = canvas

    this.renderer = new PIXI.CanvasRenderer(w, h, {
      view: canvas,
      antialias: true,
      resolution: window.devicePixelRatio
    })
    this.renderer.backgroundColor = 0x000000

    this.resize(canvas)
    window.addEventListener('resize', _.debounce(() => this.resize(canvas), 300))
    this.setup(state)
    this.render(state)
  }

  resize(canvas) {
    let w = window.innerWidth,
        h = window.innerHeight
    this.canvas.style.width = w + "px"
    this.canvas.style.height = h + "px"
  }

  // draw(state) {
  //   var white = 0xFFFFFF,
  //       black = 0x000000,
  //       red = 0xFF0000,
  //       color = state.midi.get(60) ? red : white
  //
  //   // this.graphics.beginFill(color, 1)
  //   // this.graphics.drawRect(0,0, 50, 50)
  //   //
  //   // this.graphics.interactive = true
  //   // this.graphics.endFill()
  //   //
  // }



  setup(state) {
    this.stage = new PIXI.Container()

    this.stage.width = window.width
    this.stage.height = window.height

    let slider = new Slider(this.stage, state)
  }

  update(state, stage) {
    this.stage.children.forEach(c => c.midiState = state)
    window.cancelAnimationFrame(this.requestId)
    this.render(state)
  }

  render(state) {
    // this.draw(state)
    this.renderer.render(this.stage)
    this.requestId = requestAnimationFrame(() => this.render(state))
  }
}
