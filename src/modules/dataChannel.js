import Peer from 'peerjs'
import Immutable from 'immutable'

// ------------------------------------
// Constants
// ------------------------------------
export const CONNECT    = 'CONNECT'
export const CONNECTION  = 'CONNECTION'
export const SEND       = 'SEND'
export const OPEN       = 'OPEN'
export const EMIT       = 'EMIT'
export const INIT       = 'INIT'
export const DATA       = 'DATA'
export const ERROR      = 'ERROR'
// ------------------------------------
// Actions
// ------------------------------------
export function connectRTC (peerId) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      let state = getState().dataChannel

      if (!state.get('peers').get(peerId)) {
        state.get('connection').connect(peerId, {
            label: 'midi',
            serialization: 'json'
          })
      }
      dispatch({
        type: CONNECT,
        peerId: peerId
      })
      resolve()
    })
  }
}

export function connectionRTC (c) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      let state = getState().dataChannel
      if (!state.get('peers').find(v => v == c.peer)) {
        state.get('connection').connect(c.peer, {
            label: 'midi',
            serialization: 'json'
          })
      }
      c.on('data', (data) => dispatch(dataRTC(data, c.peer)))
      dispatch({
        type: CONNECTION,
        peerId: c.peer
      })
      resolve()
    })
  }
}

export function openRTC (id) {
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
      }).on('connection', (c) => dispatch(connectionRTC(c)))
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

export function dataRTC (data, peer) {
  return {
    type: DATA,
    data: data,
    sender: peer
  }
}

export function sendRTC (message, id) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      eachActiveConnection(getState().dataChannel, function(c) {
        c.send(message)
      })
    })
  }
}

export function emitRTC (message, sender) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      eachActiveConnection(getState().dataChannel, function(c) {
        c.send(message)
      })
    })
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
    return state
  },
  [INIT]: (state, action) => {
    return state.set('connection', action.connection)
  },
  [SEND]: (state, action) => {
    return state
  },
  [EMIT]: (state, action) => {
    return state
  },
  [OPEN]: (state, action) => {
    return state.set('connectionId', action.connectionId)
  },
  [CONNECT]: (state, action) => {
    return state.set('peers', state.get('peers').push(action.peerId))
  },
  [CONNECTION]: (state, action) => {
    return state.set('peers', state.get('peers').push(action.peerId))
  }
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = Immutable.Map({
    connectionId: '',
    connection: null,
    peers: Immutable.List(),
    scenesrc: ""
  })
export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
