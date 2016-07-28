import Peer from 'peerjs'
import Immutable from 'immutable'

// ------------------------------------
// Constants
// ------------------------------------
export const CONNECT    = 'CONNECT'
export const CONNECTED  = 'CONNECTED'
export const SEND       = 'SEND'
export const OPEN       = 'OPEN'
export const EMIT       = 'EMIT'
export const INIT       = 'INIT'
export const DATA       = 'DATA'
export const ERROR      = 'ERROR'
// ------------------------------------
// Actions
// ------------------------------------
export function connectRTC (c) {
  return {
    type: CONNECT,
    peerId: c
  }
}

export function connectedRTC (c) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      c.on('data', (data) => dispatch(dataRTC(data)))
      dispatch({
        type: CONNECTED,
        peerId: c.peer
      })
      resolve()
    })
  }
}

export function openRTC (id) {
  console.log('OPEN', id)
  return {
    type: OPEN,
    connectionId: id
  }
}

export function initRTC (apiKey, debugLevel) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      let c = new Peer({
        key: apiKey,
        debug: debugLevel
      }).on('connection', (c) => dispatch(connectedRTC(c)))
        .on('error', dispatch(errorRTC(error)))
        .on('open', (id) => {
          dispatch(openRTC(id))
          resolve(c)
        })
      dispatch({ type: 'INIT', connection: c })
    })
  }
}

export function errorRTC (error) {
  return {
    type: ERROR,
    data: error
  }
}

export function dataRTC (data) {
  return {
    type: DATA,
    data: data
  }
}

export function sendRTC (message, id) {
  return {
    type: SEND,
    message: message
  }
}

export function emitRTC (message) {
  console.log('emitting :', message)
  return {
    type: EMIT,
    message: message
  }
}

function error (message) {
  console.error(message)
}

export const actions = {
  connectRTC,
  openRTC,
  sendRTC,
  emitRTC
}

function eachActiveConnection (state, fn) {
  var actives = state.get('peers')
  var checkedIds = {}

  actives.forEach(function(peerId, index) {
    if (!checkedIds[peerId]) {
      var conns = state.get('connection').connections[peerId]
      conns.forEach(fn)
    }
    checkedIds[peerId] = 1
  })
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [DATA]: (state, action) => {
    console.log('data',action)
    return state
  },
  [INIT]: (state, action) => {
    return state.set('connection', action.connection)
  },
  [SEND]: (state, action) => {
    eachActiveConnection(state, function(c) {
      c.send(action.message)
    })
    return state
  },
  [EMIT]: (state, action) => {
    eachActiveConnection(state, function(c) {
      c.send(action.message)
    })
    return state
  },
  [OPEN]: (state, action) => {
    return state.set('connectionId', action.connectionId)
  },
  [CONNECT]: (state, action) => {
    if (!state.get('peers').get(action.peerId)) {
      let c = state.get('connection').connect(action.peerId, {
          label: 'midi',
          serialization: 'json',
          metadata: {message: 'midi_control'}
        })
      return state.set('peers', state.get('peers').push(action.peerId))
    } else
    return state
  },
  [CONNECTED]: (state, action) => {
    if (!state.get('peers').find(v => v == action.peerId)) {
      let c = state.get('connection').connect(action.peerId, {
          label: 'midi',
          serialization: 'json',
          metadata: {message: 'midi_control'}
        })
      return state.set('peers', state.get('peers').push(action.peerId))
    } else
    return state
  }
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = Immutable.Map({
    connectionId: '',
    connection: null,
    peers: Immutable.List(),
  })
export default function conductorReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
