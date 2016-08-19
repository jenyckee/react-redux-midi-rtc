import React from 'react'
import Note from '../Note'
import Knob from '../Knob'
import Grid from '../Grid'
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
    let sbase = 'D#',
        sscale = 'minor',
        scale = this.scale(sbase, sscale),
        ocatve = scale.push(scale[0]+12),
        octavesc1 = scale.map((midi) => <Note note={midi} key={midi}/>),
        octavesc2 = scale.map((midi) => <Note note={midi+5} key={midi}/>),
        octavesc3 = scale.map((midi) => <Note note={midi+9} key={midi}/>),
        octavesc4 = scale.map((midi) => <Note note={midi+14} key={midi}/>),
        octavesc5 = scale.map((midi) => <Note note={midi+19} key={midi}/>)

    return (
      <div>
        <h1>{sbase + ' ' + sscale}</h1>
        <Grid />
        <div>{octavesc5}</div>
        <div>{octavesc4}</div>
        <div>{octavesc3}</div>
        <div>{octavesc2}</div>
        <div>{octavesc1}</div>
        <Knob channel={1}/>
        <Knob channel={2}/>

      </div>
    )
  }
}

export default Player
