import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { noteDown, noteUp } from '../redux/modules/midi'

export class Note extends React.Component<void, Props, void> {
  classList () {
    return classnames({
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
      <div className={this.classList()} onMouseDown={this.noteDown.bind(this)} onMouseUp={this.noteUp.bind(this)}></div>
    )
  }
}

const mapStateToProps = (state) => ({
  noteDown: state.noteDown,
  noteUp: state.noteUp
})
export default connect(mapStateToProps, {
  noteDown: noteDown,
  noteUp: noteUp
})(Note)
