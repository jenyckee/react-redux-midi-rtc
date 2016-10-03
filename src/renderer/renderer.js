import PIXI from 'pixi.js'
import _ from 'underscore'

function draw(state, env, t) {
  var white = 0xFFFFFF,
      black = 0x000000,
      red = 0xFF0000,
      color = state.midi.get(60) ? red : white

  env.graphics.beginFill(color, 1)
  env.graphics.drawRect(0,0, 50, 50)

  env.graphics.interactive = true
  env.graphics.endFill()

  env.renderer.render(env.stage)
  env.renderer.backgroundColor = black
}

function setup(env) {
  let graphics = new PIXI.Graphics(),
      stage = new PIXI.Container()

  stage.width = window.width
  stage.height = window.height
  stage.addChild(graphics)
  graphics.on('mousedown', () => env.noteDown(60))
  graphics.on('mouseup', () => env.noteUp(60))
  graphics.on('touchstart', () => env.noteDown(60))
  graphics.on('touchend', () => env.noteUp(60))
  graphics.on('mouseout', () => env.noteUp(60))

  return _.extend(env, { graphics: graphics, stage: stage })
}

function animate(state, env) {
  let loop = (t) => {
    draw(state, setup(env), t)
    requestAnimationFrame(loop)
  }
  loop()
}

function renderer(canvas) {
  let w = window.innerWidth,
      h = window.innerHeight,
      renderer = new PIXI.CanvasRenderer(w, h, {
        view: canvas,
        antialias: true,
        resolution: window.devicePixelRatio
      })
  resize(canvas)
  window.addEventListener('resize', _.debounce(() => resize(canvas), 300))
  return (state, noteDown, noteUp) => animate(state, { renderer: renderer, noteDown: noteDown, noteUp: noteUp })
}

function resize(canvas) {
  let w = window.innerWidth,
      h = window.innerHeight
  canvas.style.width = w + "px"
  canvas.style.height = h + "px"
}

export default renderer
