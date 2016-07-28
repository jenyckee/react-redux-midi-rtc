import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import midi from '../modules/midi'
import dataChannel from '../modules/dataChannel'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    midi,
    dataChannel,
    router,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
