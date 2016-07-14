import { combineReducers } from 'redux'
// import { routerReducer as router } from 'react-router-redux'
import midi from '../modules/midi'
import conductor from '../modules/conductor'
import router from '../modules/RouterReducer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    midi,
    conductor,
    router,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
