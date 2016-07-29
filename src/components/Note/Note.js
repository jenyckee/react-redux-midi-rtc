import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { noteDown, noteUp } from '../../modules/midi'
import { sendRTC, emitRTC } from '../../modules/dataChannel'
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
    this.props.sendRTC([0x90, this.props.note.midi(), 0x7f], this.props.connectionId)
    this.props.noteDown(this.props.note.midi())
  }
  noteUp () {
    this.props.emitRTC([0x80, this.props.note.midi(), 0x7f], this.props.connectionId)
    this.props.noteUp(this.props.note.midi())
  }
  render () {
    return (
      <div className={this.classList()} onMouseDown={this.noteDown.bind(this)} onMouseUp={this.noteUp.bind(this)}></div>
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    midi: state.midi,
    connectionId: state.dataChannel.get('connectionId')
  })
}
export default connect(mapStateToProps, {
  sendRTC: sendRTC,
  emitRTC: emitRTC,
  noteDown: noteDown,
  noteUp: noteUp,
})(Note)
