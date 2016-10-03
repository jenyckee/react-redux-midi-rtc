function draw() {
  let r = new Note(60)
  r.draw = function () {
    if (this.isPlayed) {
      rectangle(0,0,10,10, 0xff00000)

    } else {
    }
  }
  r.onClick(this.play)
}
