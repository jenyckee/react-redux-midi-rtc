
import Peer from 'peerjs'

// ------------------------------------
// Constants
// ------------------------------------
export const CONNECT = 'CONNECT'
export const SEND = 'SEND'
export const OPEN = 'OPEN'
export const EMIT = 'EMIT'
export const INIT = 'INIT'

// ------------------------------------
// Actions
// ------------------------------------
export function connectRTC (id) {
  return {
    type: CONNECT,
    peerId: id
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
      }).on('connection', connectRTC)
        .on('error', error)
        .on('open', (id) => dispatch(openRTC(id)))

      dispatch({ type: 'INIT', connection: c })

      resolve()
    })
  }
}

export function sendRTC (message, id) {
  return {
    type: SEND,
    message: message
  }
}

export function emitRTC (message) {
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

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [INIT]: (state, action) => {
    console.log(state)

    return { ... state, connection: action.connection }
  },
  [SEND]: (state, action) => {
    return state
  },
  [EMIT]: (state, action) => {
    state.peers.forEach((peerId) => {
      let peer = state.connection[peerId]
    })
    return state
  },
  [OPEN]: (state, action) => {
    console.log(state)
    return { ... state, connectionId: action.connectionId }
  },
  [CONNECT]: (state, action) => {
    console.log('connection', action)
    return { ... state, peers: state.peers.push(action.peerId) }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------


const initialState = { connectionId: "Not connected", connection: null, peers: [] }
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
