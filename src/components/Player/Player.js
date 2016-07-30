import React from 'react'
import Note from '../Note'
import Knob from '../Knob'
import teoria from 'teoria'

class Player extends React.Component {

  componentDidMount() {
    this.props.initRTC('bnon5rifq5dygb9', 3)
    .then(() => {
      this.props.connectRTC(this.props.routeParams.id)
    })
  }

  scale(base, scale) {
    let baseNote = teoria.note(base)
    return baseNote.scale(scale).notes().map(n => n.midi())
  }

  render () {
    let scale = this.scale('C', 'major'),
        ocatve = scale.push(scale[0]+12),
        octavesc1 = scale.map((midi) => <Note note={midi} key={midi}/>),
        octavesc2 = scale.map((midi) => <Note note={midi+5} key={midi}/>),
        octavesc3 = scale.map((midi) => <Note note={midi+9} key={midi}/>)

    return (
      <div>
        <div>{octavesc3}</div>
        <div>{octavesc2}</div>
        <div>{octavesc1}</div>
        <Knob />
      </div>
    )
  }
}

export default Player
