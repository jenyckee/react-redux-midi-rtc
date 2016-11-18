import PIXI from 'pixi.js'
import _ from 'underscore'

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

  draw(state) {
    var white = 0xFFFFFF,
        black = 0x000000,
        red = 0xFF0000,
        color = state.midi.get(60) ? red : white

    this.graphics.beginFill(color, 1)
    this.graphics.drawRect(0,0, 50, 50)

    this.graphics.interactive = true
    this.graphics.endFill()

    this.renderer.render(this.stage)
    this.renderer.backgroundColor = black
  }

  noteDown(state, note) {
    state.noteDown(60)// note)
    state.sendRTC([0x90, 60, 0x7f])
  }

  noteUp(state, note) {
    state.noteUp(60)// note)
    state.sendRTC([0x80, 60, 0x7f])
  }

  setup(state) {
    this.graphics = new PIXI.Graphics()
    this.stage = new PIXI.Container()

    this.stage.width = window.width
    this.stage.height = window.height
    this.stage.addChild(this.graphics)
    this.graphics.on('mousedown', () => this.noteDown(state, 60))
    this.graphics.on('mouseup', () => this.noteUp(state, 60))
    this.graphics.on('touchstart', () => this.noteDown(state, 60))
    this.graphics.on('touchend', () => this.noteUp(state, 60))
    this.graphics.on('mouseout', () => this.noteUp(state, 60))
  }

  update(state) {
    window.cancelAnimationFrame(this.requestId)
    this.render(state)
  }

  render(state) {
    this.draw(state)
    this.requestId = requestAnimationFrame(() => this.render(state))
  }

}
