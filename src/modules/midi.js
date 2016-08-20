/* @flow */
import { Map } from 'immutable'
import { DATA, emitRTC } from './dataChannel.js'

// ------------------------------------
// Constants
// ------------------------------------
export const MIDI_OPEN = 'MIDI_OPEN'
export const MIDI_MESSAGE = 'MIDI_MESSAGE'
export const MIDI_OUT_NOTE_DOWN = 'MIDI_OUT_NOTE_DOWN'
export const MIDI_OUT_NOTE_UP = 'MIDI_OUT_NOTE_UP'
export const MIDI_CONTROL = 'MIDI_CONTROL'

// ------------------------------------
// Actions
// ------------------------------------

export function requestMIDI (value: object): Action {
  return {
    type: MIDI_OPEN,
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
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      dispatch(emitRTC(event.data))
      dispatch({
        type: MIDI_MESSAGE,
        message: event.data
      })
      resolve()
    })
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
  [MIDI_OPEN]: (state: object, action: {access: Object}): Object => {
    return state.set('midiAccess', action.access)
  },
  [MIDI_MESSAGE]: (state, action) => {
    switch (action.message[0]) {
      case MIDI_MESSAGES.noteON:
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
    return state.set(action.message, 120)
  },
  [MIDI_OUT_NOTE_UP]: (state, action) => {
    return state.delete(action.message)
  },
  [MIDI_CONTROL]: (state, action) => {
    return state.set(action.message[1], action.message[2])
  },
  [DATA]: (state, action) => {
    switch (action.data[0]) {
      case MIDI_MESSAGES.noteON:
        return state.set(action.data[1], action.data[2])
      case MIDI_MESSAGES.noteOFF:
        return state.delete(action.data[1])
      case MIDI_MESSAGES.control:
        return state.set(action.data[1], action.data[2])
      default:
        return state
      }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Map({ 'outPortId': '766085233'})
export default function midiReducer (state: object = initialState, action: Action): object {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
