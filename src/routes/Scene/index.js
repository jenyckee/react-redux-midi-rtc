import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'scene/:id',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Player = require('./containers/SceneContainer').default
      const reducer = require('../../modules/dataChannel').default

      /*  Add the reducer to the store on key 'player'  */
      injectReducer(store, { key: 'scene', reducer })

      /*  Return getComponent   */
      cb(null, Player)

    /* Webpack named bundle   */
  }, 'scene')
  }
})
