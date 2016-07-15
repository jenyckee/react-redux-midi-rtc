import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { noteDown, noteUp } from '../../modules/midi'
import classes from './Note.scss'
import cx from 'classnames'

export class Note extends React.Component<void, Props, void> {
  classList () {
    return cx({
      note: true,
      played: this.props.midiState.get(this.props.note.midi())
    })
  }
  noteDown () {
    this.props.noteDown({ midi: this.props.note.midi() })
  }
  noteUp () {
    this.props.noteUp({ midi: this.props.note.midi() })
  }
  render () {
    return (
      <div onMouseDown={this.noteDown.bind(this)} onMouseUp={this.noteUp.bind(this)}></div>
    )
  }
}

const mapStateToProps = (state) => ({
  midi: state.midi
})
export default connect(mapStateToProps, {
  noteDown: noteDown,
  noteUp: noteUp
})(Note)
