

export default class Slider {

  constructor(stage, state, note) {
    this.graphics = new PIXI.Graphics()

    this.graphics.on('mousedown', () => this.noteDown(60))
    this.graphics.on('mouseup', () => this.noteUp(60))
    this.graphics.on('touchstart', () => this.noteDown(60))
    this.graphics.on('touchend', () => this.noteUp(60))
    this.graphics.on('mouseout', () => this.noteUp(60))

    this.graphics.midiState = state

    stage.addChild(this.graphics)
    this.render()
  }

  noteDown(note) {
    this.graphics.midiState.noteDown(60)// note)
    this.graphics.midiState.sendRTC([0x90, 60, 0x7f])
  }

  noteUp(note) {
    this.graphics.midiState.noteUp(60)// note)
    this.graphics.midiState.sendRTC([0x80, 60, 0x7f])
  }

  render() {
    var white = 0xFFFFFF,
        black = 0x000000,
        red = 0xFF0000,
        color = this.graphics.midiState.midi.get(60) ? red : white

    console.log(this.graphics.midiState.midi.get(60))

    this.graphics.beginFill(color, 1)
    this.graphics.drawRect(0,0, 50, 50)

    this.graphics.interactive = true
    this.graphics.endFill()
  }
}
