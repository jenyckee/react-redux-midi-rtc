/* @flow */
import { Map } from 'immutable'
import { DATA } from './conductor.js'

// ------------------------------------
// Constants
// ------------------------------------
export const MIDI_OK = 'MIDI_OK'
export const MIDI_MESSAGE = 'MIDI_MESSAGE'
export const MIDI_OUT_NOTE_DOWN = 'MIDI_OUT_NOTE_DOWN'
export const MIDI_OUT_NOTE_UP = 'MIDI_OUT_NOTE_UP'
export const MIDI_CONTROL = 'MIDI_CONTROL'

// ------------------------------------
// Actions
// ------------------------------------

export function requestMIDI (value: object): Action {
  return {
    type: MIDI_OK,
    access: value
  }
}

export const asyncRequestMIDI = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    navigator.requestMIDIAccess({sysex: true})
      .then((midiAccess) => {
        midiAccess.inputs.forEach((entry) => {
          entry.onmidimessage = (event) => {
            dispatch(midiMessage(event))
          }
        })
        dispatch(requestMIDI(midiAccess))
      })
  }
}

export function midiMessage (event) {
  return {
    type: MIDI_MESSAGE,
    message: event.data
  }
}

export const actions = {
  requestMIDI
}

export function noteDown (note) {
  return {
    type: MIDI_OUT_NOTE_DOWN,
    message: note
  }
}

export function noteUp (note) {
  return {
    type: MIDI_OUT_NOTE_UP,
    message: note
  }
}

export function control (channel, value) {
  return {
    type: MIDI_CONTROL,
    message: [176, channel, value]
  }
}
// ------------------------------------
// Action Handlers
// ------------------------------------

const MIDI_MESSAGES = {
  noteON  : 144,
  noteOFF : 128,
  control : 176
}

const ACTION_HANDLERS = {
  [MIDI_OK]: (state: object, action: {access: Object}): Object => {
    return state.set('midiAccess', action.access)
  },
  [MIDI_MESSAGE]: (state, action) => {
    switch (action.message[0]) {
      case MIDI_MESSAGES.noteON:
        console.log(action.message)
        return state.set(action.message[1], action.message[2])
      case MIDI_MESSAGES.noteOFF:
        return state.delete(action.message[1])
      case MIDI_MESSAGES.control:
        return state.set(action.message[1], action.message[2])
      default:
        return state
    }
  },
  [MIDI_OUT_NOTE_DOWN]: (state, action) => {
    let midiAccess = state.get('midiAccess')
    var portID = '-2114470760'
    var noteDownMessage = [0x90, action.message.midi, 0x7f]    // note on, middle C, full velocity
    var output = midiAccess.outputs.get(portID)
    output.send(noteDownMessage)
    return state.set(action.message.midi, 120)
  },
  [MIDI_OUT_NOTE_UP]: (state, action) => {
    let midiAccess = state.get('midiAccess')
    var portID = '-2114470760'
    var noteUpMessage = [0x80, action.message.midi, 0x40]   // note on, middle C, full velocity
    var output = midiAccess.outputs.get(portID)
    output.send(noteUpMessage)
    return state.delete(action.message.midi)
  },
  [MIDI_CONTROL]: (state, action) => {
    let midiAccess = state.get('midiAccess')
    var portID = '-2114470760'
    var output = midiAccess.outputs.get(portID)
    output.send(action.message)
    return state.set(action.message[1], action.message[2])
  },
  [DATA]: (state, action) => {
    let midiAccess = state.get('midiAccess')
    var portID = '-2114470760'
    var output = midiAccess.outputs.get(portID)
    output.send(action.data)
    return state.set(action.data[1], 120)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Map({})
export default function midiReducer (state: object = initialState, action: Action): object {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
