import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { noteDown, noteUp } from '../../modules/midi'
import { emitRTC } from '../../modules/conductor'
import classes from './Note.scss'
import cx from 'classnames'

export class Note extends React.Component<void, Props, void> {


  classList () {
    return cx({
      [classes.note]: true,
      [classes.played]: this.props.midi.get(this.props.note.midi())
    })
  }
  noteDown () {
    this.props.emitRTC([0x90, 60, 0x7f])
    this.props.noteDown(60)
  }
  noteUp () {
    this.props.emitRTC([0x80, 60, 0x7f])
    this.props.noteUp(60)
  }
  render () {
    console.log(classes)
    return (
      <div className={this.classList()} onMouseDown={this.noteDown.bind(this)} onMouseUp={this.noteUp.bind(this)}></div>
    )
  }
}

const mapStateToProps = (state) => ({
  midi: state.midi
})
export default connect(mapStateToProps, {
  emitRTC: emitRTC,
  noteDown: noteDown,
  noteUp: noteUp,
})(Note)
